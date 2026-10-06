---
related:
  - toggle-group
  - pill-toggle-group
  - accordion
  - sidebar
  - steps
---

# Tabs

## Purpose

A row of labels that switch one region between alternative views without leaving the page. It owns the tab list, the active state, the arrow-key movement and the panel wiring. The consumer owns the labels and the panels.

## When to use

- Two to five views of the same region where one is what most people want first and the others are reached on demand (a document tree and a board; a recap and its prep).
- Grouping settings or a form into named pages that stay in one place.

## When not to use

- Navigation between routes. Use `sidebar` or a link; a tab never leaves the region it labels.
- A filter or a mode that changes the same list in place. Use `toggle-group` or `pill-toggle-group`.
- Steps in a sequence. Use `steps`.
- Content people compare side by side or read in order. Show it with headings or in an `accordion`.
- One view with no alternative. There is nothing to switch.

## How to use

1. Render `Tabs` with `defaultValue` (uncontrolled) or `value` and `onValueChange` (controlled), and `orientation="vertical"` when the list is a column.
2. Put one `TabsTrigger` per view inside `TabsList`, each with a unique `value` and a short text label.
3. Render one `TabsContent` per `value`. Only the active panel is mounted unless `forceMount` is set.
4. Give the list a name with `aria-label` on `TabsList` when the surrounding heading does not already say what the views are.
5. Order the triggers by how often they are needed; the first is the default view.

## Heuristics

- Labels name the view, not the action ("Recap", not "Show recap").
- The active tab is readable without colour: `data-state="active"` drives the fill and weight, and `aria-selected` is the state.
- Do not disable a tab. Remove it, or keep it and explain the empty view inside the panel.
- Labels do not wrap. If a label needs two lines, it is too long or there are too many tabs.
- Switching a tab keeps the scroll position of the region; it does not scroll the page.
- On app surfaces tabs are quiet: sentence case in the sans face with the underline and weight carrying the state. The shipped trigger draws a filled pill; the brand entry for `tabs` describes the ruled form.

## Content

- Labels: one or two words, sentence case, no trailing punctuation, nouns ("Document tree", "Kanban board").
- A count on a tab is a `badge` after the label, never part of the label text.
- The first tab is the view most people want; the order does not change between visits.

## Accessibility

- The list carries `role="tablist"`, each trigger `role="tab"` with `aria-selected` and `aria-controls`, and each panel `role="tabpanel"` with `aria-labelledby` and `tabindex="0"` so it is reachable even when it has no focusable content.
- Tab moves into the list onto the active tab and then out to the panel. Left and Right (Up and Down when vertical) move between tabs and activate them as they move; Home and End jump to the first and last.
- Activation is automatic. If a view is slow to load, pass `activationMode="manual"` so Enter or Space activates and arrows only move focus.
- Each trigger is at least the 24px floor (`--weft-touch-target`); the default list is 36px tall.
- Focus on a trigger shows the global Focus Ring; the active state is a separate attribute from focus.
- Switching views does not need a live region (WCAG 4.1.3 excludes focused content and disclosure state). Loading text inside a panel is the `status`.
