---
related:
  - steps
  - progress
---

# Steps item

## Purpose

One row of an ordered process: a numbered marker, a label, an optional description and metadata, a visible state word, and a connector to the next row. It owns the marker, the state vocabulary (complete, current, pending, error) and the `aria-current="step"` on the current row. It is display-only; `steps` composes it from data, and a consumer renders it directly only when rows need custom placement inside its own `ol`.

## When to use

- A hand-built ordered list where rows are interleaved with other content, or where one row needs a prop `steps` does not expose.
- Tests and showcases that need one row in a known state.

## When not to use

- A whole sequence from data. Use `steps`, which numbers rows, places connectors and keeps the `ol` semantics.
- A single completion bar or a percentage. Use `progress`.
- A step the reader can click to navigate. This item is not interactive and has no focus state.

## How to use

1. Render `StepsItem` inside an `ol` (with `list-none` and a name). Pass `id`, `label` and `index` (zero-based; the marker shows `index + 1`).
2. `status` is `complete`, `current`, `pending` (default) or `error`. The row sets `data-status` and, for `current`, `aria-current="step"`.
3. `description` renders a paragraph under the label; `meta` renders a small line under that for a date, an owner or a note.
4. `showConnector` draws the line to the next row. The parent decides, so the last row gets `false`. In `horizontal` orientation the connector is hidden.
5. `orientation` and `density` match the values the parent `steps` passes; set them the same on every row of one list.

## Heuristics

- Every state is visible as a word. The row prints "Done", "Now", "Next" or "Issue" beside the label, so the marker colour is never the only signal (WCAG 1.4.1 use of colour).
- The marker shows the step number, not an icon, in every state. Position in the sequence stays readable when the sequence is long.
- `error` is for a step that cannot proceed; it keeps its number and its place. Do not remove or reorder a failed step.
- `meta` is for a fact about the step ("Blocked until the vault reconnects" belongs in `description`; "Owner: Ana" or a date belongs in `meta`).
- Use the same density for every row of one list; the marker size changes with it.

## Content

- Label: one to three words, verb plus noun, sentence case, no trailing punctuation: "Choose source", "Review draft".
- Description: one sentence, sentence case, full stop. Say what the step does or why it is blocked.
- State words are fixed: "Done", "Now", "Next", "Issue".
- Meta: a short fragment, no full stop. Omit the slot rather than render "No date".

## Accessibility

- The row is a real `li`, so position and count are announced by the list (WCAG 1.3.1 info and relationships).
- The current row carries `aria-current="step"`. Only one row in a list should be `current`.
- The marker and connector are `aria-hidden`; the label and the state word are the accessible content, so the state is read without colour.
- The item has no focus and no target-size requirement. A consumer that wraps the label in a link or button gives that control the accessible name and the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- No motion is defined on the item.
