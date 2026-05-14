// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PartyCombatantAccordion } from '../party-combatant-accordion';

describe('PartyCombatantAccordion', () => {
  it('renders data-slot; expanded content hidden when collapsed', () => {
    const { container } = render(
      <PartyCombatantAccordion expanded={false} expandRegionId="panel-1" header={<span>Hdr</span>}>
        <p>Detail</p>
      </PartyCombatantAccordion>,
    );
    expect(container.querySelector('[data-slot="party-combatant-accordion"]')).toBeTruthy();
    expect(screen.queryByText('Detail')).not.toBeInTheDocument();
  });

  it('shows region when expanded', () => {
    render(
      <PartyCombatantAccordion expanded={true} expandRegionId="x" header={<span>B</span>}>
        <p>Inner</p>
      </PartyCombatantAccordion>,
    );
    const region = document.getElementById('x');
    expect(region).toBeTruthy();
    expect(region).toHaveAttribute('role', 'region');
    expect(screen.getByText('Inner')).toBeInTheDocument();
  });

  it('header row is not a second interactive shell around header controls', () => {
    const { container } = render(
      <PartyCombatantAccordion
        expanded={false}
        header={
          <button type="button">
            Expand row
          </button>
        }
      />,
    );
    const headerRow = container.querySelector('[data-slot="party-combatant-accordion"] > div');
    expect(headerRow).not.toHaveAttribute('role', 'button');
    expect(screen.getByRole('button', { name: /expand row/i })).toBeInTheDocument();
  });
});
