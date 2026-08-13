---
"@nodaste-lab/weft": minor
---

`InlineEditListRow` rides the commit boundary (component 1.1.0 → **2.0.0** — a
behaviour change, decided in proposals document C §5; prop surface unchanged).

Three behaviours changed, each away from a contract breach the old editing
state shipped: **Enter now inserts a newline** instead of committing (a
textarea's Enter is never a boundary — consumers relying on Enter-to-save
should note blur is the commit path); **an emptied value survives** — select
all, delete, leave commits `""` instead of silently restoring the previous
text, which was data loss with a tidy appearance; and **Escape offers a
discard instead of performing one** — the first press shows a visible,
`aria-describedby`-exposed offer and touches nothing, a second press performs
it, typing withdraws it, and an Escape inside IME composition belongs to the
IME. The draft otherwise commits **as typed**: no trimming, since Enter's
newline is now real input — all-whitespace normalizing to `""` is the one
exception.

Blur commits exactly once, through `useCommitBoundary`; unchanged drafts close
without calling `onUpdate`. Every changed behaviour was guarded by a test
first and every guard verified by reintroducing the old behaviour.

**On the version signal:** this is a breaking behaviour change at the
component level, mirrored as the component's 2.0.0 per AGENTS.md. The package
changeset stays **minor** deliberately: the package is 0.x, consumers pin
exact versions and adopt deliberately (AGENTS.md release flow step 4), and the
repo's own practice shipped the P2 control-height reflow and the P3
accessible-name change — both behaviour breaks — in the 0.3.0 minor. A major
changeset here would stamp 1.0.0, a stability declaration that is the owner's
to make, not a side effect of one component migration.
