// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import manifest from '../../../manifest.json';
import propsSnapshot from '../../../props-snapshot.json';
import { specimens } from '../specimens';
import { axesFromSurface, coerceAxisValue } from '../specimen-types';
import { expectA11yClean } from '../../test-support/ds-assert';

type PropEntry = { optional: boolean; union: string[] | null };
const components = (propsSnapshot as { components: Record<string, { surface: { variants: Record<string, string[]>; props: Record<string, PropEntry>; native: string[] } }> }).components;
const primitiveIds = new Set(manifest.uiPrimitives.map((p) => p.id));

describe('specimens', () => {
  it('cover every manifest primitive', () => {
    const missing = [...primitiveIds].filter((id) => !id.endsWith('.figma') && !(id in specimens));
    expect(missing).toEqual([]);
  });

  for (const [id, specimen] of Object.entries(specimens)) {
    describe(id, () => {
      it('names a manifest primitive and a real module', () => {
        expect(primitiveIds.has(id)).toBe(true);
        expect(specimen.module).toBe(id);
      });

      it('declared axes exist in the prop contract with enumerable values', () => {
        const available = new Set(axesFromSurface(components[id]?.surface).map((a) => a.prop));
        for (const axis of specimen.axes ?? []) {
          expect(available.has(axis), `${id}.${axis}`).toBe(true);
        }
      });

      it('renders every axis value and every state accessibly', async () => {
        const base = specimen.base ?? {};
        const all = axesFromSurface(components[id]?.surface);
        const axes = specimen.axes ? specimen.axes.map((p) => all.find((a) => a.prop === p)).filter((a): a is { prop: string; values: string[] } => Boolean(a)) : all;
        const cells: React.ReactNode[] = [];
        for (const axis of axes) {
          for (const value of axis.values) {
            cells.push(<div key={`${axis.prop}-${value}`}>{specimen.render({ ...base, ...(specimen.axisBase?.[axis.prop] ?? {}), [axis.prop]: coerceAxisValue(value) })}</div>);
          }
        }
        for (const state of specimen.states ?? []) {
          cells.push(<div key={`state-${state.label}`}>{specimen.render({ ...base, ...state.props })}</div>);
        }
        const { container } = render(<div>{cells}</div>);
        expect(container.childElementCount).toBe(1);
        // jsdom cannot hand axe a frame window, so axe is told not to enter
        // iframes (frame-title still runs on the iframe element itself).
        await expectA11yClean(container, { iframes: false });
      });
    });
  }
});
