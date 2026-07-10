#!/usr/bin/env node
// Exports-map contract: pack the real tarball, install it into a temp dir,
// and resolve every specifier consumers rely on. Weft's pack-smoke checks
// file PRESENCE; this checks that the exports map actually serves them —
// an exports refactor must fail HERE, not in Heddle after a version bump.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Every specifier a consumer uses today. Add here when adding an export.
const SPECIFIERS = [
  '@nodaste-lab/weft/tokens.css',
  '@nodaste-lab/weft/theme.css',
  '@nodaste-lab/weft/components.css',
  '@nodaste-lab/weft/fonts.css',
  '@nodaste-lab/weft/index.css',
  '@nodaste-lab/weft/tailwind.css',
  '@nodaste-lab/weft/tooling/raw-colors',
  '@nodaste-lab/weft/manifest.json',
  '@nodaste-lab/weft/props-snapshot.json',
  '@nodaste-lab/weft/package.json',
  // ./src/* pattern — the deep-import surface Heddle builds on
  '@nodaste-lab/weft/src/ui/button.tsx',
  '@nodaste-lab/weft/src/ui/utils.ts',
  '@nodaste-lab/weft/src/gallery/DesignSystemUiGallery.tsx',
  '@nodaste-lab/weft/src/test-support/ds-assert.ts',
  // built entry ("." resolves via dist)
  '@nodaste-lab/weft',
];

const work = mkdtempSync(join(tmpdir(), 'weft-exports-'));
try {
  const packOut = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', work], { cwd: ROOT, encoding: 'utf8' }),
  );
  const tarball = join(work, packOut[0].filename);
  const consumer = join(work, 'consumer');
  mkdirSync(consumer);
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'probe', private: true }));
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts', tarball], {
    cwd: consumer, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });

  const probeRequire = createRequire(pathToFileURL(join(consumer, 'probe.js')).href);
  const failures = [];
  for (const spec of SPECIFIERS) {
    try {
      probeRequire.resolve(spec);
    } catch (error) {
      failures.push(`${spec} — ${error.code ?? error.message}`);
    }
  }

  // The tooling entry must be executable JS with the shared pattern.
  const tooling = await import(pathToFileURL(probeRequire.resolve('@nodaste-lab/weft/tooling/raw-colors')).href);
  if (!(tooling.RAW_COLOR_PATTERN instanceof RegExp)) {
    failures.push('tooling/raw-colors did not export RAW_COLOR_PATTERN as a RegExp');
  }

  if (failures.length) {
    console.error('Exports contract FAILED — consumers cannot resolve:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
  console.log(`Exports contract OK (${SPECIFIERS.length} specifiers resolve from the packed tarball).`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
