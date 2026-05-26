/**
 * Live previews of composite product surfaces (HUD glass) for the design-system page.
 * Cross-check with docs/DESIGN_SYSTEM_UNDOCUMENTED_PATTERNS_AUDIT.md for backlog context.
 */
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import { HUDPanelProviders } from '../app/AppProviders';
import { useNotes } from '../app/context/NotesContext';
import { CustomPanelsSection } from '../app/components/panels/CustomPanelsSection';
import { ModeManagerSection } from '../app/components/panels/ModeManagerSection';
import { MyAccountSection } from '../app/components/panels/MyAccountSection';
import { NoteCard } from '../app/components/panels/NoteCard';
import { SheetResolutionCard } from '../app/components/panels/SheetResolutionCard';
import { TranscriptionPanel } from '../app/components/panels/TranscriptionPanel';
import { CustomPanelRuntime } from '../app/panel-builder/CustomPanelRuntime';
import { createDefaultCustomPanelDefinition } from '../app/panel-builder/types';
import { buildDefaultPanels } from '../app/mode/panelRegistry';
import type { Mode } from '../app/mode/types';
import { PlayerSheetService } from '../app/services/playerSheetService';

const AUDIT_DOC_PATH = 'docs/DESIGN_SYSTEM_UNDOCUMENTED_PATTERNS_AUDIT.md';

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

function hudGlassShellStyle(maxHeight: number): CSSProperties {
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

function PatternSubheading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: 'var(--hud-text-3)',
        fontSize: 9,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 10,
        marginTop: 8,
      }}
    >
      {children}
    </div>
  );
}

function NoteCardLiveDemo() {
  const { addNote, state } = useNotes();
  const [ids, setIds] = useState<{ main: string | null; scratch: string | null }>({ main: null, scratch: null });
  const [expandedMain, setExpandedMain] = useState(true);
  const [expandedScratch, setExpandedScratch] = useState(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const main = addNote({
      content: 'Fog at the east gate — guards uneasy. #session',
      tags: ['#clue', '#combat'],
      dmOnly: false,
    });
    const scratch = addNote({
      content: 'Scratchpad: quick GM reminders and TODOs.',
      tags: [],
      dmOnly: false,
    });
    setIds({ main: main.id, scratch: scratch.id });
  }, [addNote]);

  const mainNote = ids.main ? state.notes.find((x) => x.id === ids.main) : undefined;
  const scratchNote = ids.scratch ? state.notes.find((x) => x.id === ids.scratch) : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
      {!mainNote ? (
        <div style={{ color: 'var(--hud-text-3)', fontSize: 12 }}>Loading sample note…</div>
      ) : (
        <NoteCard
          note={mainNote}
          expanded={expandedMain}
          onToggleExpand={() => setExpandedMain((v) => !v)}
        />
      )}
      {scratchNote ? (
        <NoteCard
          note={scratchNote}
          expanded={expandedScratch}
          onToggleExpand={() => setExpandedScratch((v) => !v)}
          isScratchpad
        />
      ) : null}
    </div>
  );
}

function UndocumentedPatternsLivePreviewInner() {
  const previewMode = makePreviewMode();
  const modes = [previewMode];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <PatternSubheading>Custom panel runtime (single-surface Weft)</PatternSubheading>
      <p style={{ margin: '0 0 12px', color: 'var(--hud-text-2)', fontSize: 'var(--text-xs)', lineHeight: 1.65 }}>
        Custom HUD panels are authored via your agent/tooling flow; below is a live preview of the single-surface runtime.
      </p>
      <div
        data-palette="hud-glass"
        style={{ ...hudGlassShellStyle(380), padding: 12 }}
      >
        <CustomPanelRuntime definition={createDefaultCustomPanelDefinition(PREVIEW_MODE_ID)} mode="preview" />
      </div>

      <PatternSubheading>Settings workspace modules</PatternSubheading>
      <div data-palette="hud-glass" style={hudGlassShellStyle(520)}>
        <ModeManagerSection
          variant="full"
          activeMode={previewMode}
          modes={modes}
          onSwitchMode={() => undefined}
          onRenameMode={() => undefined}
          onSetModeIcon={() => undefined}
        />
        <CustomPanelsSection activeMode={previewMode} />
        <div style={{ borderTop: '1px solid var(--hud-border)' }}>
          <MyAccountSection />
        </div>
      </div>

      <PatternSubheading>Transcription workspace layout</PatternSubheading>
      <div data-palette="hud-glass" style={hudGlassShellStyle(560)}>
        <TranscriptionPanel />
      </div>

      <PatternSubheading>Notes card (live)</PatternSubheading>
      <div data-palette="hud-glass" style={hudGlassShellStyle(420)}>
        <NoteCardLiveDemo />
      </div>

      <PatternSubheading>Sheet resolution / linking card</PatternSubheading>
      <div data-palette="hud-glass" style={{ ...hudGlassShellStyle(360), padding: 12 }}>
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
    </div>
  );
}

export function UndocumentedPatternsLivePreview() {
  return (
    <section style={{ marginBottom: 48 }} id="product-patterns-live">
      {/* Legacy hash target for bookmarks / external links */}
      <span
        id="undocumented-patterns-live"
        aria-hidden
        style={{ display: 'block', height: 0, overflow: 'hidden', scrollMarginTop: 28 }}
      />
      <div style={{ scrollMarginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <span style={{ color: 'var(--hud-text-3)', display: 'flex' }}>
            <Layers size={16} />
          </span>
          <h2
            id="product-patterns-live-title"
            style={{
              margin: 0,
              color: 'var(--hud-text-1)',
              fontFamily: 'var(--weft-font-sans)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Product surfaces — live preview
          </h2>
        </div>
        <div style={{ height: 1, background: 'var(--hud-border)', marginBottom: 20 }} />
      </div>

      <p
        style={{
          margin: '0 0 18px',
          color: 'var(--hud-text-2)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 'var(--text-xs)',
          lineHeight: 1.7,
        }}
      >
        Production components in <code style={{ fontSize: '0.92em' }}>data-palette=&quot;hud-glass&quot;</code> — static
        anatomy and rules are in each Product Patterns section below. Mechanical gaps and follow-ups:{' '}
        <code style={{ fontSize: '0.92em', color: 'var(--hud-text-1)' }}>{AUDIT_DOC_PATH}</code>. Wrapped in{' '}
        <code style={{ fontSize: '0.92em' }}>HUDPanelProviders</code> for context parity with the HUD.
      </p>

      <HUDPanelProviders>
        <UndocumentedPatternsLivePreviewInner />
      </HUDPanelProviders>
    </section>
  );
}
