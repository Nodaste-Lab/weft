/**
 * The packed tarball carries the whole contract.
 *
 * This check existed before, as eleven lines of inline YAML in
 * .github/workflows/ci.yml asserting seven paths. That version could not be run
 * locally, was not in the gate battery, and so was invisible to the double-clean
 * review loop — a gate you cannot run before pushing is a gate that tells you
 * after it is too late. It moves here, and it grows two teeth:
 *
 *   1. Every contract file is asserted BY EXACT PATH, not by prefix. `css/`
 *      being present says nothing about which files are in it.
 *   2. Every literal target in the exports map is asserted to be packed.
 *      scripts/check-exports-contract.mjs proves specifiers RESOLVE from an
 *      installed tarball, which is the stronger check of the two — but it
 *      installs the tarball, so a missing file shows up as a resolution error
 *      with no clue which entry caused it. This one names the file.
 *
 * Deliberately no `npm install`: this runs on every gate invocation, and the
 * exports contract already pays that cost once.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/**
 * Every file a consumer depends on, by exact path.
 *
 * Heddle deep-imports `@nodaste-lab/weft/src/ui/<id>` and its Tailwind build
 * scans `src/**` through this package's own @source directive; plan-reviewer
 * vendors css/weft.css by copy; Heddle's Node gates AND its browser panel
 * validator both import the raw-colour module. Dropping any of these builds
 * fine here and breaks a consumer.
 */
const CONTRACT_FILES = [
  // The token and component layers Heddle injects verbatim into panel iframes.
  'css/weft.css',
  'css/weft-components.css',
  'css/weft-templates.css',
  'css/theme.css',
  'css/fonts.css',
  'css/tailwind.css',
  'css/index.css',
  // The shared rule Heddle's gates and its panel validator both import, so the
  // raw-colour pattern cannot fork between the two repositories.
  'tooling/raw-color-pattern.js',
  // Contract artifacts that move in lockstep with any surface change.
  'manifest.json',
  'props-snapshot.json',
  // Added with this assertion rather than after it: the token-value lockfile was
  // consistently unshipped — absent from files, exports and the old pack smoke
  // alike. Scheduling the test and the fix apart would have left the suite red
  // for six phases.
  'tokens-snapshot.json',
  // The deep-import surface, sampled at the entries the exports contract also
  // resolves.
  'src/ui/button.tsx',
  'src/ui/utils.ts',
  'src/gallery/DesignSystemUiGallery.tsx',
  'src/test-support/ds-assert.ts',
  // The built entry that "." resolves to.
  'dist/index.js',
];

function packedFiles() {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(out)[0].files.map((f) => f.path);
}

test('the build has run — the tarball must carry a real dist entry', () => {
  assert.ok(
    existsSync(join(ROOT, 'dist', 'index.js')),
    'dist/index.js is missing. Run `npm run build` first; the packed tarball must contain the ' +
      'built entry, and a pack check against a stale tree proves nothing.',
  );
});

test('every contract file is in the tarball, by exact path', () => {
  const files = new Set(packedFiles());
  const missing = CONTRACT_FILES.filter((f) => !files.has(f));
  assert.deepEqual(
    missing,
    [],
    `Missing from the tarball:\n${missing.map((f) => `  - ${f}`).join('\n')}\n` +
      `The tarball carried ${files.size} files. A prefix check would have passed this.`,
  );
});

test('every literal exports-map target is in the tarball', () => {
  const files = new Set(packedFiles());
  const targets = [];
  for (const [specifier, value] of Object.entries(pkg.exports ?? {})) {
    // `./src/*` is a pattern; its members are covered by the sampled deep
    // imports above and, exhaustively, by check-exports-contract.mjs.
    if (specifier.includes('*')) continue;
    const target = typeof value === 'string' ? value : value?.default;
    if (typeof target === 'string') targets.push([specifier, target.replace(/^\.\//, '')]);
  }
  assert.ok(targets.length > 5, 'the exports map has almost no literal targets — has it been rewritten?');

  const broken = targets.filter(([, target]) => !files.has(target));
  assert.deepEqual(
    broken.map(([specifier, target]) => `${specifier} → ${target}`),
    [],
    'The exports map promises files the tarball does not carry. A consumer sees this as an ' +
      'unresolvable specifier after a version bump, with nothing pointing at the cause.',
  );
});

test('the token-value lockfile ships', () => {
  // Called out separately from the list above because it is the one entry that
  // is a deliberate change rather than a restatement of what already shipped.
  assert.ok(
    pkg.files.includes('tokens-snapshot.json'),
    'tokens-snapshot.json is not in package.json "files".',
  );
  assert.equal(
    pkg.exports['./tokens-snapshot.json'],
    './tokens-snapshot.json',
    'tokens-snapshot.json ships in "files" but the exports map does not serve it, so no ' +
      'consumer can import it. Shipping a file nobody can reach is not shipping it.',
  );
});
