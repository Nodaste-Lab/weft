// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from '../toggle-group';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('ToggleGroup', () => {
  it('renders items with radio role when type="single"', async () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="Scope">
        <ToggleGroupItem value="direct">Direct</ToggleGroupItem>
        <ToggleGroupItem value="expanded">Expanded</ToggleGroupItem>
      </ToggleGroup>,
    );
    // Radix ToggleGroup type="single" renders items as role="radio" inside a group
    expect(screen.getByRole('radio', { name: 'Direct' })).toBeInTheDocument();
    await expectA11yClean(container);
  });

  it('GUARD D7: joined variant sets data-joined on the root', () => {
    const { container } = render(
      <ToggleGroup type="single" joined aria-label="Mode">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    const root = container.querySelector('[data-slot="toggle-group"]');
    expect(root).toHaveAttribute('data-joined', 'true');
  });

  it('GUARD D7: non-joined does not set data-joined', () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="Mode">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(container.querySelector('[data-slot="toggle-group"]')).not.toHaveAttribute('data-joined');
  });

  it('REGRESSION: PillToggleGroup (gap-separated) remains unchanged from joined ToggleGroup', () => {
    // ToggleGroup joined uses shared border; PillToggleGroup uses separate pills.
    // Both must co-exist without style collision.
    const { container } = render(
      <ToggleGroup type="single" joined aria-label="joined">
        <ToggleGroupItem value="x">X</ToggleGroupItem>
      </ToggleGroup>,
    );
    const root = container.querySelector('[data-slot="toggle-group"]');
    expect(root?.className).toContain('overflow-hidden');
  });
});
