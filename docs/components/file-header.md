---
related:
  - input
  - breadcrumb
  - button
  - dropdown-menu
  - text-field
---

# File header

## Purpose

Shared file chrome across documents, spreadsheets, presentations, images and other file types. Presents the file title, optional location, persistence status and application-supplied actions. It does not contain an editor or know about services, organizations or permissions.

## When to use

Use above a file viewer or editor. Keep the same identity layout across file types; change the type label, decorative icon and available actions to match real capabilities.

## When not to use

Do not use for application navigation, list rows, collection headers or tool panels. Editor formatting controls belong in their own toolbar. A working status such as Draft or In review is separate from whether changes have saved; use the far-right working-status panel in the File shell template.

## How to use

```tsx
import * as React from 'react';
import { FileHeader, Button } from '@nodaste-lab/weft';
function Example() {
  const [title, setTitle] = React.useState('Product direction');
  return <FileHeader title={title} fileTypeLabel="Document"
    context={<span>Studio / Research</span>}
    onRename={setTitle} saveState="saved"
    actions={<Button type="button" onClick={() => window.alert('Example sharing action')}>Share</Button>} />;
}
```

Import the package component CSS. Omit onRename when renaming is unavailable. Omit saveState when persistence does not apply or is unknown. Supply saveState from actual application state: saved, saving, offline or error. statusMessage can replace the supplied text with more precise information; never claim local changes are safe unless the application really persists them. Actions and context accept composed controls such as Breadcrumb, DropdownMenu or buttons, each with their own accessible names and handlers.

Rename opens a labelled inline input with Enter to save and Escape to cancel. Enter saves; Escape cancels; leaving the title saves. The callback can return a Promise; resolve after success and update the controlled title. Rejection keeps the draft and shows a retryable error. Pending rename prevents repeat submissions. The application owns validation beyond a nonempty trimmed name, collisions, file extension rules and permission checks. Pass fileId when switching files without remounting; a changed identity clears the draft and ignores stale request results. Alternatively, key the header by file identity. The application must still bind each rename request to its original file.

## Heuristics

The title stays readable rather than becoming a permanently labelled form. The visible editable title remains available to keyboard and touch users. Keep primary actions visible and put secondary actions in a menu supplied by the application. Use a separate breadcrumb navigation landmark in context only when the crumbs navigate; plain location text should not masquerade as links. Allow titles to wrap; do not hide essential identity behind truncation. Actions wrap below identity on narrow screens.

Save state has text and an icon, never color alone. Saving animates only when motion is permitted. No status is invented by default. Omit irrelevant capabilities for a given file type. For image files, Download may be primary; for collaborative files, Share may be primary. These are application decisions, not built-in defaults.

## Content

Use the real title and a recognizable type label. An empty title displays Untitled but does not invent a stored name. Keep status text concise and accurate. Explain recovery with an application action when saving fails. The gallery’s file-action notices demonstrate callback boundaries; they do not perform real operations.

## Accessibility

The file header is a named group rather than the application banner landmark. The title defaults to h1; use headingLevel 2 through 6 when embedded below an existing page heading. The type is available as accessible text and an icon tooltip. Rename focuses and selects the input, preserves composition input, and restores focus to the title after Enter or Escape; saving on blur preserves the next control’s focus. Failed rename keeps focus in the field and associates a live error. During saving, the input is read-only so focus remains available; repeat submissions are ignored until the request settles. Applications must provide bounded request handling and recovery for service failures. Save status uses a polite live region that exists before changes. Do not turn the entire header into a live region. Icon-only action slots need explicit accessible names, and popup controls must manage their own focus. Test with keyboard, touch, reduced motion, zoom and a screen reader in the real file view.

The title itself is the rename button when `onRename` is supplied. Enter or Space starts editing. The file-type icon exposes its label on hover and keyboard focus; the same type remains available as accessible text without a visible caption.

### Semantic icon contract

`fileShellIcons` (package root export) is the frozen, typed mapping for file chrome. Select icons by purpose; do not import or substitute glyphs in file-shell consumers. The contract covers file types, annotation modes, inspector panels, editor commands, file actions and save states. Review always uses the clipboard checklist; Working status always uses the Kanban glyph, including menu entries. Select element uses a pointer inside a selection box; Drop pin uses a crosshair with a center point to indicate coordinate placement. These are reserved meanings within file chrome, not restrictions on unrelated product contexts.

The semantic contract tests pin the agreed panel and annotation glyphs, reject reuse of a glyph for distinct purposes, and reject direct Lucide imports in the shell consumers. Changes to these assignments require an intentional contract-test update. Accessible control names remain mandatory; an icon alone cannot enforce the behavior of a downstream application.

The HTML preview derives its annotation cursor artwork from the selected semantic icon. Select element uses the selection-pointer cursor; Drop pin uses the coordinate crosshair. Only the content surface inherits the mode cursor; chrome controls retain normal cursors. Host renderers must carry the mode cursor into their content surface (and iframe document, when applicable).

### Template and Avalandra integration boundary

The File shell template is a design-system reference around a content placeholder. `FileHeader` and `file-shell-controls` are published primitives; `FileShell` is the registered React template; `FileHeaderExample`, `ParticipantsPreview` and `DocumentToolbarPreview` are gallery demonstrations, not production workspace components or service adapters. Their titles, presence, comment counts and save feedback are fictional. Local status, rename and annotation-mode changes do not persist to Avalandra.

The template exposes foundations, atoms, assemblies and the complete shell using shared implementations. The header action slot contains HTML annotation modes, presence and file actions; the right rail owns Comments, Working status, Review and File info. The document formatting toolbar stays inside the content column. No rich-text toolbar appears for HTML. Version history has a dedicated controlled panel, saved versions distinct from revision lineage, loading/empty/error/denied states, save labels and restore confirmation. Avalandra must supply actual data and persist callbacks.

Avalandra owns real file data, capabilities, persistence and recovery; editor commands and selection state; HTML element targeting, coordinate transforms and iframe cursors; comment anchors and threads; verified presence; review recording distinct from approval; complete metadata and revisions; destructive confirmations and end-to-end accessibility testing. Do not copy the fixture `saveState="saved"` into a live view. Unknown values remain unknown. An HTML content document cannot implement the application shell: Avalandra sanitizes scripts and interactive controls from those documents. Integrate the shell in the application layer around the renderer.

The site’s “Avalandra integration handoff” section is the local reviewable ownership checklist. Atomic specimens demonstrate composition and states, not proof of live service integration. This work remains uncommitted and unreleased until the repository’s release gates and consumer adoption process are completed.

File identity uses one shared `fileTypeIcons` mapping internally across navigation and the shell: text documents use AlignLeft; HTML files use PanelTop. FileHeader examples use the corresponding `fileShellIcons.document` and `fileShellIcons.htmlFile` aliases. Generic Files-collection iconography must not substitute for an individual file type.

Prefer fileKind for semantic identity; it selects the shared file-type icon and takes precedence over the legacy icon slot. Use an explicit NavigationAction.iconPurpose rather than relying on English-label inference; fallback inference remains for existing consumers.
