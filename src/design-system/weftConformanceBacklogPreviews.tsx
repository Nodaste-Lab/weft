/**
 * Live HUD-glass snapshots for §Weft conformance backlog rows (design-system page only).
 */
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HUDPanelProviders } from '../app/AppProviders';
import { useNotes } from '../app/context/NotesContext';
import { BattleTrackerPanel } from '../app/components/panels/BattleTrackerPanel';
import { LoreSearchPanel } from '../app/components/panels/LoreSearchPanel';
import { ModeManagerSection } from '../app/components/panels/ModeManagerSection';
import { MyAccountSection } from '../app/components/panels/MyAccountSection';
import { NoteCard } from '../app/components/panels/NoteCard';
import { PartyStatsPanel } from '../app/components/panels/PartyStatsPanel';
import { SessionContextPanel, AppSettingsPanel } from '../app/components/panels/SessionContextPanel';
import { SessionRecapPanel } from '../app/components/panels/SessionRecapPanel';
import { SheetResolutionCard } from '../app/components/panels/SheetResolutionCard';
import { TicketUpdatesPanel } from '../app/components/panels/TicketUpdatesPanel';
import { TicketingIntegrationsSection } from '../app/components/panels/TicketingIntegrationsSection';
import { TranscriptionPanel } from '../app/components/panels/TranscriptionPanel';
import { SignalRow } from '../app/components/panels/signals/SignalRow';
import type { Signal, SignalConnectionState, SignalListFilters, SignalListResult } from '../app/integrations/signals/types';
import type { SignalProvider } from '../app/integrations/signals/SignalProvider';
import { globalSignalProviderRegistry } from '../app/integrations/signals/SignalProvider';
import { CustomPanelRuntime } from '../app/panel-builder/CustomPanelRuntime';
import { SessionRecapBuilderPreview } from '../app/panel-builder/SessionRecapBuilderPreview';
import {
  SignalBlockProvider,
  SignalListRuntime,
} from '../app/panel-builder/SignalBlockRuntime';
import {
  createDefaultSignalPanelConfig,
  type SignalPanelConfig,
} from '../app/panel-builder/signalPanelConfig';
import {
  createDefaultCustomPanelDefinition,
} from '../app/panel-builder/types';
import { buildDefaultPanels } from '../app/mode/panelRegistry';
import type { Mode } from '../app/mode/types';
import { PlayerSheetService } from '../app/services/playerSheetService';
import {
  backlogPreviewAnchorId,
  WEFT_CONFORMANCE_BACKLOG,
} from './weftConformanceBacklog';

const PREVIEW_MODE_ID = '00000000-0000-4000-8000-0000000000ds';

function makePreviewMode(): Mode {
  const now = new Date().toISOString();
  return {
    id: PREVIEW_MODE_ID,
    displayName: 'Design system preview',
    icon: '🎲',
    template: 'ttrpg',
    panels: buildDefaultPanels('ttrpg'),
    vaultSources: [],
    recapPromptVariant: 'ttrpg',
    isPreset: false,
    createdAt: now,
    updatedAt: now,
  };
}

const sheetServicePreview = new PlayerSheetService();

const SAMPLE_SIGNAL: Signal = {
  id: 'backlog-preview-signal',
  title: 'Review Q3 roadmap',
  body: 'Draft of the Q3 roadmap is ready for one more pass before we publish to the team.',
  status: 'new',
  priority: 'high',
  source: { kind: 'slack', label: 'Product channel' },
  sender: { id: 'u-avery', name: 'Avery Chen', kind: 'human' },
  updatedAt: new Date().toISOString(),
  responseCount: 0,
  currentVersionId: 'v-1',
};

