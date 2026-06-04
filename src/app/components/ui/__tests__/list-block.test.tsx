// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListBlock } from '../list-block';
import { ListItem } from '../list-item';

const options = [
  {
    id: 'brief',
    label: 'Create brief',
    detail: 'Draft a concise summary.',
  },
  {
    id: 'tasks',
    label: 'Extract tasks',
    detail: 'Find follow-up actions.',
    selected: true,
  },
];

describe('List generated-response components', () => {
  it('renders a labeled list block that composes list items', () => {
    const { container } = render(
      <ListBlock
        aria-label="Generated options"
        title="Choose an output"
        description="Generated options stay explicit."
        items={options}
      />,
    );

    const block = screen.getByRole('region', { name: 'Generated options' });
    const list = screen.getByRole('list', { name: 'Choose an output' });
    const items = screen.getAllByRole('listitem');

    expect(block).toHaveAttribute('data-slot', 'list-block');
    expect(list).toHaveAttribute('data-slot', 'list-block-list');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-slot', 'list-item');
    expect(items[1]).toHaveAttribute('data-selected', 'true');
    expect(container.querySelectorAll('[data-slot="list-item"]')).toHaveLength(2);
  });

  it('uses button semantics only when an action handler is provided', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <ul aria-label="Action item">
        <ListItem id="brief" label="Create brief" detail="Draft a concise summary." onSelect={onSelect} />
      </ul>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create brief' }));
    expect(onSelect).toHaveBeenCalledWith('brief');

    rerender(
      <ul aria-label="Display item">
        <ListItem id="display" label="Display only" detail="No action attached." />
      </ul>,
    );

    expect(screen.getByRole('listitem')).toHaveAttribute('data-interactive', 'false');
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders detail, selected, disabled, and empty states predictably', () => {
    render(
      <ListBlock
        aria-label="Mixed options"
        title="Generated choices"
        items={[
          { id: 'selected', label: 'Selected choice', detail: 'Already chosen.', selected: true },
          { id: 'disabled', label: 'Disabled choice', detail: 'Unavailable.', disabled: true },
        ]}
      />,
    );

    const selected = screen.getByText('Selected choice').closest('[data-slot="list-item"]');
    const disabled = screen.getByText('Disabled choice').closest('[data-slot="list-item"]');

    expect(selected).toHaveAttribute('data-selected', 'true');
    expect(disabled).toHaveAttribute('data-disabled', 'true');
    expect(within(disabled as HTMLElement).getByText('Unavailable.')).toHaveAttribute('data-slot', 'list-item-detail');
  });

  it('renders an empty list block without invented placeholder copy', () => {
    render(<ListBlock aria-label="Empty generated options" title="Choices" items={[]} />);

    expect(screen.getByRole('region', { name: 'Empty generated options' })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText(/empty|no options|no items/i)).not.toBeInTheDocument();
  });
});
