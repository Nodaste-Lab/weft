---
related:
  - badge
  - dot
  - status-icon-row
---

# Provider status badge

## Purpose

A dense capsule that shows the probe result for a local service a surface depends on, such as a transcription provider. It owns the status vocabulary (available, checking, running, unavailable, error), the label for each status and the tone that draws it. It sits at the end of a settings row beside the provider's name.

## When to use

- A row in a settings or context panel that reports whether a local provider was found and whether it is running.
- The status is one of the five values the badge knows; the surface should not need to invent a sixth.

## When not to use

- A generic status, count or tag. Use `badge`, which has status, count and space variants with the shared tones.
- A status that needs an icon, a title and a detail line. Use `status-icon-row`.
- A status with no label, inside a row that already names the state. Use `dot`.
- A status the user can change from the badge. This badge is read-only; put the action in a button beside it.

## How to use

1. Render `ProviderStatusBadge` with `status` set to one of `available`, `checking`, `running`, `unavailable` or `error`. The type `ProviderStatus` is exported for the consumer's model.
2. The badge chooses its own label: "Ready", "Checking…", "Running", "Not Found", "Error". There is no `children` or `label` prop.
3. Place it trailing in the row, after the provider name and before any action. It accepts native `span` props for `className` and test ids.
4. Drive `checking` only while a probe is in flight; move to a settled status as soon as the probe returns.

## Heuristics

- The label carries the meaning and the tone repeats it. Available and running share the positive tone, unavailable is warning, error is danger, checking is the accent. A reader who cannot see colour still reads the word (WCAG 1.4.1 use of colour).
- Available and running are different facts: found on this machine versus in use right now. Do not map both to one.
- Unavailable is a fact, not a fault. The surface explains what to install or enable in the row's detail or a `callout`, not in the badge.
- A checking state that lasts more than a few seconds needs a timeout to error or unavailable; a badge stuck on "Checking…" reads as broken.
- The capsule is 8px text. Keep it to one per row, and do not stack badges to show a history.

## Content

- Labels are fixed in the component: "Ready", "Checking…", "Running", "Not Found", "Error". The rule for app surfaces is sentence case, so the intended reading of the fourth label is "Not found"; the source still renders it in title case.
- Labels are states in the present, one or two words, no trailing punctuation except the ellipsis on the in-flight state.
- The badge never shows a count, a version or a timestamp. Those belong in the row's detail text.

## Accessibility

- The badge is a `span` with its label as text, so a screen reader reads the status as part of the row. It does not set `role="status"`; a change in status is not announced on its own. A surface that needs the change announced wraps the row, not the badge, in a live region (WCAG 4.1.3 status messages).
- The consumer must keep the provider's name in the same row so the status has a subject: "Local speech" then "Ready".
- Tone colours use the semantic tokens at low alpha behind the label; the consumer must confirm the 8px label meets contrast on the surface it sits on (WCAG 1.4.3 contrast minimum).
- The badge is static: no focus, no target-size requirement, no motion.
