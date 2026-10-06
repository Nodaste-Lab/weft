import * as React from 'react';
import { CheckCircle2, FileText, Plus } from 'lucide-react';
import { AttentionTicketCard } from '../../ui/attention-ticket-card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Chip } from '../../ui/chip';
import { CodeBlock } from '../../ui/code-block';
import { CommandCategoryTag } from '../../ui/command-category-tag';
import { ConditionChipStrip } from '../../ui/condition-chip-strip';
import { ContentViewer } from '../../ui/content-viewer';
import { CopyableRef } from '../../ui/copyable-ref';
import { Dot } from '../../ui/dot';
import { HtmlViewer } from '../../ui/html-viewer';
import { HudListRow, HudListRowMeta, HudListRowTitle } from '../../ui/hud-list-row';
import { InlineEditListRow } from '../../ui/inline-edit-list-row';
import { KnowledgeSearchResultRow } from '../../ui/knowledge-search-result-row';
import { MarkDownRenderer } from '../../ui/markdown-renderer';
import { MarkdownViewer } from '../../ui/markdown-viewer';
import { MetricTile } from '../../ui/metric-tile';
import { ProviderStatusBadge } from '../../ui/provider-status-badge';
import { SignalFilterChipGroup } from '../../ui/signal-filter-chip-group';
import { SourcePill } from '../../ui/source-pill';
import { StatRow } from '../../ui/stat-row';
import { StatusIconRow } from '../../ui/status-icon-row';
import { Steps } from '../../ui/steps';
import { StepsItem } from '../../ui/steps-item';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../ui/table';
import { TierGroup } from '../../ui/tier-group';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const noop = () => undefined;

/** A row's worth of surface so list rows and viewers have a bounded width. */
const FRAME: React.CSSProperties = { width: 320, maxWidth: '100%' };

const FILE_ICON = <FileText size={12} aria-hidden="true" focusable="false" />;
const CHECK_ICON = <CheckCircle2 size={12} aria-hidden="true" focusable="false" />;
const PLUS_ICON = <Plus size={12} aria-hidden="true" focusable="false" />;

/** 1×1 transparent image; Radix shows the fallback until it loads. */
const AVATAR_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const MARKDOWN = ['### Morning summary', '', 'Three notes changed since `yesterday`.', '', '- [Open the brief](https://example.com)', '- Review the draft'].join('\n');
const HTML = '<h3>Weekly digest</h3><p>Three notes changed. <a href="https://example.com">Open the brief</a></p>';

const STEP_ITEMS = [
  { id: 'source', label: 'Choose source', description: 'Pick the note to process.', status: 'complete' as const },
  { id: 'review', label: 'Review draft', description: 'Check citations and next steps.', status: 'current' as const },
  { id: 'share', label: 'Share summary', status: 'pending' as const },
];

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
];

const TIER_LABELS: Record<string, string> = { blocked: 'Blocked', awaiting: 'Awaiting', fyi: 'FYI' };

const SEARCH_RESULT = {
  id: 'r1',
  title: 'Launch brief',
  path: 'reference/launch-brief.md',
  excerpt: 'A concise brief for the release operator.',
  relevance: 91,
  categories: ['reference'],
};

