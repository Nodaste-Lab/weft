---
related:
  - toggle
  - pill-toggle-group
  - radio-group
  - tabs
---

# Toggle group

## Purpose

A row of related toggles, either one-of (`type="single"`) or any-of (`type="multiple"`). It owns the group container, the shared variant and size, the roving keyboard model, and the `joined` form where items share one outer border as a segmented bar. The items' meaning and the selected values are the consumer's.

## When to use

- A segmented control that switches a scope or a view at once: "Direct", "Expanded", "All".
- A set of independent formatting or filter toggles that belong together: bold, italic, underline.
- Icon-only alignment or view switches in a toolbar.

## When not to use

- A choice saved with a form. Use `radio-group` or `checkbox`.
- Navigation between distinct content areas. Use `tabs`.
- Pills that should breathe with a gap between them. Use `pill-toggle-group`.
- A single pressed state. Use `toggle`.

## How to use

1. Render `ToggleGroup` with `type` (`single` or `multiple`), `value` and `onValueChange` (or `defaultValue`), and an accessible name through `aria-label` or `aria-labelledby`.
2. Add `ToggleGroupItem` children, each with a `value`. The group's `variant` and `size` apply to every item.
3. Set `joined` for a segmented bar: one outer border, dividers between items, and the selected item tinted with an inset ring.
4. Give an icon-only item `aria-label` and pair it with a `tooltip`.
5. Set `disabled` on the group or an item when the choice is unavailable.

## Heuristics

- Choose the type by the question. Exclusive scope or view is `single`; independent states are `multiple`.
- A `single` group with a default never empties. Pass `value` so the group always has one selected item, unless "none" is a real state.
- Two to five items. Labels of one or two words, nouns or short adjectives, parallel in form.
- Do not mix icon-only and text items in one group.
- The joined bar is for switches that change the view; the gapped outline form is for toolbars.
- Selected is drawn by a fill plus, in the joined form, an inset ring. The group's `aria` state is what carries it.

## Content

- Item labels: sentence case, one or two words ("Direct", "Expanded"), no punctuation.
- Group name: the thing being switched ("Scope", "Alignment"), sentence case.
- Icon-only labels are the same words a tooltip shows.

## Accessibility

- The group exposes `role="group"`; in `single` mode items are `role="radio"` with `aria-checked`, in `multiple` mode they are buttons with `aria-pressed`. One Tab stop enters the group; arrow keys move between items; Space and Enter select.
- The consumer names the group with `aria-label` or `aria-labelledby`, and each icon-only item with `aria-label` (WCAG 1.3.1, 4.1.2).
- Every size clears the 24px floor (`--weft-touch-target`, WCAG 2.5.8): `sm` is 32px, `default` 36px, `lg` 40px, each with a matching minimum width.
- Focused items raise above their neighbours so the focus ring is not clipped by the shared border.
- Colour transitions stop under `prefers-reduced-motion`.
