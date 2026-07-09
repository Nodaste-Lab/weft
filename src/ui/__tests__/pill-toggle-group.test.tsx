// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PillToggleGroup, PillToggleGroupItem } from '../pill-toggle-group';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('PillToggleGroup', () => {
  it('renders radio semantics and calls onValueChange', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <PillToggleGroup value="today" onValueChange={onValueChange} aria-label="Range">
        <PillToggleGroupItem value="today">Today</PillToggleGroupItem>
        <PillToggleGroupItem value="week">Week</PillToggleGroupItem>
      </PillToggleGroup>,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Week' }));

    expect(screen.getByRole('radio', { name: 'Today' })).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenCalledWith('week');
    await expectA11yClean(container);
  });
});
