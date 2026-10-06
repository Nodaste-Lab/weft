---
related:
  - badge
  - eyebrow-label
  - chip
---

# Command category tag

## Purpose

A small bold text label that names the category a quick command belongs to in a reference list. It owns the mapping from tone (danger, positive, warning, info, bulk, muted) to text colour and the semibold weight. It has no fill, no border and no interactivity.

## When to use

- A legend or reference list of quick commands, where each row leads with its category.
- A category word inside a dense row where a filled `badge` would be too heavy.

## When not to use

- A status or a count. Use `badge`.
- A tag the user can remove or toggle. Use `chip`.
- A section heading above a group of rows. Use `eyebrow-label`.

## How to use

1. Render `CommandCategoryTag` with a `tone` and the category word as `children`.
2. Keep the category-to-tone mapping in one place so the same category is always the same tone.
3. Place the tag in the same position in every row, leading, so the column scans.

## Heuristics

- One tone per category, everywhere. A category that changes colour between surfaces is two categories to the reader.
- The word is the signal and the colour reinforces it. A tag with no text is not a tag.
- Tones mean kinds of effect (danger, positive, warning, info, bulk). They never mean a person.
- Keep the list of categories short; the tones available cap it at six.

## Content

- One word, sentence case ("Damage", "Heal", "Condition", "Bulk", "Turn").
- No punctuation, no trailing colon; the layout separates the tag from the command.
- The tone name is never the copy. "Warning" is a tone; "Condition" is a category.

## Accessibility

- Renders a `<span>` with no role; the word is read as text in the row.
- The category is carried by the word, so it survives with colour removed (WCAG 1.4.1 use of colour).
- The tone tokens are text colours; confirm each meets 4.5:1 on the surface it sits on, in every palette (WCAG 1.4.3 contrast).
- Not focusable and not a target. Do not attach a tooltip to it.
