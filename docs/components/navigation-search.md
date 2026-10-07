# NavigationSearch

## Purpose

Shared navigation search composition.

## When to use

Compose a workspace navigation rail with the shared navigation tokens and row controls.

## When not to use

Do not use this control to own application routing, permissions or server data.

## How to use

Import NavigationSearch from the package root or src/ui/navigation-search.tsx.

```tsx
<NavigationSearch label="Search in Studio" placeholder="Search" />
```

## Heuristics

Keep names visible and controls aligned. Preserve native destination links.

## Content

Provide names and localized labels from the consuming application. Fixture values are illustrative only.

## Accessibility

Supply the required accessible labels. Preserve visible keyboard focus, Escape dismissal and focus return. Test keyboard and touch interactions in the consuming application.
