// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModeOnlyToggle } from '../mode-only-toggle';
import { ProviderStatusBadge } from '../provider-status-badge';

describe('Session Context Weft primitives', () => {
  it('ModeOnlyToggle exposes data-slot', () => {
    const { container } = render(
      <ModeOnlyToggle active label="Scope" onToggle={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="mode-only-toggle"]')).toBeTruthy();
  });

  it('ProviderStatusBadge exposes data-slot', () => {
    const { container } = render(<ProviderStatusBadge status="available" />);
    expect(container.querySelector('[data-slot="provider-status-badge"]')).toBeTruthy();
  });
});
