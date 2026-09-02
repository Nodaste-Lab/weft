---
linked_project: Heddle Branding
type: design-system
name: Weft
status: draft
updated: 2026-09-01
---

# 09 · Weft App Primitives — Heddle dense surfaces

Weft was specified for marketing-shell density: generous whitespace, oversize serif headlines, breathing room. Heddle the application needs the same brand at app density — many controls per square inch, fast scanning, persistent chrome — without forking the visual language. This doc adds the contract for dense surfaces and maps every primitive in `src/app/components/ui/` to Weft tokens.

## Sources of truth

| Layer | Location |
|---|---|
| Weft spec — components, tokens, dark mode | [[04-design-system]] |
| Weft foundations — palette, type, functional states | [[03-color-and-type]] |
| Weft illustration aesthetic *(out of scope here)* | [[07-illustration-style]] |
| Weft Figma file | [Weft Design System](https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System) |
| Heddle DS registry | `src/design-system/manifest.json` (41 primitives + panel-builder) |
| Heddle current tokens | `src/styles/theme.css` (shadcn-style + `--hud-*`) |

---

## Principles

**Weft is the brand. Density is the surface.** The same palette, the same three type families, the same accessibility floor hold across marketing and app. Marketing breathes; app compacts. The brand still reads as one thing.

**Extend, don't fork.** No `--weft-app-*` parallel namespace. Density is a contextual override on the existing `--weft-*` tokens, same pattern as dark mode (`[data-density="compact"]` mirrors `[data-theme="dark"]`).

**Readable font wins for dense UI.** Inter Tight is the working face in compact surfaces. Fraunces remains the editorial voice for primary page titles only. JetBrains Mono remains for labels, IDs, and code. Display-scale Fraunces (Display/Hero, Display/Display) almost never appears in app surfaces.

**Accessibility floor holds.** WCAG 2.5.8 AA touch target (24×24) is the floor in compact mode — never below. Where a control compacts below 36px tall, expand the touch wrap. WCAG 2.5.5 AAA (44×44) remains the recommended target for primary forms and stays the default in marketing density.

**Maintain the technology.** Heddle ships React + shadcn + Radix + lucide-react + react-day-picker + react-resizable-panels. This doc describes how to **re-skin** those primitives with `var(--weft-*)`. Don't replace working primitives with custom Weft components.

---

## Surface mode — `data-density`

Two modes governed by an attribute on a wrapper element:

- **Marketing default** — current Weft. No attribute needed. Generous spacing, large type scale, 44px form controls.
- **App compact** — `data-density="compact"` at `<html>`, `<main>`, or any subtree. Tighter spacing, smaller body type, 36px controls with expanded touch wraps.

The Heddle app sets `data-density="compact"` once at the root layout. Marketing pages omit it. A single page can mix density by scoping the attribute to a section.

### Density tokens

Add to `:root` in `04-design-system.md`'s token block:

```css
:root {
  /* Marketing density — Weft default */
  --weft-control-h:        44px;   /* form input, button, select height */
  --weft-control-pad-x:    14px;   /* horizontal padding inside controls */
  --weft-control-gap:      12px;   /* gap between controls in a group */
  --weft-control-text:     16px;   /* default control text size (Inter) */
  --weft-stack-gap:        16px;   /* gap between vertically stacked items */
  --weft-row-h:            48px;   /* table / list row height */
  --weft-section-pad-y:    110px;  /* section vertical padding */
  --weft-section-pad-y-sm: 80px;
  --weft-touch-target:     44px;   /* WCAG 2.5.5 AAA target */
}

[data-density="compact"] {
  --weft-control-h:        36px;
  --weft-control-pad-x:    10px;
  --weft-control-gap:      8px;
  --weft-control-text:     14px;
  --weft-stack-gap:        12px;
  --weft-row-h:            32px;
  --weft-section-pad-y:    32px;
  --weft-section-pad-y-sm: 24px;
  --weft-touch-target:     24px;   /* WCAG 2.5.8 AA floor */
}
```

`--weft-touch-target` is the **floor** — interactive elements must hit at least this height (or use a `min-height` invisible wrap if visual height is lower).

### Typography in compact mode

Type sizes don't change automatically with density — the components reference different text styles in compact context. The rule:

| Role | Marketing | Compact |
|---|---|---|
| Page title | Heading/H1 (60) | Heading/H2 (42) or Heading/H3 (28) |
| Section title | Heading/H2 (42) | Heading/H3 (28) |
| Card title | Heading/H3 (28) | Body/Default at 600 weight (16) |
| Body | Body/Default (17) | Body/Small (15) or app-base (14) |
| Lede | Body/Lede (21) | Body/Default (17) |
| Label | Label/Default (13) | Label/Small (11) |
| Code | Code/Default (14) | Code/Default (14) — unchanged |

Mono labels and code don't shrink — they're already at the bottom of their readable range. The Fraunces serif rarely appears in compact mode at all; if a Heading is needed inside a dense panel, use Heading/H3 or smaller.

The body Sans gets one new size for app data tables and dense panels: **app-base** at 14/1.45/Inter Tight Regular. Add as a new text style alongside Body/Default and Body/Small in `03-color-and-type.md` if it ships.

---

## New foundation tokens

Three additions to the existing palette, none of which alter the visual language:

### `--weft-overlay` — modal backdrop

Modals, sheets, alert-dialogs, and command palettes need a backdrop. Add to `:root`:

```css
:root {
  --weft-overlay:        rgba(11, 16, 32, 0.40);  /* ink at 40% — dim without blackout */
}

[data-theme="dark"] {
  --weft-overlay:        rgba(11, 16, 32, 0.65);  /* deeper in dark mode for separation */
}
```

Scope: `EFFECT_COLOR` + `FRAME_FILL` in Figma. WEB code syntax: `var(--weft-overlay)`.

### `--weft-ok` and `--weft-warn` — functional states

`03-color-and-type.md` names success and warning states; `04-design-system.md` only ships `--weft-stop`. The Heddle app currently uses `--hud-positive` (green) and `--hud-warning` (amber) for HUD surfaces — those stay for HUD. For Weft surfaces, add tuned-down (not saturated) functional tokens:

```css
:root {
  --weft-ok:     #3a7a4a;   /* AA 4.71:1 on cream — synced/healthy/success */
  --weft-warn:   #b45309;   /* amber-700 — AA as text: 5.02:1 on white, 4.73:1 on cream */
  --weft-stop:   #a8382b;   /* unchanged */
}
```

`--weft-warn` shipped first as `#C39432` (3.71:1 on cream, AA-large only, body warnings paired with `text/ink`) and was lifted to amber-700 (`#b45309`) so that small warning text — panel hints, the orphan note on a `comment-thread` — clears AA on white and cream on its own; the dark block lifts it again for the dark canvas, and `contrast-contract` measures both. The value in `css/weft.css` is the calibration line; this paragraph follows it.

### `--weft-link-visited`

Visited link state for documentation surfaces and any link-heavy view. Approved — add now:

```css
:root {
  --weft-link-visited:  #5b3d99;   /* muted purple — distinguishable from --weft-link without competing */
}

[data-theme="dark"] {
  --weft-link-visited:  #b8a3e8;   /* lighter purple for AA on dark cream */
}
```

Pairs with `--weft-link` semantically. Apply via `a:visited { color: var(--weft-link-visited); }` globally; component-level overrides allowed when a link's purpose is action (button-like) rather than navigation. Calibrate hex values against AA 4.5:1 on cream/paper during accessibility pass — starting points pending audit.

---

## Themes — Weft is the system

**Weft is the design system everywhere.** Marketing surfaces, app surfaces, HUD overlays — they all run Weft anatomy: same density modes, same radii, same component contracts, same accessibility floor. What varies, by user preference, is the **palette** and **font set** plugged into Weft. The user picks; the structure stays.

This means Weft has a small customization layer:

- **Palette alternatives** — different color sets the user can prefer for color, contrast, brand-recognition, or just taste reasons. The default is Weft's editorial blue/yellow/cream. Heritage Purple (the pre-Weft `theme.css` palette, preserved) is one alternative. Color-blind-friendly variants and HUD's dark-glass overlay are others.
- **Font alternatives** — different type families the user can prefer for performance (system fonts), accessibility (OpenDyslexic-style typefaces), or environment (no-network installs). Weft default is Fraunces/JetBrains Mono/Inter Tight.

Both axes are independent — a user can pair Heritage Purple with system fonts.

### Picker location

The Heddle application already ships a theme picker inside the HUD. Wire the Weft alternatives into that existing picker — don't add a second control. Marketing surfaces pin to the default Weft palette + fonts; the picker UI doesn't appear there.

Persistence: per-user setting on whatever store the existing HUD picker uses. New users land on Weft default.

### How alternatives plug in

Two attributes on a wrapper element select palette and fonts independently:

```
[data-palette="weft" | "heritage-purple" | "hud-glass" | "high-contrast" | …]
[data-fonts="weft" | "system" | "accessibility" | …]
```

