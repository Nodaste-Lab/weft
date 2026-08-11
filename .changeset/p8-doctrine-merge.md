---
"@nodaste-lab/weft": patch
---

**P8 — the heuristics are doctrine, and doctrine is gated.** The eleven input
heuristics merge into `04-design-system.md` § Form inputs as the operative
contract, with `12-input-heuristics.md` shipping alongside as the canonical
record of each rule's provenance — SC/R/C tags, original wording, and eight
amendments (A8 is new: `scroll-padding-top` on `html` alone does nothing when
a panel body scrolls; the surface marks its scrollport). Heuristic 4 merges
**without** its final sentence, held for the deferred asynchronous follow-up
— an acknowledged gap beats a rule known to be unenforceable. The class-name
drift is settled the only possible direction: the document now teaches the
shipped `weft-`-prefixed names, and the read-it-with-a-prefix disclaimer is
gone. The 05-accessibility contrast audit gains the measured form-control
boundary table (3.48–3.61:1 painted, disabled exempt per 1.4.11 and held to
renders-distinctly instead). All of it is machine-checked from this release
on: `npm run test:doctrine` fails on a named class or token that does not
ship, superseded wording that returns, a lost source tag, a quietly-filled
open question, or a doctrine reason list that drifts from the shipped module.

Two parity corrections the doctrine gate's review surfaced ship with it:
`Textarea`'s floor now resolves through `--weft-textarea-min-h` (old fixed
4rem as the tokenless fallback), and `Switch` takes document B's designed
40×24 control box — it was 32×18.4, under the 24px target floor its own
parity record claimed. The choice-row cells are reclassified as documented
divergences (the row is a plain-CSS recipe; React composes rows through its
form primitives), and the parity matrix now says exactly that.

