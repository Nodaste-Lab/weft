import * as React from 'react';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { HudToggleSwitch } from '../../ui/hud-toggle-switch';
import { ModeOnlyToggle } from '../../ui/mode-only-toggle';
import { PillToggleGroup, PillToggleGroupItem } from '../../ui/pill-toggle-group';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Switch } from '../../ui/switch';
import { Toggle } from '../../ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const noop = () => undefined;

const PERIODS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];
const MORE_PERIODS = [...PERIODS, { value: 'quarter', label: 'Quarter' }, { value: 'year', label: 'Year' }];

const ALIGNMENTS = [
  { value: 'left', label: 'Align left', icon: AlignLeft },
  { value: 'center', label: 'Align centre', icon: AlignCenter },
  { value: 'right', label: 'Align right', icon: AlignRight },
];

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
  'hud-toggle-switch': {
    component: 'HudToggleSwitch',
    module: 'hud-toggle-switch',
    base: { active: false, ariaLabel: 'Notifications', onToggle: noop },
    states: [
      { label: 'Off', props: {}, code: '<HudToggleSwitch active={false} ariaLabel="Notifications" onToggle={toggle} />' },
      { label: 'On', props: { active: true }, code: '<HudToggleSwitch active ariaLabel="Notifications" onToggle={toggle} />', note: 'Exposed as a pressed button; the thumb position is the non-colour signal.' },
      { label: 'Disabled off', props: { disabled: true }, code: '<HudToggleSwitch active={false} disabled … />' },
      { label: 'Disabled on', props: { active: true, disabled: true }, code: '<HudToggleSwitch active disabled … />' },
    ],
    render: (p: P) => <HudToggleSwitch {...(p as unknown as React.ComponentProps<typeof HudToggleSwitch>)} />,
  },
  'mode-only-toggle': {
    component: 'ModeOnlyToggle',
    module: 'mode-only-toggle',
    base: { active: false, label: 'Use only in focus mode', onToggle: noop },
    states: [
      { label: 'Off', props: {}, code: '<ModeOnlyToggle active={false} label="Use only in focus mode" onToggle={toggle} />' },
      { label: 'On', props: { active: true }, code: '<ModeOnlyToggle active label="Use only in focus mode" onToggle={toggle} />', note: 'The label and the track both change; the thumb moves right.' },
      { label: 'Disabled', props: { disabled: true }, code: '<ModeOnlyToggle active={false} label="…" onToggle={toggle} disabled />' },
    ],
    render: (p: P) => <ModeOnlyToggle {...(p as React.ComponentProps<typeof ModeOnlyToggle>)} />,
  },
  'pill-toggle-group': {
    component: 'PillToggleGroup',
    module: 'pill-toggle-group',
    base: { value: 'week', onValueChange: noop, 'aria-label': 'Period', options: PERIODS },
    states: [
      { label: 'Up to three options', props: {}, code: '<PillToggleGroup value="week" onValueChange={setPeriod}><PillToggleGroupItem value="day">Day</PillToggleGroupItem>…</PillToggleGroup>', note: 'Three or fewer pills share the row width equally.' },
      { label: 'More than three options', props: { options: MORE_PERIODS }, code: '<PillToggleGroup value="week" onValueChange={setPeriod}>{five items}</PillToggleGroup>', note: 'Past three, each pill hugs its label and the row wraps.' },
      { label: 'Disabled option', props: { disabledValue: 'month' }, code: '<PillToggleGroupItem value="month" disabled>Month</PillToggleGroupItem>' },
    ],
    render: ({ options, disabledValue, ...p }: P) => (
      <div style={{ width: 280 }}>
        <PillToggleGroup {...(p as React.ComponentProps<typeof PillToggleGroup>)}>
          {(options as typeof PERIODS).map((option) => (
            <PillToggleGroupItem key={option.value} value={option.value} disabled={option.value === disabledValue}>
              {option.label}
            </PillToggleGroupItem>
          ))}
        </PillToggleGroup>
      </div>
    ),
  },
  'radio-group': {
    component: 'RadioGroup',
    module: 'radio-group',
    base: { defaultValue: 'manual', 'aria-label': 'Review mode' },
    states: [
      { label: 'With selection', props: {}, code: '<RadioGroup defaultValue="manual"><label><RadioGroupItem value="manual" /> Manual review</label>…</RadioGroup>' },
      { label: 'No selection yet', props: { defaultValue: undefined }, code: '<RadioGroup aria-label="Review mode">', note: 'Nothing is chosen until the user chooses; do not preselect a consequential option.' },
      { label: 'Error', props: { state: 'error' }, code: '<RadioGroup state="error">', note: 'The group reads aria-invalid and every item border follows.' },
      { label: 'Disabled', props: { state: 'disabled' }, code: '<RadioGroup state="disabled">' },
    ],
    render: (p: P) => (
      <RadioGroup {...(p as React.ComponentProps<typeof RadioGroup>)}>
        <label className="flex items-center gap-2 text-sm">
          <RadioGroupItem value="manual" />
          <span>Manual review</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <RadioGroupItem value="auto" />
          <span>Auto-publish</span>
        </label>
      </RadioGroup>
    ),
  },
  'toggle-group': {
    component: 'ToggleGroup',
    module: 'toggle-group',
    base: { type: 'single', defaultValue: 'center', 'aria-label': 'Alignment', size: 'sm' },
    states: [
      { label: 'Single selection', props: {}, code: '<ToggleGroup type="single" defaultValue="center" aria-label="Alignment">', note: 'Exactly one item can be on; icons carry an aria-label each.' },
      { label: 'Multiple selection', props: { type: 'multiple', defaultValue: ['left', 'right'] }, code: '<ToggleGroup type="multiple" defaultValue={["left", "right"]}>' },
      { label: 'Outline', props: { variant: 'outline' }, code: '<ToggleGroup variant="outline">' },
      { label: 'Joined', props: { joined: true, text: true }, code: '<ToggleGroup joined>', note: 'Items share one outer border; use for segmented controls.' },
      { label: 'Disabled', props: { disabled: true }, code: '<ToggleGroup disabled>' },
    ],
    render: ({ text, ...p }: P) => (
      <ToggleGroup {...(p as unknown as React.ComponentProps<typeof ToggleGroup>)}>
        {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem key={value} value={value} aria-label={text ? undefined : label}>
            {text ? label.replace('Align ', '') : <Icon aria-hidden="true" focusable="false" />}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    ),
  },
};