A theme alternative is just a `:root[data-palette="…"] { … }` override block that rebinds the relevant `--weft-*` tokens. The component anatomy is unchanged — components keep reading the same `--weft-*` names, and the picker decides what those names resolve to.

```css
:root,
:root[data-palette="weft"] {
  /* Default Weft palette — see 04-design-system.md for the full token block */
  --weft-blue: #2563ff;
  --weft-yellow: #ffd866;
  /* …etc */
}

:root[data-palette="heritage-purple"] {
  /* Pre-Weft purple, preserved as a Weft palette alternative */
  --weft-blue: #7F56D9;        /* primary action — the legacy purple, rebound onto the Weft "blue" slot */
  --weft-blue-deep: #6941C6;
  --weft-blue-ink: #53389E;
  --weft-yellow: #D6BBFB;       /* "highlight" — the legacy light-purple */
  /* etc — preserve the visual feel of the legacy theme without changing component anatomy */
}

:root[data-palette="hud-glass"] {
  /* HUD's dark glass overlay — the existing --hud-* values, exposed as a Weft palette */
  --weft-cream: rgba(8, 11, 18, 0.86);     /* page bg = HUD surface */
  --weft-paper: rgba(16, 21, 33, 0.94);
  --weft-ink:   rgba(245, 248, 255, 1);
  --weft-muted: rgba(160, 168, 192, 1);
  --weft-blue:  #2563ff;                    /* primary action stays brand-blue */
  /* …etc, preserving the dark-glass visual context */
}

:root[data-fonts="system"] {
  --weft-font-serif: ui-serif, Georgia, "Times New Roman", serif;
  --weft-font-mono:  ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --weft-font-sans:  -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
```

The contract: every component already reads `var(--weft-*)`. Adding a palette is a pure CSS override — no component code changes. The "no mixing namespaces" rule from `04-design-system.md` still holds inside a single tree (one palette per subtree), and namespaces never cross.

### Bridge — shadcn flat tokens → Weft

The Heddle app's existing shadcn flat token API (`--background`, `--primary`, `--muted`, etc.) bridges to Weft once. Whichever palette the user picks, the bridge resolves through it automatically.

Apply this binding once at the top level (no per-palette duplication needed):

