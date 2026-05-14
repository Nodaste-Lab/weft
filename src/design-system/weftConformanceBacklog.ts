 /**
 * Mechanical HIGH/MEDIUM surfaces from docs/DESIGN_SYSTEM_UNDOCUMENTED_PATTERNS_AUDIT.md (§Weft conformance).
 * Annotations guide migration to ui/ primitives and optional composite extractions.
 */
export type WeftConformanceSeverity = 'HIGH' | 'MEDIUM';

export type WeftConformanceRow = {
  /** Repo-root path for engineers */
  relativePath: string;
  severity: WeftConformanceSeverity;
  /** One-line product role */
  summary: string;
  /** Design-system primitives / documented patterns to prefer */
  consumePrimitives: string[];
  /** New shared composite (if any) — optional */
  suggestedComposites: string;
  /** e.g. theme lab, vendor art — omit when none */
  exceptions?: string;
  /** WKWebView, regression, testing notes */
  notes?: string;
};

/** Intentionally exempt or LOW-tier files worth listing next to the backlog */
export type WeftConformanceExceptionEntry = {
  relativePath: string;
  rationale: string;
};

export const WEFT_CONFORMANCE_EXCEPTIONS: WeftConformanceExceptionEntry[] = [
  {
    relativePath: 'src/app/components/panels/SessionContextPanel.tsx (theme lab only)',
    rationale:
      'COLOR_PRESETS, COLOR_VARS, color pickers, and toRgba output need concrete hex/rgba; do not block migration on token-purging this subtree.',
  },
  {
    relativePath: 'src/app/components/panels/signals/SignalSourceIcon.tsx',
    rationale: 'Vendor brand colors (e.g. Slack, Linear) — keep literals; not a shadcn substitution target.',
  },
];

