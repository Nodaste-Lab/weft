---
related:
  - text-content
  - eyebrow-label
  - label
  - badge
---

# Meta caption

## Purpose

A muted 10px micro-label for secondary metadata beside a row title: a relative time, a count, a state word. It is set in the sans face, in the tertiary text tone, and does not wrap. It owns the type treatment only.

## When to use

- A relative time ("2h ago", "just now") after a row title.
- A short state word ("Editing") or a count ("3 notes") next to a primary label.

## When not to use

- A section label. Use `eyebrow-label`.
- A readable sentence. Use `text-content` with `size="sm"` and `tone="muted"`.
- A caption for a form control. Use `label`.
- A count that needs emphasis or a colour. Use `badge`.
- The only text in a row. A row is not named by its caption.

## How to use

1. Render `HudMetaCaption` with short text as the child.
2. Place it after the primary label in a horizontal row with a small gap.
3. For an absolute time, render `<time dateTime="…">` as the child so the full value is available.

## Heuristics

- One caption per row, or two separated by a middle dot.
- It is 10px and muted, so it never carries a fact the reader must act on alone. The row's label or a badge does that.
- It does not wrap. Keep it under about twenty characters or it overflows the row.
- Nothing interactive goes inside.

## Content

- Relative times use short units ("2m ago", "3h ago", "4d ago"), consistent across the surface.
- Sentence case, no trailing punctuation.
- Counts are a digit and a noun ("3 notes").

## Accessibility

- A `span` with no role.
- The muted tone must still meet 4.5:1 against its surface (WCAG 1.4.3 contrast); check the tone on tinted rows.
- WCAG sets no minimum text size, but 10px text must still scale to 200% without loss (WCAG 1.4.4 resize text). The px-to-rem migration is deferred in the accessibility assessment.
- A state word ("Editing") is text, so it survives colour removal.
- A relative time pairs with the absolute time through `<time>` or a tooltip.
