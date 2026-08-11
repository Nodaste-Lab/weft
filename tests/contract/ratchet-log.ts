import { join } from 'node:path';

/**
 * Where the ratchet records which keys a run actually measured.
 *
 * Its own module so the setup, the teardown and the workers agree on the path
 * without importing each other's Playwright-flavoured code.
 *
 * NOT under `test-results/`, which was the first attempt and is wrong: that is
 * Playwright's `outputDir`, and Playwright empties it at the start of every
 * run. A single run survived that by accident of ordering, and a second run
 * starting alongside the first deleted the log the first was still writing —
 * which surfaced as the coverage guard reporting ten defects nothing had
 * measured. A cache directory nothing else manages removes the whole class.
 */
export const RATCHET_KEY_LOG = join(
  process.cwd(),
  'node_modules',
  '.cache',
  'weft-ratchet',
  'keys.txt',
);

/**
 * The coverage guard is only meaningful over a complete run of the contract
 * project. `npx playwright test tests/contract/input-focus.spec.ts` legitimately
 * measures a fraction of the keys, and failing that would train everyone to
 * ignore the guard. `npm run test:contract` — the form the gate battery runs —
 * sets this.
 */
export const RATCHET_COVERAGE_ENV = 'WEFT_RATCHET_FULL';
