import * as React from 'react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

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
};
