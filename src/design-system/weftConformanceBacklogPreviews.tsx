/**
 * Live HUD-glass snapshots for §Weft conformance backlog rows (design-system page only).
 */
import React, { type CSSProperties, type ReactNode } from 'react';
import { SessionContextPanel } from '../app/components/panels/SessionContextPanel';
import { CustomPanelRuntime } from '../app/panel-builder/CustomPanelRuntime';
import { SessionRecapBuilderPreview } from '../app/panel-builder/SessionRecapBuilderPreview';
import { createDefaultCustomPanelDefinition } from '../app/panel-builder/types';
import { HUDPanelProviders } from '../app/AppProviders';
import { backlogPreviewAnchorId, WEFT_CONFORMANCE_BACKLOG } from './weftConformanceBacklog';

const PREVIEW_MODE_ID = '00000000-0000-4000-8000-0000000000ds';

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

function renderPreviewForPath(relativePath: string): { title: string; subtitle?: string; node: ReactNode } | null {
  switch (relativePath) {
    case 'src/app/components/panels/SessionContextPanel.tsx':
      return {
        title: 'SessionContextPanel.tsx',
        subtitle:
          'Includes theme lab (literal colors expected there). HudToggleSwitch, HudPopoverDropdown, SettingsModuleShell on keyboard/agent sections. Remaining inline-styled blocks concentrated in vault/source/hub/screen-share strips and theme lab.',
        node: <SessionContextPanel />,
      };
    case 'src/app/panel-builder/CustomPanelRuntime.tsx':
      return {
        title: 'CustomPanelRuntime.tsx',
        subtitle: 'RepeatListFieldColumn + block chrome; residual CSSProperties helpers on some block types.',
        node: (
          <div style={{ padding: 12 }}>
            <CustomPanelRuntime definition={createDefaultCustomPanelDefinition(PREVIEW_MODE_ID)} mode="preview" />
          </div>
        ),
      };
    case 'src/app/panel-builder/SessionRecapBuilderPreview.tsx':
      return {
        title: 'SessionRecapBuilderPreview.tsx',
        subtitle: 'PeriodChipRow on presets; panel card + toolbar still use CSSProperties layout helpers.',
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
          return (
            <PreviewCard key={row.relativePath} anchorId={anchor} title={meta.title} subtitle={meta.subtitle} maxHeight={300}>
              {meta.node}
            </PreviewCard>
          );
        })}
      </div>
    </HUDPanelProviders>
  );
}
