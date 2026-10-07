---
related:
  - text-field
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
- react-hook-form fields that share validation, dirty state, error focus, or submission. TextField handles standard text-field presentation; the FormItem family handles custom control presentation.

## When not to use

- A single setting that applies immediately. Use `switch` or `hud-toggle-switch` with a `label`.
- Filtering or searching. Use `search-field`.
- A field whose validation library is not react-hook-form. Use TextField directly for standard text/date fields and supply value, events, errors, and status from that library. Custom controls require equivalent label and ordered description wiring.

## How to use

1. Create state with `useForm` and wrap the fields in `Form` (the provider). Render a native `<form>` with `onSubmit={form.handleSubmit(...)}`; Form itself does not render the HTML form.
2. For standard text, multiline, or native date fields, use `FormField` and pass its `field` value, name, onChange, onBlur, and ref to TextField. Pass `fieldState.error?.message` to `error`, durable instructions to `description`, and a supplied check to `status`/`pending`.
3. TextField owns its label and feedback ids. Do not wrap it in FormControl or add FormLabel/FormDescription/FormMessage around it: that creates competing ownership and can attach ARIA to the wrapper rather than the native control.
4. For a custom layout or non-text control, FormItem scopes the ids. FormControl wraps the actual focusable Input, Textarea, SelectTrigger, Checkbox, or Switch. FormLabel names that control; FormMessage, one FormStatus, and FormDescription supply error, status, and durable help. For custom cutout text fields, put the native control followed by FormLabel inside the shared `weft-text-field-group` / `weft-text-field-control` structure shown in the playground source. Keep editable fill clear.
5. For custom-field checks, render one FormStatus per item: pending while the check is in flight, then tone (`ok`, `info`, `warn`, `stop`) with actual result text. Change its props; never stack statuses. These expose state without making a request or announcing it.
6. Validate on first blur or submit, then revalidate existing errors while correcting the value (`mode: "onTouched"`, `reValidateMode: "onChange"` is one react-hook-form configuration). Enter can submit a single-line form; Enter in a textarea inserts a newline. The consumer owns validation rules and save operations.
7. On failed submission focus the first invalid native control or a linked summary. Preserve entries after save failure, prevent duplicate saves while pending, and do not claim newer edits were saved by an older request.

## Heuristics

- Weft exposes supplied field state; an optional commit-boundary hook can signal a commit. The consumer owns whether the value is valid, whether the error is shown, the value itself, and submission.
- Error first. A field in error has one urgent thing to say; the format hint the user has already read comes after.
- Ids are element-tracked. A description, message or status id is listed only while that element is mounted, so nothing points at nothing.
- A `stop` status does not make the field invalid. Whether a failed check becomes an error stays with the consumer's error machinery.
- Nothing here blocks progression. A helper that decides when you may submit is a form library, and fights the one in use.
- Mark the minority: plain text "(required)" in the label plus the `required` attribute, or "(optional)", never both. No colour, no asterisk; on a mostly required form, state that fields are required and mark only the optional ones.

## Content

- `FormLabel`: sentence case, one to three words, no colon.
- `FormDescription` and TextField `description` are optional. Omit them when the label is sufficient; provide necessary format, constraint, consequence, or contextual guidance. Preserve that useful guidance when an error appears.
- `FormMessage`: what happened, why, what to try. It leads with an alert glyph; the words carry the meaning.
- `FormStatus`: the consumer's text carries the meaning ("Checking source", "Degraded. Local content stays readable"). The tone colour reinforces it.
- No placeholder as a label, and no fixture value as a default.

### Form composition rules

- Ask only for necessary data; reuse known answers. Prefer one column, group related controls, and reveal dependent questions only when relevant.
- Use justified defaults and suggestions that remain editable. Break genuinely long tasks into meaningful steps with progress and a review of key answers.
- Password confirmation is not a default requirement; use reveal and clear requirements. Positive feedback should confirm meaningful checks rather than decorate every valid field.

Source: [Text fields & Forms design — Taras Bakusevych](https://uxdesign.cc/text-fields-forms-design-ui-components-series-2b32b2beebd0).

### Implementation and review requirements

These requirements apply to form compositions in Weft and to consuming applications. Review them alongside the individual control's contract.

- Group related questions with fieldset/legend where the relationship needs a programmatic name. Keep DOM, reading, and keyboard order consistent. Provide descriptive headings for longer sections.
- Required rules must be both visible and programmatic. Keep indispensable format instructions present when an error appears; the error explains the correction without replacing durable help.
- A submitted form with errors focuses either the first invalid control or a linked summary. Summary links resolve to actual control ids and focus those controls; remove resolved entries. Avoid announcing the same error through several competing live regions.
- Conditional controls must leave validation and submission when irrelevant. Preserve a reversible draft only if safe, and explain what will be retained. Never submit hidden stale permissions or credentials. If a focused section disappears, place focus on its controlling question.
- Keep an explicit Back/Cancel or workspace exit in multi-step flows. Preserve safe answers between steps and guard unsaved changes. Do not trap users by removing all navigation. Never store secrets in a persisted draft.
- Defaults come from known user or workspace context. Do not silently infer location or permissions. Suggestions require the appropriate accessible combobox/listbox pattern; use the shared selection primitives rather than adding an ad hoc popup to Input.
- State the Organization, Space, recipient, and intended access before permission-changing submission. The application remains responsible for authorization and server validation.
- An asynchronous result belongs to the exact value and context checked. Ignore late results after edits, scope changes, or unmount. A failed check means unknown, not available or valid.
- Preserve entered values after rejection or connection failure. Show pending and retry status, prevent duplicate submission, and do not claim success for values edited during the request. Idempotency and safe retry remain application responsibilities.
- For irreversible changes, identify the target and consequence and provide deliberate confirmation; prefer undo when the operation supports it. Typed confirmation is risk-based, not a requirement on every form.

Accessibility basis: W3C WAI tutorials on [labels](https://www.w3.org/WAI/tutorials/forms/labels/), [grouping](https://www.w3.org/WAI/tutorials/forms/grouping/), and [validation](https://www.w3.org/WAI/tutorials/forms/validation/). The article supplies design guidance; WAI and the component contracts supply accessibility requirements.

## Accessibility

- `FormControl` sets `id`, `aria-invalid` from the field error, `aria-busy` while a status is pending, and one ordered `aria-describedby` list: message, status, description (WCAG 3.3.1, 3.3.3). `FormLabel` sets `htmlFor` to the same id (WCAG 1.3.1).
- A consumer's own `aria-describedby` or `aria-busy` on the control replaces the wired exposure, and with it the consumer owns the order and the busy pairing.
- Everything here is exposure, not announcement. A change to a described element is not a reliable live update; on submit, the consumer moves focus to the first invalid field or a summary (WCAG 2.4.3).
- The pending dot is `aria-hidden` and its pulse ends at full opacity, so under `prefers-reduced-motion` it is static and visible.
- Field controls keep their own floors: 32px or more for text controls, a labelled row of `--weft-touch-target` for a `checkbox` (WCAG 2.5.8).
