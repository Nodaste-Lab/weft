// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dot } from '../dot';

describe('Dot', () => {
  it('renders data-slot', () => {
    const { container } = render(<Dot />);
    expect(container.querySelector('[data-slot="dot"]')).toBeTruthy();
  });

  it('renders each semantic tone', () => {
    for (const tone of ['ok', 'warn', 'stop', 'info'] as const) {
      const { container } = render(<Dot tone={tone} />);
      const el = container.querySelector('[data-slot="dot"]');
      expect(el).toHaveAttribute('data-tone', tone);
    }
  });

  it('defaults to the muted tone when none is given', () => {
    const { container } = render(<Dot />);
    expect(container.querySelector('[data-slot="dot"]')).toHaveAttribute('data-tone', 'muted');
  });

  // GUARD (a11y): decorative by default. The adjacent label carries the meaning,
  // so an unlabelled dot must not be announced.
  it('is decorative by default — aria-hidden, no accessible name', () => {
    const { container } = render(<Dot tone="stop" />);
    const el = container.querySelector('[data-slot="dot"]')!;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('aria-label');
  });

  // GUARD (a11y): colour must never be the only signal. When the dot is the only
  // carrier of meaning, a label promotes it to an announced img.
  it('becomes an announced img when a label is supplied', () => {
    render(<Dot tone="warn" label="Needs a response" />);
    const el = screen.getByRole('img', { name: 'Needs a response' });
    expect(el).toHaveAttribute('data-slot', 'dot');
    expect(el).not.toHaveAttribute('aria-hidden');
  });

  it('renders inline so it does not disturb adjacent text flow', () => {
    const { container } = render(<Dot />);
    expect(container.querySelector('[data-slot="dot"]')?.className).toMatch(/inline-block/);
  });

  it('forwards className and arbitrary span props', () => {
    const { container } = render(<Dot className="ml-2" data-testid="d" />);
    const el = container.querySelector('[data-slot="dot"]')!;
    expect(el.className).toMatch(/ml-2/);
    expect(el).toHaveAttribute('data-testid', 'd');
  });
});
