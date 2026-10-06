---
related:
  - callout
  - HudIssueCallout
  - HudIssueToast
  - badge
  - empty-state
---

# Alert

## Purpose

An in-place message block with an optional icon, a title and a description, for a status the person should notice as they read the surface. It owns the bordered card, the icon column, the title and description layout, the `destructive` variant and the tone border. It is the heavier of the two inline message primitives; `callout` is the lighter.

## When to use

- A message with a title and a sentence of body that stays until the condition changes: a queued job, a configuration that is missing, an action that failed on this surface.
- A destructive outcome or error that belongs beside the content it concerns.

## When not to use

- A one-line hint, help note or panel status. Use `callout`.
- A structured failure with a source, a next action and a preserved-state note. Use `HudIssueCallout`.
- A transient notice after an event, dismissed by the person or by time. Use `HudIssueToast`.
- A word of status on a row. Use `badge` or `dot`.
- A surface with nothing in it yet. Use `empty-state`.
- A message that must be answered before continuing. Use `alert-dialog`.

## How to use

1. Render `Alert` with `variant` `default` or `destructive` and, optionally, `tone` (`info`, `warning`, `danger`, `positive`) to colour the border and icon.
2. Put an icon as the first child; the grid reserves a column for it only when it is present. Mark it `aria-hidden`.
3. Put the headline in `AlertTitle` and the body in `AlertDescription`. The title clamps to one line.
4. Put any action after the description as a `button` or link inside `AlertDescription`; keep it to one.
5. Render the alert in the flow near what it describes, not fixed to the viewport.

## Heuristics

- Title says what happened; description says why and what to do. One of each.
- Tone is a state, not decoration: `danger` for a failure, `warning` for something that needs attention before it fails, `positive` for a completed outcome, `info` for everything else.
- The icon and the border carry the tone together with the words; the words alone must still say it (WCAG 1.4.1).
- One alert per condition. Two alerts stacked on one surface mean one of them is a `callout`.
- Remove the alert when the condition resolves; a stale success alert reads as a current one.

## Content

- Title: sentence case, short, no trailing punctuation ("Recap queued", "Key missing").
- Description: one or two sentences, in the error pattern when it is an error: what happened, why if short, what to try.
- Action label: a verb, sentence case ("Retry", "Open settings").
- Never fixture text as a default; an alert with nothing to say is not rendered.

## Accessibility

- The root carries `role="alert"` always. Assistive technology announces an alert only when it is inserted after load; one present at page load is read in sequence like any other content, and a static informational alert is announced as urgent when it is inserted. Insert the alert when the condition arises and remove it when it clears.
- Alerts never take focus (WCAG 4.1.3 is met by the role; moving focus would be a change of context).
- Use the `destructive` or `danger` treatment for failures only; for a neutral note prefer `callout`, which uses `role="status"` for non-urgent tones.
- An action inside the alert is a real `button` or link at the 24px floor (`--weft-touch-target`), reached by Tab in document order.
- The icon is `aria-hidden`; the title carries the meaning.
- No animation; nothing to collapse under `prefers-reduced-motion: reduce`.
