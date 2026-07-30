#!/usr/bin/env bash
# review-gate.sh — the double-clean gate.
#
# A PR becomes ready-for-merge only when BOTH reviewers are clean:
#   1. the repo's own gates pass, and the builder (Claude) has no open findings
#   2. Codex returns VERDICT: CLEAN on the exact commit under review
#
# Anything less exits non-zero and the PR stays a draft. The verdict is bound to
# a commit SHA on purpose: a clean review of an older commit says nothing about
# the code you are about to merge.
#
# Usage
#   scripts/review-gate.sh --base main [--gates "<cmd>"] [--goal "<text>"]
#                          [--pr <n>] [--mark-ready] [--max-diff-bytes N]
#
#   --base            branch/ref to diff against (default: main)
#   --gates           gate command; default is this repo's set
#   --goal            what the change is meant to accomplish (feeds the review)
#   --pr              PR number, needed for --mark-ready and evidence comments
#   --mark-ready      on double-clean, flip the PR out of draft and post evidence
#   --max-diff-bytes  cap the diff sent to Codex (default 200000); truncation is
#                     reported to Codex and in the log rather than hidden
#
# Exit codes
#   0  double-clean (and PR marked ready if asked)
#   1  setup problem, dirty tree, or repo gates failed — nothing was reviewed
#   2  Codex reported issues — fix, commit, re-run
#   3  Codex produced no parseable verdict — treated as NOT clean, never as pass
set -euo pipefail
# Review inputs contain the full private diff; keep every artefact owner-only.
umask 077

BASE="main"
GOAL=""
PR=""
MARK_READY=0
MAX_DIFF_BYTES=200000
GATES='npm test --silent && npm run verify --silent && npm run props --silent && npm run test:props --silent && npm run tokens --silent && node scripts/check-raw-colors.mjs && node scripts/check-pure-token-file.mjs && npm run test:css-contract --silent && npm run test:contrast --silent && npm run test:template-contract --silent && npm run build --silent && npm run check:exports --silent'
WRAPPER="$HOME/.agents/skills/codex-review-partner/scripts/run-review.sh"

while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="$2"; shift 2 ;;
    --gates) GATES="$2"; shift 2 ;;
    --goal) GOAL="$2"; shift 2 ;;
    --pr) PR="$2"; shift 2 ;;
    --mark-ready) MARK_READY=1; shift ;;
    --max-diff-bytes) MAX_DIFF_BYTES="$2"; shift 2 ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

# ── 1. The review must describe a commit, not a moving target ────────────────
if [ -n "$(git status --porcelain)" ]; then
  echo "review-gate: working tree is dirty." >&2
  echo "  Commit first — a review has to describe an immutable commit, or its" >&2
  echo "  verdict cannot be bound to what gets merged." >&2
  git status --short >&2
  exit 1
fi
SHA="$(git rev-parse HEAD)"
SHORT="$(git rev-parse --short HEAD)"

[ -x "$WRAPPER" ] || { echo "review-gate: codex wrapper not found at $WRAPPER" >&2; exit 1; }
git rev-parse --verify "$BASE" >/dev/null 2>&1 || { echo "review-gate: base '$BASE' not found" >&2; exit 1; }

LOGDIR="${TMPDIR:-/tmp}/review-gate/$(basename "$ROOT")"
# Review inputs embed the full private diff, so the log path must be private —
# and that has to be ENFORCED, not attempted. A pre-existing world-writable
# /tmp/review-gate would otherwise expose the diff and invite symlink tampering.
mkdir -p "$LOGDIR"
for dir in "$(dirname "$LOGDIR")" "$LOGDIR"; do
  chmod 700 "$dir" 2>/dev/null || true
  owner="$(stat -f '%u' "$dir" 2>/dev/null || stat -c '%u' "$dir" 2>/dev/null || echo '')"
  mode="$(stat -f '%OLp' "$dir" 2>/dev/null || stat -c '%a' "$dir" 2>/dev/null || echo '')"
  if [ "$owner" != "$(id -u)" ] || [ "$mode" != "700" ]; then
    echo "review-gate: refusing to write review artefacts to $dir" >&2
    echo "  owner=$owner (need $(id -u)), mode=$mode (need 700). The review input" >&2
    echo "  contains the full private diff; remove or fix that directory and retry." >&2
    exit 1
  fi
  if [ -L "$dir" ]; then
    echo "review-gate: $dir is a symlink — refusing to follow it" >&2; exit 1
  fi
