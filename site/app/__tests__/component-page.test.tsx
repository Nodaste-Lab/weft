// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ComponentPage } from '../pages/ComponentPage';

describe('ComponentPage', () => {
  it('renders the API table from the prop contract, never a stringified object', () => {
    const { container } = render(<ComponentPage id="button" />);
    expect(container.textContent).not.toContain('[object Object]');
    const api = screen.getByRole('heading', { name: 'API' });
    const section = api.parentElement as HTMLElement;
    expect(within(section).getAllByText('optional').length).toBeGreaterThan(0);
    expect(within(section).getAllByText('destructive').length).toBeGreaterThan(0);
  });

  it('shows every documentation section heading in order', () => {
    render(<ComponentPage id="button" />);
    const names = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(names).toEqual(['Example', 'Variants and states', 'Purpose', 'When to use', 'When not to use', 'How to use', 'Heuristics', 'Content', 'Accessibility', 'API', 'Related']);
  });
});
