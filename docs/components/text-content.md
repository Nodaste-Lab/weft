---
related:
  - hud-meta-caption
  - markdown-renderer
  - eyebrow-label
  - callout
---

# Text content

## Purpose

The typography for readable prose in a panel: generated copy, explanations, ledes. It renders a `<p>` (or the child element with `asChild`) with a bounded size, weight, tone and measure. It owns the type treatment only; headings, lists, quotes and captions keep their own semantics at the consumer.

## When to use

- Paragraphs of generated or explanatory text inside a panel or response.
- A heading, list item or quote that should share the prose treatment, through `asChild`.

## When not to use

- Markdown from a model. Use `markdown-renderer` or `markdown-viewer`.
- A timestamp or count beside a title. Use `hud-meta-caption`.
- A section label. Use `eyebrow-label`.
- A message with a state (warning, error, info). Use `callout` or `alert`, which carry the state.

## How to use

1. Render `TextContent` with the text as children. It is a `<p>` at 14px, regular weight, default tone, prose measure.
2. Set `size` (`sm` 12px, `default` 14px, `lg` 16px), `weight` (`regular`, `medium`, `semibold`) and `tone` (`default`, `muted`, `strong`, `accent`, `danger`).
3. Set `measure`: `narrow` 48ch, `default` 65ch, `wide` 72ch, or `none` for inline or constrained layouts.
4. Use `asChild` to render an `<h3>`, `<li>` or `<blockquote>` with the same treatment.

## Heuristics

- Measure stays between about 45 and 75 characters for running text. `none` is for short strings, not paragraphs.
- Tone carries no meaning on its own. `danger` text says what is wrong; `accent` text is accented because of what it says.
- One size per block. `lg` is a lede or a heading through `asChild`, not body text.
- Do not nest a `TextContent` in a `TextContent`; a `<p>` cannot contain a `<p>`.
- Short paragraphs. Generated copy reads better in three sentences than in ten.

## Content

- Sentence case, full sentences, full stops.
- Plain language. Generated text is shown as written; the surface marks it as generated elsewhere (an eyebrow, a badge), not through tone.
- No fixture text ships.

## Accessibility

- A `<p>` by default; `asChild` keeps the child's element and its semantics.
- Tone colours meet 4.5:1 on their surfaces per the accessibility assessment; `accent` and `danger` are not the only carrier of meaning (WCAG 1.4.1 use of colour).
- Measure is a `max-width`, so text reflows at 320px (WCAG 1.4.10 reflow).
- Sizes are in px; scaling to 200% works through zoom, and the rem migration is deferred (WCAG 1.4.4 resize text).
