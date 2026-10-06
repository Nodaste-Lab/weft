---
related:
  - html-viewer
  - markdown-viewer
  - code-block
  - empty-state
---

# Content viewer

## Purpose

The read-only shell shared by the format viewers. It owns the toolbar (a Rendered / Source toggle and a Copy action), the empty state, the scrolling body and the Source view, which is a `code-block` of the raw string. The rendered representation is supplied as `children`, so each format plugs in its own renderer and keeps one shape.

## When to use

- Building a viewer for a new format, so it matches `html-viewer` and `markdown-viewer`.
- Any surface that shows content passed in and lets the reader see or copy its source.

## When not to use

- HTML. Use `html-viewer`.
- Markdown. Use `markdown-viewer`.
- Plain code with no rendered form. Use `code-block`.
- Content the user edits. Use `textarea`.

## How to use

1. Render `ContentViewer` with `source` (the raw string) and the rendered output as `children`.
2. Set `sourceLanguage` so the Source view's `code-block` carries the right tag.
3. Hide chrome with `showSourceToggle={false}` or `showCopy={false}`; the toolbar disappears when neither remains or when `source` is blank.
4. Start on the raw string with `defaultView="source"` when that is what the reader came for.
5. Pass `onCopySource` to be told when the source was copied; the component writes to the clipboard itself.
6. Give the viewer a height. The root is a `min-h-0` flex column and the body scrolls inside it.

## Heuristics

- The source is the truth and the rendered view is derived from it. Copy copies the source, never the rendered text.
- The toggle switches a view; it is not an edit mode and nothing is written.
- Blank source shows an `empty-state` and no toolbar. There is nothing to toggle or copy.
- Both views sit in the same box at the same height so switching does not move the page.

## Content

- The toggle labels are fixed: "Rendered" and "Source".
- `emptyLabel` is sentence case and names the kind of thing that is missing ("No HTML to display"). The default is "Nothing to display". It is never fixture text.
- The copy action's name is "Copy source".

## Accessibility

- The toggle is a `role="group"` named "Choose view" holding two buttons that carry `aria-pressed`, so the current view is readable without the fill (WCAG 4.1.2 name, role, value).
- The copy control is a `button` named "Copy source", 28px tall, above the `--weft-touch-target` floor.
- The component gives no copied feedback. The consumer announces the result from `onCopySource` in a live region (WCAG 4.1.3 status messages). `copyable-ref` shows the shape. Open.
- The body is `overflow: auto`. When the rendered content holds nothing focusable, the consumer adds `tabIndex={0}` and a name so the scroll region is reachable by keyboard (WCAG 2.1.1 keyboard).
- The empty state is the `empty-state` primitive and takes its heading from `emptyLabel`.
