import * as React from 'react';
import { Calendar } from '../../ui/calendar';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { SearchField } from '../../ui/search-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { Textarea } from '../../ui/textarea';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** A fixed month so the calendar renders the same cells on every visit. */
const MONTH = new Date(2026, 2, 1);
const DAY = new Date(2026, 2, 15);

/** Label and the control it names share one generated id. */
function LabelSpecimen({ children, disabled, ...p }: React.ComponentProps<typeof Label> & { disabled?: boolean }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-2" style={{ width: 220 }}>
      <Label htmlFor={id} {...p}>{children}</Label>
      <Input id={id} placeholder="e.g. northstar" state={disabled ? 'disabled' : undefined} className="peer" />
    </div>
  );
}

/** Specimens for the inputs category. One entry per component id; see ../specimen-types.ts. */
export const inputsSpecimens: Record<string, Specimen> = {
  input: {
    component: 'Input',
    module: 'input',
    base: { 'aria-label': 'Title', defaultValue: 'Brindlewick arc' },
    states: [
      { label: 'Empty with placeholder', props: { defaultValue: '', placeholder: 'Title' }, code: '<Input placeholder="Title" />', note: 'A placeholder is a hint, never the label.' },
      { label: 'Error', props: { state: 'error', 'aria-describedby': undefined }, code: '<Input state="error" aria-describedby="title-error" />' },
      { label: 'Read only', props: { state: 'readonly' }, code: '<Input state="readonly" />' },
      { label: 'Disabled', props: { state: 'disabled' }, code: '<Input state="disabled" />' },
    ],
    render: (p: P) => <Input {...(p as React.ComponentProps<typeof Input>)} />,
  },
  textarea: {
    component: 'Textarea',
    module: 'textarea',
    base: { 'aria-label': 'Notes', defaultValue: 'Keep scenes tight and spotlight player choices.', rows: 2 },
    render: (p: P) => <Textarea {...(p as React.ComponentProps<typeof Textarea>)} />,
  },
  select: {
    component: 'SelectTrigger',
    module: 'select',
    base: { 'aria-label': 'Range' },
    render: (p: P) => (
      <Select defaultValue="7d">
        <SelectTrigger {...(p as React.ComponentProps<typeof SelectTrigger>)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  calendar: {
    component: 'Calendar',
    module: 'calendar',
    base: { mode: 'single', selected: DAY, defaultMonth: MONTH, className: 'rounded-md border' },
    states: [
      { label: 'Single day', props: {}, code: '<Calendar mode="single" selected={date} onSelect={setDate} />' },
      { label: 'Range', props: { mode: 'range', selected: { from: DAY, to: new Date(2026, 2, 19) } }, code: '<Calendar mode="range" selected={{ from, to }} onSelect={setRange} />', note: 'The start and end days are filled; the days between are tinted.' },
      { label: 'With disabled days', props: { disabled: { before: DAY } }, code: '<Calendar mode="single" disabled={{ before: today }} />', note: 'Days that cannot be chosen stay visible and are not focusable.' },
      { label: 'Without outside days', props: { showOutsideDays: false }, code: '<Calendar mode="single" showOutsideDays={false} />' },
    ],
    render: (p: P) => <Calendar {...(p as React.ComponentProps<typeof Calendar>)} />,
  },
  label: {
    component: 'Label',
    module: 'label',
    base: { children: 'Player handle' },
    states: [
      { label: 'Paired with a control', props: {}, code: '<Label htmlFor="handle">Player handle</Label><Input id="handle" />', note: 'htmlFor and the control id match, so clicking the label focuses the field.' },
      { label: 'Disabled control', props: { disabled: true }, code: '<Label htmlFor="handle" /><Input id="handle" state="disabled" className="peer" />', note: 'The label dims through peer-disabled when the control it names is disabled.' },
    ],
    render: ({ children, ...p }: P) => <LabelSpecimen {...(p as React.ComponentProps<typeof LabelSpecimen>)}>{children as React.ReactNode}</LabelSpecimen>,
  },
  'search-field': {
    component: 'SearchField',
    module: 'search-field',
    base: { label: 'Search projects', defaultValue: 'board' },
    states: [
      { label: 'Empty', props: { defaultValue: '', placeholder: 'e.g. board' }, code: '<SearchField label="Search projects" placeholder="e.g. board" />', note: 'The clear control appears only once there is content to clear.' },
      { label: 'With content', props: {}, code: '<SearchField label="Search projects" defaultValue="board" />', note: 'The named clear control keeps focus in the field and never submits a form.' },
      { label: 'Custom clear label', props: { clearLabel: 'Clear project search' }, code: '<SearchField label="Search projects" clearLabel="Clear project search" />' },
      { label: 'Disabled', props: { disabled: true }, code: '<SearchField label="Search projects" disabled />' },
    ],
    render: (p: P) => (
      <div style={{ width: 260 }}>
        <SearchField {...(p as unknown as React.ComponentProps<typeof SearchField>)} />
      </div>
    ),
  },
  slider: {
    component: 'Slider',
    module: 'slider',
    base: { defaultValue: [40], max: 100, step: 1, thumbLabels: ['Volume'] },
    states: [
      { label: 'Single thumb', props: {}, code: '<Slider defaultValue={[40]} thumbLabels={["Volume"]} />', note: 'Every thumb carries its own accessible name through thumbLabels.' },
      { label: 'Range', props: { defaultValue: [20, 60], thumbLabels: ['Minimum', 'Maximum'] }, code: '<Slider defaultValue={[20, 60]} thumbLabels={["Minimum", "Maximum"]} />' },
      { label: 'Disabled', props: { disabled: true }, code: '<Slider defaultValue={[40]} disabled />' },
      { label: 'Vertical', props: { orientation: 'vertical' }, code: '<Slider orientation="vertical" defaultValue={[40]} />' },
    ],
    render: (p: P) => (
      <div style={p.orientation === 'vertical' ? { height: 180 } : { width: 220 }}>
        <Slider {...(p as React.ComponentProps<typeof Slider>)} />
      </div>
    ),
  },
};
