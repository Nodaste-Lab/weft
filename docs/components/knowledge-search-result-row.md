---
related:
  - hud-list-row
  - badge
  - copyable-ref
  - search-field
---

# Knowledge search result row

## Purpose

One hit from a search over a knowledge base or vault. It owns the layout (title, path, up to two category labels, relevance as a percent and a bar, excerpt), the relevance tone thresholds, the mapping from category ids to display labels, the row-as-link that opens the note, and the copy-path control beside it.

## When to use

- Results of a ranked search over notes or documents, where each hit has a score.
- The same list in browse mode, where there is no score and the bar is hidden.

## When not to use

- A generic list of items with no excerpt or score. Use `hud-list-row`.
- A path shown on its own to copy. Use `copyable-ref`.
- A category the user can remove or toggle. Use `chip`.

## How to use

1. Render `KnowledgeSearchResultRow` with a `result` of `id`, `title`, `path`, `excerpt`, `relevance` (0 to 100) and `categories` (ids from `SEARCH_CATEGORIES`).
2. Pass `obsidianHref`, the link that opens the note in the vault app. The whole row is that link.
3. Set `isBrowseMode` to hide the relevance percent and bar when results are not ranked.
4. Own the clipboard: `onCopyPath(path, event)` is called on the copy control, and `copiedPath` tells the row which path to show as "Copied".
5. Unknown category ids render as given; add new ones to `SEARCH_CATEGORIES` so the label and the search logic stay in step.

## Heuristics

- Title first, path under it in mono, excerpt last. The reader confirms the hit from the title and the path before reading the excerpt.
- Relevance tone is fixed: 90 and above positive, 75 and above warning, else muted. The percent and the bar say the same number.
- Browse mode shows no score, because order is not relevance there.
- At most two category labels; more is noise in a row.
- The copy control sits outside the link, so copying does not open the note.

## Content

- The title is the note's title as stored. The path is shown as written, in the dense-info register.
- The excerpt is the matched passage, not a summary; the consumer cuts it to about two lines.
- Relevance is an integer percent.
- Category labels are sentence case ("People", "Documents", "Meetings", "Tasks", "Reference").

## Accessibility

- The row is an `<a>` whose name the component sets to "Open {title} in" plus the vault app's name; the name is fixed and names a product. Open.
- The copy control is a `button` named "Copy path {path}". It renders `h-auto min-h-0 p-1` around a 10px icon, about 18px, below the 24px `--weft-touch-target` floor. Open.
- "Copied" replaces the icon as visible text but no live region announces it; the consumer announces it from `onCopyPath` (WCAG 4.1.3 status messages).
- The relevance dot and bar are `aria-hidden`; the percent text carries the score, so it reads with colour removed (WCAG 1.4.1 use of colour).
- Both the link and the copy control show a focus ring on `:focus-visible`, and the link's hover fill also applies on focus.
