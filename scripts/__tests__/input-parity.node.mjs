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
  assert.ok(Array.isArray(record.allowlist), 'allowlist must be an array');
  assert.ok(Array.isArray(record.divergences), 'divergences must be an array');
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
  for (const entry of [...record.allowlist, ...record.divergences]) {
    for (const key of ['react', 'plainCss']) {
      const p = entry[key];
      if (typeof p === 'string' && p.length > 0) {
        assert.ok(existsSync(join(ROOT, p)), `${entry.id}: ${key} path ${p} does not exist`);
      }
    }
  }
});
