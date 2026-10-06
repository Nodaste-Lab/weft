---
related:
  - section-block
  - hud-list-row
  - signal-group-collapsible
  - empty-state
  - dot
---

# Tier group

## Purpose

A bordered section on an operator board that groups action rows by what the reader must do next: blocked, awaiting, or for information. It owns the named `section`, the accented header with the tier's label, an optional subtitle and count, and the rule that an empty tier is not drawn at all. The rows inside are the consumer's, normally `hud-list-row`.

## When to use

- A board that ranks items by urgency across several sources and shows the urgent tier first.
- A list where the reader's question is "what needs me", not "what type is this".

## When not to use

- Grouping by type, project or date. Use `section-block` for a plain section, or `signal-group-collapsible` when groups collapse.
- A single list with no tiers. The header and border add nothing; render the rows.
- A tier with no rows. The component returns `null`; a board with nothing in any tier shows one `empty-state`, not three empty tiers.
- A count on its own. Use `stat-row` with a `dot` in the compact board variant.

## How to use

1. Render `TierGroup` with `urgency` (`blocked`, `awaiting` or `fyi`) and `label`. `label` is both the visible heading and the section's accessible name.
2. Pass the rows as `children`. If no child would paint (null, false, `0`, an empty string or an empty fragment), nothing renders.
3. `count` adds a mono pill at the right of the header; `subtitle` adds a muted phrase after the label ("act now", "in progress").
4. Order tiers blocked, awaiting, fyi. The urgency sets `data-urgency`, the border colour and the header fill.
5. The root is a `section` with `aria-label`; it accepts native `section` props. The plain-CSS counterpart is `.weft-tier-group` with `.is-blocked`, `.is-awaiting` and `.is-fyi`.

## Heuristics

- Urgency is the state of the tier, drawn as a border and header tint. The label says it in words; blocked is still "Blocked" with the colour removed (WCAG 1.4.1 use of colour).
- Three tiers at most. A fourth urgency is a sign the model, not the board, needs changing.
- Never draw an empty tier. An empty bordered box reads as "all clear" when the data may not have loaded; the component guards this, and the consumer should not work around it with a placeholder row.
- The count matches the rows shown. If rows are filtered or paged, the count is the visible number or the header says "3 of 12".
- Rows that open a detail are real buttons inside the tier; the header is not a control. A tier does not collapse; use `signal-group-collapsible` where collapsing is wanted.

## Content

- Labels: one word or two, sentence case: "Blocked", "Awaiting", "For information". The showcase's "FYI" is an abbreviation the surface may keep if its readers use it.
- Subtitle: a short lower case phrase that says what the tier asks of the reader: "act now", "in progress". No full stop.
- Count: an integer. Omit `count` rather than pass `0`; a zero tier is not rendered anyway.
- Row content follows `hud-list-row`.

## Accessibility

- The `section` has `aria-label`, so it is a named region landmark the reader can jump to (WCAG 1.3.1 info and relationships). The consumer keeps the number of tiers small; each one is a landmark.
- The visible label is plain text, not a heading element. A board that relies on heading navigation should put a heading at the board level, or the consumer can pass a heading in the first child.
- The count pill is text and reads after the label and subtitle: "Blocked act now 2".
- The tier itself is static. Rows inside it that act are the consumer's buttons with their own names and 24px targets (`--weft-touch-target`, WCAG 2.5.8 target size).
- The border and header tint use the semantic tokens at low alpha; a `dot` in a row or the header, with a label, carries the same state for readers who do not see the tint.
