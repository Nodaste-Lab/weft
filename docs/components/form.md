---
related:
  - input
  - label
  - textarea
  - select
  - checkbox
---

# Form

## Purpose

The field family around a control: label, control slot, description, error message and asynchronous status, with every id and ARIA relationship wired by construction on top of react-hook-form. It owns how a supplied error or status is exposed. It does not own validation, the value, or submission; it never blocks any of them.

## When to use

- A set of fields whose values are validated and saved together.
- Any field that needs help text, an error message or a pending status attached to its control without hand-writing ids.

## When not to use

- A single setting that applies immediately. Use `switch` or `hud-toggle-switch` with a `label`.
- Filtering or searching. Use `search-field`.
- A field whose validation library is not react-hook-form. Wire `label`, `input` and the ordered `aria-describedby` list by hand, in the same order.

## How to use

1. Create the form with `useForm` and wrap the fields in `Form` (the provider).
2. For each field, render `FormField` with `control`, `name` and `render`. Inside it, `FormItem` scopes the ids.
3. Inside `FormItem`: `FormLabel`, then `FormControl` wrapping the control (`Input`, `Textarea`, `SelectTrigger`, `Checkbox`), then `FormDescription` for help text and `FormMessage` for the error.
4. For a check that answers after the commit, render one `FormStatus` per item: `pending` while the check is in flight, then `tone` (`ok`, `info`, `warn`, `stop`) with your own words. Change its props; never render a second one.
5. Validate at the commit boundary (blur, Enter, explicit save). `useCommitBoundary` is the opt-in signal; the consumer calls its own `trigger` when it fires, and re-validates on keystroke once a field is in error.

## Heuristics

- Weft owns when a field has committed and how a supplied state is exposed. The consumer owns whether the value is valid, whether the error is shown, the value itself, and submission.
- Error first. A field in error has one urgent thing to say; the format hint the user has already read comes after.
- Ids are element-tracked. A description, message or status id is listed only while that element is mounted, so nothing points at nothing.
- A `stop` status does not make the field invalid. Whether a failed check becomes an error stays with the consumer's error machinery.
- Nothing here blocks progression. A helper that decides when you may submit is a form library, and fights the one in use.
- Mark the minority: the word "required" in the label plus the `required` attribute, or "optional", never both.

## Content

- `FormLabel`: sentence case, one to three words, no colon.
- `FormDescription`: one sentence of help. What the value is for or where to find it.
- `FormMessage`: what happened, why, what to try. It leads with an alert glyph; the words carry the meaning.
- `FormStatus`: the consumer's text carries the meaning ("Checking source", "Degraded. Local content stays readable"). The tone colour reinforces it.
- No placeholder as a label, and no fixture value as a default.

## Accessibility

- `FormControl` sets `id`, `aria-invalid` from the field error, `aria-busy` while a status is pending, and one ordered `aria-describedby` list: message, status, description (WCAG 3.3.1, 3.3.3). `FormLabel` sets `htmlFor` to the same id (WCAG 1.3.1).
- A consumer's own `aria-describedby` or `aria-busy` on the control replaces the wired exposure, and with it the consumer owns the order and the busy pairing.
- Everything here is exposure, not announcement. A change to a described element is not a reliable live update; on submit, the consumer moves focus to the first invalid field or a summary (WCAG 2.4.3).
- The pending dot is `aria-hidden` and its pulse ends at full opacity, so under `prefers-reduced-motion` it is static and visible.
- Field controls keep their own floors: 32px or more for text controls, a labelled row of `--weft-touch-target` for a `checkbox` (WCAG 2.5.8).
