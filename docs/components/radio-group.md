---
related:
  - checkbox
  - select
  - toggle-group
  - pill-toggle-group
  - label
---

# Radio group

## Purpose

Exactly one choice from a short, fully visible set. It owns the group container with its state axis (default, error, disabled), each item's ring and dot, and the roving keyboard model. The legend that names the group and the label on each item are the consumer's.

## When to use

- One answer from two to six options that should all be visible before choosing.
- Mutually exclusive modes saved with a form ("Manual review" or "Auto-publish").

## When not to use

- More than one answer. Use `checkbox`.
- A long list. Use `select`.
- A choice that switches the view immediately. Use `toggle-group` (joined) or `pill-toggle-group`.
- A yes or no setting with an instant effect. Use `switch`.

## How to use

1. Render `RadioGroup` with `value` and `onValueChange`, or `defaultValue`, and `RadioGroupItem` children each with a `value` and an `id`.
2. Wrap each item with a `label`, or give the label `htmlFor` the item's `id`.
3. Wrap the group in a `fieldset` with a `legend` that states the question, or set `aria-labelledby` on `RadioGroup` to a visible heading.
4. Set `state="error"` for a missing or rejected answer and `state="disabled"` when the whole group is unavailable; both apply to every item. There is no read-only group.
5. Keep the default 12px gap between items so the 32px rows sit 44px apart.

## Heuristics

- Stack vertically. Put two short options on one line only when the row will not wrap.
- Do not pre-select a question. Pre-select a setting that has a real current value.
- Order alphabetically or by expected frequency, and keep the order stable.
- Offer "None of these" or "Not sure" as a last option when they are honest answers, so people are not forced into a wrong one.
- Once chosen, a radio cannot be un-chosen. If "no answer" is valid, make it an option.
- An error belongs to the group, not to one item: the whole group's rings take the stop colour and one message sits under the group.

## Content

- Legend: the question or the thing chosen ("Preferred contact"), sentence case, no colon.
- Item labels: parallel, sentence case, short enough not to wrap at rail width ("Email", "Slack").
- Help text under an item explains that option's consequence; help text under the group explains the choice.
- Error: "Select a review mode", under the group.

## Accessibility

- The group exposes `role="radiogroup"` and items `role="radio"` with `aria-checked`. Tab enters the group on the checked item (or the first), arrow keys move and select, Space checks the focused item.
- The consumer names the group (`fieldset` and `legend`, or `aria-labelledby`) and each item (a `label`) (WCAG 1.3.1, 3.3.2).
- `state="error"` sets `aria-invalid` on the group; attach the message to the group through `aria-describedby` (WCAG 3.3.1).
- Each item measures 16px, so the labelled row is the target: minimum height `--weft-touch-target` (24px floor, WCAG 2.5.8) with the 12px stack gap.
- Selection is drawn by the dot and the ring colour. The dot is what reads with colour removed.
