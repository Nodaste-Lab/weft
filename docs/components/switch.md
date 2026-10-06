---
related:
  - checkbox
  - hud-toggle-switch
  - toggle
  - label
---

# Switch

## Purpose

A binary setting that takes effect the moment it changes. It owns the track, the thumb, the on and off states, the disabled state and the focus ring. The label and any description of what the setting does are the consumer's, through `label`.

## When to use

- A preference or capability that is on or off and applies immediately, with no save step.
- A row in a settings list at workspace or dialog density.

## When not to use

- A choice saved with a form. Use `checkbox`; a switch promises an instant effect it cannot keep.
- One of several options. Use `radio-group` or `toggle-group`.
- A tool's pressed state. Use `toggle`.
- Dense panel chrome where 24px of height is too much. Use `hud-toggle-switch`.

## How to use

1. Render `Switch` with an `id` and a `label` whose `htmlFor` matches, or wrap it in the label so the row is the target.
2. Control it with `checked` and `onCheckedChange`, or seed it with `defaultChecked`. Apply the change inside the handler; nothing waits for a save.
3. Set `disabled` when the setting cannot be changed, and say why in the row's description.
4. Give it `name` inside a form only when the form also needs the value; the switch still applies immediately.
5. Group related switches under a heading or a `fieldset` and `legend`.

## Heuristics

- Instant effect is the contract. If the change needs confirmation or a save, it is a `checkbox`.
- The label names the setting, not the state. "Whisper mode", never "Whisper mode enabled", and the label does not change when the switch moves.
- Default to off unless the setting is on for most people and the consequence of on is harmless.
- Position and fill both change: thumb left and neutral track for off, thumb right and primary track for on. Position is what reads with colour removed.
- A disabled switch keeps its position so the current value stays legible.

## Content

- Label: sentence case, one to three words, the thing switched. Test it by saying it with "on" and "off" appended.
- Description: one sentence on the consequence ("Recordings stay on this device").
- No "on" and "off" text inside the track; the position carries it, and the label plus `aria-checked` carry it for a screen reader.

## Accessibility

- The control exposes `role="switch"` with `aria-checked`; Space and Enter toggle it; the focus ring is drawn on the track.
- The consumer names it with a `label` by `htmlFor` or by wrapping (WCAG 1.3.1, 4.1.2). Two switches never share a name; the name includes the row's subject when rows repeat.
- The track measures 24×40, meeting the floor on its own (`--weft-touch-target`, WCAG 2.5.8). The labelled row widens the target further.
- There is no read-only switch. A value that must be shown but not changed is disabled, with the reason in text.
- The thumb's transform transition stops under `prefers-reduced-motion`; the state remains readable from position.
