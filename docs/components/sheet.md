---
related:
  - dialog
  - popover
  - sidebar
  - scroll-area
---

# Sheet

## Purpose

A drawer that slides in from an edge of the viewport over a backdrop, for a secondary workflow that keeps the page's context in view. It owns the backdrop, the docked frame, the header and footer, the corner close control and the side it opens from. On narrow viewports it is also what rail panels and anchored popovers become.

## When to use

- A panel of secondary content or controls that relates to the page: details, history, comments, a filter rail, a navigation tree on a tablet.
- Any `popover` or rail panel on a phone; the bottom sheet is the phone form of both.
- A form longer than a `popover` can hold that still returns the person to the page.

## When not to use

- A single confirmation. Use `alert-dialog`.
- A short centred task that needs full attention. Use `dialog`.
- A small anchored choice beside its trigger on a wide viewport. Use `popover`.
- Persistent navigation that stays open. Use `sidebar`.

## How to use

1. Wrap the trigger and content in `Sheet`. Render `SheetTrigger` `asChild` around a `button`.
2. Put the frame in `SheetContent` and choose `side`: `right` (default) or `left` for a column at three quarters width capped at 384px, `top` or `bottom` for a full-width band sized to its content. It renders `SheetPortal`, `SheetOverlay` and the corner close control (visually hidden text "Close") for you.
3. Start with `SheetHeader` holding `SheetTitle` and `SheetDescription`. Both wire the frame's name and description; always render the title.
4. Put the body between the header and `SheetFooter`, which sits at the bottom of the column. Give the body `overflow-y-auto` or a `scroll-area` so the header and footer stay put.
5. Use `SheetClose` `asChild` on any button that should close the sheet (Cancel, Done, a row that navigates).
6. Control `open` and `onOpenChange` when the sheet must close because another panel opened, a selection was made, or a dialog is about to open over it.

## Heuristics

- One panel at a time. Opening a sheet closes any other sheet, rail panel or popover, and any action that needs the panel opens it rather than flipping a hidden flag.
- A `dialog` or `alert-dialog` never opens over a sheet; close the sheet first so the dialog's focus and backdrop are not layered.
- The sheet's ground is opaque paper, never inherited from the column it replaced.
- Cap the body to the viewport and scroll inside. On a phone a panel sheet is `min(70vh, 560px)` tall; a popover that became a sheet is at most 80vh.
- Choosing a thing inside the sheet (a document in a tree) closes the sheet so the result is in view.

## Content

- Title: the panel's name in sentence case ("History", "Filters", "Who can see this"), no trailing punctuation.
- Description: one sentence, only when the title does not say what the panel does.
- The close control's name is "Close"; on a phone panel sheet it reads "Close panel".
- Footer buttons: verb first, sentence case; primary on the right, Cancel beside it.

## Accessibility

- The content carries `role="dialog"` and `aria-modal="true"`; the title and description populate `aria-labelledby` and `aria-describedby`.
- On open, focus moves into the sheet. Tab and Shift+Tab stay inside it (the trap WCAG 2.1.2 permits because Escape leaves it). Escape, the backdrop, the close control and `SheetClose` all close it, and focus returns to the trigger.
- A sheet that leaves focus behind the backdrop strands keyboard and screen-reader users; verify with the mouse unplugged.
- The built-in close control draws at 16×16 with no padding. Open: that is under the 24px `--weft-touch-target` floor (WCAG 2.5.8); the brand spec draws it at 28×28.
- The slide-in runs 500ms and the slide-out 300ms. Under `prefers-reduced-motion: reduce` the consumer's global override collapses them; the component does not.
- A bottom sheet on a phone sits above the bottom bar so neither covers the other's targets.
