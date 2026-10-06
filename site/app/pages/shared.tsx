import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { MarkDownRenderer } from '../../../src/ui/markdown-renderer';
import { hrefFor, type Section } from '../routes';

export function PageTitle({ eyebrow, title, summary, meta }: { eyebrow?: string; title: string; summary?: string; meta?: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 6, marginBottom: 24 }}>
      {eyebrow ? <span className="weft-eyebrow">{eyebrow}</span> : null}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={titleStyle}>{title}</h1>
        {meta ? <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{meta}</div> : null}
      </div>
      {summary ? <p style={summaryStyle}>{summary}</p> : null}
    </div>
  );
}

export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} style={h2Style}>
      {children}
    </h2>
  );
}

/** Markdown body; the renderer skips raw HTML and blocks images by design. */
export function Markdown({ markdown }: { markdown: string }) {
  return <MarkDownRenderer markdown={markdown} className="weft-prose" style={{ display: 'grid', gap: 10 }} />;
}

export function NotYetWritten({ what }: { what: string }) {
  return (
    <p style={notYetStyle} data-not-yet-written={what}>
      Not yet written.
    </p>
  );
}

export function LinkList({ label, section, ids, labelFor }: { label: string; section: Section; ids: readonly string[]; labelFor?: (id: string) => string }) {
  if (!ids.length) return null;
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <span style={metaLabelStyle}>
        {label} ({ids.length})
      </span>
      <ul aria-label={label} style={chipListStyle}>
        {ids.map((id) => (
          <li key={id}>
            <a href={hrefFor(section, id)} style={chipLinkStyle}>
              {labelFor ? labelFor(id) : id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code style={codeStyle}>{children}</code>;
}

export function Frame({ children, minHeight = 160 }: { children: ReactNode; minHeight?: number }) {
  return <div style={{ ...frameStyle, minHeight }}>{children}</div>;
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <table className="weft-table" style={{ width: '100%' }}>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col" style={{ textAlign: 'left', padding: '6px 10px', whiteSpace: 'nowrap' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i}>
            {cells.map((c, j) => (
              <td key={j} style={{ padding: '4px 10px', verticalAlign: 'top' }}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--weft-font-serif)',
  fontWeight: 400,
  fontSize: 34,
  letterSpacing: '-0.02em',
};

const summaryStyle: CSSProperties = { margin: 0, color: 'var(--muted-foreground)', fontSize: 15, lineHeight: 1.5, maxWidth: 720 };

const h2Style: CSSProperties = { margin: '32px 0 10px', fontSize: 18, fontWeight: 600 };

const notYetStyle: CSSProperties = { margin: 0, color: 'var(--muted-foreground)', fontStyle: 'italic', fontSize: 14 };

export const metaLabelStyle: CSSProperties = { fontFamily: 'var(--weft-font-mono)', fontSize: 11, color: 'var(--muted-foreground)' };

const chipListStyle: CSSProperties = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 6 };

const chipLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 'var(--weft-touch-target, 24px)',
  padding: '2px 8px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-pill)',
  color: 'var(--primary)',
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 12,
  textDecoration: 'none',
};

export const codeStyle: CSSProperties = {
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 12,
  color: 'var(--primary)',
  background: 'var(--muted)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xs)',
  padding: '1px 5px',
};

const frameStyle: CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--card)',
  padding: 16,
};

export const tagStyle: CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-pill)',
  color: 'var(--muted-foreground)',
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 11,
  padding: '2px 8px',
};

/** "Last edited 2026-10-06" with the per-file breakdown in the title; "uncommitted" when a part has unsaved edits. */
export function LastEdited({ entry }: { entry?: { latest: string | null; source: string | null; docs: string | null; specimen?: string | null; fixture?: string | null } }) {
  if (!entry || !entry.latest) return null;
  const parts = [
    ['source', entry.source],
    ['docs', entry.docs],
    ['specimen', entry.specimen],
    ['fixture', entry.fixture],
  ].filter(([, v]) => v) as [string, string][];
  return (
    <span style={tagStyle} title={parts.map(([k, v]) => `${k}: ${v}`).join(' · ')} data-last-edited={entry.latest}>
      Last edited {entry.latest}
    </span>
  );
}
