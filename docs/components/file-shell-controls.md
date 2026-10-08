---
related:
  - file-header
  - button
  - input
  - navigation-actions
---

# File shell controls

## Purpose

Controlled presentation for file workspace rails/panels, presence, annotation modes, formatting commands, metadata and version history. These components contain no Avalandra service or fixture defaults.

## When to use

Compose FileShell around host-provided content. Use FileShellPanels for an exclusive rail and one panel; FilePresence for verified participants; FileVersionHistory for named snapshots and separate revision lineage; FileMetadata for applicable facts with honest unknowns.

## When not to use

Do not treat these controls as an editor, coordinate engine, permission service or persistence layer. Do not infer editing activity from session membership or use a saved-version list as revision lineage.

## How to use

Import from the package root and load components.css. Supply explicit panel purposes, localized labels, active state and onActiveChange. Panel purposes determine icons. Missing read access must hide protected content at the host boundary. Omit unavailable mutation callbacks and set canSave/canRestore from actual capabilities. FileVersionHistory returns a label to onSave; onRestore receives the selected saved version after confirmation. Both promises must resolve after host persistence and reject on failure. Key async views by file identity; callback closures must stay bound to the original file. The host must fence stale responses and recheck permissions server-side.

Use FileToolbar commands with explicit formatting purposes, disabled/pressed state and handlers. FileAnnotationModes is controlled; useFileAnnotationCursor derives cursor artwork from those same icons on the supplied surface. A sandbox iframe needs the mode/cursor propagated inside its own document.

## Heuristics

Open header menu and presence triggers use a primary tint and outline with ink text, rather than a solid primary-action fill.

Comments stays first in the rail. One panel at a time; switching opens the requested view even if another is active. Every panel has one title. Selection uses a blue tint and outline, with aria-expanded or aria-pressed. Presence is neutral and labelled; at five participants show three with an overflow roster. Unknown metadata is a dash; omit inapplicable rows. Version lists distinguish named saved versions, revision lineage, current and canonical revisions.

## Content

Applications supply labels, metadata, comments, participants, versions and revisions. Loading, denied and errors are explicit view states; ready with an empty list is an honest empty. Optional activity may be editing or idle only when the host actually has that data; otherwise activity is unknown. Error and pending messages are UI feedback, not proof of service execution. Restore creates a new current revision and preserves history; the host must enforce that semantic contract.

## Accessibility

The rail precedes the content and panel in reading and focus order at every width; on desktop it is positioned at the right with CSS.

Mouse activation keeps focus on the clicked control; keyboard activation moves focus into the panel. Focus movement does not scroll the page.

Panel opening/switching moves focus to its labelled region. The panel is a persistent region, not a dismissible layer. Escape is reserved for the content editor and for transient controls inside the panel. The rail control toggles the panel; closing it keeps focus on that control. Shift+Tab from the panel returns to the rail. Rail tooltips match accessible labels. Restore is a visible keyboard-accessible action and requires explicit confirmation. Pending operations suppress repeat submission and retain data on rejection. All controls meet a 44px target. Check responsive stacking, themes, screen readers and iframe focus in the actual application.

### Host content and panel visibility

Focus uses preventScroll to avoid unexpected page jumps. With tall content on narrow layouts, the application must ensure the focused panel is visible, using a bounded content viewport or scrolling the panel into view only when necessary. 