/** Specimens for the data-display category. One entry per component id; see ../specimen-types.ts. */
export const data_displaySpecimens: Record<string, Specimen> = {
  'attention-ticket-card': {
    component: 'AttentionTicketCard',
    module: 'attention-ticket-card',
    base: {
      reasonLabel: 'New comment',
      reasonColor: 'var(--hud-info)',
      projectLabel: 'Ops',
      timestampLabel: '3h ago',
      title: 'Polish the ticket row',
      reasonText: 'A reviewer left a comment',
      expanded: false,
      onToggle: noop,
    },
    states: [
      { label: 'With snippet', props: { snippet: 'Can we match the spec?' }, code: '<AttentionTicketCard snippet="…">' },
      { label: 'With provider link', props: { issueUrl: '#', openInProviderAriaLabel: 'Open ticket in tracker' }, code: '<AttentionTicketCard issueUrl="…" openInProviderAriaLabel="Open ticket in tracker">', note: 'The link is a sibling of the row button, never nested inside it.' },
      { label: 'Expanded', props: { expanded: true }, code: '<AttentionTicketCard expanded>{thread}</AttentionTicketCard>', note: 'Children render below the header only while expanded.' },
      { label: 'No project', props: { projectLabel: null }, code: '<AttentionTicketCard projectLabel={null}>' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <AttentionTicketCard {...(p as React.ComponentProps<typeof AttentionTicketCard>)}>
          <p className="m-0 text-[length:var(--text-xs)] text-[var(--hud-text-2)]">Thread body renders here.</p>
        </AttentionTicketCard>
      </div>
    ),
  },
  avatar: {
    component: 'Avatar',
    module: 'avatar',
    base: { initials: 'JD' },
    states: [
      { label: 'Fallback initials', props: {}, code: '<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>' },
      { label: 'With image', props: { src: AVATAR_SRC, alt: 'Jo Doe' }, code: '<Avatar><AvatarImage src="…" alt="Jo Doe" /><AvatarFallback>JD</AvatarFallback></Avatar>', note: 'The fallback shows until the image loads.' },
    ],
    render: ({ initials, src, alt, ...p }: P) => (
      <Avatar {...(p as React.ComponentProps<typeof Avatar>)}>
        {typeof src === 'string' ? <AvatarImage src={src} alt={String(alt ?? '')} /> : null}
        <AvatarFallback className="text-xs">{initials as React.ReactNode}</AvatarFallback>
      </Avatar>
    ),
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
  'code-block': {
    component: 'CodeBlock',
    module: 'code-block',
    base: { code: 'const clues = 3;\nexport { clues };', language: 'ts', label: 'clues.ts' },
    states: [
      { label: 'With copy', props: { onCopy: noop, copyLabel: 'Copy clues.ts' }, code: '<CodeBlock onCopy={…} copyLabel="Copy clues.ts">' },
      { label: 'Wrapped', props: { wrap: true, code: 'const message = "a long line that wraps instead of scrolling when the block is narrow";' }, code: '<CodeBlock wrap>' },
      { label: 'No header', props: { label: undefined, language: undefined }, code: '<CodeBlock code="…">', note: 'Without label, language or onCopy the header row is omitted.' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <CodeBlock {...(p as React.ComponentProps<typeof CodeBlock>)} />
      </div>
    ),
  },
  'command-category-tag': {
    component: 'CommandCategoryTag',
    module: 'command-category-tag',
    base: { tone: 'info', children: 'Navigate' },
    states: [
      { label: 'Danger', props: { tone: 'danger', children: 'Destroy' }, code: '<CommandCategoryTag tone="danger">' },
      { label: 'Positive', props: { tone: 'positive', children: 'Create' }, code: '<CommandCategoryTag tone="positive">' },
      { label: 'Warning', props: { tone: 'warning', children: 'Review' }, code: '<CommandCategoryTag tone="warning">' },
      { label: 'Info', props: { tone: 'info', children: 'Navigate' }, code: '<CommandCategoryTag tone="info">' },
      { label: 'Bulk', props: { tone: 'bulk', children: 'Batch' }, code: '<CommandCategoryTag tone="bulk">' },
      { label: 'Muted', props: { tone: 'muted', children: 'Other' }, code: '<CommandCategoryTag tone="muted">' },
    ],
    render: ({ children, ...p }: P) => (
      <CommandCategoryTag {...(p as React.ComponentProps<typeof CommandCategoryTag>)}>{children as React.ReactNode}</CommandCategoryTag>
    ),
  },
  'condition-chip-strip': {
    component: 'ConditionChipStrip',
    module: 'condition-chip-strip',
    base: { conditions: ['status:open', 'owner:me'] },
    states: [
      { label: 'One condition', props: { conditions: ['status:open'] }, code: '<ConditionChipStrip><Chip onRemove={…} /><Button>Add condition</Button></ConditionChipStrip>' },
      { label: 'Add control only', props: { conditions: [] }, code: '<ConditionChipStrip><Button>Add condition</Button></ConditionChipStrip>', note: 'The strip is a layout slot; it carries no empty copy of its own.' },
    ],
    render: ({ conditions, ...p }: P) => (
      <ConditionChipStrip style={FRAME} {...(p as React.ComponentProps<typeof ConditionChipStrip>)}>
        {(conditions as string[]).map((c) => (
          <Chip key={c} onRemove={noop} removeLabel={`Remove ${c}`}>
            {c}
          </Chip>
        ))}
        <Button variant="outline" size="sm">
          {PLUS_ICON}
          Add condition
        </Button>
      </ConditionChipStrip>
    ),
  },
  'content-viewer': {
    component: 'ContentViewer',
    module: 'content-viewer',
    base: { source: '<p>Hello</p>', sourceLanguage: 'html', children: <p className="m-0 p-3 text-sm">Hello</p> },
    states: [
      { label: 'Toggle only', props: { showCopy: false }, code: '<ContentViewer showCopy={false}>' },
      { label: 'No toolbar', props: { showSourceToggle: false, showCopy: false }, code: '<ContentViewer showSourceToggle={false} showCopy={false}>' },
      { label: 'Empty', props: { source: '', emptyLabel: 'Nothing to display' }, code: '<ContentViewer source="" emptyLabel="Nothing to display">', note: 'Whitespace-only source counts as empty; the toolbar is hidden.' },
    ],
    render: ({ children, ...p }: P) => (
      <div style={FRAME}>
        <ContentViewer {...(p as React.ComponentProps<typeof ContentViewer>)}>{children as React.ReactNode}</ContentViewer>
      </div>
    ),
  },
  'copyable-ref': {
    component: 'CopyableRef',
    module: 'copyable-ref',
    base: { value: 'ref://ticket/T-1234', label: 'ticket ID' },
    states: [
      { label: 'Value as display', props: {}, code: '<CopyableRef value="ref://ticket/T-1234" label="ticket ID" />' },
      { label: 'Custom display', props: { value: 'ref://session/e3f1a82c-b017-4d8a-99f0-2d3c5a6b7e8d', label: 'session ref', children: <span>e3f1a82c-…-7e8d</span> }, code: '<CopyableRef value="…" label="session ref"><span>e3f1a82c-…-7e8d</span></CopyableRef>', note: 'Copies the full value; shows the abbreviated child. Copied / Failed feedback is internal and reverts after 1.5s.' },
    ],
    render: ({ children, ...p }: P) => (
      <div style={FRAME}>
        <CopyableRef {...(p as React.ComponentProps<typeof CopyableRef>)}>{children as React.ReactNode}</CopyableRef>
      </div>
    ),
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
  'html-viewer': {
    component: 'HtmlViewer',
    module: 'html-viewer',
    base: { html: HTML, frameTitle: 'Weekly digest preview' },
    states: [
      { label: 'No toolbar', props: { showSourceToggle: false, showCopy: false }, code: '<HtmlViewer showSourceToggle={false} showCopy={false}>' },
      { label: 'Empty', props: { html: '' }, code: '<HtmlViewer html="" />', note: 'Shows the empty state instead of a blank frame.' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <HtmlViewer {...(p as React.ComponentProps<typeof HtmlViewer>)} />
      </div>
    ),
  },
  'hud-list-row': {
    component: 'HudListRow',
    module: 'hud-list-row',
    // `type` only applies to as="button" and is not visual; `as` is excluded by the site.
    axes: ['state', 'density', 'align'],
    base: { title: 'Sync finished', meta: '3h · Ops' },
    states: [
      { label: 'Interactive', props: { as: 'button', interactive: true, onSelect: noop }, code: '<HudListRow as="button" interactive onSelect={…}>', note: 'Row-level select renders a native button so the whole row is the control.' },
      { label: 'Disabled', props: { as: 'button', interactive: true, onSelect: noop, disabled: true }, code: '<HudListRow as="button" disabled>' },
      { label: 'With leading media', props: { leading: 'avatar' }, code: '<HudListRow leading={<Avatar />}>' },
      { label: 'With trailing actions', props: { trailing: 'button' }, code: '<HudListRow trailing={<Button size="sm">View</Button>}>' },
      { label: 'List item', props: { as: 'li' }, code: '<ul><HudListRow as="li" /></ul>' },
      { label: 'Unframed', props: { frame: false }, code: '<HudListRow frame={false}>', note: 'No stripe, padding or divider; for rows that bring their own spacing.' },
      { label: 'No divider', props: { divider: false }, code: '<HudListRow divider={false}>' },
    ],
    render: ({ title, meta, leading, trailing, ...p }: P) => {
      const row = (
        <HudListRow
          {...(p as React.ComponentProps<typeof HudListRow>)}
          leading={
            leading === 'avatar' ? (
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">JD</AvatarFallback>
              </Avatar>
            ) : undefined
          }
          trailing={
            trailing === 'button' ? (
              <Button size="sm" variant="ghost">
                View
              </Button>
            ) : undefined
          }
        >
          <HudListRowTitle emphasis={p.state === 'unread'}>{title as React.ReactNode}</HudListRowTitle>
          <HudListRowMeta>{meta as React.ReactNode}</HudListRowMeta>
        </HudListRow>
      );
      return (
        <div style={FRAME}>
          {p.as === 'li' ? <ul className="m-0 list-none p-0">{row}</ul> : row}
        </div>
      );
    },
  },
  'inline-edit-list-row': {
    component: 'InlineEditListRow',
    module: 'inline-edit-list-row',
    base: { text: 'Confirm the venue booking', index: 0, onUpdate: noop, onDelete: noop, editAriaLabel: 'Edit item', deleteAriaLabel: 'Delete item' },
    states: [
      { label: 'With index', props: { showIndex: true, index: 2 }, code: '<InlineEditListRow showIndex index={2}>', note: 'Index is zero-based; the badge shows index + 1.' },
      { label: 'With leading icon', props: { leadingIcon: CHECK_ICON }, code: '<InlineEditListRow leadingIcon={<CheckCircle2 aria-hidden />}>' },
      { label: 'Italic', props: { italic: true }, code: '<InlineEditListRow italic>' },
      { label: 'Empty value', props: { text: '' }, code: '<InlineEditListRow text="">', note: 'Empty is a value; the row shows a placeholder so it stays editable.' },
      { label: 'List item', props: { as: 'li' }, code: '<ul><InlineEditListRow as="li" /></ul>' },
    ],
    render: (p: P) => {
      const row = <InlineEditListRow {...(p as React.ComponentProps<typeof InlineEditListRow>)} />;
      return <div style={FRAME}>{p.as === 'li' ? <ul className="m-0 list-none p-0">{row}</ul> : row}</div>;
    },
  },
  'knowledge-search-result-row': {
    component: 'KnowledgeSearchResultRow',
    module: 'knowledge-search-result-row',
    base: { result: SEARCH_RESULT, obsidianHref: '#', isBrowseMode: false, copiedPath: null, onCopyPath: noop },
    states: [
      { label: 'Search hit', props: {}, code: '<KnowledgeSearchResultRow result={…} isBrowseMode={false}>' },
      { label: 'Browse mode', props: { isBrowseMode: true }, code: '<KnowledgeSearchResultRow isBrowseMode>', note: 'No relevance score or bar when the list is not ranked.' },
      { label: 'Path copied', props: { copiedPath: SEARCH_RESULT.path }, code: '<KnowledgeSearchResultRow copiedPath={result.path}>' },
      { label: 'Low relevance', props: { result: { ...SEARCH_RESULT, relevance: 42, categories: ['documents', 'meetings'] } }, code: '<KnowledgeSearchResultRow result={{ …, relevance: 42 }}>' },
    ],
    render: (p: P) => (
      <div style={FRAME} className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]">
        <KnowledgeSearchResultRow {...(p as React.ComponentProps<typeof KnowledgeSearchResultRow>)} />
      </div>
    ),
  },
  'markdown-renderer': {
    component: 'MarkDownRenderer',
    module: 'markdown-renderer',
    base: { markdown: MARKDOWN },
    states: [
      { label: 'Prose', props: {}, code: '<MarkDownRenderer markdown="### Heading…" />' },
      { label: 'Code block', props: { markdown: '```ts\nconst clues = 3;\n```' }, code: '<MarkDownRenderer markdown="```ts…```" />' },
      { label: 'Unsafe content', props: { markdown: '[Blocked](javascript:alert(1))\n\n![Map](https://example.com/map.png)' }, code: '<MarkDownRenderer markdown="[Blocked](javascript:…)" />', note: 'Unsafe links render as text; images are blocked.' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <MarkDownRenderer {...(p as React.ComponentProps<typeof MarkDownRenderer>)} />
      </div>
    ),
  },
  'markdown-viewer': {
    component: 'MarkdownViewer',
    module: 'markdown-viewer',
    base: { markdown: MARKDOWN },
    states: [
      { label: 'No toolbar', props: { showSourceToggle: false, showCopy: false }, code: '<MarkdownViewer showSourceToggle={false} showCopy={false}>' },
      { label: 'Empty', props: { markdown: '' }, code: '<MarkdownViewer markdown="" />' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <MarkdownViewer {...(p as React.ComponentProps<typeof MarkdownViewer>)} />
      </div>
    ),
  },
  'metric-tile': {
    component: 'MetricTile',
    module: 'metric-tile',
    base: { label: 'Open', value: 12 },
    states: [
      { label: 'Danger', props: { label: 'Overdue', value: 3, valueTone: 'danger' }, code: '<MetricTile valueTone="danger">' },
      { label: 'Warning', props: { label: 'Due soon', value: 5, valueTone: 'warning' }, code: '<MetricTile valueTone="warning">' },
      { label: 'Positive', props: { label: 'Done', value: 40, valueTone: 'positive' }, code: '<MetricTile valueTone="positive">' },
      { label: 'Info', props: { label: 'Active', value: 7, valueTone: 'info' }, code: '<MetricTile valueTone="info">' },
      { label: 'Muted', props: { label: 'Total', value: '—', valueTone: 'muted' }, code: '<MetricTile valueTone="muted" value="—">', note: 'Muted is the honest empty, not a dimmed number.' },
      { label: 'With hint', props: { hint: 'since Monday' }, code: '<MetricTile hint="since Monday">' },
      { label: 'Large value', props: { valueSize: 'lg' }, code: '<MetricTile valueSize="lg">' },
      { label: 'Small value', props: { valueSize: 'sm' }, code: '<MetricTile valueSize="sm">' },
    ],
    render: (p: P) => (
      <div style={{ width: 140 }}>
        <MetricTile {...(p as React.ComponentProps<typeof MetricTile>)} />
      </div>
    ),
  },
  'provider-status-badge': {
    component: 'ProviderStatusBadge',
    module: 'provider-status-badge',
    base: { status: 'available' },
    render: (p: P) => <ProviderStatusBadge {...(p as React.ComponentProps<typeof ProviderStatusBadge>)} />,
  },
  'signal-filter-chip-group': {
    component: 'SignalFilterChipGroup',
    module: 'signal-filter-chip-group',
    base: { label: 'Timeframe', options: CHIP_OPTIONS, active: ['today'], onToggle: noop },
    states: [
      { label: 'Single select', props: { active: ['today'] }, code: '<SignalFilterChipGroup isActive={(v) => v === timeframe} onToggle={…}>' },
      { label: 'Multi select', props: { label: 'Priority', options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }], active: ['high', 'medium'] }, code: '<SignalFilterChipGroup isActive={(v) => priorities.includes(v)}>', note: 'The group does not own selection; the caller decides single or multi.' },
      { label: 'None active', props: { active: [] }, code: '<SignalFilterChipGroup isActive={() => false}>' },
    ],
    render: ({ active, ...p }: P) => (
      <div style={FRAME}>
        <SignalFilterChipGroup {...(p as React.ComponentProps<typeof SignalFilterChipGroup>)} isActive={(v) => (active as string[]).includes(v)} />
      </div>
    ),
  },
  'source-pill': {
    component: 'SourcePill',
    module: 'source-pill',
    base: { children: 'notes/2026-10-05.md' },
    states: [
      { label: 'Default', props: {}, code: '<SourcePill>notes/2026-10-05.md</SourcePill>' },
      { label: 'Muted', props: { tone: 'muted' }, code: '<SourcePill tone="muted">' },
      { label: 'Truncated', props: { children: 'notes/projects/launch/2026-10-05-retrospective-and-follow-ups.md' }, code: '<SourcePill>long/path.md</SourcePill>', note: 'Truncates by default; the parent sets the width.' },
      { label: 'Full width', props: { truncate: false, children: 'notes/projects/launch/2026-10-05-retrospective-and-follow-ups.md' }, code: '<SourcePill truncate={false}>', note: 'For scrollable lists where the whole path must read.' },
    ],
    render: ({ children, ...p }: P) => (
      <div style={{ width: 200, maxWidth: '100%' }}>
        <SourcePill {...(p as React.ComponentProps<typeof SourcePill>)}>{children as React.ReactNode}</SourcePill>
      </div>
    ),
  },
  'stat-row': {
    component: 'StatRow',
    module: 'stat-row',
    base: { label: 'Participants', value: 4 },
    axisBase: { variant: { leading: 'dot' } },
    states: [
      { label: 'With hint', props: { hint: 'of 6' }, code: '<StatRow hint="of 6">' },
      { label: 'Board with leading', props: { variant: 'board', leading: 'dot', label: 'Recorder', value: 'Ready' }, code: '<StatRow variant="board" leading={<Dot tone="ok" />}>', note: 'The leading slot carries the status colour; the label carries the meaning.' },
    ],
    render: ({ leading, ...p }: P) => (
      <div style={{ width: 220 }}>
        <StatRow {...(p as React.ComponentProps<typeof StatRow>)} leading={leading === 'dot' && p.variant === 'board' ? <Dot tone="ok" /> : undefined} />
      </div>
    ),
  },
  'status-icon-row': {
    component: 'StatusIconRow',
    module: 'status-icon-row',
    base: { icon: FILE_ICON, title: 'Vault connected', detail: 'Last sync 2 minutes ago' },
    states: [
      { label: 'Title only', props: { detail: undefined }, code: '<StatusIconRow icon={…} title="Vault connected" />' },
      { label: 'With actions', props: { actions: <Button size="sm" variant="ghost">Retry</Button> }, code: '<StatusIconRow actions={<Button size="sm">Retry</Button>}>' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <StatusIconRow {...(p as React.ComponentProps<typeof StatusIconRow>)} />
      </div>
    ),
  },
  'steps-item': {
    component: 'StepsItem',
    module: 'steps-item',
    base: { id: 'review', index: 1, label: 'Review draft', description: 'Check citations and next steps.' },
    states: [
      { label: 'With meta', props: { meta: 'Updated 3h ago' }, code: '<StepsItem meta="Updated 3h ago">' },
      { label: 'With connector', props: { showConnector: true }, code: '<StepsItem showConnector>', note: 'Steps sets this on every item except the last.' },
    ],
    render: (p: P) => (
      <ol className="m-0 list-none p-0 text-sm [font-family:var(--weft-font-sans)]" style={FRAME}>
        <StepsItem {...(p as React.ComponentProps<typeof StepsItem>)} />
      </ol>
    ),
  },
  steps: {
    component: 'Steps',
    module: 'steps',
    base: { items: STEP_ITEMS, 'aria-label': 'Briefing progress' },
    states: [
      { label: 'Vertical', props: {}, code: '<Steps items={…} aria-label="Briefing progress" />' },
      { label: 'Horizontal', props: { orientation: 'horizontal' }, code: '<Steps orientation="horizontal">' },
      { label: 'Compact', props: { density: 'compact' }, code: '<Steps density="compact">' },
      { label: 'No connectors', props: { showConnectors: false }, code: '<Steps showConnectors={false}>' },
      { label: 'With error', props: { items: [STEP_ITEMS[0], { ...STEP_ITEMS[1], status: 'error' as const, meta: 'Two citations missing' }, STEP_ITEMS[2]] }, code: '<Steps items={[…, { status: "error" }, …]}>' },
    ],
    render: (p: P) => (
      <div style={FRAME}>
        <Steps {...(p as React.ComponentProps<typeof Steps>)} />
      </div>
    ),
  },
  table: {
    component: 'Table',
    module: 'table',
    states: [
      { label: 'With caption', props: { caption: 'Session participants' }, code: '<Table><TableCaption>Session participants</TableCaption>…</Table>' },
      { label: 'With footer', props: { footer: true }, code: '<Table>…<TableFooter><TableRow><TableCell>Total</TableCell>…</TableRow></TableFooter></Table>' },
    ],
    render: ({ caption, footer, ...p }: P) => (
      <div style={FRAME}>
        <Table {...(p as React.ComponentProps<typeof Table>)}>
          {typeof caption === 'string' ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Mara</TableCell>
              <TableCell>Facilitator</TableCell>
              <TableCell className="text-right">3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Jun</TableCell>
              <TableCell>Scribe</TableCell>
              <TableCell className="text-right">1</TableCell>
            </TableRow>
          </TableBody>
          {footer ? (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">4</TableCell>
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
      </div>
    ),
  },
  'tier-group': {
    component: 'TierGroup',
    module: 'tier-group',
    // Each tier is a named landmark, so every cell needs its own label: the
    // axis cells take the tier name from `urgency`, the states name themselves.
    base: { urgency: 'awaiting' },
    axisBase: { urgency: { count: 2 } },
    states: [
      { label: 'With count', props: { label: 'Awaiting reply', count: 2 }, code: '<TierGroup urgency="awaiting" label="Awaiting reply" count={2}>' },
      { label: 'With subtitle', props: { label: 'Awaiting approval', subtitle: 'In progress' }, code: '<TierGroup label="Awaiting approval" subtitle="In progress">' },
      { label: 'Blocked with detail', props: { urgency: 'blocked', label: 'Blocked on legal', count: 1, subtitle: 'Need unblocking now' }, code: '<TierGroup urgency="blocked" label="Blocked on legal" count={1} subtitle="Need unblocking now">', note: 'Never render an empty tier; the component returns null without children.' },
    ],
    render: ({ label, urgency, ...p }: P) => (
      <div style={FRAME}>
        <TierGroup
          {...(p as React.ComponentProps<typeof TierGroup>)}
          urgency={urgency as React.ComponentProps<typeof TierGroup>['urgency']}
          label={typeof label === 'string' ? label : TIER_LABELS[String(urgency)] ?? String(urgency)}
        >
          <div className="flex flex-col gap-1 px-2 py-1">
            <span className="text-xs text-[var(--weft-ink,var(--foreground))]">Awaiting legal sign-off</span>
            <span className="text-xs text-[var(--weft-muted,var(--muted-foreground))]">T-892</span>
          </div>
        </TierGroup>
      </div>
    ),
  },
};
