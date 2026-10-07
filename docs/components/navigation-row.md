# Navigation row

## Purpose

A layout and separate controls for a nested navigation list. It owns navigation geometry and visual states; consumers own routing, permissions, menus, data and keyboard reordering.
## When to use

Files, folders and top-level destinations in a resizable rail.

## When not to use

Do not substitute this for an ARIA tree with arrow-key navigation, or change generic table/accordion rows to match it.

## How to use

Compose NavigationRow, NavigationRowDisclosure, NavigationRowLink for destinations and NavigationRowButton for actions. Set current on the wrapper and aria-current="page" on the active destination. Pass disabled to each control as well as the layout. Supply a full accessible name for a truncated label. Supply controlled expanded state and onClick to disclosure. Load tokens.css and components.css. density is optional and otherwise follows root density; depth is zero-based and hierarchical enables indentation. touch enables 44px geometry in simulated drawers.

## Heuristics

Separate expand and open. Native links preserve copy URL, new tabs and browser history. No implicit event interception, storage or application services. Navigation tokens: row-h 44/36/28px, target 44/24/24px, gap/inset 4px, indent 8px. Generic --weft-row-h is unchanged. Coarse pointers use 44px targets.

## Content

Use sentence-case file and destination names. Put signal counts and permission-appropriate action triggers after the label. Describe file type and listening/locked states once using aria-describedby when needed.

## Accessibility

Compose inside nested lists, not role=tree. Tab reaches separate controls. Disclosure exposes expanded state and an explicit name. The wrapper is not focusable and current is styling only: the destination must expose aria-current. Menus must preserve focus, Escape, right-click/long-press/Shift+F10/Context Menu access; rename and reorder remain consumer behavior. Disabled layout metadata does not disable native links; omit unavailable destinations or implement permission-safe navigation. Current state includes weight/marker and forced-color support.

The prop snapshot follows Weft’s component-family convention: it merges the exports in this module. `expanded` and `name` belong to `NavigationRowDisclosure`; `href` belongs to `NavigationRowLink`, not the row layout. Use the generated TypeScript declarations for each export’s precise contract. The lab deliberately uses preview action buttons; the package gallery and standalone checks exercise native links. Real Avalandra destinations must use `NavigationRowLink`.
