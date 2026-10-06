---
related:
  - panel-block-shell
  - settings-module-shell
  - sticky
  - stack
---

# Card

## Purpose

A neutral bordered container for one unit of content. It owns the surface (paper fill, 1px rule, card radius), the slots (header with title, description and a top-right action; content; footer) and a density axis. `density="compact"` tightens header, content and footer padding together through context, so dense surfaces pack cards without per-slot overrides.

## When to use

- A self-contained unit a reader scans as one thing: a summary, a preview, a small group of related controls.
- Several equal units laid out in a grid; use `compact` when the surface is dense.

## When not to use

- A block inside a composed panel that needs a title strip, collapse or a selection ring. Use `panel-block-shell`.
- A settings module with an eyebrow, a description and a footer. Use `settings-module-shell`.
- A colour-keyed note on a board. Use `sticky`.
- Spacing only, with no border. Use `stack`.
- Rows of the same shape (results, logs). Use `table`, `list-block` or `hud-list-row`.

## How to use

1. Render `Card`, with `density` set to `default` or `compact`.
2. Inside `CardHeader`, put `CardTitle` (renders an `<h4>`), an optional `CardDescription` (a `<p>`) and an optional `CardAction`. When `CardAction` is present the header becomes a two-column grid and the action sits top-right.
3. Put the body in `CardContent`.
4. Put actions in `CardFooter`, a horizontal flex row.
5. To draw dividers, add `border-b` to `CardHeader` or `border-t` to `CardFooter`; the padding adjusts for the density.

## Heuristics

- One topic per card and one primary action. More than that is a panel, not a card.
- Cards in a group share slots, width and height. A group with mixed shapes reads as unrelated.
- Do not nest a card in a card. Nest `stack` or a separator instead.
- The card sits on the surface plane: a 1px rule, no shadow.
- Density is chosen for the surface, not per card.
- A whole-card click is only right when the card has one destination and no inner controls. Otherwise the title is the link and the body stays inert.

## Content

- Titles are the thing's name, sentence case, no trailing punctuation.
- A description is one sentence that says what the card holds, not how to use it.
- Footer actions are verb-first ("Open handoff", "Review").
- Every slot is empty until the consumer fills it; the primitive ships no default copy.

## Accessibility

- `CardTitle` is an `<h4>`. Check that the level fits the page outline; where it does not, render a heading of the right level inside `CardHeader` instead.
- The card is a plain `div`. Give it `role="region"` and `aria-labelledby` only when a reader would navigate to it as a section.
- Actions in `CardAction` and `CardFooter` are real buttons or links with their own names. The global focus ring applies.
- Hover-revealed actions also appear on `:focus-within`.
- Footer buttons meet the 24px floor (`--weft-touch-target`); `Button size="sm"` is 32px (WCAG 2.5.8 target size).