class DocsHappySignalProvider implements SignalProvider {
  readonly id = 'docs-signals-happy';
  readonly displayName = 'Docs · Happy';
  async listSignals(_filters?: SignalListFilters, _cursor?: string): Promise<SignalListResult> {
    return { items: [SAMPLE_SIGNAL], hasMore: false, nextCursor: null };
  }
  async acknowledge(_signalId: string): Promise<void> {}
  async resolve(_signalId: string): Promise<void> {}
  async appendResponse(_signalId: string, _text: string): Promise<void> {}
  async startWork(_signalId: string): Promise<void> {}
  async block(_signalId: string): Promise<void> {}
  async requestInfo(_signalId: string): Promise<void> {}
  async cancel(_signalId: string): Promise<void> {}
  async agentAction(_signalId: string): Promise<void> {}
  async generateReply(_signalId: string): Promise<string> {
    return '';
  }
  async getAgentPlan(_signalId: string): Promise<string> {
    return '';
  }
  getConnectionState(): SignalConnectionState {
    return { status: 'connected' };
  }
  async refreshConnection(): Promise<void> {}
}

let docsSignalProvidersRegistered = false;
function registerDocsSignalProviders(): void {
  if (docsSignalProvidersRegistered) return;
  globalSignalProviderRegistry.register('docs-signals-happy', () => new DocsHappySignalProvider());
  docsSignalProvidersRegistered = true;
}

function hudGlassShell(maxHeight: number): CSSProperties {
  return {
    borderRadius: 'var(--radius)',
    border: '1px solid var(--hud-border)',
    overflow: 'auto',
    maxHeight,
    background: 'var(--hud-surface)',
    backdropFilter: 'var(--hud-blur)',
    WebkitBackdropFilter: 'var(--hud-blur)',
    color: 'var(--hud-text-1)',
    fontFamily: 'var(--weft-font-sans)',
  };
}

function PreviewCard({
  anchorId,
  title,
  subtitle,
  maxHeight,
  children,
}: {
  anchorId: string;
  title: string;
  subtitle?: string;
  maxHeight: number;
  children: ReactNode;
}) {
  return (
    <div id={anchorId} style={{ scrollMarginTop: 28, marginBottom: 22 }}>
      <div
        style={{
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--hud-text-1)',
          marginBottom: subtitle ? 4 : 10,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily: 'var(--weft-font-sans)',
            fontSize: 10,
            color: 'var(--hud-text-3)',
            marginBottom: 10,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      ) : null}
      <div data-palette="hud-glass" style={{ ...hudGlassShell(maxHeight), padding: 0 }}>
        {children}
      </div>
    </div>
  );
}

function NoteCardPreviewInner() {
  const { addNote, state } = useNotes();
  const [ids, setIds] = useState<{ main: string | null }>({ main: null });
  const [expanded, setExpanded] = useState(true);
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const main = addNote({
      content: 'Sample note for conformance preview.',
      tags: ['#preview'],
      dmOnly: false,
    });
    setIds({ main: main.id });
  }, [addNote]);

  const note = ids.main ? state.notes.find((x) => x.id === ids.main) : undefined;

  return (
    <div style={{ padding: 12 }}>
      {!note ? (
        <div style={{ color: 'var(--hud-text-3)', fontSize: 12 }}>Loading…</div>
      ) : (
        <NoteCard note={note} expanded={expanded} onToggleExpand={() => setExpanded((v) => !v)} />
      )}
    </div>
  );
}

function SignalListBacklogPreview() {
  const config: SignalPanelConfig = useMemo(
    () => ({
      ...createDefaultSignalPanelConfig(),
      provider: 'docs-signals-happy' as SignalPanelConfig['provider'],
      collapsedGroups: [],
      maxSignals: 20,
    }),
    [],
  );
  useEffect(() => {
    registerDocsSignalProviders();
  }, []);

  return (
    <SignalBlockProvider>
      <SignalListRuntime config={config} title="Signals" seamless isPreview />
    </SignalBlockProvider>
  );
}

