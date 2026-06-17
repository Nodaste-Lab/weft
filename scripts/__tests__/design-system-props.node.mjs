import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSurface } from '../lib/component-prop-surface.mjs';
import { diffSurface } from '../design-system-props.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ui = (id) => join(ROOT, 'src/app/components/ui', `${id}.tsx`);

test('extractSurface reads cva variants and own props (button)', () => {
  const s = extractSurface(ui('button'));
  assert.deepEqual(s.variants.variant.includes('ghost'), true);
  assert.deepEqual(s.variants.size.sort(), ['default', 'icon', 'lg', 'sm']);
  assert.equal(s.props.loading.optional, true);
  assert.deepEqual(s.native, ['button']);
});

test('extractSurface captures required props and literal unions (empty-state)', () => {
  const s = extractSurface(ui('empty-state'));
  assert.equal(s.props.title.optional, false, 'title is required');
  assert.deepEqual(s.props.tone.union, ['default', 'warning']);
});

test('extractSurface tolerates thin wrappers with no custom contract (card)', () => {
  const s = extractSurface(ui('card'));
  assert.deepEqual(s.variants, {});
  assert.deepEqual(s.props, {});
});

test('diffSurface flags removed variant option as breaking', () => {
  const a = { variants: { variant: ['default', 'ghost'] }, props: {}, native: [] };
  const b = { variants: { variant: ['default'] }, props: {}, native: [] };
  const { breaking, additive } = diffSurface(a, b);
  assert.equal(additive.length, 0);
  assert.ok(breaking.some((m) => m.includes("variant 'variant.ghost' removed")));
});

test('diffSurface: removed prop and optional->required are breaking; new optional is additive', () => {
  const a = { variants: {}, props: { keep: { optional: true, union: null }, gone: { optional: true, union: null } }, native: [] };
  const b = { variants: {}, props: { keep: { optional: false, union: null }, added: { optional: true, union: null } }, native: [] };
  const { breaking, additive } = diffSurface(a, b);
  assert.ok(breaking.some((m) => m.includes("prop 'gone' removed")));
  assert.ok(breaking.some((m) => m.includes("prop 'keep' became required")));
  assert.ok(additive.some((m) => m.includes("prop 'added' added (optional)")));
});

test('diffSurface: new required prop is breaking; union narrowing is breaking, widening is additive', () => {
  const narrow = diffSurface(
    { variants: {}, props: { p: { optional: true, union: null } }, native: [] },
    { variants: {}, props: { p: { optional: true, union: ['a', 'b'] } }, native: [] },
  );
  assert.ok(narrow.breaking.some((m) => m.includes('narrowed')));

  const widen = diffSurface(
    { variants: {}, props: { p: { optional: true, union: ['a', 'b'] } }, native: [] },
    { variants: {}, props: { p: { optional: true, union: null } }, native: [] },
  );
  assert.ok(widen.additive.some((m) => m.includes('widened')));

  const req = diffSurface(
    { variants: {}, props: {}, native: [] },
    { variants: {}, props: { must: { optional: false, union: null } }, native: [] },
  );
  assert.ok(req.breaking.some((m) => m.includes("required prop 'must' added")));
});

test('identical surfaces produce no diff', () => {
  const s = extractSurface(ui('badge'));
  const { breaking, additive } = diffSurface(s, JSON.parse(JSON.stringify(s)));
  assert.equal(breaking.length, 0);
  assert.equal(additive.length, 0);
});
