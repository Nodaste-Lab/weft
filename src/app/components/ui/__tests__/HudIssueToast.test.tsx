// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HudIssueToast } from '../HudIssueToast';
import type { HudIssue } from '../../../runtime/hudIssue';
import type { HudIssueToastAction } from '../../../runtime/hudIssueToastActions';

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

  it('renders and dispatches toast actions', () => {
    const onAction = vi.fn();
    const actions: HudIssueToastAction[] = [
      { kind: 'support-bundle', label: 'Export support bundle' },
      { kind: 'open-settings', section: 'spaces', label: 'Report in Spaces' },
    ];

    render(
      <HudIssueToast
        issue={issue}
        actions={actions}
        onAction={onAction}
        onDismiss={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /export support bundle/i }));
    fireEvent.click(screen.getByRole('button', { name: /report in spaces/i }));

    expect(onAction).toHaveBeenNthCalledWith(1, actions[0]);
    expect(onAction).toHaveBeenNthCalledWith(2, actions[1]);
  });

  it('shows action feedback copy', () => {
    render(
      <HudIssueToast
        issue={issue}
        statusCopy="Follow the save dialog."
        errorCopy="Support bundle export is available in the Heddle desktop app."
        onDismiss={() => {}}
      />,
    );

    expect(screen.getByText('Follow the save dialog.')).toBeInTheDocument();
    expect(screen.getAllByRole('alert').some((node) => /support bundle export/i.test(node.textContent ?? ''))).toBe(true);
  });
});
