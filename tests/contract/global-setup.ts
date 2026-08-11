import { rmSync } from 'node:fs';
import { RATCHET_COVERAGE_ENV, RATCHET_KEY_LOG } from './ratchet-log';

/**
 * Start each audited run with an empty key log, so a previous run cannot vouch
 * for this one.
 *
 * Gated on the same flag as the teardown, and that pairing is load-bearing.
 * globalSetup is config-level, so it fires for `--project=visual` too — and an
 * unconditional delete meant a visual run starting alongside a contract run
 * wiped the log the contract run was still writing, which showed up as the
 * coverage guard reporting ten defects nothing had measured. It failed closed,
 * which is the right direction, but the report was about the wrong thing. Only
 * the run that will be audited may truncate the file.
 */
export default function globalSetup(): void {
  if (process.env[RATCHET_COVERAGE_ENV] !== '1') return;
  rmSync(RATCHET_KEY_LOG, { force: true });
}
