---
linked_project: Heddle Branding
type: design-system
name: Weft
status: draft
updated: 2026-04-28
---

# 04 · Weft — the Heddle Design System

Weft is the design system Heddle uses. This is the implementation reference — companion to `03-color-and-type.md`, which covers the foundations prose-style. Use this doc when building new pages or components; copy patterns, don't reinvent them.

**Figma file.** [Weft Design System](https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System) — every token below is wired into Figma variables with matching `var(--weft-*)` code syntax for Dev Mode handoff. Light + Dark modes flip per the same override rules documented here. Components live one-per-page with full token bindings.

**App surfaces.** This doc covers the marketing shell. For the Heddle application (dense UI, shadcn / Radix primitives, density modes), see [[09-app-primitives]] — it extends the system without forking the visual language.

## The `--weft-` prefix is load-bearing

Every CSS custom property Weft owns is prefixed `--weft-`. This is not cosmetic — it's a migration signal. Heddle has an older website built on the prior, un-prefixed token set. The prefix is how you tell at a glance which side of the line a file is on:

- `var(--weft-blue)` → new system, Weft-aware
- `var(--blue)` → old system, pre-Weft, needs migration

The two namespaces never share a name. There's no compatibility bridge — a page is either fully Weft or fully old. If you find a file that mixes them, it's mid-migration; finish it.

**Rule for new work.** Any new component or page must read tokens only through `var(--weft-*)`. If you need a token that doesn't exist yet, add it to `:root` with the `--weft-` prefix and document it here. Never reach for a raw hex or rgba.

## Principles

**Editorial serif meets technical mono.** The friction between a high-contrast serif (voice) and a monospaced sans (system precision) is the brand. Body copy in a humanist sans carries the reading load quietly between the two.

**Blue and yellow, never as equals.** On any given element, blue sets the ground and yellow does the accent, or vice versa. They are never in the same role at the same weight. Text on a yellow surface uses `blue-ink`; italic accents on a blue slab are yellow; italic accents on cream are blue.

**Hard edges. Hairline rules. Generous whitespace.** Sections cut sharply between cream, paper, and blue — no gradients between them. Dividers are 1px at 12% ink. Density is not a virtue.

---

## Tokens

Every visual decision on the site traces back to a token in `:root`. No hex codes, font-family strings, radii, transition durations, or rgba alphas are allowed outside this block. If you find yourself typing a literal, add a token first.

### Palette

```css
:root {
  /* Palette */
  --weft-blue:        #2563ff;                 /* saturated royal; CTAs, links, slab, section labels */
  --weft-blue-deep:   #1b46c7;                 /* hover state for blue surfaces */
  --weft-blue-ink:    #0a1f5c;                 /* text on yellow surfaces */
  --weft-yellow:      #ffd866;                 /* badge pill bg, accents on blue, logo mark H */
  --weft-yellow-soft: #fff4cd;                 /* ghost numerals, "you are here" fill */
  --weft-mark:        var(--weft-yellow);           /* text highlight behind .underline — tuned in dark */
  --weft-cream:       #fbf8f0;                 /* primary page background */
  --weft-paper:       #ffffff;                 /* elevated cards, alternating bands */
  --weft-ink:         #0b1020;                 /* text, headlines — near-black navy */
  --weft-muted:       #5a6485;                 /* secondary text, captions */
  --weft-rule:        rgba(11, 16, 32, 0.12);  /* hairlines, borders on cream/paper */
  --weft-rule-strong: rgba(11, 16, 32, 0.28);  /* input border on hover, emphasized dividers */
  --weft-stop:        #a8382b;                 /* error / validation — AA 6.27:1 on cream */

  /* Mode-invariant brand fixed colors — DO NOT flip in dark mode */
  --weft-brand-cream: #fbf8f0;                 /* cream that stays cream — mono-cream lockup, mark-on-blue tile */
  --weft-fixed-white: #ffffff;                 /* white that stays white — checkbox glyph, radio dot */
}
```

`--weft-stop` is the one semantic-status color Weft ships by default — used for form error borders, error-hint copy, and the "destructive" state where it's needed. Success/warn states aren't in the core token set; if you need them, add `--weft-ok` and `--weft-warn` following the `03-color-and-type.md` "tuned down, not saturated alerts" rule.

**Mode-invariant brand fixed colors.** `--weft-brand-cream` and `--weft-fixed-white` look like duplicates of `--weft-cream` and `--weft-paper`, but they're a different contract: they **do not flip** in dark mode. Use them only inside brand assets and component glyphs that must hold their color when the theme inverts — the cream lockup placed on dark surfaces (still cream, not ink), the white check inside a checked checkbox (still white, not paper-dark), the white dot inside a selected radio. The blue ground stays blue across modes, so the glyph on it must too. Reach for `--weft-cream` or `--weft-paper` for everything else.

### On-blue (light-on-dark alphas)

White-on-blue tints, pre-mixed. Use these anywhere text or borders land on a blue slab — never reach for a raw `rgba(255,255,255,x)`. The three text tiers are WCAG-calibrated: `--weft-on-blue` hits AA normal, `-muted` and `-soft` are AA-large-only and must only be used at ≥18pt (or ≥14pt bold).

```css
--weft-on-blue:           rgba(255, 255, 255, 0.95);  /* body copy on blue — AA normal (4.55:1) */
--weft-on-blue-muted:     rgba(255, 255, 255, 0.88);  /* secondary on blue — AA large only (4.13:1) */
--weft-on-blue-soft:      rgba(255, 255, 255, 0.78);  /* tertiary / decorative — AA large only (3.58:1) */
--weft-on-blue-rule:      rgba(255, 255, 255, 0.18);  /* outer ecosystem border */
--weft-on-blue-rule-soft: rgba(255, 255, 255, 0.15);  /* eco-cell dividers */
--weft-on-blue-dot:       rgba(255, 255, 255, 0.12);  /* radial dot overlay on slab */
--weft-on-blue-bg:        rgba(255, 255, 255, 0.03);  /* default eco-cell fill */
--weft-on-blue-bg-hover:  rgba(255, 255, 255, 0.08);  /* hovered eco-cell fill */
```

