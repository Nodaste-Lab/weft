---
"@nodaste-lab/weft": minor
---

The design system site is navigable. One page per guideline, token family,
component, pattern and template, with a left rail organised by Weft's levels
(tokens, components, patterns, templates) and a Guidelines section from the
brand package. A component page is: example, Purpose, When to use, When not
to use, How to use, Heuristics, Content, Accessibility, API (from the props
snapshot), Related (components, and the patterns and templates that use it).
The source of each component page is `docs/components/<id>.md` with those
fixed headings; a missing file or section shows "Not yet written" and the rail
counts written sections per component. `manifest.json` gains a `patterns`
registry (id, title, summary, `uses[]` naming primitives, optional `docs`),
checked by `verify`; five patterns are registered, two with written guidance
(input types, document surfaces). `npm run test:site-docs` gates the doc
headings, `related[]`, pattern docs and template register entries, and runs
in the release and review batteries. The one-page gallery stays at `#/all`
at its previous geometry for the visual baselines. First written component
doc: `sidebar`. No token, class or component prop change.

Every component page also shows every variant and every state, each cell
labelled with the JSX that produces it and the import line above: a
specimen per component (`src/gallery/specimens/<category>.tsx`, 100 of
100) says how to render one instance; the site lays out each enumerable
prop from `props-snapshot.json` as a row, the specimen's states as another,
and the first two axes as a grid. `src/gallery/__tests__/specimens.test.tsx`
renders every cell with an axe pass. All 100 components have their seven
documentation sections written.
