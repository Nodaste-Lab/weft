---
related:
  - image-block
  - image
  - carousel
  - aspect-ratio
---

# Image gallery

## Purpose

A display-only collection of images in one of three layouts: a simple grid, a masonry grid with tall, wide and hero spans, or a carousel showing one image at a time with previous and next buttons. Each item renders as `image`, or as `image-block` when it has a caption. It owns the collection layout and the region; selection, reordering, uploads and lightboxes belong to composed surfaces.

## When to use

- Several related images viewed together: references, screenshots of one flow, a mood board.
- A sequence of images seen one at a time, with `layout="carousel"`.

## When not to use

- One image. Use `image` or `image-block`.
- Slides that are not images. Use `carousel`.
- A collection the reader selects from, reorders or uploads to. Compose those around `image`.
- People or entities. Use `avatar`.

## How to use

1. Render `ImageGallery` with `aria-label` and `items`, each `{ id, src, alt, caption?, aspectRatio?, fit?, radius?, bordered?, span?, imageProps? }`.
2. Pick `layout` (`simple-grid`, `masonry`, `carousel`), `columns` (`auto`, `1`, `2`, `3`), `gap` (`sm`, `md`, `lg`) and `density`.
3. In `masonry`, set `span` per item: `tall`, `wide` or `hero` (both). The row unit is 64px.
4. Set `captionTone` for every caption in the set.
5. In `carousel`, the active index is internal; the buttons disable at the ends.

## Heuristics

- Items in a grid share one `aspectRatio` so rows align.
- Captions only where they add something; a grid of identical captions is noise.
- About a dozen items in a grid, five in a carousel. Beyond that, paginate or split.
- Spans are sparing: one `hero`, a few `tall`. Every item spanning is a grid with no rhythm.
- `columns="auto"` collapses to one column at narrow widths; keep it unless a fixed count is the point (WCAG 1.4.10 reflow).
- Carousel controls stay inside the region, next to the image.

## Content

- `aria-label` names the set ("Reference images for the east gate"), not the widget.
- Every item has its own alt text that says what it shows and how it relates to the set.
- Captions are sentence case, one line where possible.

## Accessibility

- Ships: `role="region"` on the section; in `carousel`, buttons named "Previous image" and "Next image", disabled at the bounds, and a "2 of 5" readout. Buttons are 32px, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8).
- The consumer passes `aria-label`; a region without a name is announced as nothing (WCAG 4.1.2 name, role, value).
- Each item's `alt` is required (WCAG 1.1.1 non-text content). In a set, the alt also places the image in the set.
- The carousel layout does not set `aria-roledescription` or name each image as a slide, and has no arrow-key navigation; the buttons are the only path. Use `carousel` when those semantics matter more than the image chrome.
- Nothing auto-advances, so WCAG 2.2.2 pause, stop, hide does not come into play.