**Contract, not a suggestion.** If a text element on blue is smaller than 18px, it uses `--weft-on-blue`. The `-muted` and `-soft` tiers exist for 18px+ headlines, large subtitle text, and decorative roles only. When in doubt, default to `--weft-on-blue`.

### Backdrop + glass

The thread pattern and glass nav are built from these four tokens. Changing thread density means changing a token, not a selector.

```css
--weft-thread-blue:   rgba(37,  99, 255, 0.09);  /* vertical blue lines, every 80px */
--weft-thread-wash:   rgba(37,  99, 255, 0.06);  /* soft blue vertical gradient wash */
--weft-thread-yellow: rgba(255, 216, 102, 0.18); /* yellow vertical lines, every 240px */
--weft-glass-cream:   rgba(251, 248, 240, 0.78); /* sticky nav tint under blur(14px) */
```

### Typography

Three families loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
--weft-font-serif: 'Fraunces', serif;           /* voice — all headlines + display numerals */
--weft-font-mono:  'JetBrains Mono', monospace; /* system — eyebrows, nums, pills, footer  */
--weft-font-sans:  'Inter Tight', sans-serif;   /* reading — body + ledes                   */
```

| Role | Token | Use |
|---|---|---|
| Display / Headlines | `--weft-font-serif` | h1, h2, h3, h4, eco-name, flow-copy h3, cta-big, logo wordmark |
| UI / Mono | `--weft-font-mono` | eyebrow, section-num, pill, role chip, stage label, flow-diagram-title, cta-label, footer |
| Body | `--weft-font-sans` | body default, lede, card paragraphs, notes, flow-step-name, flow-step-desc |

#### Font downloads

For local install (designers in Figma, native apps, print, or anyone who can't pull from Google Fonts at runtime):

| Family | Google Fonts | Source repo | Direct |
|---|---|---|---|
| Fraunces | https://fonts.google.com/specimen/Fraunces | https://github.com/undercasetype/Fraunces | — |
| JetBrains Mono | https://fonts.google.com/specimen/JetBrains+Mono | https://github.com/JetBrains/JetBrainsMono | https://www.jetbrains.com/lp/mono/ |
| Inter Tight | https://fonts.google.com/specimen/Inter+Tight | https://github.com/rsms/inter | https://rsms.me/inter/ |

All three ship under the SIL Open Font License 1.1. The Google Fonts "Download family" button gives a zip of static TTFs; the source repos include variable axis files. See `03-color-and-type.md` for per-family weight + tracking notes.

**Italic / weight-300 rule.** Italic spans inside serif headlines drop to weight 300 and take a color — blue on cream, yellow on blue. This inflection is the brand's voice signature. Never leave italic accents at ink/default weight.

**Highlight-mark rule.** A single word may be flagged with a `--weft-mark` linear-gradient underline:

```css
background: linear-gradient(to top, var(--weft-mark) 38%, transparent 38%);
padding: 0 6px;
```

Use once per headline at most. The gradient-to-transparent at 38–40% reads as a marker, not a solid fill. Uses `--weft-mark` (not `--weft-yellow`) so dark mode can soften the fill without losing the marker gesture.

### Layout & Spacing

```css
--weft-wrap-max:    1240px;  /* max content width */
--weft-wrap-pad:    48px;    /* desktop gutter */
--weft-wrap-pad-sm: 24px;    /* ≤900px gutter */

/* Spacing scale — 4px base, fixed across density. Pick a step, not a pixel. */
--weft-space-1: 4px;
--weft-space-2: 8px;
--weft-space-3: 12px;
--weft-space-4: 16px;
--weft-space-5: 24px;
--weft-space-6: 32px;
```

| Token / rule | Value |
|---|---|
| `--weft-wrap-max` | `1240px` |
| `--weft-wrap-pad` (desktop) | `48px` |
| `--weft-wrap-pad-sm` (≤900px) | `24px` |
| `--weft-space-1` … `--weft-space-6` | `4 / 8 / 12 / 16 / 24 / 32px` |
| Section padding | `110px 0` (desktop), `80px 0` (≤900px) |
| Hero padding | `120px 0 100px` (desktop), `60px 0 80px` (≤900px) |
| CTA section padding | `140px 0` |
| Section-head bottom margin | `72px` (desktop), `48px` (≤900px) |

The `--weft-space-*` scale is the general-purpose gap/padding ladder (used by code-backed panels). It's fixed — density (`data-density="compact"`) tightens the control tokens above, not the spacing scale, so a step means the same thing in every context.

### Border radius

```css
--weft-radius-0:    0;
--weft-radius-chip: 2px;
--weft-radius-card: 4px;
--weft-radius-logo: 7px;
--weft-radius-pill: 999px;
--weft-radius-dot:  50%;
```

| Token | Value | Use |
|---|---|---|
| `--weft-radius-pill` | `999px` | Pills, chips, tags, CTA badges, role chips |
| `--weft-radius-logo` | `7px` | The blue H-tile beside the wordmark |
| `--weft-radius-card` | `4px` | Cards, maturity table, flow diagram, ecosystem grid, problems |
| `--weft-radius-chip` | `2px` | Micro chips (e.g. spacing-scale bars in the docs) |
| `--weft-radius-dot` | `50%` | The pulse dot inside `.pill::before` |
| `--weft-radius-0` | `0` | Sections, layout containers, hard edges |

### Motion

```css
--weft-dur-fast:    0.20s;   /* nav-link underlines, chip borders */
--weft-dur-base:    0.25s;   /* CTA email underline hover-grow */
--weft-dur-slow:    0.30s;   /* card lifts, maturity tints, eco-cell hovers */
--weft-dur-enter:   1s;      /* hero fade-up total duration */
--weft-dur-pulse:   2s;      /* .pill dot pulse cycle */
--weft-ease-out:    ease-out;
--weft-ease-in-out: ease-in-out;
```

| Name | Purpose | Definition |
|---|---|---|
| `pulse` | Status dot on `.pill` | `var(--weft-dur-pulse) var(--weft-ease-in-out) infinite`, opacity 1 → 0.4 → 1 |
| `fadeUp` | Hero staged entrance | `var(--weft-dur-enter) var(--weft-ease-out) forwards`, translateY(24px) → 0 + opacity 0 → 1 |
| `.d1`–`.d4` | Stagger delays | 0.10s / 0.25s / 0.40s / 0.55s |
| Hover transitions | Cards, links | `var(--weft-dur-fast)`–`var(--weft-dur-slow)` on color/transform/border |

### SVG color discipline

SVG `stroke=` and `fill=` presentation attributes don't accept CSS custom properties directly. Use inline `style=` instead, so icons still trace to tokens:

```html
<path stroke-width="2" style="stroke: var(--weft-blue)" d="..." />
<circle r="4" style="fill: var(--weft-yellow); stroke: var(--weft-blue)" />
```

Never hard-code a hex in an SVG inside a page component.

Decorative SVGs — icons whose meaning is carried by the adjacent heading — must ship with `aria-hidden="true" focusable="false"` so screen readers don't announce "image" as noise. Informational SVGs (diagrams, charts) need a `<title>` child instead.

### Accessibility tokens + rules

A small, explicit layer that makes the system usable by keyboard users, motion-sensitive users, and assistive tech. These aren't optional.

```css
:root {
  --weft-link:              var(--weft-blue);
  --weft-focus-ring-color:  var(--weft-blue);
  --weft-focus-ring:        0 0 0 2px var(--weft-cream), 0 0 0 4px var(--weft-focus-ring-color);
}

