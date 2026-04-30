---
linked_project: Heddle Branding
type: design-system
name: Weft
status: draft
updated: 2026-04-28
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
  --weft-ok:     #3A7A4A;   /* AA 4.71:1 on cream — synced/healthy/success */
  --weft-warn:   #C39432;   /* AA 3.71:1 on cream (large only); pair with text/ink for body */
  --weft-stop:   #a8382b;   /* unchanged */
}
```

`--weft-warn` is AA-large only on cream — pair with `text/ink` for body-sized warnings, reserve the warn color for borders, badges, and large icons. Document with the same calibration line as `--weft-stop`.

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
| `--input` | `var(--weft-paper)` | Filled-input background |
| `--input-background` | `var(--weft-paper)` | |
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
  --weft-chart-4: var(--weft-warn);    /* #c39432 — divergent amber */
  --weft-chart-5: var(--weft-sepia);   /* #8c6f4a — warm brown from illustration palette */
}
```

Bridges to shadcn's `--chart-1` … `--chart-5`. Heritage Purple palette overrides this with its own ordinal purple ramp (the existing values in `theme.css`); HUD palette uses brighter analogs of the same five categories on its dark surface.

For sequential and diverging palettes (different from categorical), Weft doesn't ship defaults — design per chart context using brand/blue or brand/yellow as the anchor. Document as needed when a sequential chart actually ships.

---

## Per-primitive Weft anatomy

41 primitives in `manifest.json`, organized by category. Each entry below describes the Weft skin in terms of existing tokens. The actual primitive code (Radix + shadcn) is preserved.

### Layout

**`card`** — surface/paper fill, border/rule stroke 1px, radius/card. Header padding `--weft-stack-gap × 2`. Body padding `--weft-stack-gap × 1.5` in marketing, `--weft-stack-gap` in compact. Footer separator: 1px border-top in border/rule.

**`separator`** — 1px line in border/rule for solid, dashed (`dashPattern: [4, 4]`) for soft separation between related content.

**`aspect-ratio`** — pure layout, no skin.

**`scroll-area`** — track transparent, thumb 6px wide bound to text/muted at 40% alpha, 999px radius. Hover: thumb darkens to text/muted at 60%.

**`resizable`** — handle 4px wide, transparent default, hover bg border/rule. Active drag: bg border/rule-strong.

**`sidebar`** — surface/paper fill, border/rule right border, density-compact heights for items (`--weft-row-h`).

- *Expanded state*: active item gets brand/yellow-soft bg + 3px brand/yellow left-border (the "you are here" treatment, mirroring the maturity row Here state). Item label Inter Tight, icon 16×16 in text/muted (default) → text/ink (active).
- *Collapsed state* (icons only): drop the brand/yellow accent. Active item gets a neutral treatment instead — icon flips from text/muted to text/ink, plus a subtle 1px text/link left-border indicator (still readable, not loud). The brand-yellow row would be visual noise without the surrounding label content; neutral keeps the dense icon column scannable.

### Disclosure

**`accordion`** — items separated by 1px border/rule bottom. Trigger row at `--weft-row-h`, Inter Tight Medium 14/16, text/ink. Chevron icon 16×16 text/muted, rotates 180° on open. Content padding `--weft-stack-gap` left+right, body in Body/Small or Body/Default per density.

**`collapsible`** — minimal shell, no border by default. Trigger reveals content with no animation override.

**`tabs`** — tab list in HORIZONTAL row, gap 0, 1px border/rule bottom under the list. Each tab: padding 12/16 (compact 8/14), Label/Default mono caps 13 / 0.15em / text/muted (inactive), text/link (active). Active tab gets 2px brand/blue bottom border that overlaps the list border. Hover (inactive): text/ink.

### Overlay

**`dialog`** — backdrop `--weft-overlay`. Content frame: surface/paper, border/rule 1px, radius/card 4px, max-width 480px (compact) / 600px (marketing), padding 32px (compact) / 40px (marketing). Header: title in Heading/H3 + description in Body/Default text/muted. Footer: right-aligned button row, gap `--weft-control-gap`. Dialog has Focus Ring on focused buttons.

**`alert-dialog`** — same shell as dialog. Destructive action button: bg state/stop, text on-blue/text white. Pair with iconography in state/stop.

**`popover`** — surface/paper, border/rule 1px, radius/card, padding 16px (compact) / 20px (marketing), max-height 400px with internal scroll-area. No backdrop. Anchor offset 8px. `--weft-overlay` is NOT used — popovers are anchored, not blocking.

**`hover-card`** — same as popover but smaller default size (max-width 320px). Lower elevation visually (no shadow needed; the border/rule + paper fill is enough on cream).

