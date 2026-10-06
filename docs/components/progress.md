---
related:
  - skeleton
  - steps
  - button
  - stat-row
---

# Progress

## Purpose

A horizontal bar that shows how much of a known task is done, or that an unknown-length task is running. It owns the track, the fill, three heights and the `indeterminate` pulse. The consumer owns the value, the accessible name and the text that says what is happening.

## When to use

- A task of known length that takes long enough to watch: an import, an upload, a batch of items ("Updating 12 of 50").
- A wait of unknown length over a few seconds where a bar in place is clearer than a spinner (`indeterminate`).

## When not to use

- Content loading into a layout. Use `skeleton`, which shows the shape of what is coming.
- A sequence of named steps the person moves through. Use `steps`.
- A single pending action. Use the `loading` state on `button`.
- A static value in a range (storage used, a score). That is a meter; draw it with `stat-row` and a value, not a progress bar.
- A wait under a second. Show nothing.

## How to use

1. Render `Progress` with `value` from 0 to 100 (or set `max`) for a determinate bar. The fill is translated to the value.
2. For an unknown length, pass `indeterminate` and leave `value` unset. The fill pulses and `aria-valuenow` is omitted.
3. Give the bar a name with `aria-label` or `aria-labelledby` ("Import completion"); the primitive renders the role but not a name.
4. Choose `size`: `sm` (4px), `default` (8px) or `lg` (12px).
5. Put a visible text line beside or above the bar saying what is happening and how far ("Importing 12 of 50 notes").

## Heuristics

- A bar answers "how long": pair it with text that says what is running and, when known, the count or the time left.
- Determinate when the total is known, even roughly; a bar that sits at 90% for a minute is worse than a pulse.
- The fill is the primary colour and the track its 20% tint; the bar never changes colour to show state. A failure is said in a `callout` beside it.
- Show a distinct end: when the task completes, replace the bar with the result or a `positive` `callout`, do not leave it full.
- One bar per task. Nested bars for sub-tasks make neither readable.

## Content

- Label: a noun phrase naming the task ("Import completion", "Upload").
- Status text: present participle plus count ("Importing 12 of 50"), no trailing punctuation.
- Completion text: past tense ("Imported 50 notes").

## Accessibility

- The root carries `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax` (100 by default) and `aria-valuenow` when `value` is a number. With `indeterminate` and no `value`, `aria-valuenow` is omitted, which is the indeterminate form.
- The role has no name of its own; always pass `aria-label` or `aria-labelledby`. Pass `aria-valuetext` when the number alone is not meaningful ("12 of 50 notes").
- A progress bar inserted after load counts as a status message (WCAG 4.1.3); the visible status line beside it, in a `status` live region, is what a screen reader hears change.
- The bar is not interactive and not a target.
- The determinate fill transitions; the indeterminate pulse is suppressed by the primitive under `prefers-reduced-motion: reduce` (`motion-reduce:animate-none`), leaving a static bar, so the text beside it must still say the task is running.
