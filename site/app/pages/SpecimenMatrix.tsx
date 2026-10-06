import React from 'react';
import type { CSSProperties } from 'react';
import propsSnapshot from '../../../props-snapshot.json';
import { specimens } from '../../../src/gallery/specimens';
import { coerceAxisValue, jsxReference } from '../../../src/gallery/specimen-types';
import { Code, NotYetWritten, Table, metaLabelStyle } from './shared';

type PropEntry = { optional: boolean; union: string[] | null };
type Surface = { surface: { props: Record<string, PropEntry> } };

const AXIS_ORDER = ['variant', 'tone', 'size', 'density', 'state', 'urgency', 'orientation', 'measure', 'weight'];
const EXCLUDED_AXES = new Set(['as', 'asChild']);

/** Enumerable props from the contract, in a stable display order. */
export function axesFor(id: string): { prop: string; values: string[] }[] {
  const entry = (propsSnapshot as { components: Record<string, Surface> }).components[id];
  if (!entry) return [];
  return Object.entries(entry.surface.props)
    .filter(([name, p]) => Array.isArray(p.union) && p.union.length > 0 && !EXCLUDED_AXES.has(name))
    .sort(([a], [b]) => {
      const ia = AXIS_ORDER.indexOf(a);
      const ib = AXIS_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    })
    .map(([prop, p]) => ({ prop, values: p.union as string[] }));
}

export function SpecimenMatrix({ id }: { id: string }) {
  const specimen = specimens[id];
  let axes = axesFor(id);
  if (specimen?.axes) axes = specimen.axes.map((prop) => axes.find((a) => a.prop === prop)).filter((a): a is { prop: string; values: string[] } => Boolean(a));

  if (!specimen) {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {axes.length ? (
          <Table
            head={['Prop', 'Values', 'Reference']}
            rows={axes.map((a) => [
              <Code key="p">{a.prop}</Code>,
              a.values.map((v) => <Code key={v}>{v}</Code>),
              <Code key="r">{`${a.prop}="${a.values[0]}"`}</Code>,
            ])}
          />
        ) : null}
        <NotYetWritten what={`${id}:specimens`} />
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>
          Rendered variants and states need a specimen in <Code>src/gallery/specimens.tsx</Code>.
        </p>
      </div>
    );
  }

  const base = specimen.base ?? {};
  const name = specimen.component;
  const importLine = `import { ${name} } from '@nodaste-lab/weft/src/ui/${specimen.module}';`;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <pre style={importStyle}>{importLine}</pre>

      {axes.map((axis) => (
        <div key={axis.prop} style={{ display: 'grid', gap: 8 }}>
          <span style={metaLabelStyle}>
            {axis.prop} ({axis.values.length})
          </span>
          <div style={rowStyle}>
            {axis.values.map((value) => {
              const extra = specimen.axisBase?.[axis.prop] ?? {};
              const shown = { ...extra, [axis.prop]: coerceAxisValue(value) };
              return (
                <Cell key={value} code={jsxReference(name, shown)}>
                  {specimen.render({ ...base, ...shown })}
                </Cell>
              );
            })}
          </div>
        </div>
      ))}

      {specimen.states?.length ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <span style={metaLabelStyle}>states ({specimen.states.length})</span>
          <div style={rowStyle}>
            {specimen.states.map((state) => (
              <Cell key={state.label} code={state.code} note={state.note} label={state.label}>
                {specimen.render({ ...base, ...state.props })}
              </Cell>
            ))}
          </div>
        </div>
      ) : null}

      {axes.length >= 2 ? <Grid name={name} axes={[axes[0], axes[1]]} specimen={specimen} base={base} /> : null}

      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>
        Hover, focus and active are live: use the pointer or Tab through the cells.
      </p>
    </div>
  );
}

function Grid({
  name,
  axes,
  specimen,
  base,
}: {
  name: string;
  axes: [{ prop: string; values: string[] }, { prop: string; values: string[] }];
  specimen: NonNullable<(typeof specimens)[string]>;
  base: Record<string, unknown>;
}) {
  const [rowsAxis, colsAxis] = axes;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <span style={metaLabelStyle}>
        {rowsAxis.prop} × {colsAxis.prop}
      </span>
      <div style={{ overflowX: 'auto' }}>
        <Table
          head={['', ...colsAxis.values.map((v) => `${colsAxis.prop}="${v}"`)]}
          rows={rowsAxis.values.map((rv) => [
            <Code key="r">{`${rowsAxis.prop}="${rv}"`}</Code>,
            ...colsAxis.values.map((cv) => {
              const shown = {
                ...(specimen.axisBase?.[rowsAxis.prop] ?? {}),
                ...(specimen.axisBase?.[colsAxis.prop] ?? {}),
                [rowsAxis.prop]: coerceAxisValue(rv),
                [colsAxis.prop]: coerceAxisValue(cv),
              };
              return (
                <span key={cv} title={jsxReference(name, shown)}>
                  {specimen.render({ ...base, ...shown })}
                </span>
              );
            }),
          ])}
        />
      </div>
    </div>
  );
}

function Cell({ code, label, note, children }: { code: string; label?: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={cellStyle}>
      <div style={cellSurfaceStyle}>{children}</div>
      {label ? <span style={cellLabelStyle}>{label}</span> : null}
      <code style={cellCodeStyle}>{code}</code>
      {note ? <span style={cellNoteStyle}>{note}</span> : null}
    </div>
  );
}

const importStyle: CSSProperties = {
  margin: 0,
  padding: '8px 12px',
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 12,
  background: 'var(--muted)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  overflowX: 'auto',
};

const rowStyle: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'stretch' };

const cellStyle: CSSProperties = {
  display: 'grid',
  gap: 6,
  alignContent: 'start',
  minWidth: 160,
  maxWidth: 320,
  padding: 10,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--card)',
};

const cellSurfaceStyle: CSSProperties = { display: 'flex', alignItems: 'center', minHeight: 44 };
const cellLabelStyle: CSSProperties = { fontSize: 12, fontWeight: 600 };
const cellCodeStyle: CSSProperties = { fontFamily: 'var(--weft-font-mono)', fontSize: 11, color: 'var(--primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
const cellNoteStyle: CSSProperties = { fontSize: 11, color: 'var(--muted-foreground)' };
