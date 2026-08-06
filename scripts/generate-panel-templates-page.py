#!/usr/bin/env python3
"""Generate the visual component breakdown page for the weft-board template.

Usage (normal):
  python3 generate-panel-templates-page.py <repo-root> <scratchpad>

Usage (pure render / freshness check — no writes to repo):
  python3 generate-panel-templates-page.py <repo-root> <scratchpad> --output <file>
  Writes the linked HTML to <file> instead of docs/brand-package/panel-templates.html.
  The inline copy still goes to <scratchpad>/panel-templates-inline.html.

Emits two files from one source of truth:
  docs/brand-package/panel-templates.html   relative CSS links — always reads the
                                            live token/component/template files,
                                            so the page cannot drift from the code
  <scratchpad>/panel-templates-inline.html  self-contained (CSS inlined) for sharing

All specimen HTML uses canonical plain-CSS classes from weft-components.css and
real form controls with accessible labels. No forbidden board-local selectors
appear in any specimen; evidence absence renders no chip.
"""
import pathlib, sys, html as html_mod

args = sys.argv[1:]
output_override = None
if '--output' in args:
    idx = args.index('--output')
    output_override = pathlib.Path(args[idx + 1])
    args = args[:idx] + args[idx + 2:]

W = pathlib.Path(args[0])
SP = pathlib.Path(args[1])

CSS_FILES = ['css/theme.css', 'css/weft.css', 'css/weft-components.css', 'css/weft-templates.css']

# ── Breakdown data ────────────────────────────────────────────────────────────
# (part_name, cls_display, status, equiv_html, action_html, specimen_html)
# cls_display is raw HTML (not escaped); part_name IS escaped by spec_card.
# Status:
S = 'REUSES'; D = 'DUPLICATES'; P = 'PARTIAL'; N = 'NEW'

