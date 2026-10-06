---
related:
  - badge
  - signal-filter-chip-group
  - condition-chip-strip
  - pill-toggle-group
---

# Chip

## Purpose

A compact tag the user can remove, and optionally toggle. It owns the tone (none, info, warning, danger, positive), the size (sm, md), the selected ring, the remove button and the toggle button. The root is a non-interactive `<span>`; the remove and toggle controls are sibling buttons inside it, never nested in one another.

## When to use

- An applied filter, condition or token the user can take away: "source:email", "Needs review".
- A single standalone tag that toggles on and off.

## When not to use

- A label that cannot be removed. Use `badge`.
- An exclusive or multi-select rail of options. Use `signal-filter-chip-group` or `pill-toggle-group`.
- A link or a navigation target. Use a link or `button`.
- A bare status mark with no text. Use `dot` beside a label.

## How to use

1. Render `Chip` with a string as `children`. The string is the label and feeds the remove button's name.
2. Set `tone` for the category or state the chip stands for; the default `none` is a neutral tag.
3. Pass `onRemove` to render the remove button. When `children` is not a string, pass `removeLabel` so the button still has a name.
4. Pass `onSelect` to make the label a toggle button; drive `selected` from your state. The ring and `aria-pressed` both follow it.
5. Use `size="sm"` only inside dense rows. Group chips in a `condition-chip-strip`.

## Heuristics

- Tone means a state or a category, and the same category keeps the same tone everywhere it appears. Tone never means a person.
- The text carries the meaning; the tone reinforces it. A chip that is only a colour swatch is not a chip.
- Labels stay under about 20 characters and truncate rather than wrap.
- A chip is a toggle or removable, rarely both. When both, the label toggles and the trailing ✕ removes.
- The remove control is always trailing and always the ✕ glyph.

## Content

- Labels are sentence case ("Needs review", "Blocked"). Key-value tokens are shown as written ("source:email").
- The remove button's default name is "Remove " plus the label. Override `removeLabel` only when the label text alone would be ambiguous.
- No trailing punctuation. No verbs on a chip that cannot be toggled.

## Accessibility

- The remove button carries `aria-label="Remove {label}"` when `children` is a string, otherwise "Remove"; pass `removeLabel` in that case. The ✕ icon is `aria-hidden`.
- The toggle carries `aria-pressed`, so the selected state is readable without the ring (WCAG 1.4.1 use of colour, 4.1.2 name, role, value).
- Both buttons are at least 24×24 (`min-h-6 min-w-6`), the `--weft-touch-target` floor, and show the global focus ring on `:focus-visible`.
- Tab reaches each button in turn; there is no arrow-key roving across a group of chips. After a removal, the consumer moves focus to the next chip or to the strip's add control so focus is not lost (WCAG 2.4.3 focus order).
- Tone text sits on a tinted fill of the same token; check contrast on dark palettes before adding new tones.
