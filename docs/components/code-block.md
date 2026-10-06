---
related:
  - content-viewer
  - markdown-renderer
  - copyable-ref
---

# Code block

## Purpose

A display-only surface for plain text code: a generated command, a diagnostic, a config fragment. It owns the header (label, language tag, copy button), the `<pre>` body, wrap versus horizontal scroll, and two densities. It does not parse Markdown, highlight syntax or sanitise anything; it shows the string it is given.

## When to use

- A command the reader will run, shown exactly as it should be typed.
- Diagnostic or log output that is already safe plain text.
- The source view inside `content-viewer`.

## When not to use

- Markdown that should render. Use `markdown-renderer`.
- A short identifier or URI to copy from a row. Use `copyable-ref`.
- HTML that should render. Use `html-viewer`.
- Code the user edits. Use `textarea`.

## How to use

1. Render `CodeBlock` with `code`. The header appears only when `label`, `language` or `onCopy` is set.
2. Set `label` to say what the code is and `language` to a lowercase id such as `shell`, `json` or `text`.
3. Pass `onCopy` to render the copy button; it is called with `code`. Name the button with `copyLabel` (default "Copy code").
4. Leave `wrap` off for commands, which scroll horizontally. Turn it on for prose-like output such as diagnostics.
5. Use `density="compact"` inside dense panels.

## Heuristics

- A command never wraps; a wrapped command is a different command. Diagnostics and messages wrap.
- The copy action copies the `code` string and nothing else: no prompt characters, no label, no trailing newline added by the component.
- The header label is short; the language tag is one token and is drawn in caps by the component.
- Long output is capped by the consumer with a height on the block, and the body scrolls. There is no built-in "show more".
- Code is correct as shown. A reader copies what they see.

## Content

- `label` names the thing ("Install command", "Diagnostic output"), sentence case.
- `language` is a lowercase short id. Pass `text` for output that is not code.
- `copyLabel` reads "Copy" plus what is copied ("Copy install command").
- `code` is the exact string, with no `$` or `>` prompt prefixes and no placeholder text.

## Accessibility

- The copy control is a real `button` named by `copyLabel`, 28px tall, above the `--weft-touch-target` floor.
- The component gives no copied feedback of its own. The consumer announces the result in `onCopy`, by a toast or a swapped label in a live region, and leaves focus on the button (WCAG 4.1.3 status messages).
- The `<pre>` scrolls horizontally when `wrap` is off. A scroll region that holds no focusable content is not reachable by keyboard in every browser; when output can overflow, the consumer adds `tabIndex={0}` and an accessible name to the block (WCAG 2.1.1 keyboard).
- The language tag is a label, not a status; it is plain text and is read as such.
- Mono text at 11px (compact) or 12px uses `--hud-text-2` on the raised surface; do not lower it further.
