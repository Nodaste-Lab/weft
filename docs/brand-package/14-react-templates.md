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

## File shell design checkpoint

The [October 7 handoff](https://nodaste.hub.avalandra.com/d/5d211467-739b-4221-a87c-68e9a8d30ad3)
records a File shell reference on a separate working branch. At the incorporation
baseline `f954982`, main does not register a File shell template. This section
records agreed composition guidance, not an importable API or a release claim.

Inspect Tokens/foundations, Atoms, Assemblies and Complete shell as decomposition
levels inside a template. Keep matching semantic controls and meaningful states
across them. This does not replace the site taxonomy Tokens, Components, Templates
and Patterns. The shell demonstrates HTML, Document, Spreadsheet, Presentation
and Image around content placeholders. Shared contracts live in
[document surfaces](13-document-surfaces-heuristics.md#shared-file-shell-inspector),
[semantic icons](../components/navigation-icon.md#shared-file-shell-symbols) and
[accessibility](05-accessibility.md#current-shared-baseline-october-7-2026).

Label gallery examples as fictional data and local state. They demonstrate
presentation and interaction; they are not functioning integrated Avalandra
files. Adoption requires host adapters for editors/renderers, real file identity,
routes, capabilities derived from authorization, durable rename/save/restore,
comments/listeners, verified presence, revision/approval evidence and HTML
annotation anchoring. Bind asynchronous requests to stable file identity so an
old result cannot update a different file. Success follows host success, not
optimistic fixture state. Read denial suppresses content; revoking an active
panel clears selection rather than reopening it automatically if access returns.
These presentation capabilities introduce no new permission model.

Keep documentation examples, playground, variant/state matrices, API from the
props snapshot, accessibility and related patterns tied to their authoritative
sources. Derive dates from git. Preserve “Not yet written” sections and unverified
integration gaps honestly. Component/template checks do not establish host
integration, package release or accessibility conformance. Product routes,
Signals meanings, document-kind convergence and archive/purge are outside this
reusable contract.

### Navigation reconciliation

The current workspace-navigation-rail entry above supersedes the removed
navigation-rail inventory and historical product destination lists in the guide.
Document links, disclosure controls and inert rows have distinct roles: a file
may both open and have children, so preserve independent opening and disclosure
rather than turning its link into a folder. Render row actions only with working
handlers; reveal them on hover, focus-within and menu-open, with object-specific
names. Counts align right; omit known zero without converting unknown to zero.
Keep semantic file identity consistent, group labels readable, the account area
outside tree scrolling, and distinct names for main-column and edge-rail toggles.
The left destination rail's selection differs from the right inspector selector.
Actual destinations, A/B placement and remembered product views remain host
choices; this transfer does not settle Kanban or hierarchy.
