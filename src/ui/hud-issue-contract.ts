/**
 * Shared HUD issue taxonomy — the presentational contract rendered by
 * HudIssueCallout and HudIssueToast.
 *
 * Consumers describe a failure (or platform-gap) by constructing a
 * structured {@link HudIssue}; UI primitives render it consistently so
 * operators always see the four things the planning doctrine requires:
 * what failed, where it came from, whether state was preserved, and the
 * next safe action.
 *
 * The domain-specific issue *builders* (`buildSignalProviderIssue`,
 * `buildSignalAgentIssue`, ...) live in the app's `runtime/hudIssue.ts`,
 * which re-exports these types so app consumers keep a single import path.
 */

/**
 * Which layer of the HUD generated the issue. Drives operator-facing
 * attribution so agent-integration failures are never confused with
 * local data problems.
 */
export type HudIssueSource =
  | 'signal-provider'
  | 'ccore'
  | 'signal-agent'
  | 'openai'
  | 'integration'
  | 'vault'
  | 'hud-config'
  | 'unknown';

/**
 * Where the issue should render.
 * - `panel`: top-of-panel banner
 * - `row-action`: inline next to a row-level control
 * - `submit`: below a submit button or similar trigger
 * - `capability`: surface explaining that a feature is not available on this backend
 * - `data-gap`: surface explaining that the active backend cannot supply the data
 */
export type HudIssueScope =
  | 'panel'
  | 'row-action'
  | 'submit'
  | 'capability'
  | 'data-gap';

export type HudIssueSeverity = 'info' | 'warning' | 'error';

/**
 * Normalized, machine-readable failure reason. Kept intentionally small
 * so UI and tests can branch on a stable enum instead of on provider
 * error message strings.
 */
export type HudIssueReason =
  | 'connection_failed'
  | 'fetch_failed'
  | 'mutation_failed'
  | 'unsupported_feature'
  | 'data_unavailable_for_platform'
  | 'missing_version_id'
  | 'provider_not_registered'
  | 'invalid_agent_response'
  | 'missing_api_key'
  | 'agent_request_failed'
  | 'unknown';

export interface HudIssue {
  /** Machine-readable cause; used by tests and copy mapping. */
  reason: HudIssueReason;
  /** Which layer generated the failure. */
  source: HudIssueSource;
  /** Optional human-readable source label overriding the default source map label. */
  sourceLabel?: string;
  /** Where the issue should render. */
  scope: HudIssueScope;
  /** Severity for styling and assistive-tech role. */
  severity: HudIssueSeverity;
  /** Concise operator-facing summary. */
  title: string;
  /** Specific explanation of the failure, including _why_ a data gap exists. */
  detail: string;
  /** Exact safe recovery step. */
  nextAction: string;
  /**
   * Optional note that previously-visible state was preserved. Lets
   * operators trust that the HUD did not discard data during a refresh
   * failure.
   */
  preservedStateNote?: string;
  /**
   * Raw message from the underlying throw. Retained for dev overlays
   * and logs but intentionally not shown as the primary operator copy.
   */
  rawMessage?: string;
  /** True when a C-Core runtime issue is caused by account/runtime auth. */
  ccoreAuthRequired?: boolean;
}

export interface CcoreIssueReportContext {
  title: string;
  detail: string;
  reason: HudIssueReason;
  panelId?: string;
  reportedAt: string;
}

/** Human-readable attribution used in callout source lines. */
export const HUD_ISSUE_SOURCE_LABEL: Record<HudIssueSource, string> = {
  'signal-provider': 'Signal provider',
  ccore: 'C-Core',
  'signal-agent': 'Signal agent',
  openai: 'OpenAI',
  integration: 'Integration',
  vault: 'Vault',
  'hud-config': 'HUD configuration',
  unknown: 'HUD',
};

export function resolveHudIssueSourceLabel(issue: Pick<HudIssue, 'source' | 'sourceLabel'>): string {
  return issue.sourceLabel ?? HUD_ISSUE_SOURCE_LABEL[issue.source];
}

/**
 * Render contract for toast action buttons. The app's
 * `runtime/hudIssueToastActions.ts` defines a stricter union (its
 * `open-settings` `section` is the app's settings-section id type, which the
 * design system deliberately does not know about); that union is assignable
 * to this one, so app code can pass its actions straight to HudIssueToast.
 */
export type HudIssueToastAction =
  | { kind: 'support-bundle'; label: string }
  | {
      kind: 'open-settings';
      section: string;
      label: string;
      reportContext?: CcoreIssueReportContext;
    };
