---
related:
  - button
  - panel-header
  - add-item-button
  - dropdown-menu
---

# Action button row

## Purpose

An action row with explicit form, navigation and composer hierarchy, plus a generic composition mode. Structured variants own action emphasis, spacing and placement; the consumer supplies labels, callbacks and state. Generic mode owns the gap, `align`, `dense` wrapping and `trailingLink`.

## When to use

- Two to four related actions at the head or foot of a panel, a card or a composer: copy, export, refresh. The actions are `button`.
- The actions slot of `panel-header`.
- A footer whose last item is a destination rather than an action ("Board view"). Put it in `trailingLink`.

## When not to use

- One action. Place the `button` directly.
- More than four or five actions. Keep the two most used and move the rest behind one trigger with `dropdown-menu`.
- A set of mutually exclusive options. Use `toggle-group`.
- Appending a row to an editable list. Use `add-item-button`.

## How to use

- **Form:** `variant="form"` groups link-styled Cancel and filled Save at the end. Pass `secondaryAction={{ children: "Cancel", onClick: cancel }}` and `primaryAction={{ children: "Save", type: "submit" }}`. Cancel stays a semantic button, not a navigation link.
- **Navigation:** `variant="navigation"` places outlined Back at the start and filled Continue at the end. Separation communicates direction; DOM and keyboard order remain Back then Continue.
- **Composer:** `variant="composer"` places link-styled Cancel and secondary Attach at the start, with filled Send at the end. Supply Attach through `auxiliaryActions`, using `Button variant="outline" size="sm"`.
- Structured variants require `primaryAction`, accept an optional `secondaryAction`, and own their button sizes and variants. Action objects accept Button props such as `onClick`, `type`, `disabled`, `loading`, and accessible names. The default type is `button`; explicitly use `submit` for form submission.
- The host owns validation, saving, attachment picking, sending, errors/retry, and whether Cancel is available during a request. Nothing is persisted by the row.
- Groups wrap at narrow widths without reversing action or focus order. Use concise labels; verify long translated labels in the consumer.
- Omit `variant` (or use `actions`) for existing children, `align`, `dense`, and `trailingLink` composition. `dense` enables wrapping in generic mode; both generic densities use the same 6px gap. Structured variants always wrap and retain hierarchy spacing.
- Add `role="group"` and `aria-label` when the set has a name.

## Heuristics

- One filled (default variant) button per row. The others are `outline`, `secondary` or `ghost`.
- Order follows frequency and consequence: the common, safe actions first; a destructive action last, never between two safe ones.
- A generic row stays on one line in the default mode. When labels would wrap or truncate, cut an action rather than shrinking the text.
- The trailing slot holds the one item that is not an action: a link to a fuller view.
- The row never carries a status colour. Colour belongs to the action it describes (the `destructive` variant), not to the row.

## Content

- Each action is a verb-led label in sentence case, one to three words, no trailing punctuation ("Export log").
- An icon-only action carries an `aria-label` naming the action and its object.
- The trailing link is a noun phrase naming the destination, not a verb.

## Accessibility

- The row is a plain `div` with no role. Add `role="group"` and `aria-label` when the set has a name. Reserve `role="toolbar"` for rows where the consumer also implements arrow-key focus movement; without it, `group` is the honest role.
- Focus order is DOM order. In generic mode, `trailingLink` renders last, so it is the last tab stop regardless of `align`.
- Every child meets the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size). `button` sizes `sm` (32px) and `dense` (34px) both clear it; do not override child heights downward.
- The row does not hide itself on rest. If a consumer reveals a row on hover, the same rule must reveal it on `:focus-within`.
