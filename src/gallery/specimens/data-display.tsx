import * as React from 'react';
import { Chip } from '../../ui/chip';
import { Dot } from '../../ui/dot';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the data-display category. One entry per component id; see ../specimen-types.ts. */
export const data_displaySpecimens: Record<string, Specimen> = {
  chip: {
    component: 'Chip',
    module: 'chip',
    base: { children: 'source:email' },
    states: [
      { label: 'Removable', props: { onRemove: () => undefined, removeLabel: 'Remove source:email' }, code: '<Chip onRemove={…} removeLabel="Remove source:email">' },
      { label: 'Selectable, selected', props: { onSelect: () => undefined, selected: true }, code: '<Chip onSelect={…} selected>' },
    ],
    render: ({ children, ...p }: P) => <Chip {...(p as React.ComponentProps<typeof Chip>)}>{children as React.ReactNode}</Chip>,
  },
  dot: {
    component: 'Dot',
    module: 'dot',
    base: { label: 'Ready' },
    render: (p: P) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Dot {...(p as React.ComponentProps<typeof Dot>)} />
        <span style={{ fontSize: 12 }}>{String(p.tone ?? 'muted')}</span>
      </span>
    ),
  },
};