SECTIONS = [
("Frame and header", [
 ("Board scope", ".weft-board", P,
  "<code>.weft-card</code>",
  "Frame matches; the board adds a local type scale and a serif-bridge counter-rule.",
  '<div class="weft-board" style="padding:14px;color:var(--weft-muted);font-size:13px">The board surface: paper, hairline rule, card radius.</div>'),
 ("Header", '.weft-panel-header[data-size="board"]', S,
  "<code>.weft-panel-header</code> (<code>weft-components.css</code>); <code>PanelHeader size=&quot;board&quot;</code> (React)",
  "Canonical. Board size auto-styles the title — no second size prop needed.",
  '<div class="weft-board">'
  '<div class="weft-panel-header" data-size="board">'
  '<div class="weft-panel-header-title">Updates dashboard</div>'
  '<div class="weft-panel-header-actions">'
  '<button class="weft-btn is-ghost" type="button" aria-label="Refresh board">&#8635;</button>'
  '</div></div></div>'),
 ("Body grid", ".weft-board-body", P,
  "<code>sidebar</code> (app-shell scale), <code>resizable</code>",
  "An in-panel rail+content grid has no equivalent at this scale.",
  '<div class="weft-board"><div class="weft-board-body">'
  '<aside class="weft-board-rail" style="min-height:70px"><span class="weft-board-rail-label">258px rail</span></aside>'
  '<div class="weft-board-detail"><span class="weft-board-context-sub">fluid detail column</span></div>'
  '</div></div>'),
]),
("Filter rail", [
 ("Search field", ".weft-search (the stated pattern)", S,
  "<code>.weft-search</code> recipe (<code>weft-components.css</code>); <code>SearchField</code> (React)",
  "Search is a stated pattern, not a type attribute: leading icon, named clear "
  "(a real <code>type=&quot;button&quot;</code> — anything else submits the form), clear visible "
  "only with content. The 34px tier comes from <code>data-density=&quot;dense&quot;</code> on "
  "<code>:root</code> — an app-level preference, not board-scoped.",
  '<div class="weft-board" style="padding:12px;width:258px">'
  '<label class="weft-field-label" for="demo-search">Search projects</label>'
  '<div class="weft-search">'
  '<span class="weft-search-icon" aria-hidden="true">'
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">'
  '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>'
  '<input id="demo-search" class="weft-input" type="search" name="q" placeholder="Search projects…">'
  '<button type="button" class="weft-search-clear" aria-label="Clear search">'
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">'
  '<path d="M18 6 6 18M6 6l12 12"/></svg></button>'
  '</div></div>'),
 ("Rail label", ".weft-board-rail-label", P,
  "<code>.weft-field-label</code>; <code>hud-meta-caption</code>",
  "<code>eyebrow-label</code> is wrong here — it is uppercase mono.",
  '<div class="weft-board" style="padding:12px"><span class="weft-board-rail-label">Filter by spaces</span></div>'),
 ("Segmented toggle", ".weft-toggle-group.is-joined", S,
  "<code>.weft-toggle-group</code> (<code>weft-components.css</code>); <code>ToggleGroup joined</code> (React)",
  "Canonical joined variant. Each item is a real <code>&lt;button&gt;</code> with <code>aria-pressed</code>.",
  '<div class="weft-board" style="padding:12px">'
  '<div class="weft-toggle-group is-joined" role="group" aria-label="Relatedness">'
  '<button type="button" class="weft-toggle-group-item" aria-pressed="false">Direct only</button>'
  '<button type="button" class="weft-toggle-group-item is-on" aria-pressed="true">Expanded</button>'
  '</div></div>'),
 ("Checkbox rows", ".weft-board-checks + .weft-checkbox-wrap", S,
  "<code>.weft-checkbox</code> — already composed",
  "The row itself is canonical too, since P7: <code>.weft-checkbox-wrap</code> at the 32px choice-row height with the clearance gap. The retired template-local <code>.weft-board-check</code> existed only because the canonical row once took the full 44px control height.",
  '<div class="weft-board" style="padding:12px;width:258px"><div class="weft-board-checks">'
  '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" checked name="sp-studio"> Nodaste Studio</label>'
  '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" checked name="sp-heddle"> ccore/heddle</label>'
  '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" disabled name="sp-archive"> ccore/archive'
  ' <span class="weft-board-note">unreachable</span></label></div></div>'),
 ("Preset picker", ".weft-select (real &lt;select&gt;)", S,
  "<code>.weft-select</code> (<code>weft-components.css</code>); <code>Select</code> (React)",
  "Canonical real form control with accessible label.",
  '<div class="weft-board" style="padding:12px;width:258px">'
  '<label class="weft-field-label" for="demo-since">Updated since</label>'
  '<select id="demo-since" class="weft-select" name="since">'
  '<option value="">Any date</option>'
  '<option value="7d">Last 7 days</option>'
  '<option value="30d">Last 30 days</option>'
  '</select></div>'),
]),
("List column", [
 ("Context header", ".weft-board-context", P,
  "<code>recap-section-shell</code>; <code>.weft-lede</code>",
  "Heading + sub; no count pill or collapse here.",
  '<div class="weft-board" style="padding:14px"><div class="weft-board-context"><h3>All open action items</h3>'
  '<div class="weft-board-context-sub">across 4 spaces · ranked by what needs you first</div></div></div>'),
 ("Context note", ".weft-board-context-note", P,
  "<code>Callout variant=&quot;dashed&quot;</code> (React); template-local for in-grid use",
  "Retained as template-local since it sits inside the template grid.",
  '<div class="weft-board" style="padding:14px"><div class="weft-board-context-note">Type a query and this becomes <b>Results for ‘token’</b>.</div></div>'),
 ("Priority tier", ".weft-tier-group.is-blocked / .is-awaiting / .is-fyi", S,
  "<code>.weft-tier-group</code> (<code>weft-components.css</code>); <code>TierGroup urgency=&quot;blocked&quot;</code> (React)",
  "Canonical. TierGroup renders null if children are empty — never show an empty shell.",
  '<div class="weft-board" style="padding:14px">'
  '<div class="weft-tier-group is-blocked" role="region" aria-label="Blockers">'
  '<div class="weft-tier-group-head"><span class="weft-dot is-stop" aria-hidden="true"></span>'
  'Blockers <span class="weft-tier-group-sub">act now</span><span class="weft-tier-group-count">1</span></div>'
  '<div class="weft-hud-list-row"><div class="weft-hud-list-row-col">'
  '<div class="weft-hud-list-row-title">Account Recovery dependency unresolved</div>'
  '<div class="weft-hud-list-row-meta">Blocked · 5d</div>'
  '</div><div class="weft-hud-list-row-aside"><span class="weft-badge is-space">ccore/heddle</span></div></div>'
  '</div>'
  '<div class="weft-tier-group is-awaiting" role="region" aria-label="Awaiting you">'
  '<div class="weft-tier-group-head"><span class="weft-dot is-warn" aria-hidden="true"></span>'
  'Awaiting you <span class="weft-tier-group-sub">needs a response</span><span class="weft-tier-group-count">4</span></div>'
  '<div class="weft-hud-list-row"><div class="weft-hud-list-row-col">'
  '<div class="weft-hud-list-row-title">Token migration design review</div>'
  '<div class="weft-hud-list-row-meta">Decision · 2d</div>'
  '</div></div>'
  '</div>'
  '<div class="weft-tier-group is-fyi" role="region" aria-label="FYI">'
  '<div class="weft-tier-group-head"><span class="weft-dot is-info" aria-hidden="true"></span>'
  'FYI <span class="weft-tier-group-sub">worth knowing</span><span class="weft-tier-group-count">3</span></div>'
  '<div class="weft-hud-list-row"><div class="weft-hud-list-row-col">'
  '<div class="weft-hud-list-row-title">Heddle UI updated to 2.4.1</div>'
  '</div></div>'
  '</div></div>'),
 ("Tier count badge", ".weft-badge.is-count", S,
  "<code>.weft-badge.is-count</code> (<code>weft-components.css</code>); <code>Badge variant=&quot;count&quot;</code> (React)",
  "Canonical mono numeral chip.",
  '<div class="weft-board" style="padding:14px;display:flex;gap:8px;align-items:center">'
  '<span class="weft-badge is-count">4</span><span class="weft-badge is-count">12</span>'
  '</div>'),
 ("Status dot", ".weft-dot.is-ok / .is-warn / .is-stop / .is-info", S,
  "<code>.weft-dot</code> (<code>weft-components.css</code>); <code>Dot</code> (React)",
  "Canonical. Always pair with a text label or <code>aria-label</code> when the dot alone carries meaning.",
  '<div class="weft-board" style="padding:14px;display:flex;gap:18px;align-items:center;font-size:12px;color:var(--weft-muted)">'
  '<span><span class="weft-dot is-ok" aria-hidden="true"></span> ok</span>'
  '<span><span class="weft-dot is-warn" aria-hidden="true"></span> warn</span>'
  '<span><span class="weft-dot is-stop" aria-hidden="true"></span> stop</span>'
  '<span><span class="weft-dot is-info" aria-hidden="true"></span> info</span></div>'),
 ("Action row", ".weft-hud-list-row + children", S,
  "<code>.weft-hud-list-row</code> (<code>weft-components.css</code>); <code>HudListRow</code> (React)",
  "Canonical. Best reuse in the whole template.",
  '<div class="weft-board" style="padding:14px">'
  '<div class="weft-hud-list-row"><div class="weft-hud-list-row-col">'
  '<div class="weft-hud-list-row-title">Account Recovery dependency unresolved</div>'
  '<div class="weft-hud-list-row-meta">Blocked · 5d — oldest open item</div>'
  '</div>'
  '<div class="weft-hud-list-row-aside">'
  '<span class="weft-badge is-space">ccore/heddle</span>'
  '<span class="weft-badge is-status is-stop">BLOCKED</span>'
  '</div></div></div>'),
 ("Row chips", ".weft-badge.is-space + .weft-source-pill", S,
  "<code>.weft-badge.is-space</code> (<code>weft-components.css</code>) for workspace; "
  "<code>.weft-source-pill</code> / <code>SourcePill</code> (React) for the mono type chip",
  "Canonical, and the two stay distinct (D5/D6 chip split): D5 keeps the space chip on "
  "<code>Badge</code>, D6 moved only the mono chip to <code>SourcePill</code> for its truncation "
  "and muted tone. No evidence = no chip.",
  '<div class="weft-board" style="padding:14px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
  '<span class="weft-badge is-space">Nodaste Studio</span>'
  '<span class="weft-badge is-space">ccore/heddle</span>'
  '<span class="weft-source-pill">signal</span>'
  '<span class="weft-source-pill">decision</span>'
  '</div>'),
]),
("Provenance", [
 ("Evidence chips", ".weft-badge.is-outline + tone modifier", S,
  "<code>.weft-badge.is-outline.is-ok</code> / <code>.is-info</code> / <code>.is-warn</code>; <code>Badge</code> (React)",
  "Canonical. A row with no evidence gets <b>no chip</b>.",
  '<div class="weft-board" style="padding:14px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
  '<span class="weft-badge is-outline is-ok">alias</span>'
  '<span class="weft-badge is-outline is-info">direct</span>'
  '<span class="weft-badge is-outline is-warn">trace</span>'
  '<!-- no chip rendered when evidence is absent -->'
  '</div>'),
 ("Legend", ".weft-board-legend + .weft-board-legend-item", P,
  "<code>period-chip-row</code>, <code>condition-chip-strip</code>",
  "Scaffold exists; legend-as-key is a new use.",
  '<div class="weft-board" style="padding:14px"><div class="weft-board-legend">'
  '<span class="weft-board-legend-item"><span class="weft-badge is-outline is-ok">alias</span> alias match</span>'
  '<span class="weft-board-legend-item"><span class="weft-badge is-outline is-info">direct</span> canonical match</span>'
  '</div></div>'),
]),
("Item drawer", [
 ("Drawer shell", ".weft-board-drawer (.is-wide)", P,
  "<code>sheet</code> — edge-mounted overlay; <code>panel-block-shell</code>",
  "Different mount: <code>sheet</code> overlays, this sits inline. An inline detail panel is an unfilled shape.",
  '<div class="weft-board"><div class="weft-board-drawer">'
  '<div class="weft-panel-header">'
  '<div class="weft-panel-header-title">Account Recovery dependency unresolved</div>'
  '<div class="weft-panel-header-actions">'
  '<span class="weft-source-pill">signal</span>'
  '<button class="weft-panel-header-dismiss" type="button" aria-label="Close drawer">×</button>'
  '</div></div>'
  '<div class="weft-board-drawer-body">The account-recovery flow depends on the token migration.</div>'
  '<div class="weft-callout is-band is-info"><b>Why you’re seeing this:</b> <span class="weft-badge is-outline is-info">direct</span></div>'
  '<div class="weft-action-button-row" style="padding:10px 12px">'
  '<button class="weft-btn" type="button">Resolve for me</button>'
  '<button class="weft-btn is-ghost" type="button">Reassign</button>'
  '<span class="weft-action-button-row-trailing"><button class="weft-btn is-link" type="button">Open ↗</button></span>'
  '</div></div></div>'),
 ("Drawer header", '.weft-panel-header (default size)', S,
  "<code>.weft-panel-header</code> (<code>weft-components.css</code>); <code>PanelHeader</code> (React)",
  "Canonical, at the default size. The drawer is a detail panel <i>inside</i> the board, so it stays "
  "subordinate to it — <code>data-size=&quot;board&quot;</code> is for the board's own header (D10). "
  "Nothing is inherited; the size is set explicitly or left default.",
  '<div class="weft-board"><div class="weft-board-drawer">'
  '<div class="weft-panel-header">'
  '<div class="weft-panel-header-title">Account Recovery dependency</div>'
  '<div class="weft-panel-header-actions">'
  '<span class="weft-badge is-space">ccore/heddle</span>'
  '<button class="weft-panel-header-dismiss" type="button" aria-label="Close">×</button>'
  '</div></div></div></div>'),
 ("Reference row", ".weft-copyable-ref + .weft-copyable-ref-copy", S,
  "<code>.weft-copyable-ref</code> (<code>weft-components.css</code>); <code>CopyableRef</code> (React)",
  "Canonical. A copyable canonical-reference chip with a real button and accessible label.",
  '<div class="weft-board" style="padding:12px">'
  '<div class="weft-copyable-ref">'
  '<code>nodaste-studio/heddle-ui/sig_4c2a3f9e</code>'
  '<button class="weft-copyable-ref-copy" type="button" aria-label="Copy reference">Copy</button>'
  '</div></div>'),
 ("Reply field", ".weft-textarea (real &lt;textarea&gt;)", S,
  "<code>.weft-textarea</code> (<code>weft-components.css</code>); <code>Textarea</code> (React)",
  "Canonical real textarea with accessible label.",
  '<div class="weft-board" style="padding:12px">'
  '<label class="weft-field-label" for="demo-reply">Reply</label>'
  '<textarea id="demo-reply" class="weft-textarea" name="reply" rows="2"'
  ' placeholder="Reply…"></textarea>'
  '</div>'),
 ("Provenance band", ".weft-callout.is-band", S,
  "<code>.weft-callout.is-band</code> (<code>weft-components.css</code>); "
  "<code>Callout variant=&quot;band&quot;</code> (React)",
  "Canonical. D8 kept the introduced band and landed it as a Callout variant, "
  "so the board-local class is deleted.",
  '<div class="weft-board"><div class="weft-board-drawer">'
  '<div class="weft-callout is-band is-info"><b>Why you’re seeing this:</b>'
  ' <span class="weft-badge is-outline is-info">direct</span> tagged to Heddle UI (pr_9f2a…c1)</div>'
  '</div></div>'),
 ("Action row", ".weft-action-button-row", S,
  "<code>.weft-action-button-row</code> (<code>weft-components.css</code>); <code>ActionButtonRow</code> (React; <code>dense</code> is opt-in, default false)",
  "Canonical grouped actions row. Use <code>.weft-action-button-row-trailing</code> to push a trailing link right.",
  '<div class="weft-board"><div class="weft-action-button-row" style="padding:10px 12px">'
  '<button class="weft-btn" type="button">Resolve for me</button>'
  '<button class="weft-btn is-ghost" type="button">Reassign</button>'
  '<span class="weft-action-button-row-trailing"><button class="weft-btn is-link" type="button">Open ↗</button></span>'
  '</div></div>'),
 ("Drawer buttons", ".weft-btn + .weft-btn.is-ghost + .weft-btn.is-link", S,
  "<code>.weft-btn</code> (<code>weft-components.css</code>); <code>Button</code> (React)",
  "Canonical. The 34px tier is activated by <code>data-density=&quot;dense&quot;</code> on <code>:root</code>, set by the application.",
  '<div class="weft-board" style="padding:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
  '<button class="weft-btn" type="button">Resolve</button>'
  '<button class="weft-btn is-ghost" type="button">Reassign</button>'
  '<button class="weft-btn is-link" type="button">Open ↗</button>'
  '</div>'),
 ("Status chip", ".weft-badge.is-status + tone", S,
  "<code>.weft-badge.is-status</code> (<code>weft-components.css</code>); <code>Badge variant=&quot;status&quot;</code> (React)",
  "Canonical. Mono bordered chip for machine-state labels.",
  '<div class="weft-board" style="padding:12px;display:flex;gap:8px;align-items:center">'
  '<span class="weft-badge is-status is-stop">BLOCKED</span>'
  '<span class="weft-badge is-status is-warn">OVERDUE</span>'
  '<span class="weft-badge is-status is-ok">RESOLVED</span>'
  '</div>'),
]),
("Compact panel variant", [
 ("Panel shell + stat rows", ".weft-board-panel + .weft-stat-row", S,
  "<code>.weft-stat-row</code> (<code>weft-components.css</code>); <code>StatRow</code> (React)",
  "Canonical. The whole variant is a shell plus stat rows with dot + label + value.",
  '<div class="weft-board" style="width:258px"><div class="weft-board-panel">'
  '<div class="weft-board-panel-head">Updates dashboard · panel</div>'
  '<div class="weft-board-panel-body">'
  '<div class="weft-stat-row"><span class="weft-dot is-stop" aria-hidden="true"></span>'
  '<span class="weft-stat-row-label">Blockers · act now</span><span class="weft-stat-row-value">1</span></div>'
  '<div class="weft-stat-row"><span class="weft-dot is-warn" aria-hidden="true"></span>'
  '<span class="weft-stat-row-label">Awaiting you</span><span class="weft-stat-row-value">4</span></div>'
  '<div class="weft-stat-row"><span class="weft-dot is-info" aria-hidden="true"></span>'
  '<span class="weft-stat-row-label">FYI · worth knowing</span><span class="weft-stat-row-value">3</span></div>'
  '</div></div></div>'),
 ("Width-measured switch (720px)", "(measured on the slot)", N,
  "<code>use-mobile</code> is viewport-based",
  "Needs container width. No element-width utility or container queries in Weft; logic lives in Heddle.",
  '<div style="display:flex;gap:10px;align-items:flex-start">'
  '<div class="weft-board" style="flex:1;padding:10px;font-size:11px;color:var(--weft-muted)">≥ 720px → full board</div>'
  '<div class="weft-board" style="width:120px"><div class="weft-board-panel">'
  '<div class="weft-board-panel-head">&lt; 720px</div><div class="weft-board-panel-body">'
  '<div class="weft-stat-row"><span class="weft-dot is-stop" aria-hidden="true"></span>'
  '<span class="weft-stat-row-label">Blockers</span><span class="weft-stat-row-value">1</span></div>'
  '</div></div></div></div>'),
]),
("States", [
 ("Degradation toast", ".weft-board-toast + children", D,
  "<code>HudIssueToast</code>, <code>HudIssueCallout</code>, <code>alert</code> (React only)",
  "Same family. The partial-failure shape (some sources answered, retry the rest) is richer — fold back.",
  '<div class="weft-board" style="padding:14px;min-height:96px"><div class="weft-board-toast" style="position:static;max-width:340px">'
  '<span class="weft-board-toast-icon">&#9888;</span><div style="flex:1"><b>1 of 5 spaces didn\'t respond</b>'
  '<div class="weft-board-toast-sub">ccore/archive timed out. Showing 4.</div></div>'
  '<button type="button" class="weft-board-toast-retry">Retry</button>'
  '<button type="button" class="weft-board-toast-close" aria-label="Dismiss">×</button></div></div>'),
 ("Notice / empty state", "weft-callout.is-dashed / EmptyState variant=notice", S,
  "<code>.weft-callout.is-dashed</code> (<code>weft-components.css</code>); "
  "<code>EmptyState variant=&quot;notice&quot;</code> or <code>Callout variant=&quot;dashed&quot;</code> (React)",
  "Canonical, and the specimen renders the canonical class rather than the board-local one — "
  "copyable markup must not contradict the guidance. D9: notice for load failures, "
  "<code>EmptyState variant=&quot;centered&quot;</code> for genuine empty states.",
  # Two specimens, because a one-line notice hides how the treatment behaves
  # (Katie, 2026-08): a wrapped message is the common case on a narrow board slot,
  # and the dashed border has to hold the block without the text crowding it.
  '<div class="weft-board" style="padding:14px">'
  '<div class="weft-callout is-dashed" style="margin-bottom:10px">'
  '<b>Couldn\'t load action items.</b> Connecting your account…'
  '</div>'
  '<div class="weft-callout is-dashed" style="max-width:340px">'
  '<b>Couldn\'t load action items from 2 of 5 spaces.</b> '
  'ccore/archive and nodaste-studio didn\'t respond. The items below are '
  'everything we could reach — retry to fill the gaps.'
  '</div></div>'),
 ("Loading", "—", None,
  "<code>skeleton</code>",
  "Gap: the template has no loading treatment. Use <code>skeleton</code>.", None),
]),
]

