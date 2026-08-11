---
"@nodaste-lab/weft": minor
---

**P5 — one sizing model, both layers (the compose model).** Density sets the
tier; size steps within it. `--weft-control-h-sm` carries the decided per-tier
step map — 44→36, 36→32, 34→32, chosen so D4's 32px board buttons render
unchanged at dense — alongside `--weft-textarea-min-h` (96/80/72: the textarea
floor finally tracks its tier, closing the last recorded defect from the P1
harness) and `--weft-search-pad-end` (36/32/30, document B's settled trailing
reserve). All additive `:root` tokens.

Plain CSS gains the size modifier a sandboxed panel could never express:
`.weft-input.is-sm`, `.weft-select.is-sm` (left edge only — the chevron
reserve stays), `.weft-btn.is-sm`. React's `Button` and `SelectTrigger`
default/sm heights now resolve through the same tokens (old fixed pixels
remain as `var()` fallbacks, so rendering without `weft.css` is unchanged);
`lg`, `icon` and `dense` stay fixed-pixel React-only conveniences, recorded
as such. **This closes D4 against T2**: `size="sm"` no longer names 32px —
it names the small step of the current tier, and the two calls stop being
separately citable.

**Breaking, component-level** (package stays minor per the 0.x clause;
component majors carry the signal): `Input` 1.2.0 → **2.0.0** — it gains the
compose `size` axis (`"default" | "sm"`), and the native width-in-characters
`size` attribute is **removed** from its props so one name cannot mean two
things. `SearchField` (1.1.0) forwards the compose size and omits the native
attribute the same way.

**The recorded React-boundary parity gap is closed**: `--input` and
`--input-background` now read `--weft-control-border` / `--weft-control-fill`
— the same Option C pair the plain-CSS boundary reads — so a React field
paints the ~3.5:1 boundary instead of the 1.30:1 hairline. The
`dark:bg-input/30` re-dims in the primitives went in the same change; the
fill token answers both themes itself. `css-contract`'s holds-the-gap record
is deleted and inverted into a permanent guard, per its own instructions.
Every moved visual baseline was reviewed individually in the pinned
container.
