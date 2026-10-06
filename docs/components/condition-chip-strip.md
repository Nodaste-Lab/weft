---
related:
  - chip
  - add-item-button
  - period-chip-row
  - badge
---

# Condition chip strip

## Purpose

A wrapping row that holds removable chips and an add control at the end. It owns only the layout: flex wrap and a 4px gap. The chips and the add control own their own semantics.

## When to use

- A set of applied conditions, filters or tags that grows and shrinks, with a way to add another.
- Any row of `chip` items that should wrap to a new line rather than scroll.

## When not to use

- A selectable set of periods or options. Use `period-chip-row` or `pill-toggle-group`.
- A fixed set of statuses that the user cannot change. Use a row of `badge`.
- One chip on its own. Place it inline.

## How to use

1. Render `ConditionChipStrip` and put each `chip` with `onRemove` inside it, in a stable order.
2. Put the add control last: `add-item-button` or a small `button` labelled "Add condition".
3. When there are no chips, render the strip with only the add control. Do not render a placeholder chip.
4. When the strip stands alone, pass `role="group"` and an `aria-label` through its props so the set has a name.

## Heuristics

- Order is stable, usually insertion order. A chip does not move when another is removed.
- The strip wraps; it never scrolls horizontally. The add control follows the last chip, wherever that lands.
- Empty is honest: no chips and one add control.
- The strip does not cap the count. The consumer caps it, or lets it wrap.

## Content

- Chip labels follow `chip`: sentence case, short, as written for tokens.
- The add control is a verb phrase in sentence case ("Add condition"). A plus glyph beside it is decorative; the text stays.

## Accessibility

- A plain `<div>`; the group name comes from the consumer's `role="group"` and `aria-label`.
- DOM order is visual order, so a wrapped strip reads in the same order it is seen (WCAG 1.3.2 meaningful sequence).
- Each chip's remove button and the add control meet the 24px `--weft-touch-target` floor. A 28px add control (`h-7`) clears it; `min-h-0` on a smaller one does not.
- After a chip is removed, move focus to the next chip's remove button, or to the add control when none remains (WCAG 2.4.3 focus order).
