---
related:
  - resizable
  - sidebar
  - popover
  - pagination
---

# Scroll area

## Purpose

A scroll container with thin styled scrollbars that keeps native scrolling. The viewport is a Tab stop and draws a focus ring, so a keyboard reader can scroll it. It owns the scrollbar look and the viewport; the height and the content come from the consumer.

## When to use

- A bounded region in a panel or popover whose content outgrows it: notes, a log, a long list.
- A wide strip that scrolls sideways, with a horizontal `ScrollBar`.

## When not to use

- The page itself. The document scrolls on its own.
- A scroll region inside another scroll region. Two scroll islands trap the wheel.
- Content that can reflow or page instead. Use `pagination` for long result sets.

## How to use

1. Render `ScrollArea` with a height (`h-64`, `max-h-[60vh]`). Without a bound it does not scroll.
2. Put the content inside as children.
3. Add `<ScrollBar orientation="horizontal" />` as a child when the content is wider than the box.
4. The Radix `type` and `scrollHideDelay` props pass through for scrollbar visibility.

## Heuristics

- Make the cut-off visible: a border, a fade or a last row half-shown. A region that looks complete is not scrolled.
- One scroll island per panel. A sticky footer sits outside it.
- Text does not scroll sideways. Horizontal scroll is for strips of fixed-size items (WCAG 1.4.10 reflow).
- The brand entry: track transparent, thumb 6px in the muted tone at 40% alpha, full radius, darker on hover.
- The thumb is small. The wheel, touch and the keyboard are the primary paths; the thumb is a secondary one.

## Content

- None of its own.

## Accessibility

- Ships: the viewport has `tabIndex=0` and a `:focus-visible` ring, so arrow keys, Page Up and Page Down scroll it from the keyboard (WCAG 2.1.1 keyboard). Scrolling is native, so screen readers and magnifiers behave as they do on any scrollable element.
- The viewport has no accessible name. Start the content with its heading so the focus stop reads as something.
- Scrollbar drag targets are under 24px. They are secondary to native scrolling, which is the exemption that applies; do not make the thumb the only way to move.
- The only transition is on scrollbar colour; nothing needs reducing under `prefers-reduced-motion`.
