---
related:
  - content-viewer
  - markdown-viewer
  - code-block
---

# HTML viewer

## Purpose

A read-only viewer for an HTML string. It renders the markup inside an iframe with an empty `sandbox` and a strict script-free content security policy, so agent-produced or third-party markup displays without running scripts, navigating, making network requests or reaching the host page. The chrome (Rendered / Source toggle, copy, empty state) comes from `content-viewer`; this component owns the frame, its document wrapper and its base styles.

## When to use

- HTML written by an agent or another party that should be seen, not trusted.
- A preview of a document body whose source format is HTML.

## When not to use

- Markdown. Use `markdown-viewer`.
- Markup the app authored itself. Render it directly.
- Code to read rather than render. Use `code-block`.
- Content that needs scripts, working links or forms. The frame denies all three by design; there is no Weft alternative.

## How to use

1. Render `HtmlViewer` with `html`.
2. Set `frameTitle` to say what the frame shows; the default is "HTML preview".
3. Set `emptyLabel` for the blank case; the default is "No HTML to display".
4. Pass `showSourceToggle` or `showCopy` as `false` to drop that control.
5. Give it a height. The frame fills the body and is at least 256px (`min-h-64`); content scrolls inside the frame.
6. `buildHtmlViewerSrcDoc(html)` is exported for tests or a second renderer that needs the same wrapper.

## Heuristics

- Markup, inline styles, data-URI images, media and fonts render. Scripts, fetches, form submission, navigation and external resources are denied.
- The frame declares `color-scheme: light dark` and uses `CanvasText` and `AccentColor`, so plain markup follows the viewer's theme.
- The frame does not size to its content, because no script can report the height. The consumer sets the height.
- The Source view shows the string exactly as passed, before the wrapper is added.

## Content

- `frameTitle` describes the content ("Plan preview", "Agent reply"), not the mechanism. Never "iframe".
- `emptyLabel` names what is missing, sentence case, and is never fixture text.

## Accessibility

- The iframe carries `title={frameTitle}`, which is its accessible name (WCAG 4.1.2 name, role, value; technique H64). Override the default per use so two frames on a page are told apart.
- The frame is in the tab order and its content is read like a document: headings, lists and links inside are exposed as such.
- Links and buttons inside the frame look interactive and do nothing, because navigation and scripts are denied. Tell the reader where the live version is, outside the frame.
- The frame's text is 13px on a transparent ground; contrast depends on the host surface behind it.
- Motion inside the frame is the markup author's CSS; the viewer cannot enforce `prefers-reduced-motion` on it.
