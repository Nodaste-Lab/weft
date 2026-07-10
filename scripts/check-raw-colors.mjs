#!/usr/bin/env node
// Raw-color gate for the standalone weft repo: no raw colors outside the
// token-definition files (css/theme.css, css/weft.css, css/tailwind.css).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findRawColors, isTokenFile } from '../tooling/raw-color-pattern.js';

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/\/$/, '');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full);
  }
  return out;
}

let bad = 0;
for (const file of [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'css'))]) {
  if (isTokenFile(file)) continue;
  if (/__tests__|\.test\./.test(file)) continue;
  for (const hit of findRawColors(readFileSync(file, 'utf8'))) {
    console.error(`${relative(ROOT, file)}:${hit.line} raw color ${hit.value}`);
    bad += 1;
  }
}

if (bad) {
  console.error(`\n${bad} raw color(s) outside the token files — use var(--weft-*) tokens.`);
  process.exit(1);
}
console.log('No raw colors outside the token-definition files.');
