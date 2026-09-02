---
"@nodaste-lab/weft": patch
---

Brand-package amendments for the DocT document-view port (plan phase W1; docs
only). `05-copy-guidance` § When caps records the owner's casing ruling
verbatim (2026-09-01): technical labels in dense info areas use all caps;
outside of that, all caps is not used for headers, sections, or small one-off
items. `09-app-primitives` § Casing on app surfaces applies it per entry —
`tabs`, app-surface `eyebrow-label`, menu section labels, compact `label`,
`menubar` and `navigation-menu` triggers go sentence case with the mono face
and tracking kept; `table` headers, `stat-row` labels, panel `badge` text,
`avatar` initials and `calendar` weekday labels keep mono caps; the marketing
`.eyebrow` is out of scope. `09` also names the equal-specificity-tie rule
(state layered on a current row re-points a custom property instead of
fighting the `[aria-current]` rule) in the `sidebar` and `tabs` entries.
`04-design-system` SVG discipline gains the lucide stroke contract (round caps
and joins, width 2) and sanctions `currentColor` beside the inline `style=`
form; the Tokens section documents `--weft-fixed-ink` and
`--weft-fixed-cream` beside `--weft-fixed-white`.
