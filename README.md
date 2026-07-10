# Weft

Nodaste's design system: the `--weft-*` token layer, framework-agnostic
`weft-*` component classes, and the shadcn-based React primitive library —
extracted from Heddle (with full git history) so every Nodaste product can
share one visual language.

Published as **`@nodaste-lab/weft`** on GitHub Packages (private to the org).

## Install

```sh
# .npmrc
@nodaste-lab:registry=https://npm.pkg.github.com

npm install @nodaste-lab/weft
```

Authenticate with a GitHub token that has `read:packages` (in CI, the default
`GITHUB_TOKEN` works once the consuming repo is granted access under the
package's **Manage Actions access**).

## What's in the box

| Import | Contents |
|---|---|
| `@nodaste-lab/weft/tokens.css` | The `--weft-*` token layer + shadcn bridge. A **pure token file** (no `@media`/component rules — CI-enforced) so it can be injected anywhere, including sandboxed iframes. Theme axes via root attributes: `data-palette`, `data-theme`, `data-density`, `data-fonts`. |
| `@nodaste-lab/weft/theme.css` | Flat shadcn token API (`--background`, `--primary`, …). |
| `@nodaste-lab/weft/components.css` | Framework-agnostic `weft-*` classes (button, inputs, pill, card, table…). |
| `@nodaste-lab/weft/fonts.css` | Brand fonts via `@fontsource` (Fraunces / Inter Tight / JetBrains Mono). |
| `@nodaste-lab/weft/index.css` | All of the above in load-bearing order. |
| `@nodaste-lab/weft` | React primitives (built ESM). Deep imports: `@nodaste-lab/weft/src/ui/button` etc. |
| `@nodaste-lab/weft/tooling/raw-colors` | The canonical raw-color gate pattern (Node + browser). |
| `@nodaste-lab/weft/manifest.json` | Component registry with per-component semver. |

Quick start for a Tailwind v4 app: import `index.css` (or the layers you need)
and set `data-palette="weft"` on `<html>`; dark mode activates via
`data-theme="dark"`.

## Governance

- `manifest.json` `designSystemVersion` must equal `package.json` version (CI).
- Component prop contracts are snapshotted in `props-snapshot.json`; a surface
  change requires a component version bump, a breaking change a major bump
  (`npm run props` gates it; `npm run props:write` regenerates).
- Raw colors are only legal in the token-definition files (`npm run`-level and
  consumer-side gates share `tooling/raw-color-pattern.js`).
- Releases via changesets → GitHub Packages (`.github/workflows/release.yml`).

Docs: `docs/brand-package/` (brand + design-system reference, accessibility
rules, app primitives).
