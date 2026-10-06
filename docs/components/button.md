---
related:
  - action-button-row
  - add-item-button
  - toggle
  - tooltip
  - alert-dialog
---

# Button

## Purpose

The action control. It owns the variant axis (default, destructive, outline, secondary, ghost, link), the size axis (default, sm, lg, icon, dense), the four interaction states (idle, blocked, disabled, loading) and the pressed state for toggles. It does not own navigation: a button that goes somewhere renders `asChild` around an anchor.

## When to use

- Any action that changes state, submits, opens an overlay or starts work.
- A two-state toggle, with `pressed`.
- Navigation that is drawn as a button, with `asChild` around an `<a href>`.

## When not to use

- A link inside running text. Use a plain anchor; the `link` variant is for a button-shaped link in a row or footer, not prose.
- A set of mutually exclusive options. Use `toggle-group` or `radio-group`.
- Appending a row to an editable list. Use `add-item-button`.
- Several actions behind one control. One `button` is the trigger of a `dropdown-menu`.

## How to use

1. Render `Button` with `variant` and `size`. The default variant is the filled primary; one per region.
2. Pick the state that is true. `disabled` means the action is impossible: native disabled, the button leaves the tab order. `blocked` means input is missing: the button stays clickable with `aria-disabled="true"` and `data-state="blocked"`, and the click handler says what is missing. `loading` means work is running: `aria-busy="true"`, a leading spinner, native disabled. Loading takes precedence over blocked.
3. For a toggle, pass `pressed`. It sets `aria-pressed` and the pressed fill; `pressed={false}` still exposes `aria-pressed="false"`.
4. For an anchor, pass `asChild` with exactly one child; the component renders through a Radix Slot.
5. For icon-only, use `size="icon"` (36px square), set `aria-label`, and pair with `tooltip` so the name is visible on hover and focus.
6. `default` and `sm` heights resolve through `--weft-control-h` and `--weft-control-h-sm`, so density changes them. `lg`, `icon` and `dense` are fixed; `dense` exists to emulate the dense tier inside a non-dense app, and the density axis is the supported route.

## Heuristics

- One filled button per region. Supporting actions are `outline` or `secondary`; `ghost` sits flush inside chrome.
- `destructive` is for actions that cannot be undone easily. Pair it with a confirmation in `alert-dialog`, and never make it icon-only.
- Prefer `blocked` over `disabled` when the person can fix the cause. A disabled button offers no path; a blocked one explains on click.
- A loading button keeps its label and its width. The spinner leads; the text does not change to "Loading".
- Hover is never the only signifier. Every variant except `ghost` has a resting fill or boundary; `ghost` relies on the chrome around it.
- Colour means state. The destructive red means consequence, not emphasis; the pressed fill means "on", not "selected by you".

## Content

- Verb-led, sentence case, one to three words: "Save", "Export log", "Start thread". Add the object when the verb alone is ambiguous in context.
- No trailing punctuation and no ellipsis to signal that a dialog opens.
- An icon-only name is the action and its object: "Delete comment 3".
- A toggle's label names the thing, not the state. "Mute" with `aria-pressed` is one control; "Mute" and "Unmute" alternating are two.

## Accessibility

- Native button: Enter and Space activate it; the 3px focus ring shows on `:focus-visible`.
- The component sets `aria-pressed` for toggles, `aria-busy` for loading, and `aria-disabled` for blocked (focusable and clickable).
- `disabled` and `loading` use native disabled, so the button leaves the tab order. If it had focus when loading began, focus is lost; the consumer moves focus to a status region or to the next control.
- Decorative icons inside the button need `aria-hidden="true"`; the component only sets this on its own spinner.
- Heights: default 36px, `sm` 32px, `dense` 34px, `icon` 36px, `lg` 40px. All clear the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- The spinner animation and the colour transitions collapse under the global `prefers-reduced-motion` rule (WCAG 2.3.3).
