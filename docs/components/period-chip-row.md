---
related:
  - pill-toggle-group
  - chip
  - toggle-group
  - stack
---

# Period chip row

## Purpose

A wrapping flex row for period and date-window preset chips. It owns the gap (8px) and the wrap, nothing else: no chip styling, no selection state. A recap builder uses it for two logical rows of presets.

## When to use

- A row of preset windows (last 7 days, last 30 days, this session) that may wrap to a second line in a narrow rail.

## When not to use

- A single-select set of periods with a selected state. Use `pill-toggle-group`, which owns the pills and the state. The row can wrap it.
- Tags or removable tokens. Use `chip`.
- A joined segmented control. Use `toggle-group`.
- General horizontal spacing. Use `stack` with `direction="horizontal"` and `wrap`.

## How to use

1. Render `PeriodChipRow` with the chips as children.
2. Make each chip a real control: a `pill-toggle-group` item, or a button with `aria-pressed`.
3. Wrap the row in a named group (`fieldset` with a `legend`, or `role="group"` with `aria-label="Period"`) so the set reads as one choice.

## Heuristics

- Order presets from the shortest window to the longest, with a custom range last.
- Two logical rows at most. More presets belong in a select.
- The selected chip is a state on the control, drawn with the accent fill. Fill alone is not the state.
- The row wraps; it never scrolls sideways (WCAG 1.4.10 reflow).

## Content

- Chip labels are short, sentence case, digits for numbers ("Last 7 days", "This session"), no trailing punctuation.

## Accessibility

- The row is a `div` with no role. The consumer names the group.
- Each chip is a button or radio with its state exposed (`aria-pressed` or `aria-checked`), not a styled span.
- Chips meet the 24px floor (`--weft-touch-target`). A 10px label with 4px vertical padding does not; set a minimum height on the control.
- For a single-select set, arrow keys move between chips as a radio group; `pill-toggle-group` provides that.
- The global focus ring applies to each chip.
