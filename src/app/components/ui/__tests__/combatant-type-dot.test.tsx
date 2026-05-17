// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CombatantTypeDot } from '../combatant-type-dot';

describe('CombatantTypeDot', () => {
  it('exposes data-slot and data-type attributes for each combatant kind', () => {
    const kinds = ['enemy', 'ally', 'player'] as const;
    for (const kind of kinds) {
      const { container, unmount } = render(<CombatantTypeDot type={kind} />);
      const dot = container.querySelector('[data-slot="combatant-type-dot"]');
      expect(dot).not.toBeNull();
      expect(dot).toHaveAttribute('data-type', kind);
      unmount();
    }
  });

  it('defaults to xs (7px) size class', () => {
    const { container } = render(<CombatantTypeDot type="enemy" />);
    const dot = container.querySelector('[data-slot="combatant-type-dot"]');
    expect(dot?.className).toMatch(/size-\[7px\]/);
  });

  it('wraps in a pulsing 8x8 container when pulsing is true', () => {
    const { container } = render(<CombatantTypeDot type="enemy" pulsing />);
    const dot = container.querySelector('[data-slot="combatant-type-dot"]');
    expect(dot).toHaveAttribute('data-pulsing', 'true');
    expect(dot?.className).toMatch(/size-\[8px\]/);
  });

  it('renders the sm variant at 8px', () => {
    const { container } = render(<CombatantTypeDot type="player" size="sm" />);
    const dot = container.querySelector('[data-slot="combatant-type-dot"]');
    expect(dot?.className).toMatch(/size-\[8px\]/);
  });
});
