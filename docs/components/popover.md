---
related:
  - dialog
  - sheet
  - tooltip
  - hover-card
  - dropdown-menu
  - scroll-area
---

# Popover

## Purpose

An anchored, non-modal surface for a small interactive task that stays attached to the control that opened it: a filter set, a date pick, a short form, a share summary. It owns the anchoring, the portal, the frame and the dismiss behaviour. The consumer owns the content and the accessible name.

## When to use

- A compact task of a few controls that belongs beside its trigger and finishes in one or two interactions.
- Interactive content that a `tooltip` cannot hold: links, buttons, inputs, chips.
- Content that previews on hover for pointers but must also be reachable by keyboard; `hover-card` cannot be.

## When not to use

- A list of commands or options. Use `dropdown-menu` or `context-menu`.
- A task with required fields or more than a few controls. Use `dialog`; a click outside a popover dismisses it and loses the work.
- A panel the person works in while scrolling the page. Use `sheet`.
- A one-line description of a control. Use `tooltip`.
- On a phone an anchored popover becomes a bottom `sheet`; design the content so it survives that change.

## How to use

1. Wrap the trigger and content in `Popover`. Render `PopoverTrigger` `asChild` around a `button`.
2. Put the content in `PopoverContent`. It portals, defaults to `align="center"` and `sideOffset={4}`, and draws at 288px wide; set `side`, `align`, `sideOffset` and `className` to fit the trigger.
3. Give the content an accessible name with `aria-label` or `aria-labelledby` on `PopoverContent`; the primitive renders a `dialog` role and does not name it.
4. Cap the height. Pass `max-h-[min(400px,calc(100vh-24px))]` and `overflow-y-auto` through `className`, or put a `scroll-area` inside, so data growth never pushes a control off screen.
5. Use `PopoverAnchor` when the popover should attach to an element other than the trigger (a selection, a row).
6. Control `open` and `onOpenChange` when a selection inside should close it or when another panel opening must close it.

## Heuristics

- Anchored means attached. The popover opens from the control it belongs to and closes when the person clicks away; nothing inside it should be so valuable that this is a loss.
- Cap to the viewport and scroll inside. Lists of members, agents or filters grow; the viewport does not.
- No nesting. A control inside a popover opens a `dialog` or navigates; it does not open a second popover.
- One open at a time. Opening a popover closes any other popover or rail panel; an action that needs a panel reveals it.
- The trigger shows the state the popover controls (an applied-filter count, a selected date) so the popover can close.

## Content

- An optional heading at the top in sentence case, as a small muted label, naming the task ("Filter documents", "Who can see this").
- Controls labelled as they would be on the page; no instructions about how popovers work.
- A single primary action at the bottom, labelled with the verb, when the popover commits something. Otherwise no footer.

## Accessibility

- The content carries `role="dialog"` without `aria-modal`; the page behind it stays interactive. The consumer gives it a name with `aria-label` or `aria-labelledby`.
- On open, focus moves into the content. Tab moves through its controls and out the far side back to the page. Escape closes it and focus returns to the trigger; clicking outside also closes it.
- The trigger exposes `aria-expanded` and `aria-controls` so the state is readable without colour.
- Every control inside meets the 24px floor (`--weft-touch-target`), including chips and icon buttons.
- Open and close animate opacity, scale and a short slide. Under `prefers-reduced-motion: reduce` the consumer's global override collapses them; the component does not.
- If the popover's content changes after it opens (a result count), that line is a `status` live region so WCAG 4.1.3 is met without moving focus.
