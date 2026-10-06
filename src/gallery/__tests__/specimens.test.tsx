// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import manifest from '../../../manifest.json';
import propsSnapshot from '../../../props-snapshot.json';
import { specimens } from '../specimens';
import { coerceAxisValue } from '../specimen-types';
import { expectA11yClean } from '../../test-support/ds-assert';

type PropEntry = { optional: boolean; union: string[] | null };
const components = (propsSnapshot as { components: Record<string, { surface: { props: Record<string, PropEntry> } }> }).components;
const primitiveIds = new Set(manifest.uiPrimitives.map((p) => p.id));

describe('specimens', () => {
  for (const [id, specimen] of Object.entries(specimens)) {
    describe(id, () => {
      it('names a manifest primitive and a real module', () => {
        expect(primitiveIds.has(id)).toBe(true);
        expect(specimen.module).toBe(id);
      });

      it('declared axes exist in the prop contract with a value union', () => {
        for (const axis of specimen.axes ?? []) {
          expect(components[id]?.surface.props[axis]?.union, `${id}.${axis}`).toBeTruthy();
        }
      });

      it('renders every axis value and every state accessibly', async () => {
        const base = specimen.base ?? {};
        const props = components[id]?.surface.props ?? {};
        const axes = (specimen.axes ?? Object.keys(props).filter((k) => Array.isArray(props[k].union) && !['as', 'asChild'].includes(k)));
        const cells: React.ReactNode[] = [];
        for (const axis of axes) {
          for (const value of props[axis].union ?? []) {
            cells.push(<div key={`${axis}-${value}`}>{specimen.render({ ...base, ...(specimen.axisBase?.[axis] ?? {}), [axis]: coerceAxisValue(value) })}</div>);
          }
        }
        for (const state of specimen.states ?? []) {
          cells.push(<div key={`state-${state.label}`}>{specimen.render({ ...base, ...state.props })}</div>);
        }
        const { container } = render(<div>{cells}</div>);
        expect(container.childElementCount).toBe(1);
        await expectA11yClean(container);
      });
    });
  }
});