done
ROUND=$(( $(find "$LOGDIR" -name "${SHORT}-round*.md" 2>/dev/null | wc -l | tr -d ' ') + 1 ))
OUT="$LOGDIR/${SHORT}-round${ROUND}.md"
INPUT="$LOGDIR/${SHORT}-input${ROUND}.md"

say "review-gate · $BRANCH @ $SHORT · round $ROUND"

# ── 2. Repo gates. If these fail nothing is reviewed — fix first. ────────────
say "[1/3] repo gates"
GATELOG="$LOGDIR/${SHORT}-gates${ROUND}.log"
if bash -c "$GATES" >"$GATELOG" 2>&1; then
  GATE_RESULT="PASS"
  echo "  gates: PASS"
else
  echo "  gates: FAIL — see $GATELOG" >&2
  tail -25 "$GATELOG" >&2
  exit 1
fi

# ── 3. Build the review input from the real diff ─────────────────────────────
say "[2/3] codex implementation-review"
FILES="$(git diff --name-only "$BASE...HEAD")"
[ -n "$FILES" ] || { echo "review-gate: no changes vs $BASE — nothing to review" >&2; exit 1; }
DIFF_FULL="$(git diff "$BASE...HEAD")"
DIFF_BYTES=${#DIFF_FULL}
TRUNC_NOTE=""
if [ "$DIFF_BYTES" -gt "$MAX_DIFF_BYTES" ]; then
  DIFF_FULL="${DIFF_FULL:0:$MAX_DIFF_BYTES}"
  TRUNC_NOTE="NOTE: diff truncated to ${MAX_DIFF_BYTES} of ${DIFF_BYTES} bytes. Say so in your review if the truncation prevents a judgement; do not guess about unseen code."
fi

{
  echo "Review this implementation."
  echo
  echo "Repo: $ROOT"
  echo "Branch: $BRANCH"
  echo "Commit under review: $SHA"
  echo "Base: $BASE"
  echo "Review round: $ROUND"
  echo
  echo "Goal: ${GOAL:-see the commit messages and diff below}"
  echo
  echo "Checks already run and passing:"
  echo '```'
  echo "$GATES"
  echo '```'
  echo "Result: $GATE_RESULT (full log withheld; re-runnable above)"
  echo
  echo "Repo constraints that findings must respect (from AGENTS.md):"
  cat <<'EOF'
- css/weft.css is a pure token file: no @media, no component selectors. It is
  injected verbatim into sandboxed panel iframes by a consumer.
- Token-only colors. Raw hex/rgb/hsl live only in css/ token files; everything
  in src/ reads var(--weft-*).
- manifest.json is lockstep with src/ui/*.tsx: sorted, paths match, showcase
  entries carry semver, designSystemVersion equals package.json version.
- props-snapshot.json is a committed contract. A breaking prop-surface change
  requires a MAJOR component bump; additive changes require a bump too.
- The published tarball must ship src/ (a consumer deep-imports it).
- Byte-stability matters: never reformat css/ as a side effect.
EOF
  echo
  echo "Changed files:"
  git diff --stat "$BASE...HEAD"
  echo
  echo "Commits:"
  git log --oneline "$BASE...HEAD"
  echo
  [ -n "$TRUNC_NOTE" ] && { echo "$TRUNC_NOTE"; echo; }
  echo "Diff:"
  echo '```diff'
  echo "$DIFF_FULL"
  echo '```'
  cat <<'EOF'

Review for: correctness, missed callsites, edge cases, test gaps, accessibility
regressions, and violations of the repo constraints above. Rank findings by
severity and cite file:line.

Be a reviewer, not a rubber stamp: if the change is fine, say so plainly rather
than inventing work. Equally, do not withhold a real problem because the gates
pass — the gates are necessary, not sufficient.

Finish your response with exactly one of these as the FINAL line, alone:

VERDICT: CLEAN
VERDICT: ISSUES

Use CLEAN only if you would merge this as-is. If anything you found should block
a merge, use ISSUES. Nits you would not block on: still CLEAN, but list them.
EOF
} > "$INPUT"

# macOS has no coreutils `timeout`; use gtimeout when present, otherwise run
# unbounded. The review-partner skill requires >=300s, so never impose a short one.
TIMEOUT_BIN=""
if command -v timeout >/dev/null 2>&1; then TIMEOUT_BIN="timeout"
elif command -v gtimeout >/dev/null 2>&1; then TIMEOUT_BIN="gtimeout"
else echo "  note: no timeout binary; running codex unbounded"; fi

run_codex() {
  if [ -n "$TIMEOUT_BIN" ]; then
    "$TIMEOUT_BIN" 900 "$WRAPPER" --mode implementation-review --input "$INPUT" --cwd "$ROOT" --output "$OUT"
  else
    "$WRAPPER" --mode implementation-review --input "$INPUT" --cwd "$ROOT" --output "$OUT"
  fi
}
run_codex || { echo "review-gate: codex run failed (see $OUT)" >&2; exit 3; }

# ── 4. Parse the verdict. No verdict is never a pass. ────────────────────────
say "[3/3] verdict"
VERDICT="$(grep -oE '^VERDICT: (CLEAN|ISSUES)$' "$OUT" | tail -1 | awk '{print $2}' || true)"
echo "  review log: $OUT"

case "$VERDICT" in
  CLEAN)
    echo "  codex: CLEAN"
    echo "$SHA CLEAN round=$ROUND $(date -u +%FT%TZ)" > "$LOGDIR/${SHORT}.verdict"
    say "DOUBLE-CLEAN · gates PASS · codex CLEAN · $SHORT"
    if [ "$MARK_READY" = "1" ]; then
      [ -n "$PR" ] || { echo "review-gate: --mark-ready needs --pr <n>" >&2; exit 1; }
      HEAD_SHA="$(gh pr view "$PR" --json headRefOid -q .headRefOid)"
      if [ "$HEAD_SHA" != "$SHA" ]; then
        echo "review-gate: refusing to mark ready — PR head ($HEAD_SHA) is not the reviewed commit ($SHA). Push, then re-run." >&2
        exit 1
      fi
      {
        echo "## Review gate: double-clean"
        echo
        echo "| | |"
        echo "|---|---|"
        echo "| Commit | \`$SHA\` |"
        echo "| Repo gates | PASS |"
        echo "| Codex verdict | CLEAN (round $ROUND) |"
        echo
        echo "Codex reviewed this exact commit in \`implementation-review\` mode and"
        echo "would merge it as-is; the repo gate set passes on the same commit."
        echo "Rounds before clean: $((ROUND - 1)) with findings."
        echo
        echo "<details><summary>Final review output</summary>"
        echo
        sed 's/^/> /' "$OUT"
        echo
        echo "</details>"
      } > "$LOGDIR/${SHORT}-evidence.md"
      gh pr comment "$PR" --body-file "$LOGDIR/${SHORT}-evidence.md"
      gh pr ready "$PR"
      echo "  PR #$PR marked ready, evidence posted."
    else
      echo "  (not marking ready — pass --mark-ready --pr <n> to flip it)"
    fi
    exit 0
    ;;
  ISSUES)
    echo "  codex: ISSUES — PR stays draft"
    echo "$SHA ISSUES round=$ROUND $(date -u +%FT%TZ)" > "$LOGDIR/${SHORT}.verdict"
    say "Findings to triage (fix, or rebut with file/line evidence):"
    sed -n '/VERDICT: ISSUES/q;p' "$OUT" | tail -60
    exit 2
    ;;
  *)
    echo "  codex: no parseable verdict — treating as NOT clean" >&2
    echo "$SHA NO_VERDICT round=$ROUND $(date -u +%FT%TZ)" > "$LOGDIR/${SHORT}.verdict"
    exit 3
    ;;
esac