DOCTRINE = [
 ("Group by required action, not record type",
  "A signal, a decision and a clarification all sit in <code>is-awaiting</code> if they need a response."),
 ("Urgency ordering is part of the meaning",
  "<code>is-blocked</code> → <code>is-awaiting</code> → <code>is-fyi</code>, always."),
 ("A tier's dot must agree with its urgency",
  "<code>is-blocked</code> takes <code>.weft-dot.is-stop</code>, <code>is-awaiting</code> takes "
  "<code>.is-warn</code>, <code>is-fyi</code> takes <code>.is-info</code>. A tier whose colour "
  "contradicts its meaning is the signal itself being wrong. Per-item dots on the rows below are "
  "a separate thing."),
 ("Never invent provenance",
  "A row with no relation evidence gets <b>no chip</b>, never a guessed one."),
 ("Never render an empty tier set",
  "An empty board reads as “nothing needs you”. Show <code>EmptyState</code> or <code>Callout</code> instead."),
 ("Evidence absence renders no chip",
  "If the relation field is empty, omit the badge entirely. Never substitute a guessed chip."),
 ("Never two primary buttons",
  "At most one filled <code>.weft-btn</code> in an action row — the action you want taken. "
  "Everything beside it is <code>.is-ghost</code> or <code>.is-link</code>. Two filled buttons make "
  "the operator choose between them instead of acting, which is the opposite of what a board is for. "
  "A row of peer actions (a toolbar) correctly has none."),
]

