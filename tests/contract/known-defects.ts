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

  // ── Focus (P4) ────────────────────────────────────────────────────────────
  // P2 gave the ring a second carrier, so an author shadow no longer deletes it.
  // What is left is the criterion about the page around the control.
  'focus/not-obscured-by-sticky-chrome': {
    why:
      'P4 — heuristic 9, SC 2.4.11. Focusing a control that sits under the sticky bar scrolls it ' +
      'flush to the viewport top and leaves it 100% covered. There is no scroll-padding-top on ' +
      'html anywhere in the shipped CSS. Shortfall is the covered fraction.',
    shortfall: 1,
  },

  // ── Boundary (P4) ─────────────────────────────────────────────────────────
  // Border against the surface behind it: 1.30:1 light, 1.38:1 dark, measured
  // off painted pixels. The fill is --weft-paper, identical to the card behind
  // it, so 1.00:1. Neither cue identifies the control. `.weft-btn.is-ghost`
  // carries the same two numbers and is in the same matrix rather than in a
  // footnote, because it has to move with the field.
  //
  // Keyed per theme/density/ground: that is the grain P4 has to move, and a key
  // still standing after P4 is a combination P4 missed. Shortfall counts cells
  // under the 3:1 floor, so a combination cannot quietly get worse behind the key.
  'boundary/light/marketing/paper': { why: 'P4 — 5 of 12 cells under 3:1; best 1.30:1.', shortfall: 5 },
  'boundary/light/marketing/cream': { why: 'P4 — the field fill is paper on cream, 1.06:1.', shortfall: 5 },
  'boundary/light/marketing/card': { why: 'P4 — the field fill is the card fill, 1.00:1.', shortfall: 5 },
  'boundary/light/compact/paper': { why: 'P4 — 6 of 12 cells under 3:1; best 1.30:1.', shortfall: 6 },
  'boundary/light/compact/cream': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/light/compact/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/light/dense/paper': { why: 'P4 — under 3:1; best 1.30:1.', shortfall: 6 },
  'boundary/light/dense/cream': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/light/dense/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/dark/marketing/paper': { why: 'P4 — 5 of 12 cells under 3:1; best 1.38:1.', shortfall: 5 },
  'boundary/dark/marketing/cream': { why: 'P4 — under 3:1; best 1.51:1.', shortfall: 5 },
  'boundary/dark/marketing/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/dark/compact/paper': { why: 'P4 — 6 of 12 cells under 3:1.', shortfall: 6 },
  'boundary/dark/compact/cream': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/dark/compact/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/dark/dense/paper': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/dark/dense/cream': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/dark/dense/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/light/interactive-states': {
    why: 'P4 — 9 of 27 hover/focus readings under 3:1; hover reaches only 1.90:1.',
    shortfall: 9,
  },
  'boundary/dark/interactive-states': {
    why: 'P4 — 9 of 27 hover/focus readings under 3:1; hover reaches only 2.33:1.',
    shortfall: 9,
  },
  'boundary/hover-is-not-the-only-signifier': {
    why:
      'P4 — heuristic 3. Resting reaches 1.30:1 and hover raises it to 1.90:1, so hover is ' +
      'carrying rather than reinforcing. It does not exist on touch and it does not exist for a ' +
      'keyboard-first user. Shortfall is the contrast hover adds.',
    shortfall: 0.6,
  },

  // ── Consumer iframe (P2, P4) ──────────────────────────────────────────────
  'iframe/boundary/light': { why: 'P4 — the same hairline inside the injected panel iframe.', shortfall: 2 },
  'iframe/boundary/dark': { why: 'P4 — the same hairline inside the injected panel iframe.', shortfall: 2 },
});

export type DefectKey = keyof typeof KNOWN_DEFECTS;
