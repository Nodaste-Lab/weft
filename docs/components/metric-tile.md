---
related:
  - stat-row
  - badge
  - dot
---

# Metric tile

## Purpose

A small label-over-value tile for a headline number: a count, a total, a rate. It owns the stacked layout, the tone of the value (default, danger, warning, positive, muted, info), the value size and an optional hint line. It sits in clusters of two to six tiles at the top of a panel or board.

## When to use

- A cluster of counts that summarise a list below them: open, overdue, total.
- A number that must be read at a glance before the reader scans anything else on the surface.

## When not to use

- A list of labelled facts read in sequence, where the value is often text. Use `stat-row`, which puts the label left and the value right.
- A count attached to a row or a tab. Use `badge` with the count variant.
- A state with no number behind it. Use `badge` with a status variant, or `dot` beside a label.
- A trend over time. A tile holds one value; a chart holds a series.

## How to use

1. Render `MetricTile` with `label` and `value`. Both are required and accept any node, but a value is normally a number or a short formatted string.
2. Set `valueTone` to the meaning of the number: `danger` for overdue or failing, `warning` for due soon, `positive` for done or healthy, `muted` for a placeholder or zero, `info` for a neutral highlight. The root carries `data-tone` for tests and styling.
3. `valueSize` is `sm`, `md` (default) or `lg`. Use `lg` for the one number the surface is about and `md` for the rest.
4. `hint` adds a muted line under the value for the unit or the period ("this week", "of 40").
5. `density` is `compact`, `default` or `relaxed`; `orientation` is `column` (default) or `row`, which puts the label and value on one baseline for a narrow strip. `fullWidth` (default `true`) lets tiles share a flex row equally.

## Heuristics

- One tile is emphasised, the rest are plain. The reader's eye goes to the largest and strongest number; if every tile is `lg` and toned, none is.
- Tone means state, never identity. A red value says the count is a problem, not whose it is.
- A toned value still reads without its colour. The label ("Overdue") carries the meaning; the colour repeats it (WCAG 1.4.1 use of colour).
- Keep tiles in one row where they fit, and let them wrap at narrow widths rather than shrink below their content; the value uses tabular figures so columns of tiles align.
- A tile is not a button. If the number should open the filtered list, wrap the tile in a real link or button and give it a name that includes the label and value.

## Content

- Labels are short nouns, sentence case: "Open", "Overdue", "Total". The tile sets small caps styling, so write the label in sentence case and let the style apply.
- Values are integers or formatted numbers with the unit in the hint, not in the value ("12" over "12 items"). Use a thin space or a locale separator for thousands; avoid abbreviating below ten thousand.
- A zero is a real value and shows as "0" with `muted` tone when it means "nothing to do". A value that is unknown shows a dash, not "0".
- Hints are lower case fragments, no full stop: "this week", "of 40".

## Accessibility

- The tile renders a `div` with two `span` children. The label and value read in order, so a screen reader hears "Overdue 3". The consumer must give the cluster a heading or a named group so the numbers are found in context (WCAG 1.3.1 info and relationships).
- Tone is exposed as `data-tone`, not as an ARIA state; it is not announced. Where the state matters to a non-sighted reader, put it in the label or the hint.
- Text is set in the sans face at the base size for the value and 10px for the label and hint; the consumer must check 10px label contrast against the surface it sits on (WCAG 1.4.3 contrast minimum).
- The tile is static and has no focus or target-size requirement. A tile made interactive by the consumer must meet the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size) and carry a visible focus ring.
