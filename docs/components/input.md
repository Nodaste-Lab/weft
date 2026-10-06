---
related:
  - label
  - form
  - textarea
  - search-field
  - select
---

# Input

## Purpose

A single-line text field. It owns the control itself: the boundary and fill, the height tier, the four states (default, error, disabled, read-only), the three resting tiers (default, underline, low) and the chromeless inline editor. The label, help text and error message live in `label` and `form`. The value, and whether it is valid, belong to the consumer.

## When to use

- A short free-text value: a name, a path, an address, a code, a number.
- A value that already exists and is edited in place. Use `variant="underline"` or `variant="low"` where the field should rest quietly, and `variant="inline"` for a rename inside a row or a tab.
- A rare input with no current value. Prefer a labelled `button` that reveals the field over an empty box at rest.

## When not to use

- More than one line. Use `textarea`.
- Searching or filtering a list. Use `search-field`, which carries the hidden label, the glyph and the clear control.
- One value from a fixed set. Use `select` for a long list and `radio-group` for a short one.
- A date. Use `calendar`, with an `input` beside it for typed entry.
- A whole field with label, help and error. Use `form`, which wires the ids.

## How to use

1. Render `Input` with an `id` and a visible `label` whose `htmlFor` matches, or place it inside `FormControl` in a `form` and let `FormLabel` do the wiring.
2. Choose the resting tier with `variant`: `default` is a bordered field, `underline` keeps only the bottom border, `low` is bordered with quieter colour, `inline` has no chrome and shows only the focus ring. All four are real inputs in tab order.
3. Choose the height step with `size`: `default` is the current density tier, `sm` is one step down within it. The native `size` attribute (width in characters) is not forwarded; set a width instead.
4. Set `state` to `error`, `disabled` or `readonly`. `error` sets `aria-invalid`; the other two set the matching native attributes.
5. Set `type`, `inputMode` and `autoComplete` for the kind of value. For codes and identifiers use `type="text"` with `inputMode="numeric"` rather than `type="number"`.
6. Validate at the commit boundary (blur, Enter, explicit save), never on keystroke. `useCommitBoundary` is an opt-in hook that emits one signal per commit; the consumer runs its own check when the signal arrives.

## Heuristics

- Resting weight follows how often the field is touched, not how much the value matters. Default to a trigger that reveals the field; show a field at rest only when it is frequent, comparative, primary, live, or a step in a visible sequence.
- A field keeps one boundary. The border carries 3:1 against the surface (WCAG 1.4.11); the fill is decorative. Reduce colour, never structure.
- Hover may reinforce the boundary. It never carries it, because hover does not exist on touch or for a keyboard user.
- Reward early, punish at commit. Once a field is in error, re-validate on keystroke so the error clears the moment it is fixed.
- Empty is a valid state. An optional field that is cleared returns to rest with no error and no colour.
- Invalid never collapses. A field that can close holds open until it is valid or discarded, or carries its error on the collapsed form.
- Disabled and read-only are different promises. Disabled dims the control and dashes the border; read-only keeps full text contrast and changes only the fill.
- Never re-ask for what the surface already has (WCAG 3.3.7). Pre-populate the earlier value or offer it for selection.
- Width suggests expected length. A postcode field and a URL field should not be the same width.

## Content

- Label: sentence case, one to three words, no trailing colon. The label is the accessible name, so its case is a naming rule as well as a typographic one.
- Required: mark the minority. Write the word "required" after the label with a space before it and set the `required` attribute. Never a bare asterisk; never required and optional markers on the same form.
- Placeholder: a format hint ("e.g. northstar"), never the label and never an instruction. It disappears on typing and is not reliably read by screen readers.
- Help text: one short sentence below the control saying what the value is used for or where to find it. No links in help text.
- Error: what happened, why, what to try. Copy first, colour second. Never a bare "Invalid".
- Defaults: the real current value, or empty. Never fixture text.

## Accessibility

- The component sets `aria-invalid` for `state="error"`, `disabled` and `readOnly` for the other states, and takes the global focus ring on `:focus-visible` (delivered as both outline and box-shadow so neither can be deleted alone).
- The consumer provides a visible label associated by `htmlFor` (WCAG 1.3.1, 3.3.2). A hidden label is for a surface that cannot carry one; `aria-label` is for icon-only controls only.
- Error and help text attach through one ordered `aria-describedby` list: error first, status second, help last. `FormControl` does this; a hand-wired field follows the same order (WCAG 3.3.1, 3.3.3).
- Set `autoComplete` on fields that collect personal data (WCAG 1.3.5).
- Control height is 32px or more at every density and size, clearing the 24px floor (`--weft-touch-target`, WCAG 2.5.8). The `inline` variant inherits its line height, so the consumer pads it to the floor.
- A focused field must not sit under sticky chrome (WCAG 2.4.11). Declare `--weft-sticky-chrome-h` and mark the scrolling element with `.weft-scrollport`.
- Border transitions run at `--weft-dur-fast` and stop under `prefers-reduced-motion`.
