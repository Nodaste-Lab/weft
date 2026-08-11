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
#                          [--wrapper <path>] [--constraints <file>]
#
#   --base            branch/ref to diff against (default: main)
#   --gates           gate command; default is this repo's set
#   --goal            what the change is meant to accomplish (feeds the review)
#   --pr              PR number, needed for --mark-ready and evidence comments
#   --mark-ready      on double-clean, flip the PR out of draft and post evidence
#   --max-diff-bytes  cap the diff sent to Codex (default 200000); truncation is
#                     reported to Codex and in the log rather than hidden
#   --wrapper         codex review-partner wrapper (env: REVIEW_GATE_WRAPPER)
#   --constraints     file of repo invariants to hand the reviewer; default is
#                     discovered (see resolve_constraints). An explicit path is
#                     operator intent; discovered paths must be regular files
#                     inside the repo, never symlinks.
#   --constraints-heading
#                     exact AGENTS.md heading holding the invariants, matched
#                     verbatim apart from emphasis and any closing '#' run
#                     (default: Invariants / Hard invariants / Repo invariants,
#                     which additionally tolerate a trailing dash/colon clause)
#
# Exit codes
#   0  double-clean (and PR marked ready if asked)
#   1  setup problem, dirty tree, or repo gates failed — nothing was reviewed
#   2  Codex reported issues — fix, commit, re-run
#   3  Codex produced no parseable verdict — treated as NOT clean, never as pass
set -euo pipefail
# Review inputs contain the full private diff; keep every artefact owner-only.
umask 077

# Where this script lives, resolved before any cd. Helper scripts are siblings of
# it, not of the repo under review — those are different directories whenever the
# gate is invoked from outside the checkout it is reviewing.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

BASE="main"
GOAL=""
PR=""
MARK_READY=0
MAX_DIFF_BYTES=200000
GATES=""   # empty means "discover what this repo has" (see build_default_gates)
CONSTRAINTS=""  # empty means "discover" (see resolve_constraints)
HEADING=""      # empty means "the conventional invariants headings"
# Overridable because the wrapper lives outside the repo, at a path that differs
# per machine and per skill-install root. Flag beats env beats default.
WRAPPER="${REVIEW_GATE_WRAPPER:-$HOME/.agents/skills/codex-review-partner/scripts/run-review.sh}"

while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="$2"; shift 2 ;;
    --gates) GATES="$2"; shift 2 ;;
    --goal) GOAL="$2"; shift 2 ;;
    --pr) PR="$2"; shift 2 ;;
    --mark-ready) MARK_READY=1; shift ;;
    --max-diff-bytes) MAX_DIFF_BYTES="$2"; shift 2 ;;
    --wrapper) WRAPPER="$2"; shift 2 ;;
    --constraints) CONSTRAINTS="$2"; shift 2 ;;
    --constraints-heading) HEADING="$2"; shift 2 ;;
    # Print the header block by structure, not by line number: a hardcoded range
    # silently starts lying the first time this header grows.
    -h|--help) awk 'NR>1 && /^#/ { sub(/^# ?/,""); print; next } NR>1 { exit }' "$0"; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

# The gate battery is discovered, not hardcoded: this script is repo-agnostic and
# a missing npm script must not be mistaken for a failing gate. Candidates run in
# dependency order — build before any check that inspects build output. Anything
# the repo does not define is skipped, and anything it adds later is picked up
# automatically. Override wholesale with --gates.
build_default_gates() {
  local candidates="test verify props test:props tokens test:css-contract test:contrast test:template-contract test:specimens test:review-gate test:contract build test:packed test:parity check:exports"
  local parts=""
  local s
  for s in $candidates; do
    if node -e "const p=require('./package.json');process.exit((p.scripts||{})['$s']?0:1)" 2>/dev/null; then
      parts="${parts:+$parts && }npm run $s --silent"
    fi
  done
  local f
  for f in scripts/check-raw-colors.mjs scripts/check-pure-token-file.mjs; do
    [ -f "$f" ] && parts="${parts:+$parts && }node $f"
  done
  printf '%s' "$parts"
}

