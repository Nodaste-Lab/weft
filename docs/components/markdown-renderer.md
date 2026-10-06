---
related:
  - markdown-viewer
  - html-viewer
  - code-block
  - text-content
---

# Markdown renderer

## Purpose

A constrained renderer for a Markdown string that an app did not write itself: generated summaries, imported notes, agent replies. It owns the mapping from GitHub-flavoured Markdown to Weft typography and code blocks, and the safety policy that goes with untrusted text: raw HTML is stripped, links are protocol-filtered, images are replaced by their alt text. It does not own chrome, scrolling or a source view; `markdown-viewer` adds those.

## When to use

- Markdown produced at runtime that needs to read as part of the surface: a generated recap inside a panel, a note body inside a card.
- Any place a Markdown string must render without a toolbar, toggle or border around it.

## When not to use

- The reader also needs the raw source, a copy action or an empty state. Use `markdown-viewer`.
- The content is HTML, not Markdown. Use `html-viewer`, which sandboxes it in an iframe.
- A single code sample. Use `code-block` directly.
- Prose the app wrote itself and controls. Use `text-content`; a renderer adds parsing cost and a sanitising pass that static copy does not need.

## How to use

1. Render `MarkDownRenderer` with the `markdown` prop as the raw string. It accepts the native `div` props; `className` merges onto the root.
2. Headings, paragraphs and list items render through `text-content`; fenced code with a language or a line break renders through `code-block`; inline code renders as a styled `code` element.
3. Links that pass the protocol filter (`http:`, `https:`, `mailto:`, and relative or fragment paths) render as real anchors. Anything else renders as inert text in a `span` with `data-blocked-href`.
4. Images never load. The renderer emits `[image: alt text]` or `[image]` in their place.
5. Raw HTML tags and comments are removed before parsing, except inside fenced code where they are preserved as text. The renderer does not accept a plugin list or a custom sanitiser; keep richer policy outside it.

## Heuristics

- The consumer owns heading hierarchy. `h1` and `h2` render at the same size, so the surrounding page decides what level the content starts at and the Markdown should not skip levels (WCAG 1.3.1 info and relationships).
- Give the renderer a bounded width. Paragraphs use the wide measure of `text-content`; inside a narrow panel, the parent sets the limit.
- Do not strip or rewrite the Markdown before passing it in to work around a blocked element. If a surface needs images or embedded HTML, that is a different primitive, not a looser renderer.
- External links open in a new tab with `rel="noreferrer"`. Where that matters to the reader, say so in the surrounding copy, since the renderer cannot add "opens in new tab" to generated link text.
- Colour in rendered content is semantic only: link colour means "link", code chrome means "code". The renderer never colours text by author or source.

## Content

- The renderer displays what it is given. Any casing, punctuation or number formatting rule applies to the producer of the Markdown, not here.
- A blocked image shows its alt text in square brackets. Producers should write alt text that reads as a sentence fragment, sentence case, no trailing full stop.
- A blocked link keeps its link text and loses the underline. Producers should not rely on the destination to make the text meaningful (WCAG 2.4.4 link purpose).
- Empty input renders an empty container. The renderer ships no placeholder; a surface that needs one wraps it in `markdown-viewer` or supplies its own honest empty.

## Accessibility

- Semantic elements come from the Markdown: real `h1` to `h3`, `p`, `ul`, `ol`, `li`, `a` and `code`. Nothing is rendered as a styled `div` (WCAG 1.3.1 info and relationships).
- Safe links are focusable anchors with visible underlines, so a link is readable without colour (WCAG 1.4.1 use of colour).
- Blocked links are plain text, not disabled buttons, so a keyboard user is not stopped on a dead control.
- Inline code and headings read the foreground tokens, so contrast follows the palette (WCAG 1.4.3 contrast minimum).
- The consumer must ensure the first heading in the content continues the page outline, and must provide the accessible name for any region that wraps generated content.
