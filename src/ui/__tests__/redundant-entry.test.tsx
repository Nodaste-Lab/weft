// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../input';
import { SearchField } from '../search-field';

/**
 * Heuristic 8 — never re-ask (P7).
 *
 * The mechanism Weft can OWN is small and this is it: the browser's own
 * memory of previously entered values, reached through the `autocomplete`
 * vocabulary, must pass through every text primitive untouched — a wrapper
 * that eats the attribute silently disables the one re-ask defence the
 * platform provides. Everything larger (offering a value from application
 * state, cross-panel recall) is a consumer pattern the doctrine documents;
 * Weft cannot test what it does not own.
 */
describe('the autocomplete vocabulary passes through', () => {
  it('Input forwards autocomplete verbatim', () => {
    render(<Input aria-label="Email" autoComplete="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
  });

  it('SearchField forwards it too, on the real input', () => {
    render(<SearchField label="Search projects" autoComplete="off" />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('autocomplete', 'off');
  });

  it('the tier variants change nothing about it', () => {
    render(<Input aria-label="Owner" variant="underline" autoComplete="name" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'name');
  });
});
