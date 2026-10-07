# NavigationSearch

## Purpose

Compose a transparent Search field with an adjacent, independently named Explorer filter.

## When to use

Use in a navigation rail when the application supplies query state, results and filter behavior.

## When not to use

Do not use as a search engine or assume it fetches content. Full-content search, pagination and result navigation are application responsibilities.

## How to use

Accepts SearchField props, including required label, value/onChange, placeholder and onCommit. filter is an optional trailing React node. The forwarded ref addresses the input. toolbarClassName styles the outer toolbar.

## Heuristics

Use placeholder Search and a scoped label such as Search in Studio. Align the toolbar’s outer edges with the Space picker; keep a visible boundary and keyboard focus without adding a filled background.

## Content

Provide meaningful result names and ancestor paths in the application. Announce result count changes with a status region. Name the filter separately from Search.

## Accessibility

SearchField owns the hidden label and Clear search button. Clearing retains input focus and emits a change. Tab reaches the input, Clear when present, then the filter. The application controls Escape behavior and focus after opening a result.
