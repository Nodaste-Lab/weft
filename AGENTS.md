# Weft — Repo AGENTS

Authoritative guide for coding agents working in this repository.

Weft is the Nodaste design system: the `--weft-*` token layer, the
framework-agnostic `weft-*` component classes, and the shadcn-based React
primitive library. It publishes as **`@nodaste-lab/weft`** to GitHub Packages
(private to the org) and is consumed by:

- **Heddle** (`Nodaste-Lab/heddle`) — exact-pins the package; also injects
  `css/weft.css` + `css/weft-components.css` **verbatim at runtime** into
  sandboxed code-backed panel iframes
- **plan-reviewer** (`Nodaste-Lab/plan-reviewer`, public) — vendors
  `css/weft.css` by copy (`scripts/refresh-weft-tokens.mjs` there); never
  reaches this registry at build time
- **doct** — adoption planned (see `docs/adr/` when it lands); its Tailwind v4
  pipeline maps onto `css/weft.css`

## Does my change belong here or in Heddle?

| Change | Repo |
|---|---|
| `--weft-*` tokens, palettes, density/theme axes (`css/weft.css`) | **here** |
| Flat shadcn token API (`css/theme.css`), `weft-*` classes (`css/weft-components.css`), fonts | **here** |
| React primitives (`src/ui/*.tsx`), their tests, Code Connect `*.figma.tsx` | **here** |
| `manifest.json` uiPrimitives / `props-snapshot.json` | **here** (gates enforce lockstep) |
| Brand package docs (`docs/brand-package/`) | **here** |
| Raw-color detection tooling (`tooling/raw-color-pattern.js`) | **here** (Heddle's gates AND its browser panel validator import it) |
| Panel-builder block vocabulary (`panel-manifest.json`), panel authoring docs/validator | **Heddle** (`src/design-system/panel-manifest.json`, `docs/panel-authoring/`) |
| The `/design-system` gallery pages | **Heddle** (`src/app/DesignSystemPage.tsx`, `src/design-system/`) |
| Panel surfaces: WidgetTile, HUDPanel, PanelBlockShell; `--hud-*` transitional aliases | **Heddle** |
| A new shared primitive extracted from Heddle app code | **here** — add `src/ui/<id>.tsx`, register in `manifest.json` (ordered), showcase entries need `version`, run `npm run props:write`; then add gallery coverage in Heddle |

Rule of thumb: if two products could want it, it's Weft. If it knows about
HUD runtime, panels, modes, or Heddle services, it stays in Heddle — this
package must never import from an app.

## Canonical commands

```bash
npm ci                                   # needs a GH token with read:packages (see README)
npm test                                 # vitest: component + a11y suites
npm run verify                           # manifest ↔ src/ui lockstep + semver + version integrity
npm run props                            # prop-contract snapshot gate (CI mode)
npm run props:write                      # regenerate snapshot after intentional surface changes
npm run test:props                       # the gate's own unit tests
node scripts/check-pure-token-file.mjs   # weft.css stays injection-safe
node scripts/check-raw-colors.mjs        # tokens only outside css/
npm run build                            # tsup ESM bundle to dist/
npx changeset                            # record a release intent (patch/minor/major)
```

CI runs all of these plus a pack smoke that asserts the tarball ships
`css/`, `src/`, `tooling/`, `manifest.json`, `props-snapshot.json`, `dist/`.

## Hard invariants — breaking these breaks consumers silently

1. **`css/weft.css` is a pure token file.** No `@media`, no component
   selectors beyond the documented `:root[...]` axis blocks and the
   `data-palette="weft"` typography rules. Heddle injects this file verbatim
   into panel iframes; a stray rule restyles every third-party panel.
   `check-pure-token-file.mjs` gates this.
2. **Token-only colors.** Raw hex/rgb/hsl live ONLY in `css/` token files.
   Everything in `src/` must read `var(--weft-*)` (or the bridged flat
   tokens). `check-raw-colors.mjs` + the shared `tooling/raw-color-pattern.js`
   gate this — the same pattern Heddle's panel validator enforces on
   third-party panel packages, so never fork it.
3. **The manifest is lockstep, not documentation.** Every `src/ui/*.tsx` file
   appears in `manifest.json` `uiPrimitives` (sorted), paths must match,
   showcase entries carry semver `version`, and `designSystemVersion` must
   equal `package.json` `version`. Removing a showcase component requires a
   `removedUiPrimitives` tombstone.
4. **Prop surfaces are contracts.** `props-snapshot.json` is the committed
   golden record. Any surface change needs a component version bump;
   a breaking change (removed prop/variant, prop made required) needs a
   **major** component bump. `npm run props:write` refuses otherwise —
   `--force` is only for extractor changes, never contract changes.
5. **The tarball ships `src/`.** Heddle deep-imports
   `@nodaste-lab/weft/src/ui/<id>` and its Tailwind build scans
   `src/**/*.tsx` via this package's own `@source` directive in
   `css/tailwind.css`. Dropping `src` from `files` builds fine here and
   breaks Heddle completely.
6. **Byte-stability is a feature.** Consumers pin exact versions and Heddle
   hash-compares injected CSS in its verification. Never reformat/minify the
   css/ files as a side effect of an unrelated change.

## Release flow (how a change reaches consumers)

1. Branch, change, satisfy the gates above, `npx changeset`
   (patch = fixes; minor = additive tokens/props/components; major = breaking
   contract change — mirror the component-level bump in `manifest.json` and
   bump `designSystemVersion` to match the package version).
2. PR → CI green → merge to `main`.
3. The release workflow opens/updates a **Version Packages** PR; merging it
   publishes to GitHub Packages and tags.
4. Consumers adopt deliberately: bump the exact pin in Heddle
   (`"@nodaste-lab/weft": "x.y.z"`), `npm install`, run Heddle's
   `npm run linux:check` + visual suite; refresh plan-reviewer's vendored
   copy with its `scripts/refresh-weft-tokens.mjs`.

## Cross-repo development loop

Working a change that Heddle needs to exercise live:

```bash
# in the heddle checkout
npm install /path/to/weft     # temporary symlink; Vite HMR picks up edits
# iterate here + there ...
git checkout package.json package-lock.json && npm ci   # NEVER commit the symlink
```

Final pre-publish check: `npm pack` here, install the tarball in Heddle,
re-run its gates. The published artifact — not your working tree — is what
consumers get.

## Known deferred items

- `tsup` builds with `dts: false`: ~360 latent type errors inherited from the
  no-typecheck era (mostly tests). Enabling `.d.ts` generation is tracked
  work; don't add new type errors.
- React 19 peer range is declared but untested (react-day-picker peers cap at
  18) — required homework before doct adopts the React entry.
- Dark High Contrast / `--chart-*` / `--sidebar-*` token coverage gaps are
  documented in the doct adoption ADR when it lands.
