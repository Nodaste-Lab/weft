---
related:
  - image
  - image-gallery
  - aspect-ratio
  - text-content
---

# Image block

## Purpose

A `<figure>` holding one `image` and an optional `<figcaption>`. It owns the figure shape: alignment, caption tone and the gap between image and caption. Fit, radius, border and aspect ratio pass through to the image. Lightboxes, uploads, errors and galleries belong to composed surfaces.

## When to use

- One image whose caption travels with it: a screenshot with what to notice, a diagram with its source, an attachment with its date.

## When not to use

- A bare image with no caption. Use `image`.
- Several images. Use `image-gallery`.
- A ratio box for something that is not an image. Use `aspect-ratio`.
- An image that opens, selects or uploads. Compose those around `image`.

## How to use

1. Render `ImageBlock` with `src`, `alt` and `caption`.
2. Set `aspectRatio` (`auto`, `square`, `video`, `portrait`) and `fit` (`cover`, `contain`, `fill`, `none`) for a predictable frame. Use `contain` for screenshots and diagrams.
3. Set `align` (`start`, `center`, `stretch`). `stretch` makes the image full width.
4. Set `captionTone` (`default`, `muted`, `strong`).
5. Pass `width`, `height`, `srcSet` and `sizes` through `imageProps` to reserve space and serve the right file.

## Heuristics

- The caption adds what the image does not show: the source, the date, what to look at. It does not restate the alt text.
- Two lines at most; the caption is capped at the prose measure.
- `bordered` when the image's edge would vanish against the surface.
- Reserve the space (`aspectRatio` or `width` and `height`) so the layout does not shift when the image loads.
- One image per figure. A set is a gallery.

## Content

- Captions are sentence case; a full sentence ends with a full stop, a fragment does not.
- No "Figure 1:" prefix unless the text refers to figures by number.
- Alt text is concise, about 125 characters or fewer, and does not start with "image of".
- A credit or source sits in the caption, not in the alt text.

## Accessibility

- Ships: `figure` and `figcaption`, so the caption is associated with the image and read as its name in most assistive technology. `alt` is a required prop.
- Alt and caption differ. The alt describes; the caption comments (WCAG 1.1.1 non-text content).
- Text inside the image goes into the alt text.
- A complex image (a chart, a dense diagram) gets a longer description nearby in `text-content`.
- `alt=""` only when the caption carries everything and the image is decorative beside it.
- The figure is `max-w-full`, so it never forces sideways scrolling (WCAG 1.4.10 reflow).
