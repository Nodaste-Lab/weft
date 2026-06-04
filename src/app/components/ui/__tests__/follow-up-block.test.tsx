// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FollowUpBlock } from '../follow-up-block';
import { FollowUpItem } from '../follow-up-item';

const followUps = [
  {
    id: 'summarize',
    label: 'Summarize the source note',
    detail: 'Create a short reviewable brief.',
  },
  {
    id: 'risks',
    label: 'Show risks',
    detail: 'List blockers before sharing.',
  },
];

describe('FollowUp generated-response components', () => {
  it('renders a labeled follow-up block that composes follow-up items', () => {
    const { container } = render(
      <FollowUpBlock
        aria-label="Suggested follow-ups"
        title="Suggested next prompts"
        description="Generated suggestions stay reviewable."
        items={followUps}
      />,
    );

    const block = screen.getByRole('region', { name: 'Suggested follow-ups' });
    const list = screen.getByRole('list', { name: 'Suggested next prompts' });
    const items = screen.getAllByRole('listitem');

    expect(block).toHaveAttribute('data-slot', 'follow-up-block');
    expect(list).toHaveAttribute('data-slot', 'follow-up-block-list');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-slot', 'follow-up-item');
    expect(items[0]).toHaveAttribute('data-item-id', 'summarize');
    expect(within(items[0]).getByText('Summarize the source note')).toHaveAttribute('data-slot', 'follow-up-item-label');
    expect(container.querySelectorAll('[data-slot="follow-up-item"]')).toHaveLength(2);
  });

  it('uses button semantics only when an action handler is provided', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <div role="list">
        <FollowUpItem id="act" label="Use this prompt" detail="Runs when selected." onSelect={onSelect} />
      </div>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Use this prompt' }));
    expect(onSelect).toHaveBeenCalledWith('act');

    rerender(
      <div role="list">
        <FollowUpItem id="display" label="Display only" detail="No action attached." />
      </div>,
    );

    expect(screen.getByRole('listitem')).toHaveAttribute('data-interactive', 'false');
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders an empty block without invented placeholder copy', () => {
    render(<FollowUpBlock aria-label="Empty follow-ups" title="Follow-ups" items={[]} />);

    expect(screen.getByRole('region', { name: 'Empty follow-ups' })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText(/empty|no follow/i)).not.toBeInTheDocument();
  });
});
