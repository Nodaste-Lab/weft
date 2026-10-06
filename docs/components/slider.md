---
related:
  - input
  - progress
  - form
  - label
---

# Slider

## Purpose

A value chosen by position along a track, with one thumb or two. It owns the track, the filled range, the thumbs and their keyboard model. The visible label, the displayed value and any paired numeric field belong to the consumer.

## When to use

- A value whose relation to its range matters more than its exact figure: volume, opacity, a threshold, a weighting.
- A lower and upper bound together, as two thumbs.

## When not to use

- A precise number. Use `input` with `inputMode="numeric"`, or pair the slider with one.
- A very large range (thousands of steps) or a very small one (two or three values). Use `input` or `radio-group`.
- A date range. Use `calendar` in range mode.
- Showing progress rather than taking a value. Use `progress`.
- On or off. Use `switch`.

## How to use

1. Render `Slider` with `value` or `defaultValue` as an array, one entry per thumb. With neither, it renders two thumbs at `min` and `max`.
2. Set `min`, `max` and `step`. The defaults are 0, 100 and 1.
3. Pass `thumbLabels`, one accessible name per thumb ("Volume level"; "Minimum price", "Maximum price").
4. Show the current value as text beside the control and update it on `onValueChange`. Use `onValueCommit` for work that should wait until the pointer lifts.
5. For two thumbs, set `minStepsBetweenThumbs` so they cannot cross.
6. `disabled` is the only inactive state. There is no read-only slider.

## Heuristics

- Put the label above the track so the thumb never covers it.
- The value is text somewhere on screen. A slider with no readout asks the user to guess.
- Step size matches the precision people need. Fine steps on a short track cannot be hit by pointer.
- The filled range runs from the start to the value, or between the two thumbs, in the primary colour; the thumb has a border, so position reads without a hover ring.
- Hover and focus show the same ring on the thumb.

## Content

- Label: sentence case, the quantity ("Volume level"), not the control ("Slider").
- `thumbLabels` for a range name the ends ("Minimum", "Maximum") and include the quantity when more than one slider shares the surface.
- The readout carries the unit: "40%", "12 px". Never a bare number where the unit is not obvious.

## Accessibility

- Each thumb is a `role="slider"` element with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, named by `thumbLabels` (WCAG 4.1.2). Arrow keys move by one step, Home and End jump to the ends, Page Up and Page Down move by larger steps, and Tab moves between thumbs.
- The consumer supplies the visible label and the readout. Only the thumb's name is read, so it must say what the value is.
- Open: the thumb measures 16×16 and the horizontal track is 16px tall, under the 24px floor (`--weft-touch-target`, WCAG 2.5.8). A press anywhere on the track moves the nearest thumb, which widens the horizontal target but not the vertical one.
- Open: `aria-valuetext` cannot be set per thumb, so a value with a unit is read as a bare number.
- `touch-action: none` on the root stops the page scrolling during a drag. The thumb transition stops under `prefers-reduced-motion`.
