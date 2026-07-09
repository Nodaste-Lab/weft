// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../empty-state';
import { Button } from '../button';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

describe('EmptyState', () => {
  it('renders accessible empty copy and action slot', async () => {
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
});
