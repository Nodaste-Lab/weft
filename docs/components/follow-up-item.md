---
related:
  - follow-up-block
  - list-item
  - button
---

# Follow-up item

## Purpose

One suggested next prompt inside a `follow-up-block`. It owns the card, the label, the optional detail, the `selected` and `disabled` attributes, and the choice between display-only and actionable rendering: with `onSelect` the label becomes a `button`, without it the item is text.

## When to use

- As a child of `follow-up-block`, which supplies the list container and the accessible name.
- On its own only inside an element with `role="list"`, since the item renders `role="listitem"`.

## When not to use

- An option the person picks from a set. Use `list-item`.
- An action on the surface. Use `button`.
- A filter or tag. Use `chip`.

## How to use

1. Render `FollowUpItem` with `id` and `label`; add `detail` for one line of consequence.
2. Pass `onSelect(id)` to make the item actionable. The label renders as a ghost `button` with `aria-pressed={selected}`. Omit it for a display-only suggestion.
3. Pass `selected` to draw the accent border and tint; pass `disabled` to disable the button and dim the card to 70% opacity.
4. Place it inside a `role="list"` container. `follow-up-block` does this; a standalone use must.

## Heuristics

- The label is the whole prompt. Only the label is inside the button, so it must stand on its own; the detail explains, it does not complete the sentence.
- The click target is the label button, not the card. Keep the detail short so the card does not read as a larger target than it is.
- Selected is a state (`aria-pressed`, `data-selected`); the border and tint draw it.
- A display-only item has no hover or focus treatment, and none is added by the consumer.

## Content

- Label: an imperative prompt or a question, sentence case, one line, no trailing punctuation.
- Detail: one sentence stating what the prompt produces, ending with a full stop.
- No decorative prefix such as a sparkle or "AI:".

## Accessibility

- The item is `role="listitem"` and needs a `role="list"` parent.
- The actionable form is a native button with `aria-pressed`, the global focus ring, and `min-height: var(--weft-touch-target)` (24px floor, WCAG 2.5.8).
- The button's name is the label only. The detail is not announced with it, so the label must be self-sufficient.
- `disabled` uses native disabled and removes the button from the tab order.
- The hover background is suppressed on the button; focus is shown by the ring, so the control is reachable and visible from the keyboard.
