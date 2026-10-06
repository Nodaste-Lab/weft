---
related:
  - section-block
  - collapsible
  - text-content
  - button
---

# Section item

## Purpose

One foldable part of a generated response: a list item with a full-width trigger carrying a label and an optional meta value, and a body that opens beneath it. It owns the bordered row, the trigger built on `button`, the meta slot and the open state. It is the row `section-block` composes and can be used alone inside a consumer-owned list.

## When to use

- A single foldable part of generated output inside a list the consumer already renders.
- A row whose body is secondary and whose label and meta are enough to decide whether to open it.

## When not to use

- Several parts of one response. Use `section-block`, which supplies the list and the region.
- A disclosure with a custom shell. Use `collapsible`.
- A row that navigates or acts rather than expands. Use `list-item` or `hud-list-row`.
- A domain panel shell. Use `panel-block-shell`.

## How to use

1. Render `SectionItem` inside a `ul`. It is an `li`; a bare item outside a list is invalid markup.
2. Pass `id` (unique in the list), `label` (the trigger text) and `content` (the body).
3. Pass `meta` for a short trailing value (a count, a state word). It draws muted and small at the row's right.
4. Set `defaultOpen` to open the item on mount. State is internal after that; there is no controlled mode.
5. Give `content` a readable component such as `text-content` so the body keeps its measure and size.

## Heuristics

- The label is the part's name; the meta is a fact about it. Neither restates the other.
- Open the item the person should read first and no others.
- The trigger is the whole row. Do not add a second control inside it; put row actions after the item, not in it.
- State reads from `data-open` on the row and `aria-expanded` on the trigger, not from colour.
- The body is kept in the DOM when closed and hidden with `hidden`, so it is searchable by the consumer but not by the browser's find.

## Content

- Label: sentence case noun phrase ("Summary", "Open questions"), no trailing punctuation.
- Meta: a count with its noun ("2 notes") or a one-word state ("Ready"); never a sentence.
- Body: short paragraphs or a list; the first line should answer what the label promised.

## Accessibility

- The trigger is a `button` with `aria-expanded` and `aria-controls` pointing at the body; Enter and Space toggle it.
- The body is force-mounted and toggled with `hidden`, so assistive technology sees it only when open.
- The row is an `li`; the consumer's `ul` needs a name (`aria-label`) so the list is announced with its purpose.
- The trigger is full width, built on `button`, and clears the 24px floor (`--weft-touch-target`).
- Focus on the trigger shows the global Focus Ring through `button`.
- No animation on open or close; nothing to collapse under `prefers-reduced-motion: reduce`.
