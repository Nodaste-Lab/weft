// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HudListRow } from '../hud-list-row';

describe('HudListRow', () => {
  it('renders data-slot on div by default', () => {
    const { container } = render(
      <HudListRow leading={<span>L</span>} trailing={<span>T</span>}>
        body
      </HudListRow>
    );
    expect(container.querySelector('[data-slot="hud-list-row"]')).toBeTruthy();
  });

  it('renders as button when as="button"', () => {
    const onClick = vi.fn();
    render(
      <HudListRow as="button" type="button" onClick={onClick} aria-label="Open row">
        press me
      </HudListRow>
    );
    const btn = screen.getByRole('button', { name: 'Open row' });
    expect(btn).toHaveAttribute('data-slot', 'hud-list-row');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies bodyClassName to hud-list-row-body', () => {
    const { container } = render(
      <HudListRow bodyClassName="gap-[7px]">x</HudListRow>
    );
    const body = container.querySelector('[data-slot="hud-list-row-body"]');
    expect(body?.className).toMatch(/gap-\[7px\]/);
  });
});
