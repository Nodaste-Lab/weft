// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Textarea } from '../textarea';
import { Switch } from '../switch';

/**
 * Layer-parity mechanism pins. jsdom does no layout, so what a React-side
 * test can honestly assert is the MECHANISM: the class resolves through the
 * shared token, or carries the designed geometry — while the painted proof
 * lives with the plain-layer suites reading the same source. Each pin exists
 * because its absence shipped: the parity matrix claimed both cells while
 * React carried a fixed pixel the tokens had left behind.
 */
describe('the React layer rides the shared contract', () => {
  it('Textarea’s floor resolves through --weft-textarea-min-h, not a fixed class', () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    const el = container.querySelector('textarea')!;
    expect(el.className).toContain('min-h-[var(--weft-textarea-min-h');
    expect(el.className, 'the fixed floor must not return').not.toMatch(/\bmin-h-16\b/);
  });

  it('Switch carries document B’s 40×24 control box — the 24px floor bare', () => {
    const { container } = render(<Switch aria-label="Notifications" />);
    const root = container.querySelector('[data-slot="switch"]')!;
    expect(root.className).toMatch(/\bh-6\b/);
    expect(root.className).toMatch(/\bw-10\b/);
    expect(root.className, 'the under-floor height must not return').not.toContain('h-[1.15rem]');
  });
});
