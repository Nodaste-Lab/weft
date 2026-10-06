import * as React from 'react';
import { FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Callout } from '../../ui/callout';
import { EmptyState } from '../../ui/empty-state';
import { EyebrowLabel } from '../../ui/eyebrow-label';
import { HudIssueCallout } from '../../ui/HudIssueCallout';
import { HudIssueToast } from '../../ui/HudIssueToast';
import type { HudIssue } from '../../ui/hud-issue-contract';
import { Progress } from '../../ui/progress';
import { Skeleton } from '../../ui/skeleton';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const noop = () => undefined;

/** A synthetic HudIssue; states override the fields that matter to them. */
function issue(overrides: Partial<HudIssue> = {}): HudIssue {
  return {
    reason: 'fetch_failed',
    source: 'integration',
    scope: 'panel',
    severity: 'error',
    title: 'Could not load items',
    detail: 'The request reached the service but failed with HTTP 503.',
    nextAction: 'Refresh to try again. If it keeps failing, check that the service is running.',
    ...overrides,
  };
}

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
  HudIssueCallout: {
    component: 'HudIssueCallout',
    module: 'HudIssueCallout',
    base: { issue: issue() },
    states: [
      { label: 'Error', props: { issue: issue({ severity: 'error' }) }, code: '<HudIssueCallout issue={{ severity: "error", … }} />', note: 'role="alert", announced assertively.' },
      { label: 'Warning', props: { issue: issue({ severity: 'warning', reason: 'data_unavailable_for_platform', title: 'Some items are missing', detail: 'The source skipped two items it could not read.', nextAction: 'Open the source to see which items were skipped.' }) }, code: '<HudIssueCallout issue={{ severity: "warning", … }} />' },
      { label: 'Info', props: { issue: issue({ severity: 'info', reason: 'unsupported_feature', scope: 'capability', title: 'Actions unavailable on this backend', detail: 'This backend does not expose actions yet.', nextAction: 'Switch to a backend that supports actions, or hide them in settings.' }) }, code: '<HudIssueCallout issue={{ severity: "info", scope: "capability", … }} />', note: 'role="status", announced politely.' },
      { label: 'Preserved state', props: { issue: issue({ preservedStateNote: 'Previously loaded items are still shown; only the latest refresh failed.' }) }, code: '<HudIssueCallout issue={{ …, preservedStateNote: "…" }} />', note: 'Tells the operator nothing visible was discarded.' },
      { label: 'With action', props: { action: { label: 'Retry', onClick: noop } }, code: '<HudIssueCallout issue={…} action={{ label: "Retry", onClick }} />' },
      { label: 'Row scope', props: { issue: issue({ scope: 'row-action', reason: 'mutation_failed', title: 'Could not acknowledge this item', detail: 'The provider rejected the request.', nextAction: 'Wait a moment and try again.' }) }, code: '<HudIssueCallout issue={{ scope: "row-action", … }} />', note: 'row-action and submit scopes default to the compact variant; variant overrides.' },
    ],
    render: (p: P) => (
      <div className="w-full max-w-md">
        <HudIssueCallout {...(p as unknown as React.ComponentProps<typeof HudIssueCallout>)} />
      </div>
    ),
  },
  HudIssueToast: {
    component: 'HudIssueToast',
    module: 'HudIssueToast',
    base: { issue: issue({ reason: 'connection_failed', title: 'Items unavailable', detail: 'The service did not return a healthy status.', nextAction: 'Check that the service is running, then refresh.' }), onDismiss: noop },
    states: [
      { label: 'Error', props: {}, code: '<HudIssueToast issue={{ severity: "error", … }} onDismiss={…} />', note: 'Always dismissible; the Dismiss control is the only required action.' },
      { label: 'Warning', props: { issue: issue({ severity: 'warning', reason: 'data_unavailable_for_platform', title: 'Some items are missing', detail: 'The source skipped two items it could not read.', nextAction: 'Open the source to see which items were skipped.' }) }, code: '<HudIssueToast issue={{ severity: "warning", … }} onDismiss={…} />' },
      { label: 'Info', props: { issue: issue({ severity: 'info', reason: 'unsupported_feature', title: 'Actions unavailable on this backend', detail: 'This backend does not expose actions yet.', nextAction: 'Switch to a backend that supports actions.' }) }, code: '<HudIssueToast issue={{ severity: "info", … }} onDismiss={…} />' },
      {
        label: 'With actions',
        props: { actions: [{ kind: 'support-bundle', label: 'Email support with bundle' }, { kind: 'open-settings', section: 'spaces', label: 'Report' }], onAction: noop },
        code: '<HudIssueToast … actions={[{ kind: "support-bundle", label: "…" }, { kind: "open-settings", section: "…", label: "…" }]} onAction={…} />',
        note: 'support-bundle renders as the primary action; the rest are outline.',
      },
      {
        label: 'Action busy',
        props: { actions: [{ kind: 'support-bundle', label: 'Email support with bundle' }], busyActionKind: 'support-bundle', onAction: noop },
        code: '<HudIssueToast … actions={[…]} busyActionKind="support-bundle" />',
        note: 'The matching action shows its loading state while the request is in flight.',
      },
      { label: 'Status copy', props: { actions: [{ kind: 'support-bundle', label: 'Email support with bundle' }], statusCopy: 'Bundle sent.' }, code: '<HudIssueToast … statusCopy="Bundle sent." />', note: 'Result of an action, announced politely.' },
      { label: 'Error copy', props: { actions: [{ kind: 'support-bundle', label: 'Email support with bundle' }], errorCopy: 'Could not send the bundle.' }, code: '<HudIssueToast … errorCopy="Could not send the bundle." />', note: 'An action failed; the toast stays open.' },
    ],
    render: (p: P) => <HudIssueToast {...(p as unknown as React.ComponentProps<typeof HudIssueToast>)} />,
  },
  skeleton: {
    component: 'Skeleton',
    module: 'skeleton',
    base: { shape: 'line' },
    states: [
      { label: 'Text line', props: { shape: 'line' }, code: '<Skeleton className="h-4 w-3/4" />', note: 'Size it to the content it stands in for; the container carries aria-busy.' },
      { label: 'Avatar', props: { shape: 'avatar' }, code: '<Skeleton className="size-10 rounded-full" />' },
      { label: 'Block', props: { shape: 'block' }, code: '<Skeleton className="h-16 w-full" />' },
      { label: 'Composed', props: { shape: 'composed' }, code: '<div aria-busy="true"><Skeleton className="size-10 rounded-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>', note: 'Mirror the layout that will load; one skeleton per visible element.' },
    ],
    render: ({ shape, ...p }: P) => {
      const rest = p as React.ComponentProps<typeof Skeleton>;
      if (shape === 'avatar') return <Skeleton {...rest} className="size-10 rounded-full" />;
      if (shape === 'block') return <Skeleton {...rest} className="h-16 w-full" style={{ minWidth: 180 }} />;
      if (shape === 'composed') {
        return (
          <div aria-busy="true" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 10, rowGap: 6, alignItems: 'center', width: 220 }}>
            <Skeleton className="size-10 rounded-full" style={{ gridRow: 'span 2' }} />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        );
      }
      return <Skeleton {...rest} className="h-4 w-3/4" style={{ minWidth: 140 }} />;
    },
  },
};
