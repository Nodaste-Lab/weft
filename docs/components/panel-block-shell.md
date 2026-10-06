---
related:
  - card
  - settings-module-shell
  - recap-section-shell
  - collapsible
---

# Panel block shell

## Purpose

The outer chrome for one block inside a composed panel: a bordered section with a title strip, an optional collapse toggle, an optional selection ring, a right-hand actions slot and a padded body. `seamless` drops the border and body padding for a full-bleed list; `headless` drops the strip. It owns the strip, the ring and the padding, not what the body holds.

## When to use

- Blocks that a runtime or a builder composes into a panel: a stats block, a filter block, a list block.
- Blocks that can be selected (in a builder) or collapsed (by the reader).

## When not to use

- A neutral container outside a composed panel. Use `card`.
- A settings module with an eyebrow, a description and a footer. Use `settings-module-shell`.
- A section in a recap rail with a count. Use `recap-section-shell`.
- A single disclosure around inline content. Use `collapsible`.

## How to use

1. Render `PanelBlockShell` with `title` and the body as children.
2. Add `collapsible` and, optionally, `defaultCollapsed`. When `title` is not a string, pass `sectionLabel` so the toggle gets a name. `activeCountText` ("3 active") appears after the title and in the toggle's name.
3. Put actions in `headerRight`.
4. For builder selection, set `selected` and `onSelect`. A click anywhere on the section calls `onSelect`; the toggle stops propagation.
5. Use `seamless` when the body is a list that owns its own padding; `headless` for a block with no strip; `customHeader` to replace the strip entirely. `bodyClassName` and `headerClassName` adjust the slots.

## Heuristics

- The title is the block's noun. It truncates on one line, so keep it to one or two words.
- A collapsed body is unmounted, not hidden. Do not keep form state only inside it.
- Selection is a state (`data-selected`) drawn as the accent ring. The ring is how it is drawn, not the fact.
- Actions in `headerRight` that appear on hover also appear on `:focus-within`.
- A headless block has nothing to name it. Put it directly under a block that does.

## Content

- Titles are short noun phrases. Write them in sentence case; the primitive sets them in uppercase with tracking, which is the dense-info register. The 2026-09-01 casing ruling places app-surface section headers in sentence case, so the drawn casing is a change ticket, not a licence to author in caps.
- `activeCountText` is a count plus a lowercase word ("3 active", "2 selected").

## Accessibility

- Ships: the collapse toggle is a real button with `aria-expanded`, `aria-controls` pointing at the body and a name of the form "Collapse Filters, 3 active". The chevron and the inline count are hidden from assistive technology because the name already carries them.
- Pass `sectionLabel` whenever `title` is a node, or the toggle is named only "Expand" or "Collapse".
- `onSelect` fires from a click on a `<section>`, which has no keyboard equivalent. Provide one: a named button in `headerRight` that selects the block, carrying `aria-pressed` for the selected state.
- The toggle's hit area is the text line inside a 32px strip. Keep it above the 24px floor (`--weft-touch-target`) by not reducing the strip padding.
- The global focus ring applies to the toggle and to any control in `headerRight`.
