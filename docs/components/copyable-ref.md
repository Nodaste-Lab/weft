---
related:
  - code-block
  - source-pill
  - chip
---

# Copyable ref

## Purpose

A single-line canonical reference (an id, a URI, a path) with a copy button beside it. It owns the mono display that truncates, the button, the three copy states (idle, success, failure), the revert to idle after 1.5 seconds, and the live announcement of the result. A plain-CSS counterpart, `.weft-copyable-ref`, carries the same shape.

## When to use

- A reference the reader will paste somewhere else: a ticket id, a session reference, a resource URI.
- A row in a metadata panel whose value is an identifier rather than a fact to read.

## When not to use

- Several lines of text. Use `code-block`.
- A path or source shown for reading, with nothing to copy. Use `source-pill`.
- A removable token. Use `chip`.
- A reference that should navigate. Use a link.

## How to use

1. Render `CopyableRef` with `value`, the exact string to copy.
2. Set `label` to the noun that completes "Copy …": `label="ticket ID"` gives the button the name "Copy ticket ID". The default is "reference".
3. Pass `children` to show a shortened form of a long value. The display can be short; `value` is always whole.
4. In plain HTML, use `.weft-copyable-ref` with a `<code>` and a `.weft-copyable-ref-copy` button carrying its own `aria-label`.

## Heuristics

- The display may shorten; the copy never does. A shortened form keeps the head and the tail of the value so the reader can tell two references apart.
- Feedback is text, icon and colour together: "Copied" with a check, "Failed" with a cross. It reverts on its own.
- A failed copy is never silent.
- One reference per row. A list of references is a list of these, not one with several values.

## Content

- `label` is a lowercase noun phrase, because the component prefixes it with "Copy" ("Copy session ref").
- The value is shown as written. Identifiers keep their own casing under the dense-info register.
- The button text is fixed: "Copy", then "Copied" or "Failed".

## Accessibility

- The button is named `Copy {label}` and the name changes to "Copied" or "Failed" while the state lasts. The visible text sits in an `aria-live="polite" aria-atomic="true"` span, so the result is announced (WCAG 4.1.3 status messages).
- Icons are `aria-hidden`; the text carries the state, so it reads with colour removed (WCAG 1.4.1 use of colour).
- The button is `min-h-6`, the 24px `--weft-touch-target` floor, and shows a focus ring on `:focus-visible`. Focus stays on the button after a copy.
- Repeat clicks restart the revert timer, and unmount clears it, so no stale state is written.
- The `<code>` truncates with an ellipsis and is not focusable, so a long value is not fully readable on screen. Pass a `children` form that keeps head and tail when the reader needs to recognise it.
