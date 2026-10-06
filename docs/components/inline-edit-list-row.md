---
related:
  - hud-list-row
  - textarea
  - input
  - add-item-button
---

# Inline edit list row

## Purpose

A row of free text the user edits in place. Idle, it shows the text with an optional index badge or leading icon and hover-revealed edit and delete controls. Editing, it swaps the text for a `textarea` that commits on blur. It composes `hud-list-row` with `frame={false}` and owns the edit behaviour: the commit boundary, the two-step Escape, and the empty value.

## When to use

- A list of short free-text items the user maintains in place: beats, notes, open questions.
- Items that need no form around them and no save button.

## When not to use

- A single-line rename. Use `input` with the inline variant.
- Several fields per item. Use `form` or `repeat-list-field-column`.
- A row that only displays. Use `hud-list-row`.
- A document. Use an editor.

## How to use

1. Render `InlineEditListRow` with `text`, `onUpdate` and `onDelete`.
2. Pass `showIndex` and `index` for a numbered list; the badge shows `index + 1`.
3. Pass `leadingIcon` for a kind marker and `italic` for a question or a draft.
4. Name the controls per item with `editAriaLabel` and `deleteAriaLabel`; the defaults are "Edit item" and "Delete item".
5. Set `rows` for the editor's height (default 2) and `as="li"` inside a `<ul>`.

## Heuristics

- Blur commits. Enter inserts a newline; it never commits, because the editor is multi-line.
- An emptied value is a value. Select all, delete, leave: the row commits "" and shows "Empty" so it stays clickable.
- Escape offers a discard, then performs it on the second press. Typing withdraws the offer. Nothing is lost while the user is not looking.
- Idle text and the editor share the same size and face, so entering edit does not jump the row.
- "Empty" is presentation, never the value; `onUpdate` receives "".

## Content

- `editAriaLabel` and `deleteAriaLabel` name the item ("Edit beat 3", "Delete beat 3").
- The idle placeholder "Empty" and the discard hint are fixed by the component.
- Text commits as typed. Only an all-whitespace draft is normalised, to "".

## Accessibility

- The editor is a `textarea` named by `editAriaLabel` and takes focus on open. While the discard offer is showing, it is described by the hint via `aria-describedby`.
- Escape is owned by the open editor and does not reach a parent dialog's dismiss handler. During IME composition it dismisses the candidate list, not the edit.
- The edit and delete controls are revealed on mouse enter only (opacity 0 and `pointer-events: none` otherwise), not on `:focus-within`; they measure about 14px (10px icon plus 2px padding), below the 24px `--weft-touch-target` floor. Open.
- After a commit, the editor unmounts and focus is not returned to the row. Open.
- Delete has no confirmation; the consumer provides undo or a confirm where the item matters.
