---
related:
  - sidebar
  - navigation-menu
  - dropdown-menu
  - tabs
---

# Breadcrumb

## Purpose

A trail of the ancestors of the current location, ending at the location itself. It owns the `nav` landmark, the ordered list, the link item, the current-page item, the separator and the ellipsis for a collapsed middle. It does not own the hierarchy; the consumer passes the ancestors in order.

## When to use

- A hierarchy three or more levels deep, where the person can arrive deep in it from search or a link.
- Showing location, not history. The trail is the same for everyone on that page.

## When not to use

- A flat structure of one or two levels.
- A linear flow of steps. Use `button` with a back action.
- A narrow viewport where `sidebar` already shows the path; two copies of the same trail is one too many.
- Primary navigation. The breadcrumb supplements `sidebar` or `navigation-menu`.

## How to use

1. Render `Breadcrumb`, then `BreadcrumbList`, then one `BreadcrumbItem` per level with a `BreadcrumbSeparator` between items.
2. Each ancestor is a `BreadcrumbLink` with `href`; pass `asChild` to render a router link.
3. The last item is `BreadcrumbPage`: a span carrying `aria-current="page"`.
4. For a long trail, keep the first and last items and replace the middle with `BreadcrumbEllipsis`. The ellipsis is presentational; to make the collapsed levels reachable, wrap it as the trigger of a `dropdown-menu` listing them, and give that trigger its own accessible name.
5. The default separator is a chevron. Pass children to `BreadcrumbSeparator` to use a slash; it is hidden from assistive technology either way.
6. Place the breadcrumb before the main landmark so a skip link skips it with the rest of the navigation.

## Heuristics

- Location, not path. The trail shows where the page sits, never how the person got there.
- The current page is the last item and is not a link. It is drawn in the foreground colour; ancestors are muted and turn to the link colour on hover and focus.
- Labels match the titles those pages show elsewhere.
- One line. The list wraps by default; on narrow viewports collapse the middle rather than wrapping to three lines.
- Separators are drawn at half alpha. They carry no meaning and are not read.

## Content

- Labels are the page or folder titles as named in `sidebar`, sentence case, no trailing punctuation.
- The root is the workspace or app name, not "Home", unless the root page is called that.
- A long title is truncated with an ellipsis at the end; the full title is on the destination.

## Accessibility

- `Breadcrumb` renders `nav` with `aria-label="breadcrumb"`. If two breadcrumbs exist on a page, give the second a different label.
- Separators are `role="presentation"` and `aria-hidden="true"`.
- `BreadcrumbPage` carries `aria-current="page"`. It also sets `role="link"` and `aria-disabled="true"`, so it is announced as a disabled link; the WAI-ARIA breadcrumb pattern treats a non-link current item as plain text with `aria-current` optional.
- Links are inline text with no padding, so their height is the line height (about 20px). Add vertical padding through `className` to reach the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size) wherever touch is possible.
- The global `:focus-visible` ring applies to links; the hover colour also appears on focus through that rule.
- `BreadcrumbEllipsis` is `aria-hidden`, which hides its own "More" text too; a trigger built around it must carry its own name.
