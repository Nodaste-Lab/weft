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
});
