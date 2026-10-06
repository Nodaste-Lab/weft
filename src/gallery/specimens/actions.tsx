import * as React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { ActionButtonRow } from '../../ui/action-button-row';
import { AddItemButton } from '../../ui/add-item-button';
import { Button } from '../../ui/button';
import { FollowUpBlock } from '../../ui/follow-up-block';
import { FollowUpItem } from '../../ui/follow-up-item';
import { ListBlock } from '../../ui/list-block';
import { ListItem } from '../../ui/list-item';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const ICON = <Plus aria-hidden="true" focusable="false" />;
const noop = () => undefined;

/** A region needs an accessible name, and every cell on the page needs a distinct one: derive it from the axis props. */
function regionLabel(p: P, title: string, keys: readonly string[]): string {
  if (typeof p['aria-label'] === 'string') return p['aria-label'];
  const parts = keys.filter((k) => typeof p[k] === 'string').map((k) => `${k} ${String(p[k])}`);
  return parts.length ? `${title}, ${parts.join(', ')}` : title;
}

const ROW_ACTIONS = (
  <>
    <Button size="sm" variant="outline">Refresh</Button>
    <Button size="sm" variant="outline">Filter</Button>
  </>
);

const FOLLOW_UP_ITEMS = [
  { id: 'brief', label: 'Summarise the note', detail: 'A short, reviewable brief.' },
  { id: 'risks', label: 'List the risks', detail: 'Blockers before sharing.' },
];
const SELECTABLE_FOLLOW_UPS = FOLLOW_UP_ITEMS.map((item) => ({ ...item, onSelect: noop }));

