---
related:
  - popover
  - tooltip
  - avatar
  - stat-row
---

# Hover card

## Purpose

A preview that opens from a link or a name when the pointer rests on it, so a person can see what is behind the link without leaving the page. It owns the open and close delays, the anchored placement and the card frame. The consumer owns the preview content.

## When to use

- A preview of a person, a document or a reference that a link already points to, where a glance saves a navigation.
- Sighted-pointer enrichment of something that works without it.

## When not to use

- A short label or description for a control. Use `tooltip`.
- Anything the person has to act on, or content that must be reachable by keyboard. Use `popover`.
- Information nobody can get another way. Put it on the page; a hover card is a shortcut, not a source.
- On touch devices there is no hover. If the content matters, the link target has to carry it.

## How to use

1. Wrap the trigger and content in `HoverCard`. Pass `openDelay` and `closeDelay` to override the defaults of 700ms and 300ms.
2. Render `HoverCardTrigger` `asChild` around the real link or name. The trigger must be a real `<a>` or `button` so it also works on focus and on activation.
3. Put the preview in `HoverCardContent`. It portals, defaults to `align="center"` and `sideOffset={4}`, and draws at 256px wide; pass `side`, `align` and `className` to change the placement and width.
4. Compose the preview from existing parts: `avatar`, `stat-row`, `badge`. Keep any action inside it as a real link that also exists at the link target.

## Heuristics

- The card previews the destination. If the content is not on the page the link opens, it does not belong in the card.
- Keep the open delay. A card that opens on a pass of the pointer covers the content the person was reading.
- The content stays open while the pointer moves onto it (WCAG 1.4.13 hoverable) and closes when the pointer leaves or Escape is pressed (dismissible).
- One card at a time. A trigger inside a card should navigate, not open another card.
- Keep the card under the brand cap of 320px wide and short enough to fit above or below the trigger without covering it.

## Content

- A name line, one or two facts, and at most two actions. Sentence case throughout; facts as label and value, not sentences.
- No headings inside the card; the name line is the title.
- Every action in the card has a text label; no icon-only controls.

## Accessibility

- The card opens on pointer hover and on keyboard focus of the trigger, and closes on Escape, on blur and when the pointer leaves. Focus never moves into the card.
- Content inside the card is not reachable by keyboard or announced by a screen reader. Treat it as a sighted-pointer enhancement (WCAG 1.4.13 governs its behaviour; it cannot be the only route to the content).
- The trigger must be a real link or button with its own accessible name; the card adds nothing to that name.
- Keep the trigger at the 24px floor (`--weft-touch-target`); an inline link in running text is the one WCAG 2.5.8 exception.
- Open and close animate opacity, scale and a short slide. Under `prefers-reduced-motion: reduce` the consumer's global override collapses them.
