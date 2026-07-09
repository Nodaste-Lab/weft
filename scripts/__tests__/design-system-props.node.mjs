import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSurface } from '../lib/component-prop-surface.mjs';
import { diffSurface, surfaceVersionViolations, baseSnapshotVersionViolations, baseManifestRemovalViolations } from '../design-system-props.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ui = (id) => join(ROOT, 'src/ui', `${id}.tsx`);

test('extractSurface reads cva variants and own props (button)', () => {
  const s = extractSurface(ui('button'));
  assert.deepEqual(s.variants.variant.includes('ghost'), true);
  assert.deepEqual(s.variants.size.sort(), ['default', 'icon', 'lg', 'sm']);
  assert.equal(s.props.loading.optional, true);
  assert.deepEqual(s.native, ['button']);
});

test('extractSurface captures required props and resolves a named-alias union (empty-state)', () => {
  const s = extractSurface(ui('empty-state'));
  assert.equal(s.props.title.optional, false, 'title is required');
  // `tone?: EmptyStateTone` — the extractor resolves the same-file type alias to its
  // literal value set, so a union declared as a named alias is captured like an inline one.
  assert.deepEqual(s.props.tone.union, ['danger', 'default', 'info', 'positive', 'warning']);
});

test('extractSurface resolves a same-file type-alias union on a prop (card.density)', () => {
  const s = extractSurface(ui('card'));
  assert.deepEqual(s.variants, {});
  // `density?: CardDensity` resolves to its literal union.
  assert.deepEqual(s.props.density.union, ['compact', 'default']);
});

test('extractSurface tolerates thin wrappers with no custom contract (separator)', () => {
  const s = extractSurface(ui('separator'));
  assert.deepEqual(s.variants, {});
  assert.deepEqual(s.props, {});
});

test('an own prop is not clobbered by a sibling Omit of the same name (callout.title)', () => {
  // Regression: `interface CalloutProps extends Omit<ComponentProps<"div">, "title">, ...`
  // declares its own `title` — the Omit must only strip the native title, not the own one.
  const s = extractSurface(ui('callout'));
  assert.ok('title' in s.props, 'callout.title must survive Omit<…, "title">');
  assert.deepEqual(s.variants.tone, ['danger', 'info', 'muted', 'positive', 'warning']);
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

test('surfaceVersionViolations requires a version bump for additive changes', () => {
  const oldEntry = { version: '1.2.3', surface: { variants: {}, props: {}, native: [] } };
  const newEntry = { version: '1.2.3', surface: { variants: {}, props: { tone: { optional: true, union: ['info'] } }, native: [] } };
  const violations = surfaceVersionViolations('badge', oldEntry, newEntry);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /without a version bump/);
});

test('baseSnapshotVersionViolations catches a rebaselined snapshot without a version bump', () => {
  const base = { components: { badge: { version: '1.2.3', surface: { variants: {}, props: {}, native: [] } } } };
  const committed = { components: { badge: { version: '1.2.3', surface: { variants: {}, props: { tone: { optional: true, union: ['info'] } }, native: [] } } } };
  const violations = baseSnapshotVersionViolations(base, committed);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /without a version bump/);
});

test('baseSnapshotVersionViolations requires tombstones for removed snapshot components', () => {
  const base = { components: { badge: { version: '1.2.3', surface: { variants: {}, props: {}, native: [] } } } };
  const committed = { components: {} };
  const currentManifest = { removedUiPrimitives: [] };
  const violations = baseSnapshotVersionViolations(base, committed, currentManifest);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /badge: removed showcase component missing removedUiPrimitives tombstone/);
});

test('surfaceVersionViolations requires a major bump for breaking changes', () => {
  const oldEntry = { version: '1.2.3', surface: { variants: { tone: ['info', 'danger'] }, props: {}, native: [] } };
  const newEntry = { version: '1.3.0', surface: { variants: { tone: ['info'] }, props: {}, native: [] } };
  const violations = surfaceVersionViolations('badge', oldEntry, newEntry);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /without a major bump/);
});

test('baseManifestRemovalViolations requires tombstones for removed showcase primitives', () => {
  const base = { uiPrimitives: [{ id: 'removed-row', showcase: true }, { id: 'kept-row', showcase: true }] };
  const current = { uiPrimitives: [{ id: 'kept-row', showcase: true }] };
  const violations = baseManifestRemovalViolations(base, current);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /removed-row: removed showcase component missing removedUiPrimitives tombstone/);
});

test('baseManifestRemovalViolations accepts explicit removed primitive tombstones', () => {
  const base = { uiPrimitives: [{ id: 'removed-row', showcase: true }] };
  const current = {
    uiPrimitives: [],
    removedUiPrimitives: [{ id: 'removed-row', removedIn: '1.2.0', reason: 'Replaced by canonical row.' }],
  };
  assert.deepEqual(baseManifestRemovalViolations(base, current), []);
});
