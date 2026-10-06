---
related:
  - markdown-renderer
  - content-viewer
  - html-viewer
  - code-block
---

# Markdown viewer

## Purpose

A read-only viewer for a Markdown string. It composes the shared `content-viewer` chrome (a rendered or source view toggle, a copy action, a scrolling body, an honest empty state) around `markdown-renderer`. It owns none of the parsing or safety policy; those stay in the renderer, and the viewer only decides which view is showing.

## When to use

- A document, note or generated reply the reader may want to inspect as source or copy whole: a draft before it is sent, an export preview, an agent's output.
- A bounded region that must scroll inside a panel rather than grow the panel.

## When not to use

- Markdown that is part of the surface and needs no toolbar. Use `markdown-renderer` on its own.
- An HTML string. Use `html-viewer`; the two share the same chrome so they look alike.
- Source code with no rendered form. Use `code-block`.
- An editable document. This viewer has no editing path.

## How to use

1. Render `MarkdownViewer` with `markdown` as the raw string. Give it a height or a flex parent; the body scrolls inside that box.
2. The toolbar shows a view toggle (`showSourceToggle`, default `true`) and a copy action (`showCopy`, default `true`). Set either to `false` to drop it; when both are off the toolbar is not rendered.
3. When `markdown` is empty or whitespace, the viewer renders `empty-state` with `emptyLabel`, which defaults to "No Markdown to display". Pass a label that names what is missing for this surface.
4. Source view renders the raw string through `code-block` with `language="markdown"` and wrapping on. Rendered view is `markdown-renderer` with its default padding.
5. The root accepts native `div` props. `data-view` reads `rendered`, `source` or `empty` for styling and tests.

## Heuristics

- Size the viewer, not its content. The chrome is `overflow-hidden` with a scrolling body, so a viewer without a height collapses or overflows its panel.
- Keep the toggle unless there is a reason to remove it. The source view is how a reader checks what a generated link or heading really was.
- One viewer per document. A list of items each with its own toolbar is noise; render list items with `markdown-renderer` and open one item in a viewer.
- The empty label is a fact about the surface ("No reply yet"), not an instruction and not fixture text.

## Content

- `emptyLabel` is sentence case, no trailing punctuation, and names the thing that is absent.
- The toggle options read "Rendered" and "Source". The copy action reads "Copy" with the accessible name "Copy source". These are fixed.
- Content rules follow `markdown-renderer`; the viewer adds no formatting of its own.

## Accessibility

- The view toggle is a `role="group"` named "Choose view" containing two toggle buttons with `aria-pressed`, so the current view is announced without reading a colour (WCAG 4.1.2 name, role, value; WCAG 1.4.1 use of colour).
- Copy is a real button with a stable accessible name. The viewer writes to the clipboard and calls `onCopySource` if the consumer wants to confirm the copy elsewhere; it does not announce success itself, so a surface that needs confirmation adds a status message (WCAG 4.1.3 status messages).
- The body is a scrollable region. The consumer must make it keyboard-reachable (for example `tabIndex={0}` with an accessible name) when the content holds no focusable element, or keyboard users cannot scroll it (WCAG 2.1.1 keyboard).
- Toolbar buttons are 28px tall, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- The rendered view inherits the semantics and link handling of `markdown-renderer`.
