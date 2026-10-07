---
related:
  - input
  - textarea
  - search-field
  - form
  - calendar
---

# TextField

## Purpose

The standard labelled form field: cutout by default, contextual underline as an alternative. Composes Input or Textarea with the label, helper, error, status, and optional attached action. The application owns validation, saving, and announcements.

## When to use

- Settings, invitations, creation forms, and other requests for new information.
- Multiline descriptions or plain-text prompts, with `multiline`.
- A simple calendar date, with `type="date"`.

## When not to use

- Queries: use SearchField and its own clear action.
- In-place title editing: use Input in the inline rename pattern with Save, Cancel, and focus recovery.
- Rich document content: use the application's editor.

## How to use

1. Import TextField and the package CSS. Supply a meaningful `label`; `treatment` defaults to `cutout`.
2. Use `description` for durable instructions and `error` for corrective feedback. Both remain associated with the control, error first.
3. Use `multiline` and `rows` for longer text. Enter inserts a newline; it is not a commit shortcut.
4. Set `pending` and `status` for a check in progress. These expose state; use application-controlled focus or a live region for announcements.
5. Supply `action` with a Button for a connected action. A submit action uses `type="submit"` inside a form. Icon buttons need an accessible name and a decorative hidden icon.
6. Controlled fields use `value` and `onChange`; uncontrolled fields use `defaultValue`. The ref targets the native control.

## Heuristics

- Cutout is primary for forms. Underline is for a small number of clearly labelled contextual edits, never an excuse to hide a label.
- Empty multiline labels rest near the first line. Focused, filled, and invalid labels notch into the outline. Date labels stay notched because native segments are always present.
- Editable fills are clear. Read-only fields use a static fill, a persistent cutout label, and a visible “Read only” cue while remaining focusable and selectable. Disabled fields retain their separate dimmed/dashed treatment and native disabled semantics.
- Attached buttons are flush with the shared boundary. Input and action retain independent focus indicators; never turn the whole group into one click target.
- The action slot is single-line only and is ignored when `multiline` is true. Place multiline submit actions after the field in the surrounding form; keep buttons clear of textarea content and its resize affordance.
- Preserve entries on failure. Ignore stale asynchronous results; do not mark a failed availability check as valid.

## Content

- Label the purpose, not the control type. Mark required or optional consistently across the form.
- Help text is optional. Omit description when the label is sufficient; do not repeat the label or fill space with explanatory copy. Add help for necessary formats, constraints, consequences, or unfamiliar context.
- Instructions belong in description, not a disappearing placeholder. TextField reserves its placeholder for label positioning.
- Error text says how to correct the value. Status communicates actual progress or confirmation, never speculative success.

## Accessibility

- A real label targets the generated or supplied id; clicking it focuses the native control.
- Description references list error, status, and helper in that order, and include only rendered content.
- Error exposes `aria-invalid`; pending exposes `aria-busy`. Neither creates an automatic live announcement.
- Disabled and read-only are native attributes. Every editable control and attached action has its own focus target.
- Date entry preserves the browser picker and locale formatting. The label masks the border and ring without hiding the rest of the focus indicator.
- Import `@nodaste-lab/weft/index.css` or the equivalent ordered token/component bundle to load the composition styles.
