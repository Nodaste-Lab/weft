# Navigation rail layer alignment

The lab's geometry is defined in `site/app/pages/navigation-rail-contract.ts`.
Tokens displays the same density map that supplies CSS variables to the atom,
row and full rail previews (including the portaled drawer). Row gap/inset and
hierarchy indentation also use these variables. These local proposals are not
published `--weft-*` additions.

## Corrections

- Foundations now distinguish actual 4px row spacing and 8px nesting from general
  spacing tokens, and label immediate disclosure versus overlay motion honestly.
- Icon/Avatar descriptions identify the current semantic registry and Weft
  primitive instead of claiming the examples are Avalandra custom controls.
- Count atom demonstrates scoped file signals and both aggregate Signals counts
  using the same renderer as Rows and Rail. File notifications remain hidden.
- Count variable documentation uses ink, matching the contrast override.
- Files parent now follows the shared row/target density geometry. Icon-only
  controls use Button size="icon" rather than the padded text-button size.
- Standalone disclosure/settings controls share rail target width/height; touch
  and drawer overrides keep 44px targets.

## Confirmed sizing decision

Navigation owns its 44/36/28px sizing. Generic row tokens remain 48/32/30px.
Publication is a separate package contract update. The lab shows this as confirmed.

## Decisions requiring product direction

| Collision | Current evidence | Recommended direction |
| --- | --- | --- |
| Document hierarchy | Existing guidance: one row control, arrow-key tree, 14/18px nesting; lab: separate disclosure/open, Tab lists, 8px nesting | Define distinct navigation-list pattern or deliberately revise document-tree guidance |
| Sidebar ownership | Rail resize, file hierarchy, 1024px drawer; Sidebar fixed width defaults/collapse/shared breakpoint | Compose a navigation template; consider configurable breakpoint/resize in Sidebar separately |
| Count badge contrast | Shared count uses muted; rail requires ink on interaction backgrounds | Decide global contrast fix versus explicit Badge treatment |
| Compact identity | Avatar 40px default/inherited type; rail 24/28px with 12/11px initials | Decide named Avatar sizes versus documented composition |

These decisions are visible in the lab under **Shared component decisions to
resolve**. No published primitive or token contract was changed during this
alignment pass. Any promotion must include component/package version intent,
snapshots and the repository's consumer gates.

Owner decision, October 6, 2026: navigation has its own sizing. This is resolved, not an open question.
