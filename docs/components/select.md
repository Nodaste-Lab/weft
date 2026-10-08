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

- Two to six options normally use `radio-group` so every option is visible. A compact form or an explicit policy dropdown can use Select for a short known set; it does not need search.
- More than one choice. Use a visible list of `checkbox`, or `multi-select` when search is needed.
- Options that are actions, not values. Use `dropdown-menu`.
- A list long enough that people need to type to find things. Use `combobox`.

## How to use

1. Compose `Select` (`value`, `defaultValue`, `onValueChange`, `disabled`) around `SelectTrigger`, `SelectValue` and `SelectContent` with `SelectItem` children. Group with `SelectGroup` and `SelectLabel`; divide with `SelectSeparator`.
2. Name the trigger with a visible `label` whose `htmlFor` matches the trigger `id`, or with `FormLabel` inside a `form`.
3. Set `placeholder` on `SelectValue` for the empty state. It is a hint, not an option.
4. Set `size="sm"` on the trigger to step down within the current density, and `state` to `error` or `disabled`. There is no read-only select; use `disabled`.
5. Mark an unavailable option `disabled` on `SelectItem`. It renders struck through and dimmed.


### Cutout field composition

Use the existing public selection-field classes with Select for standard form presentation. No new component or search input is needed. Import `@nodaste-lab/weft/index.css` (or the equivalent ordered CSS bundle). The label stays cut out even when empty; the trigger follows density and `size`. The editable fill is clear. Bare Select remains suitable for a custom labelled contextual control; Combobox is for finding an option by search.

```tsx
const id = React.useId();
const describedBy = [
  error && `${id}-error`, status && `${id}-status`, description && `${id}-help`,
].filter(Boolean).join(' ') || undefined;

<div className="weft-selection-field" data-invalid={!!error || undefined}>
  <Select name="keyType" value={value} onValueChange={setValue}
    required={required} disabled={disabled}>
    <div className="weft-selection-control">
      <label htmlFor={id}>Key type{required ? ' (required)' : ''}</label>
      <SelectTrigger id={id} state={error ? 'error' : undefined}
        aria-describedby={describedBy}>
        <SelectValue placeholder="Choose a key type" />
      </SelectTrigger>
    </div>
    <SelectContent>
      <SelectItem value="personal">Personal API key</SelectItem>
      <SelectItem value="workspace">Workspace API key</SelectItem>
    </SelectContent>
  </Select>
  {error && <p id={`${id}-error`} className="weft-selection-error">{error}</p>}
  {status && <p id={`${id}-status`} className="weft-selection-help">{status}</p>}
  {description && <p id={`${id}-help`} className="weft-selection-help">{description}</p>}
</div>
```

The surrounding component supplies `value`, `setValue`, `required`, `disabled`, `error`, `status` and `description`. Use `defaultValue` instead for an uncontrolled Select. `name`, `required` and `disabled` belong on Select, which supplies native form participation; the trigger receives the id and feedback references. Omit absent feedback entirely. Status does not automatically announce saving; the application owns announcements and validation. With react-hook-form, use FormControl around SelectTrigger and FormLabel in the same selection-control wrapper, with FormMessage, FormStatus and FormDescription after it; do not add a second label or competing ids.

Preserve SelectGroup/SelectLabel for grouped options. Pass secondary option copy through `SelectItem description`, outside its children: `<SelectItem value="workspace" description="Shared with your workspace">Workspace API key</SelectItem>`. Only children enter the selected trigger value. The description is associated with the option through `aria-describedby`, preserving any supplied description ids. Set `textValue` to a concise plain label when children contain rich markup; `textValue` controls typeahead, not the selected trigger content. Keep essential unavailable-option explanations in associated help and mark the option disabled. Do not encode permission checks in the field.

Migration: replace an external field label wrapper with the selection-field and selection-control wrappers above. Retain the real Select options, values and save handler. Do not place Select inside a wrapping HTML label: its portal and hidden form control need a separate label targeting the trigger. Do not copy TextField CSS or add a search input for two known values.

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
