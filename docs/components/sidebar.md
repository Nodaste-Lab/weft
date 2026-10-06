---
related:
  - collapsible
  - navigation-menu
  - sheet
---

# Sidebar

## Purpose

A persistent rail for app-level navigation. It owns the rail chrome (provider, header, scrolling content, footer, resize rail), the group label and group action, the menu row with its icon, label, trailing action and count badge, nested sub-rows, and the main inset beside the rail.

## When to use

- Navigation that stays in place across routes: sections of an app, a workspace picker, a tree of documents or folders.
- A rail that collapses to icons or off-canvas on narrow viewports.

## When not to use

- Navigation within one page. Use `tabs`.
- A menu that opens from a trigger. Use `dropdown-menu` or `context-menu`.
- A one-off list of options inside a response or panel. Use `list-block`.

## How to use

1. Wrap the app shell in `SidebarProvider`; put `Sidebar` and `SidebarInset` inside it.
2. Group rows with `SidebarGroup`, `SidebarGroupLabel` and `SidebarGroupContent`; a group-level action (create, add) is `SidebarGroupAction`.
3. A row is `SidebarMenuItem` with `SidebarMenuButton`. Render the button `asChild` around an `<a>` when the row navigates, and set `isActive` and `aria-current="page"` on the current route.
4. A per-row action is `SidebarMenuAction` with `showOnHover`; give it an accessible name that includes the row title.
5. A count is `SidebarMenuBadge`; nesting is `SidebarMenuSub` with `SidebarMenuSubButton`, wrapped in `collapsible` when the parent expands.

The `navigation-rail` template shows all of this composed.

## Heuristics

- A row is one colour. Folder and document titles share the foreground; the active row is the accent fill, not a text colour. Link blue on a rail row reads as "link", not "current" or "document".
- Row actions appear on hover and on focus-within, never only on hover.
- Group labels are sentence case, in the sans face.
- Counts are a badge on the row, right-aligned, not a styled span in the label.
- Every tappable thing in the rail meets the 24px floor (`--weft-touch-target`). Open: `SidebarMenuAction` measures 18×18 under compact density; tracked on the Sidebar fixes branch.

## Content

- Row labels are the thing's name as the user knows it, sentence case, no trailing punctuation.
- Group labels name the group, not the action ("Private", not "Your documents").
- Counts are integers; omit the badge at zero rather than showing "0".

## Accessibility

- The current route's row carries `aria-current="page"`.
- Row actions and the group action have accessible names that include what they act on.
- Hover-revealed actions are also revealed on `:focus-within`, so a keyboard user reaches them.
- The rail toggle is a real button with an accessible name; the keyboard shortcut is announced through its tooltip.
