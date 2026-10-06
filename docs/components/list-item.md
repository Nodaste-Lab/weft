---
related:
  - list-block
  - follow-up-item
  - button
---

# List item

## Purpose

One row of a `list-block`. It owns the `li`, the label, the optional detail, the `selected` and `disabled` attributes, and the choice between display-only and actionable rendering: with `onSelect` the label becomes a `button`, without it the row is text.

## When to use

- As a child of `list-block`, which supplies the `ul` and its accessible name.
- On its own inside a `ul` the consumer renders, when a block shell is not wanted.

## When not to use

- A suggested next prompt. Use `follow-up-item`.
- A row in a navigation rail. Use `sidebar`.
- A row that carries several actions, a status or a timestamp. Compose it from `button`, `badge` and text instead.

## How to use

1. Render `ListItem` with `id` and `label`; add `detail` for one line of consequence.
2. Pass `onSelect(id)` to make the row actionable. The label renders as a ghost `button` with `aria-pressed={selected}`. Omit it for a display-only row.
3. Pass `selected` to draw the accent border and tint; pass `disabled` to disable the button and dim the row to 70% opacity.
4. Place it inside a `ul`. `list-block` does this; a standalone use must, and the `ul` needs an `aria-label`.

## Heuristics

- The label is the choice. Only the label is inside the button, so it must stand alone; the detail explains.
- The click target is the label button, not the row. Keep the detail short so the row does not read as a larger target than it is.
- Selected is a state (`aria-pressed`, `data-selected`); colour draws it.
- A display-only row has no hover or focus treatment, and none is added.

## Content

- Label: sentence case, one line, no trailing punctuation; verb-led for an action, a noun for a thing.
- Detail: one sentence ending with a full stop.
- No fixture text. A row with nothing to say in the detail omits it.

## Accessibility

- The row is an `li` and needs a `ul` parent.
- The actionable form is a native button with `aria-pressed`, the global focus ring, and `min-height: var(--weft-touch-target)` (24px floor, WCAG 2.5.8).
- The button's name is the label only; the detail is not announced with it.
- `disabled` uses native disabled and removes the button from the tab order.
- The hover background is suppressed; focus is shown by the ring, so the control is visible from the keyboard.
