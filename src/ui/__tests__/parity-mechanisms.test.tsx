// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
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

  it('the disabled dashed boundary rides the same variant in all three text controls', () => {
    // The owner's visual pass: a dimmed fill separates by measurement, not by
    // glance. Disabled carries the HUD's dashed unavailable stroke — plain
    // CSS via :disabled (painted and asserted in the contract suite), React
    // via the disabled: variant pinned here.
    const { container } = render(<Textarea aria-label="Notes" disabled />);
    expect(container.querySelector('textarea')!.className).toContain('disabled:border-dashed');
  });

  it('Switch carries document B’s 40×24 control box — the 24px floor bare', () => {
    const { container } = render(<Switch aria-label="Notifications" />);
    const root = container.querySelector('[data-slot="switch"]')!;
    expect(root.className).toMatch(/\bh-6\b/);
    expect(root.className).toMatch(/\bw-10\b/);
    expect(root.className, 'the under-floor height must not return').not.toContain('h-[1.15rem]');
  });
});

describe('an unavailable SelectItem is struck through, not merely dimmed', () => {
  // Radix Select needs three DOM APIs jsdom lacks; shimmed here, narrowly.
  beforeAll(() => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});
    Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture ?? (() => false);
  });

  it('carries the line-through variant alongside the dimming', async () => {
    const { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } = await import(
      '../select'
    );
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Retention" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30">Thirty days</SelectItem>
          <SelectItem value="forever" disabled>
            Forever (plan limit)
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    const items = document.querySelectorAll('[data-slot="select-item"]');
    expect(items.length).toBe(2);
    const disabled = [...items].find((i) => i.getAttribute('data-disabled') !== null)!;
    expect(disabled, 'the disabled item must exist').toBeTruthy();
    expect(disabled.className).toContain('data-[disabled]:line-through');
    const enabled = [...items].find((i) => i.getAttribute('data-disabled') === null)!;
    expect(enabled.className, 'the variant is disabled-gated, so it is fine here too').toContain(
      'data-[disabled]:line-through',
    );
  });
});