BADGE = {'REUSES': 'ok', 'DUPLICATES': 'dup', 'PARTIAL': 'part', 'NEW': 'new'}

CHROME = """
  body { margin:0; background:var(--weft-cream); color:var(--weft-ink);
         font-family:var(--weft-font-sans); font-size:15px; line-height:1.5; }
  .bar { position:sticky; top:0; z-index:30; display:flex; align-items:center; gap:14px; flex-wrap:wrap;
         padding:12px 28px; border-bottom:1px solid var(--weft-rule); background:var(--weft-paper); }
  .bar h1 { margin:0; font-size:16px; font-weight:700; font-family:var(--weft-font-sans) !important; }
  .bar .sub { font-family:var(--weft-font-mono); font-size:12px; color:var(--weft-muted); }
  .bar .sp { margin-left:auto; }
  .legend { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .wrap { padding:28px; max-width:1180px; }
  .tally { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:26px; }
  .tally .t { border:1px solid var(--weft-rule); border-radius:var(--weft-radius-card);
              background:var(--weft-paper); padding:10px 14px; min-width:104px; }
  .tally .n { font-size:22px; font-weight:700; font-family:var(--weft-font-mono); }
  .tally .l { font-size:10.5px; letter-spacing:.09em; text-transform:uppercase; color:var(--weft-muted); }
  h2.sec { font-family:var(--weft-font-sans) !important; font-size:12px; letter-spacing:.11em;
           text-transform:uppercase; color:var(--weft-muted); margin:32px 0 12px; font-weight:700; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(430px,1fr)); gap:14px; }
  .spec { border:1px solid var(--weft-rule); border-radius:var(--weft-radius-card);
          background:var(--weft-paper); overflow:hidden; display:flex; flex-direction:column; }
  .spec-h { display:flex; align-items:baseline; gap:10px; padding:11px 14px; border-bottom:1px solid var(--weft-rule); }
  .spec-h .nm { font-weight:700; font-size:13.5px; }
  .spec-h .bg { margin-left:auto; }
  .cls { font-family:var(--weft-font-mono); font-size:10.5px; color:var(--weft-muted);
         padding:7px 14px; border-bottom:1px solid var(--weft-rule); background:var(--weft-fill-soft);
         word-break:break-word; }
  .demo { padding:16px; background:var(--weft-cream); display:flex; justify-content:center; }
  .demo > * { width:100%; }
  .meta { padding:11px 14px; font-size:12.5px; display:flex; flex-direction:column; gap:6px; }
  .meta .row { display:flex; gap:7px; }
  .meta .k { color:var(--weft-muted); flex:none; min-width:74px; font-size:11px;
             text-transform:uppercase; letter-spacing:.06em; padding-top:2px; }
  .meta code { font-family:var(--weft-font-mono); font-size:11.5px;
               background:var(--weft-fill-soft); border:1px solid var(--weft-rule);
               border-radius:var(--weft-radius-chip); padding:0 4px; }
  .b { display:inline-block; font-size:9.5px; font-weight:700; letter-spacing:.08em;
       text-transform:uppercase; padding:2px 7px; border-radius:var(--weft-radius-pill);
       border:1px solid currentColor; white-space:nowrap; }
  .b.ok   { color:var(--weft-ok); }
  .b.dup  { color:var(--weft-warn); }
  .b.part { color:var(--weft-info); }
  .b.new  { color:var(--weft-link); }
  .doctrine { display:grid; grid-template-columns:repeat(auto-fill,minmax(430px,1fr)); gap:14px; }
  .dcard { border:1px solid var(--weft-rule); border-left:3px solid var(--weft-muted);
           border-radius:var(--weft-radius-card); background:var(--weft-paper); padding:13px 15px; }
  .dcard .dt { font-weight:700; font-size:13px; margin-bottom:5px; }
  .dcard .db { font-size:12.5px; color:var(--weft-muted); }
  .note { border:1px solid var(--weft-rule); border-left:3px solid var(--weft-link);
          border-radius:var(--weft-radius-card); background:var(--weft-paper);
          padding:13px 16px; font-size:13px; margin-bottom:22px; }
"""


