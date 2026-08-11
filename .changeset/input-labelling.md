---
"@nodaste-lab/weft": minor
---

Give Weft a labelling system: a stated ladder with a working route at every rung (P3 of the input design system).

**`.weft-sr-only` exists.** Weft had no visually-hidden utility, and that absence is what produced this ticket: every control needs an accessible name, the only route Weft offered was a visible label, so an accessibility requirement silently changed the board rail's visual design and nobody made a decision. Built on `clip-path`, never `display: none` or `visibility: hidden` — both of those remove the element from the accessibility tree along with the layout. `.weft-sr-only-focusable` reveals on focus, for skip-link-style content.

**Field labels and group legends are sentence case, and that is an accessibility fix wearing a typographic hat.** The accessible name is computed from *rendered* text, so `text-transform: uppercase` did not restyle the label — it rewrote the name. Markup reading "Project name" was exposed as "PROJECT NAME"; a legend reading "Retention policy" as "RETENTION POLICY". Scope is the input surface only (decision 6): `.weft-eyebrow`, `.weft-pill` and the React primitives keep their uppercase. The mono voice survives because both classes set the family explicitly — verified inside the injected panel frame, not just on the page.

**A placeholder is never a name, and the rule is now page-wide.** Every control on the specimen page carrying a placeholder is checked, not just the one demonstrating the rule. This is the case a tool-based check will not catch: axe lists a placeholder-named control under *passes*.

**`aria-label` is sanctioned for icon-only controls and nothing else.** The plan left this open; it is settled here. An invisible name on a text input cannot be verified by the person using the surface and drifts from its visible context — and now that `.weft-sr-only` exists, a real label costs only markup.

Four more entries come out of `tests/contract/known-defects.ts`. No visual baseline moved.
