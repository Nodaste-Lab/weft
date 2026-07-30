// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../empty-state';
import { Button } from '../button';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

describe('EmptyState', () => {
  it('renders accessible empty copy and action slot (centered default)', async () => {
    const { container } = render(
      <EmptyState
        title="No notes yet"
        description="Create a note to start capturing context."
        action={<Button type="button">Create note</Button>}
      />,
    );

    expect(screen.getByText('No notes yet')).toBeInTheDocument();
    expectNoRawColors(container);
    await expectA11yClean(container);
  });

  it('GUARD D9: centered variant sets data-variant="centered"', () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    expect(container.querySelector('[data-slot="empty-state"]')).toHaveAttribute('data-variant', 'centered');
  });

  it('GUARD D9: notice variant is left-aligned and renders inline structure', async () => {
    const { container } = render(
      <EmptyState
        variant="notice"
        title="Fetch failed"
        description="Could not reach the API. Retry below."
        action={<Button size="dense" type="button">Retry</Button>}
      />,
    );
    const root = container.querySelector('[data-slot="empty-state"]');
    expect(root).toHaveAttribute('data-variant', 'notice');
    expect(screen.getByText('Fetch failed')).toBeInTheDocument();
    expectNoRawColors(container);
    await expectA11yClean(container);
  });

  it('REGRESSION D9: centered variant still centers text and does not render dashed border', () => {
    const { container } = render(<EmptyState title="All clear" variant="centered" />);
    const root = container.querySelector('[data-slot="empty-state"]');
    expect(root?.className).toContain('text-center');
    expect(root?.className).not.toContain('border-dashed');
  });
});
