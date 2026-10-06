---
related:
  - toolbar
  - settings-module-shell
  - sheet
  - dialog
---

# Panel header

## Purpose

The top strip of a panel: a title with an optional icon, an actions slot and a dismiss button. `size="board"` is a taller strip (46px, larger title) for a full-width board or drawer; the title reads the size from context so the consumer sets it once. It owns the strip layout only; each panel composes its own actions.

## When to use

- The top of any panel, drawer or board that has a name and may be closed.
- A drawer that opens over a board and needs a close control at the right.

## When not to use

- A row of view toggles or document actions under the title. Use `toolbar`.
- The header of a settings module (eyebrow, title, description). Use `settings-module-shell`.
- A dialog's title. Use the dialog's own header parts.
- A section inside the panel body. Use `panel-block-shell`.

## How to use

1. Render `PanelHeader`, with `size="board"` for the board treatment.
2. Put `PanelHeaderTitle` first. Pass a 14px icon through `icon`; the text truncates on one line.
3. Put `PanelHeaderActions` last, with buttons inside. `PanelHeaderDismiss` goes at the end of the actions and takes `onClick`.
4. In the board size, use `Button size="dense"` for actions so the row heights match.
5. Leave `size` off `PanelHeaderTitle`; it inherits. Override only when a title must differ from its strip.

## Heuristics

- One title. The header is the panel's name, not a place for status.
- Dismiss is always the rightmost control.
- Two or three actions at most. More belong in a menu or a toolbar below.
- The title truncates rather than wraps. Short names survive narrow panels.
- The header does not scroll with the body.
- Closing returns focus to whatever opened the panel.

## Content

- The title is the panel's name in sentence case ("Signal inbox", "Operator board"), no trailing punctuation.
- Action labels are verb-first ("Refresh").
- The dismiss button ships the name "Close panel". When more than one panel can be open, pass `aria-label` naming the panel ("Close signal inbox").

## Accessibility

- `PanelHeaderTitle` is a `div`. Put a heading element of the right level inside it when the panel is a section of the page outline.
- Ships: `PanelHeaderDismiss` is a real button, 24×24 (`size-6`), named "Close panel", with a visible focus ring. That meets the 24px floor (`--weft-touch-target`, WCAG 2.5.8) with no margin to spare; do not shrink it.
- The icon slot is decorative. Pass an icon with `aria-hidden` so the title is read once.
- Every action in `PanelHeaderActions` has a name; icon-only buttons take `aria-label`.
- Escape to close belongs to the container (`sheet`, `dialog`), not the header.
