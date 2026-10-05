---
"@nodaste-lab/weft": patch
---

Fix the focus ring on select, dropdown-menu and context-menu popups. The global
unlayered `:where(...):focus-visible` ring in `css/weft-components.css`
outranked the layered utilities those primitives use for their own states, so
the listbox, menu and every active option painted the heavy ring during mouse
use. Popup parts now show only their `focus:bg-accent` fill, and keyboard focus
on the trigger still paints the ring.

Radix returns focus to a popup's trigger by script on close, which the browser
treats as keyboard focus even after a mouse choice. The select, dropdown-menu
and context-menu triggers now start a tiny modality tracker
(`src/ui/input-modality.ts`) that sets `data-weft-input-modality` on `<html>`
(`pointer` after a press, `keyboard` after a navigation key; lone modifiers,
Cmd/Ctrl/Alt chords and Escape do not count). While it reads `pointer`, those
triggers, links and buttons inside a context-menu trigger, and the select
trigger's `focus-visible:border-ring` border show their resting look.

Consumers that already carry a workaround can delete it. CSS-only consumers
(injected panel iframes) never run the tracker, so the attribute stays unset and
behavior there is unchanged.
