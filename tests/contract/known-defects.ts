/**
 * The known-current state of the input surface, as a ratchet.
 *
 * WHY THIS FILE EXISTS
 * The single most important finding in the audit is that axe-core reports zero
 * violations on this surface, and lists the unlabelled rail search under passes.
 * An automated gate added today would go green and stay green while every defect
 * below persists. So the defects are written down as claims that MUST FAIL, and
 * the suites fail in three directions rather than one:
 *
 *   - a recorded claim that starts HOLDING fails the run, because a phase moved
 *     a number and the entry has to come out with it;
 *   - a recorded claim that gets WORSE than its recorded shortfall fails the
 *     run, because a known defect is a floor and not a licence;
 *   - a claim not recorded here that fails is an ordinary regression.
 *
 * That third direction is the ordinary one. The second was added after review
 * caught its absence: the recorded measurements used to be prose, so
 * `boundary/light/marketing/paper` could have degraded from five cells under the
 * floor to twelve and stayed green, since it was still failing. A ratchet that
 * checks only the direction of a claim and not its magnitude is a list of things
 * nobody is watching.
 *
 * `shortfall` is therefore load-bearing, not documentation. It is the exact
 * number the suite computes today: pixels past a tolerance, cells under a floor,
 * ring pixels missing, states that failed to separate, or 1 for a claim that is
 * genuinely binary.
 *
 * Entries shrink. Adding one, or raising one, is a deliberate act that belongs
 * in review — never a way to make a red suite go green.
 *
 * The precedent is scripts/__tests__/contrast-contract.node.mjs, whose
 * KNOWN_FAILURES set records pre-existing palette failures the same way.
 */

export interface KnownDefect {
  /** What is wrong, and which phase owns the fix. */
  why: string;
  /** The shortfall measured when this entry was written. The claim may not do worse. */
  shortfall: number;
}

export const KNOWN_DEFECTS: Readonly<Record<string, KnownDefect>> = Object.freeze({

  // ── Geometry (P5) ─────────────────────────────────────────────────────────
  // P2 closed the control-height defects at their cause; what is left here is
  // the textarea, whose floor was never a tier in the first place.
  'geometry/textarea/tracks-density': {
    why: 'P5 — .weft-textarea min-height is a hardcoded 96px and tracks no token at any tier.',
    shortfall: 1,
  },

});

export type DefectKey = keyof typeof KNOWN_DEFECTS;
