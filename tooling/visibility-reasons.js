/**
 * The sanctioned always-visible reasons, shared across repositories —
 * Weft's own gallery/template/specimen gates and Heddle's panel validators
 * all import this module via `@nodaste-lab/weft/tooling/visibility-reasons`.
 * One definition so the list can never drift into two copied arrays; this
 * file must stay dependency-free and runnable in Node and browser bundles,
 * exactly like `raw-color-pattern.js`, whose precedent it follows.
 *
 * The rule (decision 2, heuristics amendment A6): quiet — trigger-then-field —
 * is the default on every surface, and a surface that ships an always-visible
 * field must declare WHY, from this enum. The list is the whole rule: an enum
 * is what makes "quiet by default" testable, where a judgement would not be.
 * The list was challenged as the heuristics invite and AMENDED by the owner
 * (Katie, 2026-08-11): `sequence` joined the original four. Future changes go
 * the same route — an owner call on the record, never a string quietly added
 * here.
 *
 * The reason lives with the SURFACE (gallery card, template, specimen
 * configuration — where a reviewer can see the surface), never on the
 * primitive: `Input` has no reason prop and the plain-CSS layer encodes none
 * (decisions 8 and 11). Whether a declared reason is HONEST is a
 * design-review judgement no test can make; the gates verify declaration.
 */

/**
 * Bump when the list's MEANING changes (a reason added, removed, or renamed) —
 * consumers may assert the version they built against.
 */
export const VISIBILITY_REASONS_VERSION = 2;

/**
 * The five sanctioned reasons:
 *  - `frequent`    — touched more than once per visit to the surface.
 *  - `comparative` — the value is only useful read alongside its siblings,
 *                    so hiding one hides the set.
 *  - `primary`     — the input is the surface's main job (a search page,
 *                    a command bar).
 *  - `live`        — typing changes what is already on screen, so hiding
 *                    the field hides the mechanism.
 *  - `sequence`    — the field is a step in a visible workflow, so hiding
 *                    the field hides where the user is in the flow
 *                    (added at version 2, owner call 2026-08-11).
 */
export const VISIBILITY_REASONS = Object.freeze([
  'frequent',
  'comparative',
  'primary',
  'live',
  'sequence',
]);

/** True when `value` is a sanctioned visibility reason. */
export function isVisibilityReason(value) {
  return typeof value === 'string' && VISIBILITY_REASONS.includes(value);
}

/**
 * Conformance fixture — the cross-repository contract in executable form.
 * Both sides' validators run these cases and must produce these verdicts;
 * one fixture, two runners, no shared CI job (decision 11). Add a case when
 * a validator disagreement is found, never remove one.
 */
export const VISIBILITY_REASON_CONFORMANCE = Object.freeze([
  Object.freeze({ value: 'frequent', valid: true }),
  Object.freeze({ value: 'comparative', valid: true }),
  Object.freeze({ value: 'primary', valid: true }),
  Object.freeze({ value: 'live', valid: true }),
  Object.freeze({ value: 'sequence', valid: true }),
  // The version-2 addition brings its own near-misses.
  Object.freeze({ value: 'Sequence', valid: false }),
  Object.freeze({ value: 'sequential', valid: false }),
  Object.freeze({ value: 'step', valid: false }),
  // Case matters: the enum is lowercase and a validator must not "helpfully"
  // normalize its way past the list.
  Object.freeze({ value: 'Frequent', valid: false }),
  Object.freeze({ value: 'FREQUENT', valid: false }),
  // Near-misses and pluralization.
  Object.freeze({ value: 'frequently', valid: false }),
  Object.freeze({ value: 'compare', valid: false }),
  Object.freeze({ value: 'main', valid: false }),
  // Whitespace is not trimmed away — the declaration must be exact.
  Object.freeze({ value: ' frequent', valid: false }),
  Object.freeze({ value: 'frequent ', valid: false }),
  // Emptiness and non-strings.
  Object.freeze({ value: '', valid: false }),
  Object.freeze({ value: null, valid: false }),
  Object.freeze({ value: undefined, valid: false }),
  Object.freeze({ value: 4, valid: false }),
  Object.freeze({ value: ['frequent'], valid: false }),
]);
