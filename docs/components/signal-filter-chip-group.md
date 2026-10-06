---
related:
  - toggle-group
  - pill-toggle-group
  - period-chip-row
  - condition-chip-strip
  - chip
---

# Signal filter chip group

## Purpose

A captioned row of toggle chips that filters a list in place: a timeframe, a set of priorities, a set of sources. It owns the caption, the `role="group"` wrapper named by that caption, and the pressed and idle chip chrome. It does not own selection state; the consumer decides whether one chip or many can be active and passes that back through callbacks, so a single-select group and a multi-select group share one rendering.

## When to use

- Filters that apply as soon as a chip is pressed, with the filtered list visible on the same surface.
- Several short groups stacked in a rail, each with a caption.

## When not to use

- A segmented control where exactly one option is always on and the options are modes, not filters. Use `toggle-group` with `joined`, or `pill-toggle-group` for pills that breathe.
- A single preset row of periods. Use `period-chip-row`.
- Chips that show applied conditions and can be removed. Use `condition-chip-strip` or `chip`.
- More than about eight options. Use a `select` or a `command` palette; a long wrapping chip rail is hard to scan and to tab through.

## How to use

1. Render `SignalFilterChipGroup` with `label` (the caption), `options` (an array of `{ value, label, ariaLabel? }`), `isActive(value)` and `onToggle(value)`.
2. For single select, make `isActive` compare to one stored value and `onToggle` replace it. For multi select, store an array and toggle membership. The component does not enforce either.
3. Each option renders as a `button` with `variant="outline"`, `size="sm"` and `aria-pressed` from `isActive`. `option.ariaLabel` overrides the accessible name when the visible label is not enough on its own.
4. `groupAriaLabel` sets the group's name when `label` is not a plain string; `labelId` lets the consumer connect the caption to something else.
5. `chipClassName(active)` replaces the default chip classes for a tone variant. The click handler stops propagation so a chip inside a clickable row does not also open the row.

## Heuristics

- A pressed chip is readable without its colour: the default chrome changes weight and border as well as fill, and `aria-pressed` carries it for assistive tech (WCAG 1.4.1 use of colour). A custom `chipClassName` must keep a non-colour difference.
- The chip label does not change when pressed. "High" stays "High"; pressed state is the attribute, not a different word.
- The filtered list updates on press. There is no apply button in this component, so do not design one next to it.
- Keep the caption to one word or two. It names the dimension ("Priority"), not the action ("Filter by priority").
- Default chips are 10px text with 3px vertical padding, under the 24px floor. Where chips are the main control on a touch surface, pass a `chipClassName` that restores the minimum height (`--weft-touch-target`, WCAG 2.5.8 target size), or space them so the 24px circles do not overlap.

## Content

- Caption: sentence case; the component renders it in small caps styling. No colon, no trailing punctuation.
- Chip labels: one or two words, sentence case, no punctuation: "Today", "This week", "High". An "All" chip, when present, comes first.
- Counts are not part of the chip label. If a count helps, it belongs in a `badge` inside the label node, right-aligned.
- Do not ship a default set of options. The consumer supplies them from its model.

## Accessibility

- The rail is `role="group"` with `aria-labelledby` pointing at the caption and `aria-label` as a fallback, so the group announces its name on entry (WCAG 1.3.1 info and relationships).
- Every chip is a native `button` with `aria-pressed`, so Space and Enter toggle it and the state is announced (WCAG 4.1.2 name, role, value). All chips are in the tab order; there is no roving focus.
- A single-select group still uses `aria-pressed` buttons rather than radio semantics. A screen reader hears each chip as an independent toggle; the consumer's `onToggle` keeps the invariant.
- Focus is the global focus ring from `button`. Hover and focus chrome are the same.
- Idle chips read the secondary text token on a transparent fill; the consumer must check 10px contrast on the surface (WCAG 1.4.3 contrast minimum).
