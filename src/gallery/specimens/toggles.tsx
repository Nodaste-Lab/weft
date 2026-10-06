import * as React from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Switch } from '../../ui/switch';
import { Toggle } from '../../ui/toggle';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the toggles category. One entry per component id; see ../specimen-types.ts. */
export const togglesSpecimens: Record<string, Specimen> = {
  switch: {
    component: 'Switch',
    module: 'switch',
    base: { 'aria-label': 'Notifications' },
    states: [
      { label: 'Off', props: {}, code: '<Switch />' },
      { label: 'On', props: { defaultChecked: true }, code: '<Switch defaultChecked />' },
      { label: 'Disabled off', props: { disabled: true }, code: '<Switch disabled />' },
      { label: 'Disabled on', props: { disabled: true, defaultChecked: true }, code: '<Switch disabled defaultChecked />' },
    ],
    render: (p: P) => <Switch {...(p as React.ComponentProps<typeof Switch>)} />,
  },
  checkbox: {
    component: 'Checkbox',
    module: 'checkbox',
    base: { 'aria-label': 'Include vault sources' },
    states: [
      { label: 'Unchecked', props: {}, code: '<Checkbox />' },
      { label: 'Checked', props: { defaultChecked: true }, code: '<Checkbox defaultChecked />' },
      { label: 'Indeterminate', props: { checked: 'indeterminate' }, code: '<Checkbox checked="indeterminate" />', note: 'Some, not all, of a group are checked.' },
      { label: 'Disabled', props: { disabled: true }, code: '<Checkbox disabled />' },
    ],
    render: (p: P) => <Checkbox {...(p as React.ComponentProps<typeof Checkbox>)} />,
  },
  toggle: {
    component: 'Toggle',
    module: 'toggle',
    base: { 'aria-label': 'Bold', children: 'B' },
    states: [
      { label: 'Off', props: {}, code: '<Toggle aria-label="Bold">' },
      { label: 'On', props: { defaultPressed: true }, code: '<Toggle aria-label="Bold" defaultPressed>' },
      { label: 'Disabled', props: { disabled: true }, code: '<Toggle aria-label="Bold" disabled>' },
    ],
    render: ({ children, ...p }: P) => <Toggle {...(p as React.ComponentProps<typeof Toggle>)}>{children as React.ReactNode}</Toggle>,
  },
};
