---
related:
  - card
  - chip
  - hud-meta-caption
  - badge
---

# Sticky

## Purpose

An outlined note card keyed to a category colour: the header sits on the colour, the body sits on paper, the outline carries the same colour, and a footer holds chips. The colour comes from the caller; header text uses `--weft-on-category`, which clears AA on every value of the `--weft-category-*` palette. It owns the frame and the three slots; the note is the consumer's.

## When to use

- A board of many notes grouped by category, where the colour tells the group at a glance.

## When not to use

- A neutral container. Use `card`.
- A single note outside a board. Use `card` or `callout`.
- Colour that would mean a person or an owner. Colour is semantic only: a state or a category, never a person.

## How to use

1. Render `Sticky` with `color` set to one of the category tokens (`var(--weft-category-1)` and so on).
2. Put the category name and a timestamp in `header`; `hud-meta-caption` suits the time.
3. Put the note text as children.
4. Put tag chips in `footer` (`chip`). The footer clears the body by a fixed floor even when the body fills the card.
5. Set `density` to `compact` on dense boards.

## Heuristics

- The colour is a category, and the category's name is in the header text. Colour is never the only cue (WCAG 1.4.1 use of colour).
- Use the category palette only. Other colours have no on-colour guarantee.
- One colour means one category everywhere on the board; a legend or the header text makes the mapping visible.
- Outlined, not raised: a 1px outline and no shadow. Notes sit in the panel, not above it.
- Body text never sits on the colour.
- Around six categories at most. Beyond that the colours stop being distinguishable.

## Content

- The header is the category name in sentence case ("Private", "Campaign") and a relative time.
- The body is short plain text. Long notes belong in a document.
- Chips are short tags.
- Nothing ships by default; the gallery text is fixture.

## Accessibility

- A `div` with no role. On a board, wrap notes in `ul` and `li` so the count and position are read.
- The category is named in text, so it survives colour removal.
- Any action on a note (edit, delete, move) is a real button in the header or footer, named with the note ("Delete note: Session prep"), and shown on `:focus-within` as well as hover.
- Actions meet the 24px floor (`--weft-touch-target`).
- A board that is dragged needs a keyboard way to move a note between groups (WCAG 2.1.1 keyboard, 2.5.7 dragging movements).
- Header text on the colour uses `--weft-on-category` for AA (WCAG 1.4.3 contrast).
