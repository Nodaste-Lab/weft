---
related:
  - text-field
  - input
  - form
  - label
  - search-field
  - calendar
---

# Textarea

## Purpose

A multi-line text field. It owns the boundary, the per-density minimum height, growth with content and the four states (default, error, disabled, read-only). Label, help and error text come from `label` and `form`. The value and its validation belong to the consumer.

## When to use

- Text that runs past one line: a note, a description, a message, a prompt, a draft.
- A free-text answer whose length is open.

## When not to use

- A short value that fits one line. Use `input`.
- A value that is really a choice. Use `radio-group` or `select`; an open question is harder to answer than a closed one.
- Rich or structured content with its own editor. This is a plain-text control.

## How to use

1. Render `Textarea` with an `id` and a visible `label` whose `htmlFor` matches, or inside `FormControl` in a `form`.
2. Set `rows` to the amount of text you expect. The control also grows with its content above the density floor `--weft-textarea-min-h` (96, 80 or 72px).
3. Set `state` to `error`, `disabled` or `readonly`. `error` sets `aria-invalid`; the other two set the native attributes.
4. Validate on blur or an explicit save. Enter inserts a newline in a textarea and is never a commit; the consumer's commit handling must not treat it as one.
5. Attach help and error text through one ordered `aria-describedby` list, error first.

## Heuristics

- Use the border-cutout label composition for multi-line form fields, with the same clear editable fill as Input. Position the empty label near the first text line at the top, never vertically centered. Keep the label at the outline while focused, filled, or invalid. Use TextField with `multiline` for this shared composition; Textarea remains the bare control.
- Use Input for one line, SearchField for a query, and date entry for calendar dates. Do not use a textarea as a substitute for a rich document editor.


- Height is proportional to the expected text. Three rows for a short note, more for a message; never a one-line textarea.
- A character limit needs a reason. When there is one, show the remaining count as text that updates, not as a hard stop that eats keystrokes.
- The same boundary rules as `input`: the border carries 3:1, hover reinforces, disabled dashes and dims, read-only keeps the text readable.
- Validate at commit, re-validate on keystroke once in error, and never collapse an invalid field.
- Overflow uses the control's own scrolling. The value is never truncated.

## Content

- Label: sentence case, short, no colon. Say what the text is for ("Session notes"), not what to do.
- Placeholder: a format or length hint at most ("A few sentences is plenty"). Never the label.
- Help text: one sentence on what to include or leave out.
- Errors name the rule: "Notes must be 500 characters or fewer", not "Too long".
- Defaults are empty or the real current value.

## Accessibility

- The component sets `aria-invalid` for `state="error"`, `disabled` and `readOnly` for the other states, and takes the global focus ring.
- The consumer provides a visible label by `htmlFor` (WCAG 1.3.1, 3.3.2) and the ordered `aria-describedby` list for error and help (WCAG 3.3.1).
- The control clears the 24px floor at every density (`--weft-touch-target`, WCAG 2.5.8).
- Growth with content does not move focus. A focused control under sticky chrome needs `--weft-sticky-chrome-h` and a marked scrollport (WCAG 2.4.11).
- A character count, when present, is help text in the description list, not a live announcement on every keystroke.
