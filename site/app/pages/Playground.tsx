import React from 'react';
import type { CSSProperties } from 'react';
import { Button } from '../../../src/ui/button';
import { Checkbox } from '../../../src/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '../../../src/ui/toggle-group';
import { specimens } from '../../../src/gallery/specimens';
import { coerceAxisValue, contractProps, jsxReference } from '../../../src/gallery/specimen-types';
import { axesFor, surfaceFor } from './SpecimenMatrix';
import { Code, metaLabelStyle } from './shared';
import { displayTitle } from '../nav';

/**
 * One live instance with a control per variant axis and a toggle per state.
 * Variants are the values of one prop and exclude each other; states layer on
 * top of any variant. The code reference rewrites as the controls change, so
 * the relationship is read off the label, not inferred from a grid.
 */
const UNSET = '__unset__';

export function Playground({ id, defaults }: { id: string; defaults?: Record<string, unknown> }) {
  const specimen = specimens[id];
  const allAxes = axesFor(id);
  const axes = specimen?.axes ? specimen.axes.map((p) => allAxes.find((a) => a.prop === p)).filter((a): a is { prop: string; values: string[] } => Boolean(a)) : allAxes;
  const states = specimen?.states ?? [];

  const [axisValues, setAxisValues] = React.useState<Record<string, string>>({});
  const [activeStates, setActiveStates] = React.useState<string[]>([]);

  React.useEffect(() => {
    setAxisValues({});
    setActiveStates([]);
  }, [id]);

  if (!specimen) return null;

  const base = {...specimen.base,...defaults};
  const shown: Record<string, unknown> = {};
  for (const axis of axes) {
    const v = axisValues[axis.prop];
    if (v !== undefined) {
      Object.assign(shown, specimen.axisBase?.[axis.prop] ?? {});
      shown[axis.prop] = coerceAxisValue(v);
    }
  }
  for (const label of activeStates) {
    const state = states.find((s) => s.label === label);
    if (state) Object.assign(shown, state.props);
  }
  const stateCodes = activeStates.map((label) => states.find((s) => s.label === label)?.code).filter(Boolean);
  const reference = jsxReference(specimen.component, contractProps(id === 'text-field' ? {...base,...shown} : shown, surfaceFor(id))) + (id === 'text-field' ? '</TextField>' : '');
  const dirty = Object.keys(axisValues).length > 0 || activeStates.length > 0;
  const pageExport = displayTitle(id).replace(/\s+/g, '');
  const isPart = specimen.component.toLowerCase() !== pageExport.toLowerCase();

  return (
    <div className="field-playground" style={playgroundStyle} data-playground={id}>
      <div style={stageStyle}>
        <span style={metaLabelStyle}>
          Rendering <Code>{specimen.component}</Code>
          {isPart ? <> as one part of the {displayTitle(id)} composition; the other parts stay fixed</> : null}
        </span>
        <div key={id === 'text-field' ? reference : undefined} style={stageSurfaceStyle} aria-live="polite" aria-atomic="true">
          {specimen.render({ ...base, ...shown })}
        </div>
        <div style={{ display: 'grid', gap: 4 }}>
          <code style={referenceStyle}>{reference}</code>
          {stateCodes.length ? (
            <span style={stateCodeStyle}>
              States applied: {stateCodes.map((c, i) => (
                <React.Fragment key={c}>
                  {i > 0 ? ' · ' : null}
                  <code>{c}</code>
                </React.Fragment>
              ))}
            </span>
          ) : null}
        </div>
      </div>

      <div style={controlsStyle}>
        <div style={controlsHeaderStyle}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Props on <Code>{specimen.component}</Code>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!dirty}
            onClick={() => {
              setAxisValues({});
              setActiveStates([]);
            }}
          >
            Reset
          </Button>
        </div>

        {axes.length ? (
          <div style={groupStyle}>
            <span style={metaLabelStyle}>Variants: one value per prop; not set means the component default</span>
            {axes.map((axis) => (
              <div key={axis.prop} style={controlStyle}>
                <span style={controlLabelStyle} id={`control-${id}-${axis.prop}`}>
                  {axis.prop}
                </span>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  className="flex-wrap gap-1"
                  aria-labelledby={`control-${id}-${axis.prop}`}
                  value={axisValues[axis.prop] ?? UNSET}
                  onValueChange={(value: string) =>
                    setAxisValues((prev) => {
                      const next = { ...prev };
                      if (value && value !== UNSET) next[axis.prop] = value;
                      else if (value === UNSET) delete next[axis.prop];
                      return next;
                    })
                  }
                >
                  <ToggleGroupItem
                    value={UNSET}
                    aria-label={`${axis.prop} not set, component default`}
                    className="min-w-fit flex-none px-2"
                  >
                    not set
                  </ToggleGroupItem>
                  {axis.values.map((value) => (
                    <ToggleGroupItem key={value} value={value} aria-label={`${axis.prop} ${value}`} className="min-w-fit flex-none px-2">
                      {value}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            ))}
          </div>
        ) : null}

        {states.length ? (
          <div style={groupStyle}>
            <span style={metaLabelStyle}>{id === 'text-field' ? 'States and optional content: select only what the field needs' : 'States: each adds its props on top of the variants above'}</span>
            {states.map((state) => {
              const on = activeStates.includes(state.label);
              const switchId = `state-${id}-${state.label.replace(/\W+/g, '-').toLowerCase()}`;
              return (
                <div key={state.label} style={stateRowStyle}>
                  <Checkbox
                    id={switchId}
                    checked={on}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      setActiveStates((prev) => (checked === true ? [...prev.filter((l) => l !== state.label), state.label] : prev.filter((l) => l !== state.label)))
                    }
                  />
                  <label htmlFor={switchId} style={stateLabelStyle}>
                    <span>{state.label}</span>
                    {state.note ? <span style={stateNoteStyle}>{state.note}</span> : null}
                  </label>
                </div>
              );
            })}
          </div>
        ) : null}

        {!axes.length && !states.length ? (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>This component has no variant props or named states; the example above is its only form.</p>
        ) : null}
      </div>
    </div>
  );
}

const playgroundStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 320px',
  gap: 16,
  alignItems: 'start',
};

const stageStyle: CSSProperties = { display: 'grid', gap: 10, minWidth: 0 };

const stageSurfaceStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 220,
  padding: 24,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--card)',
  overflow: 'auto',
};

const referenceStyle: CSSProperties = {
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 13,
  color: 'var(--primary)',
  background: 'var(--muted)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 12px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const stateCodeStyle: CSSProperties = { fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--weft-font-mono)' };

const controlsStyle: CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 14,
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--card)',
  position: 'sticky',
  top: 16,
};

const controlsHeaderStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const groupStyle: CSSProperties = { display: 'grid', gap: 10 };
const controlStyle: CSSProperties = { display: 'grid', gap: 4 };
const controlLabelStyle: CSSProperties = { fontFamily: 'var(--weft-font-mono)', fontSize: 12 };
const stateRowStyle: CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 10, minHeight: 'var(--weft-touch-target, 24px)' };
const stateLabelStyle: CSSProperties = { display: 'grid', gap: 2, fontSize: 13, cursor: 'pointer' };
const stateNoteStyle: CSSProperties = { fontSize: 11, color: 'var(--muted-foreground)' };