**`sheet`** — edge-mounted drawer. Backdrop `--weft-overlay`. Content: surface/paper, border/rule edge stroke, no radius on the docked edge, radius/card on the free edges. Width 400px (right/left) or full bleed (top/bottom). Same close button + header pattern as dialog.

**`tooltip`** — tooltip content: surface/ink fill (always dark, mode-invariant — tooltips read across light/dark contexts), on-blue/text white text at Body/Small, padding 6/10, radius/chip 2px, max-width 240px. Arrow optional (lucide chevron). No focus ring (tooltips don't take focus).

### Menus

**`dropdown-menu`** — same shell as popover. Items at 32px (compact) / 36px (marketing) with 12px horizontal padding. Item label Body/Small, icon 16×16 text/muted left-aligned. Hover row: bg `--weft-on-blue-bg` (cream-aware: in compact, treat as "subtle blue tint"), or alternative `border/rule` at 30% alpha. Active/selected: bg `--weft-yellow-soft`. Separator: 1px border/rule. Section label: Label/Small mono caps text/muted with 8px top/bottom padding.

**`context-menu`** — identical to dropdown-menu in skin. Trigger context is gesture, not button; styling is the same.

**`menubar`** — top bar of menu triggers. Each trigger: padding 6/12, Label/Default mono caps text/ink (default), text/link (hover). Open menu uses dropdown-menu skin.

### Navigation

**`breadcrumb`** — items in Body/Small text/muted, separator slash in text/muted at 50% alpha. Active item text/ink. Hover: text/link with 1px underline at link color. Compact density: gap 6px between items; marketing: gap 8px.

**`navigation-menu`** — top-level triggers in Mono Caps Label/Default text/ink. Hover: text/link. Active triggers: bg `--weft-yellow-soft`. Open viewport: surface/paper card with border/rule 1px, radius/card.

**`pagination`** — pill-shaped buttons (radius/pill), Inter Tight Regular 13. Default: text/muted, no border. Active: bg brand/blue, text on-blue/text. Hover (inactive): bg cream at 50% alpha.

### Inputs (heavy)

**`input`** — see Weft v1 Input on the Form inputs page. Density: 36px tall in compact, 44px in marketing. Padding `--weft-control-pad-x`. Text size `--weft-control-text` (14 in compact, 16 in marketing). Focus uses global Focus Ring. Error state: border state/stop + below-input hint in state/stop at Body/Small.

**`textarea`** — same shell. Min-height: 80px (compact) / 96px (marketing). Resize: vertical only.

**`select`** (Radix-based, not native) — trigger styled like Input with chevron lucide icon at right (16×16, text/muted). Content: dropdown-menu shell. Selected indicator: check mark in brand/blue at 14px.

**`checkbox`** — see Weft v1 Checkbox. 18×18 in marketing, 16×16 in compact. Touch wrap respects `--weft-touch-target`.

**`radio-group`** — see Weft v1 Radio.

**`slider`** — track 4px (compact) / 6px (marketing) tall, bg border/rule, fill brand/blue from 0 to value. Thumb: 16×16 (compact 14×14), surface/paper fill, 2px brand/blue stroke, radius/dot. Focus: Focus Ring on thumb. Range slider (two thumbs): same thumb styling, fill spans between thumbs.

**`calendar`** (react-day-picker) — header row: month/year in Heading/H3 / Body/Default Medium center, navigation lucide chevrons left/right (24×24, text/muted). Weekday labels: Label/Small mono caps text/muted. Day cells: 32×32 (compact) / 40×40 (marketing), rounded radius/card. Today: bg `brand/yellow-soft`. Selected: bg brand/blue, text on-blue/text. Hover: bg cream. Out-of-month: text/muted at 50% alpha. AA 24px touch-target floor is met at both densities; AAA 44×44 isn't a target for this primitive.

**`label`** — Body/Small Medium in marketing, Label/Small mono caps in compact form layouts. text/muted color. Required indicator: `state/stop` asterisk after the label, no extra space.

**`form`** — wrapper for label + control + hint, mirrors the Field component from Weft v1. Compact: stack gap 4px between label/control, 4px between control/hint. Marketing: 8px each.

### Toggles

**`toggle`** — pressed state: bg brand/blue, text on-blue/text. Unpressed: bg transparent, text text/muted, hover text/ink + bg `--weft-on-blue-bg` at cream-tinted alpha. Padding 6/12 (compact) / 8/14 (marketing). Radius/card.

**`toggle-group`** — toggles joined edge-to-edge with a single shared border/rule. Selection logic single (radio-like) or multi (checkbox-like) per Radix.

**`switch`** — track 36×20 (marketing) / 28×16 (compact) with radius/pill. Off: track bg border/rule, thumb fixed/white. On: track bg brand/blue, thumb fixed/white shifted right. Focus: Focus Ring on the track. Touch wrap min-height respects `--weft-touch-target`.

### Feedback

**`alert`** — surface/paper bg, 4px left-border in the relevant state color (state/stop, `--weft-ok`, `--weft-warn`, brand/blue for info). Icon at top-left, 20×20, in the state color. Title in Body/Default Medium text/ink. Body in Body/Small text/muted. Padding `--weft-stack-gap` × 1.5.

**`badge`** — extends the Weft Pill anatomy. Default: brand/yellow bg, brand/blue-ink text, mono caps Label/Small. Variants: `info` (brand/blue + on-blue/text), `success` (`--weft-ok` + on-blue/text), `warn` (`--weft-warn` + brand/blue-ink), `destructive` (state/stop + on-blue/text).

**`progress`** — track height 6px (compact 4px), bg border/rule, fill brand/blue, radius/pill on both. Indeterminate: animated linear-gradient brand/blue → transparent → brand/blue; respects `prefers-reduced-motion`.

**`skeleton`** — bg `--weft-rule` solid (no animated shimmer in v1; if added, animation collapses under reduced-motion). Radius matches the element being represented.

**`HudIssueCallout`** — keep on HUD tokens for HUD surfaces. If used inside a Weft surface, swap the visual shell to `alert` with `state/stop` accent. Don't render HUD's dark glass on a Weft cream/paper surface — visual mismatch.

### Data display

**`avatar`** — circle, 32px (compact) / 40px (marketing), surface/paper bg, 1px border/rule. Fallback: initials in Label/Small mono caps text/ink, centered.

**`table`** — header row: Label/Default mono caps text/muted, padding `--weft-control-pad-x` left/right, 1px border/rule bottom. Body rows: Body/Small (compact) or Body/Default (marketing), `--weft-row-h` tall, 1px border/rule between rows. Row hover: bg cream at 60% alpha (subtle, density-aware). Selected row: bg `brand/yellow-soft`. Captions: Body/Small text/muted above table.

### Heddle-specific primitives (added 2026-04)

These eight primitives were added during the Heddle bypass-sweep pass. They consolidate patterns that repeated across panels and weren't covered by stock shadcn. All registered in `manifest.json`.

**`eyebrow-label`** — uppercase tracked-out section label. Resolves to JetBrains Mono automatically under `data-palette="weft"` via the global type rule. Variants: `size` (sm 10/0.10em, default 12/0.06em, lg 14/0.04em), `tone` (muted, default, accent), optional leading `icon` slot (12×12).

**`panel-header`** + slots (`PanelHeaderTitle`, `PanelHeaderActions`, `PanelHeaderDismiss`) — top strip of a HUD panel. Composable: each slot is a separate component so panels compose their own action sets without rebuilding the strip layout. Title slot accepts an icon. Dismiss slot renders an X close button on the right.

**`action-button-row`** — flex row container for grouped panel actions (Copy / Email / Vault / Generate). Standardizes gap 6px and offers `align` (start, end, between) so primary actions can sit at the right edge with the standard gap.

**`add-item-button`** — dashed-border "+ Add item" trigger. Used at the foot of editable lists (beats, decisions, tags). Default icon Plus 10×10, hover lifts border to brand/blue at 50% alpha and text to brand/blue.

**`pill-toggle-group`** + `pill-toggle-group-item` — gap-separated pill segmented control. **Distinct from shadcn `toggle-group`** which renders joined segments with shared borders. Use this for period selectors (This Session / Last 7 Days / etc.) and mode toggles where pills should breathe. Active pill: brand/blue at 15% bg + brand/blue-ink text + 40% brand/blue border. Inactive: paper bg + muted text. Wraps cleanly when options exceed the row.

**`stat-row`** — label-on-left, value-on-right key/value row with optional `hint` slot (small badge after the value). Used in PartyStats (HP / AC / temp HP), SessionContext (participant stats), BattleTracker (threat levels), recap detail sections.

**`empty-state`** — centered `icon` + `title` + `description` + optional `action` slot for "nothing to show yet" surfaces. `tone` variants: default (neutral muted) or warning (soft amber tint, used for "Add an OpenAI API key first" patterns).

**`source-pill`** — small monospace pill for file paths and origin tags (vault paths, signal sources). Inherits JetBrains Mono via the type rule. `truncate` (default true) clips long paths inside scrollable lists; `tone` (default, muted) lets the same pill recede in dense rows.

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

---

## Cross-references

- [[04-design-system]] — the Weft spec this doc extends. Read first.
- [[03-color-and-type]] — palette, type roles, functional state guidance (`ok` / `warn` / `stop` rule).
- [[05-accessibility]] — full contrast audit. Density tokens here don't loosen a11y; the floor remains.
- [[02-logo-usage]] — logo asset variants. App surfaces typically use `heddle-mark.svg` at 24-32px, not the lockup.