[data-theme="dark"] {
  --weft-link:              #5b87fd;          /* 5.71:1 on dark cream, 5.20:1 on dark paper, 4.86:1 on the fill-soft tint — AA normal */
  --weft-focus-ring-color:  var(--weft-yellow); /* yellow outer ring = visible against dark cream */
}
```

| Token | Role |
|---|---|
| `--weft-link` | Text accent — eyebrows, italic accents, inline links, hover borders. Never use raw `--weft-blue` for text. `--weft-blue` remains the surface/slab color; `--weft-link` is the on-cream/paper reader color. |
| `--weft-focus-ring-color` | The outer-ring color for the focus indicator. Brand blue on cream, yellow on dark — chosen to stay visible against each page background. Don't reach for this token directly; it's bound by `--weft-focus-ring`. Mirrors the `focus/ring-color` semantic in the Figma file. |
| `--weft-focus-ring` | Two-layer box-shadow: a 2px cream gap, then a 4px ring at `--weft-focus-ring-color`. The cream gap prevents the ring from competing with whatever's behind it. The indirection through `--weft-focus-ring-color` lets dark mode flip just the ring color without redefining the whole shadow value. |

**Focus rule.** Applied globally with `:where()` so component styles can override without `!important`:

```css
:where(a, button, [tabindex], input, select, textarea):focus-visible {
  outline: none;
  box-shadow: var(--weft-focus-ring);
  border-radius: 3px;
}
```

**Reduced motion.** The `.pill` pulse and hero `fadeUp` both collapse under `prefers-reduced-motion: reduce`. Meaning survives without the motion.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Skip link.** Every page ships a skip link as the first focusable element in `<body>`, pointing at `#main`. Off-screen by default, slides in on focus:

```html
<a href="#main" class="skip-link">Skip to main content</a>
<nav>…</nav>
<main id="main">…</main>
```

```css
.skip-link {
  position: absolute; top: -40px; left: 16px;
  background: var(--weft-blue); color: #fff;
  padding: 10px 16px; border-radius: 4px;
  text-decoration: none; font-weight: 600;
  font-family: var(--weft-font-sans); font-size: 14px;
  z-index: 9999;
  transition: top var(--weft-dur-fast) var(--weft-ease-out);
}
.skip-link:focus { top: 16px; }
```

**Landmark structure.** `<nav>` outside `<main>`, `<footer>` outside `<main>`. The hero + all content sections live inside a single `<main id="main">`.

**Touch targets (WCAG 2.5.8).** Interactive pills and toggles carry `min-height: 24px`. Inline nav links get `min-height: 24px` + 4px vertical padding at the ≤900px breakpoint.

**Toggle state (`aria-pressed`).** Any component that has an on/off state (the theme toggle is the canonical example) announces its state via `aria-pressed="true"|"false"`. The handler flips the attribute on every activation.

**Full contrast audit** lives in `05-accessibility.md` with every pair measured light + dark.

### Dark mode

Dark mode is a token override, not a second design. Flipping `document.documentElement.dataset.theme = 'dark'` remaps a small set of neutral/wash tokens; every component inherits automatically because everything already traces to the token layer.

**What flips:**

```css
[data-theme="dark"] {
  --weft-cream:       #0b1020;                       /* page bg = ink */
  --weft-paper:       #141a2e;                       /* elevated surface */
  --weft-ink:         #f4f1e8;                       /* text = warm off-white */
  --weft-muted:       #8b93b0;                       /* lightened blue-slate */
  --weft-rule:        rgba(244, 241, 232, 0.12);
  --weft-yellow-soft: #2a241a;                       /* warm-dark for ghost numerals */

  --weft-thread-blue:   rgba( 37,  99, 255, 0.18);
  --weft-thread-wash:   rgba( 37,  99, 255, 0.10);
  --weft-thread-yellow: rgba(255, 216, 102, 0.12);
  --weft-glass-cream:   rgba( 11,  16,  32, 0.78);

  --weft-mark:   rgba(255, 216, 102, 0.28);          /* translucent so off-white reads through */
  --weft-code-bg: #05080f;

  --weft-link:              #5b87fd;                  /* brighter blue for AA on dark cream, paper, and fill-soft tints */
  --weft-focus-ring-color:  var(--weft-yellow);       /* yellow outer ring = visible against dark cream */
}
```

