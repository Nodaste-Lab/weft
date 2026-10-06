---
related:
  - button
  - toggle
  - toggle-group
  - separator
  - panel-header
---

# Toolbar

## Purpose

A horizontal strip with `role="toolbar"` for a group of controls that act on the content beside it. It owns the strip: a rule on top or bottom, justification and density. Buttons, toggles, captions and separators compose inside it.

## When to use

- Three or more related controls above or below a viewer, a code block or a document: a view switch, copy, download.

## When not to use

- A panel's title and close control. Use `panel-header`.
- One or two buttons. Use `action-button-row` or `stack`; the toolbar role is for a group.
- A single set of exclusive view modes with nothing else. Use `toggle-group` on its own.
- A form's submit row. Use the dialog or form footer.

## How to use

1. Render `Toolbar` with `aria-label` naming what the controls act on.
2. Set `divider` (`top`, `bottom`, `none`), `justify` (`start`, `between`, `end`, `center`) and `density` (`compact`, `default`, `spacious`).
3. Compose `button`, `toggle` and `toggle-group` as children. Put a vertical `separator` between groups. A caption (a file name) can sit as plain text.
4. The `role` prop defaults to `toolbar`. For fewer than three controls, pass `role="group"` or no role so the strip is not announced as a toolbar.

## Heuristics

- One density per strip; controls share a height.
- Captions are not controls. Put them at the far end, in the dense-info register.
- Icon-only buttons have names. A toolbar of unnamed icons is a row of "button".
- The strip is one row. A toolbar that wraps is two toolbars.
- A sticky toolbar is a reflow exception for editing surfaces, but keep it to one row (WCAG 1.4.10 reflow).

## Content

- `aria-label` names the content, not the widget: "Document actions", "Content view actions".
- Button labels are verb-first, sentence case ("Copy").
- A file name caption is in the mono face, as the source names it.

## Accessibility

- Ships: `role="toolbar"`. The consumer supplies `aria-label` (WCAG 4.1.2 name, role, value).
- Toggles carry `aria-pressed`; `toggle-group` items carry their own state.
- The toolbar pattern expects one Tab stop with arrow keys moving between controls. The primitive does not implement a roving tabindex; each control is its own Tab stop. Keep the strip short so the Tab count stays small.
- Every control meets the 24px floor (`--weft-touch-target`). The global focus ring applies.
- Horizontal is the default orientation, so `aria-orientation` is not needed.
