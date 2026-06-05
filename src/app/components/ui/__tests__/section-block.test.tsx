// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionBlock } from '../section-block';
import { SectionItem } from '../section-item';

const sections = [
  {
    id: 'summary',
    label: 'Summary',
    meta: '2 notes',
    content: <p>Generated summary stays reviewable.</p>,
  },
  {
    id: 'risks',
    label: 'Risks',
    meta: '1 blocker',
    content: <p>Vault sync is stale.</p>,
  },
];

describe('Section generated-response components', () => {
  it('renders a labeled section block that composes section items', () => {
    const { container } = render(
      <SectionBlock
        aria-label="Generated sections"
        title="Generated brief"
        description="Grouped output for review."
        items={sections}
      />,
    );

    const block = screen.getByRole('region', { name: 'Generated sections' });
    const list = screen.getByRole('list', { name: 'Generated brief' });
    const items = screen.getAllByRole('listitem');

    expect(block).toHaveAttribute('data-slot', 'section-block');
    expect(list).toHaveAttribute('data-slot', 'section-block-list');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-slot', 'section-item');
    expect(items[0]).toHaveAttribute('data-item-id', 'summary');
    expect(container.querySelectorAll('[data-slot="section-item"]')).toHaveLength(2);
  });

  it('uses collapsible trigger semantics for item content', () => {
    render(
      <ul aria-label="One section">
        <SectionItem
          id="summary"
          label="Summary"
          meta="2 notes"
          content={<p>Generated summary stays reviewable.</p>}
        />
      </ul>,
    );

    const item = screen.getByRole('listitem');
    const trigger = screen.getByRole('button', { name: /Summary/ });

    expect(item).toHaveAttribute('data-slot', 'section-item');
    expect(item).toHaveAttribute('data-open', 'false');
    expect(screen.queryByText('Generated summary stays reviewable.')).not.toBeVisible();

    fireEvent.click(trigger);

    expect(item).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('Generated summary stays reviewable.')).toBeVisible();
    expect(within(item).getByText('2 notes')).toHaveAttribute('data-slot', 'section-item-meta');
  });

  it('renders an empty section block without invented placeholder copy', () => {
    render(<SectionBlock aria-label="Empty generated sections" title="Generated brief" items={[]} />);

    expect(screen.getByRole('region', { name: 'Empty generated sections' })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText(/empty|no sections/i)).not.toBeInTheDocument();
  });
});
