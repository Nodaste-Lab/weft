---
"@nodaste-lab/weft": minor
---

Add the template layer and land the D1–D15 / T1–T2 design-system decisions taken on the reviewed operator-board surface.

**Template layer** — `css/weft-templates.css`, exported as `@nodaste-lab/weft/templates.css` and bundled last in `index.css`. First template is `weft-board`: filter rail, urgency-tiered action list, compact panel variant and item drawer. Token-only and theme-following; it declares no custom properties of its own. Registered under a new `templates` key in `manifest.json` (now validated by `npm run verify`), documented in `docs/brand-package/11-panel-templates.md`.

**New primitives** — `Dot` (D13), `TierGroup` (D12) and `CopyableRef` (D14), each with a plain-CSS counterpart so sandboxed panel iframes can use them. `TierGroup` never renders an empty tier, including for `{items.length && rows}` and empty fragments.

**Additive component surface** — `Button` dense size (D4); `Badge` count/space/status variants plus stop/warn/ok tones (D5, D15); `HudListRow` third project caption (D1); `StatRow` board variant with a leading slot (D2); `ActionButtonRow` `dense` (opt-in, default false) and `trailingLink` (D3); `ToggleGroup` joined variant (D7); `Callout` dashed and band variants (D8); `EmptyState` notice variant (D9). Existing defaults are unchanged.

**Plain-CSS layer** — added `.weft-source-pill` and `.weft-callout` (with `.is-dashed`, `.is-band` and tones) so the documented migration path exists for iframe panels rather than pointing at React-only components.

**Tokens** — new `data-density="dense"` tier (T2) with `--weft-control-pad-y` per tier so dense controls actually reach 34px; `--weft-muted` and `--weft-info` keep their canonical values (T1).
