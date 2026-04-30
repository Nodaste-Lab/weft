---
linked_project: Heddle Branding
type: visual-identity
status: draft
updated: 2026-04-28
---

# 07 · Illustration Style

The aesthetic foundations for Heddle illustration graphics. Companion to [[03-color-and-type]] (type/color foundations) and [[04-design-system]] (Weft tokens). The canonical prompts and per-asset templates — including the quality-control checklist and the per-asset prompt formula — live in [[08-image-generation-prompts]].

## Scope

This file governs **all illustration graphics** — hero illustrations, infographics, social graphics, diagrams, editorial illustrations, product-explainer art, presentation embeds, and any AI-generated visual asset shipped under the Heddle name. It does **not** govern UI / page components — the marketing site, app surfaces, form inputs, the flow diagram, the ecosystem grid, the hero stat grid, problem cards, and the rest of the Weft component library all continue to use the existing Weft system in [[03-color-and-type]] and [[04-design-system]] (saturated royal blue, warm gold, the thread backdrop).

If you're not sure which side of the line your work falls on: if it's a discrete graphic asset that could be exported as a PNG/SVG and embedded somewhere, this file governs it. If it's structural page chrome rendered from CSS + HTML on a Weft surface, [[04-design-system]] governs it.

The thread backdrop on the marketing site is structural texture, not an illustration. It stays. The "no abstract woven linework" rule below applies inside illustrations only.

The prompt templates that turn the rules below into image-gen instructions live in [[08-image-generation-prompts]].

## Core direction

Heddle illustrations should feel **literary, technical, evidence-based, and quietly authoritative.** Strong editorial typography combined with refined contemporary engraving. Archival plates from the future: precise, human, structured, trustworthy.

## Active illustration style

**Contemporary engraving / etching.** Old-world linework made cleaner and more minimal for a contemporary software brand. The style should feel timeless, literary, premium, intelligent, slightly archival, quietly technical, evidence-based, and human-reviewed rather than fully automated.

## Eliminated illustration directions

Do not ship illustrations in any of these styles:

- Abstract woven linework *(applies to illustrations; the site-level thread backdrop is unaffected)*
- Vintage technical manual illustration
- Generic SaaS illustration
- Corporate Memphis
- Glossy 3D
- Neon AI / cyberpunk graphics
- Cartoon robots or blob characters

The existing `assets/four-stage-graphics/heddle-stage-03-hand-off-woven.svg` and the bauhaus variants are out of brand under this direction. They should be archived in favor of refined-engraving versions; the `-refined.svg` four-stage set is the canonical reference until new engraving versions are made.

---

## Typography in illustrations

The full type system lives in [[03-color-and-type]] and [[04-design-system]] (`--weft-font-serif`, `--weft-font-mono`, `--weft-font-sans`). The notes below are about how to use that system **inside graphics** — which roles play which parts.

### Fraunces — voice, headlines, display numerals

Use Fraunces for main titles, stage names, display numerals, pull quotes, italic emphasis lines, big conceptual statements, hero typography, brand voice moments. Generously sized headlines, italics for short voice lines, numerals for numbered systems and maturity stages. Fraunces carries the emotional and literary tone.

If the exact font is unavailable in image generation, prompt for: *"An expressive editorial serif with soft curves, literary character, and strong display presence."*

### JetBrains Mono — system, labels, metadata

Use JetBrains Mono for eyebrows, small labels, section numbers, pills, footer text, technical annotations, diagram tags, source labels, status labels, timestamps, callouts. Use sparingly. Keep it small and precise. It creates the system-of-record feeling — anything that should feel like metadata, not prose.

If the exact font is unavailable in image generation, prompt for: *"A precise technical monospaced font with clean programming-terminal structure."*

### Inter Tight — reading surface, body

Use Inter Tight for body copy, descriptions, short ledes, explanatory text, captions that need easy readability, longer supporting copy inside graphics. Use when text needs to be read quickly. Keep line lengths short inside graphics. Avoid Fraunces for dense explanatory copy and JetBrains Mono for long reading passages.

If the exact font is unavailable in image generation, prompt for: *"A compact modern sans-serif for legible body copy."*

### Hierarchy in graphics

| Role | Family | Notes |
|---|---|---|
| Large title | Fraunces | Confident, editorial. Should feel like a publication title or institutional report heading, not playful or decorative. |
| Stage names | Fraunces | Title case or uppercase depending on layout. Pair with Fraunces display numerals. Keep the stage title dominant within each panel. |
| Stage numbers | Fraunces (display numerals) | Numerals can sit inside engraved circles, medallions, seals, or small archival marks. Avoid generic SaaS numbered badges. |
| Eyebrows + labels | JetBrains Mono | Small, precise, technical. Works well with thin rules, pills, or metadata rows. Should feel like a system label or archival tag. Examples: `--WEFT-FONT-SERIF`, `SOURCE`, `APPROVED`, `PROJECT`, `CANONICAL`. |
| Body copy | Inter Tight | Prioritize readability. Keep supporting copy calm and restrained. |
| Italic voice lines | Fraunces Italic | Short editorial asides. Brand voice, not technical copy. |

