---
related:
  - button
  - list-block
  - empty-state
---

# Add item button

## Purpose

A full-width, dashed-border trigger that appends a row to a list the person edits in place. It owns the dashed boundary, the leading plus icon, the muted resting weight and the lift on hover and focus. It does not own what gets added or where focus goes afterwards.

## When to use

- At the foot of a list that is edited inline: tags, steps, decisions, rows of a repeating field.
- One per list, as the last row, so it reads as the next row.

## When not to use

- The main action of a page or dialog. Use `button`.
- Adding something that first needs a choice. Use `button` as the trigger of a `dropdown-menu` or `command`.
- Creating a new top-level thing such as a document. That is a `button` in the header or a group action in `sidebar`.

## How to use

1. Render `AddItemButton` as the last child of the list it extends. It is a native `button` with `type="button"`.
2. Pass the label as `children`. The component falls back to "Add item"; replace it with the thing being added ("Add tag").
3. Pass `icon` to replace the Plus. Keep it small (the default is 10px) and `aria-hidden`.
4. On click, append the row and move focus into the first editable control of the new row. The component does not do this.
5. Use `disabled` only when adding is impossible (the list is at its cap). Standard button props such as `aria-describedby` pass through, so a hint can explain the cap.

## Heuristics

- Resting weight follows frequency (input heuristic 1). The dashed border and muted text are the low-weight tier; hover and focus lift the border and text to the accent.
- Hover is never the only signifier (input heuristic 3). The dashed border is always drawn, so the control exists at rest, on touch and for the keyboard.
- Full width of the list, so the control is read as a row and not as a button floating under one.
- One per list. When several kinds of item can be added, one button opens a menu of kinds.
- The button never carries a status colour. An empty list is explained by the copy above it (`empty-state`), not by the button.

## Content

- "Add" plus a singular noun, sentence case: "Add decision". No plus sign in the text; the icon carries it.
- No trailing punctuation and no ellipsis, even when a form opens.
- The label names what is added, not where ("Add step", not "Add to list").

## Accessibility

- Native button: Enter and Space activate it, and the global focus ring shows on `:focus-visible`.
- The accessible name is the visible label. The icon has no text, so `children` must be text or the button needs an `aria-label`.
- Height is 28px at the 12px label (vertical padding plus line height), above the 24px floor (`--weft-touch-target`, WCAG 2.5.8). Do not reduce the padding.
- After an add, the consumer moves focus to the new row. If the add removes the button (cap reached), focus must land somewhere explicit.
- `disabled` uses native disabled, so the button leaves the tab order. When the person could fix the reason, keep it enabled and explain on click instead.
- The colour transition collapses under the global `prefers-reduced-motion` rule.
