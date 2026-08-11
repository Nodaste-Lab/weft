---
"@nodaste-lab/weft": patch
---

Fix the select chevron disappearing under the `hud-glass` palette.

Palette and theme are independent axes, and `hud-glass` is a dark palette in its own right — dark `--weft-paper`, near-white `--weft-ink` — whatever `data-theme` says. The cream chevron override keyed on `:root[data-theme^="dark"]` alone, so anyone using `hud-glass` without dark mode got a near-black glyph painted into a dark control: stroke `#0B1020` against ink `#f5f8ff`, a luminance gap of 0.932.

The override now keys on the palette as well. The guard asserts the invariant rather than a list of dark palettes: the chevron's stroke must be the same tone as `--weft-ink` in every palette × theme combination, so a future palette that forgets the override fails without anyone remembering to extend a list.
