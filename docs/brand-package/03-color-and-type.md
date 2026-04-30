---
linked_project: Heddle Branding
type: visual-identity
status: draft
updated: 2026-04-22
---

# 03 · Color & Typography

## Color philosophy

**Editorial warmth meets digital authority.** A warm off-white cream carries the resting surface — it reads as paper, not pixels. Near-black navy does the ink work. Two accent families, used with intent: **blue** carries voice and system authority (italic emphasis, section labels, full-bleed slabs, CTA pills); **yellow** carries moments (highlight marks, ghost numerals, italic accents on blue, badge pills). The rest is restraint: hard section cuts, hairline rules, generous whitespace.

## Core palette

### Neutrals

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0b1020` | Primary text, headlines. Near-black navy, not pure black. |
| `muted` | `#5a6485` | Secondary text, sub-labels, descriptive captions. A blue-cast slate, not neutral gray. |
| `rule` | `rgba(11, 16, 32, 0.12)` | Hairlines, dividers, card borders. 1px always. Ink at 12%, so it carries the palette warmth. |
| `cream` | `#fbf8f0` | Primary page background. Warm off-white, never pure white. |
| `paper` | `#ffffff` | Elevated card surfaces and alternating section bands that contrast cream. |

### Accents — blue family

| Token | Hex | Use |
|---|---|---|
| `blue` | `#2563ff` | Saturated royal blue. Italic emphasis in headlines, hyperlink underlines, full-bleed slab backgrounds, section labels (`01 / AUDIENCE`), CTA pills, the tile and wordmark in `heddle-mark.svg` / `heddle-lockup.svg`. |
| `blue-deep` | `#1b46c7` | Hover state for blue surfaces, pressed buttons. |
| `blue-ink` | `#0a1f5c` | Text on yellow surfaces — pill badges, highlighted words sitting on cream. |

### Accents — yellow family

| Token | Hex | Use |
|---|---|---|
| `yellow` | `#ffd866` | Warm gold. Highlight-mark underlines behind single words, italic accents on blue slabs, badge pill backgrounds (`DESIGN PARTNER PROGRAM OPEN`), the H glyph in `heddle-mark.svg`. |
| `yellow-soft` | `#fff4cd` | Ghost watermark numerals (01, 02, 03) sitting behind card content; gentle yellow fill for "you are here" rows. |

**Pairing rule.** Blue and yellow can sit together, but not as equals on the same element. On a blue slab, yellow does the italic accents. On cream, blue does the italic accents and yellow does the highlight mark. Text on a yellow surface uses `blue-ink`.

### Functional states

| Token | Hex | Use |
|---|---|---|
| `ok` | `#3A7A4A` | Success, synced, healthy |
| `warn` | `#D97706` | Caution, stale, blocked, needs review |
| `stop` | `#A8382B` | Failure, broken, destructive |
| `danger` | `#EF4444` | Error, threat, damage |
| `info` | `#60A5FA` | Hint, neutral status, character spotlight |

Functional colors are **tuned down**, not saturated alerts. Heddle doesn't shout.

**Dark-mode lift.** On the deep-navy paper used in dark mode, `warn` lifts to `#F59E0B`, `danger` to `#F87171`, `info` to `#93C5FD` so each role stays legible without losing semantic meaning. The `ok` and `stop` hold across modes.

**Caution-color history.** The earlier `#C39432` muted amber read as muddy on cream and didn't register at low alpha. Replaced with Tailwind amber-600 (`#D97706`) for stronger caution legibility. Verify against brand yellow `#FFD866` — the two should never blur at small sizes.

### Severity-row backgrounds

For status rows that need a soft tinted background (caution row in a list, threat-level row in combat, healed-row in a log), Heddle ships an alpha-tiered scale that pulls from the matching semantic color so a hue change propagates everywhere.

| Token | Resolves to | Use |
|---|---|---|
| `--hud-attention-bg-soft` | `warn` at 0.10α (light) / 0.14α (dark) | Caution row tint |
| `--hud-attention-bg-strong` | `warn` at 0.18α / 0.24α | Focused warning row |
| `--hud-danger-bg-soft` | `danger` at 0.08α / 0.12α | High-threat tint |
| `--hud-danger-bg-strong` | `danger` at 0.16α / 0.22α | Critical-threat tint |
| `--hud-positive-bg-soft` | `ok` at 0.10α / 0.14α | Healed / saved row |
| `--hud-info-bg-soft` | `info` at 0.10α / 0.14α | Informational row |

### Domain-encoding aliases

The Heddle app encodes a few domain-specific roles with a fixed semantic color so the meaning is documented in CSS rather than implicit in component code. Each alias resolves to a functional state above; the alias is the contract, the resolved value is the implementation.

