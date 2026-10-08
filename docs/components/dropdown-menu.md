---
related:
  - context-menu
  - menubar
  - select
  - popover
  - button
---

# Dropdown menu

## Purpose

A list of actions that opens from a trigger. It owns the trigger binding, the portaled content, items including checkbox and radio items, section labels, separators, shortcut hints, groups and one level of submenu. It sets the menu roles, moves focus in on open and returns it on close.

## When to use

- Two to ten actions behind one trigger: an overflow kebab, a "More" button, a row's actions.
- Settings that are toggles (checkbox items) or one choice among a few (radio items), alongside actions.

## When not to use

- Choosing a value for a form field. Use `select`.
- Content that is not a list of actions: a form, text, a picker. Use `popover`.
- Navigation links. Use `navigation-menu`, or links inside a `popover`.
- One action. Use `button`.
- A menu from a pointer gesture over a region. Use `context-menu`.

## How to use

1. Render `DropdownMenu`, then `DropdownMenuTrigger asChild` around a `button`, then `DropdownMenuContent`. The trigger gains `aria-haspopup="menu"` and `aria-expanded`.
2. Position with `align`, `side` and `sideOffset` (4px). The content is portaled, capped to the available height and scrolls inside.
3. Each action is a `DropdownMenuItem` with `onSelect`. Use `variant="destructive"` for an irreversible action and `inset` to align text with checkbox items.
4. Toggles are `DropdownMenuCheckboxItem` with `checked` and `onCheckedChange`; a single choice is `DropdownMenuRadioGroup` with `value` around `DropdownMenuRadioItem`s. To keep the menu open after a toggle, call `preventDefault` in the item's `onSelect`.
5. `DropdownMenuLabel` heads a section, `DropdownMenuSeparator` divides, `DropdownMenuGroup` groups.
6. A submenu is `DropdownMenuSub` with `DropdownMenuSubTrigger` and `DropdownMenuSubContent`. One level.
7. `DropdownMenuShortcut` shows a key hint. Bind the key separately.
8. `modal` defaults to true, which blocks interaction with the page while open. Pass `modal={false}` for a menu that should not block scrolling.

## Heuristics

- Five to ten items; group with labels and separators past seven. Beyond fifteen, the list needs `command`.
- Verbs for actions, nouns for destinations, never both in one group.
- The destructive item is last, after a separator, drawn in the stop colour. Colour means consequence.
- Icons are 16px, left-aligned and consistent within a group: all items have one or none.
- A kebab trigger names its object ("Actions for Q3 plan"), not just "More".
- The primary action of a surface is never only inside a menu.
- Hover highlights a row; the same highlight appears on keyboard focus, so the row exists for both.

## Content

- Items are sentence case, verb plus object, no articles, one line: "Export log".
- Section labels are sentence case in the mono face.
- Shortcut hints are key glyphs, right-aligned.
- The trigger label is a noun or "More"; an icon-only trigger carries an `aria-label`.

## Accessibility

- Roles come from the primitive: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio` with `aria-checked`; the trigger exposes `aria-haspopup` and `aria-expanded`.
- Enter, Space and Down open the menu with focus on the first item; Up opens it on the last. Up and Down move, Home and End jump, typing a letter jumps, Escape and Tab close, and focus returns to the trigger.
- Disabled items carry `aria-disabled` and are skipped by the arrow keys. The WAI-ARIA menu pattern lets disabled items stay focusable; the primitive does not.
- Items are 32px tall at the default padding, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- Open and close animations collapse under the global `prefers-reduced-motion` rule (WCAG 2.3.3).

### Shared file actions and panel handoff

File actions in navigation and a File shell reuse the same grouped action
composition, meaningful [semantic icons](navigation-icon.md#shared-file-shell-symbols)
beside labels, nested choices and narrow/touch drilldown. Do not replace that
composition with an unrelated flat list or a lone “File operations” placeholder.
When an action opens a panel, reveal it even if another panel is active and move
focus into it. Menu dismissal must not reclaim focus from that destination.
The usual return-to-trigger rule applies when no new destination takes focus.
The host supplies available actions and handlers; a rendered item proves no
mutation or permission check.
