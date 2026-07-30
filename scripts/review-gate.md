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
| 1 | Dirty tree, setup problem, or **repo gates failed** | Fix; nothing was reviewed |
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

**Repo constraints are handed to the reviewer.** The input includes the
`AGENTS.md` invariants (pure token file, token-only colours, manifest lockstep,
prop-surface contracts, tarball ships `src/`, byte-stability) so findings respect
them instead of proposing changes that would break a consumer.

**The reviewer is told the gates are necessary but not sufficient.** Otherwise a
green suite reads as permission to rubber-stamp.

## Rebuttals

Codex is a reviewer, not an oracle. When a finding is wrong or out of scope, the
answer is a rebuttal with evidence — the file and line that disproves it, or the
test that already covers it — recorded in the next round's `--goal` so the
disagreement is visible rather than buried. If the reviewer is right about the
letter of a stated goal, tighten the goal or the code; do not quietly narrow the
claim.

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
