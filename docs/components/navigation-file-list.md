# Navigation file list

## Purpose

An importable file-list composition for the workspace rail. It owns nested native-list structure, depth, expanded branches, retained rows, paging controls, async feedback and drag visual states. Avalandra owns node data, permissions, routing and mutations.

## When to use

A nested document or folder list in WorkspaceNavigationRail's `files` slot. The navigation rail lab uses this same package implementation.

## When not to use

Do not use as an ARIA tree, a backend data loader, a mutation store or an Undo manager. It does not fetch, save, move or delete files by itself.

## How to use

Supply nodes with stable unique IDs, labels and optional children/hasChildren; controlled expandedIds and onExpandedChange; and renderRow(node, context). Context supplies depth, expanded, expandable and toggle. Render NavigationRow with hierarchical/depth and native NavigationRowLink destinations, plus independent disclosure and actions. The renderer is also the rename slot. Use NavigationFileRename for selected text, Enter/blank-name validation and Escape; own editing, validation messages and persistence in the application.

Supply state for the root and getChildState for remotely loaded branches, onRetry for failed loads, and hasMore/onLoadMore for server paging. Local pageSize is optional for fixtures; omit it for server-paged lists. selectedId and retainedIds keep loaded active/editing/focused rows and ancestors mounted across local pages. Keep the component mounted or keyed by Space as appropriate; stale request cancellation remains application-owned.

Enable drag only with canDrag and onDrop. isContainer determines inside-drop targets; Shift drops before. canDrop enforces additional permission rules. Descendant and self drops are rejected. onDrop receives source, target and placement; it does not mutate nodes. onReorder receives Alt+Up/Down requests; onMove receives Alt+M. Permissions must omit unavailable callbacks or reject changes in the application. Undo is an application-owned slot adjacent to the list; restore both data and focus there.

## Heuristics

Keep disclosure separate from opening. Use stable IDs across paging. Supply loading/error/empty labels and Retry/Show more labels in the product language. Children remain adjacent to their parent. Current destination and selected-file styling remain row-level product choices.

## Content

Node labels are full accessible names. Loading, empty and failure feedback is announced as status; errors may include Retry. Expose server failures and retry availability honestly. Never claim a local fixture operation saved to Avalandra.

## Accessibility

Nested lists use list/listitem, not tree/treeitem. Tab follows native row controls. useNavigationFileInteractions applies right-click, Shift+F10/Context Menu, F2 and cancellable touch long-press to the rendered row via supplied action/rename callbacks; it suppresses the click after a consumed long press. Apply it to the visible row, not the ancestor wrapper. Use NavigationActions for menu focus and NavigationFileRename for editing. Alt+Up/Down and Alt+M are optional keyboard alternatives to dragging. Consumers must announce reorder outcomes, recover focus after mutations and validate permissions. Drag indicators include forced-color treatment. Run manual screen-reader and touch acceptance before product cutover.

The module contains a component family; the prop snapshot merges their surfaces. Use the generated TypeScript declarations for each export. Child nodes carry the same consumer type as roots. Selection retention applies to loaded rows under controlled expanded ancestors; the application expands those ancestors when opening a selected file.
