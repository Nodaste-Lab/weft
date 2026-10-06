---
related:
  - hud-list-row
  - list-block
  - pagination
  - skeleton
  - empty-state
---

# Table

## Purpose

Rows and columns for data the reader compares across rows: a roster, a list of sources with their counts, a ledger. It owns the native `table` elements as styled parts (`Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`), a horizontal overflow container, a density axis that tightens row height and cell padding together, and the hover and selected row fills.

## When to use

- Two or more columns of related values where the reader scans down a column or across a row.
- Data the reader sorts, filters or pages, with the controls outside the table.

## When not to use

- A list of items with a title, a meta line and actions. Use `hud-list-row`; a table of single-column rows is a list.
- A generated list of options inside a response. Use `list-block`.
- Page layout. A table is for data, never for arranging content.
- Cells the reader edits in place, or a grid navigated with arrow keys. This table is static; an editable grid needs the grid pattern, which is not in Weft.

## How to use

1. Wrap rows in `Table`, with `TableHeader` holding one `TableRow` of `TableHead` cells and `TableBody` holding the data rows of `TableCell`. `TableFooter` is for totals.
2. Add `TableCaption` naming the table ("Players in this session"). It renders below the table by default; keep it even when a heading is nearby, or point `aria-labelledby` at the heading instead.
3. Set `scope="col"` on header cells, and `scope="row"` on the first cell of a row when that cell names the row.
4. `density="compact"` on `Table` tightens every head and cell through context; do not set padding per cell.
5. Mark the selected row with `data-state="selected"`. Sorting, selection and paging are the consumer's; the table renders the result. Put `pagination` below the table, `skeleton` rows while loading and `empty-state` in place of the body when there are no rows.

## Heuristics

- Headers are the dense-info register: mono caps, muted. Under the casing rule table column headers keep caps while the rest of the surface is sentence case. The component does not transform case; the consumer passes the header in that register.
- Numbers right-align and use tabular figures; text left-aligns. Set the class on both the head and the cells of a column.
- Cells do not wrap by default. Long text truncates with a `title`, or the column gets a width and `whitespace-normal`; do not let one cell set the row height for the table.
- One hover fill and one selected fill, both from the muted token. Colour in a cell means the state of the value (a `badge`), never the row's owner.
- Wide tables scroll inside their container rather than the page. Above about six columns, consider which columns the reader compares and move the rest into a detail view.
- Empty cells show a dash. A column that is empty for every row is left out.

## Content

- Column headers: one or two words, a noun: "Player", "Role", "Updated". No units in the header when the cells carry them; a unit shared by the whole column goes in the header in parentheses.
- Cell text is sentence case; identifiers and paths are as written. Dates follow the surface's convention and do not mix formats in one column.
- Captions are a sentence fragment naming the data, sentence case, no full stop.
- Totals in `TableFooter` are labelled ("Total") in the first cell of the row.

## Accessibility

- Native `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td` and `caption` elements, so header and cell relationships are exposed without ARIA (WCAG 1.3.1 info and relationships). The consumer must add `scope` on header cells; the component does not default it.
- A caption or `aria-labelledby` gives the table a name; a screen reader announces it before the dimensions (WCAG 2.4.6 headings and labels).
- The overflow container scrolls horizontally. When no cell holds a focusable element, the consumer must make the container keyboard-scrollable (`tabIndex={0}` on the container with an accessible name), or keyboard users cannot reach the clipped columns (WCAG 2.1.1 keyboard).
- A sortable header is a real button inside the `th` with `aria-sort` on the `th`; the sort icon is not the only indicator.
- Row selection is a checkbox cell with a name that includes the row's label; the selected fill is not the only signal (WCAG 1.4.1 use of colour). The checkbox meets the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size); the compact head height is 32px and the compact row is as tall as its content, so a control inside a compact cell must keep its own 24px box.
- The row hover transition is a colour change only; no motion to reduce.
