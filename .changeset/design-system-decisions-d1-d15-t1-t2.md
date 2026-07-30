---
"@nodaste-lab/weft": minor
---

Implement design-system decisions D1–D15, T1, T2 for the operator-board surface.

**New primitives (D12, D13, D14):**
- `TierGroup` — urgency-toned priority tier (blocked/awaiting/fyi) with accessible `<section>` region and item count badge. Plain-CSS counterpart `.weft-tier-group` in `weft-components.css`.
- `Dot` — standalone semantic status dot (ok/warn/stop/info/muted). Decorative by default; pass `label` only when the dot alone carries meaning. Plain-CSS counterpart `.weft-dot`.
- `CopyableRef` — truncated canonical reference with accessible copy action (success/failure/revert states, `aria-live` announcement).

**Component surface additions (additive, non-breaking):**
- `Button`: `size="dense"` at 34px for operator-board drawer actions (D4).
- `Badge`: `count`, `space`, and `status` variants; `stop`, `warn`, `ok` tones for weft-token-aware coloring (D5, D15).
- `HudListRow`: `HudListRowProject` third caption level for project/space attribution (D1).
- `StatRow`: `variant="board"` and `leading` slot for dot + label + value readouts (D2).
- `ActionButtonRow`: `dense` prop and `trailingLink` slot for board drawer action rows (D3).
- `ToggleGroup` / `ToggleGroupItem`: `joined` variant for segmented controls (D7). Plain-CSS counterpart `.weft-toggle-group` / `.weft-toggle-group-item`.
- `Callout`: `dashed` variant (inline dashed-border notice) and `band` variant (full-width left-accented stripe) (D8).
- `EmptyState`: `variant="notice"` for left-aligned inline failure notices; `variant="centered"` (default) stays for genuine empty states (D9).
- `PanelHeader` / `PanelHeaderTitle`: `size="board"` for larger operator-board strip (D10).

**Token density axis (T2):**
- `data-density="dense"` at 34px control height (additive; `compact` at 36px unchanged). Board rail/drawer controls resolve to 34px automatically when the board root carries `data-density="dense"`.

**CSS component layer (weft-components.css):**
- `.weft-btn.is-link` — link-style inline action button (D4).
- `.weft-dot` — plain-CSS status dot (D13).
- `.weft-toggle-group` / `.weft-toggle-group-item` — joined segmented control (D7).
- `.weft-tier-group` and children — urgency-toned tier container (D12).
- `.weft-panel-header[data-size="board"]` — board-size panel header (D10).

**Template cleanup (weft-templates.css — breaking for weft-board only):**
Deleted board-local duplicates of canonical components per the plan. Consumers should migrate to the canonical classes listed above:
- `.weft-board-btn` / `.weft-board-status` → `.weft-btn` + `data-density="dense"` / `Badge variant="status"` (D4).
- `.weft-board-type` → `.weft-source-pill` or `<SourcePill>` (D6).
- `.weft-board-dot.*` → `.weft-dot` or `<Dot>` (D13).
- `.weft-board-tier*` → `.weft-tier-group` or `<TierGroup>` (D12).
- `.weft-board-notice` → `<EmptyState variant="notice">` or `<Callout variant="dashed">` (D9).
- `.weft-board-head/title/refresh` → `.weft-panel-header[data-size="board"]` or `<PanelHeader size="board">` (D10).
- `.weft-board-rail-search/pick*` → `.weft-input` / `.weft-select` with `data-density="dense"` (D11).
- `.weft-board-evidence*` → `<Badge variant="outline" tone="…">` (D15).
- `.weft-board-seg*` → `.weft-toggle-group` or `<ToggleGroup joined>` (D7).
- `.weft-board-space` → `<Badge variant="space">` (D5).