**What stays fixed:** `--weft-blue`, `--weft-blue-deep`, `--weft-blue-ink`, `--weft-yellow`, the full `--weft-on-blue-*` scale, plus `--weft-brand-cream` and `--weft-fixed-white`. Brand accents read true in both modes; the blue slab is the same blue slab. The mode-invariant fixed colors hold their value so brand assets and component glyphs that anchor against the blue ground don't break when the theme inverts.

**Why these choices:**

| Token | Rationale |
|---|---|
| `--weft-cream` → ink-navy | The page background becomes the former text color — the brand's two poles swap roles. |
| `--weft-ink` → warm off-white (not pure white) | Preserves the warm, editorial feel; pure white reads clinical. |
| `--weft-yellow-soft` → warm-dark `#2a241a` | Ghost numerals must stay a whisper, not a glare. A warm-brown does what cream-yellow did in light mode. |
| `--weft-mark` → translucent `rgba(255,216,102,0.28)` | Solid yellow behind warm off-white is illegible. A low-alpha yellow reads as glow, not block. |
| `--weft-thread-*` alphas nudged up | Thread lines need slightly more opacity to stay visible against the darker ground. |
| `--weft-glass-cream` → ink-alpha | Sticky nav keeps its frosted-glass feel, tinted to match the new page. |
| `--weft-code-bg` → near-black `#05080f` | Code block needs to step *down* from `--weft-paper`, not sit on it. |
| `--weft-focus-ring-color` → `--weft-yellow` | The blue ring loses contrast against dark cream (3.88:1, fails 3:1 UI threshold for narrow elements). Yellow holds 8:1+ on dark backgrounds — visible without becoming the loudest thing on the page. |

**The toggle** lives in `.nav-meta` as a mono-caps pill button. It flips `documentElement.dataset.theme` and swaps its own label between "Dark" and "Light." No persistence — theme resets on reload. (If persistence is ever wanted, add a `localStorage` write on toggle and a read on page load; until then, default-light is the canonical state.)

**What to check when adding a new component.** If a new component reaches for a raw hex, white, or rgba — stop. Route it through a token. The dark mode test is: toggle the page, does the component read correctly? If not, the fix is in the token layer, not the component.

---

## Layout primitives

### `.wrap`

Content container for every section. Holds the max-width + gutter, and sits above the thread backdrop via `z-index: 1`.

```css
.wrap {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 48px;
}
```

### `.threads` — backdrop motif

Fixed full-viewport pseudo-element pair. Draws repeating vertical blue lines every 80px at 9% opacity and yellow lines every 240px at 18% opacity, plus a soft blue vertical gradient at 6%. Implemented once at the body level.

```html
<div class="threads" aria-hidden="true"></div>
```

Mounts before any section content. `pointer-events: none` so it never intercepts clicks. Solid-color sections (like `.what-section`) cover the threads naturally; cream-background sections let them show through.

---

## Components

> **Code-backed panels** can't use the React/Tailwind components below (they render in a sandboxed iframe). They get a curated, namespaced plain-CSS counterpart — `src/styles/weft-components.css` (`weft-card`, `weft-btn`, `weft-input`, `weft-pill`, `weft-table`, the full form set…), injected into the panel iframe by the runtime. It's lifted from this doc's component CSS and stays token-only. See `docs/panel-authoring/CODE_BACKED_PANEL_PACKAGE.md` → Panel components.

### Nav

Sticky top bar with backdrop blur and a `rgba(251, 248, 240, 0.78)` cream-tint fill. Holds the logo (left) and `.nav-meta` link cluster + `.pill` (right).

Spec:
- `position: sticky; top: 0; z-index: 20`
- `backdrop-filter: blur(14px)`
- `border-bottom: 1px solid var(--weft-rule)`
- Inner padding `18px 48px`, max-width `1240px`

### Logo

**Always ship the SVG.** The mark and wordmark are both drawn as vector paths — never typeset. Seven canonical files live in `assets/`: `heddle-mark.svg` plus three mark variants (`-cutout`, `-inverse`, `-on-blue`) and `heddle-lockup.svg` plus two mono lockups (`-mono-blue`, `-mono-cream`). See [02 · Logo usage](02-logo-usage.md) for the full canonical set, clearspace rules, minimum sizes, and per-surface variant mapping.

```html
<div class="logo">
  <img src="assets/heddle-lockup.svg" alt="Heddle" />
</div>
```

- `.logo`: flex wrapper for the lockup img.
- `.logo img`: `height: 40px; width: auto; display: block;` — scales the lockup to fit the nav. Below 120px wide the wordmark loses legibility; above that, the lockup breathes.
- Nav surfaces use `heddle-lockup.svg` (full color). On `--weft-blue` slabs switch to `heddle-lockup-mono-cream.svg`. On cream surfaces that need a quieter treatment, `heddle-lockup-mono-blue.svg`. In tight UI where the wordmark won't read, drop to `heddle-mark.svg` alone.

### `.pill` — status / announcement chip

Yellow pill with pulsing blue dot. Used for "design partner program open," "beta," or any ambient status signal. Mono caps at 11px / weight 600 / 0.05em / `blue-ink` text.

```html
<span class="pill">Design partner program open</span>
```

Padding `5px 12px`. The pulsing dot is a `::before` pseudo-element, 6×6px blue circle with the `pulse` animation.

### `.eyebrow` — section signifier with hairline

Mono caps section label, 12px / 0.18em / blue. Preceded by a 40px × 1px blue hairline.

