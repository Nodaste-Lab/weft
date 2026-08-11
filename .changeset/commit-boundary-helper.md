---
"@nodaste-lab/weft": minor
---

The commit boundary is standard, and nothing more is claimed (weft#16, P6).

`useCommitBoundary` is a new opt-in hook that says **when** a field committed —
blur, Enter in a single-line control, or an explicit consumer save — as one
deduplicated transaction: `{ reason, sources }`. A pointer Save registered on
`pointerdown` suppresses the intervening blur and reports it in `sources`; a
keyboard Save is deliberately two transactions. Enter in a textarea, Escape,
input-method composition (including the confirming Enter), paste, programmatic
updates and native `form.reset()` are not boundaries and emit nothing.

The helper never evaluates validity, never announces an error, never writes the
value, and never touches submission state — asserted with spies over the
consumer's own callbacks, and every guard in the suite was verified by
reintroducing its violation. Nothing is wired into `Form`; `Form` gained no
behaviour. Heuristics 4, 5 and 6 ship as doctrine the consumer implements, with
worked examples in the design-system doc.

The input-layer parity record (`scripts/input-parity.json`, `npm run
test:parity`) opens with its first honest entry: the commit boundary is a
JavaScript behaviour with no plain-CSS counterpart, allowlisted with an owner
and an expiry that fails the gate the day it passes.
