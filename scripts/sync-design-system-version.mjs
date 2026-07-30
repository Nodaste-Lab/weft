#!/usr/bin/env node
// Mirror package.json's version into the design-system contract files.
//
// Weft carries the version in four places: package.json plus three contract
// mirrors (manifest.designSystemVersion, props-snapshot.designSystemVersion,
// tokens-snapshot.designSystemVersion). `npm run verify` and `npm run props`
// enforce that they agree.
//
// Changesets owns the version bump, but it only rewrites package.json — it knows
// nothing about the mirrors. Left alone, the generated "Version Packages" PR
// therefore fails this repo's own version-integrity gates and nothing can publish.
// The release workflow runs this immediately after `changeset version` to close
// that gap. Safe to run any time: it is a no-op when everything already agrees.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/\/$/, '');
const read = (f) => JSON.parse(readFileSync(join(ROOT, f), 'utf8'));

const version = read('package.json').version;
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`sync-design-system-version: package.json version "${version}" is not semver.`);
  process.exit(1);
}

const MIRRORS = [
  ['manifest.json', 'designSystemVersion'],
  ['props-snapshot.json', 'designSystemVersion'],
  ['tokens-snapshot.json', 'designSystemVersion'],
];

let changed = 0;
for (const [file, key] of MIRRORS) {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  const data = JSON.parse(raw);
  if (data[key] === version) continue;
  // Rewrite the single field textually so the rest of the file — key order and
  // formatting — stays byte-identical. These files are reviewed as diffs.
  const pattern = new RegExp(`("${key}"\\s*:\\s*)"[^"]*"`);
  if (!pattern.test(raw)) {
    console.error(`sync-design-system-version: could not find "${key}" in ${file}.`);
    process.exit(1);
  }
  writeFileSync(join(ROOT, file), raw.replace(pattern, `$1"${version}"`));
  console.log(`  ${file}: ${data[key]} -> ${version}`);
  changed += 1;
}

// package-lock records the version twice: top level and the root package entry.
const lockPath = join(ROOT, 'package-lock.json');
const lockRaw = readFileSync(lockPath, 'utf8');
const lock = JSON.parse(lockRaw);
if (lock.version !== version) {
  let next = lockRaw.replace(/("version"\s*:\s*)"[^"]*"/, `$1"${version}"`);
  if (lock.packages?.['']?.version && lock.packages[''].version !== version) {
    // The root package entry is the second "version" occurrence in `packages[""]`.
    next = next.replace(/("":\s*\{[^}]*?"version"\s*:\s*)"[^"]*"/, `$1"${version}"`);
  }
  writeFileSync(lockPath, next);
  console.log(`  package-lock.json: ${lock.version} -> ${version}`);
  changed += 1;
}

console.log(
  changed
    ? `Synced ${changed} file(s) to v${version}.`
    : `All version mirrors already agree with package.json (v${version}).`,
);
