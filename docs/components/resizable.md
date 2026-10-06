---
related:
  - scroll-area
  - sidebar
  - separator
  - sheet
---

# Resizable

## Purpose

A panel group, its panels and the drag handle between them, built on react-resizable-panels. The handle is a focusable separator that the pointer drags and the keyboard moves. It owns the handle drawing (1px rule, optional grip) and the group direction; sizes and persistence are props on the library parts.

## When to use

- Two or more panes a reader resizes to suit the task: a list beside its detail, an editor above a console.
- Split views whose layout should persist between visits.

## When not to use

- A rail that collapses to icons at fixed widths. Use `sidebar`.
- A static divider. Use `separator`.
- Overflow inside one fixed box. Use `scroll-area`.
- Narrow viewports. Stack the panes instead of splitting them (WCAG 1.4.10 reflow).

## How to use

1. Render `ResizablePanelGroup` with `direction="horizontal"` or `"vertical"` inside a container that has a size; the group is `h-full w-full`.
2. Put `ResizablePanel` children in it with `defaultSize`, `minSize` and, where a pane may close, `collapsible`. Give panels that mount conditionally an `id` and `order`.
3. Put `ResizableHandle` between panels. `withHandle` draws the grip.
4. Set `autoSaveId` on the group to persist the layout.
5. Give each handle an `aria-label` that names the pane it resizes.

## Heuristics

- Every pane has a `minSize` at which it is still usable. A pane that can shrink to nothing is a pane that disappears.
- One direction per group. Nest a group for a mixed split.
- The handle is a 1px rule with a 4px hit band, transparent until hover, stronger while dragging (the brand entry's handle rule).
- Below a breakpoint, stack the panes and drop the handles.
- Persist the layout so a reader's adjustment survives.

## Content

- Nothing visible. The handle's name reads "Resize sidebar" or names the primary pane.

## Accessibility

- Ships from the library: the handle is `role="separator"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-controls`, it is a Tab stop, and arrow keys move it (the window splitter pattern). The class draws a focus ring on `:focus-visible`.
- The consumer names each handle with `aria-label`.
- The drawn hit band is 4px. The library adds hit-area margins beyond the line (larger for coarse pointers than for fine), which brings touch above the 24px floor (`--weft-touch-target`, WCAG 2.5.8) but leaves mouse at about 11px. Widen with `hitAreaMargins` where panes are resized often.
- Pointer drag has a keyboard equivalent through the separator, so no extra control is needed (WCAG 2.1.1 keyboard).
