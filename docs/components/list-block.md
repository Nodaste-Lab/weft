---
related:
  - list-item
  - follow-up-block
  - radio-group
  - command
---

# List block

## Purpose

A container for a short list of generated options or results the person reviews or picks from. It owns the section shell (title, description), the `selectionMode` attribute, the labelled `ul`, and the mapping of `items` onto `list-item`. Selection state lives with the consumer: the block records `selectionMode` as an attribute and does not enforce it.

## When to use

- A set of generated choices after a response: outputs to create, tasks found, candidates to pick.
- A short list of results inside a panel where each row may be selected or is display-only.

## When not to use

- Navigation. Use `sidebar` or `breadcrumb`.
- Actions on the surface. Use `action-button-row`.
- Suggested next prompts. Use `follow-up-block`.
- A long or filterable list. Use `command`.
- A form field with one required answer. Use `radio-group` or `checkbox`.

## How to use

1. Render `ListBlock` with `items`, each `{ id, label, detail?, selected?, disabled?, onSelect? }`.
2. Pass `title` as a string; it becomes the accessible name of the list. Without a string title, pass `aria-label`.
3. Set `selectionMode` to `none`, `single` or `multiple`. It is written to `data-selection-mode`; the consumer keeps `selected` consistent with it (exactly one true in `single`).
4. Give an item `onSelect(id)` to make it a button; omit it for display-only rows.
5. With an empty `items` array the block renders an empty list and no placeholder copy. Show an `empty-state` or omit the block.

## Heuristics

- Three to six items. Beyond that, the list needs filtering (`command`) or paging.
- Labels are the thing or the action; details are the consequence. A row never relies on the detail to be understood.
- A `single` list shows exactly one selected row; a `multiple` list may show several; a `none` list shows no selected state.
- Selected is a state (`aria-pressed`, `data-selected`); the accent border and tint draw it.
- Display-only and actionable rows can share a list, but the pattern should be consistent within one block.

## Content

- The title names the decision or the set in sentence case: "Choose an output".
- Labels are sentence case, one line, no trailing punctuation; verb-led for actions ("Extract tasks"), noun for things.
- Details are one sentence ending with a full stop.
- The description states the source of the items when they were generated.

## Accessibility

- The block is a `section` with `role="region"`. Pass `aria-label` on the block when the region should be a named landmark; the string `title` names the list.
- The list is a `ul` with `role="list"` and `aria-label`; items are `li`, so the count is announced.
- Actionable rows are native buttons with `aria-pressed` and `min-height: var(--weft-touch-target)` (24px floor, WCAG 2.5.8). Display-only rows are not focusable.
- `single` mode is exposed through one `aria-pressed="true"` button, not through radio semantics. A consumer that needs a required single choice uses `radio-group`.
- A disabled row uses native disabled and leaves the tab order. Focus order is the order of `items`.
