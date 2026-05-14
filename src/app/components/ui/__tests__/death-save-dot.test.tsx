// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeathSaveDot } from '../death-save-dot';

describe('DeathSaveDot', () => {
  it('exposes data-slot and data-kind for each variant', () => {
    const kinds = ['success', 'fail'] as const;
    for (const kind of kinds) {
      const { container, unmount } = render(<DeathSaveDot kind={kind} filled />);
      const dot = container.querySelector('[data-slot="death-save-dot"]');
      expect(dot).not.toBeNull();
      expect(dot).toHaveAttribute('data-kind', kind);
      unmount();
    }
  });

  it('reflects the filled vs empty state via data-state', () => {
    const { container, rerender } = render(<DeathSaveDot kind="success" filled />);
    const dot = container.querySelector('[data-slot="death-save-dot"]');
    expect(dot).toHaveAttribute('data-state', 'filled');
    rerender(<DeathSaveDot kind="success" filled={false} />);
    expect(dot).toHaveAttribute('data-state', 'empty');
  });

  it('renders at the canonical 8px metric', () => {
    const { container } = render(<DeathSaveDot kind="fail" filled />);
    const dot = container.querySelector('[data-slot="death-save-dot"]');
    expect(dot?.className).toMatch(/size-\[8px\]/);
  });
});
