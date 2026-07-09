// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Steps, type StepsItemData } from '../steps';

const steps: StepsItemData[] = [
  {
    id: 'source',
    label: 'Choose source',
    description: 'Pick the vault note or transcript to process.',
    status: 'complete',
    meta: 'Done',
  },
  {
    id: 'review',
    label: 'Review draft',
    description: 'Check citations and next steps.',
    status: 'current',
    meta: 'Active draft',
  },
  {
    id: 'share',
    label: 'Share summary',
    description: 'Send the final handoff.',
    status: 'pending',
  },
  {
    id: 'sync',
    label: 'Sync to vault',
    description: 'Blocked until the vault reconnects.',
    status: 'error',
  },
];

describe('Steps', () => {
  it('renders a labeled ordered list with items in source order', () => {
    const { container } = render(<Steps aria-label="Briefing progress" items={steps} />);

    const list = screen.getByRole('list', { name: 'Briefing progress' });
    const items = screen.getAllByRole('listitem');

    expect(list).toHaveAttribute('data-slot', 'steps');
    expect(items).toHaveLength(4);
    expect(within(items[0]).getByText('Choose source')).toBeInTheDocument();
    expect(within(items[1]).getByText('Review draft')).toBeInTheDocument();
    expect(within(items[2]).getByText('Share summary')).toBeInTheDocument();
    expect(within(items[3]).getByText('Sync to vault')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="steps-item"]')).toHaveLength(4);
  });

  it('marks the current step with aria-current', () => {
    render(<Steps aria-label="Briefing progress" items={steps} />);

    const current = screen.getByText('Review draft').closest('[data-slot="steps-item"]');

    expect(current).toHaveAttribute('aria-current', 'step');
    expect(current).toHaveAttribute('data-status', 'current');
  });

  it('exposes every supported status through data attributes', () => {
    const { container } = render(<Steps aria-label="Briefing progress" items={steps} />);

    for (const status of ['complete', 'current', 'pending', 'error']) {
      expect(container.querySelector(`[data-status="${status}"]`)).not.toBeNull();
    }
  });

  it('supports vertical and horizontal orientations', () => {
    const { container, rerender } = render(
      <Steps aria-label="Vertical steps" items={steps} orientation="vertical" />,
    );

    expect(container.querySelector('[data-slot="steps"]')).toHaveAttribute('data-orientation', 'vertical');

    rerender(<Steps aria-label="Horizontal steps" items={steps} orientation="horizontal" />);

    expect(container.querySelector('[data-slot="steps"]')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders descriptions and metadata without making items interactive', () => {
    const { container } = render(<Steps aria-label="Briefing progress" items={steps} />);

    expect(screen.getByText('Check citations and next steps.')).toHaveAttribute('data-slot', 'steps-item-description');
    expect(screen.getByText('Active draft')).toHaveAttribute('data-slot', 'steps-item-meta');
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });

  it('renders an empty labeled ordered list without placeholder copy', () => {
    render(<Steps aria-label="Empty progress" items={[]} />);

    expect(screen.getByRole('list', { name: 'Empty progress' })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText(/empty|no steps/i)).not.toBeInTheDocument();
  });
});
