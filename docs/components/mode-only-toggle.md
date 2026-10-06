---
related:
  - hud-toggle-switch
  - switch
  - settings-module-shell
---

# Mode-only toggle

## Purpose

A compact control that scopes a setting to a single mode: "use only in this mode". It owns a 26×14 track, a required visible label and the active and inactive states. Which setting is scoped, and what the mode is, are the consumer's.

## When to use

- A per-item scope beneath a path, a key or a capability in a settings module, where the question is "everywhere, or only here".

## When not to use

- A general on or off setting. Use `hud-toggle-switch` in dense chrome, `switch` elsewhere.
- A choice among several modes. Use `radio-group` or `pill-toggle-group`.
- A value saved with a form. Use `checkbox`.

## How to use

1. Render `ModeOnlyToggle` with `active`, `onToggle` and `label`. The label is required and is rendered as visible text.
2. Name the mode in the label: "Use only in productivity mode".
3. Offset it with `className`, never with inline style; the layout belongs to the row.
4. Set `disabled` and any other button attributes through the remaining props.

## Heuristics

- Instant effect. The scope changes in `onToggle`.
- The label is the whole sentence. It names the mode and does not change with state.
- Inactive means "everywhere"; active means "only here". Say so in the surrounding caption if the row does not make it obvious.
- Thumb position carries the state; the label colour reinforces it.

## Content

- Label: sentence case, "Use only in <mode> mode", with the mode name as the product writes it.
- No state words, no trailing punctuation.

## Accessibility

- The control is a `button type="button"` whose accessible name is the visible label text; Space and Enter activate it; it takes a focus ring.
- Open: it exposes no `aria-pressed` or `aria-checked`, so a screen reader hears the label but not whether it is on. State is conveyed by thumb position and label colour only (WCAG 4.1.2, 1.4.1).
- Open: the track is 14px tall and the label is 9px, both under the 24px floor (`--weft-touch-target`, WCAG 2.5.8) and under the body text size; the row must supply the height.
- The thumb and label-colour transitions stop under `prefers-reduced-motion`.
