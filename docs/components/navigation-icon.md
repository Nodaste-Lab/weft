# Navigation icon

## Purpose

A semantic vocabulary mapping navigation purposes to glyphs, plus file/folder status sub-icons.
## When to use

NavigationIcon for a defined purpose; NavigationItemIcon for text/HTML files or folders with eligible statuses.

## When not to use

Never select a glyph for a different meaning because its shape looks suitable. Private Space and locked item are distinct purposes even though both use a lock.

## How to use

Read navigationIconDefinitions for label, meaning and notFor restrictions. Supply purpose and optional size. NavigationItemIcon renders listening only for text/HTML, locked only for text/HTML/folder. Other purposes suppress unsupported statuses. The API has no arbitrary glyph override.

## Heuristics

File type remains visible when it has children. Listening is not recording or playback. Locked is not merely disabled, read-only or connector-protected. Kanban uses three outlined swim lanes of different heights. Semantics are enforced by typed purpose selection and documented restrictions; code cannot infer the caller’s real-world intent.

## Content

Use the full label on the owning button, link, count or description. Statuses use Listening and Locked. Meanings and prohibited uses are exported as data for documentation and tooling.

## Accessibility

Base glyphs are decorative aria-hidden images; owners provide accessible names. Status sub-icons expose their names. Do not render an unnamed icon-only control. If status is already included in a row description, mark the redundant visual icon container aria-hidden.

### Semantic definitions

| Purpose | Meaning | Not for |
| --- | --- | --- |
| filter | Open Space Explorer resource categories from the search toolbar. | File actions, sorting, account settings or silently filtering file-name results. |
| file | The Files destination and its file collection. | Individual file types, folders, creation or generic pages. |
| text | A text file, including a text file with children. | Paragraph formatting, alignment actions or HTML files. |
| html | An HTML file, including an HTML file with children. | Browser windows, arbitrary layouts or text files. |
| folder | A folder that groups files and other folders. | A file merely because it has children, or a Space. |
| board | The Kanban board destination. | A generic table, columns control or layout switcher. |
| signals | Signals awaiting action, either a file-scoped count or a selected-Space total. | Notifications, loading, audio listening or generic activity. |
| notifications | Total notifications across the Space, shown only on the Signals destination. | Per-file badges, signals, listening status or alert severity. |
| explorer | The Space Explorer destination. | Folders, sharing, network connectivity or file nesting. |
| listening | A file is being listened to; a sub-icon on its file-type icon. | Microphone recording, audio playback, unread counts or permission state. |
| locked | An item's locked state; a sub-icon on a file or folder. | Private Space identity, disabled controls or read-only permissions without a real lock state. |
| private | The Private Space identity in the Space picker. | An item's lock state or generic security settings. |
| settings | The account settings action. | File actions, Space identity or expansion. |
| create | Create a file/folder or add a Space, with the control label specifying the object. | Expansion, selection, zoom or navigation. |
| actions | Open the named file or folder's actions menu. | Settings, creation, dragging or an unnamed generic menu. |
| expand | Reveal the children of a collapsed Files group, file or folder. | Opening the file, moving an item or indicating its file type. |
| collapse | Hide the children of an expanded Files group, file or folder. | Download, navigation or indicating its file type. |
| navigation | Open the responsive Space navigation drawer. | File actions, reordering or account settings. |
