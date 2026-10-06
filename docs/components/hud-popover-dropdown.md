---
related:
  - popover
  - dropdown-menu
  - select
---

# Popover dropdown

## Purpose

A minimal anchored dropdown for a controlled trigger-and-content pair rendered in place, not portaled. It owns the relative wrapper, the `open` attribute, the content positioned below the trigger with `align` and `width`, dismissal on outside click and Escape, and the content's `role` and `aria-label`. It does not own the trigger's semantics, focus movement, or repositioning when space runs out.

## When to use

- A small in-place picker inside a panel that must stay in the panel's stacking context: a role picker, a project switcher, a short list the consumer renders itself.
- Content whose markup the consumer needs full control over, with no menu semantics imposed.

## When not to use

- A list of actions. Use `dropdown-menu`, which supplies roles, keyboard handling and focus return.
- A form value. Use `select`.
- Content that could be clipped by an `overflow: hidden` ancestor or needs to flip near the viewport edge. Use `popover`, which is portaled and repositions.
- Content that must block the page. Use `dialog`.

## How to use

1. Hold `open` in state and pass `open` and `onOpenChange`.
2. Pass `trigger`: a `button` that toggles `open` on click and carries `aria-expanded={open}` and an `aria-haspopup` matching `contentRole`.
3. Pass `children` as the content. Set `contentRole` (`dialog` by default; `listbox`, `menu` or `region`) and `contentAriaLabel`.
4. Set `align` (`start` or `end`), `width` (`auto` or `trigger` to match the trigger's width) and `offset` in pixels (3 by default). Use `contentClassName` for min-width, padding and a max-height with inner scroll.
5. Move focus into the content when `open` becomes true, and back to the trigger when it becomes false. The component closes on Escape and outside click but does not move focus.
6. Close the dropdown from an item's `onClick` after handling the selection.

## Heuristics

- Short content: one column, eight rows or fewer. Longer lists belong in `command`.
- Overlays are capped to the viewport and scroll inside; give the content a max-height.
- The content only opens below the trigger. Place the trigger where there is room, or use `popover`.
- `width="trigger"` for pickers, so the open list lines up with the closed value.
- The role describes what is inside: `listbox` for options, `menu` for actions (then the consumer also supplies item roles and arrow-key movement), `dialog` for mixed content.

## Content

- `contentAriaLabel` names what is being chosen ("Project"), in sentence case.
- A picker's trigger shows the current value; the open content shows the choices.
- Items are sentence case, one line, no trailing punctuation.

## Accessibility

- The content carries the `contentRole` and `aria-label` passed to it; nothing else is set. The trigger must expose `aria-expanded`, and a `button` must be used so Enter and Space open it.
- Escape closes through a document-level listener; outside `mousedown` closes, which covers taps on touch.
- Focus is not moved in on open or returned on close. The consumer does both, so the overlay rule (focus in, Escape closes, focus returns to the trigger) holds.
- Arrow-key movement, typeahead and `aria-activedescendant` are the consumer's when the role is `listbox` or `menu`.
- Rows inside need at least 24px of height (`--weft-touch-target`, WCAG 2.5.8 target size).
- There is no open or close animation, so nothing to collapse under reduced motion.
