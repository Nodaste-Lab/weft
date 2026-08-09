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
 * Usage: node scripts/serve-repo.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, relative, isAbsolute, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4318);

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
  const full = join(ROOT, path);
  const rel = relative(ROOT, full);
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