export const WEFT_CONFORMANCE_BACKLOG: WeftConformanceRow[] = [
  {
    relativePath: 'src/app/ModeWorkspaceCreatePage.tsx',
    severity: 'HIGH',
    summary: 'Mode / workspace creation flow — form layout and picks.',
    consumePrimitives: [
      'Input (already consumed)',
      'Select (already consumed)',
      'Textarea (already consumed)',
      'Checkbox (already consumed)',
      'HUD_WORKSPACE_INPUT_CLASS (already consumed via HUD_FIELD_CLASS alias 2026-05-12)',
    ],
    suggestedComposites: 'Optional **workspace form section** primitive deferred — single-consumer file; no second-consumer trigger yet.',
    notes: 'P4 (2026-05-14) retired all 32 module-level CSSProperties consts plus the 4 function-style style helpers (stepPillStyle / choiceCardStyle / primaryActionStyle / secondaryActionStyle). Migrated to Tailwind class constants + class-returning helpers via cn(). Inline `style={{}}` count dropped 2 → 1 (only the page radial-gradient `style={PAGE_BG_STYLE}` remains, encoding a multi-stop gradient that Tailwind arbitrary values do not express cleanly).',
    notes: 'HUD_FIELD_CLASS now aliases the shared HUD_WORKSPACE_INPUT_CLASS (2026-05-12). Prefer cn() + tokens over new inline blocks when tightening layout.',
  },
  {
    relativePath: 'src/app/components/panels/BattleTrackerPanel.tsx',
    severity: 'HIGH',
    summary: 'Initiative, HP, conditions — dense HUD table.',
    consumePrimitives: [
      'Alert / AlertTitle (already consumed)',
      'Badge (already consumed)',
      'Button (already consumed)',
      'Input + HUD_COMPACT_INPUT_CLASS (already consumed)',
      'Select + HUD_COMPACT_SELECT_TRIGGER_CLASS (already consumed)',
      'EyebrowLabel (already consumed)',
      'Separator (already consumed)',
      'HpBarTrack (#hp-bar-track) — adopted on combatant HP rail (2026-05-12) via trackClassName to preserve 5px metric',
      'Callout (#callout) — adopted at ThreatBanner / TPK warning (2026-05-14)',
      'CombatantTypeDot (#combatant-type-dot) — adopted at 4 sites + ThreatBanner pulse (2026-05-14)',
      'DeathSaveDot (#death-save-dot) — adopted at all 6 dot slots (2026-05-14)',
      'VaultSheetMatchRow (#vault-sheet-match-row) — adopted at staging + in-combat vault search (2026-05-14)',
      'Still TODO — Combatant row composite + NLP footer migration to drop inline-style floor below 40',
    ],
    suggestedComposites: '`BattleCombatantRow`, `ConditionChipStrip`, `HudQuickCommandFooter`, `CommandCategoryTag` — single-consumer composites deferred to a follow-up sweep (see `thoughts/discoveries/weft-tier2-panel-composites.md`).',
    notes: 'P2 (2026-05-14) shipped CombatantTypeDot / DeathSaveDot / VaultSheetMatchRow + ThreatBanner→Callout adoption. Inline `style={{}}` count dropped 141 → 110; the ≤40 floor is deferred to the BattleCombatantRow extraction pass. WKWebView pixel metrics preserved exactly for HP track (5px), combatant type dot (7px), pulsing dot (8px), death-save dot (8px), vault-match row padding (6px / 4px).',
  },
  {
    relativePath: 'src/app/components/panels/LoreSearchPanel.tsx',
    severity: 'HIGH',
    summary: 'Search field, results list, excerpts.',
    consumePrimitives: ['Input', 'Button', 'ScrollArea', 'EmptyState', 'badges / SourcePill where applicable'],
    suggestedComposites: 'Optional **search result row** (title + excerpt + path mono line).',
  },
  {
    relativePath: 'src/app/components/panels/MyAccountSection.tsx',
    severity: 'HIGH',
    summary: 'Account, campaigns, OAuth — settings module rows.',
    consumePrimitives: [
      'Input (already consumed)',
      'StatusIconRow (#status-icon-row) — adopted on device-login status card + CcoreRuntimeRow (2026-05-14)',
      'Tailwind via cn() — named class constants centralize button + row chrome (PRIMARY_AUTH_BUTTON_CLASS, SECONDARY_AUTH_BUTTON_CLASS, STATUS_CARD_BUTTON_CLASS, SIGN_OUT_BUTTON_CLASS, ICON_BUTTON_CLASS) (2026-05-14)',
      'SettingsModuleShell (#settings-module-shell) — primitive ready',
      'Callout (#callout) — primitive ready',
      'HudToggleSwitch (#hud-toggle-switch) — primitive ready for any boolean settings rows',
    ],
    suggestedComposites: 'StatusIconRow adopted (2026-05-14); all 62 inline `style={{}}` blocks retired. SelectableListRow / InlineEditRow / DestructiveConfirmRow deferred per Tier 2 pragmatic policy — single in-file consumer each. Dense `Button` primitive (h-7/h-8 sizes) also deferred until a second panel needs the chrome (see thoughts/discoveries/weft-tier2-panel-composites.md).',
  },
  {
    relativePath: 'src/app/components/panels/PartyStatsPanel.tsx',
    severity: 'HIGH',
    summary: 'Party-wide stats, NLP log, tabular summaries.',
    consumePrimitives: [
      'StatRow',
      'Badge (already consumed)',
      'Button (already consumed)',
      'Tabs or PillToggleGroup',
      'HpBarTrack (#hp-bar-track) — adopted on per-character HP rail (2026-05-12)',
      'Separator (already consumed)',
    ],
    suggestedComposites: 'Optional **party stat block** grid shared with Battle Tracker vocabulary.',
  },
  {
    relativePath: 'src/app/components/panels/SessionContextPanel.tsx',
    severity: 'HIGH',
    summary: 'Session settings, mode shell, vault paths, theme tooling.',
    consumePrimitives: [
      'Input (already consumed)',
      'Select',
      'Checkbox',
      'Button (already consumed)',
      'Collapsible',
      'EyebrowLabel (already consumed)',
      'SettingsModuleShell (#settings-module-shell) — adopted on Keyboard Shortcuts + Agent Plugins sections (2026-05-14)',
      'HudToggleSwitch (#hud-toggle-switch) — adopted (2026-05-12); local helper retired in favor of the ui/ primitive',
      'HudPopoverDropdown (#hud-popover-dropdown) — adopted at RoleSelector + campaign dropdown (2026-05-14)',
      'Callout (#callout) — primitive ready for non-theme help notes',
    ],
    suggestedComposites: 'Remaining HIGH-impact composite work tracked separately: vault-source row, hub status block, and screen-share/quick-transcription strips still live as inline-styled blocks.',
    exceptions: 'Theme lab / color editor subtrees stay literal-driven — see exceptions list below.',
    notes: 'Largest file; remaining inline styles concentrated in vault/source/screen-share/hub blocks and theme lab. Tier 2 P5 phase B left ~94 style={{}} blocks (down from baseline); follow-up plan should target vault + hub strips next.',
  },
  {
    relativePath: 'src/app/components/panels/SessionRecapPanel.tsx',
    severity: 'HIGH',
    summary: 'Recap stream, copy actions, structured session output.',
    consumePrimitives: [
      'Button (already consumed)',
      'Textarea (already consumed)',
      'ActionButtonRow (already consumed)',
      'Badge (already consumed)',
      'EmptyState (already consumed)',
      'Callout (#callout) — adopted on selectionStatus + generateError status banners (2026-05-12)',
      'RecapSectionShell (#recap-section-shell) — adopted at 5 visible-sections.map sites (2026-05-14)',
      'InlineEditListRow (#inline-edit-list-row) — adopted at beats + mysteries (2026-05-14)',
      'SettingsModuleShell (#settings-module-shell) — still available for recap block sections',
    ],
    suggestedComposites: '`LoadingState` deferred — single in-file consumer (the generating placeholder). Extract on second consumer.',
    notes: 'P3 (2026-05-14) shipped RecapSectionShell + InlineEditListRow. Inline `style={{}}` dropped 46 → 3 (remaining 3 are state-driven dynamic values: paired-row label color, toolbar Sparkles spin animation, and the loading spinner keyframe animation).',
  },
  {
    relativePath: 'src/app/components/panels/SheetResolutionCard.tsx',
    severity: 'HIGH',
    summary: 'Participant ↔ sheet linking, match rows, recovery states.',
    consumePrimitives: ['Button', 'Input', 'Alert', 'Badge', 'EmptyState pattern', 'Sheet Resolution doc (#sheet-resolution-card)'],
    suggestedComposites: '**Resolution state card** wrapper (idle / loading / matched / error) if reused outside this panel.',
  },
  {
    relativePath: 'src/app/components/panels/TicketUpdatesPanel.tsx',
    severity: 'HIGH',
    summary: 'Ticketing integration rows and status.',
    consumePrimitives: ['Badge', 'Button', 'ScrollArea', 'Provider Card vocabulary', 'List row patterns'],
    suggestedComposites: 'Optional **ticket row** (id + status pill + meta).',
  },
  {
    relativePath: 'src/app/components/panels/signals/SignalRow.tsx',
    severity: 'HIGH',
    summary: 'Single signal list row — priority, source, actors.',
    consumePrimitives: [
      'Badge (already consumed)',
      'Button (already consumed)',
      'Separator (already consumed)',
      'HudListRow + HudListRowTitle + HudListRowMeta (#hud-list-row) — primitive ready (2026-05-12)',
      'Typography tokens',
      'SignalSourceIcon for brands',
    ],
    suggestedComposites: 'HudListRow chrome now lives in `ui/`; SignalRow can adopt it as the row shell with leading SourceIcon, title stack, and trailing action set.',
    notes: 'Keeps SignalBlockRuntime list consistent; pair with Signals Error States doc.',
  },
  {
    relativePath: 'src/app/panel-builder/SignalBlockRuntime.tsx',
    severity: 'HIGH',
    summary: 'Signals list/stats runtimes, filters host.',
    consumePrimitives: [
      'Tabs',
      'Input (already consumed)',
      'Select',
      'SignalFilterBar patterns',
      'ScrollArea',
      'HudIssueCallout (already consumed)',
      'PanelBlockShell (#panel-block-shell) — primitive ready (2026-05-12); pending consumption to retire local BlockShell',
      'MetricTile (#metric-tile) — adopted on stats runtime tiles (2026-05-12); local stat() helper retired',
    ],
    suggestedComposites: 'PanelBlockShell ready in `ui/`; pending consumption to retire local BlockShell. MetricTile already consumed for stats.',
    notes: 'Coordinate with custom panel block definitions in manifest.panelBuilder.',
  },
  {
    relativePath: 'src/app/HUDView.tsx',
    severity: 'MEDIUM',
    summary: 'Root HUD layout, panel grid, toolbar host.',
    consumePrimitives: ['HUDPanel', 'HUDToolbar', 'documented toolbar button pattern', 'Link'],
    suggestedComposites: 'Avoid new composites until chrome stabilizes — extract only after metrics are frozen.',
    notes: 'Run npm run test:hud-chrome and docs/REGRESSION_TEST_GUIDE.md for any width/h scroll changes.',
  },
  {
    relativePath: 'src/app/components/SettingsModal.tsx',
    severity: 'MEDIUM',
    summary: 'Full-screen settings portal, search, panel switcher.',
    consumePrimitives: ['Input', 'Dialog pattern', 'ScrollArea', 'tabs or segmented control from ui/', 'SettingsModal doc'],
    suggestedComposites: 'Optional **settings sidebar + body split** wrapper if reused outside modal.',
  },
  {
    relativePath: 'src/app/components/panels/ModeManagerSection.tsx',
    severity: 'MEDIUM',
    summary: 'Mode picker, rename, icon — settings module.',
    consumePrimitives: ['Input', 'Select', 'Button', 'PanelIconPicker (panel-builder)', 'Settings Modules doc'],
    suggestedComposites: 'Fits **settings module shell** when extracted.',
  },
  {
    relativePath: 'src/app/components/panels/NoteCard.tsx',
    severity: 'MEDIUM',
    summary: 'Notes panel card — expand, tags, scratchpad variant.',
    consumePrimitives: ['Button', 'Badge', 'Textarea', 'Checkbox', 'Notes Card doc (#notes-card-pattern)', 'Collapsible patterns'],
    suggestedComposites: 'Consider thin **note tag strip** composite if duplicated in Quick Jot later.',
  },
  {
    relativePath: 'src/app/components/panels/TicketingIntegrationsSection.tsx',
    severity: 'MEDIUM',
    summary: 'Linear / ticketing OAuth and status UI.',
    consumePrimitives: ['Button', 'Badge', 'Alert', 'Card', 'var(--weft-font-sans)'],
    suggestedComposites: 'Optional **integration status row** for future providers.',
  },
  {
    relativePath: 'src/app/components/panels/TranscriptionPanel.tsx',
    severity: 'MEDIUM',
    summary: 'Transcription workspace — provider, tabs, transcript lines.',
    consumePrimitives: ['Input', 'Tabs', 'Toggle doc pattern', 'Provider Card', 'Button', 'Transcription Workspace doc'],
    suggestedComposites: '**Transcript line row** micro-layout; **transport control cluster**.',
    notes: 'Provider STATUS_COLOR mapping should stay on semantic HUD tokens.',
  },
  {
    relativePath: 'src/app/panel-builder/CustomPanelRuntime.tsx',
    severity: 'MEDIUM',
    summary: 'Custom panel runtime split panes and block renderers.',
    consumePrimitives: ['Gallery primitives per block type', 'PreviewPaneSurface', 'Custom Panel Preview & Runtime doc', 'Button', 'Input'],
    suggestedComposites: 'Pane chrome already in PreviewPaneSurface — focus on block-level wrappers.',
  },
  {
    relativePath: 'src/app/panel-builder/SessionRecapBuilderPreview.tsx',
    severity: 'MEDIUM',
    summary: 'Session recap template preview inside custom panel flow.',
    consumePrimitives: ['Align with CustomPanelRuntime + gallery', 'Card', 'Button', 'EmptyState'],
    suggestedComposites: 'Shared **preview output card** with CustomPanelRuntime output pane.',
  },
];

/** Stable fragment id for HUD-glass preview cards (`#weft-backlog-preview-…`). */
export function backlogPreviewAnchorId(relativePath: string): string {
  const file = relativePath.trim().split('/').pop() ?? relativePath;
  const base = file.replace(/\.tsx$/, '').replace(/[^a-zA-Z0-9_-]/g, '');
  return `weft-backlog-preview-${base}`;
}
