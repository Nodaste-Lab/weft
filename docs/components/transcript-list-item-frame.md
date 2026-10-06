---
related:
  - hud-meta-caption
  - list-item
  - hud-list-row
  - chip
---

# Transcript list item frame

## Purpose

The layout for one line in a transcript, highlight or pinned list: a header meta row, the body text and an optional footer of controls. It draws the bottom rule and the padding so every list shares one rhythm. It owns the frame; the speaker, the time and the text are the consumer's.

## When to use

- Lists of spoken lines, highlights or pinned quotes, each with who said it, when, the text and tags.

## When not to use

- Selectable options in a response. Use `list-item` in `list-block`.
- An action row with a title, meta and an aside. Use `hud-list-row`.
- A row the reader edits in place. Use `inline-edit-list-row`.

## How to use

1. Render `TranscriptListItemFrame` with `header`, `body` and optionally `footer`.
2. In `header`, put the speaker name, the speaker's role and the time (`hud-meta-caption`, in the mono face for clock times).
3. In `body`, put the line as a `<p>`.
4. In `footer`, put tags (`chip`) and any per-line control such as a speaker select.
5. Render the list as `ul` with each frame inside an `li`, so position and count are read.

## Heuristics

- The speaker is named in text. A dot in the header shows a state (speaking now) or a category (role), never a person.
- Times are in the mono face; the body wraps freely.
- The frame draws its own bottom rule. The list container does not add one.
- Per-line actions that appear on hover also appear on `:focus-within`.
- Padding is the frame's. Do not add margins to the slots.

## Content

- The speaker's name as the reader knows it; the role in sentence case.
- Times as the transcript records them (hh:mm or hh:mm:ss), or a relative time.
- The body is the line as captured. Do not tidy transcript punctuation.
- Tags are short and consistent across the list.

## Accessibility

- The frame is a `div`. The consumer supplies list semantics.
- Speaker and time are text, not colour (WCAG 1.4.1 use of colour).
- A speaker select is labelled for the line ("Speaker for this line").
- Chips that act are buttons at the 24px floor (`--weft-touch-target`). Chips that only label are plain text.
- Hover-only controls are also reachable on keyboard focus.
