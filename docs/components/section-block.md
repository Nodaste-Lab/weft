---
related:
  - section-item
  - accordion
  - text-content
  - follow-up-block
  - list-block
---

# Section block

## Purpose

A container for a generated response that arrives in named parts (summary, risks, next steps) and composes one `section-item` per part. It owns the bordered raised panel, the optional title and description, and the labelled list that holds the items. It carries no chat state and knows nothing about where the response came from.

## When to use

- Generated output that a person reviews part by part before accepting or sharing it.
- A grouped read-only result where each part has a label, an optional meta value and a body that can be folded away.

## When not to use

- Hand-authored page sections. Use `accordion`.
- A single foldable part. Use `section-item` in the consumer's own list.
- Suggested follow-up prompts. Use `follow-up-block`.
- A plain list of items without disclosure. Use `list-block`.
- A panel shell for a domain feature with its own header and actions. Use `panel-block-shell` or `recap-section-shell`.

## How to use

1. Render `SectionBlock` with `items`, an array of `{ id, label, content, meta?, defaultOpen? }`. Each entry becomes a `section-item`; `id` must be unique in the block.
2. Pass `title` and `description` to draw the header. A string `title` also names the inner list.
3. When there is no string title, pass `aria-label` so the region and the list have a name.
4. Set `defaultOpen` on the one item the person should read first; leave the rest closed.
5. Give `content` real components (`text-content`, `list-block`), not raw strings, so the body keeps the readable measure.

## Heuristics

- Open what matters, fold the rest. One item open on arrival reads as a result; all items open reads as a wall.
- Labels are the part's name as the generator named it; meta is a count or a short state, not a second label.
- An empty `items` array renders the header and an empty list. The block never fills it with placeholder text; the consumer decides whether to show an `empty-state` instead.
- The block is one region. Nest it inside the panel that owns the response, not at page level, so the region count stays small.

## Content

- Title: sentence case, naming the response ("Generated brief"), no trailing punctuation.
- Description: one sentence, only when the title does not say what the block is for ("Grouped output for human review").
- Item labels: sentence case nouns ("Summary", "Risks"); meta: a short value ("2 notes", "1 blocker").

## Accessibility

- The root is a `section` with `role="region"`, named from a string `title` or from `aria-label`. Without one of these the region is unnamed; always provide one.
- The inner list is a `ul` with `role="list"` and the same name, so each item reads as "n of m".
- Each item's trigger exposes `aria-expanded` and `aria-controls` through `section-item`; Enter and Space toggle it.
- Item triggers are full-width `button`s at the 24px floor (`--weft-touch-target`).
- No animation on fold; nothing to collapse under `prefers-reduced-motion: reduce`.
- Folding does not need a live region; the state is on the trigger (WCAG 4.1.3 excludes disclosure).
