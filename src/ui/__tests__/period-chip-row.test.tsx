// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PeriodChipRow } from '../period-chip-row';

describe('PeriodChipRow', () => {
  it('renders slot wrapper', () => {
    const { container } = render(<PeriodChipRow>chip</PeriodChipRow>);
    expect(container.querySelector('[data-slot="period-chip-row"]')).not.toBeNull();
    expect(screen.getByText('chip')).toBeInTheDocument();
  });
});
