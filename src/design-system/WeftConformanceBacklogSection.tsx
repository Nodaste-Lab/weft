import type { CSSProperties, ReactNode } from 'react';
import { ClipboardList } from 'lucide-react';
import {
  WEFT_CONFORMANCE_BACKLOG,
  WEFT_CONFORMANCE_EXCEPTIONS,
  backlogPreviewAnchorId,
  type WeftConformanceRow,
  type WeftConformanceSeverity,
} from './weftConformanceBacklog';
import { WeftConformanceBacklogPreviews } from './weftConformanceBacklogPreviews';

function DsCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        background: 'rgba(127,86,217,0.22)',
        border: '1px solid var(--hud-border-accent)',
        borderRadius: 'var(--radius-xs)',
        color: 'var(--hud-text-1)',
        fontFamily: 'monospace',
        fontSize: 10,
        padding: '1px 4px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </code>
  );
}

function DsCallout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '9px 13px',
        background: 'rgba(127,86,217,0.07)',
        border: '1px solid var(--hud-border-accent)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 18,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ color: 'var(--primary)', flexShrink: 0, fontFamily: 'monospace', fontSize: 13 }}>ℹ</span>
      <span
        style={{
          color: 'var(--hud-text-2)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 'var(--text-xs)',
          lineHeight: 1.65,
        }}
      >
        {children}
      </span>
    </div>
  );
}

const severityStyle = (severity: WeftConformanceSeverity): CSSProperties => ({
  fontFamily: 'var(--weft-font-sans)',
  fontSize: 9,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  padding: '2px 8px',
  borderRadius: 'var(--radius-pill)',
  border: '1px solid var(--hud-border)',
  width: 'fit-content',
  color: severity === 'HIGH' ? 'var(--hud-danger)' : 'var(--hud-warning)',
  background:
    severity === 'HIGH' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)',
});