const LIST_ITEMS = [
  { id: 'outline', label: 'Outline', detail: 'Headings only.' },
  { id: 'draft', label: 'Full draft', detail: 'Every section written out.' },
];
const SELECTABLE_LIST_ITEMS = LIST_ITEMS.map((item) => ({ ...item, onSelect: noop }));

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
  'action-button-row': {
    component: 'ActionButtonRow',
    module: 'action-button-row',
    base: { children: ROW_ACTIONS },
    states: [
      { label: 'Dense', props: { dense: true }, code: '<ActionButtonRow dense>', note: 'Tighter gap for narrow operator-board columns; wraps when the row overflows.' },
      { label: 'With trailing link', props: { trailingLink: <Button size="sm" variant="ghost">Board view</Button> }, code: '<ActionButtonRow trailingLink={<Button size="sm" variant="ghost">Board view</Button>}>', note: 'The trailing node is pushed to the far edge in any alignment.' },
    ],
    render: ({ children, ...p }: P) => (
      <div style={{ width: 320 }}>
        <ActionButtonRow {...(p as React.ComponentProps<typeof ActionButtonRow>)}>{children as React.ReactNode}</ActionButtonRow>
      </div>
    ),
  },
  'add-item-button': {
    component: 'AddItemButton',
    module: 'add-item-button',
    base: { children: 'Add item' },
    states: [
      { label: 'Custom label', props: { children: 'Add a beat' }, code: '<AddItemButton>Add a beat</AddItemButton>' },
      { label: 'Custom icon', props: { icon: <Sparkles aria-hidden="true" focusable="false" className="size-2.5 shrink-0" /> }, code: '<AddItemButton icon={<Sparkles aria-hidden />}>' },
      { label: 'Disabled', props: { disabled: true }, code: '<AddItemButton disabled>', note: 'The list cannot take another item right now.' },
    ],
    render: ({ children, ...p }: P) => (
      <div style={{ width: 220 }}>
        <AddItemButton {...(p as React.ComponentProps<typeof AddItemButton>)}>{children as React.ReactNode}</AddItemButton>
      </div>
    ),
  },
  'follow-up-block': {
    component: 'FollowUpBlock',
    module: 'follow-up-block',
    base: { title: 'Suggested next steps', description: 'Generated suggestions stay reviewable.', items: FOLLOW_UP_ITEMS },
    states: [
      { label: 'Without header', props: { title: undefined, description: undefined, 'aria-label': 'Suggested next steps' }, code: '<FollowUpBlock aria-label="Suggested next steps" items={…} />', note: 'With no visible title the list takes its name from aria-label.' },
      { label: 'Selectable items', props: { items: SELECTABLE_FOLLOW_UPS, 'aria-label': 'Suggested next steps, selectable' }, code: '<FollowUpBlock items={[{ id, label, detail, onSelect }]} />', note: 'An item with an onSelect handler renders as a button.' },
      { label: 'With selected item', props: { items: SELECTABLE_FOLLOW_UPS.map((item, i) => ({ ...item, selected: i === 0 })), 'aria-label': 'Suggested next steps, one selected' }, code: '<FollowUpBlock items={[{ …, selected: true }]} />' },
    ],
    render: (p: P) => (
      <div style={{ width: 320 }}>
        <FollowUpBlock {...(p as unknown as React.ComponentProps<typeof FollowUpBlock>)} aria-label={regionLabel(p, 'Suggested next steps', ['density', 'tone'])} />
      </div>
    ),
  },
  'follow-up-item': {
    component: 'FollowUpItem',
    module: 'follow-up-item',
    base: { id: 'brief', label: 'Summarise the note', detail: 'A short, reviewable brief.' },
    states: [
      { label: 'Display only', props: {}, code: '<FollowUpItem id="brief" label="…" detail="…" />', note: 'No handler, so no implicit button.' },
      { label: 'Actionable', props: { onSelect: noop }, code: '<FollowUpItem id="brief" label="…" onSelect={select} />', note: 'The label becomes a button with aria-pressed.' },
      { label: 'Selected', props: { onSelect: noop, selected: true }, code: '<FollowUpItem id="brief" label="…" onSelect={select} selected />' },
      { label: 'Disabled', props: { onSelect: noop, disabled: true }, code: '<FollowUpItem id="brief" label="…" onSelect={select} disabled />' },
      { label: 'Without detail', props: { detail: undefined }, code: '<FollowUpItem id="brief" label="…" />' },
    ],
    render: (p: P) => (
      <div role="list" aria-label="Suggested next steps" style={{ width: 320 }}>
        <FollowUpItem {...(p as unknown as React.ComponentProps<typeof FollowUpItem>)} />
      </div>
    ),
  },
  'list-block': {
    component: 'ListBlock',
    module: 'list-block',
    base: { title: 'Choose an output', description: 'Generated choices stay explicit.', items: LIST_ITEMS },
    axisBase: { selectionMode: { items: SELECTABLE_LIST_ITEMS.map((item, i) => ({ ...item, selected: i === 0 })) } },
    states: [
      { label: 'Without header', props: { title: undefined, description: undefined, 'aria-label': 'Outputs' }, code: '<ListBlock aria-label="Outputs" items={…} />', note: 'With no visible title the list takes its name from aria-label.' },
      { label: 'Selectable items', props: { items: SELECTABLE_LIST_ITEMS, selectionMode: 'single', 'aria-label': 'Outputs, selectable' }, code: '<ListBlock selectionMode="single" items={[{ id, label, detail, onSelect }]} />', note: 'An item with an onSelect handler renders as a button; selectionMode is a data attribute the consumer reads.' },
    ],
    render: (p: P) => (
      <div style={{ width: 320 }}>
        <ListBlock {...(p as unknown as React.ComponentProps<typeof ListBlock>)} aria-label={regionLabel(p, 'Choose an output', ['selectionMode'])} />
      </div>
    ),
  },
  'list-item': {
    component: 'ListItem',
    module: 'list-item',
    base: { id: 'outline', label: 'Outline', detail: 'Headings only.' },
    states: [
      { label: 'Display only', props: {}, code: '<ListItem id="outline" label="…" detail="…" />', note: 'No handler, so no implicit button.' },
      { label: 'Actionable', props: { onSelect: noop }, code: '<ListItem id="outline" label="…" onSelect={select} />', note: 'The label becomes a button with aria-pressed.' },
      { label: 'Selected', props: { onSelect: noop, selected: true }, code: '<ListItem id="outline" label="…" onSelect={select} selected />' },
      { label: 'Disabled', props: { onSelect: noop, disabled: true }, code: '<ListItem id="outline" label="…" onSelect={select} disabled />' },
      { label: 'Without detail', props: { detail: undefined }, code: '<ListItem id="outline" label="…" />' },
    ],
    render: (p: P) => (
      <ul aria-label="Outputs" className="m-0 list-none p-0" style={{ width: 320 }}>
        <ListItem {...(p as unknown as React.ComponentProps<typeof ListItem>)} />
      </ul>
    ),
  },
};
