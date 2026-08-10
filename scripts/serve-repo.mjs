#!/usr/bin/env node
/**
 * Static file server over the repository root — the fixture host for the
 * tests/contract/ suites.
 *
 * The specimen page links `../../css/weft.css` and `../../css/weft-components.css`
 * relatively, so it always reads the live files. Serving it needs an origin:
 * file:// would work for the stylesheet links today but is a Chromium policy
 * decision away from not doing, and the consumer-iframe suite needs a real
 * origin to be able to say anything about cross-document leakage.
 *
 * Dependency-free on purpose — this runs in the same job as the packed-artifact
 * check, and a test fixture that needs an install step is a fixture that gets
 * skipped.
 *
 * IT SERVES AN ALLOWLIST, NOT THE WORKTREE. Four paths is all the suites ever
 * request, so hosting the whole checkout — .git metadata, ignored scratch,
 * untracked local files, anything a developer happens to have lying about —
 * bought nothing and risked all of it, on a server CI and the release job both
 * run. With an exact allowlist, a traversal or symlink bug cannot matter:
 * there is nothing outside these four paths to reach. The containment check
 * below stays anyway, because one of these paths could itself become a symlink.
 *
 * Adding a path here is deliberate. If a suite needs a fifth file, that is a
 * line in this list and a moment's thought about why.
 *
 * Usage: node scripts/serve-repo.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream, realpathSync, statSync } from 'node:fs';
import { join, relative, isAbsolute, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// ROOT itself may sit under a symlink (a git worktree often does), so resolve it
// once and compare like with like.
const realRoot = realpathSync(ROOT);
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4318);

/** Every path the tests/contract/ suites fetch. Nothing else is served. */
const ALLOWED = new Set([
  '/docs/brand-package/input-specimens.html',   // the specimen fixture
  '/tests/contract/fixtures/consumer-host.html', // the injected-iframe fixture
  '/css/weft.css',                               // read live by the specimen page
  '/css/weft-components.css',                    // read live by the specimen page
]);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
};

const server = createServer((req, res) => {
  // Resolve inside ROOT only, and check containment with relative() rather than
  // a string prefix. `full.startsWith(ROOT)` looks equivalent and is not: it
  // also accepts a SIBLING directory whose name merely starts with the same
  // characters — `/…/input-ds-impl-secret/x` passes a prefix test against
  // `/…/input-ds-impl`. relative() answers the question actually being asked.
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!ALLOWED.has(path)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  const requested = join(ROOT, path);

  // Containment is checked on the RESOLVED path, not the lexical one. relative()
  // alone answers "does this string sit under ROOT", and statSync and
  // createReadStream both follow symlinks — so a symlink committed inside the
  // repo and pointing outside it would pass the string test and then be served.
  // realpath collapses the link first, so the check and the read agree about
  // which file they mean.
  let full;
  try {
    full = realpathSync(requested);
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  const rel = relative(realRoot, full);
  if (rel !== '' && (rel.startsWith('..') || isAbsolute(rel))) {
    res.writeHead(403).end('forbidden');
    return;
  }
  let stats;
  try {
    stats = statSync(full);
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  if (stats.isDirectory()) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(full)] ?? 'application/octet-stream',
    // The suites measure live CSS; a cached stylesheet would measure the
    // previous run's values after an edit.
    'cache-control': 'no-store',
  });
  createReadStream(full).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`serving ${ROOT} at http://127.0.0.1:${PORT}/`);
});
