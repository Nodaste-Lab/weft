// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusIconRow } from '../status-icon-row';

describe('StatusIconRow', () => {
  it('renders title, detail, and a status role', () => {
    render(
      <StatusIconRow
        icon={<span data-testid="row-icon">i</span>}
        title="ccore sync connected"
        detail="Account alyx"
      />,
    );

    expect(screen.getByText('ccore sync connected')).toBeInTheDocument();
    expect(screen.getByText('Account alyx')).toBeInTheDocument();
    expect(screen.getByTestId('row-icon')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('exposes data-slot, data-tone, and data-density attributes for adoption tests', () => {
    const { container } = render(
      <StatusIconRow
        icon={<span aria-hidden />}
        title="needs attention"
        tone="warning"
        density="default"
      />,
    );

    const row = container.querySelector('[data-slot="status-icon-row"]');
    expect(row).not.toBeNull();
    expect(row).toHaveAttribute('data-tone', 'warning');
    expect(row).toHaveAttribute('data-density', 'default');
  });

  it('supports every tone variant', () => {
    const tones = ['success', 'warning', 'danger', 'muted', 'info'] as const;
    for (const tone of tones) {
      const { container, unmount } = render(
        <StatusIconRow icon={<span aria-hidden />} title={`tone-${tone}`} tone={tone} />,
      );
      const row = container.querySelector('[data-slot="status-icon-row"]');
      expect(row).toHaveAttribute('data-tone', tone);
      unmount();
    }
  });

  it('renders the actions slot when provided', () => {
    render(
      <StatusIconRow
        icon={<span aria-hidden />}
        title="Sign-in needs attention"
        actions={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('omits the detail slot when no detail prop is provided', () => {
    const { container } = render(
      <StatusIconRow icon={<span aria-hidden />} title="title only" />,
    );

    expect(container.querySelector('[data-slot="status-icon-row-detail"]')).toBeNull();
  });
});
