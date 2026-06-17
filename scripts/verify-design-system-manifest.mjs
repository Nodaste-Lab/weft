#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/\/$/, '');
const manifestPath = join(ROOT, 'src', 'design-system', 'manifest.json');
const uiDirectory = join(ROOT, 'src', 'app', 'components', 'ui');
const panelTypesPath = join(ROOT, 'src', 'app', 'panel-builder', 'types.ts');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

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

  const lines = [`Design system manifest drift detected for ${label}.`];
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
      const expectedPath = `src/app/components/ui/${entry.id}.tsx`;
      return entry.path === expectedPath ? null : { id: entry.id, path: entry.path, expectedPath };
    })
    .filter(Boolean);

  if (!mismatches.length) {
    return;
  }

  fail([
    'UI primitive paths in src/design-system/manifest.json are out of sync.',
    ...mismatches.map((mismatch) => `- ${mismatch.id}: expected "${mismatch.expectedPath}" but found "${mismatch.path}"`),
  ].join('\n'));
}

function extractUnionMembers(source, typeName) {
  const match = source.match(new RegExp(`export type ${typeName} =([\\s\\S]*?);`));
  if (!match) {
    throw new Error(`Could not locate type union "${typeName}" in ${relative(ROOT, panelTypesPath)}`);
  }

  return Array.from(match[1].matchAll(/'([^']+)'/g)).map((entry) => entry[1]);
}

const SEMVER = /^\d+\.\d+\.\d+$/;

function ensureVersions(entries) {
  if (!SEMVER.test(manifest.designSystemVersion ?? '')) {
    fail(`designSystemVersion must be semver "x.y.z"; found "${manifest.designSystemVersion ?? '(none)'}".`);
  }
  const missing = entries.filter((entry) => entry.showcase && !SEMVER.test(entry.version ?? ''));
  if (missing.length) {
    fail([
      'Showcase components must declare a semver `version` in src/design-system/manifest.json:',
      ...missing.map((entry) => `- ${entry.id}: "${entry.version ?? '(none)'}"`),
    ].join('\n'));
  }
}

const manifestPrimitiveIds = manifest.uiPrimitives.map((entry) => entry.id);
const actualPrimitiveIds = readUiPrimitiveIds();

ensureUiPathsMatch(manifest.uiPrimitives);
ensureVersions(manifest.uiPrimitives);
compareOrderedList('uiPrimitives', actualPrimitiveIds, manifestPrimitiveIds);

const panelTypesSource = readFileSync(panelTypesPath, 'utf8');
compareOrderedList(
  'panelBuilder.blockTypes',
  extractUnionMembers(panelTypesSource, 'PanelBlockType'),
  manifest.panelBuilder.blockTypes,
);
compareOrderedList(
  'panelBuilder.previewTemplates',
  extractUnionMembers(panelTypesSource, 'PanelPreviewTemplate'),
  manifest.panelBuilder.previewTemplates,
);

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('Design system manifest is up to date.');
