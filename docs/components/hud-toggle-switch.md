---
related:
  - switch
  - mode-only-toggle
  - settings-module-shell
  - hud-list-row
---

# HUD toggle switch

## Purpose

A binary toggle for dense panel chrome where `switch` is too tall. It owns a 34×18 track (28×16 at `size="sm"`), the thumb, the on, off and disabled states, and its own accessible name through `ariaLabel`. The row it sits in, and the visible text beside it, are the consumer's.

## When to use

- A settings row inside a dense panel or a `settings-module-shell` where vertical space is measured in pixels.
- A list of capabilities in `hud-list-row`, each with an instant on or off.

## When not to use

- Workspace, dialog or form density. Use `switch`.
- A value saved with a form. Use `checkbox`.
- Scoping a credential or path to one mode. Use `mode-only-toggle`.

## How to use

1. Render `HudToggleSwitch` with `active`, `onToggle` and `ariaLabel`. All three are required; the control has no children.
2. Put the row's visible text beside it, and use the same words in `ariaLabel` so the name on screen and the name read aloud match.
3. Use `size="sm"` inside dense list rows; the default size elsewhere.
4. Set `disabled` when the setting cannot change, and give the reason in the row's caption (`hud-meta-caption`).
5. Set `id` when a visible label will point at it with `htmlFor`.

## Heuristics

- Instant effect. The change applies in `onToggle`; nothing waits for a save.
- The name describes the setting, not the state, and does not change when toggled.
- Thumb position and track fill move together; position is what reads with colour removed.
- One toggle per row, right-aligned, so the eye scans a column of states.
- The tokens it paints with are the transitional panel aliases, which are scheduled to drop; new surfaces should not extend this primitive's styling.

## Content

- `ariaLabel`: the row's subject in sentence case ("Transcription", "Vault sync"), never "Toggle" alone and never "Enable X".
- Row caption: one sentence on the consequence, if any.
- No on or off text; the state is the position and `aria-pressed`.

## Accessibility

- The control is a `button type="button"` with `aria-pressed` and the name from `ariaLabel`; Space and Enter toggle it; the focus ring is drawn on the track.
- Open: the track is 18px tall (16px at `sm`), under the 24px floor (`--weft-touch-target`, WCAG 2.5.8). The consumer's row must supply the remaining height as padding, or the visible label must be associated so the row is the target.
- Open: it exposes `aria-pressed` rather than `role="switch"`, so it is read as a toggle button, not a switch, unlike `switch`. Keep the `ariaLabel` free of state words so either reading is correct.
- The visible row text is not associated automatically; give the control an `id` and a `label` with `htmlFor`, or repeat the words in `ariaLabel` (WCAG 2.5.3).
- The thumb and colour transitions stop under `prefers-reduced-motion`.