| Alias | Resolves to | Encodes |
|---|---|---|
| `--weft-encoding-event` | `blue` (primary) | Beats, action timeline |
| `--weft-encoding-decision` | `warn` | Player choices, forks |
| `--weft-encoding-character` | `info` | NPC moments, character spotlight |
| `--weft-encoding-obligation` | `ok` | Promises, debts, IOUs |
| `--weft-encoding-mystery` | `warn` | Open threads, unresolved |
| `--weft-encoding-bulk` | `#A78BFA` (violet-400) | System batch operations (the one outlier — doesn't fold into the universal palette) |

## Contrast rules

- Body text on `cream` or `paper` uses `ink`; secondary text uses `muted`.
- Body text on `blue` uses `paper` (white) or `yellow` for accents — never `ink`.
- Text on `yellow` or `yellow-soft` uses `blue-ink`.
- `muted` is for **non-essential** text only — anything a user needs to read must meet WCAG AA against its surface.
- `blue` is **never used as body text.** It sets backgrounds, labels, CTAs, and italic accents.
- `yellow` is **never used for body text and never for labels.** It highlights, watermarks, and accents — nothing else.

## Typography

### Principle

Three type roles in deliberate tension. A **high-contrast editorial serif** carries voice. A **monospaced sans** carries system precision. A **humanist sans** carries running copy. The friction between them — literary warmth against technical rigor — is the brand.

### Display / Headline — high-contrast editorial serif

- Used for: hero headlines, section headings, card titles, pull-quote product names
- Category: modern high-contrast serif with bracketed serifs, prominent ball terminals, and an elaborate `&`
- Design target: **Freight Display**, **Canela**, **Tiempos Headline**, or **Editorial New** (licensed)
- Free web substitute: **Fraunces** (Google Fonts, variable) — closest open match for contrast and ball terminals
- Weights shipping: **700 Bold** and **900 Black** upright, plus **Italic** for emphasis words
- Fallback stack: `"Fraunces", "Freight Display Pro", "Canela", "Tiempos Headline", "Editorial New", Georgia, "Times New Roman", serif`
- Download:
  - Google Fonts (web + zip): https://fonts.google.com/specimen/Fraunces
  - Source repo (TTFs, variable + static): https://github.com/undercasetype/Fraunces
  - License: SIL Open Font License 1.1 — https://github.com/undercasetype/Fraunces/blob/master/OFL.txt

**Italic accent rule.** Italic words inside a headline carry voice — belief, aspiration, emphasis. On cream or paper, color them `blue` and drop weight to 300 so the contrast with the surrounding 400/500 upright reads as an inflection, not a shout. On a blue slab, color them `yellow`. Never plain ink.

**Highlight mark.** A single word can be marked with a flush `yellow` rectangle sitting behind the lower ~40% of the glyphs (a linear-gradient from yellow to transparent at the 38–40% mark). Extends a few pixels past on left and right. Use once per page, at most.

**Weight discipline.** The display serif lives in the 300–500 range on this site — not 700+. High contrast comes from the typeface itself, not from bolding it. The mark and wordmark are SVG, not typeset, so the serif never needs to go heavier than 500 anywhere on brand surfaces.

### UI / Mono — monospaced sans

- Used for: navigation labels, section labels (`01 / AUDIENCE`), CTA badge text, eyebrow / pipeline breadcrumbs, HUD strings, CLI output, code blocks, file paths, identifiers, footer meta
- Primary: **JetBrains Mono** (Google Fonts, free)
- Weights shipping: **400 Regular, 500 Medium, 700 Bold**
- Tracking: positive letter-spacing **0.05–0.18em** depending on size. Smaller = more tracked. Usually in ALL CAPS.
- Fallback stack: `"JetBrains Mono", "IBM Plex Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace`
- Download:
  - JetBrains official (full family, variable + static): https://www.jetbrains.com/lp/mono/
  - Google Fonts (web + zip): https://fonts.google.com/specimen/JetBrains+Mono
  - Source repo: https://github.com/JetBrains/JetBrainsMono
  - License: SIL Open Font License 1.1 — https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt

### Body — humanist sans

- Used for: paragraph text in cards, descriptive captions beneath section headings, the email/CTA panel, nav links, anything longer than a label
- Primary: **Inter Tight** (Google Fonts, free) — the tighter width carries the editorial-meets-technical tone better than default Inter
- Weights shipping: **400 Regular, 500 Medium, 600 Semibold, 700 Bold**
- Sizing: 17px default at 1.55 line-height; ledes 20–22px at 1.5
- Fallback stack: `"Inter Tight", "Inter", "Söhne", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`
- Download:
  - Google Fonts (web + zip): https://fonts.google.com/specimen/Inter+Tight
  - rsms.me (Inter family, includes Inter Tight): https://rsms.me/inter/
  - Source repo: https://github.com/rsms/inter
  - License: SIL Open Font License 1.1 — https://github.com/rsms/inter/blob/master/LICENSE.txt

### Wordmark

The wordmark is **drawn as vector paths** inside the lockup SVGs — a bold rounded geometric sans, custom-drawn specifically for Heddle. **It is not typeset from any font** (not Fraunces, not Inter Tight, not JetBrains Mono). Always ship the SVG.

Canonical wordmark files:

- `assets/heddle-lockup.svg` — blue tile + yellow H + blue wordmark. Primary.
- `assets/heddle-lockup-mono-blue.svg` — all-blue wordmark, no tile. For quieter on-cream treatments.
- `assets/heddle-lockup-mono-cream.svg` — all-cream wordmark, no tile. For blue and dark surfaces.

It sits beside the mark tile — blue tile, yellow H glyph — at ~140px wide in nav, scaling up for splash moments. Title case is intentional: the mark is the quiet part; the wordmark announces.

**Never re-typeset the word "Heddle" in any font and call it the wordmark.** If you land in a context that can't render an SVG (a CI badge, a plain-text fallback), use `heddle-lockup-mono-blue.svg` at small sizes. See [[02-logo-usage]] for the full canonical file set.

## Type scale

The scale flexes dramatically: hero is oversized by design. Sizes are in rem for web; pt equivalents for print.

| Token | Size | Line-height | Tracking | Typeface + weight | Use |
|---|---|---|---|---|---|
| `hero` | clamp(56, 8.5vw, 128) px | 1.0 | -0.02em | Serif 400 | Landing hero headline |
| `display` | clamp(48, 6vw, 82) px | 0.98 | -0.025em | Serif 400 | CTA statement, installer hero |
| `h1` / section title | clamp(36, 4.5vw, 60) px | 1.05 | -0.02em | Serif 400 | Top of section |
| `h2` | 42 / 2.625rem | 1.08 | -0.02em | Serif 400 | Secondary headlines |
| `h3` | 28 / 1.75rem | 1.15 | -0.02em | Serif 500 | Card titles, subsections |
| `body-lg` / lede | 20–22 / 1.25–1.375rem | 1.5 | normal | Sans 400 | Hero lede, section intros |
| `body` | 17 / 1.0625rem | 1.55 | normal | Sans 400 | Default body |
| `small` | 15 / 0.9375rem | 1.5 | normal | Sans 500 | Captions, maturity-row descriptions |
| `label` | 13 / 0.8125rem | 1.4 | 0.15em | Mono 500, caps | Section numbers, eyebrows |
| `label-sm` | 11 / 0.6875rem | 1.4 | 0.10–0.18em | Mono 500, caps | Stage labels, CTA pills, footer |
| `code` | 13–14 / 0.8125rem | 1.5 | 0.02em | Mono 400 | Inline + block code |

**Rule of thumb.** Everything serif is editorial and sits large; italic accents drop to weight 300. Everything mono is technical, small, and tracked out. Everything sans is in between, quietly carrying the reading load.

## Layout texture

- **Generous whitespace.** Density is not a virtue here.
- **Left-aligned text** almost everywhere. Centered headings only on hero / splash moments.
- **One dominant line** per view. If two things are fighting for the eye, one of them is in the wrong place.
- **Rules are hairline** — 1px at 1x, set to `rgba(11, 16, 32, 0.12)`. They whisper, they don't frame.
- **Hard section cuts.** No gradients between sections. Backgrounds cut sharply from cream → paper → blue → cream.
- **Thread backdrop.** A fixed-position pseudo-element lays down repeating vertical lines across the whole page — blue at ~9% opacity every 80px, yellow at ~18% opacity every 240px — plus a soft blue vertical gradient at ~6% opacity. Creates a warp-thread quality behind every section. Implemented once at the body level, not per section.
- **Ghost numerals.** Oversize italic serif numerals (`01`, `02`, `03`) at ~150px in `yellow-soft`, positioned top-right of cards and bleeding past the edge. The weight is 300 and italic; the color is `yellow-soft`, not `yellow`. They're texture, not labels.
- **Border-radius.** 999px (pill) on CTAs and badge pills. 4px on cards. 7px on the mark tile (baked into `heddle-mark.svg`). Zero on sections and layout containers.

## Iconography

- Line icons, 2px stroke, rounded caps
- Default stroke: `blue`. Fills and accents: `yellow`. Occasionally a dashed stroke in `yellow` to indicate broken or stale connections.
- No filled icons except status dots (`ok`, `warn`, `stop`) and the solid-yellow fill used inside a blue outline (the mark's pattern repeated at small scale).

## What not to do

- **Don't introduce a third accent.** Blue and yellow are the full set.
- **Don't use gradients** on surfaces — the one exception is the highlight mark (linear-gradient yellow-to-transparent at 38–40%).
- **Don't ship a new typeface** without updating this doc first.
- **Don't use pure black (`#000000`).** `ink` is `#0b1020`, always.
- **Don't use pure white for page backgrounds.** `paper` (`#ffffff`) is for elevated card surfaces and alternating section bands; the page rests on `cream`.
- **Don't bold the display serif past 500.** High contrast comes from the typeface, not the weight. The mark and wordmark are SVG — the serif has no role in logo rendering.
- **Don't re-typeset the wordmark.** "Heddle" is drawn as vector paths in the lockup SVG, not set in any font. Always ship the SVG.
- **Don't place blue and yellow at equal weight** on the same element — pairing rule applies.

## Open questions

- Dark-mode treatment: do blue and yellow hold their meaning on a dark surface, or does dark mode need its own accent calibration? (Not yet tested.)
- Print use: the palette is screen-first; print calibration is TBD.
- Accessibility pass: contrast ratios computed against `cream` but not yet audited against `paper`, `blue`, or `yellow-soft`.