function BacklogTable({ rows }: { rows: WeftConformanceRow[] }) {
  const cellBase: CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid var(--hud-border)',
    verticalAlign: 'top',
    fontFamily: 'var(--weft-font-sans)',
    fontSize: 11,
    lineHeight: 1.55,
    color: 'var(--hud-text-2)',
  };

  return (
    <div
      style={{
        marginBottom: 22,
        borderRadius: 'var(--radius-sm)',
        overflow: 'auto',
        border: '1px solid var(--hud-border)',
      }}
    >
      <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', background: 'var(--hud-surface-raised)' }}>
        <thead>
          <tr style={{ background: 'rgba(0,0,0,0.35)' }}>
            {['File', 'Severity', 'Migrate toward (design system)', 'New composites', 'Exceptions / notes'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  color: 'var(--hud-text-3)',
                  fontFamily: 'var(--weft-font-sans)',
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--hud-border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.relativePath}>
              <td style={cellBase}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--primary)', marginBottom: 6 }}>{row.relativePath}</div>
                <a
                  href={`#${backlogPreviewAnchorId(row.relativePath)}`}
                  style={{
                    fontSize: 10,
                    color: 'var(--hud-info)',
                    textDecoration: 'none',
                    fontFamily: 'var(--weft-font-sans)',
                    fontWeight: 600,
                  }}
                >
                  Jump to live preview ↓
                </a>
                <div style={{ color: 'var(--hud-text-3)', fontSize: 10, marginTop: 8 }}>{row.summary}</div>
              </td>
              <td style={{ ...cellBase, whiteSpace: 'nowrap' }}>
                <span style={severityStyle(row.severity)}>{row.severity}</span>
              </td>
              <td style={cellBase}>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {row.consumePrimitives.map((p) => (
                    <li key={p} style={{ marginBottom: 4 }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </td>
              <td style={cellBase}>{row.suggestedComposites}</td>
              <td style={cellBase}>
                {row.exceptions ? <div style={{ marginBottom: row.notes ? 8 : 0 }}>{row.exceptions}</div> : null}
                {row.notes ? <div style={{ color: 'var(--hud-text-3)', fontSize: 10 }}>{row.notes}</div> : null}
                {!row.exceptions && !row.notes ? '—' : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WeftConformanceBacklogSection() {
  const high = WEFT_CONFORMANCE_BACKLOG.filter((r) => r.severity === 'HIGH');
  const medium = WEFT_CONFORMANCE_BACKLOG.filter((r) => r.severity === 'MEDIUM');

  return (
    <section style={{ marginBottom: 48 }}>
      <div id="weft-conformance-backlog" style={{ scrollMarginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <span style={{ color: 'var(--hud-text-3)', display: 'flex' }}>
            <ClipboardList size={16} />
          </span>
          <h2
            style={{
              margin: 0,
              color: 'var(--hud-text-1)',
              fontFamily: 'var(--weft-font-sans)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Weft conformance backlog
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
        High-churn product surfaces from the mechanical audit (mostly dense <DsCode>style=&#123;&#125;</DsCode> layouts). Each row lists{' '}
        <strong style={{ color: 'var(--hud-text-1)' }}>what to adopt</strong> from{' '}
        <DsCode>src/app/components/ui/</DsCode> and documented patterns, and <strong style={{ color: 'var(--hud-text-1)' }}>optional composites</strong>{' '}
        to extract so panels behave consistently under Weft / HUD glass.
      </p>

      <DsCallout>
        Narrative detail &amp; interpretation:{' '}
        <strong style={{ color: 'var(--hud-text-1)' }}>docs/DESIGN_SYSTEM_UNDOCUMENTED_PATTERNS_AUDIT.md</strong> (§Weft conformance). Reproduce the
        severity table anytime with <DsCode>node scripts/audit-design-system.mjs</DsCode> (also <DsCode>npm run lint:design-system</DsCode>). This page is
        the operator migration map — not a substitute for the doc.
      </DsCallout>

      <div
        style={{
          color: 'var(--hud-text-3)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 10,
          marginTop: 8,
        }}
      >
        HIGH — inline-heavy ({high.length})
      </div>
      <BacklogTable rows={high} />

      <div
        style={{
          color: 'var(--hud-text-3)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 10,
          marginTop: 8,
        }}
      >
        MEDIUM ({medium.length})
      </div>
      <BacklogTable rows={medium} />

      <div
        style={{
          color: 'var(--hud-text-3)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 14,
          marginTop: 28,
        }}
      >
        Live HUD previews
      </div>
      <p
        style={{
          margin: '0 0 18px',
          color: 'var(--hud-text-2)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 'var(--text-xs)',
          lineHeight: 1.65,
        }}
      >
        Each card mounts the real component under <DsCode>data-palette=&quot;hud-glass&quot;</DsCode> and{' '}
        <DsCode>HUDPanelProviders</DsCode> where needed (same contract as <strong style={{ color: 'var(--hud-text-1)' }}>Live product preview</strong>
        ). Some shells (e.g. HUDView) are described in-page instead of embedded.
      </p>
      <WeftConformanceBacklogPreviews />

      <div
        style={{
          color: 'var(--hud-text-3)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 10,
          marginTop: 24,
        }}
      >
        Intentional exceptions (do not force token cleanup)
      </div>
      <div
        style={{
          border: '1px solid var(--hud-border)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          background: 'var(--hud-surface-raised)',
        }}
      >
        {WEFT_CONFORMANCE_EXCEPTIONS.map((ex, i) => (
          <div
            key={ex.relativePath}
            style={{
              padding: '10px 14px',
              borderBottom: i < WEFT_CONFORMANCE_EXCEPTIONS.length - 1 ? '1px solid var(--hud-border)' : 'none',
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--primary)', marginBottom: 6 }}>{ex.relativePath}</div>
            <div style={{ fontFamily: 'var(--weft-font-sans)', fontSize: 11, color: 'var(--hud-text-2)', lineHeight: 1.55 }}>{ex.rationale}</div>
          </div>
        ))}
      </div>

      <p
        style={{
          margin: '18px 0 0',
          color: 'var(--hud-text-3)',
          fontFamily: 'var(--weft-font-sans)',
          fontSize: 10,
          lineHeight: 1.6,
        }}
      >
        After toolbar / HUD chrome changes, run <DsCode>npm run test:hud-chrome</DsCode> and follow <DsCode>docs/REGRESSION_TEST_GUIDE.md</DsCode> — wide or
        tall layout churn affects WKWebView scrollbars.
      </p>
    </section>
  );
}
