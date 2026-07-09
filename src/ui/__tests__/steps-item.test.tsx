// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepsItem, type StepsStatus } from '../steps-item';

function renderStepItem(status: StepsStatus = 'current') {
  return render(
    <ol aria-label="Single step">
      <StepsItem
        id="review"
        index={1}
        label="Review draft"
        description="Check citations and next steps."
        status={status}
        meta="Active draft"
        showConnector
      />
    </ol>,
  );
}

describe('StepsItem', () => {
  it('renders as a semantic list item with stable data attributes', () => {
    const { container } = renderStepItem();

    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('data-slot', 'steps-item');
    expect(item).toHaveAttribute('data-status', 'current');
    expect(item).toHaveAttribute('data-step-id', 'review');
    expect(container.querySelector('[data-slot="steps-marker"]')).not.toBeNull();
  });

  it('applies aria-current only for the current step', () => {
    const { rerender } = render(
      <ol aria-label="Current step">
        <StepsItem id="review" index={1} label="Review draft" status="current" />
      </ol>,
    );

    expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'step');

    rerender(
      <ol aria-label="Pending step">
        <StepsItem id="share" index={2} label="Share summary" status="pending" />
      </ol>,
    );

    expect(screen.getByRole('listitem')).not.toHaveAttribute('aria-current');
  });

  it('supports every status with visible state text', () => {
    const statuses: Array<[StepsStatus, string]> = [
      ['complete', 'Done'],
      ['current', 'Now'],
      ['pending', 'Next'],
      ['error', 'Issue'],
    ];

    for (const [status, stateText] of statuses) {
      const { unmount } = render(
        <ol aria-label={`${status} step`}>
          <StepsItem id={status} index={0} label={`${status} label`} status={status} />
        </ol>,
      );

      const item = screen.getByRole('listitem');
      expect(item).toHaveAttribute('data-status', status);
      expect(within(item).getByText(stateText)).toHaveAttribute('data-slot', 'steps-item-state');
      unmount();
    }
  });

  it('supports orientation, density, connector, description, and metadata slots', () => {
    const { container } = render(
      <ol aria-label="Horizontal step">
        <StepsItem
          id="source"
          index={0}
          label="Choose source"
          description="Pick the transcript."
          status="complete"
          meta="Source selected"
          orientation="horizontal"
          density="compact"
          showConnector
        />
      </ol>,
    );

    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('data-orientation', 'horizontal');
    expect(item).toHaveAttribute('data-density', 'compact');
    expect(screen.getByText('Pick the transcript.')).toHaveAttribute('data-slot', 'steps-item-description');
    expect(screen.getByText('Source selected')).toHaveAttribute('data-slot', 'steps-item-meta');
    expect(container.querySelector('[data-slot="steps-connector"]')).not.toBeNull();
  });

  it('remains display-only by default', () => {
    const { container } = renderStepItem('pending');

    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });
});
