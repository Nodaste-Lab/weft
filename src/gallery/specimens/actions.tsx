import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const ICON = <Plus aria-hidden="true" focusable="false" />;

/** Specimens for the actions category. One entry per component id; see ../specimen-types.ts. */
export const actionsSpecimens: Record<string, Specimen> = {
  button: {
    component: 'Button',
    module: 'button',
    base: { children: 'Save changes' },
    axisBase: { size: {} },
    states: [
      { label: 'Disabled', props: { disabled: true }, code: '<Button disabled>', note: 'The action cannot be taken now and no input would change that.' },
      { label: 'Loading', props: { loading: true }, code: '<Button loading>', note: 'The action was taken and is in flight.' },
      { label: 'Blocked', props: { blocked: true }, code: '<Button blocked>', note: 'The action is not available until something else happens; say what.' },
      { label: 'Pressed', props: { pressed: true }, code: '<Button pressed>', note: 'A toggle-style button that is currently on.' },
      { label: 'With icon', props: { children: <>{ICON}Add item</> }, code: '<Button><Plus aria-hidden /> Add item</Button>' },
      { label: 'Icon only', props: { size: 'icon', 'aria-label': 'Add item', children: ICON }, code: '<Button size="icon" aria-label="Add item"><Plus aria-hidden /></Button>', note: 'An icon-only button always carries an accessible name.' },
    ],
    render: ({ children, ...p }: P) => (
      <Button {...(p as React.ComponentProps<typeof Button>)} aria-label={p.size === 'icon' ? ((p['aria-label'] as string) ?? 'Add item') : undefined}>
        {p.size === 'icon' ? ICON : (children as React.ReactNode)}
      </Button>
    ),
  },
};
