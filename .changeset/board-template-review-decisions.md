---
"@nodaste-lab/weft": minor
---

Apply the review decisions taken on the rendered board designs, and retire the board-local provenance band.

**`weft-board` template 2.0.0 → 3.0.0 (breaking).** `.weft-board-drawer-prov` is removed. D8 decided the provenance band becomes a `Callout` variant, and `.weft-callout.is-band` has shipped since 0.3.0 — but the board-local class shipped alongside it, so removing it now is a breaking change to a published template rather than the free cleanup it would have been before release. Consumers using it move to `<div class="weft-callout is-band is-info">`. The template major carries the signal, as with `weft-board-check` in 0.5.0.

**Awaiting tier is yellow, not amber.** `.weft-tier-group.is-awaiting` tinted `--weft-warn`, which is an amber-700, so every tint of it read orange and sat too close to the blocked tier's red. It now uses `--weft-yellow-soft`, the only general-purpose yellow with a dark-theme variant, so the tier still follows the theme. `<TierGroup>` matches — the React and plain-CSS surfaces had diverged.

**`<TierGroup>` renders its own urgency dot.** The dot-tone pairing (blocked/stop, awaiting/warn, fyi/info) was documented and enforced for plain-CSS markup, but the React component rendered no dot and offered no slot for one, so the documented contract was unreachable from React. The dot is now derived from `urgency` rather than passed in, so the two surfaces cannot drift.

**Fill is a signal, not decoration (D3).** A filled `.weft-btn` belongs only to a blocked item's drawer, marked with the new `.weft-board-drawer.is-blocked`; awaiting and FYI drawers take a ghost primary with link secondaries. Additive.

**Dismiss slot takes the dismiss control.** Panel-header close buttons use `.weft-panel-header-dismiss` — a borderless 24px glyph — not `.weft-btn.is-ghost`, which drew a bordered box at full control height. Documentation and specimens only; the control already existed.

Also: one panel-header scale across the board and its drawer, a wrapped multi-line notice specimen, and the D5/D6 chip split shown correctly (Badge space chip beside a `SourcePill`). `npm run test:template-contract` now enforces one-primary-per-action-row, slot occupancy, tier ordering, and tier/dot pairing across all three published surfaces.
