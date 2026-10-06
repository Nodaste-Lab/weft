---
related:
  - stack
  - toolbar
  - card
  - dropdown-menu
---

# Separator

## Purpose

A 1px rule in the border colour, horizontal or vertical. It is decorative by default (`role="none"`); `decorative={false}` makes it a semantic `separator`. It owns the line only.

## When to use

- Between groups inside one container when spacing alone does not separate them: groups in a toolbar, the end of a card body before its footer.
- A vertical rule between inline items in a row.

## When not to use

- Between sections that already have headings. The heading is the break.
- To make space. Use the `gap` on `stack`.
- Inside a menu. Use the menu's own separator part in `dropdown-menu` or `context-menu`.
- Under a card header. Add `border-b` to `CardHeader`; the padding adjusts.

## How to use

1. Render `Separator`. It is horizontal, full width and 1px.
2. For a vertical rule, set `orientation="vertical"` and give the parent a height (a flex row with `items-stretch`).
3. Set `decorative={false}` only when the division carries meaning a screen reader should announce.

## Heuristics

- Always 1px, always the rule colour. A thicker or tinted line is a border, not a separator.
- Equal space on both sides. A rule closer to one side reads as belonging to it.
- Never a rule next to a border. One edge per boundary.
- The brand entry names a dashed form for soft separation. No prop ships for it; a consumer who needs it sets a class.

## Content

- None.

## Accessibility

- Ships: `decorative` defaults to true, which sets `role="none"`, so assistive technology skips it. With `decorative={false}` it carries `role="separator"` and `aria-orientation`.
- It is never focusable and never a target.
- A decorative line is exempt from non-text contrast (WCAG 1.4.11); do not depend on it to convey structure. Headings and groups carry structure.
