---
related:
  - alert-dialog
  - sheet
  - popover
  - button
---

# Dialog

## Purpose

A modal frame for a task that needs the person's whole attention and then returns them to where they were. It owns the backdrop, the centred frame, the header with title and description, the footer button row and the close control in the corner. The consumer owns everything between the header and the footer.

## When to use

- A short self-contained task: a settings form, a rename, a share step, a picker with a few fields.
- Information the person must see before continuing with the page, when a response is expected.

## When not to use

- A single irreversible confirmation. Use `alert-dialog`.
- A panel the person works in while still reading the page, or anything that benefits from an edge anchor. Use `sheet`.
- A small anchored choice, filter or quick form. Use `popover`.
- A message with no response needed. Use `alert`, `callout` or `HudIssueToast`.
- A multi-step wizard, a large table or anything that needs information from the page behind it. Build it on the page.

## How to use

1. Wrap the trigger and content in `Dialog`. Render `DialogTrigger` `asChild` around a `button`.
2. Put the frame in `DialogContent`. It renders `DialogPortal`, `DialogOverlay` and the corner close control (an icon with the visually hidden text "Close") for you.
3. Start with `DialogHeader` containing `DialogTitle` and `DialogDescription`. Both are linked to the frame's accessible name and description; always render the title.
4. Put the task body between the header and `DialogFooter`. End the footer with the primary `button`; put Cancel before it, rendered as `DialogClose` `asChild` so it closes without extra wiring.
5. Control `open` and `onOpenChange` when the dialog has to stay open during a pending save or close after one succeeds.

## Heuristics

- One task per dialog. If the body wants tabs or a second scroll region, it has outgrown the frame.
- The primary button repeats the verb in the title ("Rename note" opens a dialog whose primary is "Rename").
- Cancel, the close control and Escape all do the same thing: close without saving. If closing would lose work, ask first with `alert-dialog`.
- Never open a dialog from inside a dialog. Close the first or redesign the flow.
- The frame is capped to the viewport (`max-w-[calc(100%-2rem)]`, `sm:max-w-lg`) and scrolls inside when the body is long. The header and footer stay visible.
- Opening a dialog over a `sheet` or a rail panel closes the sheet first; one overlay at a time.

## Content

- Title: a short verb phrase in sentence case, no trailing punctuation ("Publish recap", "Edit workspace name").
- Description: one sentence saying what the dialog does or what is needed. Leave it out when the title says it all, but then give `DialogTitle` enough to stand alone.
- Buttons: sentence case, verb first, two words where possible. Primary names the outcome; secondary is "Cancel".
- Field labels inside the body follow `label`; do not restate them in the description.

## Accessibility

- The content carries `role="dialog"` and `aria-modal="true"`. The title populates `aria-labelledby`; the description populates `aria-describedby`.
- On open, focus moves to the first focusable element inside the frame. Tab and Shift+Tab stay inside it (the trap WCAG 2.1.2 permits because Escape leaves it). On close, focus returns to the trigger.
- Escape, the close control, the backdrop and `DialogClose` all close it.
- The built-in close control has the visually hidden name "Close" and no visible label. Open: it draws at 16×16 with no padding, under the 24px `--weft-touch-target` floor (WCAG 2.5.8); pad it through `className` on a project wrapper until the primitive is fixed.
- Open and close animate opacity and scale over 200ms. Under `prefers-reduced-motion: reduce` the consumer's global override collapses them; the component does not.
- The dialog takes focus, so it needs no live region. Status that changes while it is open (a save failing) belongs in a `callout` inside the body.

### Modal and inspector boundaries

Keep actions reachable at short viewport heights and under text enlargement;
verify internal scrolling rather than assuming the width cap does this. Earlier
sheet measurements are historical examples, not universal dialog dimensions.
Modal tasks retain modal focus containment and dismissal appropriate to potential
data loss. The non-modal File shell inspector's rail-based close is a scoped
[composition contract](../brand-package/13-document-surfaces-heuristics.md#shared-file-shell-inspector);
it does not remove ordinary dialog close controls. Reduced motion retains a
legible state. See the [shared accessibility baseline](../brand-package/05-accessibility.md#current-shared-baseline-october-7-2026).
