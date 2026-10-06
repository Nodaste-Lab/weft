---
related:
  - progress
  - empty-state
  - card
  - list-item
---

# Skeleton

## Purpose

A grey placeholder block that holds the shape of content while it loads, so the layout appears before the data and nothing jumps when it arrives. It owns the fill, the rounded corners and the pulse. The consumer owns the sizes and the arrangement, which should match the content that replaces it.

## When to use

- A list, card or panel whose content takes more than about a second to arrive and whose shape is known: rows of a list, a title and two lines, an image and a caption.
- The first paint of a surface, before the data query returns, in place of a blank area.

## When not to use

- A task with a known length. Use `progress`.
- A wait under a second. Render nothing; a flash of skeleton is worse than a short blank.
- A surface that turned out to be empty or that failed. Replace the skeleton with `empty-state`; never leave it pulsing.
- A single pending action. Use the `loading` state on `button`.

## How to use

1. Render one `Skeleton` per block of content, sized through `className` (`h-4 w-3/4` for a line, `h-16 w-full` for a paragraph or image).
2. Arrange them in the same container and layout as the real content, with the same gaps, so the swap does not move anything.
3. Match corner radius to the element being represented: a `card` skeleton takes the card radius, an `avatar` skeleton is a circle.
4. Swap the skeleton for the content when it arrives, or for an `empty-state` when there is none.
5. Hide the skeleton from assistive technology with `aria-hidden` and announce the loading state in text elsewhere.

## Heuristics

- Shape, not detail. Three line widths that vary read as text; identical bars read as a table.
- Draw only what loads. The chrome that is already there (headers, tabs, the rail) is not skeletonised.
- Keep the skeleton the height of the real content so the surface does not grow or shrink when it swaps.
- One loading treatment per surface: a skeleton and a spinner at the same time say two things.
- The skeleton has no colour of its own beyond the accent fill; it never carries a tone.

## Content

- None. A skeleton carries no text. The loading message, if any, is a visible line outside the skeleton ("Loading notes").

## Accessibility

- The root is a `div` with no role and no text; a screen reader skips it unless it is given content. Set `aria-hidden="true"` on the skeleton container so its boxes are not counted or read.
- Announce the loading state in text in a `status` live region beside it ("Loading notes") and announce the result when it arrives (WCAG 4.1.3). The skeleton itself announces nothing.
- The skeleton is not interactive and not a target; do not render controls inside it.
- The pulse animates opacity continuously. Under `prefers-reduced-motion: reduce` the consumer's global override collapses it to a static block; the primitive does not do this on its own (WCAG 2.3.3). The brand spec draws it as a solid block with no shimmer.
- The fill must clear 3:1 against its ground (WCAG 1.4.11) so the placeholder is visible in both themes.