---

## Active graphic style: contemporary engraving / etching

### Visual description

Use:

- Fine ink linework
- Subtle crosshatching
- Delicate etched texture
- Archival paper grain
- Controlled imperfections
- Careful negative space
- Symbolic objects
- Sparse labels and metadata
- Small source marks, stamps, or evidence cues

Avoid:

- Thick cartoon outlines
- Airbrushed shading
- Slick vector gradients
- Overly rounded SaaS icon style
- Messy sketch lines
- Photorealism
- Glossy UI renderings
- Neon AI effects

### Mood

Calm. Intelligent. Trustworthy. Literary. Precise. Human. Structured. Quietly sophisticated.

### Relationship to typography

Illustration supports the type, it does not compete with it.

- Let Fraunces remain the dominant visual voice
- Use illustration as evidence, atmosphere, or explanation
- Keep labels small and sparse
- Use JetBrains Mono for technical labels
- Use Inter Tight for short readable descriptions
- Avoid filling the illustration with too much text
- Prefer quiet precision over spectacle

---

## Color palette — mapped to Weft tokens

The illustration palette uses the existing Weft token system wherever possible, with two new tokens added for colors with no equivalent. Color supports hierarchy, not decoration. **Most illustrations should work in one color first** — if it breaks in monochrome ink, the composition is doing too much.

### Reused Weft tokens

| Engraving role | Weft token | Hex | Notes |
|---|---|---|---|
| Warm off-white / cream | `--weft-cream` | `#fbf8f0` | The paper. Primary illustration ground. |
| Dark charcoal / ink black | `--weft-ink` | `#0b1020` | The ink. Primary linework color. Near-black navy, not pure black. |
| Dusty blue *(secondary)* | `--weft-muted` | `#5a6485` | The Weft "blue-cast slate" doubles as the engraving dusty-blue secondary. |
| Warm gray *(secondary)* | `--weft-muted` | `#5a6485` | Same token as dusty blue — the muted blue-slate carries both roles. |
| Restrained rust *(accent)* | `--weft-stop` | `#a8382b` | Dual-purpose token: it's the destructive/error state in product UI **and** the rust accent in illustrations. The hex is the same; the meaning is contextual. |

### New tokens (added for illustration use)

| Engraving role | New token | Suggested hex | Notes |
|---|---|---|---|
| Muted sepia *(secondary)* | `--weft-sepia` | `#8c6f4a` *(starting point)* | Warm muted brown. No Weft equivalent. Calibrate against AA contrast on cream during the [[05-accessibility]] pass. |
| Soft olive *(secondary)* | `--weft-olive` | `#6f7048` *(starting point)* | Calm muted olive-green. No Weft equivalent. Same calibration note. |

When these tokens land on the website (e.g., for editorial article art), add them to `:root` in the design-system stylesheet alongside the rest of the palette and document them in [[04-design-system]]. Until then, treat the hex values above as the canonical illustration palette.

### Pairing rules inside illustrations

- Most illustrations should read in one color first. If it survives in `--weft-ink` on `--weft-cream` alone, color is additive.
- Secondary colors (sepia, dusty blue, olive, warm gray, the muted slate) carry tonal variation, not emphasis.
- The rust accent (`--weft-stop`) is the only saturated color allowed and should appear sparingly — at most one rust mark per illustration.
- The bright Weft accents (`--weft-blue`, `--weft-yellow`) **do not appear in engraving-style illustrations.** They live on the marketing site and product UI; they're out of register with archival paper.

---

## Texture rules

Use:

- Paper grain
- Subtle ink texture
- Light etching marks
- Scanned-print softness
- Minimal distressing

Avoid:

- Heavy grunge
- Retro poster halftone overload
- Glossy glassmorphism
- Plastic 3D surfaces
- Neon glow
- Excessive aging or faux-vintage effects

The texture should feel refined, not nostalgic cosplay.

---

## Composition rules

Use:

- Generous negative space
- Centered symbolic objects for hero art
- Horizontal flow for process explanations
- Subtle asymmetry
- Clear focal point
- Small evidence details
- Quiet diagrammatic cues

Avoid:

- Dense full-bleed complexity
- Decorative clutter
- Random floating UI cards
- Overbuilt dashboard mockups
- Generic network diagrams
- Busy data visualizations

---

## Heddle metaphor library

Illustrations should reach for symbolic objects from this library before inventing new metaphors. The library is curated to keep the brand's visual language coherent across many graphics over time.

### Core metaphors

Archive · Record · Ledger · Loom · Thread spool · Filing cabinet · Index cards · Stamp · Compass · Instrument · Gate · Chain of custody · Source trail · Memory layer · Canonical path · Review chamber · Signal becoming structure