def spec_card(nm, cls_html, status, equiv, action, demo):
    b = f'<span class="b {BADGE[status]}">{status}</span>' if status else '<span class="b doc">GAP</span>'
    # Carries its own indent and newline so an absent demo leaves no blank line
    # behind — an interpolated empty string on its own indented line emits
    # trailing whitespace, which `git diff --check` flags on every regeneration.
    demo_html = f'  <div class="demo">{demo}</div>\n' if demo else ''
    # nm is escaped; cls_html is already HTML (may contain entities like &lt;)
    return f"""<div class="spec">
  <div class="spec-h"><span class="nm">{html_mod.escape(nm)}</span><span class="bg">{b}</span></div>
  <div class="cls">{cls_html}</div>
{demo_html}  <div class="meta">
    <div class="row"><span class="k">Weft has</span><span>{equiv}</span></div>
    <div class="row"><span class="k">Action</span><span>{action}</span></div>
  </div>
</div>"""


def build(css_block):
    counts = {'REUSES': 0, 'DUPLICATES': 0, 'PARTIAL': 0, 'NEW': 0}
    for _, items in SECTIONS:
        for it in items:
            if it[2] in counts:
                counts[it[2]] += 1
    body = []
    body.append('<div class="note"><b>How to read this.</b> Every specimen is rendered from the live '
                '<code>css/</code> files — not a picture. Toggle the theme to confirm each part follows it. '
                'Evidence absence renders no chip.</div>')
    body.append('<div class="tally">' + ''.join(
        f'<div class="t"><div class="n">{counts[k]}</div><div class="l">{k}</div></div>'
        for k in ['REUSES', 'DUPLICATES', 'PARTIAL', 'NEW']
    ) + f'<div class="t"><div class="n">{len(DOCTRINE)}</div><div class="l">Doctrine</div></div></div>')

    for title, items in SECTIONS:
        body.append(f'<h2 class="sec">{html_mod.escape(title)}</h2><div class="grid">')
        body.append(''.join(spec_card(*it) for it in items))
        body.append('</div>')

    body.append('<h2 class="sec">Doctrine — rules, not components</h2><div class="doctrine">')
    body.append(''.join(
        f'<div class="dcard"><div class="dt">{t}</div><div class="db">{d}</div></div>'
        for t, d in DOCTRINE))
    body.append('</div>')

    legend = ''.join(f'<span class="b {BADGE[k]}">{k}</span>' for k in
                     ['REUSES', 'DUPLICATES', 'PARTIAL', 'NEW'])
    return f"""<!DOCTYPE html>
<!-- GENERATED by scripts/generate-panel-templates-page.py — do not hand-edit.
     All specimens use canonical weft-components.css classes and real form controls.
     No forbidden board-local selectors appear in any specimen HTML. -->
<!-- data-density="dense" is what makes these specimens the reviewed board surface.
     T2 put the 34px tier on :root as an application preference; this page is the
     application, so it has to set it. Without it every control falls back to the
     44px default — buttons, inputs, selects and the header all render a third
     too large, and the page misrepresents the very template it documents.
     Guarded by T2-i in scripts/__tests__/template-contract.node.mjs. -->
<html lang="en" data-palette="weft" data-density="dense">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>weft-board — component breakdown</title>
{css_block}
<style>{CHROME}</style>
</head>
<body>
<div class="bar">
  <h1>weft-board</h1>
  <span class="sub">component breakdown</span>
  <span class="legend">{legend}</span>
  <button type="button" class="weft-btn is-ghost sp" id="t" aria-pressed="false">Toggle dark</button>
</div>
<div class="wrap">
{''.join(body)}
</div>
<script>
  var b=document.getElementById('t'), r=document.documentElement;
  b.addEventListener('click',function(){{
    var d=r.getAttribute('data-theme')==='dark';
    if(d){{r.removeAttribute('data-theme');b.textContent='Toggle dark';b.setAttribute('aria-pressed','false');}}
    else{{r.setAttribute('data-theme','dark');b.textContent='Toggle light';b.setAttribute('aria-pressed','true');}}
  }});
</script>
</body>
</html>
"""


# repo copy — relative links, always reads the live CSS
linked = "\n".join(f'<link rel="stylesheet" href="../../{f}" />' for f in CSS_FILES)
dest = output_override if output_override else (W / 'docs/brand-package/panel-templates.html')
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(build(linked))

# shareable copy — CSS inlined
inline = "<style>\n" + "\n".join((W / f).read_text() for f in CSS_FILES) + "\n</style>"
(SP / 'panel-templates-inline.html').write_text(build(inline))
print("wrote docs/brand-package/panel-templates.html and the inline copy")
