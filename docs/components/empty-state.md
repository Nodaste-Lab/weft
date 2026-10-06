---
related:
  - callout
  - alert
  - HudIssueCallout
  - skeleton
  - button
---

# Empty state

## Purpose

What a surface shows when it has nothing to list yet, or when it could not load what it should list. It owns two layouts: `centered`, a stacked icon, title, description and action for a genuine empty, and `notice`, a left-aligned dashed box for a failure that sits inside the content area without claiming the area is empty. The consumer owns the words and the action.

## When to use

- A list, panel or search with no items: nothing created yet, no results, a filter that matches nothing (`centered`).
- A fetch that failed, a partial load or a missing prerequisite, where a centred "nothing here" would be untrue (`notice`).

## When not to use

- A surface that is loading. Use `skeleton` until the answer is known.
- A message beside content that does exist. Use `callout` or `alert`.
- A structured failure with source attribution and a next action. Use `HudIssueCallout`.
- A fact row with an honest empty value ("Never", "—"). Leave the row; an empty state is for a whole surface.

## How to use

1. Render `EmptyState` with a required `title`. The title is the one thing the surface says; there is no default text.
2. Choose `variant`: `centered` (default) fills the area; `notice` renders inline, left-aligned, with a dashed border.
3. Pass `description` to say what fills the surface or why it is empty, and `action` with a `button` for the next step.
4. Pass `icon` for a leading glyph (28px in `centered`, 16px in `notice`; marked `aria-hidden` for you) and `tone` (`info`, `warning`, `danger`, `positive`) to colour the icon and description.
5. Render it in place of the list, inside the same container, so the surrounding chrome stays.

## Heuristics

- Say what is empty, say what fills it, offer the next step, in that order. Stop after the step.
- Honest empties. "No notes yet" is true before the first note; after a failed fetch it is not, and the `notice` variant with "Could not load notes" is.
- One action. If two are needed, the second is a link in the description.
- Tone is a state: `warning` for a prerequisite that is missing, `danger` for a failure, default for a plain empty.
- A filtered empty differs from a true empty: "No documents match" with a clear-filters action, not "No documents yet".

## Content

- Title: sentence case, short, states the fact without apology ("No notes yet", "No results", "Fetch failed").
- Description: one sentence saying what fills the surface or what to check ("Create a note to start capturing context", "Check your connection").
- Action: verb first, sentence case ("Create note", "Retry", "Clear filters").
- No trailing full stop on the title; descriptions are sentences.

## Accessibility

- The root is a `div` with no role; the title is a paragraph, not a heading, so the surface's own heading still outlines the page. Put a heading above it when the area has none.
- An empty state that replaces content after an async load is not announced on its own. When the change matters (a search returning nothing), wrap the title in a `status` live region or announce it from a sibling (WCAG 4.1.3).
- The action is a real `button` at the 24px floor (`--weft-touch-target`), reached by Tab.
- The icon is `aria-hidden`; the title carries the meaning, and the tone colour never does so alone (WCAG 1.4.1).
- No animation.
