---
related:
  - toolbar
  - panel-header
  - stack
  - action-button-row
---

# Quick command footer

## Purpose

A sticky bottom shell for a panel's command column: surface fill, a top rule and a lift shadow, with an optional full-width bar beneath. It owns position and chrome only. The eyebrow, the log, the hint and the form inside are the consumer's.

## When to use

- A command input or short form that must stay reachable while the panel content above it scrolls.
- A column that ends in a persistent action bar (save, end).

## When not to use

- A row of actions that scrolls with the content. Use `toolbar` or `action-button-row`.
- The top strip of a panel. Use `panel-header`.
- The footer of a settings module. Use the `footer` slot of `settings-module-shell`.
- A dialog's actions. Use the dialog's own footer.

## How to use

1. Place `HudQuickCommandFooter` as the last child of the panel's scroll container. It is `sticky bottom-0`, so the container must be the element that scrolls.
2. Put the main column in `children`: the eyebrow, an optional log scroller, then the hint and the form.
3. Put a full-width bar in `footerBar`. It renders under the column, inside the same sticky shell.
4. When nothing scrolls above it, remove the shadow and the top rule with `className` so the footer reads as the end of the content, not as something floating.

## Heuristics

- The footer takes height from the scroll area. Keep it to the form and one bar so content above stays usable at small heights (WCAG 1.4.10 reflow).
- The shadow says "there is more above". Show it only when there is.
- One sticky footer per scroll container. Two stacked bars hide content.
- The form inside submits on Enter from its input; the bar's buttons are secondary to that.

## Content

- The hint is one line in sentence case.
- Bar labels are verb-first, sentence case ("Save", "End session").
- No copy ships by default.

## Accessibility

- The shell is a `div` with no role. Wrap the command in a `<form>` with a labelled input; a visible label or `aria-label` on the input, not a placeholder alone.
- Sticky content can cover focused elements above it. Give the scroll container `scroll-padding-bottom` at least the footer's height so a focused row scrolls into view clear of it (WCAG 2.4.11 focus not obscured).
- Tab order follows the DOM: the content above, then the footer's input, then the bar.
- Every control in the bar meets the 24px floor (`--weft-touch-target`).
