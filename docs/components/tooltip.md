---
related:
  - popover
  - hover-card
  - button
---

# Tooltip

## Purpose

A short text label that appears beside a control on hover or keyboard focus and disappears when the pointer or focus leaves. It owns the provider that coordinates delays, the trigger wiring, the portal and the dark pill with its arrow. It carries text only.

## When to use

- The name of an icon-only control ("Copy link", "Collapse rail").
- A keyboard shortcut or a one-line clarification beside a labelled control.
- Supplementary context a person can finish the task without.

## When not to use

- Anything interactive, or anything longer than a line or two. Use `popover`.
- A preview of a link's destination. Use `hover-card`.
- Information needed to complete the task (a format rule, a password requirement). Put it in visible helper text beside the control.
- A repeat of the visible label. A control named "Save" does not need a tooltip reading "Save".
- On touch devices there is no hover and the tooltip may never show; it cannot be the only label.

## How to use

1. Wrap the trigger and content in `Tooltip`. It supplies its own `TooltipProvider` with `delayDuration` 0; wrap a toolbar in one `TooltipProvider` to set a shared delay and let adjacent tooltips open without re-waiting.
2. Render `TooltipTrigger` `asChild` around a real `button` or link. The trigger must already be focusable and already have an accessible name.
3. Put the text in `TooltipContent`. It portals, draws the arrow, and defaults to `sideOffset={0}`; pass `side` and `sideOffset` to place it. Keep it to a short line; the content uses balanced wrapping.
4. For an icon-only control, set `aria-label` on the control itself. The tooltip only describes the trigger while it is open and does not name it.

## Heuristics

- A tooltip explains; it never instructs. If the person must read it to proceed, it is helper text.
- One line. If it wraps twice, shorten it or move it to a `popover`.
- Same words everywhere for the same control. The tooltip for the rail toggle reads the same in every panel.
- The content stays while the pointer moves onto it (WCAG 1.4.13 hoverable), stays until dismissed (persistent) and closes on Escape (dismissible) without moving focus.
- The brand spec draws the fill in the ink colour in both themes so it reads the same over any surface; the shipped primitive uses the primary fill. The arrow matches the fill.

## Content

- Sentence case, no trailing full stop ("Copy link", "Collapse rail").
- A shortcut follows the label after a middle dot or in its own span ("Search · ⌘K").
- No formatting, no icons, no links.

## Accessibility

- The content carries `role="tooltip"`. While open, the trigger gets `aria-describedby` pointing at it; when closed, nothing is exposed, so the trigger's own name must stand alone.
- Opens on pointer hover and on keyboard focus; closes on Escape, on blur and when the pointer leaves. Focus never moves into the tooltip and the tooltip never contains focusable content.
- The trigger must be a real focusable element. A tooltip on a `span` or a disabled button never opens for a keyboard user; wrap a disabled control so the wrapper is the trigger.
- The trigger meets the 24px floor (`--weft-touch-target`); the tooltip itself is not a target.
- Open and close animate opacity, scale and a short slide. Under `prefers-reduced-motion: reduce` the consumer's global override collapses them; the component does not.