```html
<div class="eyebrow">For teams beyond individual AI</div>
```

```css
.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--weft-blue);
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.eyebrow::before {
  content: "";
  width: 40px; height: 1px;
  background: var(--weft-blue);
}
```

### `.section-num` — section-head left column

The paired header pattern used at the top of every section. Mono caps number + label on top ("01 / Audience"), muted subtitle underneath. Sits in the left column of a 2-column section-head grid; h2 + any intro prose sit on the right.

```html
<div class="section-head">
  <div class="section-num">01 / Audience<span>who Heddle is built for</span></div>
  <h2 class="section-title">Orgs past individual AI, <span class="accent">stuck at the team level.</span></h2>
</div>
```

- Primary label: 13px / 0.15em / blue
- Subtitle span: `display: block`, 11px / 0.12em / muted, `margin-top: 12px`
- Grid: `grid-template-columns: 1fr 2fr; gap: 60px`
- On blue slab: label → yellow, subtitle → white/60

### Headings

All headings use Fraunces 500 with -0.02em tracking and 1.02 line-height by default. Variants:

| Class | Size | Weight | Max-width | Use |
|---|---|---|---|---|
| `h1.display` | `clamp(56px, 8.5vw, 128px)` | 400 | 13ch | Hero headline |
| `h2.section-title` | `clamp(36px, 4.5vw, 60px)` | 400 | 20ch | Every section top |
| `.flow-copy h3` | 42px | 400 | — | Flow-section lead |
| `.audience-who h3` | 34px | 400 | — | Audience column lead |
| `h4` (.problem) | 24px | 500 | — | Problem card titles |
| `.eco-name` | 26px | 500 | — | Ecosystem cell names |
| `.cta-big` | `clamp(48px, 6vw, 82px)` | 400 | — | CTA oversize |

**Accent patterns inside headlines.**

| Pattern | CSS | Use |
|---|---|---|
| `.italic` | `font-style: italic; font-weight: 300; color: var(--weft-blue);` | Italic inflection in h1 on cream |
| `.accent` | `color: var(--weft-blue); font-style: italic; font-weight: 300;` | Italic inflection in section-title on cream |
| `.underline` | Yellow linear-gradient to 38% | Highlight mark, one per headline |
| On blue slab | Italic accents flip to `var(--weft-yellow)` | `.what-section` headings |

### `.lede` — hero paragraph

The paragraph directly under the h1. 22px, 58ch max-width, muted color, 1.5 line-height, weight 400. `<strong>` inside a lede takes ink color and weight 600 — use it for the pivot phrase.

### `.hero-grid` / `.hero-stat` — maturity stat cells

Four-column grid of numbered stats under the hero. Border is drawn via 1px gaps + rule-colored grid background — a classic "one-pixel-gap border" trick that keeps borders internal. Stats 01–02 are default cream, stat 03 uses `yellow-soft` fill + `yellow` border (the "you are here" state), stat 04 is a blue card with yellow numeral + white text (the destination).

```css
.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--weft-rule);
  border: 1px solid var(--weft-rule);
}
.hero-stat { background: var(--weft-cream); padding: 28px 24px; }
.hero-stat .n { /* Fraunces 300 italic 44px, blue, -0.03em */ }
.hero-stat .l { /* 13px muted, 1.45 line-height */ }
```

Responsive: drops to 2 columns ≤900px.

### `.maturity` — staged-progression table

A bordered vertical stack of rows showing stage 01 → 04 with state variants. Lives inside `.audience-section` as the left column of a 2-column grid (`1.3fr 1fr`).

Row structure:

```html
<div class="maturity-row [dim|here|you]">
  <div class="stage">STAGE 01</div>
  <div class="desc">Title<span>Caption text</span></div>
  <div class="tag">solved</div>
</div>
```

| Variant | Visual |
|---|---|
| default | Cream fill, rule border-bottom |
| `.dim` | `opacity: 0.55` (past stages) |
| `.here` | `yellow-soft` bg, 3px yellow left-border, yellow tag with `blue-ink` text |
| `.you` | Blue fill, white text, yellow stage label, yellow tag |

Row grid: `80px 1fr auto` for stage / desc / tag. Padding `22px 26px`.

### `.role` — mono chip

Pill-shaped mono chips used for audience roles. 12px mono, `7px 13px` padding, cream fill, rule border, 999px radius.

Variant `.role.hl` flips to blue fill + yellow text (used to highlight the primary role).

### `.problem` — problem card with ghost numeral

Paper-fill card with a 150px italic ghost numeral bleeding off the top-right (`yellow-soft`), a 44×44 SVG icon, h4, description paragraph, and a pull-quote at the bottom separated by a dashed rule.

```html
<div class="problem" data-num="01">
  <svg class="problem-icon" ...>...</svg>
  <h4>Problem title</h4>
  <p>Description paragraph.</p>
  <div class="quote">"Quote from a user."</div>
</div>
```

Ghost numeral: `.problem::before` with `content: attr(data-num)`, Fraunces 300 italic 150px, `top: -20px; right: 24px`, `yellow-soft`.

Quote marks: `.quote::before` and `::after` with proper curly quotes in blue at 20px. Dashed 1px border-top at 18px padding-top.

Hover: `translateY(-4px)` + border flips to `var(--weft-blue)`. 0.3s transition.

### Problem icons (SVG)

Inline 44×44 SVGs with 2px stroke. Line icons only — no filled shapes except yellow accents and filled circles. Stroke is `#2563ff` (blue); accents are `#ffd866` (yellow), sometimes dashed for "broken" meaning. Match this vocabulary for any new problem icons.

### `.what-section` — full-bleed blue slab

Full-bleed blue section used for the "What it is" product explainer. Extends to the page edges with no top border. Has a radial-dot overlay (rgba-white dots at 24px spacing, 50% opacity) for subtle texture.