### Product concepts to visualize

Source material · Candidate updates · Human review · Canonical memory · Context propagation · Tool synchronization · Agent-readable knowledge · Decision provenance · Authority and approval · Redundant knowledge becoming one source

### Useful symbolic objects

Archival cabinet · Ledger book · Index cards · Approval stamp · Compass · Thread spool · Magnifying glass · Mechanical gate · Annotated plate · Paper archive · Technical instrument · Decision seal · Desk with documents · Book with connected pages

### Semantic object rules

Illustration objects carry product meaning. Do not substitute a nearby-looking metaphor if it changes the system story.

| Meaning | Use | Do not use |
|---|---|---|
| AI agent / automation / agent marker | A small sober mechanical agent: square head, simple eyes, compact body, optional antenna, engraved like an archival instrument. It should feel precise and system-like, not cute. | Bells, generic badges, faceless circles, cartoon robots, mascot characters. |
| Notification / alert / waiting on input | A bell, small signal burst, stamp, or status mark. Use only when the event is literally a notification, alert, or pending input. | Robot or agent icon unless the agent is the actor sending the notification. |
| Human review / teammate | Human portrait, hand, desk, approval mark, review chamber, or source card. Keep people specific enough to read as human, but not stock-photo-like. | Generic user avatars when a human reviewer matters. |
| Canonical record / source of truth | Ledger, record card, archive file, stamped document, source trail, or Heddle rail. | Fake dashboards, generic network diagrams, abstract UI panes. |

**Agent marker rule.** A robot is allowed when it represents an AI agent, but it must be restrained: engraved linework, small scale, neutral expression, no mascot energy, no glossy metal, no rounded toy proportions. The ban in this guide is on cartoon robots; it is not a ban on sober agent markers.

A note on the loom and thread imagery: a thread spool, a loom heddle, or a single drawn thread is in-brand for engraving illustrations because it ties back to the brand metaphor (the heddle holds threads in order). What's out of brand is *abstract* woven linework — fields of crisscrossed lines, weave-pattern fills, decorative warp-and-weft motifs inside an illustration. The site-level thread backdrop is a separate motif and is unaffected by this rule.

---

## Asset export rules

When an illustration is pulled out of a larger plate for reuse, preserve the artwork as a production asset, not just a crop.

- Prefer transparent PNG for generated engraving assets. Do not auto-trace to SVG unless the source was designed as vector; tracing usually damages crosshatching and paper-texture linework.
- Remove the paper ground from extracted PNGs so the asset can sit on Weft cream, paper, dark mode, or slide backgrounds without a visible rectangle.
- Keep generous transparent padding around the alpha content. No visible stroke, shadow, label, or texture should touch the file edge; use at least 40px padding for small assets and 80px for presentation-scale assets.
- QA on a checkerboard and on `--weft-cream`. The asset should look intentional on both.
- Keep a full composite source image alongside separated assets so future crops can be regenerated without compounding edge loss.
- If an illustration includes text, confirm the text still reads after extraction and resizing. If not, export a text-free version or rebuild the label natively in the consuming layout.

---

## Per-asset usage and approval

Per-asset prompt templates (general brand graphic, infographic, process graphic, provenance graphic, social graphic) and the full quality-control checklist live in [[08-image-generation-prompts]] — that's the canonical reference for both prompts and approval. Don't duplicate the checklist here.

---

## What not to do

- Don't use the bright Weft accents (`--weft-blue`, `--weft-yellow`) inside an engraving illustration. They live on the site, not on the paper.
- Don't fill an illustration with woven-linework fields. Threads as objects are fine; weave patterns as decoration are not.
- Don't introduce new accent colors. The illustration palette is closed: `--weft-ink`, `--weft-cream`, `--weft-muted`, `--weft-sepia`, `--weft-olive`, `--weft-stop`.
- Don't bold the display serif past 500. High contrast comes from the typeface, not the weight. *(Same rule as [[03-color-and-type]].)*
- Don't ship a new metaphor without checking the library first. Reuse before invention keeps the visual language coherent.
- Don't substitute a bell, stamp, badge, or source marker for an AI agent. If the graphic means "agent," show a restrained agent marker.
- Don't use the bauhaus or woven four-stage variants in `assets/four-stage-graphics/`. The `-refined.svg` set is canonical until engraving-style replacements ship.

---

## Open questions

- New token hex values (`--weft-sepia`, `--weft-olive`) are starting points and need calibration against AA contrast on `--weft-cream` and `--weft-paper` during the [[05-accessibility]] pass.
- Engraving-style replacements for the four-stage graphics haven't been produced yet. The `-woven` and `-bauhaus` variants in `assets/four-stage-graphics/` should be moved to `_archive/` once replacements ship.
- Print calibration of the illustration palette is TBD (same status as the rest of the brand).
- Whether the new tokens should ship in `:root` immediately or stay illustration-scoped until a website surface needs them.
