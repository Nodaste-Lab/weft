// @vitest-environment jsdom
// D3 GUARD: dense mode and trailingLink slot
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionButtonRow } from '../action-button-row';
import { Button } from '../button';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('ActionButtonRow', () => {
  it('renders accessible grouped actions', async () => {
    const { container } = render(
      <ActionButtonRow aria-label="Panel actions">
        <Button type="button">Copy</Button>
        <Button type="button" variant="secondary">Email</Button>
      </ActionButtonRow>,
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    await expectA11yClean(container);
  });

  it('GUARD D3: dense prop sets data-dense attribute', () => {
    const { container } = render(
      <ActionButtonRow dense>
        <Button type="button">Act</Button>
      </ActionButtonRow>,
    );
    expect(container.querySelector('[data-slot="action-button-row"]')).toHaveAttribute('data-dense', 'true');
  });

  it('GUARD D3: trailingLink is pushed to trailing edge', () => {
    const { container } = render(
      <ActionButtonRow dense trailingLink={<a href="#">View all</a>}>
        <Button type="button">Primary</Button>
      </ActionButtonRow>,
    );
    const row = container.querySelector('[data-slot="action-button-row"]');
    // trailingLink wraps in ml-auto span as the last child
    const lastChild = row?.lastElementChild;
    expect(lastChild?.className).toContain('ml-auto');
    expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument();
  });
});