Overrides while inside:
- `.section-num` → yellow
- `.section-num span` → white/60
- `.section-title` → white
- `.section-title .accent` → yellow
- Body paragraphs → white/85 or white/75

### `.ecosystem` — 6-cell product grid

Inside `.what-section`. 3-column grid of 6 product cells separated by 1px `rgba(255,255,255,0.15)` borders. No outer spacing between cells — the divider lines do the work.

```html
<div class="ecosystem">
  <div class="eco-cell">
    <div class="eco-cat">Engine / 01</div>
    <div class="eco-name">Heddle <em>Drifter</em></div>
    <div class="eco-desc">Ambient change detection...</div>
  </div>
  ...
</div>
```

- `.eco-cat`: mono caps 10px / 0.15em / yellow
- `.eco-name`: Fraunces 500 26px / -0.02em; `<em>` gets yellow italic weight 300
- `.eco-desc`: 14px / 1.5 / white/75

### `.flow-inner` / `.flow-diagram` — step diagram

Two-column grid: narrative on the left, stepwise diagram on the right. Diagram is a paper-fill card with a mono caps title ("— scan → stage → review → approve → merge") and five rows separated by dashed hairlines.

Each `.flow-step` is a 40px / 1fr grid: Fraunces 300 italic 28px blue numeral + name/desc stacked on the right.

### `.cta-section` — closing two-column CTA

Final section with extra top/bottom padding (140px). Left: oversize serif statement with a yellow highlight span and italic blue accent. Right: mono label, large serif email link, note paragraph.

```html
<div class="cta-big">
  Teams &amp; AI cohesively delivering <em>together</em>,
  working from the right information, <span class="y">fast.</span>
</div>
```

The `.y` highlight uses a slightly bolder stop (40%, vs. 38% for the `.underline`) — subtle difference, but intentional for bigger display type.

`.cta-email` is Fraunces 500 at 28px, blue with a 2px blue underline. Hover flips underline to 6px yellow and color to `blue-ink` — the border growth is itself the interaction.

### Footer

Minimal two-item mono cap row: brand + year on the left, tagline on the right. 12px / 0.05em / muted / JetBrains Mono. Cream background with top rule.

### Form inputs

> **Measured specimen page: [input-specimens.html](input-specimens.html)** — every
> control, every state, on paper, cream and card, in both themes and all three
> densities. Generated by `scripts/generate-input-specimens.py`; it links the
> live `css/weft.css` and `css/weft-components.css` and nothing else, so it is
> the same surface a sandboxed panel iframe receives. `npm run test:contract`
> measures it.
>
> **One recorded gap remains:** the textarea floor is a hardcoded 96px and
> tracks no tier, owned by the sizing phase. The class names below are also still
> unprefixed while the shipped CSS is `weft-` prefixed throughout, which the
> doctrine merge settles. Everything else this section describes is measured:
> control height at every tier, disabled and read-only, a focus ring an author
> shadow cannot delete, description wiring, the required marker, the naming
> ladder, the 3:1 boundary, and focus not obscured.

Five controls ship in Weft v1: `.input` (single-line text), `.textarea`, `.select`, `.checkbox`, and `.radio`. All of them sit on a `--weft-control-fill` wash with a `--weft-control-border` boundary and a `--weft-radius-card` (4px) corner. States: default, hover (deepened border), focus (global focus ring), filled, error (`aria-invalid="true"` → `--weft-stop` border + red hint via `aria-describedby`), disabled, and read-only.

**Disabled and read-only are different promises, and they look different.** Disabled dims the whole control to 0.55 and takes `cursor: not-allowed` — it is not available. Read-only keeps full text contrast and changes only its fill to `--weft-control-fill-static` — the value is present and meant to be read, just not edited. Neither sets a border colour, deliberately: `.weft-input:disabled` weighs exactly as much as `.weft-input[aria-invalid="true"]` and is declared later, so a border colour there would silently outrank the error border on a disabled invalid field. `<select>` has no read-only in its content model, so that pairing does not exist for it.

#### Field wrapper

Every input sits inside a `.field` that stacks label + control + hint vertically. Labels are mono caps (`--weft-font-mono` at 11px, 0.12em, muted). Required fields get a `.req` asterisk colored `--weft-stop`. Error hints reuse the `.field-hint` with `.is-error`.

```html
<div class="field">
  <label class="field-label" for="email">Email<span class="req">*</span></label>
  <input class="input" id="email" type="email"
         aria-invalid="true" aria-describedby="email-hint" />
  <span class="field-hint is-error" id="email-hint">Needs a full address.</span>
</div>
```

- `.input` takes `height: var(--weft-control-h)` with no vertical padding, so the declared tier governs at every density — 44px marketing, 36px compact, 34px dense. It used to reach the tier through `min-height` while padding plus line-height pushed past it, which missed the tier by 2.4px at marketing and 7.6px at compact; only dense fitted, and only because its `pad-y` had been hand-tuned. Measured at every tier by `tests/contract/input-geometry.spec.ts`.
- Font size is 16px — iOS will zoom the viewport on focus for anything smaller.
- Border transitions at `--weft-dur-fast`. No hover scale, no color bleed, no ring.
- Focus state comes from the global `:where(...input...):focus-visible` rule — don't override per-input. **It is delivered twice, as an `outline` and as a `box-shadow` with identical geometry.** One carrier alone was deletable: `:where()` contributes nothing to specificity, so any page's `.shadow { box-shadow: … }` declared later replaced the ring outright, with no error and no gate. A shadow utility cannot touch `outline`; an author `outline: none` cannot touch `box-shadow`.

#### The boundary: a field has to look like a control

**At least one of border-against-surface or fill-against-surface reaches 3:1** (WCAG 1.4.11 non-text contrast), on every surface, in both themes, at every density, in every state except disabled — which the criterion exempts as an inactive component. Before this rule the field had neither: the border measured 1.30:1 light and 1.38:1 dark, and the fill was the same token as the card behind it, at 1.00:1.

