---
title: React templates
linked_project: Heddle Branding
---

# React templates

Weft has three levels: **tokens** (the smallest unit), **components** (small,
reused elements that carry state and change often), and **templates** (whole
surfaces composed from components). This file is the register of the React
templates; the plain-CSS templates are in [[11-panel-templates]].

A React template is a composition of `src/ui` primitives that shows how a
surface is built: which primitives, which variants and slots, how rows nest,
where actions live, how focus and keyboard are wired, and the data shape the
surface expects. It is a heuristic, not a drop-in. A product wires the same
primitives to its own data and routing, and matching the template line for
line is not the goal.

## Conventions

- Lives at `src/templates/<id>.tsx`, with its gallery data at
  `src/templates/<id>.fixture.ts`. Registered in `manifest.json` `templates`
  with `kind: "react"` and `composes[]` naming the primitives it is built from.
- Imports only `react`, `lucide-react` and `../ui/*`. No app code, no gallery,
  no CSS, no fixture.
- Every piece of content arrives through props. The template never imports
  its fixture and ships no fixture value as a default: an empty tree renders
  an empty tree.
- Token-only. No raw colours, no `--hud-*`.
- Shown in the gallery under Templates, rendered with its fixture, with the
  composition list beside it.
- Gated by `scripts/__tests__/react-template-contract.node.mjs` (R1–R6) and a
  vitest suite with an axe pass.

Non-React consumers (plan-reviewer, Heddle panel iframes) get nothing from a
React template. A surface that must also work there needs the CSS form in
`css/weft-templates.css`.

---

## `workspace-navigation-rail` — Workspace navigation rail

`workspace-navigation-rail` exports `WorkspaceNavigationRail`. This
composition is the migration target for Avalandra. It replaces the removed
`navigation-rail` template; migrate imports and supply the application-owned
file tree and routing through this template’s props.

The canonical interactive template standard is the navigation rail lab at
`#/labs/navigation-rail`: tokens, atoms, rows, full rail, accessibility
requirements and Avalandra functionality coverage. Template gallery links
open that same experience. The all-components gallery retains a small
package composition fixture for regression checks.

It composes NavigationSpacePicker, NavigationSearch, NavigationRow,
NavigationIcon, NavigationCount, NavigationAccount and NavigationRailLayout.
Supply destinations in the order Signals, Kanban board. Search's filter slot
holds Explorer category navigation. Supply real destination URLs, the current
destination ID, and the application's file tree in `files`. `filesId` defaults
to `"files"`; use that ID as `currentDestination` when Documents is active so
the Files link receives `aria-current="page"`. Files remain
visible while Signals or Kanban is current. A future destination with `panel`
replaces the Files panel; its Files link returns to the document destination.

The template owns presentation and disclosure only. Avalandra owns permission
filtering, capability gating, routing/history, remembered file and Signals lens,
per-Space awaiting-action counts, file paging/loading, stale-response protection,
context actions and drag/drop. Preserve these during integration; a rendered
menu or fixture is not evidence that a live service works.

Desktop width defaults to 280px, supports 200–720px, arrow steps of 16px,
Shift+arrow steps of 64px and Home/End. `storageKey` opts into local persistence;
a controlled `width` must be restored by the application. Available container
width clamps the rendered rail without overwriting the user's preference.
Below 1024px the rail uses a modal drawer with Escape, focus trapping and focus
return. The account accepts no email; place email in Settings.

Acceptance: verify real links with screen-reader link navigation, new-tab and
Back/Forward behavior; selected destinations use `aria-current="page"`. Verify
keyboard resize and refresh restoration, narrow drawer focus return, independent
file disclosure/opening, and a file tree that retains the active/focused row
while paging. Automated checks supplement a manual NVDA/VoiceOver and touch pass.
