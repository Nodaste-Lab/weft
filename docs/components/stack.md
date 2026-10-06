---
related:
  - card
  - separator
  - toolbar
  - period-chip-row
---

# Stack

## Purpose

A flex container with a direction, a gap from a fixed scale, alignment, justification and wrap. It has no chrome and no semantics; DOM order is the reading and keyboard order. Use it where a domain shell would add the wrong chrome.

## When to use

- Spacing and alignment between siblings: a label beside a control, a row of badges, a column of rows.
- A neutral layout inside a shell that already supplies the semantics.

## When not to use

- A list. Render `ul` and `li`; put a stack inside an item if needed.
- A strip of actions. Use `toolbar`.
- A bordered unit. Use `card`.
- A row of preset chips. Use `period-chip-row`.
- A two-dimensional layout. Use CSS grid.

## How to use

1. Render `Stack`. The default is vertical with the `md` gap.
2. Set `direction="horizontal"` for a row, with `align` (`start`, `center`, `end`, `stretch`, `baseline`) and `justify` (`start`, `center`, `end`, `between`, `around`, `evenly`).
3. Pick `gap` from the scale: `none` 0, `xs` 4px, `sm` 8px, `md` 12px, `lg` 16px, `xl` 24px.
4. Set `wrap` on a row that may overflow its width.
5. Nest stacks for different rhythms rather than mixing margins.

## Heuristics

- One gap per stack. Where two rhythms are needed, nest.
- The visual order is the DOM order. The primitive exposes no reverse or reorder, and consumers do not add one (WCAG 1.3.2 meaningful sequence, 2.4.3 focus order).
- Rows wrap below 320px rather than overflow (WCAG 1.4.10 reflow).
- Prefer the gap scale over ad hoc margins on children.

## Content

- None.

## Accessibility

- A `div` with no role. The consumer supplies list, navigation or group semantics where they apply.
- Keyboard order follows the DOM, so nothing in the stack needs tabindex management.
- Wrapping keeps content in one column at narrow widths.