**The border carries it; the fill is decorative.** That is a measured conclusion rather than a preference. Reaching 3:1 as a *fill alone* needs 45% ink over white, and at that fill the muted placeholder drops to 1.90:1 and fails text contrast — so fill-without-border, which heuristic 2 offers as an option, is not available in this palette. One border value covers both light surfaces: `--weft-control-border` measures 3.35:1 on paper and 3.15:1 on cream by calculation, 3.50:1 and 3.48:1 as painted.

**Hover deepens from a boundary that already clears the floor.** It used to go to `--weft-rule-strong`, which at 1.90:1 is now weaker than rest — hover would have been *removing* a boundary. Heuristic 3: hover may reinforce, never carry, because it does not exist on touch and does not exist for a keyboard-first user.

Two rules about *how* to change this, both learned by shipping the mistake:

- **Edit the declarations inside the existing `.weft-input, .weft-textarea, .weft-select` rule. Never add a selector.** A new selector ties on specificity with `.weft-input[aria-invalid="true"]` and, being later, wins — so every error field renders with the ordinary border while the diff looks correct.
- **Use longhands. Never the `background` shorthand.** It resets `background-image`, `-repeat`, `-position` and `-size`. On `.weft-select` that deletes the chevron in light and, because the dark theme's chevron rule restores the image but not the repeat, tiles a 12px glyph across the whole control in dark.

Both have permanent guards that assert painted pixels: `states/invalid-renders-distinctly` and `tests/contract/select-chrome.spec.ts`.

#### Focus survives the chrome

SC 2.4.11. A control scrolled to by an in-page navigation top-aligns, which on a surface with a sticky header lands it underneath — measured at 99% covered.

Weft cannot know the chrome's height, so **the surface declares it and the component layer turns it into scroll padding**:

```css
:root { --weft-sticky-chrome-h: 68px; }   /* your sticky header's height */
```

The default is `0`, so a panel iframe with no chrome is unaffected. The token is declared in its own bare `:root` block for a reason worth knowing: every other Weft token lives under `:root, :root[data-palette="weft"]`, which weighs (0,2,0), so the obvious `:root { … }` override in a consumer stylesheet would lose silently. At (0,1,0) it ties and, loading later, wins.

#### How a control gets its name

There is an order, and it is not a menu. Take the first rung that fits.

| Rung | Use when | How |
|---|---|---|
| **Visible label** | The default. Nearly always. | `.field-label` with `for`, or wrap the control |
| **Hidden label** | The surface genuinely cannot carry a visible label — a rail 258px wide, a toolbar of icons and one field | `.sr-only` on a real `<label for>` |
| **`aria-label`** | Icon-only controls, and nothing else | on the control |

**A placeholder is never a name.** It is a format hint. A control named only by its placeholder loses its name the moment the user types, and this is the case a tool-based check will not catch: axe reports it under *passes*, because a placeholder satisfies the accessible-name computation. `tests/contract/input-semantics.spec.ts` checks every control on the specimen page that carries a placeholder, not just the one demonstrating the rule.

**`aria-label` is sanctioned only for icon-only controls.** An invisible name on a text input cannot be verified by the person using the surface and drifts from its visible context as the copy around it changes — and now that `.sr-only` exists there is no cost to using a real label instead. The argument for it was that a hidden label plus a visible placeholder is more markup for the same outcome; that is true and it is worth the markup.

**`.sr-only` uses `clip-path`, never `display: none` or `visibility: hidden`.** Both of those take the element out of the accessibility tree along with the layout, which is the opposite of the point. `.sr-only-focusable` reveals on focus, for skip-link-style content.

```html
<label class="sr-only" for="rail-search">Search projects</label>
<input class="input" id="rail-search" type="search" placeholder="e.g. weft-board" />
```

**Labels are sentence case, and that is an accessibility rule wearing a typographic hat.** The accessible name is computed from *rendered* text, so `text-transform: uppercase` did not restyle the label — it rewrote the name. Markup reading "Project name" was exposed as "PROJECT NAME". The scope is the input surface only: `.eyebrow`, `.pill` and the React primitives keep their uppercase, and §03 keeps its rule everywhere outside a field.

#### Associating help and error text

The plain-CSS layer cannot produce ARIA, so what Weft ships here is a markup convention, and `scripts/__tests__/input-specimens.node.mjs` enforces it across the whole specimen page:

- a hint carries `id="<control-id>-hint"`; an error carries `id="<control-id>-error"`;
- the control lists them in `aria-describedby`, in reading order;
- the React layer wires the same relationship by construction in `FormControl`, so a consumer using the primitives gets it without writing ids.

A hint with an id that nothing points at is decoration. That is what shipped before this convention existed: `aria-invalid` was exposed and the description was empty.

**The required marker is real text plus the attribute** (heuristic 7, and it marks the minority — never both). A bare `*` lands inside the accessible name as punctuation while `required` stays false; the observed name was "RETENTION\*" with `required` false. Write the word, keep the space before it — the name concatenates text nodes, so without it you get "Retentionrequired" — and set the attribute:

```html
<label class="weft-field-label" for="retention">Retention <span class="weft-req">required</span></label>
<input class="weft-input" id="retention" required />
```

#### `.textarea`

Same styling as `.input` plus `min-height: 96px` and `resize: vertical`. Use for descriptions, messages, anything that wants more than one line.

```html
<textarea class="textarea" id="note" placeholder="A few sentences is plenty."></textarea>
```

#### `.select`

Native `<select>` with the platform caret stripped (`appearance: none`) and a single-stroke chevron re-added via inline SVG data-URL in the `background-image`. Ship two variants of the SVG — ink chevron for light mode, cream chevron under `[data-theme="dark"] .select`. Keeps the rest of the styling identical to `.input`.

