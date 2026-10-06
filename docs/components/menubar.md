---
related:
  - dropdown-menu
  - navigation-menu
  - context-menu
  - tabs
---

# Menubar

## Purpose

A persistent horizontal bar of menu triggers, each opening a menu of commands. It owns the bar, each menu's trigger and portaled content, items including checkbox and radio items, section labels, separators, shortcut hints, groups and one level of submenu. It gives app commands one place to live, the way a desktop application's menu bar does.

## When to use

- An editor-like app with many commands grouped by category that must stay reachable from one place.
- Commands that have keyboard shortcuts worth showing beside their names.

## When not to use

- Site or app navigation made of links. Use `navigation-menu`.
- One menu of actions. Use `dropdown-menu`.
- Switching views within a page. Use `tabs`.
- A narrow viewport. Collapse the bar into one `dropdown-menu`.

## How to use

1. Render `Menubar`, then one `MenubarMenu` per menu, each with a `MenubarTrigger` and a `MenubarContent`.
2. `MenubarContent` aligns to the start of its trigger with an 8px gap by default; `align`, `alignOffset` and `sideOffset` adjust it.
3. Each command is a `MenubarItem` with `onSelect`. Use `variant="destructive"` for an irreversible action and `inset` to align text with checkbox items.
4. Toggles are `MenubarCheckboxItem` with `checked`; a single choice is `MenubarRadioGroup` with `value` around `MenubarRadioItem`s.
5. `MenubarLabel` heads a section, `MenubarSeparator` divides, `MenubarGroup` groups, `MenubarShortcut` shows a key hint. Bind the key separately.
6. A submenu is `MenubarSub` with `MenubarSubTrigger` and `MenubarSubContent`. One level.
7. To control which menu is open, pass `value` and `onValueChange` on `Menubar`.

## Heuristics

- Three to seven menus. Each name is a single noun for a category.
- Within a menu, separators group related commands; the destructive command is last.
- Disabled commands stay visible and disabled, so the menu keeps its shape and the person learns what exists.
- A shortcut shown is a shortcut that works.
- Once one menu is open, hovering another trigger opens it; the first open is by click or keyboard.
- Triggers are sentence case. The open trigger is drawn with the accent fill; it is a state, not a selection.

## Content

- Trigger labels are one-word nouns: "File", "View".
- Items are verb-led, sentence case, no articles: "New session", "Toggle panels".
- A checkbox item names the thing it shows or hides; the checked state comes from `aria-checked`, not from the label changing.
- Shortcut hints are key glyphs, right-aligned.

## Accessibility

- Roles come from the primitive: `menubar`, `menuitem` triggers with `aria-haspopup` and `aria-expanded`, `menu` content, `menuitemcheckbox` and `menuitemradio` with `aria-checked`.
- Tab moves into and out of the bar as one stop. Left and Right move between triggers, Down opens a menu on its first item, Up and Down move within it, Enter or Space activates, typing a letter jumps, Escape closes and returns focus to the trigger.
- Triggers are 28px tall at the default padding and items 32px, above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- Open and close animations collapse under the global `prefers-reduced-motion` rule (WCAG 2.3.3).
