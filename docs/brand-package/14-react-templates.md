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
open that same experience at the complete Rail level. The lab is site-only
reference code, not an importable package export. The package currently ships
the frame and controls with a `files` slot. Supply NavigationFileList in that
slot for shared nested structure, depth, paging and async states, retained
rows, drag presentation and reorder requests. NavigationFileRename and
useNavigationFileInteractions provide rename and alternate action entry
points. These are package exports used by the lab; the fixture mutation
store, dialogs and Undo data stay in the consumer. Avalandra must wire real
data, permissions, routes, loading and mutation callbacks before cutover.
The all-components gallery retains a small
package composition fixture for regression checks.

It composes NavigationSpacePicker, NavigationSearch, NavigationRow,
NavigationIcon, NavigationCount, NavigationAccount and NavigationRailLayout.
Supply destinations in the order Signals, Kanban board. Search's filter slot
holds Explorer category navigation. Supply real destination URLs, the current
destination ID, and NavigationFileList with the application's nodes in `files`. `filesId` defaults
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

## `file-shell` — controlled file workspace

Exports FileShell and its capability contract. Composes file-header and file-shell-controls only; all data arrives through props. Header identity uses fileKind to select the same semantic glyph as navigation. Supply read/write/comment/review capabilities separately. Read denial hides content/panels/presence; write denial removes rename and disables formatting; review denial omits that panel; comment denial omits HTML annotation modes. Host-provided panel content and action slots must enforce their own permissions too.

Panels are controlled, exclusive and semantic: Comments first, Working status, Review, File info and Version history. Keyboard opening moves focus into the region. The panel is a persistent region, not a dismissible layer. Escape is reserved for the content editor and for transient controls inside the panel. The rail control toggles the panel; closing it keeps focus on that control. Shift+Tab from the panel returns to the rail. Formatting stays in the document column; HTML gets mutually exclusive annotation modes and matching cursors. FilePresence, FileMetadata and FileVersionHistory are exported compositions for panel content; saved snapshots are separate from revision lineage. Key file views by stable identity to reset transient state when navigating.

Use this as a design-system composition reference, not a final working Avalandra file view. The application owns routing, access enforcement, persistence, editor commands, coordinate/element anchors, iframe cursor propagation, comment services, verified activity, review/approval and revision operations. Fixtures are local examples; no successful service operation is implied by their state. Test the integration against the deployed Avalandra contract, which differs from the local source snapshot used for discovery.
