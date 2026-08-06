---
title: Panel templates
linked_project: Heddle Branding
---

# Panel templates

A **component** is one control: a button, an input, a checkbox. A **template** is
a whole reviewed surface: its regions, its grid, its grouping semantics, and its
states. Templates exist because panel authors kept re-deriving the same operator
surface from tokens and landing somewhere slightly different each time.

Templates live in `css/weft-templates.css` and ship as
`@nodaste-lab/weft/templates.css` (also bundled last in `index.css`). They are
plain CSS, not React, so a sandboxed code-backed panel iframe can use them —
same rationale as the component layer.

## Load order

```
weft.css            tokens
weft-components.css a11y base (focus ring, reduced motion) + controls
weft-templates.css  templates          ← this layer
```

Templates assume the components layer is present: they never redefine the focus
ring, the reduced-motion override, or a canonical control. A template lays a
control out; `.weft-checkbox` and `.weft-btn` still come from `weft-components.css`.

## Conventions

- Every class starts `weft-<template>-`. States are adjacent `.is-*` classes.
- Token-only. Gated by `scripts/check-raw-colors.mjs`.
- **A template never pins a palette.** It renders light and dark from the same
  semantic tokens and follows the active theme.
- Interactive rows and controls hold a ≥ 24px touch target.

---

## `weft-board` — operator action board

Ported from the reviewed Updates Dashboard surface (Heddle NOD-1254,
`claude/updates-dashboard-board-surface`). Use it for "what needs me, across
everything" surfaces: a filter rail beside an action list grouped by urgency,
with a compact variant for narrow slots and a drawer for one item's detail.

### Region map

| Region | Canonical class / component |
|---|---|
| Scope | `.weft-board` |
| Header | `.weft-panel-header[data-size="board"]` / `<PanelHeader size="board">` |
| Body grid | `.weft-board-body` (258px rail + fluid detail) |
| Filter rail | `.weft-board-rail`, `.weft-board-rail-section`, `.weft-board-rail-label` |
| Search | `.weft-input` (real `<input type="search">`) / `<Input>` |
| Segmented toggle | `.weft-toggle-group.is-joined` / `<ToggleGroup joined>` |
| Checkbox rows | `.weft-board-checks`, `.weft-board-check` (`.is-disabled`), `.weft-board-check-note` + `.weft-checkbox` |
| Preset picker | `.weft-select` (real `<select>`) / `<Select>` |
| List column | `.weft-board-detail` |
| List header | `.weft-board-context`, `.weft-board-context-sub`, `.weft-board-context-note` |
| Degradation toast | `.weft-board-toast`, `.weft-board-toast-icon`, `.weft-board-toast-sub`, `.weft-board-toast-retry`, `.weft-board-toast-close` |
| Priority tier | `.weft-tier-group` (`.is-blocked` / `.is-awaiting` / `.is-fyi`) / `<TierGroup>` |
| Status dot | `.weft-dot` (`.is-ok` / `.is-warn` / `.is-stop` / `.is-info`) / `<Dot>` |
| Action row | `.weft-hud-list-row`, `.weft-hud-list-row-col`, `.weft-hud-list-row-title`, `.weft-hud-list-row-meta`, `.weft-hud-list-row-aside` / `<HudListRow>` |
| Row chips | `.weft-badge.is-space` for workspace; `.weft-badge.is-outline` for type |
| Provenance | `.weft-badge.is-outline` + tone modifier (`.is-ok` / `.is-info` / `.is-warn`); `.weft-board-legend`, `.weft-board-legend-item` |
| Drawer | `.weft-board-drawer` (`.is-wide`), `.weft-board-drawer-body`, `.weft-board-drawer-prov` |
| Drawer header | `.weft-panel-header[data-size="board"]` / `<PanelHeader size="board">` |
| Reference row | `.weft-copyable-ref`, `.weft-copyable-ref-copy` / `<CopyableRef>` |
| Reply field | `.weft-textarea` (real `<textarea>`) / `<Textarea>` |
| Action row | `.weft-action-button-row`; `.weft-action-button-row-trailing` for the trailing link slot / `<ActionButtonRow>` |
| Button | `.weft-btn`, `.weft-btn.is-ghost`, `.weft-btn.is-link` / `<Button>` |
| Status chip | `.weft-badge.is-status` + tone / `<Badge variant="status">` |
| Compact variant | `.weft-board-panel`, `.weft-board-panel-head`, `.weft-board-panel-body` + `.weft-stat-row` / `<StatRow>` |

### Skeleton

