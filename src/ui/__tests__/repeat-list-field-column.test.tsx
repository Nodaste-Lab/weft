// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RepeatListFieldColumn } from '../repeat-list-field-column';

describe('RepeatListFieldColumn', () => {
  it('renders label text and associates slot', () => {
    const { container } = render(
      <RepeatListFieldColumn label="Quantity">
        <input aria-label="qty" />
      </RepeatListFieldColumn>,
    );
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="repeat-list-field-column"]')).not.toBeNull();
  });
});
