---
related:
  - image
  - image-block
  - card
---

# Aspect ratio

## Purpose

A layout box that holds a fixed width-to-height ratio so media and placeholders keep their footprint before and after content loads. It owns the ratio only: no border, fill, radius or padding (the brand package lists it as pure layout, no skin). The child fills the box.

## When to use

- A video, embed or map that needs a stable frame while it loads.
- A grid of thumbnails where every cell must match before the images arrive.
- A placeholder or skeleton that stands in for media of a known shape.

## When not to use

- A single content image. `image` carries its own `aspectRatio` (square, video, portrait) and `fit`.
- An image with a caption. Use `image-block`.
- Text of any length. Text must reflow, not be clipped to a shape (WCAG 1.4.10 reflow).

## How to use

1. Render `AspectRatio` with `ratio` as a number, for example `16 / 9`.
2. Put one child inside. It is positioned to fill the box; give it `size-full` and, for media, `object-cover` or `object-contain`.
3. Size the width from the parent (a grid cell, `max-w-xs`). The height follows from the ratio.
4. Add `overflow-hidden` and a radius on `AspectRatio` itself when the child could exceed the box.

## Heuristics

- Pick a small set of ratios and reuse them across a surface. Mixed ratios in one grid read as misalignment.
- The ratio reflects the content's shape, not the slot that happens to be free.
- `cover` crops; `contain` letterboxes. Use `contain` for anything with text or UI in it.
- Nothing essential sits in the part a crop removes.

## Content

- The box has no content of its own. Alt text and captions belong to the child (`image`, `image-block`).

## Accessibility

- The wrapper has no role and no name; it is invisible to assistive technology.
- The child carries the text alternative (WCAG 1.1.1 non-text content).
- A ratio box is a fixed-dimension media exception under reflow only while it holds media. Text inside it is not exempt.
- It is not a target. Any interaction belongs to a control inside or around it.
