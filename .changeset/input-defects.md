---
"@nodaste-lab/weft": minor
---

Fix the four input defects that contradict doctrine Weft already publishes (P2 of the input design system). Plain-CSS layer only; no React prop surface changes.

**Control height, at its cause.** `.weft-input`, `.weft-textarea` and `.weft-select` now take `height: var(--weft-control-h)` with no vertical padding, so the declared tier governs. They used to reach the tier through `min-height` while padding plus line-height pushed straight past it: 46.39px against a 44px token at marketing, 43.59px against 36px at compact. Only dense fitted, and only because its `pad-y` had been hand-tuned to 6px — which is how this stayed invisible at two tiers out of three. All three tiers now measure exactly, and an input, select, button and checkbox row sharing a toolbar have a height spread of 0.00px at every density. The textarea keeps padding and a floor: it is genuinely multi-line.

**Disabled and read-only are visible states.** The plain-CSS layer defined neither, so a disabled field rendered at opacity 1 with an unchanged background — pixel-identical to an editable one — while the React `Input` styled both. Disabled now dims to 0.55 with `cursor: not-allowed`; read-only keeps full text contrast and changes only its fill. Neither sets a border colour, because `.weft-input:disabled` weighs exactly as much as `.weft-input[aria-invalid="true"]` and is declared later. New token `--weft-control-fill-static` in all four palette blocks.

**The focus ring survives the page around it.** The ring is now delivered as an `outline` *and* a `box-shadow` with identical geometry, so nothing moves visually. One carrier alone was deletable: the global rule is `:where(…):focus-visible`, which weighs (0,1,0) — the same as any page's `.shadow { box-shadow: … }` — so an author rule declared later replaced the ring outright, with no error and no gate. Measured at 0 of 40 ring pixels painted, on the page and inside an injected panel iframe alike; now 20 of 40 under a class shadow, an inline shadow, and an author `outline: none` alike.

**Help and error text reach the field.** The plain-CSS layer cannot produce ARIA, so what ships is a markup convention — `id="<control-id>-hint"` / `-error`, listed in `aria-describedby` in reading order — enforced across the whole specimen page by `scripts/__tests__/input-specimens.node.mjs`, not demonstrated on two specimens. The React layer already wired the same relationship in `FormControl`.

**The required marker is text plus the attribute.** A bare `*` landed inside the accessible name as punctuation while `required` stayed false. It is now the word `required` with the attribute set, and the assertion checks both that no glyph is in the name and that the marker reads as a separate word — because the first fix produced "Retentionrequired".

Seventeen entries come out of `tests/contract/known-defects.ts`. No visual baseline moved, verified in the pinned Linux container.
