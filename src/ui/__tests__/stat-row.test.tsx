// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatRow } from '../stat-row';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

describe('StatRow', () => {
  it('renders a label-value pair accessibly', async () => {
    const { container } = render(<StatRow label="Sources" value="8" hint="indexed" />);

    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expectNoRawColors(container);
    await expectA11yClean(container);
  });

  it('GUARD D2: board variant renders data-variant="board"', () => {
    const { container } = render(<StatRow variant="board" label="Status" value="OK" />);
    expect(container.querySelector('[data-slot="stat-row"]')).toHaveAttribute('data-variant', 'board');
  });

  it('GUARD D2: leading slot renders before the label in board variant', () => {
    const { container } = render(
      <StatRow variant="board" label="Status" value="OK" leading={<span data-testid="dot" />} />,
    );
    const row = container.querySelector('[data-slot="stat-row"]');
    expect(row?.firstElementChild?.querySelector('[data-testid="dot"]')).toBeTruthy();
  });
});
