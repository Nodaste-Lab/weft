---
related:
  - input
  - radio-group
  - dropdown-menu
  - command
  - form
---

# Select

## Purpose

One value from a list that opens on demand. It owns the trigger (styled as a field, with the chevron), the portalled list with its groups, labels, separators and scroll buttons, the selected mark and the struck-through unavailable item. The option set and the chosen value belong to the consumer.

## When to use

- One choice from a long list where showing every option would take too much space.
- A setting with a sensible default that most people leave alone.

## When not to use

- Two to six options. Use `radio-group`; every option is visible and nobody has to open anything.
- More than one choice. Use a list of `checkbox`.
- Options that are actions, not values. Use `dropdown-menu`.
- A list long enough that people need to type to find things. Use `command` inside a `popover`.

## How to use

1. Compose `Select` (`value`, `defaultValue`, `onValueChange`, `disabled`) around `SelectTrigger`, `SelectValue` and `SelectContent` with `SelectItem` children. Group with `SelectGroup` and `SelectLabel`; divide with `SelectSeparator`.
2. Name the trigger with a visible `label` whose `htmlFor` matches the trigger `id`, or with `FormLabel` inside a `form`.
3. Set `placeholder` on `SelectValue` for the empty state. It is a hint, not an option.
4. Set `size="sm"` on the trigger to step down within the current density, and `state` to `error` or `disabled`. There is no read-only select; use `disabled`.
5. Mark an unavailable option `disabled` on `SelectItem`. It renders struck through and dimmed.

## Heuristics

- Pre-select for settings, not for questions. A question with a default steers the answer.
- Order options so they can be found: alphabetical by default, by frequency when the frequent ones are obvious, chronological for periods.
- Keep option labels short and parallel. A long label clamps to one line in the trigger.
- An unavailable option is struck through, never only greyed, because the list is chrome a colour cue alone does not reach.
- The select is the one field whose right edge belongs to the chevron, so the error glyph lives in the message, not in the control.
- The list caps to the available viewport height and scrolls inside.

## Content

- Trigger label: sentence case, the thing being chosen ("Recap period").
- Placeholder: "Choose a period", not "Select..." and not a blank option.
- Option labels: sentence case, nouns or short phrases, no trailing punctuation ("Last 7 days").
- Group labels in `SelectLabel`: sentence case, naming the group, not an instruction.
- The reason an option is unavailable goes in help text under the field.

## Accessibility

- The trigger exposes the `combobox` role, `aria-expanded` and the current value; the list is a `listbox` and items carry `aria-selected`. Arrow keys move, typing jumps to a match, Enter and Space choose, Escape closes and returns focus to the trigger.
- `state="error"` sets `aria-invalid` on the trigger. The message attaches through `aria-describedby`, error first (WCAG 3.3.1).
- The consumer names the trigger with a visible label (WCAG 1.3.1, 3.3.2). `aria-label` is for an icon-only trigger only.
- Trigger height is 32px or more at every density and size (`--weft-touch-target`, WCAG 2.5.8).
- The open and close transition stops under `prefers-reduced-motion`.
