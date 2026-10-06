---
related:
  - badge
  - copyable-ref
  - chip
---

# Source pill

## Purpose

A small monospace pill for a path, an identifier or an origin tag: a file path on a row, a configured source in a context panel, where a search result came from. It owns the pill geometry (bordered, paper fill, minimal padding), the muted tones and truncation. The mono face comes from the palette's type rule, not from the pill.

## When to use

- A path or identifier shown as written, where the reader may recognise it but will not act on it here.
- Attribution on a dense row: which file, which feed, which workspace.

## When not to use

- A status, count or category. Use `badge`; its tones mean state, and a source pill has none.
- A reference the reader needs to copy. Use `copyable-ref`, which adds the copy action and its feedback.
- A removable or selectable token. Use `chip`.
- A sentence. The pill is for one identifier, not prose.

## How to use

1. Render `SourcePill` with the path or identifier as `children`. It forwards a ref and accepts native `span` props.
2. `truncate` defaults to `true` and clips to the container width with an ellipsis. Pass `truncate={false}` inside a scrolling list where the whole path must stay readable.
3. `tone` is `default` (muted foreground) or `muted` (foreground at 60%) for rows where the pill should recede further.
4. Give the pill a bounded parent. With `truncate` on it is `max-w-full`, so the parent's width is the clip line.

## Heuristics

- Show the identifier as written. No rewriting of case, no trimming of extensions, no replacing separators.
- Truncate from the end only when the start is the distinguishing part. For long file paths the file name is usually the useful end; a consumer that truncates should also expose the full value (a `title`, or `truncate={false}`), since a truncated static pill cannot be focused to reveal its text.
- One pill per source. Two sources are two pills, separated by the row's gap.
- The pill has no tone for state. If a source is unavailable, that is a `badge` or a `dot` beside the pill, not a red pill.

## Content

- Content is the raw value: `notes/2026-10-05.md`, `calendar`, `spc_1f5c`. No casing changes and no trailing punctuation.
- Where a path is too long for its slot, prefer the consumer shortening it with a documented rule (last two segments, a leading ellipsis) over relying on CSS truncation alone.
- Empty content means no pill. A row with no source leaves the slot out rather than rendering an empty pill or "unknown".

## Accessibility

- The pill is a `span` with its text, read inline with the row. It has no role; it is not a status.
- Truncated text is hidden from sighted readers but still in the accessible name, so a screen reader hears the full path. The consumer must give a sighted reader a way to the full value as well; a static pill cannot be focused to reveal it.
- Text is 10px mono. The consumer must confirm the muted tones meet contrast on the row surface (WCAG 1.4.3 contrast minimum).
- Static: no focus, no target-size requirement. A pill the consumer makes clickable must become a real button or link with a 24px target (`--weft-touch-target`, WCAG 2.5.8 target size).
