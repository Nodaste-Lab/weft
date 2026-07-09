// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AddItemButton } from '../add-item-button';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('AddItemButton', () => {
  it('renders an accessible add trigger', async () => {
    const onClick = vi.fn();
    const { container } = render(<AddItemButton onClick={onClick}>Add tag</AddItemButton>);

    fireEvent.click(screen.getByRole('button', { name: 'Add tag' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    await expectA11yClean(container);
  });
});