# The reviewer is told which invariants a finding must respect. Those are repo
# property, not script property: hardcoding one repo's rules here means every
# other repo silently gets reviewed against constraints that do not apply to it —
# a wrong review that still exits 0. So resolve them, and when there is nothing
# to resolve, say nothing rather than substituting someone else's rules.
#
# Order: --constraints > .review-gate/constraints.md > the invariants section of
# AGENTS.md > none. Sets CONSTRAINTS_TEXT and CONSTRAINTS_SRC (used for the
# provenance line, so the prompt never misstates where the rules came from).
CONSTRAINTS_TEXT=""
CONSTRAINTS_SRC=""
# Every finding on this file so far has been the same bug: the review proceeds
# with fewer constraints than intended and still reports CLEAN. The causes keep
# differing — a symlink, a parser miss, a swallowed exit code, a subshell `exit` —
# so the defence is to stop treating "no constraints" as a default that any code
# path can fall into. It must be stated: exactly one path may set this to `none`,
# and that path is "this repo has no constraints source at all". Everything else
# aborts. The assertion after resolve_constraints enforces it, so a future path
# that forgets fails loudly instead of quietly reviewing less.
CONSTRAINTS_STATE="unset"

# Auto-discovered inputs are attacker-controllable. Both [ -f ] and cat follow
# symlinks, so a PR that commits .review-gate/constraints.md (or AGENTS.md) as a
# link to ~/.ssh/id_rsa, .env, or any readable file gets that file copied into the
# review input and shipped to an external reviewer — on a run that still exits 0.
# This is the read-side twin of ensure_regular(): regular file only, and the
# resolved path must stay inside the repo, which also catches a symlinked PARENT
# directory. Explicitly passed --constraints is operator intent and is exempt;
# discovery is not.
# Absent is a normal negative (fall through to the next source). Present but
# unsafe is FATAL, not a warning: degrading silently to "no constraints" would
# hand the reviewer a weaker review than the operator thinks they asked for, and
# still exit 0 — the same fail-open shape as the bug this guard exists to close.
# Every other refusal in this script exits 1; so does this one.
safe_repo_file() {
  local f="$1" dir phys
  if [ -L "$f" ]; then
    echo "review-gate: $f is a symlink — refusing to read it into the review input." >&2
    echo "  Auto-discovered constraint files must be regular files inside the repo." >&2
    echo "  Pass --constraints <path> if you really mean to read through a link." >&2
    exit 1
  fi
  [ -e "$f" ] || return 1
  if [ ! -f "$f" ]; then
    echo "review-gate: $f is not a regular file — refusing to read it." >&2
    exit 1
  fi
  dir="$(dirname "$f")"
  phys="$(cd "$dir" 2>/dev/null && pwd -P)" || return 1
  case "$phys/" in
    "$ROOT_PHYS"/*) return 0 ;;
    *)
      echo "review-gate: $f resolves outside the repository ($phys) — refusing to read it." >&2
      exit 1
      ;;
  esac
}

# Section extraction lives in scripts/extract-constraints.mjs, not here.
#
# It was an inline awk scanner for three review rounds, and each round found
# another CommonMark rule it had approximated: naive fence toggling, then nested
# fences, then closing fences carrying an info string, then indented ATX headings.
# Every miss had the same shape — section silently truncated or not found, a short
# or empty constraints block, and a CLEAN verdict anyway. Patching rule-by-rule
# was losing to the spec, so it moved to a real line scanner with direct unit
# tests. See that file for the supported subset and what is deliberately out of it.
#
# Prerequisites are checked HERE, in the parent shell, and never inside a function
# that runs in a command substitution.
#
# `exit` inside "$(...)" terminates the SUBSHELL, not the script. These two checks
# used to live in extract_section, which is only ever called as "$(extract_section
# ...)", so their `exit 1` became an ordinary status 1 by the time the caller saw
# it — indistinguishable from the scanner's "no such section", which the caller
# tolerates. A missing node or a missing sibling scanner therefore resumed the
# review with no constraints and reached CLEAN. Anything that must abort the run
# has to be evaluated outside the substitution.
#
# Resolved against THIS script's directory, not the repo under review: the two
# differ whenever the gate runs from outside the checkout it is reviewing, and a
# copy of this script in another repo must find its own scanner.
SCANNER="$SCRIPT_DIR/extract-constraints.mjs"
# Must match SENTINEL in that file. The scanner's own tests assert the constant;
# the harness tests assert this pairing end-to-end.
SCANNER_SENTINEL='#__REVIEW_GATE_CONSTRAINTS__:'

require_scanner() {
  command -v node >/dev/null 2>&1 || {
    echo "review-gate: node is required to read invariants out of AGENTS.md." >&2
    echo "  Install node, or pass --constraints <file> to skip extraction." >&2
    exit 1
  }
  [ -f "$SCANNER" ] || {
    echo "review-gate: $SCANNER is missing — it ships alongside this script." >&2
    echo "  Copy it too, or pass --constraints <file> to skip extraction." >&2
    exit 1
  }
}

# Pure invocation: no exits, so its status is only ever the scanner's own.
# 0 = section found, 1 = no such section, >1 = the scanner itself failed.
run_scanner() {
  if [ -n "${2:-}" ]; then
    node "$SCANNER" "$1" --heading "$2"
  else
    node "$SCANNER" "$1"
  fi
}

resolve_constraints() {
  if [ -n "$CONSTRAINTS" ]; then
    [ -f "$CONSTRAINTS" ] || { echo "review-gate: --constraints file not found: $CONSTRAINTS" >&2; exit 1; }
    CONSTRAINTS_TEXT="$(cat "$CONSTRAINTS")"
    CONSTRAINTS_SRC="$CONSTRAINTS"
    [ -n "$CONSTRAINTS_TEXT" ] || { echo "review-gate: --constraints file is empty: $CONSTRAINTS" >&2; exit 1; }
    CONSTRAINTS_STATE="found"
    return
  fi
  if safe_repo_file .review-gate/constraints.md; then
    CONSTRAINTS_TEXT="$(cat .review-gate/constraints.md)"
    if [ -n "$CONSTRAINTS_TEXT" ]; then
      CONSTRAINTS_SRC=".review-gate/constraints.md"
      CONSTRAINTS_STATE="found"
      return
    fi
    echo "review-gate: .review-gate/constraints.md is empty — it exists to carry rules." >&2
    echo "  Remove it, or fill it in; an empty rule file is not the same as no rules." >&2
    exit 1
  fi
  if safe_repo_file AGENTS.md; then
    # Prerequisites first, in this shell — see require_scanner. Then the scanner's
    # exit codes, which are load-bearing: 1 is "no such section", a normal miss,
    # and anything else is a real failure. `if` supplies the errexit exemption so
    # the status can be captured rather than killing the shell.
    require_scanner
    # The scanner's TRAILER is authoritative, not its exit status. A status cannot
    # separate "no matching section" from "that script has a syntax error" or "an
    # exception escaped" — node exits 1 for all of them — so trusting the status
    # let a broken scanner read as a benign miss. Same rule this gate applies to
    # Codex: no parseable result is never a pass. The status is captured only to
    # quote back in the error.
    local rc=0 raw="" trailer=""
    if raw="$(run_scanner AGENTS.md "$HEADING")"; then rc=0; else rc=$?; fi
    trailer="$(printf '%s\n' "$raw" | tail -1)"
    case "$trailer" in
      "$SCANNER_SENTINEL FOUND")
        CONSTRAINTS_TEXT="$(printf '%s\n' "$raw" | sed '$d')"
        if [ -z "$CONSTRAINTS_TEXT" ]; then
          echo "review-gate: the constraints scanner reported FOUND with an empty body." >&2
          echo "  Refusing to review with constraints it could not actually produce." >&2
          exit 1
        fi
        CONSTRAINTS_SRC="AGENTS.md § $HEADING_LABEL"
        CONSTRAINTS_STATE="found"
        return
        ;;
      "$SCANNER_SENTINEL NONE")
        CONSTRAINTS_TEXT=""
        ;;
      *)
        echo "review-gate: the constraints scanner produced no parseable result (exit $rc)." >&2
        echo "  Expected a final line of '$SCANNER_SENTINEL FOUND' or '$SCANNER_SENTINEL NONE'." >&2
        echo "  A crashed or half-finished scanner is not the same as a repo with no rules;" >&2
        echo "  refusing to review rather than review without them." >&2
        echo "  Fix the scanner, or pass --constraints <file> to bypass extraction." >&2
        exit 1
        ;;
    esac
  fi
  # The one benign route to an absent constraints block: no source exists here.
  CONSTRAINTS_TEXT=""
  CONSTRAINTS_SRC=""
  CONSTRAINTS_STATE="none"
}

# Belt to resolve_constraints' braces. If a future path returns without stating an
# outcome, or states one its variables contradict, that is a bug in this script
# and must not become a quietly weaker review.
assert_constraints_resolved() {
  case "$CONSTRAINTS_STATE" in
    found)
      [ -n "$CONSTRAINTS_TEXT" ] && [ -n "$CONSTRAINTS_SRC" ] && return 0
      echo "review-gate: internal error — constraints reported found but are empty." >&2
      ;;
    none)
      [ -z "$CONSTRAINTS_TEXT" ] && return 0
      echo "review-gate: internal error — constraints reported absent but are set." >&2
      ;;
    *)
      echo "review-gate: internal error — constraint resolution did not state an outcome." >&2
      ;;
  esac
  echo "  Refusing to review rather than review with unknown constraints." >&2
  exit 1
}

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
# Physical (symlink-resolved) root, so safe_repo_file compares like with like.
ROOT_PHYS="$(pwd -P)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# Which AGENTS.md heading holds the invariants. --constraints-heading names one
# exactly; the default accepts the few conventional spellings, matched exactly
# after normalization rather than by substring.
# An operator-supplied heading is an exact string, compared as a literal by the
# extractor — never interpolated into a pattern, which once let "C++ rules" match
# "## C rules". The default set lives in extract-constraints.mjs so there is one
# copy of it.
if [ -n "$HEADING" ]; then
  HEADING_LABEL="$HEADING"
else
  HEADING_LABEL="invariants"
fi

resolve_constraints
assert_constraints_resolved

if [ -z "$GATES" ]; then
  GATES="$(build_default_gates)"
  [ -n "$GATES" ] || { echo "review-gate: found no gates to run; pass --gates explicitly." >&2; exit 1; }
fi

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

[ -x "$WRAPPER" ] || {
  echo "review-gate: codex wrapper not found at $WRAPPER" >&2
  echo "  Point at it with --wrapper <path> or REVIEW_GATE_WRAPPER=<path>." >&2
  exit 1
}
git rev-parse --verify "$BASE" >/dev/null 2>&1 || { echo "review-gate: base '$BASE' not found" >&2; exit 1; }

# Everything --mark-ready needs is checked HERE, before the gates and before a
# review that can run 15 minutes. Discovering a missing --pr or an unauthenticated
# gh at the end throws away the whole round for a typo.
if [ "$MARK_READY" = "1" ]; then
  [ -n "$PR" ] || { echo "review-gate: --mark-ready needs --pr <n>" >&2; exit 1; }
  command -v gh >/dev/null 2>&1 || { echo "review-gate: --mark-ready needs the gh CLI on PATH" >&2; exit 1; }
  # No global `gh auth status` here: it reports on every known host and account,
  # so a stale GitHub Enterprise login unrelated to this repo would block a PR
  # that gh can actually read. The call below is the repo-scoped check that
  # matters — it fails on bad auth, bad PR number, and no access alike.
  PR_HEAD="$(gh pr view "$PR" --json headRefOid -q .headRefOid 2>/dev/null)" || {
    echo "review-gate: cannot read PR #$PR — check the number, this repo's remote, and gh auth for this host." >&2
    exit 1
  }
  # Advisory only. Pushing while the review runs is a legitimate flow, so the
  # authoritative head check stays at mark time — this just surfaces the common
  # "forgot to push" case in one second instead of after the review.
  [ "$PR_HEAD" = "$SHA" ] || echo "  note: PR #$PR head ($PR_HEAD) is not HEAD yet — push before this finishes, or marking ready will refuse."
fi

# Artefact storage. Review inputs embed the full private diff, so this deliberately
# avoids /tmp entirely: no shared directory means no symlink swap, no check/create
# race, and no value in predicting filenames. The repo's own git dir is already
# private to whoever can read the repo, and is never packaged or committed.
# (Use --git-dir, not ".git": in a worktree that path is a file, not a directory.)
GITDIR="$(cd "$(git rev-parse --git-dir)" && pwd)"
LOGDIR="$GITDIR/review-gate"

if [ -L "$LOGDIR" ]; then
  echo "review-gate: $LOGDIR is a symlink — refusing to follow it." >&2
  exit 1
fi
mkdir -p "$LOGDIR"
chmod 700 "$LOGDIR" 2>/dev/null || true

# Never write through a pre-existing symlink or special file.
ensure_regular() {
  # -L is tested independently of -e: a DANGLING symlink fails -e, so gating the
  # whole check on -e would skip precisely the case this guard exists for — a
  # planted link whose target does not exist yet, which a redirection then creates.
  if [ -L "$1" ] || { [ -e "$1" ] && [ ! -f "$1" ]; }; then
    echo "review-gate: $1 exists and is not a regular file — refusing to write through it." >&2
    exit 1
  fi
}

ROUND=$(( $(find "$LOGDIR" -name "${SHORT}-round*.md" 2>/dev/null | wc -l | tr -d ' ') + 1 ))
OUT="$LOGDIR/${SHORT}-round${ROUND}.md"
INPUT="$LOGDIR/${SHORT}-input${ROUND}.md"
ensure_regular "$OUT"
ensure_regular "$INPUT"

say "review-gate · $BRANCH @ $SHORT · round $ROUND"

# ── 2. Repo gates. If these fail nothing is reviewed — fix first. ────────────
say "[1/3] repo gates"
GATELOG="$LOGDIR/${SHORT}-gates${ROUND}.log"
ensure_regular "$GATELOG"
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
  if [ -n "$CONSTRAINTS_TEXT" ]; then
    echo "Repo constraints that findings must respect (from $CONSTRAINTS_SRC):"
    echo "$CONSTRAINTS_TEXT"
    echo
  fi
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
    ensure_regular "$LOGDIR/${SHORT}.verdict"
    echo "$SHA CLEAN round=$ROUND $(date -u +%FT%TZ)" > "$LOGDIR/${SHORT}.verdict"
    say "DOUBLE-CLEAN · gates PASS · codex CLEAN · $SHORT"
    if [ "$MARK_READY" = "1" ]; then
      [ -n "$PR" ] || { echo "review-gate: --mark-ready needs --pr <n>" >&2; exit 1; }
      HEAD_SHA="$(gh pr view "$PR" --json headRefOid -q .headRefOid)"
      if [ "$HEAD_SHA" != "$SHA" ]; then
        echo "review-gate: refusing to mark ready — PR head ($HEAD_SHA) is not the reviewed commit ($SHA). Push, then re-run." >&2
        exit 1
      fi
      EVIDENCE="$LOGDIR/${SHORT}-evidence.md"
      ensure_regular "$EVIDENCE"
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
      } > "$EVIDENCE"
      gh pr comment "$PR" --body-file "$EVIDENCE"
      gh pr ready "$PR"
      echo "  PR #$PR marked ready, evidence posted."
    else
      echo "  (not marking ready — pass --mark-ready --pr <n> to flip it)"
    fi
    exit 0
    ;;
  ISSUES)
    echo "  codex: ISSUES — PR stays draft"
    ensure_regular "$LOGDIR/${SHORT}.verdict"
    echo "$SHA ISSUES round=$ROUND $(date -u +%FT%TZ)" > "$LOGDIR/${SHORT}.verdict"
    say "Findings to triage (fix, or rebut with file/line evidence):"
    sed -n '/VERDICT: ISSUES/q;p' "$OUT" | tail -60
    exit 2
    ;;
  *)
    echo "  codex: no parseable verdict — treating as NOT clean" >&2
    ensure_regular "$LOGDIR/${SHORT}.verdict"
    echo "$SHA NO_VERDICT round=$ROUND $(date -u +%FT%TZ)" > "$LOGDIR/${SHORT}.verdict"
    exit 3
    ;;
esac
