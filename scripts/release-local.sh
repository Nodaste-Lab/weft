#!/usr/bin/env bash
# Local release — the Release workflow, run by a maintainer.
#
# GitHub Actions are off for this repository (owner decision, 2026-09-01), so
# nothing opens a Version Packages PR, publishes, or tags on a push to main.
# This script is that job, step for step, on the maintainer's machine:
#
#   1. preflight   — on main, clean tree, main == origin/main, changesets present
#   2. gates       — the release job's battery, on the exact commit released
#   3. version     — `npm run release:version` (changeset version + mirror sync),
#                    committed as "Version Packages (x.y.z)"
#   4. tag + push  — vX.Y.Z on that commit; main and the tag pushed; a GitHub
#                    release created from the CHANGELOG entry
#   5. publish     — `npm publish` to GitHub Packages, only with --publish
#
# Usage:
#   scripts/release-local.sh [--publish] [--dry-run] [--skip-gates] [--check]
#   scripts/release-local.sh --publish-only            # retry step 5 for HEAD's version
#
#   --check        preflight only (exit 0 = releasable), used by the tests
#   --dry-run      preflight + gates + a printed plan; nothing is written
#   --skip-gates   trust a review-gate run on this exact commit (it ran them)
#   --publish      run step 5 after tagging
#   --publish-only skip 1–4 and publish the version already on HEAD
#
# Consumers: DocT and plan-reviewer vendor css/ by commit sha, so the tag is
# what they need; only Heddle (exact-pinned package) needs the publish.
# Publishing needs write:packages on npm.pkg.github.com — a fine-grained PAT
# in ~/.npmrc (`//npm.pkg.github.com/:_authToken=…`) or NODE_AUTH_TOKEN. The
# script checks `npm whoami` against the registry before it publishes and
# never prints the token.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REGISTRY="https://npm.pkg.github.com"
BRANCH="main"
PUBLISH=0; DRY=0; SKIP_GATES=0; CHECK=0; PUBLISH_ONLY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --publish) PUBLISH=1 ;;
    --dry-run) DRY=1 ;;
    --skip-gates) SKIP_GATES=1 ;;
    --check) CHECK=1 ;;
    --publish-only) PUBLISH_ONLY=1; PUBLISH=1 ;;
    --branch) BRANCH="$2"; shift ;;   # dry-runs on a branch other than main
    -h|--help) sed -n '2,32p' "$0"; exit 0 ;;
    *) echo "release-local: unknown flag $1" >&2; exit 64 ;;
  esac
  shift
done

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
die() { echo "release-local: $*" >&2; exit 1; }

version_of() { node -p "require('./package.json').version"; }

# ── 1. preflight ────────────────────────────────────────────────────────────
preflight() {
  say "[1/5] preflight"
  local cur; cur="$(git rev-parse --abbrev-ref HEAD)"
  [ "$cur" = "$BRANCH" ] || die "on '$cur'; releases are cut from '$BRANCH'"
  [ -z "$(git status --porcelain)" ] || die "dirty tree — a release describes an immutable commit"
  if git rev-parse --verify -q "origin/$BRANCH" >/dev/null; then
    git fetch -q origin "$BRANCH" || die "cannot fetch origin/$BRANCH"
    [ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/$BRANCH")" ] \
      || die "HEAD is not origin/$BRANCH — pull or push first, so the tag lands on what everyone has"
  fi
  if [ "$PUBLISH_ONLY" = 0 ]; then
    local pending
    pending="$(ls .changeset/*.md 2>/dev/null | grep -v README.md || true)"
    [ -n "$pending" ] || die "no changesets in .changeset/ — nothing to release (npx changeset)"
    echo "  changesets:"; for f in $pending; do echo "    $f"; done
  fi
  command -v gh >/dev/null || die "gh is required (tag push + GitHub release)"
  echo "  ok: $cur @ $(git rev-parse --short HEAD), clean, in sync"
}

