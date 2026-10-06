---
related:
  - follow-up-item
  - list-block
  - action-button-row
---

# Follow-up block

## Purpose

A container for a short set of suggested next prompts beneath a generated response. It owns the section shell (title, description, `density`, `tone`), the labelled list, and the mapping of `items` onto `follow-up-item`. It holds no conversation state: selecting an item calls back with its id, and the consumer decides whether to send it or place it in the composer.

## When to use

- After a generated answer, to offer two to four follow-ups the person can take next.
- At the start of a conversation, to show examples of what can be asked.

## When not to use

- Options the person must choose between to proceed. Use `list-block`, which carries selection.
- The response's own content as a list. Use `list-block` or plain markup.
- Actions on the surface itself (copy, retry). Use `action-button-row`.

## How to use

1. Render `FollowUpBlock` with `items`, each `{ id, label, detail?, selected?, disabled?, onSelect? }`.
2. Pass `title` as a string; it becomes the accessible name of the list. Without a string title, pass `aria-label`.
3. Pass `description` for one line of context, such as that the suggestions were generated.
4. Set `density` (`compact` or `default`) and `tone` (`default`, `muted`, `accent`). `accent` uses the info tint; it marks the category "suggested", never a person.
5. Give an item `onSelect(id)` to make it actionable. Decide what selection does: send immediately, or fill the composer when the prompt has details the person may want to edit.
6. With an empty `items` array the block renders an empty list and no placeholder copy. Omit the block instead.

## Heuristics

- Two to four items. More than that is a menu, not a set of suggestions.
- Each suggestion is a concrete next step grounded in the answer above it, not a generic "Tell me more".
- Suggestions stay reviewable. The label is the full prompt, so the person knows what will be sent before selecting it.
- Mark that the items are generated in the title or description, not with colour or an icon alone.
- When the block persists after a selection, the selected item shows its state (`aria-pressed`, `data-selected`). When it does not, remove the block rather than leaving stale suggestions.

## Content

- The title names the set in sentence case: "Suggested next prompts".
- Labels are imperative prompts or questions, sentence case, one line, with no trailing punctuation.
- The detail is one short sentence stating the outcome, ending with a full stop.
- The description, when present, says where the suggestions came from.

## Accessibility

- The block is a `section` with `role="region"`. Pass `aria-label` on the block when the region should be a named landmark; the string `title` names the list, not the region.
- The list is `role="list"` and each item `role="listitem"`, so the count is announced.
- Actionable items are real buttons with `aria-pressed` and a minimum height of `--weft-touch-target` (24px floor, WCAG 2.5.8). Display-only items are not focusable.
- Focus order is the order of `items`. A disabled item uses native disabled and leaves the tab order.
- Selected is readable without colour: `aria-pressed="true"` and `data-selected` carry it; the border and tint only draw it.
