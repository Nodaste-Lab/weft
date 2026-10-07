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

## `navigation-rail` — workspace rail

**Use when** an app has a persistent left rail with a workspace or space
picker, a short section navigation, a document tree and the signed-in
profile. Avalandra's rail and DocT's workspace rail are this shape.

**Not for** a single flat list of links (use `sidebar` directly), or a
collapsible-to-icons rail (set `collapsible="icon"` on `sidebar` yourself; the
template is offcanvas).

**Composition.** `sidebar` (provider, header, groups, menu rows, menu action
with `showOnHover`, menu badge, sub-menu for nested rows, footer, rail),
`collapsible` for folders, `select` for the space picker, `avatar` for the
profile.

**Opening the rail.** The rail is off-canvas. The main column carries a `SidebarTrigger` named by `labels.toggle`, so a narrow viewport (where the rail is a closed sheet) and a keyboard user both have a route to it; the edge `SidebarRail`, named by `labels.rail`, is the pointer affordance on wide viewports. The two names differ: two controls never share an accessible name.

**Data shape.** `spaces` + `currentSpaceId`; `navigation` rows with optional
`count` and `isActive`; `tree` of `folder` / `document` nodes; `profile`; and
`labels` for every accessible name (group labels, picker, create, per-row
actions). Icons for navigation rows come in through the row (`icon`); folder
and document icons are the template's.

**Heuristics.**

- A row is one colour. Folder and document titles share the foreground;
  active state is the sidebar accent fill, not a text colour. Link blue on a
  rail row says "link", not "document".
- Row actions appear on hover and on focus-within, with an accessible name
  that includes the row title.
- Group labels are sentence case, sans.
- Counts are a `SidebarMenuBadge`, right-aligned, not a styled span.

**Open.** `SidebarMenuAction` measures 18×18 under compact density; the touch
floor is 24 (`--weft-touch-target`). That is a `sidebar` component fix, not a
template override; tracked on the Sidebar fixes branch.

## `workspace-navigation-rail` — Workspace navigation rail

`workspace-navigation-rail` exports `WorkspaceNavigationRail`. This additive
composition is the migration target for Avalandra; the original
`navigation-rail` contract remains available to existing consumers.

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
