---
related:
  - radio-group
  - switch
  - toggle
  - label
  - form
---

# Checkbox

## Purpose

A boolean that commits with the form around it. It owns the tile, the check and the indeterminate mark, and the checked, unchecked, mixed, error and disabled states. The label row and the group it belongs to are the consumer's, through `label` and a `fieldset`.

## When to use

- Several independent choices from one set ("Include vault sources", "Invite my team too").
- One opt-in that is saved with the rest of a form.
- A "select all" over a list, showing `indeterminate` while only some rows are checked.

## When not to use

- A setting that takes effect the moment it changes. Use `switch`.
- Exactly one choice from a set. Use `radio-group`.
- A pressed tool state in a toolbar. Use `toggle`.
- A filter chip with a count. Use `signal-filter-chip-group`.

## How to use

1. Render `Checkbox` with an `id` and a `label` whose `htmlFor` matches, or wrap both in the label so the whole row toggles it.
2. Control it with `checked` and `onCheckedChange`, or seed it with `defaultChecked`. `checked="indeterminate"` draws the mixed mark; the next activation reports `true`.
3. Give it `name` inside a form; a hidden native input carries the value on submit.
4. Group related checkboxes in a `fieldset` with a `legend` that states the question, and lay rows out with a 12px gap so adjacent 32px rows sit 44px centre to centre.
5. Set `disabled` for an unavailable choice and `aria-invalid` with a described message for an error on the control; a group error attaches to the group.

## Heuristics

- Checked means the label is true. Phrase the label so "on" is the affirmative: "Include vault sources", never "Do not include".
- Do not pre-check a question. A pre-checked box is missed as often as it is read.
- Order options alphabetically or by expected frequency, and keep the order stable between visits.
- Offer "None of these" as the last option when "none" is a real answer, so an empty selection is distinguishable from a skipped one.
- Colour is state: the primary fill means checked, the dashed or dimmed tile means disabled. The mark, not the fill, is what makes the state readable with colour removed.
- A group of related boxes under a "select all" uses the mixed state, and the mixed box reads as partially checked, not as unchecked.

## Content

- Label: sentence case, a short statement that is true when checked. No trailing punctuation.
- Legend: the question or the thing being chosen ("Sources to include"), sentence case.
- Help text explains a consequence, not the control: "Shared sources stay read-only".
- Error: "Select at least one source", attached to the group.
- Nothing is pre-checked as fixture; a default is a real saved value or unchecked.

## Accessibility

- The control exposes `role="checkbox"` with `aria-checked` as `true`, `false` or `mixed`; Space toggles it; the focus ring is the global one.
- The consumer names it with a `label` by `htmlFor` or by wrapping (WCAG 1.3.1, 3.3.2), and names a group with a `fieldset` and `legend`.
- The tile measures 16px, so the labelled row is the target: give it a minimum height of `--weft-touch-target` (24px floor, WCAG 2.5.8) and the 12px stack gap.
- Errors attach through `aria-invalid` and an ordered `aria-describedby` list, never by the red border alone (WCAG 1.4.1, 3.3.1).
- The check mark renders without a transition, so there is nothing to reduce under `prefers-reduced-motion`.
