---
related:
  - text-field
  - label
  - form
  - textarea
  - search-field
  - select
  - calendar
---

# Input

## Purpose

A single-line text field. It owns the control itself: the boundary and fill, the height tier, the four states (default, error, disabled, read-only), the three resting tiers (default, underline, low) and the chromeless inline editor. TextField supplies the standard label, help, and error composition; custom compositions use `label` and `form`. The value, and whether it is valid, belong to the consumer.

## When to use

- A short free-text value: a name, a path, an address, a code, a number.
- A value that already exists and is edited in place. Use `variant="underline"` or `variant="low"` where the field should rest quietly, and `variant="inline"` for a rename inside a row or a tab.
- A requested value in a visible form remains an editable field even when empty. Reveal a rare inline editor from a labelled trigger only when editing is secondary to the surrounding task.

## When not to use

- More than one line. Use `textarea`.
- Searching or filtering a list. Use `search-field`, which carries the hidden label, the glyph and the clear control.
- One value from a fixed set. Use `select` for a long list and `radio-group` for a short one.
- A calendar date. Use `TextField type="date"` for native entry and `calendar` when a visual date-selection surface is needed.
- A standard field with label, help and error. Use `text-field`; use `form` when the composition needs shared form-state wiring.

## How to use

1. Use TextField for the standard border-cutout form-field presentation. Use Input directly for a custom composition that supplies its own label, instructions, feedback, and layout. The native Input owns the control; its associated label is composed around it. Render `Input` with an `id` and a visible `label` whose `htmlFor` matches, or place it inside `FormControl` in a `form` and let `FormLabel` do the wiring.
2. Choose the resting tier with `variant`: `default` is a bordered field, `underline` keeps only the bottom border, `low` is bordered with quieter colour, `inline` has no chrome and shows only the focus ring. All four are real inputs in tab order.
3. Choose the height step with `size`: `default` is the current density tier, `sm` is one step down within it. The native `size` attribute (width in characters) is not forwarded; set a width instead.
4. Set `state` to `error`, `disabled` or `readonly`. `error` sets `aria-invalid`; the other two set the matching native attributes.
5. Set `type`, `inputMode` and `autoComplete` for the kind of value. For codes and identifiers use `type="text"` with `inputMode="numeric"` rather than `type="number"`.
6. Start validation at the commit boundary (blur, Enter, explicit save); re-validate an existing error as the user corrects it. `useCommitBoundary` is an opt-in hook that emits one signal per commit; the consumer runs its own check when the signal arrives.

## Heuristics

### Attached actions

- Use one shared boundary for an input and an action operating on that value. Give each interactive part its own keyboard focus indication; do not make the entire group one click target.
- A submit button uses `type="submit"` inside its form. Reveal, clear, and filter buttons use `type="button"` and must not submit it. Keep label, helper, and error associations on the input itself.
- Inset search filters occupy their own trailing slot after the query and clear control. Reserve space for all controls; query text, clear, and filters must not overlap. Use a named filter button with expanded state and a keyboard-operable panel; Escape returns focus to the trigger.
- Display the active filter state and expose matching/no-result feedback. Clearing a query retains filters; resetting filters retains the query. An empty result is not a validation error.
- Do not add a trailing action to a textarea if it obscures text or the resize affordance. These are composed examples, not new Input or SearchField props.


- Keep requested fields visible in forms under the existing `sequence` reason (Input heuristics amendment A6). Preserve the existing named reasons for resting visibility; do not introduce a surface-type exemption. Use quieter treatments for secondary inline editing.
- Editable inputs use a transparent fill by default. Read-only and disabled fills remain distinct; do not use a gray editable fill that suggests a static state.
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
- Required: mark the minority. Write “(required)” after the label with a space before it and set the `required` attribute. Never a bare asterisk; never required and optional markers on the same form.
- Placeholder: a format hint ("e.g. northstar"), never the label and never an instruction. It disappears on typing and is not reliably read by screen readers.
- Help text is optional. Add one short sentence only when the label is insufficient and users need format, constraint, consequence, or contextual guidance. Do not repeat the label. No links in help text.
- Error: what happened, why, what to try. Copy first, colour second. Never a bare "Invalid".
- Defaults: the real current value, or empty. Never fixture text.

