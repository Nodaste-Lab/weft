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
    relativePath: 'src/app/HUDView.tsx',
    rationale:
      'FROZEN (Tier 3, 2026-05-14): no backlog-driven layout refactors until WKWebView toolbar width/measurement chrome has a long-lived contract. Verify with npm run test:hud-chrome and docs/REGRESSION_TEST_GUIDE.md.',
  },
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
      'ModeOnlyToggle (#mode-only-toggle) — vault path / OpenAI / transcription scope (2026-05-14)',
      'ProviderStatusBadge (#provider-status-badge) — local transcription provider row status (2026-05-14)',
      'Callout (#callout) — primitive ready for non-theme help notes',
    ],
    suggestedComposites: 'Remaining HIGH-impact composite work: vault-source row + hub status blocks; QuickTranscription strip now uses token `text-primary` / `text-[var(--hud-text-3)]` on Mic icons (2026-05-14).',
    exceptions: 'Theme lab / color editor subtrees stay literal-driven — see exceptions list below.',
    notes: 'Largest file; remaining inline styles concentrated in vault/source/screen-share/hub blocks and theme lab. Tier 2 P5 phase B left ~94 style={{}} blocks (down from baseline); follow-up plan should target vault + hub strips next.',
  },
  {
    relativePath: 'src/app/panel-builder/CustomPanelRuntime.tsx',
    severity: 'MEDIUM',
    summary: 'Custom panel runtime split panes and block renderers.',
    consumePrimitives: [
      'Gallery primitives per block type',
      'PreviewPaneSurface',
      'Custom Panel Preview & Runtime doc',
      'Button',
      'Input',
      'RepeatListFieldColumn (#repeat-list-field-column) — repeat-list grid cells (2026-05-14)',
      'Grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] on main pane wrapper (2026-05-14)',
    ],
    suggestedComposites: 'Pane chrome already in PreviewPaneSurface — focus on block-level wrappers.',
    notes: 'Tier 3 P10: repeat-list column label shell promoted; blockShellStyle and other blocks still use CSSProperties helpers.',
  },
  {
    relativePath: 'src/app/panel-builder/SessionRecapBuilderPreview.tsx',
    severity: 'MEDIUM',
    summary: 'Session recap template preview inside custom panel flow.',
    consumePrimitives: [
      'Align with CustomPanelRuntime + gallery',
      'Card',
      'Button',
      'EmptyState',
      'PeriodChipRow (#period-chip-row) — recap period preset rows (2026-05-14)',
      'Root layout grid Tailwind arbitrary minmax(280px,1fr)',
    ],
    suggestedComposites: 'Shared **preview output card** with CustomPanelRuntime output pane.',
    notes: 'Tier 3 P10: chip rows use PeriodChipRow; panel card + toolbar still CSSProperties.',
  },
];

/** Stable fragment id for HUD-glass preview cards (`#weft-backlog-preview-…`). */
export function backlogPreviewAnchorId(relativePath: string): string {
  const file = relativePath.trim().split('/').pop() ?? relativePath;
  const base = file.replace(/\.tsx$/, '').replace(/[^a-zA-Z0-9_-]/g, '');
  return `weft-backlog-preview-${base}`;
}
