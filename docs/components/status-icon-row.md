---
related:
  - hud-list-row
  - callout
  - dot
  - provider-status-badge
---

# Status icon row

## Purpose

A row that reports the state of one thing a settings module depends on: a sign-in, a local runtime, an installed plugin. It owns the bordered icon tile, the dense title and detail typography, the tone that accents the title, and an actions slot. The layout comes from `hud-list-row` with the frame off, so the row reads as a line of status inside a module body, not as a card of its own.

## When to use

- A settings or context module with one to four dependencies, each reporting connected, needs attention, or off.
- A status that has a title and a one-line detail, and sometimes an action ("Sign in", "Retry").

## When not to use

- A message that needs a paragraph, a heading or a band across the panel. Use `callout`.
- A status with no detail that sits at the end of a row. Use `provider-status-badge` or `badge`.
- A list item that navigates or expands. Use `hud-list-row` directly with `as="button"`.
- A state on its own, beside a label. Use `dot`.

## How to use

1. Render `StatusIconRow` with `icon` (a 11px to 12px glyph), `title` and, where there is one, `detail`.
2. Set `tone` to `success`, `warning`, `danger`, `muted` or `info` (default). Tone sets `data-tone` and the title colour; only `success` changes the title from the secondary text tone. Colour the glyph with the matching token when passing it in.
3. `density` is `compact` (22px tile, default) or `default` (26px round tile).
4. `actions` renders in the trailing slot. Put one small button there, named for what it does to this row ("Retry sign-in").
5. The root is a `div` with `role="status"` and `data-slot="status-icon-row"`; it accepts native `div` props.

## Heuristics

- The title states the fact ("Sync connected", "Sign-in needs attention"); the detail says why or what next. Neither repeats the icon.
- Tone is a state, drawn through the icon and (for success) the title. The words carry it on their own (WCAG 1.4.1 use of colour).
- An action belongs on the row only when the reader can fix the state from here. A row that says "off for this build" has no action.
- The row has no border or fill. Rows stack inside the module's body with the module's gap; do not wrap each in a card.
- Title and detail truncate to one line each. If the detail needs to wrap, it is a `callout`.

## Content

- Title: sentence case, present tense, no trailing punctuation: "Sync connected", "Sign-in needs attention".
- Detail: one short sentence, with a full stop, or a fragment without one; be consistent within a module.
- Action label: a verb, sentence case: "Retry", "Sign in".
- A dependency that is off is a fact, shown with `muted` tone and a title that says so. A dependency that does not apply to this build is left out.

## Accessibility

- The row sets `role="status"`, a polite live region. Changes to the title or detail are announced when they happen (WCAG 4.1.3 status messages). Keep the content inside the row stable except when the state changes, and do not render many of these rows at once with content that churns.
- The icon tile is `aria-hidden`; the title and detail are the accessible content. The icon must not be the only carrier of meaning.
- The actions slot holds real buttons with accessible names that include the subject. They meet the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size); the row itself is not interactive.
- Text is 10px and 9px. The consumer must confirm contrast of the detail tone on the module surface (WCAG 1.4.3 contrast minimum).
