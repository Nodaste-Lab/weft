---
related:
  - text-field
  - input
  - form
  - checkbox
  - switch
  - radio-group
---

# Label

## Purpose

The visible caption for one form control. It owns the text and its association with the control: clicking it focuses or toggles the control, and its text becomes the control's accessible name. It has no layout of its own beyond the inline row it sits in.

## When to use

- Naming individual checkbox, switch, radio, slider, and custom selection controls.
- Custom text-control compositions that provide their own layout. TextField already includes its associated label.
- A caption that must be hidden visually but is still the name. Keep a real label and hide it with the screen-reader-only style.

## When not to use

- Naming a group of controls. Use a `fieldset` with a `legend`; a label names one control.
- A section signifier above a block. Use `eyebrow-label`.
- Help text or an error. Use `FormDescription` and `FormMessage` in `form`.
- Adding a second label to TextField. Its `label` prop owns the visible and accessible name.
- A custom FormItem composition. Use FormLabel, which sets the control association and error colour.

## How to use

1. Render `Label` with `htmlFor` equal to the control's `id`, or wrap the control in it. Either associates the two.
2. Put the required marker inside the label as text, with a space before it, and set `required` on the control.
3. Place the label beside a checkbox, switch, or radio item. For standard text forms use TextField and its cutout label. A custom text composition follows the chosen cutout or contextual underline layout; Label does not dictate its position.
4. For a disabled `checkbox` or `switch`, render the label as the next sibling; both controls set `peer`, so the label dims with the control.

## Heuristics

- One label, one control. A control with a label and an `aria-label` exposes only one of them, and not the one on screen.
- Sentence case. The accessible name is computed from rendered text, so uppercase styling rewrites the name.
- The label describes the value, not the action: "Project name", not "Enter project name".
- Mark the minority. On a mostly optional form mark the required fields; on a mostly required form mark the optional ones. Never both.
- A label does not change when the control's state changes. "Whisper mode" stays "Whisper mode" whether the switch is on or off.

## Content

- One to three words. No trailing colon, no full stop.
- Sentence case on every app surface. The mono face at compact density, the sans face at marketing.
- The required marker is the word "required" in the stop colour, after a space. Not an asterisk.
- Instructions belong in help text, not in the label.

## Accessibility

- Association by `htmlFor` or wrapping gives the control its name and makes the label a click target (WCAG 1.3.1, 2.4.6, 3.3.2).
- The visible text must be contained in the accessible name (WCAG 2.5.3). Do not override it with `aria-label` on the control.
- A hidden label uses the clip-path screen-reader-only style, never `display: none`, which removes it from the accessibility tree.
- Double-clicking a label does not select its text; the primitive prevents that so the click reaches the control.
- A wrapped label row is the touch target for a 16px `checkbox` or radio item. Give the row a minimum height of `--weft-touch-target` (WCAG 2.5.8).
