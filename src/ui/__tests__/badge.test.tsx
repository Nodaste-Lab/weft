// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../badge';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

describe('Badge', () => {
  it('renders default badge', () => {
    const { container } = render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expectNoRawColors(container);
  });

  it('GUARD: count variant renders with mono font class', () => {
    const { container } = render(<Badge variant="count">42</Badge>);
    expect(container.querySelector('[data-slot="badge"]')).toHaveClass('font-mono');
  });

  it('GUARD: space variant renders without explicit border', () => {
    const { container } = render(<Badge variant="space">acme-corp</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).not.toBeNull();
    expect(badge?.className).toContain('border-transparent');
  });

  it('GUARD: status variant renders border-current for toned badges', () => {
    const { container } = render(
      <Badge variant="status" tone="stop">BLOCKED</Badge>,
    );
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge?.className).toContain('border-current');
  });

  it('GUARD: stop/warn/ok tones apply weft-token class refs', () => {
    (['stop', 'warn', 'ok'] as const).forEach((tone) => {
      const { container } = render(<Badge variant="outline" tone={tone}>{tone}</Badge>);
      expect(container.querySelector('[data-slot="badge"]')?.className).toContain('weft-stop'.replace('stop', tone === 'stop' ? 'stop' : tone === 'warn' ? 'warn' : 'ok'));
    });
  });

  it('is accessible in outline variant', async () => {
    const { container } = render(<Badge variant="outline" tone="info">Info</Badge>);
    await expectA11yClean(container);
  });
});
