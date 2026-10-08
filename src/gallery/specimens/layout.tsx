import { DocumentFinding, DocumentText } from '../../ui/document-content';
import { FileHeaderExample, FileHeaderStateExample } from '../FileHeaderExample';
import * as React from 'react';
import { FileText, Inbox, Plus, Sparkles } from 'lucide-react';
import { AspectRatio } from '../../ui/aspect-ratio';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Carousel, type CarouselItemData } from '../../ui/carousel';
import { Chip } from '../../ui/chip';
import { HudQuickCommandFooter } from '../../ui/hud-quick-command-footer';
import { Input } from '../../ui/input';
import { PanelBlockShell } from '../../ui/panel-block-shell';
import { PanelHeader, PanelHeaderActions, PanelHeaderDismiss, PanelHeaderTitle } from '../../ui/panel-header';
import { PeriodChipRow } from '../../ui/period-chip-row';
import { RecapSectionShell } from '../../ui/recap-section-shell';
import { RepeatListFieldColumn } from '../../ui/repeat-list-field-column';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../ui/resizable';
import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { SettingsModuleShell } from '../../ui/settings-module-shell';
import { SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from '../../ui/sidebar';
import { Stack } from '../../ui/stack';
import { Sticky } from '../../ui/sticky';
import { Toolbar } from '../../ui/toolbar';
import { TranscriptListItemFrame } from '../../ui/transcript-list-item-frame';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const ICON = <Plus aria-hidden="true" focusable="false" />;
const NOOP = () => undefined;

/** Every landmark on one page needs a distinct name, so a region's cell joins its variant to the base name. */
const landmarkName = (base: string, p: P, keys: readonly string[]) => {
  const parts = keys.filter((k) => p[k] !== undefined).map((k) => `${k} ${String(p[k])}`);
  return parts.length ? `${base}, ${parts.join(', ')}` : base;
};

/** Bounded cell so wide surfaces keep the grid readable. */
const Cell = ({ width = 280, children }: { width?: number; children: React.ReactNode }) => <div style={{ width }}>{children}</div>;

/** A framed panel box for strips that only make sense inside panel chrome. */
const Frame = ({ width = 280, children }: { width?: number; children: React.ReactNode }) => (
  <div style={{ width }} className="overflow-hidden rounded-[var(--radius-sm)] border border-border bg-card">
    {children}
  </div>
);

const CAROUSEL_ITEMS: CarouselItemData[] = [
  { id: 'sources', label: 'Sources', description: 'Review the material behind the summary.', content: <span className="text-xs">Four documents, two recordings.</span> },
  { id: 'review', label: 'Review', description: 'Check the draft before sharing.', content: <Badge variant="outline">Draft</Badge> },
  { id: 'share', label: 'Share', description: 'Send the reviewed summary.', content: <Button size="sm" variant="secondary">Open summary</Button> },
];

const PERIODS = ['Last 7 days', 'Last 30 days', 'Last 90 days'];
const MANY_PERIODS = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This quarter', 'This year', 'All time'];

const StackItem = ({ children, tall }: { children: React.ReactNode; tall?: 1 | 2 | 3 }) => (
  <span className={['rounded-[var(--radius-sm)] bg-muted px-2 text-xs text-muted-foreground', tall === 3 ? 'py-3' : tall === 2 ? 'py-2' : 'py-1'].join(' ')}>{children}</span>
);

const TRANSCRIPT_HEADER = (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full bg-[var(--hud-positive)]" aria-hidden="true" />
      <span className="text-sm font-semibold text-[var(--hud-text-1)]">Speaker 1</span>
      <span className="text-xs text-[var(--hud-text-3)]">Host</span>
    </div>
    <span className="text-xs text-[var(--hud-text-3)] [font-family:var(--weft-font-mono)]">00:12</span>
  </div>
);
const TRANSCRIPT_BODY = <p className="m-0 text-sm text-[var(--hud-text-2)]">We should confirm the timeline before the next session.</p>;
const TRANSCRIPT_FOOTER = (
  <div className="flex items-center justify-between gap-2">
    <Chip size="sm">#decision</Chip>
    <Button size="sm" variant="ghost">Assign</Button>
  </div>
);

/** Specimens for the layout category. One entry per component id; see ../specimen-types.ts. */
export const layoutSpecimens: Record<string, Specimen> = {
 'document-content': {component:'DocumentFinding',module:'document-content',axes:[],base:{},states:[{label:'Finding',props:{},code:'<DocumentFinding headingId="finding" heading="Document hierarchy"><DocumentText>Shared content.</DocumentText></DocumentFinding>'}],render:()=> <DocumentFinding headingId="specimen-doc-finding" heading="Document hierarchy"><DocumentText>Shared content.</DocumentText></DocumentFinding>},
 'file-shell-controls': {component:'FileShellPanels',module:'file-shell-controls',axes:[],base:{},states:[{label:'Controlled workspace',props:{},code:'<FileShellPanels panels={panels} active={active} onActiveChange={setActive} label="File side controls">{content}</FileShellPanels>'}],render:()=> <FileHeaderExample workspaceOnly populated/>},
 'file-header': {component:'FileHeader',module:'file-header',axes:['saveState'],base:{title:'Product direction',fileTypeLabel:'Document'},states:[
 {label:'Inline rename',props:{editableExample:true},code:'<FileHeader title={title} fileTypeLabel="Document" onRename={setTitle} />'},
 {label:'Read only',props:{readOnlyExample:true},code:'<FileHeader title="Product direction" fileTypeLabel="Document" />'},
 {label:'Spreadsheet',props:{fileTypeLabel:'Spreadsheet',title:'Quarterly forecast'},code:'<FileHeader title="Quarterly forecast" fileTypeLabel="Spreadsheet" />'},
 {label:'Image',props:{fileTypeLabel:'Image',title:'Workspace overview.png'},code:'<FileHeader title="Workspace overview.png" fileTypeLabel="Image" />'},
 {label:'Presentation',props:{fileTypeLabel:'Presentation',title:'Team introduction'},code:'<FileHeader title="Team introduction" fileTypeLabel="Presentation" />'},
 {label:'Long title',props:{title:'Research findings and recommendations for the next iteration of the shared workspace'},code:'<FileHeader title="Research findings and recommendations for the next iteration of the shared workspace" fileTypeLabel="Document" />'},
 {label:'Rename failure',props:{failRename:true},code:'<FileHeader title={title} fileTypeLabel="Document" onRename={async () => { throw new Error("Demo failure"); }} />',note:'Choose Rename, edit the name and Save to inspect recovery.'}
 ],render:(p:P)=><FileHeaderStateExample {...p}/>},
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
  'aspect-ratio': {
    component: 'AspectRatio',
    module: 'aspect-ratio',
    base: { ratio: 16 / 9, children: '16:9' },
    states: [
      { label: 'Widescreen', props: { ratio: 16 / 9, children: '16:9' }, code: '<AspectRatio ratio={16 / 9}>' },
      { label: 'Square', props: { ratio: 1, children: '1:1' }, code: '<AspectRatio ratio={1}>' },
      { label: 'Standard', props: { ratio: 4 / 3, children: '4:3' }, code: '<AspectRatio ratio={4 / 3}>' },
    ],
    render: ({ children, ...p }: P) => (
      <Cell width={200}>
        <AspectRatio {...(p as React.ComponentProps<typeof AspectRatio>)} className="overflow-hidden rounded-[var(--radius-md)] bg-muted">
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">{children as React.ReactNode}</div>
        </AspectRatio>
      </Cell>
    ),
  },
  card: {
    component: 'Card',
    module: 'card',
    states: [
      { label: 'Header only', props: { body: false }, code: '<Card><CardHeader><CardTitle /><CardDescription /></CardHeader></Card>' },
      { label: 'With action', props: { action: true }, code: '<CardHeader><CardTitle /><CardDescription /><CardAction><Button size="sm" variant="ghost">Edit</Button></CardAction></CardHeader>', note: 'The action sits top-right of the header grid.' },
      { label: 'With footer', props: { footer: true }, code: '<CardFooter><Button size="sm" variant="secondary">Open</Button></CardFooter>' },
    ],
    render: ({ action, footer, body = true, ...p }: P) => (
      <Card {...(p as React.ComponentProps<typeof Card>)} className="w-[280px]">
        <CardHeader>
          <CardTitle>Weekly recap</CardTitle>
          <CardDescription>Generated after each session.</CardDescription>
          {action ? (
            <CardAction>
              <Button size="sm" variant="ghost">Edit</Button>
            </CardAction>
          ) : null}
        </CardHeader>
        {body ? <CardContent className="text-sm text-muted-foreground">Three sessions, two open threads.</CardContent> : null}
        {footer ? (
          <CardFooter>
            <Button size="sm" variant="secondary">Open</Button>
          </CardFooter>
        ) : null}
      </Card>
    ),
  },
  carousel: {
    component: 'Carousel',
    module: 'carousel',
    base: { 'aria-label': 'Summary steps', items: CAROUSEL_ITEMS },
    states: [
      { label: 'Without position', props: { showPosition: false }, code: '<Carousel showPosition={false}>' },
      { label: 'Starting mid-way', props: { initialIndex: 1 }, code: '<Carousel initialIndex={1}>', note: 'Both controls enabled; the position reads 2 of 3.' },
      { label: 'Single slide', props: { items: CAROUSEL_ITEMS.slice(0, 1) }, code: '<Carousel items={[one]}>', note: 'Both controls disabled; the position reads 1 of 1.' },
    ],
    render: (p: P) => (
      <Cell>
        <Carousel {...(p as React.ComponentProps<typeof Carousel>)} aria-label={landmarkName(String(p['aria-label']), p, ['density', 'showPosition', 'initialIndex'])} />
      </Cell>
    ),
  },
  'hud-quick-command-footer': {
    component: 'HudQuickCommandFooter',
    module: 'hud-quick-command-footer',
    base: { children: <div className="px-2 py-1.5 text-[length:var(--text-xs)] text-[var(--hud-text-2)]">Type a command</div> },
    states: [
      {
        label: 'With footer bar',
        props: { footerBar: <div className="border-t border-[var(--hud-border)] px-2 py-1.5 text-center text-[10px] text-[var(--hud-text-3)]">Save and close</div> },
        code: '<HudQuickCommandFooter footerBar={<div>Save and close</div>}>',
        note: 'A full-width bar under the main column.',
      },
    ],
    render: ({ children, ...p }: P) => (
      <div style={{ width: 280 }} className="relative h-24 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-section-fill-medium)]">
        <div className="p-2 text-[length:var(--text-xs)] text-[var(--hud-text-3)]">Log scrolls above</div>
        <HudQuickCommandFooter {...(p as React.ComponentProps<typeof HudQuickCommandFooter>)} className="absolute inset-x-0 bottom-0">
          {children as React.ReactNode}
        </HudQuickCommandFooter>
      </div>
    ),
  },
  'panel-block-shell': {
    component: 'PanelBlockShell',
    module: 'panel-block-shell',
    base: { title: 'Signals', children: <span className="text-xs text-muted-foreground">Two new since yesterday.</span> },
    states: [
      { label: 'Default', props: {}, code: '<PanelBlockShell title="Signals">' },
      { label: 'Selected', props: { selected: true }, code: '<PanelBlockShell selected>', note: 'Accent ring; the state is also on data-selected.' },
      { label: 'Collapsible', props: { collapsible: true }, code: '<PanelBlockShell collapsible>', note: 'The title becomes the toggle, named "Collapse Signals".' },
      { label: 'Collapsed', props: { collapsible: true, defaultCollapsed: true }, code: '<PanelBlockShell collapsible defaultCollapsed>' },
      { label: 'With count', props: { collapsible: true, activeCountText: '3 active' }, code: '<PanelBlockShell collapsible activeCountText="3 active">', note: 'The count joins the toggle name: "Collapse Signals, 3 active".' },
      { label: 'With header actions', props: { headerRight: <Badge variant="outline">live</Badge> }, code: '<PanelBlockShell headerRight={<Badge variant="outline">live</Badge>}>' },
      { label: 'Headless', props: { headless: true }, code: '<PanelBlockShell headless>', note: 'Body only; for stat tiles under another block.' },
      { label: 'Seamless', props: { seamless: true }, code: '<PanelBlockShell seamless>', note: 'No border or body padding; a list inside owns its own.' },
      { label: 'Custom header', props: { customHeader: <div className="flex items-center gap-2 px-3 py-2 text-xs"><FileText aria-hidden="true" focusable="false" className="size-3.5" /><span className="font-semibold">Notes</span></div> }, code: '<PanelBlockShell customHeader={<div>…</div>}>' },
    ],
    render: ({ children, ...p }: P) => (
      <Cell>
        <PanelBlockShell {...(p as React.ComponentProps<typeof PanelBlockShell>)}>{children as React.ReactNode}</PanelBlockShell>
      </Cell>
    ),
  },
  'panel-header': {
    component: 'PanelHeader',
    module: 'panel-header',
    axes: ['size'],
    base: { children: 'Signal inbox', dismiss: true },
    states: [
      { label: 'Title only', props: { dismiss: false }, code: '<PanelHeader><PanelHeaderTitle>Signal inbox</PanelHeaderTitle></PanelHeader>' },
      { label: 'With icon', props: { icon: <Inbox aria-hidden="true" focusable="false" /> }, code: '<PanelHeaderTitle icon={<Inbox aria-hidden />}>' },
      { label: 'With actions', props: { actions: true }, code: '<PanelHeaderActions><Button size="sm" variant="ghost">Refresh</Button><PanelHeaderDismiss /></PanelHeaderActions>' },
      { label: 'Board, with actions', props: { size: 'board', actions: true }, code: '<PanelHeader size="board">', note: 'The title inherits the board size; do not repeat size on PanelHeaderTitle.' },
    ],
    render: ({ children, icon, dismiss, actions, ...p }: P) => (
      <Frame>
        <PanelHeader {...(p as React.ComponentProps<typeof PanelHeader>)}>
          <PanelHeaderTitle icon={icon as React.ReactNode}>{children as React.ReactNode}</PanelHeaderTitle>
          {dismiss || actions ? (
            <PanelHeaderActions>
              {actions ? <Button size="sm" variant="ghost">Refresh</Button> : null}
              {dismiss ? <PanelHeaderDismiss onClick={NOOP} /> : null}
            </PanelHeaderActions>
          ) : null}
        </PanelHeader>
      </Frame>
    ),
  },
  'period-chip-row': {
    component: 'PeriodChipRow',
    module: 'period-chip-row',
    base: { periods: PERIODS },
    states: [
      { label: 'Three presets', props: { periods: PERIODS }, code: '<PeriodChipRow><Chip size="sm">Last 7 days</Chip>…</PeriodChipRow>' },
      { label: 'Wrapping', props: { periods: MANY_PERIODS }, code: '<PeriodChipRow>{eight chips}</PeriodChipRow>', note: 'Chips wrap to a second row when the rail is narrow.' },
    ],
    render: ({ periods, ...p }: P) => (
      <Cell width={240}>
        <PeriodChipRow {...(p as React.ComponentProps<typeof PeriodChipRow>)}>
          {(periods as string[]).map((label) => (
            <Chip key={label} size="sm">{label}</Chip>
          ))}
        </PeriodChipRow>
      </Cell>
    ),
  },
  'recap-section-shell': {
    component: 'RecapSectionShell',
    module: 'recap-section-shell',
    // Closed by default: an open body is a named region, and every open cell on
    // one page needs its own title so the landmarks stay distinguishable.
    base: { title: 'Decisions', count: 3, open: false, onToggle: NOOP, children: <span className="text-xs text-[var(--hud-text-3)]">Recorded this session.</span> },
    states: [
      { label: 'Closed', props: { open: false }, code: '<RecapSectionShell open={false} onToggle={…}>', note: 'The body is not rendered; the header keeps aria-expanded="false".' },
      { label: 'Open', props: { open: true }, code: '<RecapSectionShell open onToggle={…}>', note: 'The body is a region named by the header.' },
      { label: 'With icon', props: { open: true, title: 'Highlights', count: 2, icon: <Sparkles size={12} aria-hidden="true" focusable="false" className="text-[var(--primary)]" /> }, code: '<RecapSectionShell icon={<Sparkles size={12} aria-hidden />}>' },
      { label: 'Without count', props: { open: true, title: 'Open questions', count: undefined }, code: '<RecapSectionShell title="Open questions">', note: 'Leave count out when the section has nothing to count, not 0.' },
      { label: 'Compact, open', props: { open: true, title: 'Follow-ups', count: 1, density: 'compact' }, code: '<RecapSectionShell density="compact" open>' },
    ],
    render: ({ children, ...p }: P) => (
      <Frame>
        <RecapSectionShell {...(p as React.ComponentProps<typeof RecapSectionShell>)}>{children as React.ReactNode}</RecapSectionShell>
      </Frame>
    ),
  },
  'repeat-list-field-column': {
    component: 'RepeatListFieldColumn',
    module: 'repeat-list-field-column',
    base: { label: 'Name' },
    states: [
      { label: 'With text input', props: {}, code: '<RepeatListFieldColumn label="Name"><Input placeholder="Add a name" /></RepeatListFieldColumn>', note: 'The label wraps the control, so the input takes its name from it.' },
    ],
    render: (p: P) => (
      <Cell width={200}>
        <RepeatListFieldColumn {...(p as React.ComponentProps<typeof RepeatListFieldColumn>)}>
          <Input placeholder="Add a name" className="h-8 text-xs" />
        </RepeatListFieldColumn>
      </Cell>
    ),
  },
  resizable: {
    component: 'ResizablePanelGroup',
    module: 'resizable',
    base: { direction: 'horizontal' },
    states: [
      { label: 'Horizontal', props: { direction: 'horizontal' }, code: '<ResizablePanelGroup direction="horizontal"><ResizablePanel /><ResizableHandle /><ResizablePanel /></ResizablePanelGroup>' },
      { label: 'With grip', props: { withHandle: true }, code: '<ResizableHandle withHandle />', note: 'A visible grip on the divider; the separator is keyboard-resizable either way.' },
      { label: 'Vertical', props: { direction: 'vertical', withHandle: true }, code: '<ResizablePanelGroup direction="vertical">' },
    ],
    render: ({ withHandle, ...p }: P) => (
      <div style={{ width: 280, height: 96 }} className="overflow-hidden rounded-[var(--radius-sm)] border border-border">
        <ResizablePanelGroup {...(p as React.ComponentProps<typeof ResizablePanelGroup>)}>
          <ResizablePanel defaultSize={50}>
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">Outline</div>
          </ResizablePanel>
          {/* The library sets aria-valuenow/min/max from measured layout in a browser layout
              effect; its node build (what jsdom resolves) skips that effect, so the initial
              50 / 0 / 100 that matches defaultSize is declared here and overwritten live. */}
          <ResizableHandle withHandle={Boolean(withHandle)} aria-label="Resize panels" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
          <ResizablePanel defaultSize={50}>
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    ),
  },
  'scroll-area': {
    component: 'ScrollArea',
    module: 'scroll-area',
    states: [
      { label: 'Vertical', props: {}, code: '<ScrollArea className="h-24">', note: 'The vertical scrollbar is built in.' },
      { label: 'Horizontal', props: { horizontal: true }, code: '<ScrollArea><div className="w-max">…</div><ScrollBar orientation="horizontal" /></ScrollArea>', note: 'Add a horizontal ScrollBar when content is wider than the area.' },
    ],
    render: ({ horizontal, ...p }: P) => (
      <ScrollArea {...(p as React.ComponentProps<typeof ScrollArea>)} className="h-24 w-[280px] rounded-[var(--radius-sm)] border border-border p-3">
        {horizontal ? (
          <div className="flex w-max gap-2 pb-2">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="rounded-[var(--radius-sm)] bg-muted px-3 py-1 text-xs text-muted-foreground">Column {i + 1}</span>
            ))}
          </div>
        ) : (
          <p className="m-0 text-xs leading-relaxed text-muted-foreground">
            {Array.from({ length: 6 }, () => 'Long session notes scroll inside this container without moving the page.').join(' ')}
          </p>
        )}
        {horizontal ? <ScrollBar orientation="horizontal" /> : null}
      </ScrollArea>
    ),
  },
  separator: {
    component: 'Separator',
    module: 'separator',
    states: [
      { label: 'Horizontal', props: { orientation: 'horizontal' }, code: '<Separator />' },
      { label: 'Vertical', props: { orientation: 'vertical' }, code: '<Separator orientation="vertical" />', note: 'The parent sets the height; the separator stretches to it.' },
      { label: 'Semantic', props: { decorative: false }, code: '<Separator decorative={false} />', note: 'Exposed as role="separator" when the break carries meaning for a screen reader.' },
    ],
    render: (p: P) =>
      p.orientation === 'vertical' ? (
        <div className="flex h-8 items-stretch gap-2 text-xs text-muted-foreground">
          <span className="flex items-center">Before</span>
          <Separator {...(p as React.ComponentProps<typeof Separator>)} />
          <span className="flex items-center">After</span>
        </div>
      ) : (
        <Cell width={200}>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <span>Above</span>
            <Separator {...(p as React.ComponentProps<typeof Separator>)} />
            <span>Below</span>
          </div>
        </Cell>
      ),
  },
  'settings-module-shell': {
    component: 'SettingsModuleShell',
    module: 'settings-module-shell',
    base: {
      title: 'Live transcription',
      eyebrow: 'Module',
      description: 'Captures session audio for the recap.',
      children: <p className="m-0 text-xs text-muted-foreground">Labelled fields go here.</p>,
    },
    states: [
      { label: 'Title only', props: { eyebrow: undefined, description: undefined }, code: '<SettingsModuleShell title="Live transcription">' },
      { label: 'With actions', props: { actions: <Button size="sm" variant="ghost">Reset</Button> }, code: '<SettingsModuleShell actions={<Button size="sm" variant="ghost">Reset</Button>}>' },
      { label: 'With footer', props: { footer: <Button size="sm" variant="ghost">Advanced settings</Button> }, code: '<SettingsModuleShell footer={<Button size="sm" variant="ghost">Advanced settings</Button>}>' },
      { label: 'Collapsed', props: { collapsed: true }, code: '<SettingsModuleShell collapsed>', note: 'The header stays; the body is not rendered.' },
    ],
    render: ({ children, ...p }: P) => (
      <Cell>
        <SettingsModuleShell {...(p as React.ComponentProps<typeof SettingsModuleShell>)}>{children as React.ReactNode}</SettingsModuleShell>
      </Cell>
    ),
  },
  stack: {
    component: 'Stack',
    module: 'stack',
    axes: ['direction', 'gap', 'align', 'justify'],
    axisBase: { align: { direction: 'horizontal' }, justify: { direction: 'horizontal' } },
    states: [
      { label: 'Wrapping', props: { direction: 'horizontal', wrap: true, count: 8 }, code: '<Stack direction="horizontal" wrap>', note: 'Items flow to the next line instead of overflowing.' },
    ],
    render: ({ count, ...p }: P) => (
      <Stack {...(p as React.ComponentProps<typeof Stack>)} className="w-[280px] min-h-14 rounded-[var(--radius-sm)] border border-dashed border-border p-2">
        {Array.from({ length: (count as number) ?? 3 }, (_, i) => (
          <StackItem key={i} tall={((i % 3) + 1) as 1 | 2 | 3}>Item {i + 1}</StackItem>
        ))}
      </Stack>
    ),
  },
  sticky: {
    component: 'Sticky',
    module: 'sticky',
    base: {
      color: 'var(--weft-category-1)',
      header: (
        <>
          <span className="font-semibold">Private</span>
          <span className="ml-auto opacity-80">just now</span>
        </>
      ),
      children: 'Confirm the venue before sending the invitations.',
    },
    states: [
      { label: 'Body only', props: { header: undefined }, code: '<Sticky color="var(--weft-category-1)">', note: 'Only the outline carries the category colour.' },
      { label: 'With footer', props: { footer: <Chip size="sm">#planning</Chip> }, code: '<Sticky footer={<Chip size="sm">#planning</Chip>}>' },
      { label: 'Another category', props: { color: 'var(--weft-category-4)' }, code: '<Sticky color="var(--weft-category-4)">', note: 'Colour means category, never a person; use the --weft-category-* palette.' },
    ],
    render: ({ children, ...p }: P) => (
      <Cell width={220}>
        <Sticky {...(p as React.ComponentProps<typeof Sticky>)}>{children as React.ReactNode}</Sticky>
      </Cell>
    ),
  },
  toolbar: {
    component: 'Toolbar',
    module: 'toolbar',
    base: { 'aria-label': 'Document actions' },
    states: [
      { label: 'Named', props: {}, code: '<Toolbar aria-label="Document actions">', note: 'A toolbar is a landmark role; always pass aria-label.' },
    ],
    render: (p: P) => (
      <Cell>
        <Toolbar {...(p as React.ComponentProps<typeof Toolbar>)}>
          <span className="text-[length:var(--text-xs)] text-[var(--hud-text-3)]">README.md</span>
          <Button size="sm" variant="ghost">Copy</Button>
          <Button size="sm" variant="ghost">Share</Button>
        </Toolbar>
      </Cell>
    ),
  },
  'transcript-list-item-frame': {
    component: 'TranscriptListItemFrame',
    module: 'transcript-list-item-frame',
    base: { header: TRANSCRIPT_HEADER, body: TRANSCRIPT_BODY },
    states: [
      { label: 'Header and body', props: {}, code: '<TranscriptListItemFrame header={…} body={…} />' },
      { label: 'With footer', props: { footer: TRANSCRIPT_FOOTER }, code: '<TranscriptListItemFrame header={…} body={…} footer={…} />', note: 'Tags and row actions sit in the footer slot.' },
    ],
    render: (p: P) => (
      <Frame>
        <TranscriptListItemFrame {...(p as React.ComponentProps<typeof TranscriptListItemFrame>)} />
      </Frame>
    ),
  },
};
