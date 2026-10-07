---
related:
  - input
  - popover
  - button
  - form
  - textarea
  - search-field
---

# Calendar

## Purpose

A month grid for choosing a date, several dates or a range. It owns the month caption and navigation, the weekday header, the day cells with their today, selected, range, outside-month and disabled states, and the grid keyboard model. The field that shows the chosen date, and how it is typed, belongs to the consumer.

## When to use

- A date whose relation to nearby days matters: scheduling, a deadline, a recap period.
- A date range, as `mode="range"`.
- Beside an `input`, inside a `popover`, so a date can be typed as well as picked.

## When not to use

- A date people know by heart, such as a birthday. Use a typed `input` with the format in help text; a distant date takes many clicks in a grid.
- Showing events on days. This is a picker, not a calendar view.
- A time. Pair an `input` or `select` for the time with the date.

## How to use

1. Render `Calendar` with `mode` (`single`, `multiple` or `range`), `selected` and `onSelect`. Set `defaultMonth` so the grid opens on a relevant month.
2. Constrain with `disabled` (a date, a range or a matcher function) and `fromDate` or `toDate`. Disabled days stay visible and focusable but cannot be chosen.
3. `showOutsideDays` is on by default: the neighbouring months' days fill the grid in the muted colour.
4. To make a date field, put the calendar in a `popover` opened by a `button`, and write the chosen date into an `input` in a stated format.
5. Override `classNames` for layout only. The state styles are the primitive's.

## Heuristics

- For one uncomplicated calendar date, prefer an associated label and native `Input type="date"`. Keep the cutout label fixed at the border because the browser renders date segments even while empty. Its opaque surface mask must paint above the border and focus indicator. Keep the native picker icon at the trailing edge using full-width native control layout; do not crowd it against the date segments.
- The native control uses browser locale presentation and a date-only value. Do not parse it as a timestamp or invent a timezone. Date/time constraints and errors belong to the application.
- Use Calendar when nearby days, ranges, or scheduling context matter. A custom popup composition must preserve typed entry, keyboard operation, and focus recovery; Calendar alone is not a complete DateInput component.


- Open on the month that matters: the selection if there is one, otherwise today.
- Today is a fill so the grid has an anchor; selected is the primary fill with on-primary text, so the two never look alike.
- A range shows its start and end in the primary fill and the days between in the accent fill.
- Say why dates are disabled in the text before the calendar, not only by dimming them.
- The weekday header is a grid header, so it keeps the dense-info mono register. The caption is sentence case.
- Day cells are 32px at compact density and 40px at marketing, clearing the 24px floor; the 44px target is not a goal for this primitive.

## Content

- Caption: month and year as the locale writes them.
- Weekday header: short abbreviations in the mono face.
- The format the paired field accepts goes in help text ("Day, month, year as 04/10/2026"), never in the placeholder alone.
- Nothing in the grid is fixture text. An empty selection is empty.

## Accessibility

- The grid is a table whose day buttons are named with the full date. Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End to the ends of the week, Enter and Space choose. The grid keeps one tab stop.
- Selected days carry `aria-selected`; disabled days are `aria-disabled` and stay in the focus order.
- The month navigation buttons are 28px and named, so they reach the 24px floor (`--weft-touch-target`, WCAG 2.5.8).
- Open: the navigation buttons rest at half opacity and lift on hover only. They should also lift on `:focus-visible`.
- Open: today is marked by fill alone. A non-colour cue, or "today" in the day's accessible name, makes the state readable with colour removed (WCAG 1.4.1).
- Day buttons take the global focus ring. Nothing in the grid animates.