function WorkspaceWizardBacklogPreview() {
  return (
    <div style={{ padding: 14, display: 'grid', gap: 12 }}>
      <p style={{ margin: 0, color: 'var(--hud-text-2)', fontSize: 11, lineHeight: 1.55 }}>
        Full wizard uses <strong style={{ color: 'var(--hud-text-1)' }}>react-router</strong> navigation. It cannot nest inside the design-system route
        router, so this is a token-aligned wireframe of the layout (step rail + main card).
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, minHeight: 220 }}>
        <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--hud-border)', background: 'var(--hud-surface-raised)', padding: 10 }}>
          {['Purpose', 'Panels', 'Sources', 'Custom', 'Review'].map((s, i) => (
            <div
              key={s}
              style={{
                padding: '6px 8px',
                marginBottom: 6,
                borderRadius: 'var(--radius-xs)',
                border: `1px solid ${i === 0 ? 'var(--hud-border-accent)' : 'var(--hud-border)'}`,
                background: i === 0 ? 'var(--hud-primary-tint-medium)' : 'transparent',
                fontSize: 10,
                color: 'var(--hud-text-2)',
              }}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--hud-border)', background: 'var(--hud-surface-raised)', padding: 12 }}>
          <div style={{ height: 12, width: '55%', background: 'var(--hud-border)', borderRadius: 4, marginBottom: 12, opacity: 0.5 }} />
          <div style={{ height: 10, width: '90%', background: 'var(--hud-border)', borderRadius: 4, marginBottom: 8, opacity: 0.35 }} />
          <div style={{ height: 10, width: '75%', background: 'var(--hud-border)', borderRadius: 4, marginBottom: 16, opacity: 0.35 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ height: 64, borderRadius: 'var(--radius-sm)', border: '1px dashed var(--hud-border)', background: 'rgba(255,255,255,0.02)' }} />
            <div style={{ height: 64, borderRadius: 'var(--radius-sm)', border: '1px dashed var(--hud-border)', background: 'rgba(255,255,255,0.02)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPreviewForPath(relativePath: string): { title: string; subtitle?: string; node: ReactNode } | null {
  const previewMode = makePreviewMode();
  const modes = [previewMode];

  switch (relativePath) {
    case 'src/app/ModeWorkspaceCreatePage.tsx':
      return {
        title: 'ModeWorkspaceCreatePage.tsx',
        subtitle:
          'P4 (2026-05-14) retired all 32 module-level CSSProperties consts + the 4 function-style style helpers; migrated to Tailwind class constants + class-returning helpers via cn(). Inline `style={{}}` count dropped 2 → 1 (only the page radial-gradient remains). Wireframe preview lives at /workspace/new.',
        node: <WorkspaceWizardBacklogPreview />,
      };
    case 'src/app/components/panels/BattleTrackerPanel.tsx':
      return {
        title: 'BattleTrackerPanel.tsx',
        subtitle:
          'P2 (2026-05-14) shipped CombatantTypeDot, DeathSaveDot, VaultSheetMatchRow + ThreatBanner→Callout adoption. HpBarTrack still drives the HP rail. Inline `style={{}}` floor moved 141 → 110; BattleCombatantRow / ConditionChipStrip / HudQuickCommandFooter deferred to a follow-up sweep (see discovery ledger).',
        node: <BattleTrackerPanel />,
      };
    case 'src/app/components/panels/LoreSearchPanel.tsx':
      return {
        title: 'LoreSearchPanel.tsx',
        node: <LoreSearchPanel />,
      };
    case 'src/app/components/panels/MyAccountSection.tsx':
      return {
        title: 'MyAccountSection.tsx',
        subtitle:
          'StatusIconRow adopted on device-login status card + CcoreRuntimeRow (2026-05-14); all 62 inline `style={{}}` blocks retired in favor of named Tailwind class constants via cn(). Dense `Button` primitive + SelectableListRow / InlineEditRow / DestructiveConfirmRow deferred — single in-file consumer each.',
        node: (
          <div style={{ borderTop: 'none' }}>
            <MyAccountSection />
          </div>
        ),
      };
    case 'src/app/components/panels/PartyStatsPanel.tsx':
      return {
        title: 'PartyStatsPanel.tsx',
        subtitle: 'HpBarTrack adopted on the per-character HP rail (2026-05-12).',
        node: <PartyStatsPanel />,
      };
    case 'src/app/components/panels/SessionContextPanel.tsx':
      return {
        title: 'SessionContextPanel.tsx',
        subtitle:
          'Includes theme lab (literal colors expected there). HudToggleSwitch (2026-05-12), HudPopoverDropdown on RoleSelector + campaign dropdown (2026-05-14), and SettingsModuleShell wrap on Keyboard Shortcuts + Agent Plugins (2026-05-14). Remaining inline-styled blocks concentrated in vault/source/hub/screen-share strips and theme lab; tracked for a follow-up plan.',
        node: <SessionContextPanel />,
      };
    case 'src/app/components/panels/SessionRecapPanel.tsx':
      return {
        title: 'SessionRecapPanel.tsx',
        subtitle:
          'P3 (2026-05-14) shipped RecapSectionShell + InlineEditListRow. Inline `style={{}}` dropped 46 → 3 (remaining 3 are state-driven). Callout still drives selectionStatus + generateError banners. LoadingState composite deferred — single in-file consumer.',
        node: <SessionRecapPanel variant="session" />,
      };
    case 'src/app/components/panels/SheetResolutionCard.tsx':
      return {
        title: 'SheetResolutionCard.tsx',
        node: (
          <div style={{ padding: 12 }}>
            <SheetResolutionCard
              participant={{ id: 'ds-participant', name: 'Morgan', role: 'Player' }}
              sourcePaths={[]}
              existingParty={[]}
              sheetService={sheetServicePreview}
              vaultConnected={false}
              onLinkCharacter={() => undefined}
              onUnlink={() => undefined}
            />
          </div>
        ),
      };
    case 'src/app/components/panels/TicketUpdatesPanel.tsx':
      return {
        title: 'TicketUpdatesPanel.tsx',
        node: <TicketUpdatesPanel />,
      };
    case 'src/app/components/panels/signals/SignalRow.tsx':
      return {
        title: 'SignalRow.tsx',
        subtitle:
          'HudListRow + HudListRowTitle + HudListRowMeta primitives are ready in `ui/`; pending consumption to replace the inline row shell and meta strip.',
        node: (
          <div style={{ padding: 10 }}>
            <SignalRow
              signal={SAMPLE_SIGNAL}
              onAcknowledge={() => undefined}
              onResolve={() => undefined}
              onStatusChange={() => undefined}
              onAppendResponse={() => undefined}
              onAgentAction={async (_id) => undefined}
              onGenerateReply={async (_id) => ''}
              onGetAgentPlan={async (_id) => ''}
            />
          </div>
        ),
      };
    case 'src/app/panel-builder/SignalBlockRuntime.tsx':
      return {
        title: 'SignalBlockRuntime.tsx',
        subtitle:
          'SignalListRuntime + SignalBlockProvider (mock docs provider). MetricTile adopted on the stats runtime tiles (2026-05-12); local stat() helper retired. PanelBlockShell still pending adoption to retire local BlockShell.',
        node: <SignalListBacklogPreview />,
      };
    case 'src/app/HUDView.tsx':
      return {
        title: 'HUDView.tsx',
        subtitle: 'Full HUD shell is not embedded here — run the Sprite HUD app. Covered by npm run test:hud-chrome.',
        node: (
          <div style={{ padding: 16, color: 'var(--hud-text-2)', fontSize: 11, lineHeight: 1.65 }}>
            HUDView hosts the panel grid, toolbar, and bridge-driven chrome. Open the desktop app or dev HUD route for the
            real layout; refactors here have high WKWebView scrollbar risk.
          </div>
        ),
      };
    case 'src/app/components/SettingsModal.tsx':
      return {
        title: 'SettingsModal.tsx',
        subtitle: 'Modal chrome uses a portal + router for “new workspace”. Body below is real AppSettingsPanel (global section).',
        node: (
          <div style={{ maxHeight: 420, overflow: 'auto' }}>
            <AppSettingsPanel activeSection="global" layoutVariant="modal" />
          </div>
        ),
      };
    case 'src/app/components/panels/ModeManagerSection.tsx':
      return {
        title: 'ModeManagerSection.tsx',
        node: (
          <ModeManagerSection
            variant="full"
            activeMode={previewMode}
            modes={modes}
            onSwitchMode={() => undefined}
            onRenameMode={() => undefined}
            onSetModeIcon={() => undefined}
          />
        ),
      };
    case 'src/app/components/panels/NoteCard.tsx':
      return {
        title: 'NoteCard.tsx',
        node: <NoteCardPreviewInner />,
      };
    case 'src/app/components/panels/TicketingIntegrationsSection.tsx':
      return {
        title: 'TicketingIntegrationsSection.tsx',
        node: <TicketingIntegrationsSection modeTemplate="productivity" />,
      };
    case 'src/app/components/panels/TranscriptionPanel.tsx':
      return {
        title: 'TranscriptionPanel.tsx',
        node: <TranscriptionPanel />,
      };
    case 'src/app/panel-builder/CustomPanelRuntime.tsx':
      return {
        title: 'CustomPanelRuntime.tsx',
        node: (
          <div style={{ padding: 12 }}>
            <CustomPanelRuntime definition={createDefaultCustomPanelDefinition(PREVIEW_MODE_ID)} mode="preview" />
          </div>
        ),
      };
    case 'src/app/panel-builder/SessionRecapBuilderPreview.tsx':
      return {
        title: 'SessionRecapBuilderPreview.tsx',
        node: (
          <div style={{ padding: 12 }}>
            <SessionRecapBuilderPreview />
          </div>
        ),
      };
    default:
      return null;
  }
}

export function WeftConformanceBacklogPreviews() {
  const high = WEFT_CONFORMANCE_BACKLOG.filter((r) => r.severity === 'HIGH');
  const medium = WEFT_CONFORMANCE_BACKLOG.filter((r) => r.severity === 'MEDIUM');

  return (
    <HUDPanelProviders>
      <div style={{ marginTop: 28 }}>
        <div
          style={{
            color: 'var(--hud-text-3)',
            fontFamily: 'var(--weft-font-sans)',
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 14,
          }}
        >
          Live HUD previews (HIGH)
        </div>
        {high.map((row) => {
          const meta = renderPreviewForPath(row.relativePath);
          const anchor = backlogPreviewAnchorId(row.relativePath);
          if (!meta) return null;
          return (
            <PreviewCard key={row.relativePath} anchorId={anchor} title={meta.title} subtitle={meta.subtitle} maxHeight={320}>
              {meta.node}
            </PreviewCard>
          );
        })}

        <div
          style={{
            color: 'var(--hud-text-3)',
            fontFamily: 'var(--weft-font-sans)',
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 14,
            marginTop: 8,
          }}
        >
          Live HUD previews (MEDIUM)
        </div>
        {medium.map((row) => {
          const meta = renderPreviewForPath(row.relativePath);
          const anchor = backlogPreviewAnchorId(row.relativePath);
          if (!meta) return null;
          const maxHeight = row.relativePath.includes('HUDView') ? 140 : 300;
          return (
            <PreviewCard key={row.relativePath} anchorId={anchor} title={meta.title} subtitle={meta.subtitle} maxHeight={maxHeight}>
              {meta.node}
            </PreviewCard>
          );
        })}
      </div>
    </HUDPanelProviders>
  );
}
