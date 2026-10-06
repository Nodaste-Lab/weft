import * as React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Callout } from '../ui/callout';
import { Checkbox } from '../ui/checkbox';
import { Chip } from '../ui/chip';
import { Dot } from '../ui/dot';
import { EmptyState } from '../ui/empty-state';
import { EyebrowLabel } from '../ui/eyebrow-label';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '../ui/sidebar';
import { Switch } from '../ui/switch';
import { TextContent } from '../ui/text-content';
import { Textarea } from '../ui/textarea';
import { Toggle } from '../ui/toggle';
import type { Specimen } from './specimen-types';

/**
 * Specimens: how to render one instance of a component so the site can lay
 * out every variant (from props-snapshot.json) and every state, each labelled
 * with the code that produces it. Add an entry when a component gets a page;
 * src/gallery/__tests__/specimens.test.tsx renders every cell and checks the
 * axes against the contract.
 */

type P = Record<string, unknown>;

const ICON = <Plus aria-hidden="true" focusable="false" />;

export const specimens: Record<string, Specimen> = {
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

  'text-content': {
    component: 'TextContent',
    module: 'text-content',
    base: { children: 'The export runs in the background and emails you when it is done.' },
    render: ({ children, ...p }: P) => <TextContent {...(p as React.ComponentProps<typeof TextContent>)}>{children as React.ReactNode}</TextContent>,
  },

  'eyebrow-label': {
    component: 'EyebrowLabel',
    module: 'eyebrow-label',
    base: { children: 'Section' },
    render: ({ children, ...p }: P) => <EyebrowLabel {...(p as React.ComponentProps<typeof EyebrowLabel>)}>{children as React.ReactNode}</EyebrowLabel>,
  },

  sidebar: {
    component: 'SidebarMenuButton',
    module: 'sidebar',
    axes: ['variant', 'size'],
    base: { children: 'Documents' },
    states: [
      { label: 'Active', props: { isActive: true }, code: '<SidebarMenuButton isActive>', note: 'The current route. Pair with aria-current="page" on the link.' },
      { label: 'With action', props: { action: true }, code: '<SidebarMenuItem><SidebarMenuButton /><SidebarMenuAction showOnHover aria-label="…" /></SidebarMenuItem>', note: 'Revealed on hover and on focus-within.' },
      { label: 'With count', props: { badge: 3 }, code: '<SidebarMenuItem><SidebarMenuButton /><SidebarMenuBadge>3</SidebarMenuBadge></SidebarMenuItem>' },
      { label: 'Nested row', props: { sub: true }, code: '<SidebarMenuSub><SidebarMenuSubItem><SidebarMenuSubButton /></SidebarMenuSubItem></SidebarMenuSub>' },
      { label: 'Nested row, active', props: { sub: true, isActive: true }, code: '<SidebarMenuSubButton isActive>' },
    ],
    render: ({ children, action, badge, sub, ...p }: P) => (
      <SidebarProvider defaultOpen className="min-h-0 w-[220px]">
        <SidebarMenu className="w-[220px]">
          {sub ? (
            <SidebarMenuItem>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton isActive={Boolean(p.isActive)}>
                    <FileText aria-hidden="true" focusable="false" />
                    <span>{children as React.ReactNode}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton {...(p as React.ComponentProps<typeof SidebarMenuButton>)}>
                <FileText aria-hidden="true" focusable="false" />
                <span>{children as React.ReactNode}</span>
              </SidebarMenuButton>
              {action ? (
                <SidebarMenuAction showOnHover aria-label={`Actions for ${String(children)}`}>
                  {ICON}
                </SidebarMenuAction>
              ) : null}
              {typeof badge === 'number' ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarProvider>
    ),
  },
};
