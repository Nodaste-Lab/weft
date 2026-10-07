# Weft design system site

The site is the design system's own view of itself: one page per guideline, token family, component, pattern and template, organised by Weft's levels (tokens, components, patterns, templates). It runs from this repo; nothing about it ships in the package.

## Open it

From the repository root, in any terminal or editor:

```bash
npm run weft:site:open
```

This starts the site at **http://127.0.0.1:5179/#/** and opens it in your
browser. For agents or a terminal without a browser, use `npm run site:dev`
and open that URL in the available browser panel. Stop the server with Ctrl+C.
Dependencies must be installed (`npm ci` needs GitHub Packages access; see the
root README). If port 5179 is already serving Weft, open the URL directly.
If another application owns it, stop that application or explicitly choose a
port with `npm run site:dev -- --port 5180` and use the printed URL.

Routes (hash based):

| Route | Page |
|---|---|
| `#/` | Overview |
| `#/guidelines/<file>` | A brand-package doc, e.g. `#/guidelines/05-accessibility` |
| `#/tokens/<family>` | `font`, `space`, `radius`, `control`, `motion`, `chart`, `color` |
| `#/components/<id>` | One component: example, playground, docs, API, related |
| `#/patterns/<id>` | One pattern: components used, guidance |
| `#/templates/<id>` | One template: example, components used, documentation |
| `#/labs/navigation-rail` | Atomic navigation-rail lab: tokens, atoms, rows and complete composition |
| `#/all` | Every component on one page (the visual baselines capture this) |

Use your browser’s DOM inspection tools to verify a page: `[data-not-yet-written]` marks unwritten sections, `[data-playground]` is the playground, `[data-last-edited]` carries the date.

## What a component page is made of

- **Example**: the gallery card for that id (`src/gallery/DesignSystemUiGallery.tsx`, `id="<id>"`).
- **Variants and states**: the playground and matrix, driven by the specimen in `src/gallery/specimens/<category>.tsx` and the axes from `props-snapshot.json` (cva `variants` first, then prop unions). The specimen's `component` is what the controls act on; for a multi-part component that is one part.
- **Purpose, When to use, When not to use, How to use, Heuristics, Content, Accessibility**: `docs/components/<id>.md`, exactly those seven `## ` headings in that order. A section that is not written says `Not yet written.`; nothing is filled in.
- **API**: from `props-snapshot.json`.
- **Related**: `related:` in the doc's frontmatter (manifest ids only), plus every pattern (`manifest.json` `patterns[].uses`) and template (`templates[].composes`) that names the id.
- **Last edited**: from git, generated into `site/generated/component-dates.json` by `scripts/component-dates.mjs` (runs before `site:dev` / `site:build`). Source, doc and specimen dates; `uncommitted` while an edit is unsaved. Never hand-edit a date.

## When a component changes, do all of this

1. Change `src/ui/<id>.tsx`. If the prop surface changed, bump its `version` in `manifest.json` and run `npm run props:write`.
2. Update `docs/components/<id>.md` so the seven sections describe the component as it now is. Describe, do not editorialise; sentence case; colour is semantic; honest empties; keyboard, focus and 24px targets in every entry; no product names; no em dashes in prose.
3. Update the specimen in `src/gallery/specimens/<category>.tsx` so every variant and state still renders, with a `code` reference per state.
4. Run the gates: `npm run verify`, `npm run props`, `npm run test:site-docs`, `npx vitest run src/gallery/__tests__/specimens.test.tsx`, `npm run test:types`, `node scripts/check-raw-colors.mjs`. Then open the page and read it.
5. Commit. The page's last-edited date follows the commit.

A new component also needs: a manifest entry (ordered), an export in `src/index.ts`, a gallery card, a doc, a specimen. A new template needs `src/templates/<id>.tsx` + `.fixture.ts`, a manifest `templates` entry with `kind: "react"` and `composes[]`, an entry in `docs/brand-package/14-react-templates.md`, a `TemplateExample` branch in the gallery, and `npm run test:react-template-contract`. A new pattern needs a `patterns` entry with `uses[]` and, when written, `docs/patterns/<id>.md`.

## Known limits

- The dev server's file globs go stale when a new `docs/components/*.md` is added while it runs; restart the dev server (Ctrl+C, then `npm run site:dev`).
- The visual baselines are Linux captures; `npm run test:visual` on a Mac writes new files instead of comparing.

## Navigation rail accessibility

The lab includes an expandable **Accessibility requirements and verification**
guide. Run `npm run test:rail-a11y` against the site on port 5179, or pass
`-- --url http://127.0.0.1:5179/#/labs/navigation-rail` for the default site port.
See [audit, evidence and human acceptance checklist](../docs/audits/navigation-rail-accessibility.md).

`npm run test:rail-workflows -- --url http://127.0.0.1:PORT/#/labs/navigation-rail` and `npm run test:workspace-navigation -- --url http://127.0.0.1:PORT` support an existing server on another port. The workspace-template check covers exported controls as well as the lab.
