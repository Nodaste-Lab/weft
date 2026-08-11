/**
 * Input-layer parity gate (decision 8, AC5).
 *
 * `scripts/input-parity.json` records, for the input surface, what is at
 * parity between the React layer and the plain-CSS layer, what is an
 * allowlisted gap, and what is a documented divergence. The three states are
 * the whole model:
 *
 *   - an ALLOWLISTED GAP carries an owner and an EXPIRY, because parity is
 *     expected to come — and this suite FAILS the day the expiry passes, which
 *     is what makes an expiry a commitment rather than a decoration;
 *   - a DOCUMENTED DIVERGENCE carries a rationale and no date, because the
 *     difference is deliberate and permanent (the RangeBounds precedent);
 *   - everything else must be at parity.
 *
 * P6 seeds this file with its first honest entry — the commit boundary is a
 * JavaScript behaviour with no plain-CSS counterpart. P7 commits the full
 * component-by-state-by-capability matrix and extends this suite to fail on a
 * cell that is none of the three states. Until then this suite holds the
 * record itself to its schema: an entry that drops its owner, its expiry, or
 * its rationale is exactly the decay the record exists to prevent.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RECORD_PATH = join(ROOT, 'scripts', 'input-parity.json');

const record = JSON.parse(readFileSync(RECORD_PATH, 'utf8'));

test('the record parses and carries the expected shape', () => {
  assert.equal(typeof record.version, 'number');
  assert.ok(Array.isArray(record.cells), 'cells must be an array');
  assert.ok(Array.isArray(record.allowlist), 'allowlist must be an array');
  assert.ok(Array.isArray(record.divergences), 'divergences must be an array');
});

/**
 * The input surface, enumerated HERE — in the gate, not in the data — so a
 * capability added to the system without a matrix cell fails the build
 * rather than sliding by unrecorded. Extend this list when the surface
 * genuinely grows; that is the review moment the matrix exists to create.
 */
const REQUIRED_CAPABILITIES = [
  'input',
  'textarea',
  'select',
  'checkbox-row',
  'radio-row',
  'switch',
  'slider-single',
  'slider-range',
  'search',
  'search-clear-action',
  'commit-boundary',
  'labelling',
  'description',
  'required-marker',
  'group-name',
  'tier-underline',
  'tier-low',
];

test('every enumerated capability has exactly one cell — the build fails on an unrecorded one', () => {
  const byCapability = new Map(record.cells.map((c) => [c.capability, c]));
  const missing = REQUIRED_CAPABILITIES.filter((cap) => !byCapability.has(cap));
  assert.deepEqual(missing, [], `capabilities with no matrix cell: ${missing.join(', ')}`);
  assert.equal(
    record.cells.length,
    new Set(record.cells.map((c) => c.capability)).size,
    'duplicate capability cells',
  );
});

test('every cell is parity, an allowlisted gap, or a documented divergence — nothing else exists', () => {
  for (const cell of record.cells) {
    assert.ok(cell.claim, `${cell.capability}: a cell states what it claims`);
    if (cell.status === 'parity') {
      assert.ok(cell.react && cell.plainCss, `${cell.capability}: parity names both sides`);
    } else if (cell.status === 'gap') {
      const entry = record.allowlist.find((e) => e.id === cell.ref);
      assert.ok(entry, `${cell.capability}: a gap must reference a live allowlist entry (ref=${cell.ref})`);
    } else if (cell.status === 'divergence') {
      const entry = record.divergences.find((e) => e.id === cell.ref);
      assert.ok(entry, `${cell.capability}: a divergence must reference its documented entry (ref=${cell.ref})`);
    } else {
      assert.fail(
        `${cell.capability}: status ${JSON.stringify(cell.status)} is none of the three — ` +
          'parity, gap, or divergence. "Or it goes in the log" is not a gate and was removed.',
      );
    }
  }
});

test('no orphaned allowlist or divergence entries — every one is referenced by a cell', () => {
  const refs = new Set(record.cells.map((c) => c.ref).filter(Boolean));
  for (const entry of [...record.allowlist, ...record.divergences]) {
    assert.ok(
      refs.has(entry.id),
      `${entry.id}: an entry no cell references is a record of nothing`,
    );
  }
});

test('ids are unique across the whole record', () => {
  const ids = [...record.allowlist, ...record.divergences].map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate id in ${JSON.stringify(ids)}`);
});

test('every allowlisted gap carries an owner and an unexpired expiry', () => {
  assert.ok(record.allowlist.length >= 1, 'P6 recorded the first entry; it may not silently vanish');
  for (const entry of record.allowlist) {
    assert.ok(entry.id, 'an entry needs an id');
    assert.ok(entry.capability, `${entry.id}: name the capability the gap is about`);
    assert.ok(
      typeof entry.owner === 'string' && entry.owner.trim().length > 0,
      `${entry.id}: an allowlisted gap without an owner is a gap nobody closes`,
    );
    assert.match(
      String(entry.expiry),
      /^\d{4}-\d{2}-\d{2}$/,
      `${entry.id}: expiry must be a YYYY-MM-DD date`,
    );
    const expiry = new Date(`${entry.expiry}T23:59:59Z`);
    assert.ok(!Number.isNaN(expiry.getTime()), `${entry.id}: expiry does not parse`);
    assert.ok(
      expiry.getTime() >= Date.now(),
      `${entry.id}: EXPIRED ${entry.expiry}. Close the gap, or re-argue the entry with a new ` +
        `expiry and an owner who means it — an expiry that slides silently is not an expiry.`,
    );
    assert.ok(
      typeof entry.reason === 'string' && entry.reason.trim().length > 0,
      `${entry.id}: record why the gap exists`,
    );
  }
});

test('every documented divergence carries a rationale and no expiry', () => {
  for (const entry of record.divergences) {
    assert.ok(entry.id, 'a divergence needs an id');
    assert.ok(
      typeof entry.rationale === 'string' && entry.rationale.trim().length > 0,
      `${entry.id}: a divergence without a rationale is an unexplained difference, not a decision`,
    );
    assert.equal(
      entry.expiry,
      undefined,
      `${entry.id}: a divergence is permanent by definition — an expiry implies parity is coming, ` +
        `which is what the allowlist is for`,
    );
  }
});

test('every referenced implementation file exists', () => {
  // `react` values are repo paths; `plainCss` may be a selector or a recipe
  // descriptor rather than a file, so only path-shaped values are checked.
  const looksLikePath = (p) => /^[\w./-]+$/.test(p) && p.includes('/');
  for (const entry of [...record.cells, ...record.allowlist, ...record.divergences]) {
    for (const key of ['react', 'plainCss']) {
      const p = entry[key];
      if (typeof p === 'string' && looksLikePath(p)) {
        assert.ok(
          existsSync(join(ROOT, p)),
          `${entry.id ?? entry.capability}: ${key} path ${p} does not exist`,
        );
      }
    }
  }
});
