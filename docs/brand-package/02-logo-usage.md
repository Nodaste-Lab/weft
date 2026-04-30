---
linked_project: Heddle Branding
type: logo-usage
status: draft
updated: 2026-04-22
---

# 02 · Logo Usage

## The mark

The Heddle mark is a **rounded square tile holding an H glyph built from two loom-heddle shafts** — vertical bars with an eye in the middle — a direct nod to the metaphor in the name. The default rendering is **a royal-blue tile with a warm-yellow H**.

The H is **never re-typeset.** The glyph is a custom path; it is not an "H" set in any font. Always ship the SVG.

### Canonical files

Seven files cover every surface. Everything else can be derived from these.

#### Marks (square)

| File | Use for |
|---|---|
| `assets/heddle-mark.svg` | **Primary.** Blue tile + yellow H. Default for app icons, favicons, slide title-corners, docs site header (mark-only mode), CLI splash, anywhere the mark stands alone on a neutral surface. |
| `assets/heddle-mark-cutout.svg` | Single-color blue tile with the H punched out as transparent space. Use when you want the underlying surface to read through the H — colored backgrounds, photography plates, the macOS template-icon (auto-tinted by the OS). |
| `assets/heddle-mark-inverse.svg` | Yellow tile + blue H. For warm-dominant compositions, badge moments on cream sections, and anywhere you want the warm half of the palette to lead. |
| `assets/heddle-mark-on-blue.svg` | Cream tile + blue H. For use on `--weft-blue` slabs (CTA sections, marketing hero on blue), where the primary mark's blue tile would disappear into the background. |

#### Horizontal lockups (mark + wordmark)

| File | Use for |
|---|---|
| `assets/heddle-lockup.svg` | **Primary lockup.** Blue tile + yellow H + blue wordmark on transparent. Default for installer headers, product homepage, email signature, docs site header (lockup mode). |
| `assets/heddle-lockup-mono-blue.svg` | All-blue lockup, no tile, transparent. For on-cream / on-paper surfaces where the full-color lockup feels too loud — body of a blog post, footer signature on a cream document. |
| `assets/heddle-lockup-mono-cream.svg` | All-cream lockup, no tile, transparent. For blue slabs and dark surfaces. |

## The wordmark

The "Heddle" wordmark inside the lockup files is **drawn as vector paths** in a bold rounded geometric sans. It is **not a typeset rendering** of any web font — Fraunces, Inter Tight, JetBrains Mono, none of them. The wordmark is the lockup SVG.

If you need the wordmark in a context where you can't load an SVG (extremely rare — a CI badge, a plain-text fallback), use the `heddle-lockup-mono-blue.svg` at small sizes. Do not retypeset the word "Heddle" in any font and call it the wordmark.

## Quick usage map

- **macOS menu bar icon** → `heddle-mark-cutout.svg`, sized to the template-icon spec (18–22pt, auto-inverting).
- **Installer / onboarding hero** → `heddle-lockup.svg`, large, centered.
- **CLI splash / `heddle --version`** → ASCII rendering, or `heddle-mark.svg` if the terminal can render images.
- **Favicon / app icon** → `heddle-mark.svg` (rounded square works as an icon shape natively at 16×16+).
- **Docs site header** → `heddle-lockup.svg` on cream, or `heddle-lockup-mono-blue.svg` if you want a quieter treatment.
- **Slide decks** → `heddle-mark.svg` in the title-corner; `heddle-lockup.svg` on the title slide only.
- **Email signature** → `heddle-lockup.svg`, capped at 200px wide.
- **On a `--weft-blue` slab** → `heddle-mark-on-blue.svg` (mark) or `heddle-lockup-mono-cream.svg` (lockup).
- **On `--weft-yellow`** → `heddle-mark-inverse.svg` (mark) or `heddle-lockup-mono-blue.svg` (lockup).
- **On photography or any unknown surface** → `heddle-mark-cutout.svg`. Add a cream or paper plate behind it if the photo is busy.

## Clearspace