# ── 2. gates — the release job's battery, in its order ──────────────────────
gates() {
  say "[2/5] gates (release job battery)"
  if [ "$SKIP_GATES" = 1 ]; then echo "  skipped (--skip-gates): a review-gate run on this commit stands in"; return; fi
  local steps=(
    "npm run verify" "npm run props" "npm run tokens" "npm run test:props"
    "npm run test:css-contract" "npm run test:doctrine" "npm run test:contrast"
    "npm run test:template-contract" "npm run test:specimens" "npm run test:review-gate"
    "node scripts/check-pure-token-file.mjs" "node scripts/check-raw-colors.mjs"
    "npx vitest run" "npm run test:contract" "npm run build" "npm run test:packed"
    "npm run test:parity" "npm run test:reasons" "npm run test:types" "npm run check:exports"
  )
  local log; log="$(mktemp -t weft-release-gates)"
  for s in "${steps[@]}"; do
    printf '  %-45s' "$s"
    if bash -c "$s" >>"$log" 2>&1; then echo "PASS"; else echo "FAIL — see $log"; tail -25 "$log" >&2; exit 1; fi
  done
}

# ── 3. version ───────────────────────────────────────────────────────────────
version_step() {
  say "[3/5] version"
  local before; before="$(version_of)"
  if [ "$DRY" = 1 ]; then
    echo "  would run: npm run release:version (from $before), then commit 'Version Packages (<new>)'"; return
  fi
  npm run release:version >/dev/null
  # changeset version rewrites package.json only; the lockfile carries the
  # version twice and the Version Packages commits always moved it too.
  npm install --package-lock-only --ignore-scripts --no-audit --no-fund >/dev/null 2>&1     || die "could not refresh package-lock.json's version fields"
  NEW="$(version_of)"
  [ "$NEW" != "$before" ] || die "release:version left the version at $before — were the changesets consumed?"
  # The mirrors must agree before the commit; verify is the same check CI ran.
  npm run verify >/dev/null
  git add -A package.json package-lock.json CHANGELOG.md manifest.json props-snapshot.json tokens-snapshot.json .changeset
  git commit -q -m "Version Packages ($NEW)" -m "Cut locally by scripts/release-local.sh (Actions are off for this repository)."
  echo "  $before -> $NEW at $(git rev-parse --short HEAD)"
}

# ── 4. tag + push + release ──────────────────────────────────────────────────
tag_step() {
  say "[4/5] tag + push + GitHub release"
  local v; v="$(version_of)"; local tag="v$v"
  if [ "$DRY" = 1 ]; then echo "  would tag $tag, push $BRANCH and the tag, and create the release from CHANGELOG.md"; return; fi
  git rev-parse -q --verify "refs/tags/$tag" >/dev/null && die "tag $tag already exists"
  git tag -a "$tag" -m "$tag"
  git push -q origin "$BRANCH" "$tag"
  # Release notes: the CHANGELOG section for this version.
  local notes; notes="$(awk -v v="## $v" '$0==v{f=1;next} /^## /{if(f)exit} f' CHANGELOG.md)"
  gh release create "$tag" --title "$tag" --notes "${notes:-See CHANGELOG.md}" >/dev/null
  echo "  $tag pushed; release created"
}

# ── 5. publish (opt-in) ──────────────────────────────────────────────────────
publish_step() {
  say "[5/5] publish"
  [ "$PUBLISH" = 1 ] || { echo "  skipped (no --publish): DocT and plan-reviewer vendor by commit; publish when Heddle adopts"; return; }
  if [ "$DRY" = 1 ]; then echo "  would: npm whoami --registry=$REGISTRY && npm publish"; return; fi
  local who
  who="$(npm whoami --registry="$REGISTRY" 2>/dev/null)" \
    || die "not authenticated to $REGISTRY — put a PAT with write:packages in ~/.npmrc as //npm.pkg.github.com/:_authToken=… (or NODE_AUTH_TOKEN) and re-run with --publish-only"
  echo "  authenticated as $who"
  npm publish --registry="$REGISTRY" >/dev/null
  echo "  published @nodaste-lab/weft@$(version_of)"
}

preflight
[ "$CHECK" = 1 ] && exit 0
if [ "$PUBLISH_ONLY" = 1 ]; then publish_step; exit 0; fi
gates
version_step
tag_step
publish_step
say "done: @nodaste-lab/weft $(version_of)"
