---
related:
  - metric-tile
  - dot
  - badge
---

# Stat row

## Purpose

A label-left, value-right row for compact readouts: participant counts, source status summaries, detail sections in a recap. It owns the two-column layout, the muted label and medium-weight value, an optional hint after the value, and a `board` variant with a leading slot for a status dot. Stacked rows make a small key-value panel.

## When to use

- A list of facts the reader scans top to bottom, where labels vary and values are often text ("2m ago", "Owner").
- The compact variant of an operator board panel: a count per tier, with a `dot` carrying the tier's tone.

## When not to use

- A headline number the reader should see first. Use `metric-tile`, which stacks the label over a large value.
- A count on a row or tab. Use `badge`.
- Tabular data with more than two columns or that the reader compares across rows. Use `table`.
- Terms and definitions in body copy. Use a description list in `text-content`.

## How to use

1. Render `StatRow` with `label` and `value`. Both are required; `value` accepts a string, a number or a node such as a `badge`.
2. `hint` renders a small muted note after the value: a unit, a qualifier ("indexed"), a delta.
3. `variant="board"` left-aligns the label at full width and adds the `leading` slot, which takes a `dot` or an icon. `leading` is ignored in the default variant.
4. Stack rows directly in a bordered container. Each row carries its own vertical padding; no separator is rendered between rows.
5. The root is a `div` with `data-slot="stat-row"` and `data-variant`; it accepts native `div` props.

## Heuristics

- Labels in one panel share one register. Under the casing rule, stat-row labels in a metadata panel are the dense-info register (mono caps); a panel does not mix a caps label with a sentence-case one. The component does not transform case, so the consumer passes the label in the register the panel uses.
- The value is the fact; the hint qualifies it. "8" with hint "indexed", not "8 indexed" as the value.
- Colour on a stat row means the state of the fact, carried by the `dot` in the leading slot. The label and value stay in the foreground tokens.
- The label truncates; the value does not. Long labels are a sign the row is doing a sentence's job.
- Rows are not interactive. A fact that opens something is a row in `hud-list-row` or a link in the value slot, with its own name and target.

## Content

- Labels are short nouns: "Sources", "Open loops", "Updated". No colon; the layout separates label from value.
- Values: integers as written, times as relative ("2m ago") or absolute per the surface's convention, units in the hint.
- Honest empties: a fact with no value shows a dash or "Never" in the value slot. A row whose fact does not apply to this item is left out, not shown as "n/a".
- Hints are lower case fragments, no full stop.

## Accessibility

- The row renders as a `div` with the label and value as sibling `span`s, read in order. It is not a `dl`; a panel that needs term and definition semantics must wrap the rows, or supply them, itself (WCAG 1.3.1 info and relationships).
- The leading `dot` is decorative by default. Where the dot is the only carrier of a state, the consumer passes a label to `dot` so the state is read (WCAG 1.4.1 use of colour).
- The truncated label keeps its full text in the accessible name; the consumer should keep labels short enough not to truncate at the panel's narrowest width.
- Static content: no focus, no target-size requirement. Interactive content placed in `value` brings its own name and 24px target (`--weft-touch-target`, WCAG 2.5.8 target size).