```html
<!-- The 34px control tier comes from data-density="dense" on :root (<html>),
     set by the application as a user preference. It is not board-scoped —
     weft.css carries :root selectors only, because it is injected verbatim
     into sandboxed panel iframes. Without it, controls use the 44px default. -->
<section class="weft-board">
  <!-- Header: use the canonical panel-header component -->
  <div class="weft-panel-header" data-size="board">
    <div class="weft-panel-header-title">Updates dashboard</div>
    <div class="weft-panel-header-actions">
      <button type="button" class="weft-btn is-ghost" aria-label="Refresh board">⟳</button>
    </div>
  </div>

  <div class="weft-board-body">
    <aside class="weft-board-rail">
      <!-- Real form controls with accessible labels -->
      <label class="weft-field-label" for="board-search">Search projects</label>
      <input id="board-search" class="weft-input" type="search" name="q" placeholder="Search…">

      <div class="weft-board-rail-section">
        <span class="weft-board-rail-label">Relatedness</span>
        <!-- Joined segmented toggle: real buttons with aria-pressed -->
        <div class="weft-toggle-group is-joined" role="group" aria-label="Relatedness">
          <button type="button" class="weft-toggle-group-item" aria-pressed="false">Direct only</button>
          <button type="button" class="weft-toggle-group-item is-on" aria-pressed="true">Expanded</button>
        </div>
      </div>

      <div class="weft-board-rail-section">
        <span class="weft-board-rail-label">Filter by spaces</span>
        <div class="weft-board-checks">
          <label class="weft-board-check">
            <input type="checkbox" class="weft-checkbox" name="sp-studio" checked> Nodaste Studio
          </label>
          <label class="weft-board-check is-disabled">
            <input type="checkbox" class="weft-checkbox" name="sp-archive" disabled> ccore/archive
            <span class="weft-board-check-note">unreachable</span>
          </label>
        </div>
      </div>

      <label class="weft-field-label" for="board-since">Updated since</label>
      <select id="board-since" class="weft-select" name="since">
        <option value="">Any date</option>
        <option value="7d">Last 7 days</option>
      </select>
    </aside>

    <div class="weft-board-detail">
      <div class="weft-board-context">
        <h3>All open action items</h3>
        <div class="weft-board-context-sub">across 4 spaces · ranked by what needs you first</div>
      </div>

      <!-- Priority tier: use weft-tier-group. Never render an empty tier. -->
      <div class="weft-tier-group is-blocked" role="region" aria-label="Blockers">
        <div class="weft-tier-group-head">
          <span class="weft-dot is-stop" aria-hidden="true"></span>
          Blockers <span class="weft-tier-group-sub">act now</span>
          <span class="weft-tier-group-count">1</span>
        </div>
        <!-- Action row: weft-hud-list-row. Rows that open a drawer are real
             controls — use <button> + .is-interactive so they are keyboard
             reachable and announced. A display-only row stays a <div> with no
             .is-interactive and therefore no pointer affordance. -->
        <button type="button" class="weft-hud-list-row is-interactive">
          <div class="weft-hud-list-row-col">
            <div class="weft-hud-list-row-title">Account Recovery dependency unresolved</div>
            <div class="weft-hud-list-row-meta">Blocked · 5d — oldest open item</div>
          </div>
          <div class="weft-hud-list-row-aside">
            <span class="weft-badge is-space">ccore/heddle</span>
            <!-- Evidence chip: only if relation evidence is present -->
            <span class="weft-badge is-outline is-info">direct</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</section>
```

### Grouping semantics

The tiers group by **what the operator must do**, not by data type — a signal, a
decision, and a clarification all sit in `is-awaiting` if they need a response.
This is the load-bearing idea of the template; a board that groups by record type
recreates the inbox it was meant to replace.

Ordering within the board is urgency-first: `is-blocked` → `is-awaiting` →
`is-fyi`.

### Provenance

Evidence chips explain why a row is on the board. **Never invent provenance** —
a row whose payload carried no relation evidence gets no chip rather than a
guessed one. Use `.weft-badge.is-outline` with a tone modifier:

- `.is-ok` — alias match
- `.is-info` — direct canonical match
- `.is-warn` — trace link

Absence of evidence = no badge element rendered at all.

### Item drawer

The drawer is an inline detail panel, not a modal. Its header uses the canonical
panel header, its reference row uses `.weft-copyable-ref`, and its reply field
uses a real `<textarea class="weft-textarea">`. Actions go in `.weft-action-button-row`;
a trailing link gets wrapped in `.weft-action-button-row-trailing` to push it to
the far right without descendant-selector child styling.

**One primary per action row.** Exactly one filled `.weft-btn` — the action you
want taken. Every sibling is `.is-ghost` or `.is-link`. Two filled buttons make
the operator choose between them instead of acting, which is the opposite of what
a board is for. Enforced by `npm run test:template-contract`.

