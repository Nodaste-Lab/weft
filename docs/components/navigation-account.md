# NavigationAccount

## Purpose

Show the signed-in person and an explicit Settings destination at the bottom of a workspace rail. Email is intentionally absent to protect personal data during screen sharing and usability testing.

## When to use

Use for a persistent account footer with a name, initials and a Settings link or action.

## When not to use

Do not use for a profile editor, Organization switcher or an identity list. Those belong in Settings.

## How to use

Provide name, initials and settingsLabel. Prefer settingsHref for a routed Settings page; onSettings supports an application-owned overlay. onAccount optionally makes the identity an action. Without onSettings or a URL, Settings is disabled.

## Heuristics

Keep the account footer outside the scrolling Files region. Preserve the visible name at narrow widths and avoid identifying people with colors.

## Content

Use the person’s display name and short initials; never pass email as the name or settingsLabel. Localize the Settings label.

## Accessibility

Native links support new tabs and browser history. Icon-only Settings has a required accessible name. The initials are decorative because the display name already identifies the person. Keyboard focus follows normal Tab order.
