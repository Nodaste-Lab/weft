// @vitest-environment jsdom
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
});
