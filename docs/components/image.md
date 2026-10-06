---
related:
  - image-block
  - image-gallery
  - aspect-ratio
  - avatar
---

# Image

## Purpose

A tokenised `<img>` for content images. `alt` is required by the type. It owns fit (`cover`, `contain`, `fill`, `none`), radius, an optional border, an aspect ratio (`auto`, `square`, `video`, `portrait`), a raised-surface background while loading, and lazy loading with async decoding by default. Captions, collections and interaction belong to composed primitives.

## When to use

- A content image in a panel, a response or a document: a screenshot, an illustration, a photo.

## When not to use

- An image with a caption. Use `image-block`.
- Several images. Use `image-gallery`.
- A person or entity in a circle. Use `avatar`.
- An icon. Use the icon set.
- A decorative background. Use CSS.
- Text as a picture. Use text.

## How to use

1. Render `Image` with `src` and `alt`.
2. Set `aspectRatio` and `fit`. `cover` crops to the frame; `contain` shows the whole image. Use `contain` for anything with text or UI in it.
3. Pass `width` and `height`, or an `aspectRatio`, so the space is reserved before load.
4. Pass `srcSet` and `sizes` for responsive sources. Set `loading="eager"` only for an image above the fold.
5. Set `alt=""` only when the image is decorative.

## Heuristics

- Photos take `cover`; screenshots and diagrams take `contain`.
- One radius per surface; `md` is the default.
- `bordered` when a light image sits on a light surface.
- `fill` distorts. Use it only when the distortion is the point.
- Illustrations follow the illustration style guide; the component does not change that.
- No flashing or looping imagery. An animated image needs a way to stop (WCAG 2.2.2 pause, stop, hide; 2.3.1 three flashes).

## Content

- Alt text says what matters about the image in this context: about 125 characters or fewer, sentence case, no "image of" or "picture of".
- Text in the image is repeated in the alt text.
- A functional image (inside a link or button) is named for the action, not the picture.
- Decorative images take `alt=""`, not a filename.

## Accessibility

- Ships: `alt` is required by the type, so an image cannot be rendered without a decision about its text alternative (WCAG 1.1.1 non-text content). `loading="lazy"` and `decoding="async"` are the defaults.
- `alt=""` hides the image from assistive technology. Use it for decoration only.
- A complex image gets a longer description nearby in `text-content`; the alt text points to it.
- With `cover`, nothing essential sits in the cropped area; what a sighted reader cannot see, the alt text does not need to describe.
- The image is `max-w-full`, so it never forces sideways scrolling (WCAG 1.4.10 reflow).
- A clickable image is wrapped in a control with a name; the image itself is not a target.
