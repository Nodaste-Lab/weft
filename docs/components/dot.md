---
related:
  - badge
  - provider-status-badge
  - chip
---

# Dot

## Purpose

The bare semantic status dot. It owns the tone (muted, ok, warn, stop, info), two sizes (7px and 9px), and the switch between decorative and announced. It is a mark, not a control: it sits beside a label that already carries the meaning. A plain-CSS counterpart, `.weft-dot` with `is-ok`, `is-warn`, `is-stop`, `is-info` and `is-muted`, draws the same mark.

## When to use

- Beside a label in a tier header, a compact summary row or a legend.
- The leading slot of a `hud-list-row` when the row's state is already in its text.

## When not to use

- A status with no label beside it. Use `badge`, which carries text.
- A count. Use `badge` with the `count` variant.
- A removable or toggled tag. Use `chip`.
- A pulse or a blink. The dot is static.

## How to use

1. Render `Dot` with a `tone` next to the text it qualifies. The default tone is `muted`.
2. Leave `label` unset in normal use; the dot is `aria-hidden` and the adjacent text does the talking.
3. Pass `label` only when the dot is the sole carrier of meaning, for example in a table cell with no text. It then becomes an announced `img`.
4. Use `size="md"` beside body text; `sm` (7px) matches dense rows.
5. In plain HTML, use `<span class="weft-dot is-ok" aria-hidden="true">`.

## Heuristics

- Tone means a state or a category, never a person.
- One meaning per tone on a surface, and a legend when the surface has more than two tones.
- The dot's tone matches the token used by the text beside it, so the row reads as one signal.
- The dot does not move. Presence and progress are told in text.

## Content

- When announced, `label` is the state in words, sentence case ("All clear", "Needs attention"). Never the colour name.
- The adjacent text is the fact ("Resolved", "3 overdue"), not a description of the dot.

## Accessibility

- Decorative by default: `aria-hidden="true"`. With `label`, the component sets `role="img"` and `aria-label` (WCAG 1.1.1 non-text content).
- The dot is never the only signal. Text beside it, or `label` on it, carries the state with colour removed (WCAG 1.4.1 use of colour).
- Not interactive and not a target. A dot that must be clickable is wrapped in a button that meets the 24px `--weft-touch-target` floor and has a name.
- A 7px fill has no 3:1 guarantee against every surface (WCAG 1.4.11 non-text contrast); this is another reason the text carries the meaning.
- There is no animation, so `prefers-reduced-motion` has nothing to turn off.