```html
<div class="weft-board-drawer">
  <div class="weft-panel-header" data-size="board">
    <div class="weft-panel-header-title">Ticket title</div>
    <div class="weft-panel-header-actions">
      <span class="weft-badge is-space">signal</span>
      <button type="button" class="weft-btn is-ghost" aria-label="Close">×</button>
    </div>
  </div>

  <div class="weft-copyable-ref">
    <code>nod://ticket/NOD-1234</code>
    <button type="button" class="weft-copyable-ref-copy" aria-label="Copy reference">Copy</button>
  </div>

  <div class="weft-board-drawer-body">…body content…</div>

  <label class="weft-field-label" for="drawer-reply">Reply</label>
  <textarea id="drawer-reply" class="weft-textarea" name="reply" rows="2"
            placeholder="Reply…" aria-label="Reply to this item"></textarea>

  <div class="weft-board-drawer-prov">
    <b>Why you're seeing this:</b>
    <span class="weft-badge is-outline is-info">direct</span> tagged to Heddle UI
  </div>

  <div class="weft-action-button-row">
    <button type="button" class="weft-btn">Resolve for me</button>
    <button type="button" class="weft-btn is-ghost">Reassign</button>
    <span class="weft-action-button-row-trailing">
      <button type="button" class="weft-btn is-link">Open ↗</button>
    </span>
  </div>
</div>
```

### Compact panel variant

The narrow-slot variant swaps the full board for `.weft-board-panel` + `.weft-stat-row`
rows. The switch is measured on the slot width, not a media query, so the variant
follows the slot rather than the viewport. The reviewed surface switches at 720px.

### Degradation

When some sources fail, the board shows what it has and says what is missing
(`.weft-board-toast`: "1 of 5 spaces didn't respond" + retry). A board that
cannot load at all uses `EmptyState` or a `Callout variant="dashed"` — it must
never render an empty tier set, which reads as "nothing needs you".

---

## Rendered component breakdown

**Live annotated version: [panel-templates.html](panel-templates.html)** — every
part as a live specimen with its badge, in light and dark. Regenerate with:

```
python3 scripts/generate-panel-templates-page.py . /tmp
```

### Status key

| Key | Meaning |
|---|---|
| **REUSES** | The template composes an existing Weft primitive directly. |
| **DUPLICATES** | Weft has this; one board-local class remained (`.weft-board-toast`). |
| **PARTIAL** | Weft has something adjacent, but not an equivalent. |
| **NEW** | No Weft equivalent — width-measured variant switch. |

### Summary

The migration consolidated all board-local duplicates into canonical
`weft-components.css` primitives. Key mappings:

| Deleted board-local | Canonical replacement |
|---|---|
| Board header + title + refresh | `.weft-panel-header[data-size="board"]` / `<PanelHeader size="board">` |
| Search + preset picker | `.weft-input` / `.weft-select` with real `<input>`/`<select>` |
| Segmented toggle | `.weft-toggle-group.is-joined` / `<ToggleGroup joined>` |
| Urgency tier + head + count | `.weft-tier-group` / `<TierGroup>` |
| Status dot | `.weft-dot` / `<Dot>` |
| Action item rows + chips | `.weft-hud-list-row` / `<HudListRow>` |
| Space and type chips | `.weft-badge.is-space` / `.weft-badge.is-outline` |
| Evidence chips | `.weft-badge.is-outline` + tone modifier |
| Drawer header + close | `.weft-panel-header[data-size="board"]` / `<PanelHeader>` |
| Canonical reference row + copy | `.weft-copyable-ref` / `<CopyableRef>` |
| Reply div (display-only) | `.weft-textarea` (real `<textarea>`) |
| Drawer action row | `.weft-action-button-row` / `<ActionButtonRow>` |
| Drawer buttons + status | `.weft-btn`, `.weft-badge.is-status` / `<Button>`, `<Badge>` |
| Compact panel rows + count | `.weft-stat-row` / `<StatRow>` |
| Board notice | `<EmptyState>` / `<Callout variant="dashed">` |

---

## Open reconciliations

### 1. Scoped dark overrides are now redundant

The Heddle surface ships a generated block that re-declares `--weft-*` values
under `:root[data-theme='dark'] .ud-board-treatment`. Compared against weft 0.2.1
canonical dark, **17 of 19 overrides are byte-identical** — including the
`ok`/`stop` greens that the "green-400" thread was tracking. Only `--weft-muted`
and `--weft-info` diverge. This template takes canonical for both and needs no
override layer.

### 2. Rail control density (resolved)

The reviewed rail controls are 34px, tighter than `--weft-control-h` (44px, or
36px under `data-density="compact"`), because the rail stacks eight controls in a
258px column.

**Decided (2026-07-30): a real `dense` tier, and both tiers exist.** `compact`
keeps 36px untouched so nothing already using it moves, and `data-density="dense"`
adds the 34px tier. It is set on `:root` (`<html>`) by the application as a user
preference, not on the board — `css/weft.css` may only carry `:root` selectors
because it is injected verbatim into sandboxed panel iframes. Each tier also sets
`--weft-control-pad-y`, so `min-height` rather than padding governs the control
height and dense controls really are 34px.

### 3. Real form controls (resolved)

The reviewed mock drew its search field and preset picker as display-only divs and
its reply field as a display-only div with a placeholder icon. This template uses
real `<input>`, `<select>`, and `<textarea>` with explicit `<label>` elements or
`aria-label`. All accessible.
