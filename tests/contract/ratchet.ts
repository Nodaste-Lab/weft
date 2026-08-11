/**
 * The ratchet: assertions that must fail, assertions that must not, and
 * recorded failures that may not get worse.
 *
 * Every measured claim in the contract suites goes through `measure()` and
 * reports a SHORTFALL — a number that is zero when the claim holds and grows as
 * the surface gets further from holding. Pixels off a tier, cells under a
 * contrast floor, ring pixels missing, states that failed to separate: all of
 * them reduce to one non-negative number, which is what lets one mechanism
 * decide all four outcomes.
 *
 *   key not recorded, shortfall 0   → pass
 *   key not recorded, shortfall > 0 → FAIL, an ordinary regression
 *   key recorded,     shortfall 0   → FAIL, a phase moved the number; delete the entry
 *   key recorded,     worse than recorded → FAIL, the defect deepened
 *   key recorded,     no worse      → pass, still a known defect
 *
 * THE THIRD AND FOURTH LINES ARE THE POINT. An earlier version of this file
 * took a callback and accepted any assertion failure for a recorded key, with
 * the measurement kept as prose alongside it. That made the recorded number
 * decorative: `boundary/light/marketing/paper` could degrade from five cells
 * under the floor to twelve and stay green, because it was still failing. A
 * ratchet that only checks the direction of a claim and not its magnitude is
 * not a ratchet — it is a list of things nobody is watching.
 *
 * Shortfalls are numbers rather than booleans for exactly that reason. Where a
 * claim really is binary — a description is exposed or it is not — the
 * shortfall is 1, and the entry says so.
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { test } from '@playwright/test';
import { KNOWN_DEFECTS } from './known-defects';
import { RATCHET_KEY_LOG } from './ratchet-log';

/**
 * Sub-pixel jitter and antialiasing move a shortfall by hundredths between
 * runs. Anything above this is the surface changing, not the renderer.
 */
const NOISE = 0.02;

export interface Claim {
  /** Stable identity; the same string appears in known-defects.ts while it is a known defect. */
  key: string;
  /** 0 when the claim holds; larger means further from holding. Never negative. */
  shortfall: number;
  /** The measured values, recorded whatever the outcome — a phase closes by quoting these. */
  evidence: string;
  /** What to say when the claim does not hold. Says what is wrong, not that something is wrong. */
  failure: string;
}

export async function measure({ key, shortfall, evidence, failure }: Claim): Promise<void> {
  recordKey(key);
  test.info().annotations.push({
    type: 'measured',
    description: `${key} — shortfall ${round(shortfall)} — ${evidence}`,
  });

  if (!Number.isFinite(shortfall) || shortfall < 0) {
    throw new Error(
      `RATCHET: "${key}" reported a shortfall of ${shortfall}, which is not a measurement.\n` +
        `  evidence: ${evidence}\n` +
        `  A shortfall is zero when the claim holds and positive when it does not. This is a ` +
        `bug in the measurement, and it is not a defect report in either direction.`,
    );
  }

  const known = KNOWN_DEFECTS[key];

  if (!known) {
    if (shortfall > 0) {
      throw new Error(`"${key}" failed.\n  measured: ${evidence}\n  ${failure}`);
    }
    return;
  }

  if (shortfall === 0) {
    throw new Error(
      `RATCHET: "${key}" now holds, and it is still listed as a known defect.\n` +
        `  measured: ${evidence}\n` +
        `  recorded: shortfall ${known.shortfall} — ${known.why}\n` +
        `  A phase moved this number. Delete the entry from tests/contract/known-defects.ts in\n` +
        `  the same change, so the assertion becomes a permanent guard instead of an expectation\n` +
        `  that it stays broken.`,
    );
  }

  if (shortfall > known.shortfall + NOISE) {
    throw new Error(
      `RATCHET: "${key}" is a known defect and it got WORSE.\n` +
        `  recorded: shortfall ${known.shortfall} — ${known.why}\n` +
        `  measured: shortfall ${round(shortfall)} — ${evidence}\n` +
        `  ${failure}\n` +
        `  A known defect is a floor, not a licence. If this deepening is intended, say so and\n` +
        `  update the recorded shortfall deliberately; otherwise something regressed behind it.`,
    );
  }
}

/**
 * Measure several claims and report on all of them.
 *
 * `measure()` throws, so a bare loop stops at the first claim that fails and the
 * rest of the row is never measured — which is how a matrix quietly shrinks to
 * its first cell. It bites hardest at exactly the wrong moment: the run where a
 * phase flips one key is the run where the keys after it stop being checked, and
 * the coverage guard then reports them as unmeasured rather than as passing.
 */
export async function measureAll(claims: Claim[]): Promise<void> {
  const failures: string[] = [];
  for (const claim of claims) {
    try {
      await measure(claim);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (failures.length) {
    throw new Error(
      `${failures.length} of ${claims.length} claims failed:\n\n${failures.join('\n\n')}`,
    );
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Shortfall for a binary claim: 0 when it holds, 1 when it does not. */
export function binary(holds: boolean): number {
  return holds ? 0 : 1;
}

/** Shortfall for "measured must be within tolerance of expected". */
export function within(measured: number, expected: number, tolerance: number): number {
  return Math.max(0, Math.abs(measured - expected) - tolerance);
}

/** Shortfall for "measured must be at least floor". */
export function atLeast(measured: number, floor: number): number {
  return Math.max(0, floor - measured);
}

/**
 * Every key measured anywhere in the run, appended to one file.
 *
 * Module state cannot carry this: Playwright gives each test a fresh module
 * registry, so an in-memory Set is empty by the time anything could check it —
 * a coverage guard built on one would have passed while proving nothing. The
 * file survives both the test and the worker boundary; global-teardown.ts reads
 * it.
 */
function recordKey(key: string): void {
  mkdirSync(dirname(RATCHET_KEY_LOG), { recursive: true });
  appendFileSync(RATCHET_KEY_LOG, `${key}\n`);
}

export { KNOWN_DEFECTS };
