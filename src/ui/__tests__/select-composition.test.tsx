// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import { SelectFieldSpecimen } from '../../gallery/specimens/inputs';

describe('public Select cutout composition', () => {
  it('names the actual trigger and orders only rendered feedback', async () => {
    const { container, rerender } = render(<SelectFieldSpecimen required error="Choose a key type." status="Saving." description="Credential scope." />);
    const trigger = screen.getByRole('combobox', { name: 'Key type (required)' });
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger.getAttribute('aria-describedby')?.split(' ').map(id => document.getElementById(id)?.textContent)).toEqual(['Choose a key type.', 'Saving.', 'Credential scope.']);
    expect((await axe(container)).violations).toEqual([]);
    rerender(<SelectFieldSpecimen />);
    expect(screen.getByRole('combobox', { name: 'Key type' })).not.toHaveAttribute('aria-describedby');
    expect(container.querySelector('.weft-selection-help')).toBeNull();
  });
  it('retains native name/value submission and disabled exclusion', () => {
    const { container, rerender } = render(<form><SelectFieldSpecimen /></form>);
    expect(new FormData(container.querySelector('form')!).get('keyType')).toBe('personal');
    rerender(<form><SelectFieldSpecimen disabled /></form>);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(new FormData(container.querySelector('form')!).has('keyType')).toBe(false);
  });
  it('opens known options by keyboard without a search field', async () => {
    render(<SelectFieldSpecimen />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(await screen.findByRole('option', { name: 'Workspace API key' })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});
