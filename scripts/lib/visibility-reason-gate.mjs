/**
 * Weft's own always-visible gate (decisions 2, 8, 11 — AC9).
 *
 * Validates that every always-visible field on a shipped Weft surface is
 * covered by a declaration carrying sanctioned reasons. The reason list is
 * IMPORTED from the shared module and re-exported by identity — the
 * conformance suite asserts `GATE_REASON_LIST === VISIBILITY_REASONS`,
 * because a copied array that happens to match today is precisely the drift
 * the shared module exists to prevent.
 *
 * Heddle runs its own equivalent over panel surfaces in its own repository,
 * against the same module and the same conformance fixture. No claim is made
 * that one CI job gates both repositories; none does.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VISIBILITY_REASONS, isVisibilityReason } from '../../tooling/visibility-reasons.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DECLARATIONS_PATH = join(ROOT, 'scripts', 'visibility-declarations.json');

/** The imported array itself — identity is the drift guard's whole claim. */
export const GATE_REASON_LIST = VISIBILITY_REASONS;

export function loadDeclarations() {
  return JSON.parse(readFileSync(DECLARATIONS_PATH, 'utf8'));
}

/**
 * Validate the declarations document. Returns human-readable problems;
 * an empty array is a pass.
 */
export function validateDeclarations(decls) {
  const problems = [];
  const surfaces = Array.isArray(decls?.surfaces) ? decls.surfaces : null;
  if (!surfaces) return ['declarations must carry a `surfaces` array'];
  for (const entry of surfaces) {
    const where = entry.surface ?? '<unnamed surface>';
    if (!entry.surface) problems.push('a declaration is missing its `surface`');
    if (entry.scope !== 'surface' && entry.scope !== 'field') {
      problems.push(`${where}: scope must be "surface" or "field", got ${JSON.stringify(entry.scope)}`);
    }
    if (!Array.isArray(entry.reasons) || entry.reasons.length === 0) {
      problems.push(`${where}: an always-visible declaration with no reasons is the quiet default decaying — declare why, or make the surface quiet`);
    } else {
      for (const reason of entry.reasons) {
        if (!isVisibilityReason(reason)) {
          problems.push(
            `${where}: ${JSON.stringify(reason)} is not a sanctioned reason (the list is ${VISIBILITY_REASONS.join(', ')} — and the list is the whole rule)`,
          );
        }
      }
    }
    if (typeof entry.note !== 'string' || entry.note.trim() === '') {
      problems.push(`${where}: the argument for the reasons goes on the record — add a note`);
    }
  }
  return problems;
}

/**
 * Audit a surface's markup: every rendered form control must be covered by a
 * declaration — a surface-scope entry for the whole page, or a field-scope
 * entry named `<surfacePath>#<control-id>`. Returns problems; empty is a pass.
 */
/**
 * Every shipped HTML surface, enumerated from disk rather than from a list —
 * `docs/` is in `files`, so every page here reaches consumers. A new page
 * with an always-visible field is audited the day it lands, not the day
 * somebody remembers to extend a list. (The original gate audited exactly one
 * named page; the other declared surfaces were decoration a deleted
 * declaration would never have missed.)
 */
export function shippedHtmlSurfaces() {
  const dir = join(ROOT, 'docs', 'brand-package');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => `docs/brand-package/${f}`);
}

/**
 * Every declared surface must exist on disk. A declaration for a file that is
 * gone is a stale record wearing the shape of coverage.
 */
export function auditDeclarationTargets(decls) {
  const surfaces = Array.isArray(decls?.surfaces) ? decls.surfaces : [];
  const problems = [];
  for (const entry of surfaces) {
    const file = String(entry.surface ?? '').split('#')[0];
    if (file && !existsSync(join(ROOT, file))) {
      problems.push(`${entry.surface}: declared surface does not exist on disk — remove the stale declaration or restore the file`);
    }
  }
  return problems;
}

/**
 * Audit a React source surface: rendered Weft field components must be
 * covered the same way rendered HTML controls are. A source-level scan, not a
 * render — the gallery's job is showing every primitive, so the audit's job
 * is only proving that fact is DECLARED, not re-deriving it.
 */
export function auditJsxFields(source, surfacePath, decls) {
  const surfaces = Array.isArray(decls?.surfaces) ? decls.surfaces : [];
  const surfaceCovered = surfaces.some(
    (e) => e.scope === 'surface' && e.surface === surfacePath,
  );
  if (surfaceCovered) return [];
  const problems = [];
  const fieldRe = /<(Input|Textarea|SearchField|Select|Checkbox|RadioGroup|Switch|Slider)\b/g;
  const seen = new Set();
  let m;
  while ((m = fieldRe.exec(source)) !== null) seen.add(m[1]);
  for (const component of [...seen].sort()) {
    problems.push(
      `${surfacePath}: renders <${component}> with no always-visible declaration — quiet is the default; declare one of ${VISIBILITY_REASONS.join(', ')} for the surface, with the argument in its note`,
    );
  }
  return problems;
}

export function auditSurfaceFields(html, surfacePath, decls) {
  const surfaces = Array.isArray(decls?.surfaces) ? decls.surfaces : [];
  const surfaceCovered = surfaces.some(
    (e) => e.scope === 'surface' && e.surface === surfacePath,
  );
  if (surfaceCovered) return [];
  const problems = [];
  const controlRe = /<(input|select|textarea)\b[^>]*>/gi;
  let m;
  while ((m = controlRe.exec(html)) !== null) {
    const tag = m[0];
    if (/type\s*=\s*"hidden"/i.test(tag)) continue;
    const id = /\bid\s*=\s*"([^"]+)"/.exec(tag)?.[1] ?? '<no id>';
    const fieldCovered = surfaces.some(
      (e) => e.scope === 'field' && e.surface === `${surfacePath}#${id}`,
    );
    if (!fieldCovered) {
      problems.push(
        `${surfacePath}: always-visible <${m[1]}> "${id}" has no declaration — quiet is the default; declare one of ${VISIBILITY_REASONS.join(', ')} for the surface or the field, with the argument in its note`,
      );
    }
  }
  return problems;
}
