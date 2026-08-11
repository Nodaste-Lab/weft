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
it, typing withdraws it.

Blur commits exactly once, through `useCommitBoundary`; unchanged drafts close
without calling `onUpdate`. Every changed behaviour was guarded by a test
first and every guard verified by reintroducing the old behaviour — 5 probes,
5 CAUGHT.
