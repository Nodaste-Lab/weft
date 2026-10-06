---
related:
  - collapsible
  - accordion
  - tier-group
  - badge
---

# Signal group collapsible

## Purpose

A collapsible group header for a long list that has been grouped by a key (project, priority, source, sender), with the group's rows as its body. It owns the full-width header button with chevron, label and count, an actions cluster beside the header, the body container and the ARIA wiring. The consumer owns the collapsed state, so groups can remember their state across renders.

## When to use

- A grouped list where each group can be folded to get the others into view.
- A group that has bulk actions (acknowledge all, resolve all) that belong beside its header.

## When not to use

- Hand-authored sections with bodies of prose. Use `accordion`.
- A single disclosure with no group semantics. Use `collapsible`.
- Grouping by tier where the heading is static and nothing folds. Use `tier-group`.
- Generated response parts. Use `section-block`.

## How to use

1. Render `SignalGroupCollapsible` with `groupKey` (a stable id for the group), `label`, `collapsed` and `onToggle`. The primitive holds no state; store `collapsed` per `groupKey` in the consumer.
2. Pass `count` to show the group size after the label in parentheses.
3. Pass `headerActions` for bulk controls. They render to the right of the header only while the group is open.
4. Pass `inlinePaddingX` to align the header text with the surrounding chrome (default 12px), and `bodyId` when another element must reference the body.
5. Put the group's rows in `children`. The body is unmounted while collapsed.

## Heuristics

- Groups remember. A group the person collapsed stays collapsed through a refresh; keep the state keyed by `groupKey` outside the list.
- Header actions act on the whole group and only show while it is open, so a collapsed group cannot be bulk-changed unseen.
- The count is the size of the group as filtered; an unfiltered count beside a filtered body misleads.
- Clicks on the header stop propagating, so a row-level handler on an ancestor does not fire when a group is toggled.
- The chevron points right when collapsed and down when open; `data-collapsed` is the attribute to style and test on.

## Content

- Label: the group's value as the person knows it ("My project", "Urgent"), in sentence case. The primitive currently uppercases the label visually; it is a dense-info header and the casing ruling for app surfaces is tracked in the brand package.
- Count: an integer in parentheses after the label; omit `count` when the size is unknown rather than passing 0.
- Header action labels: verb plus scope ("Acknowledge all"), sentence case.

## Accessibility

- The header is a `button` inside an `h4` with `aria-expanded`, `aria-controls` pointing at the body, and an `aria-label` of the form "Expand {label} group" or "Collapse {label} group". The visible label is part of that name (WCAG 2.5.3).
- The count is `aria-hidden`; a screen reader hears the label and the state but not the size. Put the count in the label if it must be announced.
- The heading level is fixed at `h4`; place the group where an `h4` fits the page outline (WCAG 1.3.1).
- Enter and Space toggle the header. Header actions are separate tab stops after it and must have their own names that include the group.
- The header button is full width and at least 24px tall (`--weft-touch-target`); the chevron is decorative and `aria-hidden`.
- No animation; nothing to collapse under `prefers-reduced-motion: reduce`.
