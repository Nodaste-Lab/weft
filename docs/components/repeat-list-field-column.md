---
related:
  - label
  - input
  - form
  - add-item-button
---

# Repeat list field column

## Purpose

A label-above-control column for one field in a repeated row. It renders a `<label>` that wraps a 9px micro-label and the control, so clicking the label focuses the control and a native control takes the label as its name. It owns the column and the association; the control is the consumer's.

## When to use

- Grids of repeated rows with several small fields each (name, role, value) inside a dense panel.

## When not to use

- A standard field with a hint and a validation message. Use `form` with `label` and `input`.
- One standalone field. Use `label` and `input`.
- A read-only key and value. Use `stat-row`.

## How to use

1. Render `RepeatListFieldColumn` with `label` and exactly one form control as the child.
2. Lay the columns out with a CSS grid on the row so every row shares column widths.
3. End the list with `add-item-button`; give each row a remove control named with the row's identity.

## Heuristics

- One control per column. The wrapping label names the first labelable element, so a second control would go unnamed.
- Columns keep the same order in every row.
- The label is one or two words. The 9px label is read, not tapped; the control is the target.
- A placeholder is an example, not a label.

## Content

- Labels are sentence-case nouns ("Party member", "Role"), no colon.
- The gallery summary describes the label as uppercase; the source sets no transform. Author in sentence case.

## Accessibility

- The association is implicit through the wrapping `<label>`, which works for `input`, `select` and `textarea`.
- A custom control whose trigger is a button (a select trigger, a toggle) does not take its name from a wrapping label. Give it `aria-labelledby` pointing at the label span, or `aria-label`.
- Validation goes on the control: `aria-invalid` and `aria-describedby` to the message.
- The control meets the 24px floor (`--weft-touch-target`); a 32px input does.
- 9px text has no WCAG minimum, but it must still scale to 200% without loss (WCAG 1.4.4 resize text).
