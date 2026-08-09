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
  // ── Naming (P3) ───────────────────────────────────────────────────────────
  'naming/visible-label/name-matches-markup': {
    why:
      'P3 — .weft-field-label sets text-transform: uppercase, and the accessible name is ' +
      'computed from rendered text. Markup "Project name" is exposed as "PROJECT NAME".',
    shortfall: 1,
  },
  'naming/group-legend/name-matches-markup': {
    why:
      'P3 — .weft-field-group > legend has the same uppercase transform. Markup ' +
      '"Retention policy" is exposed as "RETENTION POLICY".',
    shortfall: 1,
  },
  'naming/placeholder-only/placeholder-is-not-a-name': {
    why:
      'P3 — a placeholder satisfies the accessible-name computation, so the rail search ' +
      'resolves to a named searchbox and axe lists it under passes. The name is gone the ' +
      'moment the user types.',
    shortfall: 1,
  },
  'naming/hidden-label/occupies-no-layout-space': {
    why:
      'P3 — there is no .weft-sr-only or equivalent anywhere in the shipped CSS, so the only ' +
      'route to a name is a visible label. This is the gap that changed the board rail design. ' +
      'Shortfall is the rendered area in px².',
    shortfall: 4900,
  },

  // ── Description wiring (P2) ───────────────────────────────────────────────
  'naming/help-text/description-exposes-help': {
    why:
      'P2 — .weft-field-hint is an unassociated sibling. Nothing wires aria-describedby, for ' +
      'help text or for error text.',
    shortfall: 1,
  },
  'naming/error-text/description-exposes-error': {
    why: 'P2 — aria-invalid is exposed; the description is empty.',
    shortfall: 1,
  },
  'naming/help-then-error/description-carries-each-message-once': {
    why: 'P2 — no description is attached at all, so "exactly once" cannot yet be true. Shortfall counts the messages missing.',
    shortfall: 2,
  },

  // ── Required marker (P2, decision 4) ──────────────────────────────────────
  'naming/required-marker/required-is-true': {
    why:
      'P2 — .weft-req renders a bare red asterisk and nothing sets the required attribute. ' +
      'Observed: required false.',
    shortfall: 1,
  },
  'naming/required-marker/name-carries-no-marker-glyph': {
    why: 'P2 — the asterisk lands inside the accessible name. Observed name "RETENTION*".',
    shortfall: 1,
  },

  // ── Geometry (P2, and the textarea in P5) ─────────────────────────────────
  // Padding plus line-height outgrows min-height. Only the dense tier was
  // hand-tuned (pad-y 6px) to fit, which is why this hid at two tiers.
  // Shortfall is pixels past the one-pixel tolerance.
  'geometry/marketing/input': { why: 'P2 — 46.39px against a 44px tier.', shortfall: 1.39 },
  'geometry/marketing/select': { why: 'P2 — 46.39px against a 44px tier.', shortfall: 1.39 },
  'geometry/marketing/row-heights-agree': {
    why: 'P2 — input and select stand 2.39px taller than the button beside them.',
    shortfall: 1.39,
  },
  'geometry/compact/input': { why: 'P2 — 43.59px against a 36px tier.', shortfall: 6.59 },
  'geometry/compact/select': { why: 'P2 — 43.59px against a 36px tier.', shortfall: 6.59 },
  'geometry/compact/row-heights-agree': {
    why: 'P2 — input and select stand 7.59px taller than the button beside them.',
    shortfall: 6.59,
  },
  'geometry/textarea/tracks-density': {
    why: 'P5 — .weft-textarea min-height is a hardcoded 96px and tracks no token at any tier.',
    shortfall: 1,
  },

  // ── States (P2) ───────────────────────────────────────────────────────────
  // Shortfall counts the controls whose two renderings did not separate.
  'states/disabled-renders-distinctly': {
    why:
      'P2 — .weft-input defines no disabled rule. A disabled field renders at opacity 1 with an ' +
      'unchanged background, visually identical to an editable one. The React Input does style ' +
      'both. The select separates by 7, under the 8 floor, on native UA dimming alone.',
    shortfall: 3,
  },
  'states/readonly-renders-distinctly': {
    why: 'P2 — .weft-input defines no read-only rule either.',
    shortfall: 2,
  },
  'states/disabled-differs-from-readonly': {
    why: 'P2 — neither state is styled, so the two are the same pixels.',
    shortfall: 2,
  },

  // ── Focus (P2, obscuring in P4) ───────────────────────────────────────────
  // The global rule is :where(...):focus-visible — the :where() contributes
  // nothing, so the whole selector is (0,1,0) and any author rule at class
  // specificity, declared later, replaces the ring with no error and no gate.
  // Shortfall counts ring pixels short of the quarter-perimeter threshold.
  'focus/author-shadow-class/indicator-survives': {
    why: 'P2 — an author box-shadow at class specificity deletes the ring outright: 0 of 40 ring pixels change.',
    shortfall: 10,
  },
  'focus/author-shadow-inline/indicator-survives': {
    why: 'P2 — an inline box-shadow deletes the ring outright: 0 of 40 ring pixels change.',
    shortfall: 10,
  },
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
  'boundary/light/compact/card': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/light/dense/paper': { why: 'P4 — under 3:1; best 1.30:1.', shortfall: 6 },
  'boundary/light/dense/cream': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/light/dense/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/dark/marketing/paper': { why: 'P4 — 5 of 12 cells under 3:1; best 1.38:1.', shortfall: 5 },
  'boundary/dark/marketing/cream': { why: 'P4 — under 3:1; best 1.51:1.', shortfall: 5 },
  'boundary/dark/marketing/card': { why: 'P4 — under 3:1.', shortfall: 5 },
  'boundary/dark/compact/paper': { why: 'P4 — 6 of 12 cells under 3:1.', shortfall: 6 },
  'boundary/dark/compact/cream': { why: 'P4 — under 3:1.', shortfall: 6 },
  'boundary/dark/compact/card': { why: 'P4 — under 3:1.', shortfall: 6 },
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
  'iframe/focus-survives-host-shadow-utility': {
    why:
      'P2 — the panel box-shadow utility in the adversarial fixture deletes the ring inside the ' +
      'frame, exactly as it does on the page, in both themes. This is the case that made the ' +
      'iframe harness worth building before anything changed.',
    shortfall: 2,
  },
  'iframe/boundary/light': { why: 'P4 — the same hairline inside the injected panel iframe.', shortfall: 2 },
  'iframe/boundary/dark': { why: 'P4 — the same hairline inside the injected panel iframe.', shortfall: 2 },
});

export type DefectKey = keyof typeof KNOWN_DEFECTS;
