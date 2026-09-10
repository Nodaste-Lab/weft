---
"@nodaste-lab/weft": patch
---

Document surfaces heuristics (docs and a doctrine test only). A new
`docs/brand-package/13-document-surfaces-heuristics.md` gives every W3
document-surface entry (weft#28–#49) its use cases, heuristics, pattern and
anti-pattern, with five foundations — the three channels as ruled (colour is
semantic only, never a person), casing on app surfaces, honest empties, one
panel at a time, keyboard / focus / touch — and eleven cross-cutting
anti-patterns from the DocT epic pass and the accessibility floor. AGENTS.md
gains an eight-rule "Document surfaces" section pointing at it. Rulings
recorded in place: `09-app-primitives` § Three channels and § Identity colour
and `04-design-system` Identity colour now state the 2026-09-06 semantic-colour
ruling (W4 does not ship the identity subsystem); the composer hints read the
2026-09-05 strings. The doctrine contract gains D10, asserting the new
document's structure. No token, class, prop or manifest change.
