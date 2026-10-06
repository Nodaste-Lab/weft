---
related:
  - toggle-group
  - switch
  - button
  - tooltip
---

# Toggle

## Purpose

A button that stays pressed. It owns the pressed and unpressed states, the two variants (`default`, `outline`), the three sizes and the focus ring. What being pressed means, and the icon or text inside, are the consumer's.

## When to use

- A tool state in a toolbar or editor: bold, a filter on, a view option.
- One standalone pressed state. Several related ones belong in `toggle-group`.

## When not to use

- A setting that applies to the app. Use `switch`.
- A value saved with a form. Use `checkbox`.
- One of several exclusive choices. Use `toggle-group` with `type="single"`.
- An action that runs and finishes without a state. Use `button`.

## How to use

1. Render `Toggle` with `pressed` and `onPressedChange`, or `defaultPressed`.
2. Put text, or an icon with `aria-label`, inside it. Pair an icon-only toggle with a `tooltip` showing the same words.
3. Choose `variant="outline"` where the unpressed toggle needs a boundary on its surface, and `size` (`default` 36px, `sm` 32px, `lg` 40px) to match the toolbar.
4. Set `disabled` when the tool cannot be used in the current context.

## Heuristics

- The label names the tool, not the state: "Bold", never "Bold on". It does not change when pressed.
- Pressed is a fill; unpressed is transparent or outlined. Hover lightens the unpressed toggle without filling it, so the pressed one stays the anchor.
- Apply the effect immediately. A toggle that needs a save is a `checkbox`.
- One toggle, one tool. A toggle that cycles through three states is a `select` or a `toggle-group`.

## Content

- Text label: sentence case, one or two words.
- Icon-only: `aria-label` is the same words the tooltip shows ("Bold"), so the name matches the label (WCAG 2.5.3).
- No state words in the label; `aria-pressed` carries the state.

## Accessibility

- The control is a `button` with `aria-pressed`; Space and Enter toggle it; the focus ring is the global one.
- The consumer provides the name: visible text, or `aria-label` for an icon-only toggle (WCAG 4.1.2).
- Every size clears the 24px floor (`--weft-touch-target`, WCAG 2.5.8); `sm` is 32px with a matching minimum width.
- Pressed is drawn by the accent fill and `aria-pressed`. Do not add a colour-only cue on top; if a second cue is wanted, change the icon.
- The colour transition stops under `prefers-reduced-motion`.
