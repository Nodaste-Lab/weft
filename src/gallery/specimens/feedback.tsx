import * as React from 'react';
import { FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Callout } from '../../ui/callout';
import { EmptyState } from '../../ui/empty-state';
import { EyebrowLabel } from '../../ui/eyebrow-label';
import { Progress } from '../../ui/progress';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the feedback category. One entry per component id; see ../specimen-types.ts. */
export const feedbackSpecimens: Record<string, Specimen> = {
  badge: {
    component: 'Badge',
    module: 'badge',
    base: { children: 'Label' },
    axisBase: { tone: { variant: 'status' } },
    states: [
      { label: 'Count', props: { variant: 'count', children: '8' }, code: '<Badge variant="count">8</Badge>' },
      { label: 'Status', props: { variant: 'status', tone: 'ok', children: 'Ready' }, code: '<Badge variant="status" tone="ok">Ready</Badge>' },
    ],
    render: ({ children, ...p }: P) => <Badge {...(p as React.ComponentProps<typeof Badge>)}>{children as React.ReactNode}</Badge>,
  },
  callout: {
    component: 'Callout',
    module: 'callout',
    base: { title: 'Heads up', children: 'The export runs in the background and emails you when it is done.' },
    states: [
      { label: 'Body only', props: { title: undefined }, code: '<Callout>Body text</Callout>' },
      { label: 'With action', props: { action: <Button size="sm" variant="secondary">Undo</Button> }, code: '<Callout action={<Button size="sm">Undo</Button>}>' },
    ],
    render: ({ children, ...p }: P) => <Callout {...(p as React.ComponentProps<typeof Callout>)}>{children as React.ReactNode}</Callout>,
  },
  alert: {
    component: 'Alert',
    module: 'alert',
    render: (p: P) => (
      <Alert {...(p as React.ComponentProps<typeof Alert>)}>
        <AlertTitle>Sync paused</AlertTitle>
        <AlertDescription>Reconnect the account to resume.</AlertDescription>
      </Alert>
    ),
  },
  'empty-state': {
    component: 'EmptyState',
    module: 'empty-state',
    base: { title: 'No sessions yet', description: 'Sessions appear here once a recording finishes.' },
    states: [
      { label: 'With action', props: { action: <Button size="sm">Start a session</Button> }, code: '<EmptyState title="…" action={<Button size="sm">Start a session</Button>} />' },
      { label: 'With icon', props: { icon: <FileText aria-hidden="true" focusable="false" /> }, code: '<EmptyState title="…" icon={<FileText aria-hidden />} />' },
    ],
    render: (p: P) => <EmptyState {...(p as React.ComponentProps<typeof EmptyState>)} />,
  },
  progress: {
    component: 'Progress',
    module: 'progress',
    base: { value: 40, 'aria-label': 'Upload' },
    states: [
      { label: 'Determinate', props: { value: 40 }, code: '<Progress value={40} aria-label="Upload" />' },
      { label: 'Indeterminate', props: { indeterminate: true, value: undefined }, code: '<Progress indeterminate aria-label="Upload" />', note: 'Duration unknown; pair with a status line.' },
      { label: 'Complete', props: { value: 100 }, code: '<Progress value={100} aria-label="Upload" />' },
    ],
    render: (p: P) => (
      <div style={{ width: 180 }}>
        <Progress {...(p as React.ComponentProps<typeof Progress>)} />
      </div>
    ),
  },
  'eyebrow-label': {
    component: 'EyebrowLabel',
    module: 'eyebrow-label',
    base: { children: 'Section' },
    render: ({ children, ...p }: P) => <EyebrowLabel {...(p as React.ComponentProps<typeof EyebrowLabel>)}>{children as React.ReactNode}</EyebrowLabel>,
  },
};
