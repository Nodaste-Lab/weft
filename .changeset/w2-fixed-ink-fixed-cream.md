---
"@nodaste-lab/weft": minor
---

Two mode-invariant fixed tokens, additive — a minor per this repo's release flow (AGENTS.md: additive tokens are a minor; the plan's "patch" wording is superseded and logged as a deviation) (plan phase W2): `--weft-fixed-ink:
#0b1020` and `--weft-fixed-cream: #f4f1e8`, declared once in `:root` of
`css/weft.css` beside `--weft-fixed-white` with no dark or palette override.
They carry the permanently-dark grounds the app surfaces need — a tooltip fill
and a floating selection toolbar that read the same in both themes, and the
hover wash and separator on that ground (`--weft-fixed-cream` at 16% and 28%
alpha) — so a consumer stops pinning raw values for them. `css-contract` now
asserts the whole fixed set (`--weft-brand-cream`, `--weft-fixed-white`,
`--weft-fixed-ink`, `--weft-fixed-cream`) is declared in the base block and
re-declared nowhere; `tokens-snapshot.json` re-baselined additively. DocT
vendors this release in its P7 and removes its two pins.
