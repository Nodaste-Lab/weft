---
"@nodaste-lab/weft": minor
---

React templates, and the first one: `navigation-rail`. Weft now has three
levels — tokens, components, templates — and a template can be a React
composition of `src/ui` primitives as well as a plain-CSS surface.
`manifest.json` `templates` entries gain `kind` (`css` | `react`); a react
entry carries `fixture` and `composes[]` instead of `classPrefix`, and
`verify` checks the right fields for each kind. `navigation-rail`
(`src/templates/navigation-rail.tsx`, fixture beside it) composes `sidebar`,
`collapsible`, `select` and `avatar` into a workspace rail — space picker,
section navigation with counts, document tree with folders and hover /
focus-within row actions, profile footer — with every piece of content
arriving through props and nothing shipped as a default. It is exported from
the package root, deep-importable at `src/templates/navigation-rail.tsx`,
rendered in the gallery's new Templates section with its composition list,
and gated by `scripts/__tests__/react-template-contract.node.mjs` (R1–R6:
registry, imports limited to react / lucide-react / ../ui, token-only, fixture
never imported, gallery coverage, barrel parity) plus a vitest suite with an
axe pass. `docs/brand-package/14-react-templates.md` is the register. No
token, class or component prop change.
