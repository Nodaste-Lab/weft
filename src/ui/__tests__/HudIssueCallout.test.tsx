// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HudIssueCallout } from '../HudIssueCallout';
import type { HudIssue } from '../hud-issue-contract';

const baseIssue: HudIssue = {
  reason: 'fetch_failed',
  source: 'ccore',
  scope: 'panel',
  severity: 'error',
  title: 'Could not load signals',
  detail: 'Sprite HUD reached C-Core but the request failed: HTTP 500',
  nextAction: 'Use Refresh to try again.',
};

describe('HudIssueCallout', () => {
  it('renders the title, detail, source label, and next action', () => {
    render(<HudIssueCallout issue={baseIssue} />);

    expect(screen.getByText(/Could not load signals/)).toBeInTheDocument();
    expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    expect(screen.getAllByText(/C-Core/).length).toBeGreaterThan(0);
    expect(screen.getByText(/From C-Core/i)).toBeInTheDocument();
    expect(screen.getByText(/Refresh to try again/)).toBeInTheDocument();
  });

  it('uses role="alert" for error severity', () => {
    render(<HudIssueCallout issue={baseIssue} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('uses role="status" for info severity to stay low-noise', () => {
    render(
      <HudIssueCallout
        issue={{ ...baseIssue, severity: 'info' }}
      />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders the preserved-state note when provided', () => {
    render(
      <HudIssueCallout
        issue={{
          ...baseIssue,
          preservedStateNote: 'Previously loaded signals are still visible.',
        }}
      />
    );
    expect(screen.getByText(/still visible/i)).toBeInTheDocument();
  });

  it('renders in the compact variant for row-action scope by default', () => {
    render(
      <HudIssueCallout
        issue={{
          ...baseIssue,
          scope: 'row-action',
          severity: 'error',
          title: 'Could not acknowledge',
          detail: 'Mock rejected the request.',
          nextAction: 'Try again.',
        }}
      />
    );

    const callout = screen.getByTestId('hud-issue-callout');
    expect(callout).toHaveAttribute('data-variant', 'compact');
  });

  it('honors an explicit variant prop over the scope default', () => {
    render(
      <HudIssueCallout
        issue={{ ...baseIssue, scope: 'panel' }}
        variant="compact"
      />
    );

    const callout = screen.getByTestId('hud-issue-callout');
    expect(callout).toHaveAttribute('data-variant', 'compact');
  });

  it('exposes the severity and reason on the root element for styling hooks', () => {
    render(<HudIssueCallout issue={baseIssue} />);
    const callout = screen.getByTestId('hud-issue-callout');
    expect(callout).toHaveAttribute('data-severity', 'error');
    expect(callout).toHaveAttribute('data-reason', 'fetch_failed');
    expect(callout).toHaveAttribute('data-source', 'ccore');
  });

  it('renders a retry action button when one is provided', async () => {
    let clicked = 0;
    render(
      <HudIssueCallout
        issue={baseIssue}
        action={{ label: 'Retry', onClick: () => { clicked += 1; } }}
      />
    );
    const btn = screen.getByRole('button', { name: /retry/i });
    btn.click();
    expect(clicked).toBe(1);
  });

  it('omits the preserved state block when no note is provided', () => {
    render(<HudIssueCallout issue={baseIssue} />);
    expect(screen.queryByTestId('hud-issue-preserved')).not.toBeInTheDocument();
  });
});
