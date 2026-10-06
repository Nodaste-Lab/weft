#!/usr/bin/env node
/**
 * Last-edited dates per component, read from git so they can never go stale.
 * For each manifest primitive: the last commit touching its source, its doc
 * and its specimen file; for each react template: its source and fixture.
 * Writes site/generated/component-dates.json (gitignored). Runs before
 * site:dev and site:build. An uncommitted edit shows as "uncommitted".
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const dirty = new Set(
  git(['status', '--porcelain', '--untracked-files=all'])
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3).trim()),
);

function dateOf(path) {
  if (!path || !existsSync(join(ROOT, path))) return null;
  if (dirty.has(path)) return 'uncommitted';
  return git(['log', '-1', '--format=%cs', '--', path]) || null;
}

function latest(...dates) {
  const real = dates.filter(Boolean);
  if (real.includes('uncommitted')) return 'uncommitted';
  return real.sort().at(-1) ?? null;
}

const out = { generatedAt: new Date().toISOString().slice(0, 10), components: {}, templates: {} };

for (const p of manifest.uiPrimitives) {
  if (p.id.endsWith('.figma')) continue;
  const source = dateOf(p.path);
  const docs = dateOf(`docs/components/${p.id}.md`);
  const specimen = dateOf(`src/gallery/specimens/${p.category}.tsx`);
  out.components[p.id] = { source, docs, specimen, latest: latest(source, docs, specimen) };
}

for (const t of manifest.templates ?? []) {
  const source = dateOf(t.path);
  const fixture = t.fixture ? dateOf(t.fixture) : null;
  const docs = dateOf(t.docs);
  out.templates[t.id] = { source, fixture, docs, latest: latest(source, fixture, docs) };
}

mkdirSync(join(ROOT, 'site', 'generated'), { recursive: true });
writeFileSync(join(ROOT, 'site', 'generated', 'component-dates.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`component dates: ${Object.keys(out.components).length} components, ${Object.keys(out.templates).length} templates`);
