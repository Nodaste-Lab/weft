import { existsSync, readFileSync } from 'node:fs';
import { KNOWN_DEFECTS } from './known-defects';
import { RATCHET_COVERAGE_ENV, RATCHET_KEY_LOG } from './ratchet-log';

/**
 * The second way known-defects.ts rots: an entry nobody measures.
 *
 * A recorded defect whose assertion was renamed or deleted would sit in that
 * file forever, reading as a known problem while nothing checks it — the same
 * shape of lie as a green suite over a broken surface, and the reason this plan
 * distrusts tool-shaped gates. So every recorded key has to be measured by a
 * complete run, and a run that misses one fails.
 */
export default function globalTeardown(): void {
  if (process.env[RATCHET_COVERAGE_ENV] !== '1') return;

  const measured = new Set(
    existsSync(RATCHET_KEY_LOG)
      ? readFileSync(RATCHET_KEY_LOG, 'utf8').split('\n').filter(Boolean)
      : [],
  );

  const recorded = Object.keys(KNOWN_DEFECTS);
  const orphans = recorded.filter((key) => !measured.has(key));
  if (orphans.length) {
    throw new Error(
      `RATCHET: known-defects.ts records ${orphans.length} defect(s) that this run never measured:\n` +
        orphans.map((k) => `  - ${k}`).join('\n') +
        `\n  Either the assertion was renamed and the key needs updating with it, or the ` +
        `assertion is gone and the entry is stale. An unmeasured entry records nothing.`,
    );
  }

  if (measured.size === 0) {
    throw new Error(
      'RATCHET: the run measured no keys at all. Either the contract suites did not run, or ' +
        'the key log is not being written — both make a green result meaningless.',
    );
  }
}
