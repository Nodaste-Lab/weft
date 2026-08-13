---
"@nodaste-lab/weft": minor
---

P7 — complete the input surface (weft#16). Nothing is left for a consumer to
hand-roll.

**New in both layers:** search as a stated pattern (`SearchField` /
`.weft-search` — hidden label, currentColor glyphs, a named clear that appears
only with content, never submits, and rides the commit boundary); switch and
slider as styled **native** inputs (`.weft-switch` 40×24 bare, `.weft-slider`
with token thumb — keyboard, drag, min/max/step, RTL and serialization are the
browser's own, the unchecked switch serializes as absent, and read-only is
asserted unsupported in both layers); resting tiers as modifiers
(`.is-underline` / `variant="underline"`, `.is-low` / `variant="low"` — Input
1.1.0 → 1.2.0, additive).

**The choice row takes its own height:** `--weft-choice-row-h` (32px) and
`--weft-choice-gap` (12px) put stacked rows exactly 44px apart by
construction; `.weft-board-check` is retired for the canonical row and its
stem joins the deprecated-class gate.

**Quiet-by-default is enforced:** the five sanctioned visibility reasons (`sequence` added at version 2 by owner call) ship
as `@nodaste-lab/weft/tooling/visibility-reasons` (frozen list, predicate,
version, 16-case conformance fixture — one list, two repositories, no shared
CI job), Weft's own surfaces declare their reasons in
`scripts/visibility-declarations.json`, and the gate fails on a missing or
unknown one. No reason prop exists on any primitive.

**Parity is a matrix with a failing build:** seventeen capability cells in
`scripts/input-parity.json` — fourteen at parity, two allowlisted gaps with an
owner and an expiry (commit boundary, search clear action), and RangeBounds as
a documented divergence. `test:parity` fails on an unrecorded capability, a
fourth status, a dangling reference, or a passed expiry.
