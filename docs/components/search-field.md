---
related:
  - input
  - command
  - label
  - empty-state
---

# Search field

## Purpose

Search as a stated pattern rather than an `input` with a type attribute. It owns the hidden label that names the field, the leading search glyph, and a clear control that appears only when there is something to clear, keeps focus in the field, emits one change and one commit, and never submits a form. The results, and when they update, belong to the consumer.

## When to use

- Filtering a list, a rail or a table by typed text.
- A search box in a toolbar or panel that cannot carry a visible label.

## When not to use

- A command palette with its own list and keyboard model. Use `command`.
- A plain text value that is not a query. Use `input`.
- Filtering by a fixed set of states. Use `signal-filter-chip-group` or `toggle-group`.

## How to use

1. Render `SearchField` with `label`, the accessible name. It is required and is rendered as a hidden label; `aria-label` and `aria-labelledby` are not accepted.
2. Control the value with `value` and `onChange`, or seed it with `defaultValue`. The clear control appears when the value is non-empty and the field is neither disabled nor read-only.
3. Set `clearLabel` when one page has several searches, so each clear control says what it clears.
4. Pass `onCommit` to receive one signal per commit (blur, Enter, or the clear). Run the search there, or on `onChange` when the surface declares a live reason.
5. Use `size="sm"` in a rail or a dense toolbar.

## Heuristics

- The clear is a real `button type="button"`, so it can never submit the form around it.
- Clearing is the user's own action. It writes through the native setter and fires one input event, so controlled and uncontrolled consumers see the same single change.
- Focus stays in the field after a pointer clear. A keyboard clear reports one commit, not a blur and then a save.
- The glyph reads `currentColor`, so it follows the palette rather than a baked colour.
- Decide once whether results update on keystroke or on commit, and keep it the same across the app.
- A value that cannot be edited cannot be cleared. Disabled and read-only hide the control.

## Content

- `label` names what is searched: "Search projects", "Filter by owner". It is read, not seen, so it is a full phrase.
- Placeholder, if any, is an example query ("e.g. weft-board"), not an instruction.
- `clearLabel` defaults to "Clear search". Extend it when ambiguous: "Clear project search".
- An empty result is a sentence, not silence: "No projects match". That copy is the consumer's, in `empty-state`.

## Accessibility

- The hidden label gives the field its name (WCAG 1.3.1, 2.4.6). The search glyph is `aria-hidden`.
- The clear control is a named button, 24px square (`--weft-touch-target`, WCAG 2.5.8), reachable by Tab.
- The browser's own cancel button is hidden so there is one clear control, not two.
- Result counts and "no results" are exposed in a live region by the consumer (WCAG 4.1.3).
- The field is a real `input type="search"` in normal tab order. It inherits the states, focus ring and sizing of `input`.