### Choosing the pattern

| Pattern | Use when | Do not use when |
|---|---|---|
| Border-cutout (primary) | Collecting information in Settings, creation, invitations, or other forms; label and instructions need to remain clear | Editing a title directly in existing content |
| Underline | A small number of contextual edits with persistent, clearly associated labels | Long or unfamiliar forms; choosing it only to reduce visual weight |
| Low | Secondary metadata edits with clear context and a complete outlined boundary | Hiding required information, suggesting a disabled state, or reducing accessible contrast |
| Inline rename | Editing an existing document title, file name, or row label in place | Asking for new information whose purpose is not already evident |

Inline rename is an interaction composition using a native Input, not an unlabelled text element. Provide a discoverable keyboard-operable Rename action, focus the editor on activation, and associate a visually hidden label such as “Document title”. Keep the title's heading semantics outside edit mode. The value alone is not the control's name. Provide Save/Cancel actions; Enter saves and Escape cancels (without intercepting IME composition). Keep failed edits open with their values and errors; restore focus to the invoking control on completion. Do not rely on hover or double-click alone. Hidden labels are permitted only when visible context identifies the purpose; ordinary forms retain visible labels.

### Field decisions

- Use persistent labels, contextual hints, appropriate input types and keyboards, and widths suited to expected content. Do not use placeholders as labels.
- Distinguish editable, focused, invalid, read-only, and disabled states. Keep corrective feedback near its field; avoid errors before the user finishes an attempt.
- Permit password paste, password managers, and a labelled reveal control; keep actual password requirements visible.

Source: [Text fields & Forms design — Taras Bakusevych](https://uxdesign.cc/text-fields-forms-design-ui-components-series-2b32b2beebd0). These are Weft rules adapted from the article, rather than claims that one label arrangement is universally fastest.

### Avalandra application

- Settings and creation forms use the reviewed border-cutout label direction and clear editable fill. Use TextField for the shared cutout or underline composition. Input remains the bare control and intentionally has no cutout prop.
- Keep inline document rename separate: Enter submits, Escape cancels, and focus returns to the invoking row. Search uses SearchField.
- Personal profile fields use their correct autocomplete tokens. Invitation recipients are other people: do not mark them as the signed-in user's email. Never preload credentials or invent personal defaults.
- A reveal control is a keyboard-operable button with an explicit name and state. Revealing must preserve the value and focus; never submit the form. Credential requirements come from the authentication service, not this component.
- Prefixes, suffixes, and units must also appear in associated instructions when needed to interpret the value. Decorative icons do not substitute for words.

## Accessibility

- The component sets `aria-invalid` for `state="error"`, `disabled` and `readOnly` for the other states, and takes the global focus ring on `:focus-visible` (delivered as both outline and box-shadow so neither can be deleted alone).
- The consumer provides a visible label associated by `htmlFor` (WCAG 1.3.1, 3.3.2). A hidden label is for a surface that cannot carry one; `aria-label` is for icon-only controls only.
- Error and help text attach through one ordered `aria-describedby` list: error first, status second, help last. `FormControl` does this; a hand-wired field follows the same order (WCAG 3.3.1, 3.3.3).
- Set `autoComplete` on fields that collect personal data (WCAG 1.3.5).
- Control height is 32px or more at every density and size, clearing the 24px floor (`--weft-touch-target`, WCAG 2.5.8). The `inline` variant inherits its line height, so the consumer pads it to the floor.
- A focused field must not sit under sticky chrome (WCAG 2.4.11). Declare `--weft-sticky-chrome-h` and mark the scrolling element with `.weft-scrollport`.
- Border transitions run at `--weft-dur-fast` and stop under `prefers-reduced-motion`.
