---
related:
  - steps-item
  - progress
---

# Steps

## Purpose

An ordered sequence of three or more stages with one state per stage: complete, current, pending or error. It owns the `ol`, the ordering and numbering of rows, the connectors between them, the orientation and the density. Each row is a `steps-item`. It shows where a process is; it does not move the process along.

## When to use

- A linear process with a fixed set of stages the reader wants to place themselves in: a briefing pipeline, an import, an onboarding checklist.
- A status summary of a job that ran in stages, including one that failed.

## When not to use

- Fewer than three stages. Two stages are a sentence or a `progress` bar.
- A process whose stages change with the reader's answers, or that is not linear.
- A wizard where the reader clicks a step to go there. This component is display-only; the navigation lives in `tabs` or the wizard's own buttons, and `steps` only reflects it.
- A single percentage or an indeterminate wait. Use `progress`.

## How to use

1. Render `Steps` with `items`, an array of `{ id, label, description?, status?, meta? }`. Order in the array is the order shown; `id` must be unique.
2. Give the list a name with `aria-label` or `aria-labelledby` ("Briefing progress"). The component does not supply one.
3. `orientation` is `vertical` (default) or `horizontal`; `density` is `default` or `compact`. The values pass through to every row.
4. `showConnectors` (default `true`) draws a line between consecutive rows in vertical orientation. The last row never has one.
5. The root is an `ol` with `data-orientation`, `data-density` and `data-connectors`; it accepts native `ol` props.

## Heuristics

- Three to six stages. Past six, split the process or summarise stages the reader does not act on.
- Exactly one `current` row. Rows before it are `complete`; rows after it are `pending`. An `error` row replaces `current` when the process is stuck there.
- Vertical is the default because descriptions have room. Use horizontal only where the labels are short and the surface is wide; it wraps to a grid at narrow widths.
- Label stages by what happens, not by the screen that does it ("Review draft", not "Step 2").
- An empty `items` array renders an empty named list and no placeholder. A surface with nothing to show does not render `steps` at all.

## Content

- Labels: verb plus noun, one to three words, sentence case, no numbering in the text (the marker numbers it).
- Descriptions: one sentence each, consistent in tense across the list.
- The state words are fixed by `steps-item`: "Done", "Now", "Next", "Issue". Do not repeat them in `meta`.
- Fixture items ("Choose source", "Review draft") are illustrations. A consumer supplies its own stages from its process.

## Accessibility

- The list is a native `ol`; rows are `li` elements in source order, so count and position are announced (WCAG 1.3.1 info and relationships; WCAG 1.3.2 meaningful sequence).
- The consumer must name the list. An unnamed `ol` is announced as "list, 4 items" with no context (WCAG 2.4.6 headings and labels).
- The current row carries `aria-current="step"`; every state also has a visible word, so progress is readable without colour (WCAG 1.4.1 use of colour).
- Markers and connectors are hidden from assistive tech. The step number is visual only; position comes from the list.
- Nothing is focusable and nothing animates. A consumer that adds navigation does it with real links or buttons in its own markup, each with a 24px target (`--weft-touch-target`, WCAG 2.5.8 target size).
