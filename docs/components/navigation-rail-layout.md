# NavigationRailLayout

## Purpose

Shared navigation rail layout composition.

## When to use

Compose a workspace navigation rail with the shared navigation tokens and row controls.

## When not to use

Do not use this control to own application routing, permissions or server data.

## How to use

Import NavigationRailLayout from the package root or src/ui/navigation-rail-layout.tsx.

```tsx
<NavigationRailLayout railId="layout-example" label="Navigation" openLabel="Open navigation" resizeLabel="Resize navigation" description="Browse destinations" rail={<nav id="layout-example" aria-label="Example navigation">Files</nav>}><p>Workspace</p></NavigationRailLayout>
```

## Heuristics

Keep names visible and controls aligned. Preserve native destination links.

## Content

Provide names and localized labels from the consuming application. Fixture values are illustrative only.

## Accessibility

Supply the required accessible labels. Preserve visible keyboard focus, Escape dismissal and focus return. Test keyboard and touch interactions in the consuming application.

`width`/`onWidthChange` provide controlled sizing. Otherwise `defaultWidth` initializes local state and an optional `storageKey` restores the user's saved desktop preference. Blocked storage does not prevent navigation. The displayed width is clamped to the host's available width without changing the saved preference. Default bounds are 200–720px; preserve application bounds deliberately. Home/End reach bounds, arrows move 16px, Shift+arrows 64px. Narrow mode below 1024px uses Sheet, never writes a drawer width, and restores focus to its trigger. `mode` permits explicit previews. The application may close the controlled drawer after destination activation.
