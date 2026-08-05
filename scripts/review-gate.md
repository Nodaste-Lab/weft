# The double-clean gate

A PR is marked ready for merge only when **two independent reviewers are both
clean**: the builder (Claude, plus this repo's gates) and Codex. Either one
holding a finding keeps the PR a draft.

Enforced by `scripts/review-gate.sh`. The prose below explains why it is shaped
this way; the script is the part that actually blocks.

## The loop

1. **Build.** Claude implements one phase and runs the repo gate set until green.
2. **Commit.** The gate refuses to run on a dirty tree — a review has to describe
   an immutable commit, or its verdict cannot be bound to what gets merged.
3. **Review.** `review-gate.sh` runs the gates, builds a review input from the
   real `git diff <base>...HEAD`, and runs Codex in `implementation-review` mode.
4. **Triage.** For each finding Claude either **fixes** it or **rebuts** it with
   file/line evidence. A rebuttal is written down, never a silent dismissal.
5. **Repeat** from step 1 with the fixes and the rebuttals stated in `--goal`.
6. **Ready.** On double-clean, `--mark-ready --pr <n>` posts the evidence and
   flips the PR out of draft.

```bash
# after committing a phase
./scripts/review-gate.sh --base main --goal "P1: promote the status dot (D13)"

# when both are clean and the branch is pushed
./scripts/review-gate.sh --base main --pr 42 --mark-ready \
  --goal "P1: promote the status dot (D13). Round 3: all prior findings fixed."
```

## Exit codes

| Code | Meaning | What to do |
|---|---|---|
| 0 | Double-clean | Ready to mark |
| 1 | Dirty tree, setup/preflight problem, or **repo gates failed** | Fix; nothing was reviewed |
| 2 | Codex reported issues | Fix or rebut, commit, re-run |
| 3 | Codex ran but produced no parseable verdict | Treated as **not** clean |

## Why it is built this way

**The verdict is bound to a commit SHA.** A clean review of an earlier commit
says nothing about the code you are about to merge. `--mark-ready` re-checks that
the PR head still equals the reviewed commit and refuses otherwise.

**No verdict is never a pass.** A crashed or rambling review exits 3. The gate
fails closed; the only way to 0 is an explicit `VERDICT: CLEAN`.

**Codex is asked for a machine-readable verdict.** The review-partner templates
do not define one, so the input requires exactly `VERDICT: CLEAN` or
`VERDICT: ISSUES` as the final line. Without that the gate is prose, not a gate.

**The gate battery is discovered, not hardcoded.** The script probes
`package.json` for a known set of gate scripts and runs the ones this repo
actually defines, in dependency order (build before anything that inspects build
output). A gate the repo has not defined is skipped rather than mistaken for a
failure, and one added later is picked up with no edit here. `--gates` overrides
the lot.

**Gates run before the review, and a failure skips it.** Sending Codex a change
that does not pass its own repo's checks wastes a review round on findings the
gates already know about.

**Repo constraints are handed to the reviewer, and they are the repo's own.**
Findings have to respect the invariants a change could break silently, so the
input carries them. They are resolved, never hardcoded, in this order:

1. `--constraints <file>`
2. `.review-gate/constraints.md`
3. the invariants section of `AGENTS.md` — the heading whose normalized text is
   exactly `Invariants`, `Hard invariants`, or `Repo invariants` (override with
   `--constraints-heading`), up to the next heading of the same or higher level
4. nothing — the block is omitted

**Discovered files are attacker-controllable; explicit ones are not.** A PR can
commit `.review-gate/constraints.md` or `AGENTS.md` as a symlink, and both
`[ -f ]` and `cat` follow symlinks — so the gate would copy `~/.ssh/id_rsa`,
`.env`, or any readable file into the review input and ship it to an external
reviewer, on a run that still exits `0`. Discovered paths must therefore be
regular files that resolve inside the repository, which also catches a symlinked
parent directory. Violations are **fatal**, not warnings: silently continuing
with no constraints would hand the reviewer a weaker review than the operator
believes they asked for, which is the same fail-open shape as the bug itself.
A path passed explicitly to `--constraints` is operator intent and is exempt.

**Section extraction is a real parser, in `scripts/extract-constraints.mjs`.**
It was an inline awk scanner for three review rounds, and each round found
another CommonMark rule it had approximated:

| Round | Approximation | Effect |
|---|---|---|
| 1 | substring heading match | `## Why the invariant policy exists` beat `## Hard invariants` |
| 1 | no fence tracking | a `##` inside a fence ended the section |
| 2 | naive fence toggling | a nested shorter fence read as the close |
| 2 | heading interpolated into an ERE | `C++ rules` matched `## C rules` |
| 3 | closing fence allowed an info string | ` ```bash ` inside a fence ended it |
| 3 | column-zero headings only | an indented `   ## Hard invariants` found nothing |

Every one of them omitted or mis-selected rules and still produced `CLEAN`.
Patching rule-by-rule was losing to the spec, so the scanner moved to Node where
it is a line scanner with direct unit tests — a case costs three lines instead of
a review round. It handles ATX headings (0–3 spaces of indent, level-governed
boundaries, closing `#` sequences) and fenced code blocks (backtick and tilde,
run length, indent, and the rule that a closing fence takes no info string).

**Setext headings are deliberately unsupported.** A file that underlines its
headings with `===` or `---` yields no match, which is the safe direction — no
block rather than the wrong block — and is recoverable with `--constraints`.

**"No such section" and "the scanner broke" are different outcomes.** The scanner
exits 1 for a genuine miss and 2 for unusable input; the caller distinguishes
them, and anything above 1 aborts the run. Collapsing the two — which one `|| true`
did — resumed the review without the repo's rules and still reached `CLEAN`.

**Absent constraints is a stated outcome, not a default.** Every finding against
this harness has been the same defect wearing a different hat: the review proceeds
with fewer constraints than intended and still reports `CLEAN`. A symlinked file,
six parser approximations, a swallowed exit code, and an `exit` trapped in a
command substitution all produced it. Point fixes kept missing the next one, so
the invariant is now explicit: `resolve_constraints` must set `CONSTRAINTS_STATE`
to `found` or `none`, exactly one path may choose `none` (this repo has no
constraints source at all), and `assert_constraints_resolved` aborts if the state
is unset or contradicts the variables. A future path that forgets fails loudly
instead of quietly reviewing less.

**Nothing that must abort the run may be evaluated inside `$(...)`.** `exit` in a
command substitution ends the subshell, so `exit 1` from a prerequisite check
arrived at the caller as plain status 1 — indistinguishable from the tolerated
"no such section", which let a missing `node` or a missing sibling scanner sail
through. Prerequisites live in `require_scanner`, called from the parent shell;
`run_scanner` is a pure invocation whose status is only ever the scanner's own.

**`--constraints-heading` is exact; the built-in defaults are lenient.** The two
use different comparisons on purpose. An operator-supplied heading is matched
verbatim apart from emphasis and the closing `#` sequence, so `Security: strict`
matches `## Security: strict` and `Security` alone does not. The built-in aliases
additionally drop a trailing `— clause` / `- clause` / `: clause`, which is
appropriate for a guess and wrong for a string someone typed. Applying the lenient
form to both sides is what once made a verbatim-copied heading return nothing.

In this repo that resolves to `AGENTS.md` § *Hard invariants*, so the reviewer
gets the live text rather than a paraphrase that drifts. The last case is the
important one: a script that hardcodes one repo's rules hands them to every other
repo it runs in, and a review against constraints that do not apply still exits
`0`. Saying nothing is correct; substituting someone else's rules is not.

**The reviewer is told the gates are necessary but not sufficient.** Otherwise a
green suite reads as permission to rubber-stamp.

## Rebuttals

Codex is a reviewer, not an oracle. When a finding is wrong or out of scope, the
answer is a rebuttal with evidence — the file and line that disproves it, or the
test that already covers it — recorded in the next round's `--goal` so the
disagreement is visible rather than buried. If the reviewer is right about the
letter of a stated goal, tighten the goal or the code; do not quietly narrow the
claim.

**Everything `--mark-ready` needs is checked before the review, not after.** A
missing `--pr`, an absent `gh`, or an unreadable PR number now fails in about a
second. Finding a typo after a full gate battery and a review that can run
fifteen minutes throws away the whole round. The preflight deliberately does not
call `gh auth status`: that reports on every known host and account, so a stale
GitHub Enterprise login unrelated to this repo would block a PR `gh` can read
perfectly well. `gh pr view` is the repo-scoped check, and it already fails on
bad auth, bad number, and no access alike.

**The gate has its own tests, and CI runs them.** `npm run test:review-gate`
builds throwaway git repos, runs the real script against a stub wrapper, and
asserts on the review input it generates — the artefact that actually reaches an
external reviewer. It is a step in `ci.yml` and a member of the discovered gate
battery, so the gate also runs it on itself. A suite that only ever runs when
someone remembers to run it is not a gate.

Every defect it pins failed *open* — symlink disclosure, wrong-section selection,
fenced-`##` truncation, nested-fence truncation, and regex-metacharacter heading
matching all exited `0` with a `CLEAN` verdict. That is the signature to watch
for here: this harness's failure mode is not crashing, it is quietly reviewing
less than it claims to.

## Running it in another repo

Two things are machine- or repo-specific and both are overridable:

```bash
# the wrapper lives outside the repo; flag beats env beats default
export REVIEW_GATE_WRAPPER=~/.agents/skills/codex-review-partner/scripts/run-review.sh
./scripts/review-gate.sh --base main --constraints .review-gate/constraints.md

# or let it discover, naming a heading that is not one of the conventional three
./scripts/review-gate.sh --base main --constraints-heading "House rules"
```

`scripts/extract-constraints.mjs` is a sibling of `review-gate.sh` and is
resolved against the script's own directory, not the repo under review — copy
both, or pass `--constraints` and the scanner is never invoked.

Gate discovery is still the npm-shaped part: `build_default_gates()` probes
`package.json` for a known set of script names and also picks up this repo's two
`scripts/check-*.mjs` helpers. In a non-Node repo it finds nothing and exits 1
telling you to pass `--gates` — an honest failure rather than a silent pass, but
it does mean `--gates` is mandatory there. Making discovery config-driven is the
remaining piece of real portability and has not been done.

## What this does not cover

- **Visual baselines.** `npm run test:visual` needs the pinned Linux container
  (`scripts/update-visual-baselines.sh`); it is not in the default gate string.
  Run it separately when a change moves rendered output, and review each moved
  baseline rather than blanket-updating.
- **Downstream consumers.** A green gate here says nothing about Heddle. Pin and
  run its suites before releasing anything that moves a shipped primitive.
- **Concurrency.** The gate assumes one writer on the branch. Two agents editing
  the same worktree will produce a diff neither of them fully authored, and the
  review will be attributed to whoever ran it.

## Scope

This harness is deliberately separate from the design-system work it reviews.
Keeping them in one PR meant five consecutive review rounds spent on the harness
while the design-system change — clean since round 3 — sat in draft behind it. A
review tool that blocks the thing it reviews is the wrong shape.

## Provenance

Validated end-to-end on a scratch repo before first use, across three rounds: a
seeded bug (dropped final element) plus two issues Codex found unprompted
(sparse-array holes, and `length` not being snapshotted the way `reduce` does)
→ `VERDICT: ISSUES`, exit 2 each time; after fixes and tests → `VERDICT: CLEAN`,
exit 0. Two portability bugs surfaced in that dry run and are fixed: macOS has no
coreutils `timeout` (falls back to `gtimeout`, then unbounded), and bash 3.2
rejects empty-array expansion under `set -u`.
