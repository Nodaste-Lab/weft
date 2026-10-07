# NavigationSpacePicker

## Purpose

Choose the active Space and show where signals await action before switching context.

## When to use

Use at the top of a workspace rail when the application owns Space selection and live counts.

## When not to use

Do not use as an Organization switcher or a Space management menu; manage those in Settings.

## How to use

Supply spaces (id, name, optional initials, private, signals and disabled), value, onValueChange and a required label. onAdd adds an Add new option after all Spaces. Add returns through onAdd without changing the selected Space.

## Heuristics

Right-align counts before the chevron or selection check. Keep the Space name aligned to the start after the outlined initials circle. Hidden zero counts should not leave a placeholder.

## Content

Signals count only items awaiting action in that Space. Provide real counts and stable nonempty IDs. Private uses a lock instead of initials.

## Accessibility

Select supplies combobox/listbox keyboard behavior: Enter/Space or arrows open, arrows/typeahead choose, Enter commits and Escape cancels. Full option names remain accessible when text truncates. Selection returns focus to the trigger. Test localized long labels and disabled Spaces.
