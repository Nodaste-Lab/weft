import type { CSSProperties, ReactNode } from 'react';
import {
  HUD_ISSUE_SOURCE_LABEL,
  type HudIssue,
  type HudIssueScope,
  type HudIssueSeverity,
} from '../../runtime/hudIssue';

/**
 * Shared HUD issue presentation primitive.
 *
 * Renders a structured {@link HudIssue} with consistent copy order:
 * title → attribution/detail → next action → preserved-state note.
 *
 * The primitive is scope-aware:
 * - `panel`, `capability`, `data-gap` → standard variant (banner density)
 * - `row-action`, `submit` → compact variant (inline to a control)
 *
 * Use the `variant` prop to override the default when a host needs
 * compact density in a panel context or vice versa.
 */

export type HudIssueCalloutVariant = 'standard' | 'compact';

export interface HudIssueCalloutAction {
  label: string;
  onClick: () => void;
}

export interface HudIssueCalloutProps {
  issue: HudIssue;
  variant?: HudIssueCalloutVariant;
  action?: HudIssueCalloutAction;
  className?: string;
  style?: CSSProperties;
}

function defaultVariantForScope(scope: HudIssueScope): HudIssueCalloutVariant {
  switch (scope) {
    case 'row-action':
    case 'submit':
      return 'compact';
    default:
      return 'standard';
  }
}

function severityColors(severity: HudIssueSeverity): {
  accent: string;
  border: string;
  background: string;
  icon: string;
  role: 'alert' | 'status';
} {
  switch (severity) {
    case 'error':
      return {
        accent: 'var(--hud-danger)',
        border: 'rgba(239, 68, 68, 0.32)',
        background: 'rgba(57, 29, 20, 0.78)',
        icon: '!',
        role: 'alert',
      };
    case 'warning':
      return {
        accent: 'var(--hud-warning)',
        border: 'rgba(251, 191, 36, 0.3)',
        background: 'rgba(52, 40, 20, 0.72)',
        icon: '⚠',
        role: 'alert',
      };
    case 'info':
    default:
      return {
        accent: 'var(--hud-info, var(--primary))',
        border: 'var(--hud-border-accent)',
        background: 'rgba(24, 32, 48, 0.68)',
        icon: 'ℹ',
        role: 'status',
      };
  }
}

export function HudIssueCallout({
  issue,
  variant,
  action,
  className,
  style,
}: HudIssueCalloutProps): ReactNode {
  const effectiveVariant = variant ?? defaultVariantForScope(issue.scope);
  const colors = severityColors(issue.severity);

  const compact = effectiveVariant === 'compact';
  const sourceLabel = HUD_ISSUE_SOURCE_LABEL[issue.source];

  const rootStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: compact ? 8 : 10,
    rowGap: 4,
    padding: compact ? '6px 9px' : '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${colors.border}`,
    background: colors.background,
    color: 'var(--hud-text-1)',
    fontFamily: "'Inter', sans-serif",
    alignItems: 'start',
    ...style,
  };

  const iconStyle: CSSProperties = {
    color: colors.accent,
    fontFamily: 'monospace',
    fontSize: compact ? 11 : 13,
    lineHeight: '1.2',
    fontWeight: 700,
    marginTop: compact ? 1 : 2,
  };

  const titleStyle: CSSProperties = {
    fontSize: compact ? 11 : 'var(--text-sm)',
    fontWeight: 600,
    lineHeight: 1.3,
  };

  const detailStyle: CSSProperties = {
    marginTop: 2,
    fontSize: compact ? 10 : 'var(--text-xs)',
    color: 'var(--hud-text-2)',
    lineHeight: 1.5,
  };

  const sourceStyle: CSSProperties = {
    fontSize: compact ? 9 : 10,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--hud-text-3)',
    marginTop: compact ? 2 : 4,
  };

  const nextActionStyle: CSSProperties = {
    marginTop: compact ? 3 : 6,
    fontSize: compact ? 10 : 'var(--text-xs)',
    color: 'var(--hud-text-2)',
    lineHeight: 1.5,
  };

  const preservedStyle: CSSProperties = {
    marginTop: 4,
    fontSize: compact ? 9 : 10,
    color: 'var(--hud-text-3)',
    fontStyle: 'italic',
    lineHeight: 1.5,
  };

  const buttonStyle: CSSProperties = {
    marginTop: compact ? 4 : 8,
    padding: compact ? '3px 8px' : '4px 10px',
    fontSize: compact ? 10 : 11,
    fontFamily: "'Inter', sans-serif",
    color: colors.accent,
    background: 'transparent',
    border: `1px solid ${colors.accent}`,
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    justifySelf: 'start',
  };

  return (
    <div
      data-testid="hud-issue-callout"
      data-variant={effectiveVariant}
      data-severity={issue.severity}
      data-reason={issue.reason}
      data-source={issue.source}
      data-scope={issue.scope}
      role={colors.role}
      aria-live={colors.role === 'alert' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={className}
      style={rootStyle}
    >
      <span aria-hidden="true" style={iconStyle}>
        {colors.icon}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={titleStyle}>{issue.title}</div>
        <div style={sourceStyle}>From {sourceLabel}</div>
        <div style={detailStyle}>{issue.detail}</div>
        <div style={nextActionStyle}>
          <strong style={{ fontWeight: 600, color: 'var(--hud-text-2)' }}>
            Next:
          </strong>{' '}
          {issue.nextAction}
        </div>
        {issue.preservedStateNote ? (
          <div data-testid="hud-issue-preserved" style={preservedStyle}>
            {issue.preservedStateNote}
          </div>
        ) : null}
        {action ? (
          <button type="button" onClick={action.onClick} style={buttonStyle}>
            {action.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
