---
related:
  - dropdown-menu
  - menubar
  - button
---

# Context menu

## Purpose

A menu that opens at the pointer on right-click, or on long-press on touch, over a region. It owns the trigger region, the portaled content positioned at the pointer, items including checkbox and radio items, section labels, separators, shortcut hints, groups and one level of submenu. It shares its skin and its item vocabulary with `dropdown-menu`.

## When to use

- Actions on the object under the pointer: a row, a tree node, a card, a selection.
- As a shortcut beside a visible route to the same actions, such as a row's kebab `button` that opens the same menu.

## When not to use

- The only route to an action. A gesture-only menu is not discoverable.
- Actions opened from a visible control. Use `dropdown-menu`.
- App-wide commands. Use `menubar`.
- A surface used mainly by touch, where the 700ms long-press is the only trigger.

## How to use

1. Render `ContextMenu`, then `ContextMenuTrigger` with `asChild` around the region, then `ContextMenuContent`.
2. Each action is a `ContextMenuItem` with `onSelect`. Use `variant="destructive"` for an irreversible action and `inset` to align text with checkbox items.
3. Toggles are `ContextMenuCheckboxItem` with `checked` and `onCheckedChange`; a single choice is `ContextMenuRadioGroup` with `value` around `ContextMenuRadioItem`s.
4. `ContextMenuLabel` heads a section, `ContextMenuSeparator` divides, `ContextMenuGroup` groups.
5. A submenu is `ContextMenuSub` with `ContextMenuSubTrigger` and `ContextMenuSubContent`. One level.
6. `ContextMenuShortcut` shows a key hint. Bind the key separately; the hint is text.
7. Make the trigger region focusable (`tabIndex={0}`) so Shift+F10 and the Menu key open it from the keyboard. Pass `disabled` on the trigger to turn the gesture off.

## Heuristics

- Items relate to the thing under the pointer. A menu that is the same everywhere is a `dropdown-menu` in the wrong place.
- Frequent actions first; the destructive action last, after a separator.
- Disable an irrelevant item rather than hiding it, so the menu keeps its shape.
- Seven to ten items at most; beyond that, group or move to a submenu.
- The same actions exist in a visible control (a kebab in the row, a toolbar). The context menu is the fast path.

## Content

- Items are verb-led, sentence case, no articles: "Rename", "Move to folder".
- A destructive item names its object: "Delete comment".
- Section labels are sentence case in the mono face.
- Shortcut hints use key glyphs, right-aligned.

## Accessibility

- Roles come from the primitive: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio` with `aria-checked`; disabled items carry `aria-disabled` and `data-disabled` and are skipped by the arrow keys.
- On open, focus moves into the menu. Up and Down move, Home and End jump, typing a letter jumps to a match, Enter or Space activates, Escape closes and returns focus to the trigger region.
- The trigger region must be focusable for keyboard users to open the menu; the `contextmenu` event fires from Shift+F10 and the Menu key on a focused element.
- On touch, a 700ms press opens the menu. Offer a visible control as well.
- Items are 32px tall at the default padding, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- Open and close animations collapse under the global `prefers-reduced-motion` rule (WCAG 2.3.3).
