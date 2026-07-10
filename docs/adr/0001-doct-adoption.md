# ADR 0001 — doct adoption path

Status: **Proposed** · Date: 2026-07-09 · Owners: Katie · Linear: NOD-1257

## Context

[doct](https://github.com/Nodaste-Lab/doct) is Next.js 16 / React 19 /
Tailwind v4 (CSS-first), with ~30 shadcn components that read **unprefixed**
shadcn variables (`--background`, `--primary`, …) mapped through `@theme` in
`app/globals.css`. It has its own working token pipeline: W3C
`design-system/tokens.json` → `build-tokens.js` → `app/design-tokens.css`,
with two-way Figma Tokens Studio sync. Fonts are Geist via `next/font`.

Weft's `theme.css` + `weft.css` define exactly the flat shadcn token API doct's
components consume, plus the `--weft-*` layer bridging onto it, activated by
root attributes (`data-palette="weft"`, `data-theme="dark"`, `data-density`).

## Spike evidence (2026-07-09)

A working prototype exists: branch `weft-preview-nod-1257` in Katie's local
doct checkout (worktree `doct-weft-preview`), built against the packed
`@nodaste-lab/weft@0.1.0` tarball. Total footprint:

- `app/globals.css`: import the package's `fonts.css` / `theme.css` /
  `tokens.css` **after** the generated `design-tokens.css` (Weft values win the
  cascade), retarget the `@theme` font variables (Inter Tight / JetBrains Mono)
- `app/layout.tsx`: `data-palette="weft"` on `<html>`, next-themes
  `attribute={["class", "data-theme"]}` (v0.3 supports the array), so doct's
  `.dark` variant and Weft's `data-theme="dark"` tokens stay in lockstep
- No component changes. Every doct surface restyled live (cream paper /
  ink dark, Fraunces headings via the `data-palette="weft"` heading rules,
  Weft-blue primary), including doct's own theme-customizer dialog.

## Decision

**Short-term (the adoption PR): CSS bridge, no pipeline change.** Ship the
spike wiring against the published package. doct keeps its `tokens.json`
pipeline for anything Weft doesn't define; Weft's CSS simply overrides the
shared shadcn variable names. React 19 is irrelevant on this path — it's
CSS-only.

**Long-term (separate ADR when warranted): tokens.json as source of truth.**
Weft could adopt W3C `tokens.json` generating both `weft.css` and a
doct-namespace export, restoring doct's Figma sync on top of Weft values. This
changes the exact bytes Heddle injects into sandboxed panel iframes, so it is
gated on a byte-diff guard + Heddle's visual suite, and deliberately **not**
part of first adoption.

## Known gaps (work items for the adoption PR)

1. `--chart-1..5` and `--sidebar-*`: doct tokens with no Weft definition —
   keep doct's values initially; decide whether Weft should own chart/sidebar
   vocabularies (probable yes — Heddle wants charts too).
2. **Dark High Contrast preset**: doct ships one; Weft has no
   high-contrast palette. Until Weft grows one, that preset keeps doct values.
3. **Theme customizer interplay**: doct's customizer writes user-picked colors
   over the shared variables; Weft-as-default means the customizer becomes
   "override Weft" — confirm that's the intended product behavior (or hide the
   customizer behind a flag when the Weft palette is active).
4. Serif headings apply globally under `data-palette="weft"` — audit doct
   surfaces where Fraunces is wrong (dense tables, code-heavy views).
5. React components (`@nodaste-lab/weft` React exports) are **out of scope**
   for adoption: Radix pins and `react-day-picker` (peer `react <= 18`) need a
   React 19 smoke test, and the package doesn't ship `.d.ts` yet.

## Consequences

- doct gets brand consistency with Heddle for a ~2-file diff, reversible by
  deleting three imports and one attribute.
- Weft gains its second consumer and pressure to own the chart/sidebar/
  high-contrast vocabularies (issues to file on first adoption).
- The doct repo needs GitHub Packages auth (CI `GITHUB_TOKEN` grant on the
  package + `read:packages` for devs), same setup as Heddle's cutover.
