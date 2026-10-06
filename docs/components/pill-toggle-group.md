---
related:
  - toggle-group
  - radio-group
  - tabs
  - period-chip-row
---

# Pill toggle group

## Purpose

A single choice drawn as separate pills with a gap between them. It owns the group container, each pill's active and inactive states, and the layout rule: up to three pills share the row width, more than three hug their text and wrap. The options and the selected value are the consumer's; it is controlled only.

## When to use

- A period selector or a mode selector that changes what a panel shows ("This session", "Last 7 days", "Last 30 days").
- A single choice that applies immediately and should breathe rather than read as one segmented bar.

## When not to use

- A joined segmented bar with a shared border. Use `toggle-group` with `joined`.
- A choice saved with a form. Use `radio-group`.
- Navigation between distinct content areas. Use `tabs`.
- Several choices at once. Use `toggle-group` with `type="multiple"` or `chip`.

## How to use

1. Render `PillToggleGroup` with `value` and `onValueChange`; both are required.
2. Add `PillToggleGroupItem` children, each with a `value` and short text content.
3. Name the group with `aria-label` or `aria-labelledby` through the remaining props on `PillToggleGroup`.
4. Keep labels of similar length when there are three or fewer pills, because they share the row equally.

## Heuristics

- One pill is always active. There is no empty selection, so the initial `value` is a real default.
- The active pill is the anchor: primary fill and on-primary text. Hover lifts an inactive pill's text without filling it.
- Two to five pills. More than that is a `select`.
- The group reads as a single question; put it under a label or a heading that says what is being chosen.
- Changing the value changes the view at once. Nothing here waits for a save.

## Content

- Pill labels: one or two words, sentence case, parallel in form ("Last 7 days", not "7d" beside "This session").
- Group name: the thing chosen ("Recap period").
- No icons without text; the pill is the label.

## Accessibility

- The group exposes `role="radiogroup"` and each pill `role="radio"` with `aria-checked`; each pill is a `button type="button"`, so Space and Enter choose it.
- The consumer names the group with `aria-label` or `aria-labelledby` (WCAG 1.3.1, 4.1.2).
- Open: every pill is a Tab stop and the arrow keys do not move between them, so the keyboard model differs from `radio-group` and `toggle-group`, which use a roving tab stop and arrows.
- Open: a pill's height follows its text size and padding, with no minimum against the 24px floor (`--weft-touch-target`, WCAG 2.5.8); check the measured height at dense density.
- The colour transition stops under `prefers-reduced-motion`; selection also reads from the bolder weight on the active pill.
