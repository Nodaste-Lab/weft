import type { CSSProperties, ReactNode } from 'react';
import {
  resolveHudIssueSourceLabel,
  type HudIssue,
  type HudIssueScope,
  type HudIssueSeverity,
} from '../../runtime/hudIssue';
import { Button } from './button';

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
        border: 'var(--hud-danger-border)',
        background: 'var(--hud-danger-bg-strong)',
        icon: '!',
        role: 'alert',
      };
    case 'warning':
      return {
        accent: 'var(--hud-warning)',
        border: 'var(--hud-warning-border)',
        background: 'var(--hud-attention-bg-strong)',
        icon: '⚠',
        role: 'alert',
      };
    case 'info':
    default:
      return {
        accent: 'var(--hud-info, var(--primary))',
        border: 'var(--hud-border-accent)',
        background: 'var(--hud-info-bg-soft)',
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
  const sourceLabel = resolveHudIssueSourceLabel(issue);

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
    fontFamily: 'var(--weft-font-sans)',
    alignItems: 'start',
    ...style,
  };

  const iconStyle: CSSProperties = {
    color: colors.accent,
    fontFamily: 'var(--weft-font-mono)',
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className={compact ? 'mt-1 h-7 justify-self-start px-2 text-[10px]' : 'mt-2 justify-self-start'}
            style={{ color: colors.accent, borderColor: colors.accent }}
          >
            {action.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
