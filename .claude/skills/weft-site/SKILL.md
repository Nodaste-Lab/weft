---
name: weft-site
description: Open and work in the Weft design system site (guidelines, tokens, components, patterns, templates), and keep it current. Use whenever someone asks to see, open, show or check a Weft component, variant, state, token, pattern or template, or edits anything under src/ui, src/templates, docs/components, docs/patterns or manifest.json. Every component change lands here: its doc, its specimen, and the gates.
---

# Weft design system site

The site is the design system's own view of itself: one page per guideline, token family, component, pattern and template, organised by Weft's levels (tokens, components, patterns, templates). It runs from this repo; nothing about it ships in the package.

## Open it

In the Claude desktop app, start the preview by name (`.claude/launch.json` defines it):

- `preview_start` with `name: "weft-site"`, then navigate to a route below. Port 5179.
- From a terminal: `npm run site:dev` (needs `node_modules`; `npm ci` needs a GitHub token with `read:packages`).

Routes (hash based):

| Route | Page |
|---|---|
| `#/` | Overview |
| `#/guidelines/<file>` | A brand-package doc, e.g. `#/guidelines/05-accessibility` |
| `#/tokens/<family>` | `font`, `space`, `radius`, `control`, `motion`, `chart`, `color` |
| `#/components/<id>` | One component: example, playground, docs, API, related |
| `#/patterns/<id>` | One pattern: components used, guidance |
| `#/templates/<id>` | One template: example, components used, documentation |
| `#/all` | Every component on one page (the visual baselines capture this) |

Use `read_page` / `javascript_tool` to verify a page rather than screenshots: `[data-not-yet-written]` marks unwritten sections, `[data-playground]` is the playground, `[data-last-edited]` carries the date.

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

- The dev server's file globs go stale when a new `docs/components/*.md` is added while it runs; restart it (`preview_stop`, `preview_start`).
- The visual baselines are Linux captures; `npm run test:visual` on a Mac writes new files instead of comparing.
