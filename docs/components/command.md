---
related:
  - dialog
  - search-field
  - select
  - dropdown-menu
---

# Command

## Purpose

A keyboard-first searchable list: a filter input over grouped items with one highlighted row. It owns the input with its search icon, the scrolling list, groups with headings, items, separators and the empty message. Typing filters, the arrow keys move the highlight, Enter selects. It does not own the overlay: a palette composes `command` inside `dialog`.

## When to use

- A picker over many things (ten or more): panels, documents, people, commands.
- A quick-action palette opened by a global shortcut.
- A searchable catalogue inside a panel.

## When not to use

- Seven or fewer options. Use `select` or `dropdown-menu`.
- Free-text search over data, where the result is a results page rather than a chosen item. Use `search-field`.
- Navigation between sections. Use `sidebar` or `tabs`.

## How to use

1. Render `Command`, then `CommandInput` with an `aria-label` (or a visible label) and a `placeholder` naming what can be searched.
2. Put `CommandList` beneath it with `CommandGroup heading="…"` sections of `CommandItem value="…" onSelect={…}`. Add `CommandSeparator` between groups when the headings alone do not separate them.
3. Add `CommandEmpty` with the no-match message; it renders only when nothing matches.
4. For a controlled highlight, pass `value` and `onValueChange` on `Command`. For server-side results, pass `shouldFilter={false}` and filter the items yourself. Pass `loop` so the arrow keys wrap.
5. For a palette, place `Command` inside `dialog`, open it from a shortcut, and let the dialog move focus into the input on open and return it to the trigger on close.
6. `CommandList` scrolls at 300px. Adjust `className` for the surface; keep a cap so the overlay never outgrows the viewport.

## Heuristics

- Show results before any typing: recent or most-used items. An empty list under an empty query is a dead surface.
- Group by kind, order within a group by frequency or recency, and keep each item to one line.
- The highlighted row is `data-selected`; it is drawn with the accent fill and is the row Enter will choose.
- Disabled items are skipped by the arrow keys and drawn at half opacity; prefer omitting an item to disabling it in a filtered list.
- A right-aligned shortcut hint on an item is a promise; bind the key.

## Content

- Placeholder: "Search" plus the scope, sentence case: "Search panels".
- Empty message: states the scope and ends with a full stop: "No panels found."
- Group headings name the category in sentence case.
- Item labels are nouns for things and verb-led for actions; no trailing punctuation.

## Accessibility

- The input is `role="combobox"` with `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is `role="listbox"`; items are `role="option"` with `aria-selected`; groups are `role="group"` labelled by their heading. DOM focus stays in the input.
- Keys: Up and Down move the highlight, Home and End jump, Enter selects, Escape closes the surrounding `dialog` and returns focus to the trigger.
- The input needs a name; the search icon is decorative and already `aria-hidden`.
- Rows are 36px tall, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- Result counts are not announced by the component. Add a visually hidden live region if the count matters.
