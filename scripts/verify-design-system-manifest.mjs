#!/usr/bin/env node
// Verifies the Weft manifest against the package source of truth:
//   - every src/ui/*.tsx primitive appears in manifest.uiPrimitives (ordered)
//   - manifest paths point at the real files
//   - designSystemVersion and showcase component versions are semver
//   - designSystemVersion matches package.json version (one version, one truth)
// The app-coupled panelBuilder vocabulary lives in Heddle's
// src/design-system/panel-manifest.json, checked by scripts/verify-panel-manifest.mjs.

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/\/$/, '');
const manifestPath = join(ROOT, 'manifest.json');
const packageJsonPath = join(ROOT, 'package.json');
const uiDirectory = join(ROOT, 'src', 'ui');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function compareOrderedList(label, actual, expected) {
  const actualOnly = actual.filter((value) => !expected.includes(value));
  const expectedOnly = expected.filter((value) => !actual.includes(value));
  const orderMismatches = actual
    .map((value, index) => ({ value, index, expected: expected[index] }))
    .filter(({ value, expected: expectedValue }) => value === expectedValue ? false : expected.includes(value));

  if (!actualOnly.length && !expectedOnly.length && !orderMismatches.length) {
    return;
  }

  const lines = [
    `Design system manifest drift detected for ${label}.`,
    'The code is the source of truth (src/ui/*.tsx files); edit manifest.json by hand to match — there is no auto-fix mode.',
  ];
  if (actualOnly.length) {
    lines.push(`- Add to manifest: ${actualOnly.join(', ')}`);
  }
  if (expectedOnly.length) {
    lines.push(`- Remove from manifest: ${expectedOnly.join(', ')}`);
  }
  if (orderMismatches.length) {
    lines.push('- Reorder manifest entries to match the source of truth:');
    for (const mismatch of orderMismatches) {
      lines.push(`  ${mismatch.index + 1}. expected "${mismatch.value}" but found "${mismatch.expected}"`);
    }
  }
  fail(lines.join('\n'));
}

function readUiPrimitiveIds() {
  return readdirSync(uiDirectory)
    .filter((name) => name.endsWith('.tsx'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => name.replace(/\.tsx$/, ''));
}

function ensureUiPathsMatch(uiPrimitives) {
  const mismatches = uiPrimitives
    .map((entry) => {
      const expectedPath = `src/ui/${entry.id}.tsx`;
      return entry.path === expectedPath ? null : { id: entry.id, path: entry.path, expectedPath };
    })
    .filter(Boolean);

  if (!mismatches.length) {
    return;
  }

  fail([
    'UI primitive paths in manifest.json are out of sync.',
    ...mismatches.map((mismatch) => `- ${mismatch.id}: expected "${mismatch.expectedPath}" but found "${mismatch.path}"`),
  ].join('\n'));
}

// x.y.z with optional SemVer prerelease (-beta.1) and build (+sha) metadata.
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function ensureVersions(entries) {
  if (!SEMVER.test(manifest.designSystemVersion ?? '')) {
    fail(`designSystemVersion must be semver "x.y.z"; found "${manifest.designSystemVersion ?? '(none)'}".`);
  }
  if (manifest.designSystemVersion !== packageJson.version) {
    fail(`designSystemVersion (${manifest.designSystemVersion}) must equal package.json version (${packageJson.version}).`);
  }
  const missing = entries.filter((entry) => entry.showcase && !SEMVER.test(entry.version ?? ''));
  if (missing.length) {
    fail([
      'Showcase components must declare a semver `version` in manifest.json:',
      ...missing.map((entry) => `- ${entry.id}: "${entry.version ?? '(none)'}"`),
    ].join('\n'));
  }
}

// dist parity: every non-figma primitive must be re-exported by the committed
// src/index.ts barrel, or it ships in src/ but is absent from dist/.
function ensureBarrelParity(uiPrimitives) {
  const barrel = readFileSync(join(ROOT, 'src', 'index.ts'), 'utf8');
  const exported = new Set([...barrel.matchAll(/export \* from '\.\/ui\/([^']+)';/g)].map((m) => m[1]));
  const missing = uiPrimitives
    .map((entry) => entry.id)
    .filter((id) => !id.endsWith('.figma') && !exported.has(id));
  if (missing.length) {
    fail([
      'src/index.ts (the dist barrel) is missing manifest primitives:',
      ...missing.map((id) => `- export * from './ui/${id}';`),
    ].join('\n'));
  }
}

const manifestPrimitiveIds = manifest.uiPrimitives.map((entry) => entry.id);
const actualPrimitiveIds = readUiPrimitiveIds();

ensureUiPathsMatch(manifest.uiPrimitives);
ensureBarrelParity(manifest.uiPrimitives);
ensureVersions(manifest.uiPrimitives);
compareOrderedList('uiPrimitives', actualPrimitiveIds, manifestPrimitiveIds);

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Design system manifest is up to date.');
