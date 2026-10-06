---
related:
  - HudIssueCallout
  - callout
  - alert
  - button
---

# Issue toast

## Purpose

A floating notice for a failure that happened somewhere other than where the person is looking: a data load for a panel that is not in view, a connection that dropped. It renders the same structured issue as `HudIssueCallout` in a fixed-width card with a dismiss control and a row of action buttons, plus optional status and error lines for the actions' own outcomes. The consumer owns the stack, the position and the lifetime.

## When to use

- A failure the person needs to know about now, whose source is not on screen.
- A failure with a recovery action that is global: send a report, open the settings page that fixes it.

## When not to use

- A failure beside the panel, row or control it concerns. Use `HudIssueCallout` in place.
- A success or neutral confirmation. Use `callout` in place; the toast is for issues.
- A message that must be answered before continuing. Use `alert-dialog`.
- Anything that should stay until the condition clears. Render it in place with `alert`.

## How to use

1. Build the issue object as for `HudIssueCallout` (`reason`, `source`, `scope`, `severity`, `title`, `detail`, `nextAction`, optional `sourceLabel`).
2. Render `HudIssueToast` with `issue` and `onDismiss`. The dismiss control is a 24px icon `button` named "Dismiss notification".
3. Pass `actions`, an array of `{ kind, label }` (`support-bundle` draws as the primary `button`; `open-settings` carries a `section` and draws as outline), and `onAction` to handle them. Set `busyActionKind` to show the pending action's loading state.
4. Pass `statusCopy` for a success line after an action and `errorCopy` for a failure line; each renders with its own live region.
5. Mount the toast in a fixed container the consumer owns. The card is `min(420px, 100vw - 24px)` wide; stack from one corner and keep the stack short.

## Heuristics

- A toast is for a failure elsewhere. If the person is looking at the thing that failed, say it there.
- No auto-dismiss on an error or warning. The component has no timer; do not add one for those severities (WCAG 2.2.1 timing adjustable). An `info` toast may time out after the person has had time to read it.
- The detail is clipped at 180 characters. If the full detail matters, the toast's action opens the place where it is shown in full.
- At most two actions. The primary is the one that gets help; the other opens settings.
- One toast per issue. A second failure of the same kind replaces the first rather than stacking.
- The toast is always-on-top chrome and keeps its dark-glass ground over any surface.

## Content

- Title: sentence case, what failed ("Workstreams unavailable").
- Source line: "From {source label}".
- Detail: one or two sentences, under 180 characters.
- Next action: an imperative sentence ("Check that the local runtime is running, then refresh").
- Action labels: verb first, sentence case ("Email support with bundle", "Report in Spaces").
- Status line: past tense, short ("Report sent"); error line: what failed and what to try.

## Accessibility

- `error` and `warning` render `role="alert"` with `aria-live="assertive"`; `info` renders `role="status"` with `aria-live="polite"`; `aria-atomic="true"` reads the card as one message (WCAG 4.1.3). The toast never takes focus on appear.
- `statusCopy` is a `polite` live region and `errorCopy` is `role="alert"`, so an action's outcome is announced without re-reading the whole card.
- The dismiss control is a real `button` with the name "Dismiss notification" at 24px (`--weft-touch-target`); action buttons draw 28px tall. All are reached by Tab in document order.
- Escape is not handled by the component; the consumer's stack should close the newest toast on Escape when focus is inside it and return focus to where it was.
- Colour, border and glyph follow the severity and never carry it alone (WCAG 1.4.1); the glyph is `aria-hidden`.
- No animation of its own. If the stack animates entry, it collapses under `prefers-reduced-motion: reduce`.
