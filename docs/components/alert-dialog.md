---
related:
  - dialog
  - sheet
  - popover
  - button
---

# Alert dialog

## Purpose

A modal that interrupts the current task to get one answer before anything else can happen. It owns the backdrop, the centred frame, the title and description, and the Cancel and Action pair in the footer. It is the surface for confirming a destructive or irreversible step; everything else is a `dialog`.

## When to use

- Confirming an action that cannot be undone: deleting, discarding unsaved changes, revoking access, overwriting.
- Acknowledging an error that stops the task until the person responds.

## When not to use

- A task with fields, settings or more than one decision. Use `dialog`.
- A secondary workflow that keeps the page in view. Use `sheet`.
- A small anchored choice, a filter or a quick form. Use `popover`.
- A message that does not need a response. Use `alert` or `callout` in place, or `HudIssueToast` for a transient notice.
- A reversible action. Act, then offer undo in a `callout` or `HudIssueToast` instead of asking first.

## How to use

1. Wrap the trigger and content in `AlertDialog`. Render `AlertDialogTrigger` `asChild` around a `button` so the trigger keeps its own styling and accessible name.
2. Put the frame in `AlertDialogContent`. It renders the portal and `AlertDialogOverlay` for you; pass `overlayClassName` or `overlayStyle` only when the backdrop has to change.
3. Inside `AlertDialogHeader`, give `AlertDialogTitle` the question and `AlertDialogDescription` the consequence. Both are wired to the dialog's name and description.
4. In `AlertDialogFooter`, render `AlertDialogCancel` first and `AlertDialogAction` second. Cancel draws as the outline `button`; Action draws as the default `button`. For a destructive step pass the destructive classes through `className` on `AlertDialogAction` so the fill reads as the stop state.
5. Control `open` and `onOpenChange` when the dialog has to close after an async action completes or stay open while it is pending.

## Heuristics

- One question, two answers. If the footer wants a third button, the decision belongs in a `dialog`.
- The title is the question; the description is the consequence. A person who reads only the title and the buttons should still choose correctly.
- The action button names the verb ("Delete workspace"), never "OK" or "Yes". Cancel is always "Cancel".
- The backdrop click does not close it. A dismissal that silently equals Cancel is fine; one that could be mistaken for confirm is not.
- Do not stack one alert dialog on another, and do not open one over a `sheet`; close the sheet first.
- The frame is capped to the viewport (`max-w-[calc(100%-2rem)]`) and scrolls inside when the description is long.

## Content

- Title: a short question in sentence case ending with a question mark ("Discard draft?"), or a short statement for an acknowledgment ("Session expired").
- Description: one or two sentences saying what will happen and what will be lost. Name the thing ("the 12 unsaved notes"), not "this item".
- Buttons: sentence case, verb first, no trailing punctuation. The action label matches the verb in the title.
- The destructive label says what is destroyed ("Delete 3 files"), not "Confirm".

## Accessibility

- The content carries `role="alertdialog"` and `aria-modal="true"`; the title and description are linked through `aria-labelledby` and `aria-describedby`. Always render both.
- On open, focus moves to Cancel, the least destructive control. Tab and Shift+Tab cycle inside the frame, which is the deliberate trap WCAG 2.1.2 allows because Escape and Cancel both leave it.
- Escape closes the dialog and focus returns to the trigger. Clicking the backdrop does not close it.
- Both footer buttons meet the 24px floor through `button`; keep `--weft-touch-target` as the minimum if the footer is restyled.
- The open and close animations are opacity and scale over 200ms. Under `prefers-reduced-motion: reduce` the consumer's global override collapses them; the component does not do this on its own.
- Because the dialog takes focus, it does not need a live region (WCAG 4.1.3 excludes content that receives focus). Do not also fire an `alert` for the same event.
