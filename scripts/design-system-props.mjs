#!/usr/bin/env node
/**
 * Workstream B / D2 — committed prop-contract snapshot + gate.
 *
 * The snapshot (src/design-system/props-snapshot.json) is the golden record of
 * every showcase component's public prop surface plus the version it was taken
 * at. It's what makes per-panel version pins trustworthy: if a component's
 * contract changes, the snapshot must change too, and a *breaking* change must
 * come with a major version bump.
 *
 *   node scripts/design-system-props.mjs            # verify (CI gate)
 *   node scripts/design-system-props.mjs --write     # regenerate the snapshot
 *
 * --write refuses to record a breaking surface change unless the component's
 * manifest `version` major was bumped (author-time guard). verify fails when the
 * committed snapshot doesn't match the live extraction (CI-time guard). Together:
 * you cannot land a contract change without an updated, reviewed snapshot, and
 * you cannot land a breaking one without a major bump.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { extractSurface } from './lib/component-prop-surface.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'src/design-system/manifest.json');
const SNAPSHOT = join(ROOT, 'src/design-system/props-snapshot.json');
const WRITE = process.argv.includes('--write');
// --force re-baselines past the breaking-change guard. Use ONLY when the
// EXTRACTOR itself changed (so the old snapshot is incomparable, not when a
// component's contract changed); the snapshot diff is reviewed in the PR.
const FORCE = process.argv.includes('--force');

const major = (v) => Number.parseInt(String(v).split('.')[0], 10);

function showcaseComponents() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  return manifest.uiPrimitives
    .filter((e) => e.showcase)
    .map((e) => ({ id: e.id, path: join(ROOT, e.path), version: e.version }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function liveSnapshot() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const components = {};
  for (const c of showcaseComponents()) components[c.id] = { version: c.version, surface: extractSurface(c.path) };
  return { designSystemVersion: manifest.designSystemVersion, components };
}

// Classify the surface change from `oldS` -> `newS`.
export function diffSurface(oldS, newS) {
  const breaking = [];
  const additive = [];
  const ov = oldS.variants ?? {}, nv = newS.variants ?? {};
  for (const g of Object.keys(ov)) {
    if (!(g in nv)) breaking.push(`variant group '${g}' removed`);
    else for (const k of ov[g]) if (!nv[g].includes(k)) breaking.push(`variant '${g}.${k}' removed`);
  }
  for (const g of Object.keys(nv)) {
    if (!(g in ov)) additive.push(`variant group '${g}' added`);
    else for (const k of nv[g]) if (!ov[g].includes(k)) additive.push(`variant '${g}.${k}' added`);
  }
  const op = oldS.props ?? {}, np = newS.props ?? {};
  for (const name of Object.keys(op)) {
    if (!(name in np)) { breaking.push(`prop '${name}' removed`); continue; }
    if (op[name].optional && !np[name].optional) breaking.push(`prop '${name}' became required`);
    const ou = op[name].union, nu = np[name].union;
    if (ou && nu) {
      for (const v of ou) if (!nu.includes(v)) breaking.push(`prop '${name}' value '${v}' removed`);
      for (const v of nu) if (!ou.includes(v)) additive.push(`prop '${name}' value '${v}' added`);
    } else if (!ou && nu) breaking.push(`prop '${name}' narrowed to a fixed value set`);
    else if (ou && !nu) additive.push(`prop '${name}' widened from a fixed value set`);
  }
  for (const name of Object.keys(np)) {
    if (name in op) continue;
    if (np[name].optional) additive.push(`prop '${name}' added (optional)`);
    else breaking.push(`required prop '${name}' added`);
  }
  for (const n of oldS.native ?? []) if (!(newS.native ?? []).includes(n)) breaking.push(`native element '${n}' removed`);
  return { breaking, additive };
}

const surfaceEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function runWrite() {
  const live = liveSnapshot();
  const prior = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, 'utf8')) : { components: {} };
  const violations = [];
  for (const [id, entry] of Object.entries(live.components)) {
    const old = prior.components?.[id];
    if (!old) continue;
    if (surfaceEqual(old.surface, entry.surface)) continue;
    const { breaking } = diffSurface(old.surface, entry.surface);
    if (breaking.length && major(entry.version) === major(old.version)) {
      violations.push(`  ${id} (v${old.version}): breaking contract change without a major bump:\n` + breaking.map((b) => `      - ${b}`).join('\n'));
    }
  }
  if (violations.length && !FORCE) {
    console.error('Refusing to write snapshot — breaking changes need a major version bump in manifest.json:\n' + violations.join('\n') + '\n(Use --force only if the EXTRACTOR changed, not a component contract.)');
    process.exit(1);
  }
  if (violations.length && FORCE) {
    console.warn('--force: re-baselining past the breaking-change guard for:\n' + violations.join('\n'));
  }
  writeFileSync(SNAPSHOT, JSON.stringify(live, null, 2) + '\n');
  console.log(`Wrote ${SNAPSHOT} (${Object.keys(live.components).length} components, DS v${live.designSystemVersion}).`);
}

function runVerify() {
  if (!existsSync(SNAPSHOT)) {
    console.error(`Missing ${SNAPSHOT}. Run: node scripts/design-system-props.mjs --write`);
    process.exit(1);
  }
  const committed = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
  const live = liveSnapshot();
  const problems = [];
  const breakingNoBump = [];
  const ids = new Set([...Object.keys(committed.components ?? {}), ...Object.keys(live.components)]);
  for (const id of [...ids].sort()) {
    const c = committed.components?.[id];
    const l = live.components[id];
    if (!l) { problems.push(`  ${id}: in snapshot but no longer a showcase component`); continue; }
    if (!c) { problems.push(`  ${id}: new showcase component missing from snapshot`); continue; }
    const sameSurface = surfaceEqual(c.surface, l.surface);
    if (sameSurface && c.version === l.version) continue;
    if (!sameSurface) {
      const { breaking } = diffSurface(c.surface, l.surface);
      if (breaking.length && major(c.version) === major(l.version)) {
        breakingNoBump.push(`  ${id} (v${c.version}): BREAKING contract change without a major bump:\n` + breaking.map((b) => `      - ${b}`).join('\n'));
      }
    }
    problems.push(`  ${id}: snapshot out of date (surface or version changed)`);
  }
  if (live.designSystemVersion !== committed.designSystemVersion) {
    problems.push(`  designSystemVersion: snapshot ${committed.designSystemVersion} != manifest ${live.designSystemVersion}`);
  }
  if (breakingNoBump.length) {
    console.error('Design-system prop-contract gate FAILED — breaking changes need a major version bump:\n' + breakingNoBump.join('\n') + '\n');
    process.exit(1);
  }
  if (problems.length) {
    console.error('Design-system prop-contract snapshot is out of date:\n' + problems.join('\n') + '\n\nRegenerate + commit: node scripts/design-system-props.mjs --write\n');
    process.exit(1);
  }
  console.log(`Prop-contract snapshot OK (${Object.keys(live.components).length} components, DS v${live.designSystemVersion}).`);
}

import { pathToFileURL } from 'node:url';
const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) {
  if (WRITE) runWrite();
  else runVerify();
}
