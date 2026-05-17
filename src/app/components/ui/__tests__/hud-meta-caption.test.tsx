// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HudMetaCaption } from '../hud-meta-caption';

describe('HudMetaCaption', () => {
  it('renders muted caption slot with relative-time content', () => {
    render(<HudMetaCaption>3h ago</HudMetaCaption>);
    const el = screen.getByText('3h ago');
    expect(el).toHaveAttribute('data-slot', 'hud-meta-caption');
    expect(el.tagName.toLowerCase()).toBe('span');
  });
});