Reserve clearspace equal to **one-quarter of the mark's height** on all sides. Nothing — not text, not UI chrome, not another logo — should enter that margin. For the lockup, measure clearspace from the mark's height (not the wordmark's cap height).

```
 ┌────────────────────────┐
 │       clearspace       │
 │  ┌──────────────────┐  │
 │  │                  │  │
 │  │      [MARK]      │  │
 │  │                  │  │
 │  └──────────────────┘  │
 │       clearspace       │
 └────────────────────────┘
```

## Minimum sizes

| Context | Minimum | Variant |
|---|---|---|
| Digital display (mark) | 16 × 16 px (favicon), 24 × 24 px (nav), 18pt (menu bar) | `heddle-mark.svg` or `heddle-mark-cutout.svg` |
| Digital display (lockup) | 120 px wide — below this the wordmark loses legibility | `heddle-lockup.svg` |
| Print (mark) | 10 mm on the shortest edge | any mark |
| Embroidery / stamped | 15 mm — smaller and the H glyph muddies | `heddle-mark.svg` (stitched) |

Below 16px, drop to a glyph-only template variant — produce one as needed; not yet shipped.

## Do

- **Place on a calm background.** Plenty of air around it.
- **Pick the variant that contrasts with the surface.** Blue tile on cream, cream tile on blue, yellow tile on white. The mark should never fight its background.
- **Pair with the lockup only when "Heddle" needs to be read at a distance.** In tight UI, the mark alone is enough.
- **Use the cutout variant on photography or unknown surfaces.** It absorbs whatever is behind it.

## Don't

- **Don't re-typeset the wordmark.** It's a custom drawing, not a font setting. Always ship the SVG.
- **Don't recolor the tile or the H** outside the four canonical pairings (blue+yellow, blue+transparent cutout, yellow+blue, cream+blue). No green H, no purple tile, no third accent.
- **Don't stretch or skew.** The mark is a rounded square, not a rectangle. Lockup proportions are fixed.
- **Don't add effects.** No gradients, bevels, glows, drop shadows, outlines.
- **Don't place full-color logos on busy photography.** If the background has texture, use a plate or use `heddle-mark-cutout.svg`.
- **Don't co-lock-up with another logo inside the clearspace.**
- **Don't rotate.** The H is an H, not a decorative element.
- **Don't rebuild the glyph.** Always use the SVG. Never re-trace the H from scratch — the shaft / eye / heddle proportions are the brand.

## Menu-bar icon note (macOS)

`heddle-mark-cutout.svg` is the right starting point for the macOS template-icon spec — it's already a single-color shape on a transparent background, which is exactly what the OS wants so it can tint the icon light or dark automatically.

For the `*-template.png` raster fallbacks (22×22 at 1x, 44×44 at 2x), export from `heddle-mark-cutout.svg` rather than re-tracing the glyph.

## Color notes

The mark uses two brand-fixed colors:

- **Blue:** `#2563FF` — `--weft-blue`. Tile color on the primary mark and stroke color on the inverse and on-blue marks.
- **Yellow:** `#FFD866` — `--weft-yellow`. H glyph color on the primary mark; tile color on the inverse mark.
- **Cream:** `#FBF8F0` — `--weft-cream`. Tile color on the on-blue mark; stroke color on the mono-cream lockup.

These three are the only colors the logo uses. See [[03-color-and-type]] for how they sit inside the broader palette and why.

## Change log

- **2026-04-22** — Replaced the entire mark set. New canonical: `heddle-mark` + `heddle-mark-cutout` + `heddle-mark-inverse` + `heddle-mark-on-blue` + `heddle-lockup` + `heddle-lockup-mono-blue` + `heddle-lockup-mono-cream`. Wordmark is now path-drawn in the lockup SVG (was incorrectly described as Fraunces Bold 700). The previous near-black System A SVGs (`heddle-mark-primary`, `heddle-mark-inverted`, `heddle-horizontal-lockup`) are archived under `assets/_archive/`.
- **2026-04-20** — Original package created.
