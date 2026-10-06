---
related:
  - label
  - stat-row
  - badge
  - panel-header
---

# Eyebrow label

## Purpose

A small tracked label that sits above a group and names it: "Sources", "Tags", "Workspace context". It owns the size, the tracking, the weight and the muted tone, and under the Weft palette it resolves to the mono face through the global type rule. It is a group label, not a heading and not a badge.

## When to use

- A short label above a cluster of related items in a panel, where a heading would be too heavy.
- A section marker inside a card or a popover that has its own title already.

## When not to use

- The title of a page, panel or card. Use a heading, or `panel-header`.
- A label bound to one form control. Use `label`.
- A state or category on a row. Use `badge`.
- A label and value pair. Use `stat-row`.
- Running text or a sentence. It is a label of one to three words.

## How to use

1. Render `EyebrowLabel` with the group name as children.
2. Choose `size`: `sm` (10px, 0.10em), `default` (12px, 0.06em) or `lg` (14px, 0.04em); the tracking tightens as the size grows.
3. Choose `tone`: `muted` (default), `default` for more weight, `accent` for the primary colour when the group is the current one.
4. Pass `icon` for a 12px leading glyph; mark it `aria-hidden`.
5. Render `asChild` around a real heading element when the label is the only title the group has, so it enters the outline.

## Heuristics

- One eyebrow per group, placed with the group's own spacing above its first item.
- The label names the group, not the action ("Sources", not "Add sources").
- Tone is a state: `accent` means this group is current or selected, and the selection is also marked on the items.
- Sentence case on app surfaces with the tracking kept (owner ruling, 2026-09-01). The shipped primitive still applies `uppercase`; the brand package records the change ticket. Until it lands, do not stack an uppercase eyebrow beside sentence-case labels in the same row.
- Never two registers in one row: an eyebrow and a `badge` in the same line share a casing.

## Content

- One to three words, no trailing punctuation.
- The noun the group is known by ("Tags", "Recap period"), not a description.
- No counts in the label; a count is a `badge` after it.

## Accessibility

- The root is a `span` with no role; a screen reader reads it as text before the group. When the label is the group's only name, render it `asChild` as a heading or reference it from the group with `aria-labelledby`.
- Uppercase is visual only; the DOM text keeps its written case so it is read as words, not letters.
- The eyebrow is not interactive and not a target; if it becomes a trigger (a collapsible group), wrap it in a `button` at the 24px floor (`--weft-touch-target`).
- The muted tone must still clear 4.5:1 against its ground at 10px and 12px (WCAG 1.4.3); use `default` tone on tinted grounds.
- No animation.
