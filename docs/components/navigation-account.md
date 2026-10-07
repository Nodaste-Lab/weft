# NavigationAccount

## Purpose

Shared navigation account composition.

## When to use

Compose a workspace navigation rail with the shared navigation tokens and row controls.

## When not to use

Do not use this control to own application routing, permissions or server data.

## How to use

Import NavigationAccount from the package root or src/ui/navigation-account.tsx.

```tsx
<NavigationAccount name="Avery Chen" initials="AC" settingsLabel="Account settings" settingsHref="#settings" />
```

## Heuristics

Keep names visible and controls aligned. Preserve native destination links.

## Content

Provide names and localized labels from the consuming application. Fixture values are illustrative only.

## Accessibility

Supply the required accessible labels. Preserve visible keyboard focus, Escape dismissal and focus return. Test keyboard and touch interactions in the consuming application.
