---
related:
  - image-gallery
  - tabs
  - steps
  - button
---

# Carousel

## Purpose

A region that shows one slide at a time from an ordered set, with previous and next buttons, a position readout and bounded keyboard navigation. It owns the slide semantics, the controls and the active index. The content of each slide is the consumer's.

## When to use

- Short, ordered content where seeing one item at a time is the point: the stages of a handoff, a three-part review.
- Sets of five slides or fewer. Beyond that readers lose track of what they have already seen.

## When not to use

- A collection of images. Use `image-gallery` with `layout="carousel"`.
- Content that should all be visible at once. Use `stack` or a grid.
- A process with a current step and status. Use `steps`.
- Switching between views of the same thing. Use `tabs`.
- Rotating promotion or autoplay. The component does not auto-advance, and readers scroll past rotating content.

## How to use

1. Render `Carousel` with `items`, each `{ id, content, label?, description?, ariaLabel? }`.
2. Give the region an accessible name with `aria-label` (or `aria-labelledby`). The role is `region`, which needs a name.
3. Set `initialIndex`, `density` (`compact` or `default`) and `showPosition` as needed.
4. Keyboard on the focused region: ArrowLeft and ArrowRight move one slide, Home and End jump to the ends. `onKeyDown` runs first and can call `preventDefault` to opt out.
5. The buttons disable at the first and last slide. There is no wrap-around.

## Heuristics

- Keep each slide short and complete on its own. Most readers see only the first slide.
- Give every slide a `label`; it becomes part of the slide's accessible name and the readout.
- Controls stay inside the region, next to the content, not below a fold.
- Slides share a height so the controls do not jump between slides.
- No auto-advance. If a consumer adds motion, WCAG 2.2.2 pause, stop, hide requires a visible control to stop it, and the component ships none.

## Content

- Slide labels are sentence case nouns ("Sources", "Review"). Descriptions are one sentence.
- The position reads "2 of 3". The slide name reads "Slide 2 of 3: Review".
- The region's `aria-label` names the set ("Client handoff steps"), not the widget.

## Accessibility

- Ships: `role="region"` with `aria-roledescription="carousel"`; each slide is `role="group"` with `aria-roledescription="slide"` and a name built from the position and the label; previous and next are buttons named "Previous slide" and "Next slide", disabled at the bounds.
- The consumer passes `aria-label` on the region (WCAG 4.1.2 name, role, value). Pass `ariaLabel` on an item when its `label` is not a string.
- The region itself is a Tab stop (`tabIndex=0`) and handles arrow keys; the buttons are further Tab stops. Readers can use either path.
- Slide changes are not announced. Add `aria-live="polite"` on the viewport if the surface needs it.
- Buttons are 32px tall, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8).
- No transition animates, so there is nothing to reduce under `prefers-reduced-motion`.
