// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Switch } from '../switch';
import { Slider } from '../slider';

/**
 * React-to-CSS parity for switch and slider — SEMANTIC and SERIALIZATION
 * parity, not implementation parity (P7; the 2026-08-07 log correction).
 *
 * Radix Switch reaches a form through a hidden bubble input while a native
 * checkbox serializes itself; Radix Slider is array-valued and multi-thumb by
 * default while a native range has exactly one thumb. The parity claim is
 * that a consumer's FORM sees the same shape from both layers — the named
 * value present when on, ABSENT when off — and that neither layer claims
 * read-only, which native controls ignore and Radix does not implement.
 */

const ROOT = join(__dirname, '..', '..', '..');

describe('switch serialization through the form', () => {
  it('a checked Switch serializes its name; an unchecked one is ABSENT — the same shape as the native checkbox', () => {
    const { container } = render(
      <form>
        <Switch name="sw-on" defaultChecked />
        <Switch name="sw-off" />
      </form>,
    );
    const entries = Object.fromEntries(new FormData(container.querySelector('form')!).entries());
    expect(entries['sw-on']).toBe('on');
    expect(
      'sw-off' in entries,
      'absent, not falsy — the precise point where the layers can diverge with no visual difference',
    ).toBe(false);
  });

  it('toggling off removes the entry again', () => {
    const { container } = render(
      <form>
        <Switch name="sw" defaultChecked />
      </form>,
    );
    fireEvent.click(screen.getByRole('switch'));
    const entries = Object.fromEntries(new FormData(container.querySelector('form')!).entries());
    expect('sw' in entries).toBe(false);
  });
});

describe('slider serialization through the form', () => {
  it('a named Slider carries its value to FormData', () => {
    const { container } = render(
      <form>
        <Slider name="volume" defaultValue={[4]} min={0} max={10} step={2} />
      </form>,
    );
    const entries = Object.fromEntries(new FormData(container.querySelector('form')!).entries());
    expect(entries['volume']).toBe('4');
  });
});

describe('read-only is unsupported in BOTH layers — the claim is that neither claims it', () => {
  // The React half of this claim is TYPE-level and lives in the consumer
  // typing probe (test:types), where an @ts-expect-error has teeth — vitest
  // strips types without checking them, and React forwards unknown props to
  // the DOM by design, so neither a runtime attribute check nor an inline
  // ts-expect-error here can assert anything about Weft's surface.
  it('the committed prop surfaces for switch and slider carry no readOnly', () => {
    const snapshot = JSON.parse(readFileSync(join(ROOT, 'props-snapshot.json'), 'utf8'));
    for (const id of ['switch', 'slider']) {
      const surface = JSON.stringify(snapshot.components[id]?.surface ?? {});
      expect(/readonly/i.test(surface), `${id} must not claim read-only`).toBe(false);
    }
  });

  it('plain CSS: the stylesheet carries no [readonly] selector for switch or slider', () => {
    const css = readFileSync(join(ROOT, 'css', 'weft-components.css'), 'utf8');
    expect(/\.weft-switch[^{]*\[readonly\]|\.weft-slider[^{]*\[readonly\]/.test(css)).toBe(false);
  });
});
