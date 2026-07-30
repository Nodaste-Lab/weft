---
"@nodaste-lab/weft": minor
---

Add the template layer: `css/weft-templates.css`, exported as
`@nodaste-lab/weft/templates.css` and bundled last in `index.css`.

Templates are whole reviewed surfaces (regions, grid, grouping semantics,
states) rather than single controls, in plain CSS so sandboxed code-backed panel
iframes can consume them.

First template — `weft-board`, the operator action board ported from the
reviewed Updates Dashboard surface (Heddle NOD-1254): filter rail beside a
priority-tiered action list, plus a compact panel variant, an item drawer, and
provenance evidence chips. Token-only and theme-following in light and dark; it
carries no palette overrides. DOM contract and the token reconciliations found
while porting are documented in `docs/brand-package/11-panel-templates.md`.

No existing token, component, or prop surface changes: `weft.css` and
`weft-components.css` are untouched, so Heddle's injected-CSS hash comparison is
unaffected.
