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
