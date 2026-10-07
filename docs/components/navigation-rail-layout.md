# NavigationRailLayout

## Purpose

Keep a resizable desktop rail and workspace beside each other, replacing the rail with a modal drawer on narrow screens.

## When to use

Use around an application-owned rail when persistent desktop sizing and responsive keyboard behavior are required.

## When not to use

Do not use to own file data, routes or preference synchronization across accounts. Do not store drawer geometry as the desktop width.

## How to use

Provide rail, children, railId, label, openLabel, resizeLabel and description. width/onWidthChange control sizing; otherwise defaultWidth initializes state and optional storageKey restores a local preference. mode is auto, desktop or drawer. open/onOpenChange can control the drawer. Bounds default to 200–720px, defaultWidth to 280px.

## Heuristics

Container constraints clamp only rendered width. The user’s preference is changed by resizing, not by moving to a smaller screen. Explicit modes bypass responsive media listeners. The shared navigationNarrowQuery defaults to below 1024px.

## Content

Use labels that identify this navigation region. Supply a description of the drawer’s purpose. The application may close the controlled drawer after destination activation.

## Accessibility

The named vertical separator supports 16px arrows, 64px Shift+arrows and Home/End. Pointer resizing captures the primary pointer. The drawer traps focus, closes on Escape and restores its trigger. Storage failures do not block navigation. Test resizing, refresh, narrow transitions, zoom, forced colors and nested overlays.
