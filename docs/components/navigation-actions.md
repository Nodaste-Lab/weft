# NavigationActions

## Purpose

Shared navigation actions composition.

## When to use

Compose a workspace navigation rail with the shared navigation tokens and row controls.

## When not to use

Do not use this control to own application routing, permissions or server data.

## How to use

Import NavigationActions from the package root or src/ui/navigation-actions.tsx.

```tsx
<NavigationActions name="Research" items={[{ id: "more", label: "More", children: [{ id: "copy", label: "Copy link", onSelect: () => {} }] }]} />
```

## Heuristics

Keep names visible and controls aligned. Preserve native destination links.

## Content

Provide names and localized labels from the consuming application. Fixture values are illustrative only.

## Accessibility

Supply the required accessible labels. Preserve visible keyboard focus, Escape dismissal and focus return. Test keyboard and touch interactions in the consuming application.

Action items have stable IDs, labels, optional disabled states and callbacks; groups carry children. Pass the same model to desktop and compact layouts so capabilities cannot drift. `compact` explicitly selects one-panel navigation; automatic detection recognizes the shared drawer and small viewport. Right-click, long-press, Shift+F10 and ContextMenu entry points should activate the same named trigger; F2 rename belongs to the consuming row. Do not include Move up/down in the action model: provide keyboard reorder and a touch placement alternative in the file tree.