```html
<select class="select" id="team-size">
  <option>Just me</option>
  <option>2–5</option>
  <option>6–15</option>
</select>
```

#### `.checkbox` and `.radio`

Painted on top of the native input with `appearance: none`. An 18×18 control sits inside a 44px `.checkbox-wrap` (or `.radio-wrap`) for touch-target AA. Checked fills the tile with `--weft-blue` and draws a crisp white glyph on top — an inline SVG check for the checkbox (centered via `background-position: center`), and a 10px white dot for the radio. White, not `--weft-cream` or `--weft-paper`, because the blue fill is theme-invariant — the glyph must be too. Grouped radios wrap in a `<fieldset class="field-group">` with a `<legend>` mono-cap label.

```html
<label class="checkbox-wrap">
  <input class="checkbox" type="checkbox" />
  Invite my team too
</label>

<fieldset class="field-group">
  <legend>Preferred contact</legend>
  <label class="radio-wrap">
    <input class="radio" type="radio" name="contact" />
    Email
  </label>
  <label class="radio-wrap">
    <input class="radio" type="radio" name="contact" />
    Slack
  </label>
</fieldset>
```

- Always label. `<label for="id">` wrapping, or a `<label>` wrapping the input directly.
- Always associate errors. `aria-invalid="true"` + `aria-describedby="<hint-id>"`. Never color-only error signaling.
- Always use `<fieldset>` + `<legend>` for radio groups. Don't fake a legend with a styled div — screen readers need the grouping semantics.
- Don't restyle focus per-input. The global focus ring is the single source of truth.

---

## Patterns

### Templates (whole surfaces)

A component is one control; a **template** is a whole reviewed surface — its
regions, grid, grouping semantics, and states. Templates live in
`css/weft-templates.css` (`@nodaste-lab/weft/templates.css`), are plain CSS so
sandboxed panel iframes can use them, and are registered under `templates` in
`manifest.json`. Current templates and their DOM contracts:
[11-panel-templates.md](11-panel-templates.md) — starting with `weft-board`, the
operator action board. Rendered specimens with design-system-coverage annotations:
[panel-templates.html](panel-templates.html).

### Two-accent headline

High-impact headlines carry two accented words: one italic-blue-300, one yellow-highlight-mark. Example: "Weaving **AI** into **human** workflows." Two accents is the maximum; one accent is fine; zero is allowed for quieter headings.

### Section-number convention

Every major section is labeled `NN / Name` where NN is a zero-padded two-digit index starting at 01. The `<span>` below carries a lower-case description. Indexes are visible in the UI, not hidden; they anchor the reader.

### Pull-quote inside a card

Quoted voice-of-user lines sit at the bottom of problem cards, separated by a dashed hairline, in Fraunces italic at 14px ink color. Quote marks are curly (" and ") in blue at 20px via `::before` / `::after`.

### Dashed rules for "soft" boundaries

Dashed `var(--weft-rule)` is used where content is related but separable — inside the flow diagram (between steps) and between problem body and quote. Solid hairlines are for section boundaries.

### Glass nav

Sticky, `rgba(251, 248, 240, 0.78)` background with `backdrop-filter: blur(14px)`. Keeps the thread backdrop faintly visible behind as you scroll. Never fully opaque.

### Staggered fade-up

Hero elements fade up in sequence using `.fade-up` + `.d1`–`.d4`:

```html
<div class="eyebrow fade-up d1">...</div>
<h1 class="display fade-up d2">...</h1>
<p class="lede fade-up d3">...</p>
<div class="hero-grid fade-up d4">...</div>
```

Only used in the hero. Don't animate other sections on load — it turns ambient into busy.

---

## Responsive

One breakpoint at 900px.

- `.wrap` and `.nav-inner` shrink gutter 48 → 24px
- `.hero-grid` collapses 4 → 2 columns
- `.section-head` collapses to a single column with 20px gap and 48px bottom margin
- `.audience-grid`, `.flow-inner`, `.cta-inner` collapse to single column at 48px gap
- `.problems-grid` and `.ecosystem` collapse to single column; eco-cell borders reset
- Section padding: 110 → 80px; hero padding: 120/100 → 60/80

---

## What not to do

- Don't introduce a third accent color. Blue and yellow are the full set.
- Don't use gradients on surfaces. The one exception is the yellow highlight mark (linear-gradient to transparent at 38–40%).
- Don't use pure black. Ink is `#0b1020`.
- Don't use pure white for page backgrounds. Cream is the page; paper is for cards and contrast bands.
- Don't bold the display serif past 500. The mark and wordmark are SVG, not typeset, so the serif has no role in the logo. Headlines live in the 300–500 range.
- Don't place blue and yellow at equal weight on the same element.
- Don't stack more than two accent patterns in one headline.
- Don't animate sections below the hero on load.
- Don't put body text on yellow or yellow-soft. Yellow is for highlights and badges.

---

## Enforcement in the product (HUD panels)

The HUD ships these rules as **lint gates**, not conventions: tokens-only (no raw
hex/`rgb()`/`rgba()`/`hsl()` outside the token files), component-first (no native
controls in panels), renders in light + dark, and version-pinned design-system
components with a gated public prop surface. A violation fails `npm run
linux:check` and CI. See `docs/panel-authoring/DESIGN_SYSTEM.md` for the
author-facing rules and the exact commands.

## Open questions

- Dark-mode rollout — the design system page toggles correctly; landing page hasn't been wired yet and needs `--weft-mark` tokenized before it can flip.
- Print adaptation — screen-first palette; CMYK values not derived.
- Accessibility pass — contrast ratios confirmed on cream; paper, blue, yellow-soft, and the full dark-mode palette not yet audited against WCAG AA for every text role.
- Icon library — problem icons are one-offs; a reusable icon set with a stroke/fill vocabulary hasn't been built.
- Dark-mode persistence — currently resets on reload. Intentional for v0 while the design settles; revisit once the palette is stable.
