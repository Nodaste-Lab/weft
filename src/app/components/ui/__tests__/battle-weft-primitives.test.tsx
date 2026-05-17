// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BattleCombatantSummaryRow } from '../battle-combatant-summary-row';
import { CommandCategoryTag } from '../command-category-tag';
import { ConditionChipStrip } from '../condition-chip-strip';
import { HudQuickCommandFooter } from '../hud-quick-command-footer';

describe('Battle Tracker Weft primitives', () => {
  it('BattleCombatantSummaryRow exposes data-slot', () => {
    const { container } = render(
      <BattleCombatantSummaryRow
        initiative={12}
        name="Test"
        combatantType="enemy"
        isActive={false}
        isOnDeck={false}
        isDead={false}
        ac={14}
        onReorderUp={() => {}}
        onReorderDown={() => {}}
        onRemove={vi.fn()}
        disableReorderUp
        disableReorderDown
      />,
    );
    expect(container.querySelector('[data-slot="battle-combatant-summary-row"]')).toBeTruthy();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('CommandCategoryTag exposes data-slot', () => {
    const { container } = render(<CommandCategoryTag tone="danger">X</CommandCategoryTag>);
    expect(container.querySelector('[data-slot="command-category-tag"]')).toBeTruthy();
  });

  it('ConditionChipStrip exposes data-slot', () => {
    const { container } = render(<ConditionChipStrip>child</ConditionChipStrip>);
    expect(container.querySelector('[data-slot="condition-chip-strip"]')).toBeTruthy();
  });

  it('HudQuickCommandFooter exposes data-slot', () => {
    const { container } = render(
      <HudQuickCommandFooter>
        <span>inner</span>
      </HudQuickCommandFooter>,
    );
    expect(container.querySelector('[data-slot="hud-quick-command-footer"]')).toBeTruthy();
  });
});
