import { Combobox } from '../../ui/combobox';
import { MultiSelect } from '../../ui/multi-select';
import * as React from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { TextField } from '../../ui/text-field';
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
    <div className="flex items-center gap-2" style={{ width: 220, minHeight: 44 }}>
      <Checkbox id={id} disabled={disabled} className="peer"/>
      <Label htmlFor={id} {...p}>{children}</Label>
    </div>
  );
}


/** Demonstrates public Select + shared selection-field classes, not a new API. */
export function SelectFieldSpecimen({ error, description, status, required, disabled, ...props }: P) {
  const id = React.useId();
  const describedBy = [error && `${id}-error`, status && `${id}-status`, description && `${id}-help`].filter(Boolean).join(' ') || undefined;
  return <div className="weft-selection-field" data-invalid={!!error || undefined}>
    <Select name="keyType" defaultValue="personal" required={!!required} disabled={!!disabled}>
      <div className="weft-selection-control">
        <label htmlFor={id}>Key type{required ? ' (required)' : ''}</label>
        <SelectTrigger {...props} id={id} aria-describedby={describedBy} state={error ? 'error' : disabled ? 'disabled' : props.state as 'default' | undefined}>
          <SelectValue placeholder="Choose a key type" />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem value="personal">Personal API key</SelectItem>
        <SelectItem value="workspace">Workspace API key</SelectItem>
      </SelectContent>
    </Select>
    {!!error && <p id={`${id}-error`} className="weft-selection-error">{String(error)}</p>}
    {!!status && <p id={`${id}-status`} className="weft-selection-help">{String(status)}</p>}
    {!!description && <p id={`${id}-help`} className="weft-selection-help">{String(description)}</p>}
  </div>;
}

const selectionOptions = [{ value: 'studio', label: 'Studio' }, { value: 'research', label: 'Research' }, { value: 'archive', label: 'Archive', disabled: true }];
export function SelectionSpecimen({ multiple = false, ...p }: P & {multiple?:boolean}) {
 const [single, setSingle] = React.useState<string|null>((p.value as string|null) ?? null);
 const [many, setMany] = React.useState<string[]>(Array.isArray(p.value) ? p.value as string[] : []);
 React.useEffect(()=>{setSingle(typeof p.value === 'string' ? p.value : null);setMany(Array.isArray(p.value) ? p.value as string[] : []);},[p.value]);
 return multiple ? <MultiSelect label="Spaces" options={selectionOptions} {...p} value={many} onValueChange={setMany}/> : <Combobox label="Space" options={selectionOptions} {...p} value={single} onValueChange={setSingle}/>;
}

/** Specimens for the inputs category. One entry per component id; see ../specimen-types.ts. */
export const inputsSpecimens: Record<string, Specimen> = {
'combobox': {component:'Combobox',module:'combobox',axes:[],states:[{"label": "Selected", "props": {"value": "studio"}, "code": "<Combobox label=\"Space\" options={options} value={\"studio\"} onValueChange={setValue} />"}, {"label": "Disabled", "props": {"disabled": true}, "code": "<Combobox label=\"Space\" options={options} value={value} onValueChange={setValue} disabled={true} />"}, {"label": "Error with help", "props": {"error": "Choose a Space.", "description": "Only accessible Spaces are listed."}, "code": "<Combobox label=\"Space\" options={options} value={value} onValueChange={setValue} error={\"Choose a Space.\"} description={\"Only accessible Spaces are listed.\"} />"}, {"label": "Loading", "props": {"loading": true}, "code": "<Combobox label=\"Space\" options={options} value={value} onValueChange={setValue} loading={true} />"}, {"label": "No options", "props": {"options": []}, "code": "<Combobox label=\"Space\" options={[]} value={value} onValueChange={setValue} />"}],render:(p:P)=><SelectionSpecimen {...p} multiple={false}/>},
'multi-select': {component:'MultiSelect',module:'multi-select',axes:[],states:[{"label": "Selected", "props": {"value": ["studio"]}, "code": "<MultiSelect label=\"Spaces\" options={options} value={[\"studio\"]} onValueChange={setValue} />"}, {"label": "Disabled", "props": {"disabled": true}, "code": "<MultiSelect label=\"Spaces\" options={options} value={value} onValueChange={setValue} disabled={true} />"}, {"label": "Error with help", "props": {"error": "Choose a Space.", "description": "Only accessible Spaces are listed."}, "code": "<MultiSelect label=\"Spaces\" options={options} value={value} onValueChange={setValue} error={\"Choose a Space.\"} description={\"Only accessible Spaces are listed.\"} />"}, {"label": "Loading", "props": {"loading": true}, "code": "<MultiSelect label=\"Spaces\" options={options} value={value} onValueChange={setValue} loading={true} />"}, {"label": "No options", "props": {"options": []}, "code": "<MultiSelect label=\"Spaces\" options={[]} value={value} onValueChange={setValue} />"}],render:(p:P)=><SelectionSpecimen {...p} multiple={true}/>},

  'text-field': {
    component: 'TextField', module: 'text-field', axes: ['treatment'],
    base: {label:'Display name'},
    states: [
      {label:'With help text',props:{description:'The name others see in your workspace.'},code:'<TextField label="Display name" description="The name others see in your workspace." />',note:'Optional: add help only when it provides useful context beyond the label.'},
      {label:'Filled',props:{defaultValue:'Avery Chen'},code:'<TextField label="Display name" defaultValue="Avery Chen" />'},
      {label:'Error',props:{error:'Enter a display name.'},code:'<TextField label="Display name" error="Enter a display name." />'},
      {label:'Disabled',props:{disabled:true},code:'<TextField label="Display name" disabled />'},
      {label:'Read only',props:{readOnly:true,defaultValue:'Avery Chen'},code:'<TextField label="Display name" defaultValue="Avery Chen" readOnly />'},
      {label:'Pending',props:{pending:true,status:'Checking this example…'},code:'<TextField label="Display name" pending status="Checking this example…" />'},
    ], render:(p:P)=><TextField {...(p as React.ComponentProps<typeof TextField>)}/>,
  },
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
    states: [
      { label: 'Cutout', props: {}, code: 'See the complete Select composition in How to use.' },
      { label: 'Required', props: { required: true }, code: '<Select required name="keyType">…</Select>' },
      { label: 'Disabled', props: { disabled: true }, code: '<Select disabled>…</Select>' },
      { label: 'Error and help', props: { error: 'Choose an available key type.', description: 'Choose the scope of the supplied credential.' }, code: '<SelectTrigger state="error" aria-describedby="key-error key-help">…</SelectTrigger>' },
      { label: 'Status', props: { status: 'Saving selection.' }, code: '<SelectTrigger aria-describedby="key-status">…</SelectTrigger>' },
    ],
    render: (p: P) => <SelectFieldSpecimen {...p} />,
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
    base: { children: 'Email notifications' },
    states: [
      { label: 'Paired with a control', props: {}, code: '<Checkbox id="notifications"/><Label htmlFor="notifications">Email notifications</Label>', note: 'htmlFor and the control id match, so clicking the label toggles the checkbox.' },
      { label: 'Disabled control', props: { disabled: true }, code: '<Checkbox id="notifications" disabled className="peer"/><Label htmlFor="notifications">Email notifications</Label>', note: 'The label dims through peer-disabled when the control it names is disabled.' },
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
