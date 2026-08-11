/**
 * The visibility-reasons contract (decisions 2, 8, 11 — AC9, AC5).
 *
 * Quiet is the default on every surface; an always-visible field declares one
 * of four sanctioned reasons, and the list is the whole rule. This suite holds
 * the shared module to its cross-repository shape, runs the conformance
 * fixture through the predicate, and asserts the one thing that keeps
 * "shared" from decaying into two copied arrays: Weft's own gate imports the
 * frozen array BY IDENTITY. A copy that deep-equals today is exactly the
 * failure being prevented.
 *
 * The policy gate itself (every always-visible field on Weft's shipped
 * surfaces is declared, unknown or missing fails) lives in
 * `scripts/lib/visibility-reason-gate.mjs` and is exercised here against the
 * committed declarations and the shipped template markup.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  VISIBILITY_REASONS,
  VISIBILITY_REASONS_VERSION,
  VISIBILITY_REASON_CONFORMANCE,
  isVisibilityReason,
} from '../../tooling/visibility-reasons.js';
import {
  GATE_REASON_LIST,
  loadDeclarations,
  validateDeclarations,
  auditSurfaceFields,
} from '../lib/visibility-reason-gate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('the module ships the frozen list, the predicate and an integer version', () => {
  assert.ok(Object.isFrozen(VISIBILITY_REASONS), 'the list must be frozen');
  assert.deepEqual([...VISIBILITY_REASONS], ['frequent', 'comparative', 'primary', 'live']);
  assert.ok(Number.isInteger(VISIBILITY_REASONS_VERSION));
  assert.equal(typeof isVisibilityReason, 'function');
});

test('the conformance fixture passes through the predicate — every verdict as recorded', () => {
  assert.ok(VISIBILITY_REASON_CONFORMANCE.length >= 12, 'the fixture must carry real coverage');
  for (const c of VISIBILITY_REASON_CONFORMANCE) {
    assert.equal(
      isVisibilityReason(c.value),
      c.valid,
      `conformance case ${JSON.stringify(c.value)} expected valid=${c.valid}`,
    );
  }
});

test('the fixture covers both verdicts and the case-sensitivity trap', () => {
  const valids = VISIBILITY_REASON_CONFORMANCE.filter((c) => c.valid);
  const invalids = VISIBILITY_REASON_CONFORMANCE.filter((c) => !c.valid);
  assert.equal(valids.length, VISIBILITY_REASONS.length, 'every sanctioned reason has a valid case');
  assert.ok(invalids.length >= 6);
  assert.ok(
    invalids.some((c) => typeof c.value === 'string' && isVisibilityReason(c.value.toLowerCase())),
    'at least one invalid case must be a case-variant of a sanctioned reason',
  );
});

test('GUARD — the gate imports the array by identity, never a copy', () => {
  assert.equal(
    GATE_REASON_LIST,
    VISIBILITY_REASONS,
    'the gate must re-export the imported array itself; a copied array that matches today is the drift this rule exists to prevent',
  );
});

test('the committed declarations are valid against the shared list', () => {
  const decls = loadDeclarations();
  const problems = validateDeclarations(decls);
  assert.deepEqual(problems, [], `invalid declarations:\n${problems.join('\n')}`);
});

test('GUARD — an unknown reason in a declaration fails, and the failure names it', () => {
  const problems = validateDeclarations({
    surfaces: [{ surface: 'x', scope: 'field', reasons: ['frequently'], note: 'n' }],
  });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /frequently/);
});

test('GUARD — a declaration with no reasons at all fails', () => {
  const problems = validateDeclarations({
    surfaces: [{ surface: 'x', scope: 'field', reasons: [], note: 'n' }],
  });
  assert.equal(problems.length, 1);
});

test('every always-visible field on the shipped template page is declared', () => {
  const html = readFileSync(join(ROOT, 'docs', 'brand-package', 'panel-templates.html'), 'utf8');
  const problems = auditSurfaceFields(html, 'docs/brand-package/panel-templates.html', loadDeclarations());
  assert.deepEqual(problems, [], `undeclared always-visible fields:\n${problems.join('\n')}`);
});

test('GUARD — an undeclared field on a surface fails the audit and is named', () => {
  const html = '<input class="weft-input" id="mystery-field" />';
  const problems = auditSurfaceFields(html, 'some/uncovered-surface.html', loadDeclarations());
  assert.equal(problems.length, 1);
  assert.match(problems[0], /mystery-field|uncovered-surface/);
});

test('COUNTER-GUARD — no reason prop on Input, no reason vocabulary in the plain-CSS layer', () => {
  const snapshot = JSON.parse(readFileSync(join(ROOT, 'props-snapshot.json'), 'utf8'));
  const inputSurface = JSON.stringify(snapshot.components.input?.surface ?? {});
  assert.ok(
    !/reason|visib/i.test(inputSurface),
    'Input grew a visibility/reason prop — decision 8 turns on this staying out of the primitive',
  );
  const css = readFileSync(join(ROOT, 'css', 'weft-components.css'), 'utf8');
  assert.ok(
    !/(?:class|data)-?[a-z-]*(?:visibility-reason|always-visible)/i.test(css) &&
      !/\.weft-[a-z-]*reason/.test(css),
    'the plain-CSS layer grew a reason escape hatch — the reason lives with the surface, never the control',
  );
});
