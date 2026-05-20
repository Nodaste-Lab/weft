import type { CSSProperties, ReactNode } from 'react';
import { X } from 'lucide-react';
import type { HudIssue, HudIssueSeverity } from '../../runtime/hudIssue';
import { resolveHudIssueSourceLabel } from '../../runtime/hudIssue';

interface HudIssueToastProps {
  issue: HudIssue;
  onDismiss: () => void;
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
        border: 'rgba(239, 68, 68, 0.35)',
        background: 'var(--hud-danger-bg-strong)',
        icon: '!',
        role: 'alert',
      };
    case 'warning':
      return {
        accent: 'var(--hud-warning)',
        border: 'rgba(251, 191, 36, 0.35)',
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

function truncateDetail(detail: string): string {
  if (detail.length <= 180) {
    return detail;
  }
  return `${detail.slice(0, 177)}...`;
}

export function HudIssueToast({ issue, onDismiss }: HudIssueToastProps): ReactNode {
  const colors = severityColors(issue.severity);
  const sourceLabel = resolveHudIssueSourceLabel(issue);

  const rootStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    columnGap: 10,
    alignItems: 'start',
    width: 'min(420px, calc(100vw - 24px))',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${colors.border}`,
    background: colors.background,
    color: 'var(--hud-text-1)',
    boxShadow: 'var(--hud-shadow-lg)',
    backdropFilter: 'var(--hud-blur)',
    WebkitBackdropFilter: 'var(--hud-blur)',
    fontFamily: 'var(--weft-font-sans)',
  };

  return (
    <div
      data-testid="hud-issue-toast"
      data-severity={issue.severity}
      data-source={issue.source}
      data-reason={issue.reason}
      role={colors.role}
      aria-live={colors.role === 'alert' ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={rootStyle}
    >
      <span
        aria-hidden="true"
        style={{
          color: colors.accent,
          fontFamily: 'var(--weft-font-mono)',
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.2,
          marginTop: 1,
        }}
      >
        {colors.icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1.3 }}>{issue.title}</div>
        <div
          style={{
            marginTop: 2,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--hud-text-3)',
          }}
        >
          From {sourceLabel}
        </div>
        <div style={{ marginTop: 3, fontSize: 'var(--text-xs)', color: 'var(--hud-text-2)', lineHeight: 1.45 }}>
          {truncateDetail(issue.detail)}
        </div>
        <div style={{ marginTop: 3, fontSize: 'var(--text-xs)', color: 'var(--hud-text-2)', lineHeight: 1.45 }}>
          <strong style={{ fontWeight: 600 }}>Next:</strong> {issue.nextAction}
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 0,
          background: 'transparent',
          color: 'var(--hud-text-3)',
          cursor: 'pointer',
          padding: 0,
          marginTop: 1,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
