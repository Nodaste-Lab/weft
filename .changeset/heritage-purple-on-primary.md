---
"@nodaste-lab/weft": patch
---

Fix white-on-light-violet controls in the dark `heritage-purple` palette.

That block lifts `--weft-blue` to violet-300 (`#c4b5fd`) and correctly sets `--primary-foreground` to dark ink — the flat shadcn token the React primitives read. The `--weft-on-blue` tier, which is what the plain-CSS component layer reads, went on inheriting white from the light block. So one palette shipped a React button at 9.9:1 and a `.weft-btn` at **1.85:1**, with the plain-CSS layer that a sandboxed panel iframe receives being the broken half. The same white also painted the checked radio dot and the checked-checkbox tick.

The palette's own comment already stated the correct value. The whole `--weft-on-blue` tier is now declared in that block, so every consumer corrects at once, plus a palette-scoped override for the checkbox tick — a data-URI whose stroke cannot read a token, the same shape of problem as the select chevron.

Guarded generally rather than for this palette: `contrast-contract` now checks `--weft-on-blue` against `--weft-blue` in **every** palette block that redefines the primary, so a new palette cannot repeat it by being forgotten.
