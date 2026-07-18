---
linked_project: Heddle Branding
type: accessibility-audit
name: Weft
status: remediated
updated: 2026-04-21
---

# 05 · Accessibility Assessment

A WCAG 2.1 audit of the Heddle landing page and the Weft design system, light mode and dark. Findings are prioritized by severity at the bottom — start there if you only have ten minutes.

The system has a strong baseline: real semantic HTML, a clean heading hierarchy, language declared, decorative backdrop properly hidden from assistive tech. The failures are concentrated in three places: the on-blue text scale, the absence of focus styles, and the motion + text-sizing contracts that haven't been written yet.

## Remediation status — 2026-04-21

This audit has been applied. Summary:

- **Resolved:** on-blue scale bumped to AA (0.95 / 0.88 / 0.78); `--weft-link` token added with a brighter dark-mode value (#4a7bff, 5.02:1 on dark cream); `--weft-focus-ring` token + `:focus-visible` rule on every interactive; `prefers-reduced-motion: reduce` global override; `aria-pressed` wired to the theme toggle; `<main id="main">` landmark + `.skip-link` added to both pages; decorative `.problem-icon` SVGs marked `aria-hidden="true" focusable="false"`; `.pill`, `.theme-toggle`, `.nav-meta a` padded up to ≥24px AA touch target.
- **Deferred to v2:** `px` → `rem` migration (WCAG 1.4.4). Scoped refactor, not a hotfix.
- **Accepted as designed:** ghost numerals below 3:1 — WCAG 1.4.11 exemption for purely decorative elements; stage labels carry the meaning.

Each section below retains the original finding, with a **→ Resolved** note documenting what shipped.

---

## 1. Color contrast (WCAG 2.1)

**Thresholds.** AA normal text 4.5:1 · AA large text (≥18pt or ≥14pt bold) 3:1 · AAA normal 7:1 · UI components / non-text 3:1.

All ratios below are computed against actual rendered colors, including alpha composites over their real backgrounds.

### Light mode

| Pair | Use | Ratio | Verdict |
|---|---|---|---|
| `--weft-ink` on `--weft-cream` | Body text | 17.84 | AAA |
| `--weft-ink` on `--weft-paper` | Body on cards | 18.93 | AAA |
| `--weft-muted` on `--weft-cream` | Secondary text | 5.50 | AA |
| `--weft-muted` on `--weft-paper` | Secondary on cards | 5.84 | AA |
| `--weft-blue` on `--weft-cream` | Links, eyebrows, italic accents | 4.59 | AA |
| `--weft-blue` on `--weft-paper` | Links on cards | 4.88 | AA |
| `--weft-blue-ink` on `--weft-yellow` | Pill text | 11.20 | AAA |
| `--weft-blue-ink` on `--weft-yellow-soft` | "You are here" stat | 13.99 | AAA |
| `--weft-ink` on `--weft-mark` | Highlight-mark text | 13.76 | AAA |
| `--weft-on-blue` (white/95) on `--weft-blue` | Body on blue slab | 4.55 | AA ✓ *(was 3.97 at 0.85)* |
| `--weft-on-blue-muted` (white/88) on `--weft-blue` | Secondary on blue (large only) | 4.13 | AA large ✓ *(was 3.42 at 0.75)* |
| `--weft-on-blue-soft` (white/78) on `--weft-blue` | Tertiary on blue (large only) | 3.58 | AA large ✓ *(was 2.72 at 0.60)* |
| `--weft-yellow` on `--weft-blue` | Italic accents on slab | 3.54 | AA (large) |
| `#fff` on `--weft-blue` | `.eco-name` etc. | 4.88 | AA |

### Dark mode

| Pair | Use | Ratio | Verdict |
|---|---|---|---|
| `--weft-ink` on `--weft-cream` | Body text | 16.76 | AAA |
| `--weft-ink` on `--weft-paper` | Body on cards | 15.28 | AAA |
| `--weft-muted` on `--weft-cream` | Secondary text | 6.22 | AA |
| `--weft-muted` on `--weft-paper` | Secondary on cards | 5.67 | AA |
| `--weft-link` (#5b87fd) on `--weft-cream` | Links, eyebrows, italic accents | 5.71 | AA ✓ *(was --weft-blue at 3.88)* |
| `--weft-link` (#5b87fd) on `--weft-paper` | Links on cards | 5.20 | AA ✓ *(was --weft-blue at 3.54)* |
| `--weft-link` (#5b87fd) on fill-soft tint over paper | Links on washed rows/sections | 4.86 | AA ✓ *(was #4a7bff at 4.27 — the 2026-07-18 lift)* |
| `--weft-blue-ink` on `--weft-yellow` | Pill text | 11.20 | AAA |
| `--weft-ink` on `--weft-mark` (over cream) | Highlight-mark text | 8.05 | AAA |
| `--weft-ink` on `--weft-mark` (over paper) | Highlight-mark text | 7.20 | AAA |
| `--weft-on-blue` (white/95) on `--weft-blue` | Body on blue (now AA) | 4.55 | AA ✓ |
| `--weft-on-blue-muted` (white/88) on `--weft-blue` | Secondary on blue (large only) | 4.13 | AA large ✓ |
| `--weft-on-blue-soft` (white/78) on `--weft-blue` | Tertiary on blue (large only) | 3.58 | AA large ✓ |
| `--weft-yellow-soft` (#2a241a) on `--weft-cream` | Ghost numerals (intentional whisper) | 1.23 | Acceptable — decorative (1.4.11 exempt) |

### What this means

Three concrete problems:

**The on-blue text scale fails for body-sized text.** This is the most consequential finding because the entire `.what-section` blue slab uses `--weft-on-blue` for its body copy, `--weft-on-blue-muted` for secondary, and `--weft-on-blue-soft` for subtitles. The first two pass AA only at large text size (≥24px or ≥19px bold); below that they fail. The third fails entirely. The design doc currently states `--weft-on-blue` is for "body copy on blue" — that contract is broken.

**The bright royal blue loses contrast on dark backgrounds.** In dark mode, `--weft-blue` (#2563ff) on the dark cream is 3.88:1 — fine for headlines and large eyebrows but a fail for any body-sized link or label. This affects eyebrows, section-num primary labels, italic accents inside h1/h2, and link defaults.

**Ghost numerals are below the 3:1 UI threshold by design.** This is intentional — they're decorative typography meant to be a whisper, not content. WCAG 1.4.11 exempts "purely decorative" elements. As long as no information depends on the ghost numeral being read, this is acceptable. If the numeral is the only label for the stage, that's a problem; right now each stage also has `STAGE 01` text, so we're fine.

### Recommended fixes

**Bump the on-blue scale.** Move `--weft-on-blue` from 0.85 → 0.92 (composites to ~4.7:1, passes AA normal). Move `--weft-on-blue-muted` from 0.75 → 0.88 (~3.9:1 — still AA-large only; if that's where it's used, fine). Move `--weft-on-blue-soft` from 0.60 → 0.78 (~3.1:1, passes AA-large). Document explicitly that `--weft-on-blue-soft` is large-text-only.

**Reserve `--weft-blue` for large text in dark mode, or shift the dark-mode link color.** Two options: (a) introduce a `--weft-link` token that points to `--weft-blue` in light mode and a brighter blue (e.g. #5b8aff at ~5.2:1) in dark; (b) accept that links and eyebrows are always large (≥18pt) and document the constraint.

### → Resolved (2026-04-21)

- On-blue scale bumped to **0.95 / 0.88 / 0.78**. `--weft-on-blue` now passes AA normal at 4.55:1 — see `/comps/on-blue-scale-comp.html` for the approved before/after. Body copy tier is now AA-safe at any size; `-muted` and `-soft` are documented as large-text-only (≥18pt or ≥14pt bold).
- Three small-text usages previously pointed at `-muted` / `-soft` were re-pointed at `--weft-on-blue` so they hit AA normal: `.maturity-row.you .desc span` (13px), `.what-section .section-num span` (11px), `.eco-desc` (14px).
- `--weft-link` token added — points to `--weft-blue` in light, `#4a7bff` in dark (5.02:1 on dark cream, 4.58:1 on dark paper). All `color: var(--weft-blue)` usages in text roles were swapped to `color: var(--weft-link)` in both files.
- Ghost numerals left at 1.23:1 by design — WCAG 1.4.11 exemption applies; stage labels carry the meaning.

---

## 2. Focus states

**No `:focus` or `:focus-visible` styles are defined anywhere.** Interactive elements — nav links, the email CTA, the theme toggle, the motion-replay button — fall back to the default browser focus ring. Default rings vary by browser and are sometimes suppressed by site CSS resets without operator awareness.

The design system lacks a focus token. There's no documented contract for "this is what keyboard focus looks like on this brand."

**WCAG 2.4.7 (Focus Visible)** requires that any keyboard-operable interface has a visible focus indicator. **WCAG 2.4.11 (Focus Appearance)** in WCAG 2.2 strengthens this: the indicator must have ≥3:1 contrast against adjacent colors and a minimum area.

### Recommended fix

Add a focus token and a default rule:

```css
:root {
  --weft-focus-ring: 0 0 0 2px var(--weft-cream), 0 0 0 4px var(--weft-blue);
}
[data-theme="dark"] {
  --weft-focus-ring: 0 0 0 2px var(--weft-cream), 0 0 0 4px var(--weft-yellow);
}

:where(a, button, [tabindex]):focus-visible {
  outline: none;
  box-shadow: var(--weft-focus-ring);
  border-radius: var(--weft-radius-card);
}
```

The double-shadow trick (cream gap + blue/yellow ring) keeps the indicator visible on every background tier — it carves out a 2px clear zone before the ring, so the ring isn't competing with whatever's behind it.

### → Resolved (2026-04-21)

`--weft-focus-ring` token added in both files, with a distinct dark-mode override (yellow outer ring for visibility on dark cream). Global rule `:where(a, button, [tabindex], input, select, textarea):focus-visible { box-shadow: var(--weft-focus-ring); }` applied to both files. Low-specificity `:where()` lets component-level focus styles override without needing `!important`.

---

## 3. Motion (`prefers-reduced-motion`)

**Two animations run unconditionally:**

The `.pill::before` dot pulses indefinitely (opacity 1 → 0.4 → 1 over 2s, ease-in-out). The hero `fadeUp` runs once per page load with a 0.55s stagger across four elements.

Neither respects `prefers-reduced-motion: reduce`. WCAG 2.3.3 (Animation from Interactions) requires non-essential motion to be disabled when this preference is set.

The pulse cycles at 0.5Hz, well below the 3Hz photosensitive seizure threshold (WCAG 2.3.1) — it's not dangerous, but it can be distracting or disorienting for vestibular and ADHD users.

### Recommended fix

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Add a token for the global motion override and document it in the Motion section. The `.pill` dot can fall back to a static dot when motion is reduced — the meaning of the pill ("ambient status") survives without the pulse.

### → Resolved (2026-04-21)

Global `@media (prefers-reduced-motion: reduce)` override added to both pages. Collapses all `animation-duration`, `animation-iteration-count`, `transition-duration`, and `scroll-behavior` to effectively-instant values using `!important` to beat component-level animations. Pulse and fade-up both honor the preference now; their meaning survives without the motion.

---

## 4. Text sizing (WCAG 1.4.4)

Headlines use `clamp(56px, 8.5vw, 128px)` — viewport-relative but fixed-pixel-bounded. Body text is set in `px` throughout. **User browser font-size preferences are ignored.** A user who has bumped their default from 16px → 24px for low vision sees no change.

WCAG 1.4.4 requires text to scale to 200% without loss of content or function. The current implementation passes the *page-zoom* version of this test (Cmd+) but fails the *text-size* version (browser preference, used by screen-magnifier users).

### Recommended fix

Migrate body text from `px` to `rem` (1rem = user's chosen default). Headlines can stay at clamp(); the size cap on display type is a deliberate design constraint, not a bug. Captions, body, ledes, eyebrows, and pills should switch to rem-based units.

This is a meaningful refactor — flag it as a v2 cleanup, not a hotfix.

### → Deferred to v2

Conscious scope decision. Touching every `font-size` in both files is a broader refactor than the rest of this remediation and wants its own design-review pass (rem math changes vertical rhythm). Tracked as a P2 for v2 of the system, not a blocker on v1 ship.

---

## 5. Semantic structure

**This is the strongest area.** The page uses real semantic HTML throughout:

- `<nav>` for the top bar, `<header>` for the hero, `<section>` for each major block, `<footer>` for the bottom
- Headings are properly nested h1 → h2 → h3 → h4 with no skipped levels
- Real `<a>` elements for links; `<button type="button">` for the theme toggle and motion replay
- `<html lang="en">` declared
- `aria-hidden="true"` on the decorative `.threads` backdrop
- `aria-label="Toggle dark mode"` on the theme toggle

### Two small gaps

**No `<main>` landmark.** The hero + sections are sibling top-level elements without a wrapping `<main>`. Screen reader landmark navigation (rotor / quick keys) won't have a "skip to main content" target.

**No skip link.** Keyboard users have to tab through the entire nav on every page entry. A `Skip to main content` link as the first focusable element fixes this.

### Recommended fix

```html
<a href="#main" class="skip-link">Skip to main content</a>
<nav>…</nav>
<main id="main">
  <header class="hero">…</header>
  <section id="who">…</section>
  …
</main>
```

```css
.skip-link {
  position: absolute; top: -40px; left: 0;
  background: var(--weft-blue); color: var(--weft-paper);
  padding: 8px 16px; z-index: 100;
  transition: top var(--weft-dur-fast);
}
.skip-link:focus { top: 0; }
```

### → Resolved (2026-04-21)

Both pages now wrap content from `<header class="hero">` through the last `<section>` in `<main id="main">`. `.skip-link` is the first focusable element in the body; styled to stay off-screen until focus, then animate down using the existing `--weft-dur-fast` token. Hits AA contrast (white on `--weft-blue`).

---

## 6. SVG accessibility

The three problem-card icons (`.problem-icon`) are inline SVGs with no `role`, `aria-label`, or `aria-hidden`. They're decorative — the meaning is carried entirely by the adjacent `<h4>` and paragraph. Screen readers will currently announce them as "image" with no label, which is noise.

### Recommended fix

```html
<svg class="problem-icon" viewBox="0 0 44 44" fill="none" aria-hidden="true" focusable="false">
  …
</svg>
```

`aria-hidden="true"` removes them from the accessibility tree. `focusable="false"` keeps them out of the tab order in IE/legacy edge cases. Add this to the SVG color discipline section of the design doc.

### → Resolved (2026-04-21)

All four `.problem-icon` SVGs (three in landing, one in design-system) now carry `aria-hidden="true" focusable="false"`. Screen readers will skip them; they were never the meaning carrier — the `<h4>` next to them is.

---

## 7. Theme toggle state

The toggle button has `aria-label="Toggle dark mode"` but doesn't expose its current state. A screen reader user who lands on the button hears "Toggle dark mode, button" — they can't tell whether dark mode is currently on.

### Recommended fix

Use `aria-pressed` to communicate the toggle state:

```html
<button type="button" class="theme-toggle"
        aria-label="Dark mode"
        aria-pressed="false"
        onclick="toggleTheme()">
  <span data-theme-label>Dark</span>
</button>
```

```js
function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  const btn = document.querySelector('.theme-toggle');
  btn.setAttribute('aria-pressed', String(next === 'dark'));
  const label = btn.querySelector('[data-theme-label]');
  if (label) label.textContent = next === 'dark' ? 'Light' : 'Dark';
}
```

### → Resolved (2026-04-21)

Theme toggle in `design-system.html` now ships `aria-pressed="false"` initially and `toggleTheme()` flips it on every click. A screen reader user lands on "Toggle dark mode, toggle button, not pressed" and hears the state change after activation.

---

## 8. Touch targets (WCAG 2.5.5)

The theme toggle pill has `padding: 5px 10px` plus an 11px font — total height around 22px. The nav links are similarly compact. WCAG 2.5.5 (AAA) recommends a 44×44px minimum touch target; WCAG 2.5.8 (AA, new in 2.2) recommends 24×24px minimum.

The pills and nav links currently fail the 24px AA threshold on a touch device. They pass on desktop with a mouse, but on mobile they're undersized.

### Recommended fix

At the ≤900px breakpoint, expand padding on `.pill`, `.theme-toggle`, and `.nav-meta a` so each has a ≥24px hit area. The visual size doesn't have to change — a transparent padding extension does the work.

### → Resolved (2026-04-21)

`.pill` and `.theme-toggle` carry `min-height: 24px` plus bumped vertical padding (5px → 7px) globally — the visual change is one pixel taller and barely perceptible. `.nav-meta a` gets `min-height: 24px` + 4px vertical padding only at the ≤900px breakpoint, where touch input becomes likely.

---

## Prioritized remediation list

| Priority | Issue | Severity | Where | Status |
|---|---|---|---|---|
| P0 | `--weft-on-blue-soft` fails all contrast | WCAG 1.4.3 fail | Subtitle on blue slab, maturity row .you desc | ✓ Resolved — 0.60 → 0.78 (3.58:1, AA large); small uses re-pointed at `--weft-on-blue` |
| P0 | `--weft-on-blue` and `--weft-on-blue-muted` fail AA normal | WCAG 1.4.3 fail | Body + secondary on blue slab | ✓ Resolved — 0.85 → 0.95 (4.55:1, AA normal); 0.75 → 0.88 |
| P0 | No focus styles defined | WCAG 2.4.7 fail | All interactive elements | ✓ Resolved — `--weft-focus-ring` token + `:focus-visible` rule both files |
| P1 | `--weft-blue` on dark `--weft-cream` fails AA normal | WCAG 1.4.3 fail (dark mode) | Eyebrows, links, accents in dark mode | ✓ Resolved — `--weft-link` token, `#4a7bff` in dark (5.02:1) |
| P1 | No `prefers-reduced-motion` handling | WCAG 2.3.3 fail | `.pill` pulse, `.fade-up` | ✓ Resolved — global override in both files |
| P1 | Theme toggle has no `aria-pressed` | WCAG 4.1.2 weakness | Theme toggle | ✓ Resolved — `aria-pressed` wired to JS toggle |
| P2 | Body text uses `px`, not `rem` | WCAG 1.4.4 fail | All body / captions / ledes | ⏸ Deferred to v2 — scoped refactor |
| P2 | No `<main>` landmark, no skip link | WCAG 2.4.1 weakness | Page structure | ✓ Resolved — both pages |
| P2 | Decorative SVGs missing `aria-hidden` | WCAG 1.1.1 noise | Problem icons | ✓ Resolved — all 4 SVGs |
| P3 | Touch targets < 24px on mobile | WCAG 2.5.8 fail (mobile) | Pills, nav links, theme toggle | ✓ Resolved — `min-height: 24px` + padding bumps |
| P3 | Ghost numerals below 3:1 | Acceptable (decorative) | Document the rationale | ✓ Documented — 1.4.11 exempt |

P0 items break body content for sighted users with low vision and for keyboard users entirely. P1 items break for specific user groups (dark-mode users with low vision, motion-sensitive users, screen reader users on the toggle). P2 items are good-citizen improvements that meaningfully reduce friction. P3 is polish.

**Net result:** 10 of 11 findings resolved in v1; 1 (rem migration) tracked for v2. Both pages now ship a defensible AA baseline in light and dark mode.

---

## What this audit did not cover

- **Screen reader walkthrough.** I read structure, not lived experience. A pass with VoiceOver, NVDA, and JAWS will surface issues this static analysis misses.
- **Keyboard navigation flow.** I confirmed elements are focusable; I didn't trace the actual tab order or test trap-free interaction.
- **Cognitive accessibility.** Reading level, plain-language alternatives, layout consistency for users with cognitive disabilities.
- **Reduced-color modes.** Forced-colors / Windows High Contrast Mode. The blue/yellow brand likely survives but should be tested.
- **Print stylesheet.** No print rules exist; printing the page will produce questionable output.
- **Form accessibility.** No forms exist on the current page. When a contact form or similar lands, it gets its own audit.

---

## Open questions

- Is AA the target, or AA + selective AAA? AAA on body text is achievable on cream and paper; on the blue slab it would require either a much darker blue or full-white-only text.
- Should the dark mode on-blue scale be tuned independently? Currently dark mode keeps the same on-blue alphas as light. They could be calibrated separately if blue's role in dark mode changes.
- Will there be a high-contrast variant beyond AA? Some markets (US federal procurement, EU EN 301 549) require AAA for specific text categories.
