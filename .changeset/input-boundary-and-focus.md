---
"@nodaste-lab/weft": minor
---

Make a field identifiable as a control, and keep a focused one out from under sticky chrome (P4 of the input design system).

**The boundary reaches 3:1 — in the plain-CSS layer.** A text input had no boundary meeting the WCAG 1.4.11 non-text contrast floor in either theme: border 1.30:1 light and 1.38:1 dark, with a fill identical to the surface behind it at 1.00:1. Neither cue identified the control. New tokens `--weft-control-border` and `--weft-control-fill`; every `.weft-*` control now measures 3.48–3.61:1 as painted, on paper, cream and card, in both themes, at all three densities, in default, hover, focus, invalid, invalid-and-focused and read-only.

**The React primitives are NOT covered by that, and this is a recorded parity gap rather than an oversight.** `Input` and its siblings paint from the flat shadcn bridge — `border-input` and `bg-input-background` — and `--input` / `--input-background` still map to `--weft-paper`, so a React field keeps the 1.30:1 hairline. Closing it is a two-token change in the bridge, but it moves the committed pixel baselines for every React form control and interacts with `dark:bg-input/30`, so it belongs with the layer-parity phase rather than here, where the phase's own file list is CSS-only. `scripts/__tests__/css-contract.node.mjs` records the gap so it cannot be forgotten: the assertion fails the day someone closes it without deleting the record. Disabled is exempt — the criterion exempts inactive components — and is instead held to rendering distinctly from an editable control.

**The border carries it and the fill is decorative, by measurement rather than preference.** Reaching 3:1 as a fill alone needs 45% ink over white, and at that fill the muted placeholder drops to 1.90:1 and fails text contrast — so the fill-without-border option heuristic 2 offers is not available in this palette. One border value covers both light surfaces.

**Hover no longer carries the boundary.** It used to deepen to `--weft-rule-strong` at 1.90:1, which is weaker than the new resting boundary — hover would have been removing a boundary rather than reinforcing one. Hover does not exist on touch and does not exist for a keyboard-first user (heuristic 3).

**`.weft-btn.is-ghost` takes the same border token** and deliberately not the field's wash: the border is what carries the floor, and a ghost button sits on coloured slabs where a translucent fill would let the slab through.

**Focus survives the chrome (SC 2.4.11).** A control scrolled to by an in-page navigation top-aligns, landing under a sticky header — measured at 99% covered, now 0%. The surface declares its chrome height in `--weft-sticky-chrome-h` and the component layer turns it into `scroll-padding-top`. The default is 0, so a panel iframe with no chrome is unaffected. The token is declared in its own bare `:root` block so a consumer's `:root` override wins on source order — under `:root, :root[data-palette="weft"]` it would have lost silently, which is how the first attempt failed.

Both changes were made inside the existing rules using longhands, per the two cascade traps this surface has already produced.

`--weft-control-fill-static` rises from 0.055 to 0.075 ink: once the resting fill stopped being opaque paper the two washes differed by about 5/255 and a read-only field stopped being distinguishable from an editable one.

The last boundary and focus entries come out of `tests/contract/known-defects.ts`; only the textarea floor remains. No visual baseline moved.
