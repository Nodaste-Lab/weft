---
related:
  - HudIssueToast
  - callout
  - alert
  - empty-state
  - button
---

# Issue callout

## Purpose

An in-place failure notice that renders a structured issue in a fixed order: title, source attribution, detail, next action, preserved-state note, optional action button. It owns the severity colour and live-region role, the `standard` and `compact` variants chosen from the issue's scope, and the copy order. The consumer owns the issue object; the component never invents a field.

## When to use

- A failure or platform gap that belongs beside the panel, row or control it concerns: a fetch that failed, an action a backend does not support, data a source cannot supply.
- Anywhere the person needs four things at once: what failed, where it came from, whether their state survived, and the next safe step.

## When not to use

- A one-line note, hint or status. Use `callout`.
- A titled message that is not a failure. Use `alert`.
- A surface with nothing to show, where nothing failed. Use `empty-state`.
- A transient notice after an event that the person dismisses. Use `HudIssueToast`.
- A failure that stops the task until answered. Use `alert-dialog`.

## How to use

1. Build an issue object with `reason`, `source`, `scope`, `severity`, `title`, `detail` and `nextAction`. Add `preservedStateNote` when earlier data is still on screen, and `sourceLabel` to name the source as the person knows it.
2. Render `HudIssueCallout` with `issue`. The variant follows the scope: `panel`, `capability` and `data-gap` draw `standard`; `row-action` and `submit` draw `compact`. Pass `variant` to override.
3. Pass `action` (`{ label, onClick }`) for a recovery button, drawn as an outline `button` in the severity colour.
4. Place it at the top of the panel (`panel`), beside the control (`row-action`), below the submit (`submit`), or in place of the data (`capability`, `data-gap`).
5. Remove it when the condition clears; it has no dismiss control of its own.

## Heuristics

- Four facts, fixed order. The title says what failed, the source line says where it came from, the detail says why, the next action says what to do. A reader who stops after any line still knows more than before.
- Severity is a state: `error` for a failed operation, `warning` for something that needs attention before it fails, `info` for a known gap. The role follows the severity.
- Attribution prevents misdiagnosis. A failure from a connected service is never worded as a local data problem.
- The preserved-state note exists so the person trusts that a refresh failure did not discard what they could already see. Include it whenever that is true.
- The raw message from the underlying error stays out of the primary copy; it belongs in logs and developer overlays.

## Content

- Title: sentence case, what failed, no trailing punctuation ("Could not load signals").
- Source line: "From {source label}", drawn small and tracked; the label names the layer ("Signal provider", "Integration").
- Detail: one or two sentences saying why, including any status code as written.
- Next action: an imperative sentence, concrete ("Use Refresh to try again").
- Preserved-state note: one sentence in the past tense about what is still visible.
- Action label: a verb, sentence case ("Retry", "Open settings").

## Accessibility

- `error` and `warning` render `role="alert"` with `aria-live="assertive"`; `info` renders `role="status"` with `aria-live="polite"`. `aria-atomic="true"` makes the whole callout read as one message (WCAG 4.1.3).
- The callout never takes focus. The action is a real `button` reached by Tab in document order, at the 24px floor (`--weft-touch-target`); in `compact` it draws 28px tall.
- The severity glyph is `aria-hidden`; severity is exposed as `data-severity` and carried by the words.
- Colour, border and background follow the severity and never carry it alone (WCAG 1.4.1).
- No animation.
