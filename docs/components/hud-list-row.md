---
related:
  - status-icon-row
  - inline-edit-list-row
  - attention-ticket-card
  - stat-row
  - list-item
---

# HUD list row

## Purpose

The canonical list row: a leading slot, a body with up to three text levels (title, meta, project), and a trailing slot for actions. It owns the row frame (left accent stripe, density padding, divider, state tint), the five states (default, unread, overdue, resolved, active), two densities, and the choice of element (`div`, `button` or `li`). Specialised rows compose it with `frame={false}` and add one affordance each.

## When to use

- Any dense list where the chrome is the same and the body varies: signals, tickets, members, updates.
- A row that is itself the action (expand, open), rendered as a button.
- A row inside a `<ul>`, rendered as `li`.

## When not to use

- A label and a value. Use `stat-row`.
- A row led by an icon tile. Use `status-icon-row`.
- Text the user edits in place. Use `inline-edit-list-row`.
- A search hit with a relevance bar. Use `knowledge-search-result-row`.
- A row that expands to a thread. Use `attention-ticket-card`.

## How to use

1. Render `HudListRow` and put `HudListRowTitle`, `HudListRowMeta` and, when there is attribution, `HudListRowProject` in `children`, in that order.
2. Put a mark, icon or `avatar` in `leading`, and buttons or a `badge` in `trailing`.
3. Set `state` to the row's fact: `unread`, `overdue`, `resolved` or `active`. The stripe and tint follow.
4. For a row that is one action, pass `as="button"` and `onSelect`. For a row in a list, pass `as="li"`.
5. Set `density="compact"` in dense panels; `divider={false}` for the last row in a card; `interactive` for the hover fill on a row that only navigates on its trailing control.
6. Pass `frame={false}` when composing a new specialised row that brings its own spacing.

## Heuristics

- State is a fact of the row and the text says it too. The stripe and tint draw it; "2d overdue" in meta states it.
- A row has one primary action, and that is the row. Secondary actions live in `trailing`.
- When the row is a button, trailing controls go in a sibling overlay, as `attention-ticket-card` does. A button inside a button is a defect.
- The title is one line and truncates; `truncate={false}` only for a row that must show a full name.
- Meta is a line of short facts separated by a middle dot. Project is attribution, one level quieter.
- Trailing actions that appear on hover also appear on focus-within.

## Content

- The title is the thing's name as the user knows it, sentence case, no trailing punctuation.
- Meta facts are short and relative: "3h ago · In progress". Omit the meta line rather than show a placeholder.
- Honest empties: a row that is a fact shows "Never" or a dash; a row whose data does not apply leaves the line out.
- No fixture text as a default. Every text level is the consumer's.

## Accessibility

- `as="button"` renders a native `<button>`: Enter and Space fire `onSelect`, and the accessible name is the body text. Keep that text meaningful on its own.
- `as="div"` with `onSelect` attaches a click handler to a `div`, which no keyboard reaches. Use `as="button"`, or put the action on a control inside the row.
- `as="li"` must sit inside a `<ul>` or `<ol>` so the list is announced with its count.
- State is drawn by colour and carried by text (WCAG 1.4.1 use of colour). The stripe is 2px and is not relied on for meaning.
- An interactive row meets the 24px `--weft-touch-target` floor at both densities. Controls placed in `trailing` meet it on their own.
- Hover-revealed trailing controls are also revealed on `:focus-within` so a keyboard user reaches them.
