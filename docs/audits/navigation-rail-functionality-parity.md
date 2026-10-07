# Avalandra sidebar functionality parity

Source baseline: `Nodaste-Lab/ccore2` origin/main
`c8a57cce6ecc88a259cc5e64f4eed74941ceab7d` (October 6, 2026).
This is a source comparison, not a deployed production acceptance test.

The source-linked 20-item checklist is rendered at every lab level under
**Avalandra functionality coverage — gaps and decisions**. Canonical entries
live in `site/app/pages/NavigationRailParity.tsx`; the page uses that list
verbatim. Each entry records current behavior, prototype coverage, and what
needs a decision. Browser-local per-item notes and Retain / Intentionally
remove / Redesign decisions do not themselves change the prototype or product.
No gap is assumed to be an intentional removal.

## Main unrepresented areas

- Space management: intentionally relocated to Settings (owner decision). Invite/add user, view users, sharing and export must remain available there; no rail menu is required.
- Organization switching: intentionally relocated to Settings (owner decision); preserve the switching flow there.
- Explorer category navigation is intentionally represented by the filter menu beside Search. Categories are preview navigation; live resource scope/data remains unconnected.
- Real route/anchor behaviors, saved file/Signals lens, tool-preserving Space
  switching, capability-driven destinations and scoped content.
- Right-click, long-press, F2, Shift+F10 and mobile menu drill-in/back.
- Drag/drop, actual sibling reorder, root/child paging, expand prefetch,
  asynchronous child errors and stale-response protection.
- Full creation dialogs (Space handle/description), action confirmation,
  validation, pending/failure recovery, permission and connector data.
- Live profile/email, account Settings destination, incomplete Space-list retry.

## Explicit behavior decisions

1. Today's Signals badge counts waiting assignments across accessible Spaces.
   The proposed two-counter row uses selected-Space fixtures. Resolve scope,
   waiting-versus-all meaning, and the new notification total.
2. Today's file list is Documents-only; Explorer substitutes its own categories.
   The prototype keeps files visible. Decide the new content policy.
3. Resize today restores width, defaults to 276px, clamps 220–480px, and uses
   16px arrows / 64px Shift-arrows. Prototype bounds/steps differ; width is
   part of saved lab options but not restored like the production width key.
4. Account email is omitted. Cross-Space copy and listening/per-file signal
   badges are proposals, not existing production behaviors verified here.

## Coverage boundary

Nested expansion, local root creation/rename, density, hover/focus, responsive
drawer and local resize are working demonstrations. Existing menu vocabulary
is largely represented; actions such as move, duplicate, versions, PDF, review,
transfer and removal announce preview messages and do not prove end-to-end
parity. Production retains its services; this audit identifies the UI contracts
and scenarios Weft must support before migration.

Owner follow-up: SearchField added between Space identity and Signals, with a shared Search atom. Local file-name results include collapsed descendants. Full-content/service search remains unconnected.

Owner follow-up: Space picker and Search/filter toolbar share outer insets. Placeholder is Search. Explorer filter replaces the pinned Explorer row; category selection remains a preview action.
