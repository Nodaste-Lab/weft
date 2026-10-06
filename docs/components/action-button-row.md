---
related:
  - button
  - panel-header
  - add-item-button
  - dropdown-menu
---

# Action button row

## Purpose

A flex row that lays out a set of related actions with the standard gap and alignment. It owns the gap, the `align` axis (start, end, between), the `dense` wrapping mode and the trailing slot that pushes one link to the far edge. It does not own the actions themselves; those are `button` instances the consumer supplies.

## When to use

- Two to four related actions at the head or foot of a panel, a card or a composer: copy, export, refresh. The actions are `button`.
- The actions slot of `panel-header`.
- A footer whose last item is a destination rather than an action ("Board view"). Put it in `trailingLink`.

## When not to use

- One action. Place the `button` directly.
- More than four or five actions. Keep the two most used and move the rest behind one trigger with `dropdown-menu`.
- A set of mutually exclusive options. Use `toggle-group`.
- Appending a row to an editable list. Use `add-item-button`.

## How to use

1. Render `ActionButtonRow` with `button` children. Give every child the same `size` (`sm` or `dense`).
2. Set `align`: `start` (default) for a toolbar, `end` for a footer, `between` when there is a left group and a right group.
3. Pass `trailingLink` for a single node that sits at the far right edge in any alignment. A ghost `button` or a plain anchor styled as a link both work.
4. Set `dense` in a narrow column. It lets the row wrap instead of overflowing; the gap is the same 6px in both modes.
5. When the row is a named set of controls, add `role="group"` and an `aria-label` on the row so assistive technology announces it as one thing.

## Heuristics

- One filled (default variant) button per row. The others are `outline`, `secondary` or `ghost`.
- Order follows frequency and consequence: the common, safe actions first; a destructive action last, never between two safe ones.
- A row stays on one line in the default mode. When labels would wrap or truncate, cut an action rather than shrinking the text.
- The trailing slot holds the one item that is not an action: a link to a fuller view.
- The row never carries a status colour. Colour belongs to the action it describes (the `destructive` variant), not to the row.

## Content

- Each action is a verb-led label in sentence case, one to three words, no trailing punctuation ("Export log").
- An icon-only action carries an `aria-label` naming the action and its object.
- The trailing link is a noun phrase naming the destination, not a verb.

## Accessibility

- The row is a plain `div` with no role. Add `role="group"` and `aria-label` when the set has a name. Reserve `role="toolbar"` for rows where the consumer also implements arrow-key focus movement; without it, `group` is the honest role.
- Focus order is DOM order. `trailingLink` renders last, so it is the last tab stop regardless of `align`.
- Every child meets the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size). `button` sizes `sm` (32px) and `dense` (34px) both clear it; do not override child heights downward.
- The row does not hide itself on rest. If a consumer reveals a row on hover, the same rule must reveal it on `:focus-within`.
