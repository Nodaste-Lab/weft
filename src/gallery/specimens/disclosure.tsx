import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Button } from '../../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { SectionBlock } from '../../ui/section-block';
import { SectionItem } from '../../ui/section-item';
import { SignalGroupCollapsible } from '../../ui/signal-group-collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const noop = () => undefined;

/** Specimens for the disclosure category. One entry per component id; see ../specimen-types.ts. */
export const disclosureSpecimens: Record<string, Specimen> = {
  accordion: {
    component: 'Accordion',
    module: 'accordion',
    base: { type: 'single', collapsible: true, labels: ['Session goals', 'Safety tools'] },
    states: [
      { label: 'Collapsed', props: {}, code: '<Accordion type="single" collapsible>', note: 'Every item closed; collapsible lets the open item close again.' },
      { label: 'Expanded', props: { defaultValue: 'one' }, code: '<Accordion type="single" collapsible defaultValue="one">', note: 'One item open at a time; opening another closes it. Each open panel is a region named by its trigger.' },
      { label: 'Multiple', props: { type: 'multiple', defaultValue: ['one', 'two'], labels: ['Agenda', 'Materials'] }, code: '<Accordion type="multiple" defaultValue={["one", "two"]}>', note: 'Items open independently; collapsible does not apply.' },
      { label: 'Disabled item', props: { disabledItem: true }, code: '<AccordionItem value="two" disabled>' },
    ],
    render: ({ disabledItem, labels, collapsible, ...p }: P) => {
      const [first, second] = labels as [string, string];
      const root = (p.type === 'multiple' ? p : { ...p, collapsible }) as unknown as React.ComponentProps<typeof Accordion>;
      return (
        <Accordion {...root} className="w-full max-w-md">
          <AccordionItem value="one">
            <AccordionTrigger>{first}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">Keep each scene short and let the group choose.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two" disabled={Boolean(disabledItem)}>
            <AccordionTrigger>{second}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">Pause is available at any time.</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    },
  },
  collapsible: {
    component: 'Collapsible',
    module: 'collapsible',
    base: { trigger: 'Details' },
    states: [
      { label: 'Collapsed', props: { defaultOpen: false }, code: '<Collapsible><CollapsibleTrigger asChild><Button variant="outline">Details</Button></CollapsibleTrigger><CollapsibleContent>…</CollapsibleContent></Collapsible>', note: 'The trigger carries aria-expanded; content stays in flow when it opens.' },
      { label: 'Expanded', props: { defaultOpen: true }, code: '<Collapsible defaultOpen>' },
      { label: 'Disabled', props: { disabled: true }, code: '<Collapsible disabled>', note: 'The trigger cannot toggle; say elsewhere why the content is unavailable.' },
    ],
    render: ({ trigger, ...p }: P) => (
      <Collapsible {...(p as React.ComponentProps<typeof Collapsible>)} className="w-full max-w-sm">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">{trigger as React.ReactNode}</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-muted-foreground mt-2 text-xs">Collapsible content stays in flow below its trigger.</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  'section-block': {
    component: 'SectionBlock',
    module: 'section-block',
    base: {
      'aria-label': 'Generated brief',
      title: 'Generated brief',
      description: 'Grouped output for review.',
      items: [
        { id: 'summary', label: 'Summary', meta: '2 notes', defaultOpen: true, content: 'The summary stays reviewable before it is shared.' },
        { id: 'risks', label: 'Risks', meta: '1 open', content: 'One source has not synced since yesterday.' },
      ],
    },
    states: [
      { label: 'With header', props: {}, code: '<SectionBlock aria-label="Generated brief" title="Generated brief" description="…" items={[…]} />', note: 'The block is a region, so it always needs aria-label; a string title names the list as well.' },
      { label: 'List only', props: { title: undefined, description: undefined, 'aria-label': 'Review notes' }, code: '<SectionBlock aria-label="Review notes" items={[…]} />', note: 'Without a title, aria-label names both the region and the list.' },
      {
        label: 'All collapsed',
        props: {
          'aria-label': 'Open questions',
          title: 'Open questions',
          items: [
            { id: 'summary', label: 'Summary', meta: '2 notes', content: 'The summary stays reviewable before it is shared.' },
            { id: 'risks', label: 'Risks', meta: '1 open', content: 'One source has not synced since yesterday.' },
          ],
        },
        code: '<SectionBlock aria-label="Open questions" title="Open questions" items={[{ id, label, content }, …]} />',
        note: 'defaultOpen is per item; nothing opens unless an item asks to.',
      },
    ],
    render: (p: P) => <SectionBlock {...(p as unknown as React.ComponentProps<typeof SectionBlock>)} className="w-full max-w-md" />,
  },
  'section-item': {
    component: 'SectionItem',
    module: 'section-item',
    base: { id: 'summary', label: 'Summary', meta: '2 notes', content: 'Generated output stays reviewable before it is shared.' },
    states: [
      { label: 'Collapsed', props: { defaultOpen: false }, code: '<SectionItem id="summary" label="Summary" meta="2 notes" content={…} />', note: 'Content is mounted but hidden; the trigger carries aria-expanded.' },
      { label: 'Expanded', props: { defaultOpen: true }, code: '<SectionItem id="summary" label="Summary" meta="2 notes" content={…} defaultOpen />' },
      { label: 'Without meta', props: { meta: undefined }, code: '<SectionItem id="summary" label="Summary" content={…} />', note: 'meta is a short count or status; leave it out rather than fill it.' },
    ],
    render: (p: P) => (
      <ul aria-label="Sections" className="m-0 w-full max-w-md list-none p-0">
        <SectionItem {...(p as unknown as React.ComponentProps<typeof SectionItem>)} />
      </ul>
    ),
  },
  'signal-group-collapsible': {
    component: 'SignalGroupCollapsible',
    module: 'signal-group-collapsible',
    base: { groupKey: 'project', label: 'Project', count: 4, collapsed: false, onToggle: noop },
    states: [
      { label: 'Expanded', props: { collapsed: false }, code: '<SignalGroupCollapsible groupKey="project" label="Project" count={4} collapsed={false} onToggle={…}>', note: 'State is owned by the consumer: pass collapsed and onToggle.' },
      { label: 'Collapsed', props: { collapsed: true }, code: '<SignalGroupCollapsible … collapsed onToggle={…}>', note: 'The body unmounts; the toggle reads "Expand Project group".' },
      { label: 'Without count', props: { count: undefined }, code: '<SignalGroupCollapsible groupKey="project" label="Project" collapsed={false} onToggle={…}>' },
      {
        label: 'With header actions',
        props: { headerActions: <Button size="sm" variant="ghost">Acknowledge all</Button> },
        code: '<SignalGroupCollapsible … headerActions={<Button size="sm" variant="ghost">Acknowledge all</Button>}>',
        note: 'Shown only while expanded; actions act on the visible group.',
      },
    ],
    render: (p: P) => (
      <div className="w-full max-w-md">
        <SignalGroupCollapsible {...(p as unknown as React.ComponentProps<typeof SignalGroupCollapsible>)}>
          <div className="px-3 py-2 text-[length:var(--text-xs)] text-[var(--hud-text-2)]">Group rows go here.</div>
        </SignalGroupCollapsible>
      </div>
    ),
  },
  tabs: {
    component: 'Tabs',
    module: 'tabs',
    base: { defaultValue: 'recap' },
    states: [
      { label: 'First selected', props: { defaultValue: 'recap' }, code: '<Tabs defaultValue="recap"><TabsList><TabsTrigger value="recap">Recap</TabsTrigger>…</TabsList><TabsContent value="recap">…</TabsContent></Tabs>' },
      { label: 'Second selected', props: { defaultValue: 'prep' }, code: '<Tabs defaultValue="prep">' },
      { label: 'Disabled tab', props: { disabledTab: true }, code: '<TabsTrigger value="prep" disabled>', note: 'The tab is skipped by arrow-key navigation; say elsewhere why it is unavailable.' },
    ],
    render: ({ disabledTab, ...p }: P) => (
      <Tabs {...(p as React.ComponentProps<typeof Tabs>)} className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="recap">Recap</TabsTrigger>
          <TabsTrigger value="prep" disabled={Boolean(disabledTab)}>Prep</TabsTrigger>
        </TabsList>
        <TabsContent value="recap">
          <p className="text-muted-foreground m-0 text-xs">Recap content uses the active tab surface.</p>
        </TabsContent>
        <TabsContent value="prep">
          <p className="text-muted-foreground m-0 text-xs">Prep content lives in a sibling panel.</p>
        </TabsContent>
      </Tabs>
    ),
  },
};