| shadcn token | Weft binding | Notes |
|---|---|---|
| `--background` | `var(--weft-cream)` | Page bg |
| `--foreground` | `var(--weft-ink)` | Body text |
| `--card` | `var(--weft-paper)` | Elevated surface |
| `--card-foreground` | `var(--weft-ink)` | |
| `--popover` | `var(--weft-paper)` | Was dark in current theme; flips to paper for Weft |
| `--popover-foreground` | `var(--weft-ink)` | |
| `--primary` | `var(--weft-blue)` | Was purple `#7F56D9`; becomes saturated royal `#2563ff` |
| `--primary-foreground` | `var(--weft-on-blue)` | White on blue, AA normal |
| `--secondary` | `var(--weft-yellow)` | Was white; becomes warm gold |
| `--secondary-foreground` | `var(--weft-blue-ink)` | Text on yellow |
| `--muted` | `var(--weft-cream)` | Subtle bg |
| `--muted-foreground` | `var(--weft-muted)` | Secondary text |
| `--accent` | `var(--weft-blue)` | Match primary |
| `--accent-foreground` | `var(--weft-on-blue)` | |
| `--destructive` | `var(--weft-stop)` | |
| `--destructive-foreground` | `var(--weft-on-blue)` | White on stop-red |
| `--border` | `var(--weft-rule)` | |
| `--input` | `var(--weft-control-border)` | The form-control boundary — the 3:1 pair the plain-CSS layer reads (weft#16 P5 closed the paper-hairline gap) |
| `--input-background` | `var(--weft-control-fill)` | The decorative control wash; answers both themes itself |
| `--ring` | `var(--weft-focus-ring-color)` | Mode-aware via the indirection |
| `--radius` | `var(--weft-radius-card)` | 4px |
| `--radius-sm` | `var(--weft-radius-chip)` | 2px |
| `--radius-pill` | `var(--weft-radius-pill)` | 999px |
| `--sidebar` | `var(--weft-paper)` | |
| `--sidebar-foreground` | `var(--weft-ink)` | |
| `--sidebar-primary` | `var(--weft-blue)` | |
| `--sidebar-primary-foreground` | `var(--weft-on-blue)` | |
| `--sidebar-accent` | `var(--weft-yellow-soft)` | "You are here" treatment for active sidebar item |
| `--sidebar-accent-foreground` | `var(--weft-ink)` | |
| `--sidebar-border` | `var(--weft-rule)` | |
| `--sidebar-ring` | `var(--weft-focus-ring-color)` | |
| `--font-size` | `var(--weft-control-text)` | Density-aware |
| `--font-weight-normal` | `400` | |
| `--font-weight-medium` | `500` | |
| `--font-weight-semibold` | `600` | |

### Chart palette — Weft-aware categorical ramp

The existing `--chart-1` through `--chart-5` are purple steps from the legacy theme — useful for sequential data, weak for categorical. Replace with a Weft-aware categorical ramp that uses the brand's existing tuned-down accents (no saturated alerts) for perceptual separation:

```css
:root {
  /* Categorical chart palette — five distinguishable steps, Weft-aligned */
  --weft-chart-1: var(--weft-blue);    /* #2563ff — primary, brand */
  --weft-chart-2: var(--weft-stop);    /* #a8382b — divergent rust-red */
  --weft-chart-3: var(--weft-ok);      /* #3a7a4a — divergent forest green */
  --weft-chart-4: var(--weft-warn);    /* #b45309 — divergent amber (follows the shipped warn value) */
  --weft-chart-5: var(--weft-sepia);   /* #8c6f4a — warm brown from illustration palette */
}
```

Bridges to shadcn's `--chart-1` … `--chart-5`. Heritage Purple palette overrides this with its own ordinal purple ramp (the existing values in `theme.css`); HUD palette uses brighter analogs of the same five categories on its dark surface.

For sequential and diverging palettes (different from categorical), Weft doesn't ship defaults — design per chart context using brand/blue or brand/yellow as the anchor. Document as needed when a sequential chart actually ships.

---

## Per-primitive Weft anatomy

41 primitives in `manifest.json`, organized by category. Each entry below describes the Weft skin in terms of existing tokens. The actual primitive code (Radix + shadcn) is preserved.

### Casing on app surfaces

The owner's ruling of 2026-09-01, recorded verbatim in [[05-copy-guidance]] § When caps: **technical labels in dense info areas use all caps; outside of that, all caps is not used for headers, sections, or small one-off items.** Applied to the entries below:

- **Mono caps stays** (the dense-info register): `table` column headers, `stat-row` labels in a metadata panel, `badge` text inside a dense panel (queue pills, status chips), `avatar` initials, `calendar` weekday labels (a grid header). `source-pill` shows paths and identifiers as written.
- **Sentence case, mono face and tracking kept:** `tabs`, `eyebrow-label` on app surfaces, `dropdown-menu` and `context-menu` section labels, `label` in compact form layouts, `menubar` and `navigation-menu` triggers. Each entry says so where it used to say caps.
- **Never mix registers in one row of the same component.**
- The marketing `.eyebrow` in [[04-design-system]] is outside this ruling and unchanged.

Entries that changed under the ruling are change tickets in `Nodaste-Lab/weft` where the shipped primitive still uppercases (`eyebrow-label` does; `tabs` does not).

### Equal-specificity ties

Two rules at identical specificity setting the same property resolve by source order, and the loser fails silently — nothing throws and the source reads fine. Every state layered on a selected row or an active tab is exposed to this: a status colour on the icon, a listening badge, an underline colour, each competing with the `[aria-current]` / `[data-state="active"]` rule for one property. The fix is structural, not a specificity bump: give the varying part its own custom property and let the more specific state re-point that property. The `sidebar` and `tabs` entries below carry the rule; it applies wherever a state is layered on a current-item treatment.

### Layout

**`card`** — surface/paper fill, border/rule stroke 1px, radius/card. Header padding `--weft-stack-gap × 2`. Body padding `--weft-stack-gap × 1.5` in marketing, `--weft-stack-gap` in compact. Footer separator: 1px border-top in border/rule.

**`separator`** — 1px line in border/rule for solid, dashed (`dashPattern: [4, 4]`) for soft separation between related content.

**`aspect-ratio`** — pure layout, no skin.

**`scroll-area`** — track transparent, thumb 6px wide bound to text/muted at 40% alpha, 999px radius. Hover: thumb darkens to text/muted at 60%.

**`resizable`** — handle 4px wide, transparent default, hover bg border/rule. Active drag: bg border/rule-strong.

**`sidebar`** — surface/paper fill, border/rule right border, density-compact heights for items (`--weft-row-h`).

- *Expanded state*: active item gets brand/yellow-soft bg + 3px brand/yellow left-border (the "you are here" treatment, mirroring the maturity row Here state). Item label Inter Tight, icon 16×16 in text/muted (default) → text/ink (active).
- *Collapsed state* (icons only): drop the brand/yellow accent. Active item gets a neutral treatment instead — icon flips from text/muted to text/ink, plus a subtle 1px text/link left-border indicator (still readable, not loud). The brand-yellow row would be visual noise without the surrounding label content; neutral keeps the dense icon column scannable.
- *Equal-specificity ties*: state layered on the current row — an agent-status colour on the icon, a listening badge — must not set the same property as the `[aria-current="page"]` rule at equal specificity, or the later rule wins by source order and the state vanishes on the selected row. Give the varying part its own custom property (the badge's cut-out ring reads `--weft-listen-ring`; the icon colour reads a state property) and let the selected-row rule re-point that property rather than the colour itself. See § Equal-specificity ties.

### Disclosure

**`accordion`** — items separated by 1px border/rule bottom. Trigger row at `--weft-row-h`, Inter Tight Medium 14/16, text/ink. Chevron icon 16×16 text/muted, rotates 180° on open. Content padding `--weft-stack-gap` left+right, body in Body/Small or Body/Default per density.

**`collapsible`** — minimal shell, no border by default. Trigger reveals content with no animation override.

**`tabs`** — tab list in HORIZONTAL row, gap 0, 1px border/rule bottom under the list. Each tab: padding 12/16 (compact 8/14), Label/Default mono, **sentence case**, 13 / 0.15em / text/muted (inactive), text/link (active). Active tab gets 2px brand/blue bottom border that overlaps the list border. Hover (inactive): text/ink. Casing changed under the 2026-09-01 ruling (was mono caps): a tab is a small one-off label, not a dense-info label. Equal-specificity ties: the active state re-points a custom property for the label colour and the underline colour; a second rule at equal specificity on the same property loses by source order (see § Equal-specificity ties).

### Overlay

**`dialog`** — backdrop `--weft-overlay`. Content frame: surface/paper, border/rule 1px, radius/card 4px, max-width 480px (compact) / 600px (marketing), padding 32px (compact) / 40px (marketing). Header: title in Heading/H3 + description in Body/Default text/muted. Footer: right-aligned button row, gap `--weft-control-gap`. Dialog has Focus Ring on focused buttons.

**`alert-dialog`** — same shell as dialog. Destructive action button: bg state/stop, text on-blue/text white. Pair with iconography in state/stop.

**`popover`** — surface/paper, border/rule 1px, radius/card, padding 16px (compact) / 20px (marketing), max-height 400px with internal scroll-area. No backdrop. Anchor offset 8px. `--weft-overlay` is NOT used — popovers are anchored, not blocking.

**`hover-card`** — same as popover but smaller default size (max-width 320px). Lower elevation visually (no shadow needed; the border/rule + paper fill is enough on cream).

**`sheet`** — edge-mounted drawer. Backdrop `--weft-overlay`. Content: surface/paper, border/rule edge stroke, no radius on the docked edge, radius/card on the free edges. Width 400px (right/left) or full bleed (top/bottom). Same close button + header pattern as dialog.

**`tooltip`** — tooltip content: surface/ink fill (always dark, mode-invariant — tooltips read across light/dark contexts), on-blue/text white text at Body/Small, padding 6/10, radius/chip 2px, max-width 240px. Arrow optional (lucide chevron). No focus ring (tooltips don't take focus).

### Menus

**`dropdown-menu`** — same shell as popover. Items at 32px (compact) / 36px (marketing) with 12px horizontal padding. Item label Body/Small, icon 16×16 text/muted left-aligned. Hover row: bg `--weft-on-blue-bg` (cream-aware: in compact, treat as "subtle blue tint"), or alternative `border/rule` at 30% alpha. Active/selected: bg `--weft-yellow-soft`. Separator: 1px border/rule. Section label: Label/Small mono, sentence case, text/muted with 8px top/bottom padding (sentence case under the 2026-09-01 casing ruling; was caps).

**`context-menu`** — identical to dropdown-menu in skin. Trigger context is gesture, not button; styling is the same.

**`menubar`** — top bar of menu triggers. Each trigger: padding 6/12, Label/Default mono, sentence case, text/ink (default), text/link (hover). Sentence case under the 2026-09-01 casing ruling (was caps). Open menu uses dropdown-menu skin.

### Navigation

**`breadcrumb`** — items in Body/Small text/muted, separator slash in text/muted at 50% alpha. Active item text/ink. Hover: text/link with 1px underline at link color. Compact density: gap 6px between items; marketing: gap 8px.

**`navigation-menu`** — top-level triggers in Label/Default mono, sentence case, text/ink (sentence case under the 2026-09-01 casing ruling; was caps). Hover: text/link. Active triggers: bg `--weft-yellow-soft`. Open viewport: surface/paper card with border/rule 1px, radius/card.

**`pagination`** — pill-shaped buttons (radius/pill), Inter Tight Regular 13. Default: text/muted, no border. Active: bg brand/blue, text on-blue/text. Hover (inactive): bg cream at 50% alpha.

### Inputs (heavy)

**`input`** — see Weft v1 Input on the Form inputs page. Density: 36px tall in compact, 44px in marketing. Padding `--weft-control-pad-x`. Text size `--weft-control-text` (14 in compact, 16 in marketing). Focus uses global Focus Ring. Error state: border state/stop + below-input hint in state/stop at Body/Small.

**`textarea`** — same shell. Min-height: 80px (compact) / 96px (marketing). Resize: vertical only.

**`select`** (Radix-based, not native) — trigger styled like Input with chevron lucide icon at right (16×16, text/muted). Content: dropdown-menu shell. Selected indicator: check mark in brand/blue at 14px.

**`checkbox`** — see Weft v1 Checkbox. 18×18 in marketing, 16×16 in compact. Touch wrap respects `--weft-touch-target`.

**`radio-group`** — see Weft v1 Radio.

**`slider`** — track 4px (compact) / 6px (marketing) tall, bg border/rule, fill brand/blue from 0 to value. Thumb: 16×16 (compact 14×14), surface/paper fill, 2px brand/blue stroke, radius/dot. Focus: Focus Ring on thumb. Range slider (two thumbs): same thumb styling, fill spans between thumbs.

**`calendar`** (react-day-picker) — header row: month/year in Heading/H3 / Body/Default Medium center, navigation lucide chevrons left/right (24×24, text/muted). Weekday labels: Label/Small mono caps text/muted (a grid header — caps stay under the 2026-09-01 casing ruling). Day cells: 32×32 (compact) / 40×40 (marketing), rounded radius/card. Today: bg `brand/yellow-soft`. Selected: bg brand/blue, text on-blue/text. Hover: bg cream. Out-of-month: text/muted at 50% alpha. AA 24px touch-target floor is met at both densities; AAA 44×44 isn't a target for this primitive.

**`label`** — Body/Small Medium in marketing, Label/Small mono in compact form layouts, sentence case in both (a field label stands alone; 2026-09-01 casing ruling — was mono caps in compact). text/muted color. Required indicator: the word `required` in `state/stop` after the label, **with a space before it** — the accessible name concatenates the label's text nodes, so without one the name reads "Emailrequired". A bare asterisk is not used: it lands in the name as punctuation while leaving the control's `required` state false. The control carries the `required` attribute too; the word and the attribute are both required.

**`form`** — wrapper for label + control + hint, mirrors the Field component from Weft v1. Compact: stack gap 4px between label/control, 4px between control/hint. Marketing: 8px each.

### Toggles

**`toggle`** — pressed state: bg brand/blue, text on-blue/text. Unpressed: bg transparent, text text/muted, hover text/ink + bg `--weft-on-blue-bg` at cream-tinted alpha. Padding 6/12 (compact) / 8/14 (marketing). Radius/card.

**`toggle-group`** — toggles joined edge-to-edge with a single shared border/rule. Selection logic single (radio-like) or multi (checkbox-like) per Radix.

**`switch`** — track 36×20 (marketing) / 28×16 (compact) with radius/pill. Off: track bg border/rule, thumb fixed/white. On: track bg brand/blue, thumb fixed/white shifted right. Focus: Focus Ring on the track. Touch wrap min-height respects `--weft-touch-target`.

### Feedback

**`alert`** — surface/paper bg, 4px left-border in the relevant state color (state/stop, `--weft-ok`, `--weft-warn`, brand/blue for info). Icon at top-left, 20×20, in the state color. Title in Body/Default Medium text/ink. Body in Body/Small text/muted. Padding `--weft-stack-gap` × 1.5.

**`badge`** — extends the Weft Pill anatomy. Default: brand/yellow bg, brand/blue-ink text, mono caps Label/Small inside a dense panel (a queue pill, a status chip beside a stat row); a badge standing alone in header chrome takes sentence case (2026-09-01 casing ruling). Variants: `info` (brand/blue + on-blue/text), `success` (`--weft-ok` + on-blue/text), `warn` (`--weft-warn` + brand/blue-ink), `destructive` (state/stop + on-blue/text).

**`progress`** — track height 6px (compact 4px), bg border/rule, fill brand/blue, radius/pill on both. Indeterminate: animated linear-gradient brand/blue → transparent → brand/blue; respects `prefers-reduced-motion`.

**`skeleton`** — bg `--weft-rule` solid (no animated shimmer in v1; if added, animation collapses under reduced-motion). Radius matches the element being represented.

**`HudIssueCallout`** — keep on HUD tokens for HUD surfaces. If used inside a Weft surface, swap the visual shell to `alert` with `state/stop` accent. Don't render HUD's dark glass on a Weft cream/paper surface — visual mismatch.

### Data display

**`avatar`** — circle, 32px (compact) / 40px (marketing), surface/paper bg, 1px border/rule. Fallback: initials in Label/Small mono caps text/ink, centered (initials are an identifier; caps stay under the 2026-09-01 casing ruling).

**`table`** — header row: Label/Default mono caps text/muted (the dense-info register; caps stay under the 2026-09-01 casing ruling), padding `--weft-control-pad-x` left/right, 1px border/rule bottom. Body rows: Body/Small (compact) or Body/Default (marketing), `--weft-row-h` tall, 1px border/rule between rows. Row hover: bg cream at 60% alpha (subtle, density-aware). Selected row: bg `brand/yellow-soft`. Captions: Body/Small text/muted above table.

### Heddle-specific primitives (added 2026-04)

These eight primitives were added during the Heddle bypass-sweep pass. They consolidate patterns that repeated across panels and weren't covered by stock shadcn. All registered in `manifest.json`.

**`eyebrow-label`** — tracked-out section label in sentence case on app surfaces (2026-09-01 casing ruling: an app-surface eyebrow is a section label, so it drops the uppercase and keeps its tracking; the marketing `.eyebrow` keeps its caps). Resolves to JetBrains Mono automatically under `data-palette="weft"` via the global type rule. Variants: `size` (sm 10/0.10em, default 12/0.06em, lg 14/0.04em), `tone` (muted, default, accent), optional leading `icon` slot (12×12).

**`panel-header`** + slots (`PanelHeaderTitle`, `PanelHeaderActions`, `PanelHeaderDismiss`) — top strip of a HUD panel. Composable: each slot is a separate component so panels compose their own action sets without rebuilding the strip layout. Title slot accepts an icon. Dismiss slot renders an X close button on the right.

**`action-button-row`** — flex row container for grouped panel actions (Copy / Email / Vault / Generate). Standardizes gap 6px and offers `align` (start, end, between) so primary actions can sit at the right edge with the standard gap.

**`add-item-button`** — dashed-border "+ Add item" trigger. Used at the foot of editable lists (beats, decisions, tags). Default icon Plus 10×10, hover lifts border to brand/blue at 50% alpha and text to brand/blue.

**`pill-toggle-group`** + `pill-toggle-group-item` — gap-separated pill segmented control. **Distinct from shadcn `toggle-group`** which renders joined segments with shared borders. Use this for period selectors (This Session / Last 7 Days / etc.) and mode toggles where pills should breathe. Active pill: brand/blue at 15% bg + brand/blue-ink text + 40% brand/blue border. Inactive: paper bg + muted text. Wraps cleanly when options exceed the row.

**`stat-row`** — label-on-left, value-on-right key/value row with optional `hint` slot (small badge after the value). Labels take mono caps: a stat row in a metadata panel is the dense-info register the 2026-09-01 casing ruling names. Used in PartyStats (HP / AC / temp HP), SessionContext (participant stats), BattleTracker (threat levels), recap detail sections.

**`empty-state`** — centered `icon` + `title` + `description` + optional `action` slot for "nothing to show yet" surfaces. `tone` variants: default (neutral muted) or warning (soft amber tint, used for "Add an OpenAI API key first" patterns).

**`source-pill`** — small monospace pill for file paths and origin tags (vault paths, signal sources). Inherits JetBrains Mono via the type rule. `truncate` (default true) clips long paths inside scrollable lists; `tone` (default, muted) lets the same pill recede in dense rows.

### Document surfaces (added 2026-09-01 — DocT document-view port, plan phase W3)

The entries below are the Weft definitions for the DocT document view (reference approved by the owner on 2026-09-01: `doct-design-handoff/doct-document-view.html`, nine states captured at 1280×800 in `captures/` and at 1440 / 1024 / 390 in `widths/`). Weft is the source of truth: DocT implements each entry on its vendored `components/ui` base, Weft ships it as a `src/ui/` primitive in plan phase W4, and DocT's design-match suite holds both to the same captures. Each addition and change has a `Nodaste-Lab/weft` issue (labels `addition`, `change`, `pattern`, all `doct-document-view`); the issue key sits at the end of its entry.

Reading the sizes: the reference was drawn on the mockup's own compact ladder (row 30px, control 34px, touch target 24px); the entries name Weft's tokens, whose compact values are `--weft-row-h` 32, `--weft-control-h` 36 and `--weft-touch-target` 24, and the design-match tolerance absorbs the 2px. Sizes read *compact / marketing*; marketing values follow the density table above (row 48, control 44, touch 44, stack gap 16). Every colour reads a `--weft-*` token, so dark mode is the token layer's job and no entry names a dark value except where a light-only rule has to flip (identity line). Focus on every interactive part is the global Focus Ring unless an entry says otherwise. Under `prefers-reduced-motion: reduce` every animation an entry names collapses to its resting frame.

#### Three channels

**Colour is identity or state. Underline style is context. Fill is ownership.** A person's identity colour drives their avatar, their comment number, their anchor tint and their anchor underline, so their colour is one value everywhere. A queue state — `pending`, `agent_working`, `all_addressed` — drives the listening badge's colour and the listener pill's. A thread's context tag — `action-needed`, `risk-issue`, `resolved` — changes only the underline *style* (wavy, dashed, dotted) and never its colour. Whether a listening agent is yours or someone else's changes only the badge's *fill* (solid or outline) and never its colour. Two facts never share a channel, so no state can hide another. `comment-highlight-semantics.ts` in DocT states the first two; the third is added here for `listening-badge` and `listener-pill`. Phase W4 promotes this paragraph to a Pattern in [[04-design-system]]; until then this is its home and every entry below cites it by name.

#### Additions

**`document-tree`** — the nested disclosure list that is the sidebar's body (the `sidebar` entry covers the shell and the "you are here" row; this covers the rows). A row is a button `--weft-row-h` tall (32 / 48), full width, `Body/Small` 14 / `Body/Default` 16, text/ink, 3px transparent left border, `gap 6px`, right padding `--weft-space-3`. Left to right: an indent guide per nesting level (14px / 18px per level, drawn by the row's own padding, not by nested lists, so the hover and selected fills run edge to edge), a disclosure caret 18×18 in text/muted that rotates 90° on `aria-expanded="true"` over `--weft-dur-fast` (hidden but space-keeping on leaves), a 16×16 lucide type icon in text/muted (document, plan, collection, folder; a space row carries its coloured space glyph), the label (single line, ellipsis), then an optional lock glyph for a personal-workspace document (label text/muted, ink again when selected), a 6px workspace dot, and a kebab 22×22 inside a `--weft-touch-target` wrap that appears on hover, focus-within or while its menu is open and opens the same `context-menu` a right-click does. Hover: bg `--weft-fill-soft`. Selected (`aria-current="page"`): bg `--weft-yellow-soft`, 3px `--weft-yellow` left border, weight 600, icon text/ink — the `sidebar` treatment, unchanged. Agent status colours the type icon (`data-agent`): `pending` `--weft-info-text`, `agent_working` `--weft-warn`, `all_addressed` `--weft-ok`, stroke 2.2; the `listening-badge` sits on the icon's top-right corner for the first two. Pass-through row (an ancestor kept visible by the filter because a descendant matches): label text/muted, icon at 50% alpha, caret kept, excluded from the match count. Filtered-empty: `empty-state` in the tree body. Keyboard: arrow keys move, Right/Left open and close, Enter opens, F2 renames, Shift+F10 opens the menu; drag-and-drop reorder keeps the existing product behaviour. Equal-specificity ties per the `sidebar` entry: the badge's ring and the icon's state colour are custom properties the selected-row rule re-points. Channels: colour is state; the badge's fill is ownership. — `Nodaste-Lab/weft` issue: #28

**`comment-thread`** — one anchored discussion in the comments rail. Card: bg `--weft-cream` on the paper panel, 1px `--weft-rule` border, `--weft-radius-card`, padding `--weft-space-3` / `--weft-space-4`, a column with 7px / 10px gaps. Header row (`gap 7px`): the thread number — a 19px / 22px circle, mono 10 / 11 at 700, `--weft-yellow` bg with `--weft-blue-ink` text by default, the author's identity accent with `--weft-on-identity` text when the author has one, `--weft-warn` with `--weft-cream` text when the anchor is orphaned, `--weft-ok` with `--weft-cream` when resolved (the mode-aware cream, not a fixed one: the status fills lighten in dark mode, so the text on them has to darken with the theme — dark `--weft-ok` under a fixed cream measures about 1.6:1) — then the author's `avatar` (identity variant, 24px), the name 12.5 / 14 at 600, an optional agent tag (mono 9 at 700, `--weft-radius-pill`, `--weft-blue` bg, `--weft-on-blue` text, reads "Agent"), the queue `badge` when the thread was submitted to an agent, and the relative time mono 10 / 11 text/muted pushed right. Quoted source: a button with a 2px `--weft-yellow` left border (3px identity accent when the author has one; `--weft-warn` when orphaned), padding-left 8px, 12 / 13 italic text/muted, hover text/ink; activating it scrolls to the `text-anchor` and flashes it. Orphan note: 11.5 `--weft-warn` with a leading 14px lucide icon, only when the anchor no longer resolves. Body: 13 / 14 text/muted at 1.55. Replies: a nested column indented 9px with 10px padding and a 1px `--weft-rule` left border; each reply head is name 12 at 600 and time mono 9.5 text/muted right. Actions (`action-button-row`, `gap 6px`): Reply and Resolve as ghost buttons, then the thread tag `select` (four options in this order — Comment, Action needed, Risk / issue, Resolved; Comment maps to `null`; accessible name "Thread tag for comment {n}"). States: `flash` (navigated to from its anchor) — `--weft-blue` border plus a 2px `--weft-blue` ring for one `--weft-dur-base`; `resolved` — the thread's lifecycle (`is_resolved`, set by Resolve), not the context tag of the same name: the card at 62% opacity with the number in `--weft-ok`, a state colour on a state, while the `resolved` *tag* changes only the anchor's underline style and never a colour; `orphan` — a 3px `--weft-warn` left border. Reply form: `textarea` at 13px in `--weft-control-fill` with the `--weft-control-border` boundary, then Reply / Cancel. Focus: Focus Ring on the number-less parts; the quoted source and the buttons are the tab stops. Reduced motion: the flash holds its final frame and the scroll-to-anchor is instant. Channels: the thread's colour is its author's identity; the tag it carries changes only the anchor's underline style. — issue: #29

**`text-anchor`** — the inline mark that ties a run of prose to a `comment-thread`. A `mark` with padding `0 2px`, `--weft-radius-chip`, text/ink, cursor pointer. Fill: `--weft-thread-yellow` by default; the author's identity accent at 18% alpha when the thread has one (the accent at low alpha, not the identity wash — the wash is a light colour and would fight light text in dark mode, whereas a low-alpha accent lets the page ground through in both themes and keeps the body text at AA). Underline: `text-decoration-line: underline`, offset 2px, colour `--weft-identity-line` (falls back to text/ink), style **solid** 2px with no tag, **wavy** 2px for `action-needed`, **dashed** 2px for `risk-issue`, **dotted** 1px for the `resolved` tag (a context tag, distinct from the thread's lifecycle `is_resolved`, which the `comment-thread` card shows) — the style rides `text-decoration-style`, never `border-style`, which has no `wavy` and would silently fall back to solid. Superscript number: mono 9 at 700, `--weft-blue-ink` (identity line colour when the thread has an identity), 2px left margin. Hover: fill alpha lifts by 6%. Active (`flash`, reached from the thread's quoted source): a 3px `--weft-blue` ring for one `--weft-dur-base`. Orphaned (`gone`): no fill, a 2px dashed `--weft-rule-strong` underline, text/muted, `line-through`. Focus: the mark is a button for keyboard users — Enter opens its thread — with the Focus Ring. Density: identical at both densities; the mark inherits the paragraph's type. Channels: colour is identity; underline style is context; fill is never used here for anything but the identity tint. — issue: #30

**`peer-caret`** — another editor's caret in a live document. A 2px × 1.1em inline block, `vertical-align: text-bottom`, `margin 0 1px`, bg `--weft-identity-line` when the peer has an identity colour, else `--weft-category-5`. Name flag: a `::after` reading the `data-who` attribute, positioned 17px above the caret's left edge, mono 10 at 600, padding 2/6, `--weft-radius-chip`, bg text/ink with `--weft-cream` text (the pair flips with the theme, which is right — the flag sits on the page, not on a fixed ground). Never blinks; never animates in or out. `aria-hidden="true"` — presence is announced by the collaborator list, not by the caret. Same at both densities. Channels: colour is identity. — issue: #32

**`selection-toolbar`** — a floating toolbar over a live text selection in a **text document** (never on an HTML plan, where a click on a paragraph opens `comment-composer` and a dragged range is for copying). Tracks the selection's bounding rect: centred above it with an 8px offset, flipping below when there is no room; hidden while the selection is collapsed. Ground: `--weft-fixed-ink` with `--weft-fixed-cream` text — mode-invariant, so it reads as the same dark bar in both themes (the tooltip rule); padding 3px, `--weft-radius-card`, `--weft-shadow`, items `gap 2px`. Buttons: 26px / 32px tall, min-width 26 / 32, padding `0 7px`, `--weft-radius-chip`, 12 / 13 at 600, `--weft-fixed-cream` text with lucide icons at 14; hover bg `--weft-fixed-cream` at 16% alpha; pressed (`aria-pressed="true"`, an active format) bg `--weft-fixed-cream` at 28%. Separator: 1×16, `--weft-fixed-cream` at 28%, `margin 0 3px`. The Comment action is the accent button — bg `--weft-blue`, `--weft-on-blue` text, 2px left margin — and opens `comment-composer` on the selection. Order: Bold, Italic, Strikethrough | H2, Paragraph, List | Link | Comment. Keyboard: the toolbar is a `toolbar` role with a roving tabindex; Escape dismisses it and returns focus to the editor; the format shortcuts keep working without it. No agent control is reachable from it. Phone: docks full-width above the `bottom-bar` (bottom 52px), radius 0, buttons 32px tall spaced around. Reduced motion: appears and disappears without a fade. — issue: #33

**`comment-composer`** — the popover that starts a thread. Shell: `popover` — `--weft-paper`, 1px `--weft-rule`, `--weft-radius-card`, `--weft-shadow`, padding `--weft-space-3` / `--weft-space-4`; width 320 / 360; anchored 8px below its source (the clicked paragraph on a plan, the selection on a text document), flipping above when there is no room. Contents, top to bottom: the quoted source — 11.5 / 12.5 text/muted at 1.45, 3px `--weft-rule-strong` left border, padding-left 8, clamped to two lines; a `textarea` (min-height 62 / 80, 13 / 14, `--weft-control-fill` on the `--weft-control-border` boundary, `--weft-radius-card`, `resize: vertical`, focus ring), autofocused on open; an actions row (`action-button-row`) with Cancel on the left, then a spacer, then the submit set. **Dual submit on HTML plans**: **Agent** is the primary button (bg `--weft-blue`, `--weft-on-blue`, 28 / 36 tall, 12 / 13 at 600, `--weft-radius-card`) and **Thread** the secondary (1px `--weft-rule` border, text/ink; hover `--weft-rule-strong` border and `--weft-fill-soft`); the hint line beneath is mono 10 / 11 text/muted reading "⌘↵ asks agent · ⇧⌘↵ starts thread · Esc cancels". The mention rule: while a mention is selected, Agent is disabled (45% opacity, `not-allowed`), a warning line in 11.5 `--weft-stop` reads "Agent responses are disabled when a mention is selected", and ⌘↵ submits Thread — the existing product rule, restyled. **Single submit on text documents**: Thread is the primary and the Agent slot is absent; the hint reads "⌘↵ starts thread · Esc cancels". Escape cancels and returns focus to the source; the popover is not a focus trap. Phone: a bottom `sheet` with the drag handle, max-height 80vh. Reduced motion: none to collapse. Opened by: a click or tap on a `[data-plan-node-id]` element while the selection is collapsed (plans); the Comment action of `selection-toolbar` (text). — issue: #34

**`listening-badge`** — the agent-attached indicator on a plan's type icon. An 11 / 14px circle at the icon's top-right (`top -4px; right -5px` on a 16px icon), containing a 11 / 14px lucide glyph, shown only for `pending` and `agent_working` — `all_addressed` keeps the green icon and no badge, because there is nothing left to listen for. **Colour is state**: `pending` `--weft-info-text`, `agent_working` `--weft-warn`. **Fill is ownership**: my agent (`data-listener-mine="true"`) — bg `currentColor`, glyph in the ring colour; someone else's — no fill, an inset 1px `currentColor` ring, glyph in `currentColor`. Cut-out ring: 1.5px of `--weft-listen-ring`, a custom property that defaults to the row's ground (`--weft-cream` in the sidebar) and that the selected row re-points to `--weft-yellow-soft` — one variable, so the selected-row rule never touches the fill (the equal-specificity tie the `sidebar` entry names). Pulse: `agent_working` only — opacity 1 → 0.35 → 1 over 1.6s ease-in-out, infinite; reduced motion: none. Contrast: the glyph against the chip and the chip against its ring hold ≥ 3:1 in both themes while the row is selected (measured on the composited ground, not asserted). Tooltip on the row: "{state} · {agent display name} · {yours | owner's display name}", e.g. "Agent working · plan-reviewer (A) · yours"; a queued plan with no claim reads "Queued · waiting for a listener". No unread state, ever (owner ruling 6). `aria-hidden` on the badge; the row's accessible name carries the tooltip text. The same component renders statically (no ring, no offset, 12px) inside `listener-pill`. — issue: #35

**`listener-pill`** — the crumb row's one persistent plan field, the only plan field that changes while you work. An inline flex, `gap 6px`, mono 10.5 / 11.5 text/muted, right-aligned in the crumb row with `--weft-space-5` right padding; on a phone it takes its own row beneath the scrolling trail. Leading: the `listening-badge` rendered statically (12 / 14px, coloured by state, filled or outlined by ownership, pulsing only on `agent_working`). Text, exactly: `pending` with no claim — "Queued · waiting for a listener"; `agent_working` — "{agent display name} · {owner display name or you} · working"; `all_addressed` after a claim — "{agent} · {owner or you} · idle"; `all_addressed` with no claim ever — no pill. The agent name is text/ink at 500; the whole pill is text/ink while `agent_working`. "you" means the agent's `owner_user_id` is the session user. Hidden on text documents. Live: updates from the broadcast projection without a reload. Channels: colour is state; fill is ownership; the pill and the tree badge are one signal and change in step. — issue: #36

**`board`** — the kanban view of a workspace, replacing the document area in place (the sidebar's Kanban board tab sets `?view=kanban`; leaving it returns to the same document). Columns: a grid with `grid-auto-flow: column`, each column `minmax(200px, 1fr)` / `minmax(240px, 1fr)`, `gap --weft-space-3`, padding `--weft-space-4 --weft-space-5`, horizontal scroll, columns aligned to the top. Column: bg `--weft-fill-soft`, 1px `--weft-rule`, `--weft-radius-card`, padding `--weft-space-2`, cards in a column with 6px gaps, min-height 110. Column header: mono 11 / 12 at 500 text/muted, sentence case as the reference shows (a board column is a heading, not a data-table header), with the count pushed right in the same face. Card: a button, bg `--weft-paper`, 1px `--weft-rule`, `--weft-radius-card`, padding `9px 10px` / `12px 14px`, a column with 5px gaps: title row (16px lucide type icon + 13 / 14 at 600) and a meta row (mono 10.5 / 11.5 text/muted: a 6px status dot in the working-status colour — `active` `--weft-ok`, `wip` `--weft-info-text`, `stale` `--weft-warn` — the status word, and the open-thread count). Hover: border `--weft-rule-strong`. Current document (`aria-current="page"`): border `--weft-yellow`, bg `--weft-yellow-soft`. Focus: Focus Ring on the card. Empty column: 11.5 text/muted "Nothing here". Drag between columns keeps the existing assignment behaviour; the column is `document_board_assignments`, distinct from the title bar's working status. The tree filter narrows the board exactly as it narrows the tree. Phone: horizontal scroll with 240px columns. — issue: #37

**`version-diff`** — side-by-side compare of two versions of a **text document**, replacing the editor region (on an HTML plan there is no diff: the same picker offers one control, *Ask your agent what changed*, which opens `comment-composer` anchored to the plan's title node). Picker rows in the History panel (`vitem`): padding `9px 8px`, 1px `--weft-rule` bottom, 3px transparent left border; an 8px dot (`--weft-rule-strong`; `--weft-blue` for the current version) then name 13 / 14 at 600 — an autosave reads "Autosave" in italic 500 text/muted — a tag chip (`named` / `current`; mono 9.5, 1px `--weft-rule-strong`, `--weft-radius-chip`, text/muted), a meta line mono 10.5 text/muted (v12 · Aaron · 2 days ago) and a delta line mono 10.5 with the added count in `--weft-ok` and the removed count in `--weft-stop`; hover `--weft-fill-soft`; picked (`aria-pressed="true"`) `--weft-yellow-soft` with a `--weft-yellow` left border; Restore appears on hover or focus-within (11.5 at 500 text/muted, hover text/link). Footer: "Pick two versions to compare" 11.5 text/muted and a Compare `button` disabled until two rows are pressed. The compare view: a head row (bg `--weft-paper`, 1px `--weft-rule` bottom, padding `--weft-space-3 --weft-space-5`) with the title 15 / 17 at 700, the word delta as above, a Restore per column and Close; two columns `1fr 1fr` at `compact-laptop` and wider, stacked at `tablet` and below, 1px `--weft-rule` between; each column's sticky header mono 11 at 500 text/muted on `--weft-fill-soft` naming its version. Lines: padding `3px --weft-space-4`, 13 / 14 at 1.6, `white-space: pre-wrap`, 3px transparent left border; `same` text/muted; `add` bg `--weft-ok` at 12%, `--weft-ok` left border, text/ink; `del` bg `--weft-stop` at 12%, `--weft-stop` left border, text/ink; `blank` (alignment placeholder) `--weft-fill-soft` at min-height 26; heading lines 700 text/ink. Colour never carries the line status alone — the border and the position do too. Focus: the columns are scroll regions with `tabindex="0"`. Reduced motion: none. — issue: #38

**`bottom-bar`** — the phone's rail: the icon strip moved to the bottom edge (`mobile-portrait` only; not a marketing component). Fixed to the bottom, height 52, bg `--weft-paper`, 1px `--weft-rule` top, items spaced around, padding `0 --weft-space-2`; the main region takes 52px of bottom padding so nothing is covered on load. Items are the rail buttons: 34×34 visual inside a 44px touch wrap, `--weft-radius-card`, text/muted, lucide icon 18; hover text/ink on `--weft-fill-soft`; pressed (`aria-pressed="true"`, its panel open) bg `--weft-blue` with `--weft-on-blue`; a count (mono 9 at 700, `--weft-stop` bg, `--weft-cream` text (mode-aware, as on the thread number), `--weft-radius-pill`) at the top-right of the comments item. A tap opens that panel as a bottom `sheet` above the bar; a second tap on the active item closes it. Panels start closed on a phone. z-index sits below sheets and popovers. Reduced motion: none. — issue: #39

#### Identity colour (token subsystem)

**`identity-colour`** — not a component: one accent per person that drives their `avatar`, their `comment-thread` number, their `text-anchor` tint and underline and their `peer-caret`, so a person's colour is literally one value everywhere. Two layers, because `css/weft.css` is a pure token file — `:root` axis blocks only, gated by `check-pure-token-file.mjs`. The **named palette** lives in the token file and is documented in [[04-design-system]] Tokens (the reference ships four pairs; DocT's remaining pairs register under the same shape):

```css
/* css/weft.css — :root only */
:root {
  --weft-identity-honey-amber: #f59e0b;  --weft-identity-honey-amber-wash: #fde68a;
  --weft-identity-peach-sand:  #e87934;  --weft-identity-peach-sand-wash:  #fee2b3;
  --weft-identity-mist-blue:   #3b82f6;  --weft-identity-mist-blue-wash:   #d9e9ff;
  --weft-identity-sage-glow:   #10b981;  --weft-identity-sage-glow-wash:   #d7f5e4;
  --weft-on-identity:          #1a1205;  /* text on any identity wash — mode-invariant, like --weft-fixed-ink */
}
```

The **channel properties** an element carrying `data-identity` sets are component-layer CSS: they live in `css/weft-components.css` (or the primitive's own styles), never in the token file, because a `[data-identity]` selector there would break the injection-safe invariant Heddle relies on:

```css
/* css/weft-components.css — the channel rules */
[data-identity] {
  --weft-identity:       var(--weft-muted);      /* accent; a person with no colour reads neutral */
  --weft-identity-wash:  var(--weft-fill-soft);
  --weft-identity-line:  color-mix(in srgb, var(--weft-identity) 55%, var(--weft-ink));  /* darkened for 3:1 on paper */
  --weft-identity-deep:  color-mix(in srgb, var(--weft-identity) 50%, var(--weft-fixed-ink));
}
[data-identity="honey-amber"] { --weft-identity: var(--weft-identity-honey-amber); --weft-identity-wash: var(--weft-identity-honey-amber-wash); }
/* …one rule per named pair… */
:root[data-theme^="dark"] [data-identity] { --weft-identity-line: var(--weft-identity); }  /* the accent is light enough on a dark ground */
```

The element that carries `data-identity` sets the four channel properties; everything inside reads them. The wash is for grounds that hold text (`avatar` fallback, the hover-card's large avatar); the accent is for marks and borders (comment number, quoted-source border, caret); the line is for underlines and the anchor superscript, darkened in light mode because a saturated accent on paper misses 3:1 and left as the accent in dark mode where it clears it; the deep value is for a solid ground that must read dark in both themes. Distinct from `--weft-category-*`: the category ramp is a fixed hue-spread for encoding series in charts; identity colour is chosen by the person, persists, and pairs an accent with a wash. Until W4 ships these names, DocT's `--hl-*` pairs stand in; at W4 they become aliases of the Weft tokens so nothing in DocT moves twice. Channels: colour is identity. — issue: #31

#### Changes to existing primitives

**`sheet` — bottom variant with a drag handle.** `side="bottom"` gains the phone treatment: an opaque `--weft-paper` bg (never inherited from the column it replaced), 1px `--weft-rule` top border, `--weft-radius-card` on the top corners only, shadow `0 -8px 24px` text/ink at 18%, a 36×4 `--weft-rule-strong` drag handle centred 6px from the top, and a 28×28 close button (text/muted, `--weft-radius-card`, hover text/ink on `--weft-fill-soft`) at the header's right. Heights: `min(70vh, 560px)` for a panel sheet; `max-height 80vh` for a popover that became a sheet. Sits above `bottom-bar` (`bottom: 52px`) when one is present, else at the edge. Backdrop `--weft-overlay`; Escape, the scrim and the close button close it; focus moves in on open and back to the trigger on close. Reduced motion: no slide. Tablet uses the existing left/right sides at 288px (tree) and `min(360px, 70vw)` (rail panel) with the same close button. — issue: #40

**`badge` — spinner slot for `claimed`.** The queue states of an agent-submitted thread map to `badge` variants — `pending` → `info` ("Queued"), `claimed` → `warn` ("Agent working"), `acknowledged` → `success` ("Acknowledged"), `resolved` → `secondary` ("Resolved") — and `claimed` needs a leading spinner the primitive has no slot for: a 7px ring, 1.5px `currentColor` border with the right edge transparent, rotating once per 0.9s, linear, infinite; reduced motion: a static ring. The reference draws the queue pill at mono 9.5 at 700, `--weft-radius-pill`, `padding 1px 6px`, a 1px border in the state colour at 45–55% alpha over a 12–20% tint of the same colour, text/ink; `resolved` is `--weft-fill-soft` with a `--weft-rule` border. Text stays mono caps here only when the pill sits inside a dense panel (§ Casing on app surfaces); in the comments rail it reads sentence case. — issue: #41

**`avatar` — identity variant.** `Avatar` gains an `identity` prop naming a palette entry (or `none`): fallback bg `--weft-identity-wash`, 1px `--weft-identity` border, initials in `--weft-on-identity` — mono at 700: 9px at 24, 11px at 32, 13px at 40. Sizes: 24 (inline in a thread or a member row), 32 (compact default), 40 (marketing default and the hover-card). Neutral (no identity) stays `--weft-fill-soft` on `--weft-rule` with text/ink initials. Stacked group: each avatar after the first overlaps by 6px with a 2px `--weft-paper` ring. An agent's avatar uses the same variant; its "(A)" suffix lives in the name, not the initials. Initials keep caps (an identifier). — issue: #42

**`tabs` — sentence case (and the face to rule).** Casing is settled by the 2026-09-01 ruling (the entry above already reads sentence case). The reference draws the sidebar's view tabs — Document tree / Kanban board — in Inter Tight 11.5 at 500 (600 when active), `gap --weft-space-4`, padding `3px 0 6px`, a 2px `--weft-blue` underline overlapping the 1px `--weft-rule` list border, inactive text/muted, hover text/ink, active text/link; the entry specifies the mono face at 13 / 0.15em. Since W4's showcase must match the frozen reference, the ticket asks the owner to rule the face for app tabs, with the reference (sans) as the default; the mono spec stays for marketing density unless the ruling says otherwise. — issue: #43

**`eyebrow-label` — sentence case on app surfaces.** The entry above now reads sentence case under the ruling, but the shipped primitive still applies `uppercase`; W4 drops it (keeping the tracking) and Heddle's gallery re-captures. Until then the doc and the code disagree, which is why this is a ticket and not a note. — issue: #44

#### Patterns (compositions of existing primitives)

**`filter-popover`** — search + chip groups + a count, on the `popover` shell: width 236 / 280, `max-height min(400px, calc(100vh - 24px))` with internal scroll, padding `--weft-space-3`, anchored 8px below the sidebar's filter trigger. Group headings: mono 10.5 / 11.5 at 500 text/muted, sentence case. Groups in order: **Name** — an `input` at `--weft-control-h-sm` with placeholder "Filter by name..."; **Listeners** — Listening now, Queued, All addressed, My agents, Others' agents (no Unread; owner ruling 6); **Type** — Documents, Plans, Collections, Folders, Spaces; **Health** — Active, Work in progress, Stale; then Status, Visibility, Board column, Comments. Chips are toggle buttons (`aria-pressed`) styled on `badge`: `--weft-radius-pill`, 1px `--weft-rule`, `--weft-paper` bg, text/muted 12 / 13 at 600, min-height `--weft-touch-target`, padding `4px 9px`, a leading 6px dot in the state colour (Listeners, Health) or a 14px lucide icon (Type); hover text/ink on a `--weft-rule-strong` border; pressed bg `--weft-blue` at 15%, border `--weft-blue` at 40%, text `--weft-blue-ink` (text/link in dark). Logic: AND across groups, OR within; owner chips narrow within the chosen states. Count line: 11.5 text/muted, "{n} documents match" — folders are not counted — with "· {m} queued with no listener yet" when My agents would hide queued-unclaimed plans. The same predicate narrows the `board`. Keyboard: Tab through the input and chips, Escape closes and returns focus to the trigger. Phone: a bottom `sheet`. — issue: #45

**`share-flyout`** — the access sentence + member list + one action, on the `popover` shell: width 288 / 320, same max-height and padding as above, anchored 8px below the header's single Share button (the button shows a lock glyph on a personal-workspace document). Heading "Who can see this" mono 10.5 at 500 text/muted. Access card: `--weft-fill-soft` bg, 1px `--weft-rule`, `--weft-radius-card`, padding `--weft-space-3`, a 16px lucide icon beside a 13 at 600 title and an 11.5 text/muted description — "Everyone in Shared: this document lives in the Shared workspace, so every member of it can open, edit and comment on it" / "Only you and your agents: this document lives in your personal workspace" — followed by the sentence that access is per workspace and membership is managed by an admin. Members heading "Shared workspace members" / "Your workspace"; rows (`padding 5px 2px`, 12.5): `avatar` 22 identity variant, name, and the join date mono 10 text/muted pushed right; people first, then the workspace's agents with their "(A)" names. One action, a full-width primary `button` (`--weft-blue`, `--weft-on-blue`, margin-top `--weft-space-3`): "Move to my personal workspace" / "Move to Shared", calling the existing transfer with its existing semantics, and the flyout says beforehand that a listening agent keeps listening after the move. Never an invite, a role control or a per-document setting. Keyboard: Tab through the rows' avatars is skipped (rows are static); the action is the one tab stop after the trigger; Escape closes. Phone: a bottom `sheet`. — issue: #46

**`person-hover-card`** — the content of a `hover-card` opened from a person in the header: width 300, padding `--weft-space-4`, a column with `--weft-space-3` gaps, no shadow. Top row: `avatar` 40 identity variant beside the name 14.5 at 700, the handle mono 11 text/muted, and — for an agent — a pill reading "Agent" (mono 10 at 600, `--weft-blue` bg, `--weft-on-blue`, `--weft-radius-pill`), plus a 7px `--weft-ok` live dot when the person is present in the document. Then `stat-row`s (label min-width 78: Documents, Last active, Owner for an agent). Actions row: two buttons at flex 1, min-height 30 / 36, 12.5 at 600, 1px `--weft-rule-strong` border, `--weft-radius-card`, hover `--weft-blue` border and text — "Documents" (navigates to the person's documents) and "Mention" (inserts a mention at the caret). Opens on hover after the `hover-card` delay and on focus; every action resolves to a real route. — issue: #47

**Responsive workspace — tablet** (`tablet`, 768–1199, the reference at 1024): the grid becomes `56px minmax(0, 1fr) auto` with explicit `grid-template-areas: "side main rail"` so an item leaving flow cannot shift the others; the resizers are hidden. The sidebar collapses to the `sidebar` collapsed state — a 56px icon rail carrying the avatar, a documents button and the space icons — and the tree opens as a left `sheet` at 288px over the content with `--weft-shadow` and the close button; choosing a document closes it. The rail strip stays; its panel becomes a right `sheet` at `min(360px, 70vw)` anchored to the strip, closed by default, a second tap on the active strip icon closes it; the comments rail is a sheet below 1280. The document region is present and unobscured on load. — issue: #48

**Responsive workspace — phone** (`mobile-portrait`, < 768, the reference at 390): one column, `grid-template-areas: "main"`, viewport height. A mobile bar (bg `--weft-paper`, 1px `--weft-rule` bottom, padding `--weft-space-2 --weft-space-3`): the sidebar trigger and the document title 13 at 500 with an ellipsis. The tree is a left `sheet` at `min(320px, 86vw)`. The rail is `bottom-bar` + a bottom `sheet`; anchored popovers (`filter-popover`, `share-flyout`, notifications) and `comment-composer` become bottom sheets with the drag handle; `selection-toolbar` docks above the bar. The crumb row splits into two rows: the trail scrolls horizontally on its own line (no visible scrollbar, each crumb a 24px-tall inline flex), the `listener-pill` sits beneath it. The document head wraps: the title takes a full line at 28px, then a row with Share on the left and the menu at the right edge (owner ruling on the Three Widths artifact, 2026-09-02). Horizontal paddings drop to `--weft-space-3`; the main region keeps 52px of bottom padding; `board` columns are 240px in a horizontal scroll. Nothing scrolls horizontally at the page level; every control meets the 24px floor, primary actions 44. `mobile-landscape` (≤ 900 × ≤ 500) has no reference capture; the same invariants hold there. — issue: #49

---

## Surface composition examples

Two recipes the audit foreshadowed:

**App page header (compact)** — `data-density="compact"` at root. Sticky header bar (Nav anatomy from Weft), main content uses Body/Small as default body. Tables, forms, dialogs all inherit the compact density tokens. Sidebar present, with selected item in `--weft-yellow-soft`.

**Marketing page (default)** — no `data-density` attribute. Hero in Display/Display, lede in Body/Lede, sections at `--weft-section-pad-y` (110px). Maturity grid + ecosystem grid + flow diagram all at marketing density. Buttons 44px tall.

The same `<Button>` React component renders both — it reads `var(--weft-control-h)` which resolves per density mode. Same component, different surface.

---

## Migration plan reference

The audit's phase 2 plan is the implementation arm of this spec. To recap:

1. Add `src/styles/weft.css` with all `--weft-*` tokens (light + dark + density). Import after `theme.css`.
2. Update `theme.css` shadcn tokens to bind to Weft tokens per the bridge table above. Done in one file edit.
3. Re-skin shadcn primitives in dependency order: Button → Input → Card → Dialog → Dropdown → Table → Sidebar. Each primitive's existing classes get tweaked to read Weft tokens; no new components.
4. Surfaces opt in to the new theme by setting `data-theme` and `data-density`. The migration rule from `04-design-system.md` holds: a surface is fully Weft or fully pre-Weft. No mixed namespaces on one tree.

Detailed phasing belongs in the implementation plan, not the spec. This doc is the contract; the plan is the schedule.

---

## HUD-lock decision system

When a surface ships, decide upfront: does it lock to the HUD-Glass palette regardless of the user's picker choice, or does it respect whatever palette the user picked? The three rules below resolve this for any surface in the app.

### Rules

**Rule 1 — Functional dark glass.** A surface that floats over arbitrary content (always-on-top overlays, floating diagnostic panels, callouts pinned over a canvas) needs visual separation from whatever's behind it. The dark glass is *functional* — it carves the foreground from a variable, unpredictable background. → **HUD-lock.**

**Rule 2 — Behind-the-curtain context.** A surface whose role is to inspect, debug, or operate the system underneath the user's normal flow (HUD console, agent inspector, raw signal feed, dev tools). The dark glass is *contextual* — it tells the user "you're looking at the machinery, not the product." → **HUD-lock.**

**Rule 3 — Default to the user.** Anything that doesn't trigger Rule 1 or 2 respects the picker. Primary app views, settings, lists, modals, dropdowns, tooltips, navigation, marketing — these follow whatever palette the user selected. The user owns their environment.

### Decision matrix

| Surface category | Default behavior | Trigger rule |
|---|---|---|
| Always-on-top toast / floating action callout | HUD-lock | 1 |
| Floating diagnostic panel over canvas | HUD-lock | 1 + 2 |
| Agent inspector / system console / signal feed | HUD-lock | 2 |
| HUD toolbar (existing) | HUD-lock | 1 + 2 |
| Primary app pages (home, lists, detail views) | Respects picker | 3 |
| Settings / preferences | Respects picker | 3 |
| Modal dialog | Respects picker (follows host theme) | 3 |
| Sheet / drawer | Respects picker | 3 |
| Dropdown / popover / tooltip | Respects picker | 3 |
| Documentation surface | Respects picker | 3 |
| Marketing / public pages | Pinned default Weft *(no picker exposed)* | Separate rule — see Themes section |

### Surface inventory

Apply the rules to each registered surface during migration. Template:

| Surface | Path | Trigger rule | Decision | Notes |
|---|---|---|---|---|
| HUD Toolbar | `src/app/components/.../HUDToolbar.tsx` | 1 + 2 | HUD-lock | Functional separation + diagnostic context |
| HudIssueCallout | `src/app/components/ui/HudIssueCallout.tsx` | 1 + 2 *(when used as overlay)* / 3 *(when used inline on a Weft surface)* | Context-dependent | When inline on a Weft page, swap to `alert` anatomy per the per-primitive section above |
| *(...rest pending application of the rules during migration)* | | | | |

Inventory completion is part of the migration task, not this spec. The rules + matrix are the contract; filling the surface table is implementation work.

---

## Next phase — Panel-builder bespoke blocks

`manifest.json.panelBuilder.blockTypes` lists 14 block types. The mapped ones (`text-input` → Input, `select` → Select, `checkbox` → Checkbox, `textarea` → Textarea, `date-input` → Calendar+Input, `number-input` → Input, `tab-group` → Tabs, `toggle` → Toggle, `submit-button` → Button) inherit Weft anatomy automatically once the corresponding primitive is re-skinned.

The bespoke blocks need their own Weft skin pass:

- `signal-list` — a list view of signal records. Likely a Table or stacked Card variant with item-level density.
- `signal-stats` — aggregate stats display. Likely cards with Fraunces numerals (echoes `.hero-stat`) at app density.
- `signal-filters` — filter controls. Could be Toggle-Group, Select, and Input compositions.
- `repeat-list` — repeating editable rows. Table-like, with row-level add/remove affordances.
- `output` — display block. Surface/paper card, Body/Default body, optional code/result formatting.
- `preview` *(template: session-recap)* — a preview panel for a recap. Composed of header + sections + actions.

**Process for each bespoke block** *(approved):*

1. **Mock up the proposed Weft skin** as a static visual — Figma frame, an exported PNG, or an annotated screenshot. Show the block in default Weft palette + compact density.
2. **Surface for approval.** No code changes to the block until the mockup is signed off.
3. **Edit the actual primitive** in `src/app/components/...` — change CSS classes, swap token references, restructure markup if needed. Tech stack stays as-is (React + Radix + shadcn).
4. **Validate.** Render the block in a panel-builder surface and verify it reads correctly under each user-selectable palette (default Weft, heritage purple, HUD glass).

This is the next discrete phase of work after this spec lands.

---

## Open questions

Most prior items resolved (see Resolved table). What's still outstanding:

- **Tooltip in dark mode.** Tooltips ship `surface/ink` dark in both light + dark modes (theme-invariant). Re-test legibility on actual dark surfaces — the same dark-on-dark could lose separation. May need a dedicated `--weft-tooltip-bg` that flips. **Deferred — revisit during a future Phase 4 (post-implementation QA on dark surfaces).** Not blocking; tooltip styling holds in light mode and degrades acceptably in dark.

### Resolved (applied above)

| Question | Resolution |
|---|---|
| Theme architecture | Weft is the system everywhere. Palette + font alternatives plug into Weft via `data-palette` / `data-fonts` attributes. |
| Theme defaults + persistence | Marketing pinned to default Weft. App surfaces use the existing HUD theme picker. New users land on Weft default. |
| Chart palette | Weft-aware categorical ramp shipped: brand/blue, state/stop, --weft-ok, --weft-warn, illust/sepia. |
| Sidebar collapse state | Collapsed sidebar uses neutral treatment (no brand/yellow accent); 1px text/link left-border indicator on the active icon. |
| Calendar density floor | AAA 44×44 is not a target. AA 24×24 floor only. |
| `--weft-link-visited` | Approved and added. Light: muted purple `#5b3d99`. Dark: lighter purple `#b8a3e8`. Calibrate hex during accessibility pass. |
| HUD vs. Weft cohabitation | HUD-lock decision system added above (3 rules + decision matrix). Per-surface inventory is implementation work that happens during migration. |
| Panel-builder bespoke blocks | Promoted to Next phase. Mockup → approval → code-edit cycle approved. |
| Document-view definitions (W3) | Twelve additions, five changes and five patterns defined in § Document surfaces with a `Nodaste-Lab/weft` issue each (#28–#49); DocT implements to them, W4 ships them. |
| Casing on app surfaces | Owner ruling 2026-09-01: all caps only for technical labels in dense info areas (table headers, stat-row labels, panel badges, avatar initials); sentence case for headers, sections, tabs and one-off labels. Recorded in [[05-copy-guidance]] § When caps; applied in § Casing on app surfaces. |

---

## Cross-references

- [[04-design-system]] — the Weft spec this doc extends. Read first.
- [[03-color-and-type]] — palette, type roles, functional state guidance (`ok` / `warn` / `stop` rule).
- [[05-accessibility]] — full contrast audit. Density tokens here don't loosen a11y; the floor remains.
- [[05-copy-guidance]] — § When caps holds the owner's casing ruling verbatim; § Casing on app surfaces above is its application to these primitives.
- DocT plan *Port the designed document view into DocT with every feature honest* (https://doct.nodaste.com/d/mL10IjAsSsC8oKN3hc0UVg) — the gap register § Document surfaces answers, and the design reference its entries describe.
- [[02-logo-usage]] — logo asset variants. App surfaces typically use `heddle-mark.svg` at 24-32px, not the lockup.
