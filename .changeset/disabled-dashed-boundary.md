---
"@nodaste-lab/weft": patch
---

**Three findings from the owner's visual review, all measured before fixed.**
(1) Disabled fields carry a **dashed boundary** in both layers — a dimmed
fill separated disabled from default by measurement but not by glance;
border-*style* is a longhand, so a disabled invalid field renders dashed
**and** red. (2) The plain-CSS **switch takes document B's proposal
geometry** — the track fills the 40×24 pill and the thumb is an 18px circle
inset 3px (the shipped shape was a skinny 18px band with a 12px thumb, a
visibly different control); disabled adds the dashed track bare and B's
lock glyph beside the label in the wrap, painted through a mask so it reads
a token. (3) A **hovered ghost button is the button**: deep-blue fill with
on-blue text — the base hover's (0,3,0) background was landing under the
ghost's ink text at 2.48:1, and the guard that now holds it waits out the
colour transition before reading, because its first run passed the broken
cascade by racing it.
(4) **Error is never colour alone** (WCAG 1.4.1): invalid input and textarea
carry a trailing alert glyph — stroke matched to the resolved `--weft-stop`
per theme and palette, guarded by a tone-invariant test — and the error
message leads with the same glyph in both layers (masked over currentColor
in plain CSS; an `aria-hidden` svg in `FormMessage`, so the accessible
description stays the copy). The select is the stated field-level
exception: its right edge belongs to the chevron, so the message glyph and
border carry its non-colour cue — asserted, not omitted.
(5) **An unavailable dropdown option is struck through** — `option:disabled`
takes `line-through` + muted in the plain layer, `SelectItem` the matching
`data-[disabled]:line-through` in React, and every select specimen ships an
unavailable option so the treatment stays measured.
