---
related:
  - button
  - scroll-area
  - search-field
---

# Pagination

## Purpose

Page-by-page navigation through a long collection. It owns the `nav` landmark, the item list, the numbered page link with its current state, the previous and next links, and the ellipsis for skipped runs. Links are anchors drawn with `button` variants: outline for the current page, ghost for the rest.

## When to use

- A result set too long to load at once, where most people need the first few pages.
- A list that is paged on the server and where each page has an address.

## When not to use

- A collection that fits on one page. Hide the control.
- A linear flow of steps. Use `button` with a back action.
- A short list. Show it all inside a `scroll-area`.
- When finding, not browsing, is the task. Offer `search-field` and filters first.

## How to use

1. Render `Pagination`, then `PaginationContent`, then one `PaginationItem` per control.
2. Each page is a `PaginationLink` with `href`. Pass `isActive` on the current page; it sets `aria-current="page"` and the outline variant. Add `aria-label="Page 3"` to each numbered link; the component does not.
3. `PaginationPrevious` and `PaginationNext` carry their own labels. Omit the item on the first and last page; an anchor has no disabled state.
4. `PaginationEllipsis` stands in for skipped pages.
5. Show the current page, one page either side, and the first and last. On narrow viewports show the current page, its neighbours and the ends.
6. For client-side paging, still pass an `href` that addresses the page. An anchor without `href` is not keyboard-focusable.
7. After a page change, put the page number in the document title and move focus to the list heading or the first result.

## Heuristics

- Numbers, not words. "Previous" and "Next" are the only text.
- The set keeps a stable width as the current page moves; the ellipsis absorbs the change.
- Current is a state (`aria-current`, `data-active`) drawn with the outline fill; the other pages are quiet.
- Filtering or sorting applies to the whole collection and returns the person to page 1.
- An invalid page address shows page 1, not an error.

## Content

- "Previous" and "Next", sentence case. Below the small breakpoint the words are hidden and the chevrons remain.
- Numbered links are the page number; their accessible name is "Page N".
- The landmark label is "pagination" and is read with the navigation role.

## Accessibility

- `Pagination` renders `nav` with `role="navigation"` and `aria-label="pagination"`.
- The current page carries `aria-current="page"`.
- Previous and next carry `aria-label="Go to previous page"` and `aria-label="Go to next page"`, so they keep a name when their text is hidden on narrow viewports.
- The ellipsis is `aria-hidden`; its "More pages" text is hidden with it, so skipped pages are not announced.
- Page links use the `icon` size (36px square) and previous and next use the default height (36px), above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- Links take the `button` focus ring on `:focus-visible`. After a same-document page change, the consumer manages focus; the component does not.
