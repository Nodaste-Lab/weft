// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HudIssueToast } from '../HudIssueToast';
import type { HudIssue } from '../../../runtime/hudIssue';

const issue: HudIssue = {
  reason: 'connection_failed',
  source: 'ccore',
  sourceLabel: 'local C-Core runtime',
  scope: 'panel',
  severity: 'error',
  title: 'Workstreams unavailable',
  detail: 'Could not connect to runtime endpoint.',
  nextAction: 'Start C-Core and retry.',
};

describe('HudIssueToast', () => {
  it('renders title, source attribution, detail, and next action', () => {
    render(<HudIssueToast issue={issue} onDismiss={() => {}} />);
    expect(screen.getByText('Workstreams unavailable')).toBeInTheDocument();
    expect(screen.getByText(/From local C-Core runtime/i)).toBeInTheDocument();
    expect(screen.getByText(/Could not connect to runtime endpoint/)).toBeInTheDocument();
    expect(screen.getByText(/Next:/)).toBeInTheDocument();
  });

  it('exposes severity and metadata on the root node', () => {
    render(<HudIssueToast issue={issue} onDismiss={() => {}} />);
    const toast = screen.getByTestId('hud-issue-toast');
    expect(toast).toHaveAttribute('data-severity', 'error');
    expect(toast).toHaveAttribute('data-source', 'ccore');
    expect(toast).toHaveAttribute('data-reason', 'connection_failed');
    expect(toast).toHaveAttribute('role', 'alert');
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<HudIssueToast issue={issue} onDismiss={onDismiss} />);
    screen.getByRole('button', { name: /dismiss notification/i }).click();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
