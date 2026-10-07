# NavigationActions

## Purpose

Render one action model as cascading desktop menus or compact panels with Back.

## When to use

Use for a file or folder’s permission-filtered actions, including context-menu and keyboard entry points.

## When not to use

Do not put application permissions or mutations inside this composition. Do not use menu visibility as proof that a service is connected.

## How to use

Provide name and items with stable id, label, disabled, onSelect and optional children. compact explicitly selects the panel presentation; otherwise the shared drawer hook and narrow query determine it. caption, menuLabel, backLabel and trigger/content classes customize presentation.

## Heuristics

Filter unavailable actions before rendering; use disabled actions only when their availability is useful context. Right-click, long-press and Shift+F10 should invoke the same trigger as the ellipsis. Keep F2 rename and keyboard reorder on the consuming row.

## Content

Use action verbs and meaningful group names. Actions on a subtree should say so. Destructive actions should open a confirmation with a safe initial focus target.

## Accessibility

Radix supplies desktop menu keyboard navigation. Compact groups expose aria-haspopup, the current panel name is announced, entering a group focuses Back, and Back restores focus to the originating group. Escape dismisses and restores trigger focus. The package uses its own data-navigation-drawer hook, not application CSS selectors.
