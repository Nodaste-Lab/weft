# Navigation rail icon semantics

The canonical definitions are in
[`navigation-rail-icons.tsx`](../../site/app/pages/navigation-rail-icons.tsx).
The Icon atom renders its documentation directly from that registry: select
**Icon purpose** to read the meaning and prohibited uses, or expand **Semantic
definitions for every rail icon** for the whole catalog.

## Contract

- Choose an explicit semantic purpose through `RailIcon`. Do not import a raw
  Lucide glyph into the navigation lab or choose a shape for aesthetic reasons.
- The registry exports semantic metadata; the glyph map stays private. Changing
  a glyph preserves its meaning. Changing a meaning requires a new purpose.
- File-row leading icons are limited to text/HTML. Folder rows keep the folder
  icon. A file with children retains its file type; disclosure is separate.
- Destination choices are limited to Files, Kanban board, Signals and Space
  Explorer. Choosing a destination icon updates its canonical destination label.
- Listening sub-icons are permitted only on text/HTML files. Lock sub-icons are
  permitted on files/folders. Unsupported combinations are not rendered, and
  their playground controls are disabled.
- Status badges describe state, never enforce permissions. Avalandra must supply
  actual listening and lock states; a read-only scenario alone does not mean
  locked. Counts are information, never hidden actions.
- Decorative glyphs are hidden from assistive technology. Their owning control,
  count or status supplies the accessible name. File types and status descriptions
  are associated with the file title.

## Reserved meanings

| Purpose | Glyph | Reserved meaning |
| --- | --- | --- |
| `filter` | SlidersHorizontal | Space Explorer category entry point beside Search; not file actions, sort or account settings |
| `file` | FileText | Files destination/collection; not an individual file type |
| `text` | AlignLeft | Text file; not text alignment or formatting |
| `html` | PanelTop | HTML file; not a generic browser/window/layout |
| `folder` | Folder | Folder; not every parent file or a Space |
| `board` | Columns3 | Kanban board destination; not column/layout controls |
| `signals` | Activity | Signals received; not notifications, listening or loading |
| `notifications` | Bell | Space notification total on Signals only; not per-file badges, signals or alert severity |
| `explorer` | Network | Space Explorer; not sharing or connectivity |
| `listening` | Ear | File being listened to; not recording or playback |
| `locked` | Lock | Item lock sub-icon; not Private Space or a disabled control |
| `private` | Lock | Private Space identity; not an item lock |
| `settings` | Settings | Account settings; not file actions |
| `create` | Plus | Create/add; object specified by its control label, not expansion |
| `actions` | MoreHorizontal | Named file/folder actions menu; not account settings or dragging |
| `expand` | ChevronRight | Reveal collapsed children; not open the file |
| `collapse` | ChevronDown | Hide expanded children; not download |
| `navigation` | Menu | Open responsive navigation; not file actions or reorder |

The selected-state marker, resize grip, avatar initial and borders are not
interchangeable icons. They retain their own state, resize, identity and
separation meanings. Radix's internal submenu arrows, picker checkmark and
modal close glyph belong to those primitives; the lab does not repurpose them.

## Enforcement and scope

Focused tests protect the exact purpose set, file/status compatibility, separate
Private/Locked meanings, semantic-renderer use and control restrictions.
The canonical mapping is site-only while the rail remains a lab. Migration must
carry this contract into the production rail. This cannot prevent unrelated
application code from importing Lucide directly; it prevents arbitrary icon
selection in this experience and provides a contract to review future additions.
