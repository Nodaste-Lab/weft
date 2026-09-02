/**
 * release-local.sh — the preflight refusals, exercised in a scratch repo.
 *
 * With Actions off, this script IS the release gate, so its refusals are the
 * contract: a release is cut only from a clean main that equals origin/main
 * and has changesets to consume. Each refusal is probed, and the happy path
 * is asserted with --check (preflight only), so no test ever runs the real
 * battery, versions, tags, pushes or publishes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCRIPT = join(ROOT, 'scripts', 'release-local.sh');

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
}

/** A scratch repo on main with a bare origin, one commit, and one changeset. */
function scratchRepo({ changeset = true } = {}) {
  const base = mkdtempSync(join(tmpdir(), 'weft-release-local-'));
  const origin = join(base, 'origin.git');
  const repo = join(base, 'repo');
  execFileSync('git', ['init', '-q', '--bare', '--initial-branch=main', origin]);
  execFileSync('git', ['init', '-q', '--initial-branch=main', repo]);
  git(repo, 'config', 'user.email', 'test@example.com');
  git(repo, 'config', 'user.name', 'test');
  git(repo, 'remote', 'add', 'origin', origin);
  mkdirSync(join(repo, 'scripts'));
  cpSync(SCRIPT, join(repo, 'scripts', 'release-local.sh'));
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ name: '@nodaste-lab/weft', version: '0.0.1' }));
  mkdirSync(join(repo, '.changeset'));
  writeFileSync(join(repo, '.changeset', 'README.md'), '# changesets\n');
  if (changeset) writeFileSync(join(repo, '.changeset', 'one.md'), '---\n"@nodaste-lab/weft": minor\n---\n\nsomething\n');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'init');
  git(repo, 'push', '-q', '-u', 'origin', 'main');
  return repo;
}

function check(repo, ...flags) {
  const r = spawnSync('bash', [join(repo, 'scripts', 'release-local.sh'), '--check', ...flags], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PATH: process.env.PATH },
  });
  return { code: r.status, out: r.stdout + r.stderr };
}

test('a clean main that equals origin/main with a changeset is releasable', () => {
  const repo = scratchRepo();
  const r = check(repo);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /changesets:\s+\S*one\.md/);
});

test('refuses a branch that is not main', () => {
  const repo = scratchRepo();
  git(repo, 'checkout', '-q', '-b', 'feature');
  const r = check(repo);
  assert.equal(r.code, 1);
  assert.match(r.out, /releases are cut from 'main'/);
});

test('refuses a dirty tree — a release describes an immutable commit', () => {
  const repo = scratchRepo();
  writeFileSync(join(repo, 'stray.txt'), 'x');
  const r = check(repo);
  assert.equal(r.code, 1);
  assert.match(r.out, /dirty tree/);
});

test('refuses when HEAD is not origin/main (unpushed or unpulled work)', () => {
  const repo = scratchRepo();
  writeFileSync(join(repo, 'more.txt'), 'x');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'local only');
  const r = check(repo);
  assert.equal(r.code, 1);
  assert.match(r.out, /not origin\/main/);
});

test('refuses when there is nothing to release (no changesets)', () => {
  const repo = scratchRepo({ changeset: false });
  const r = check(repo);
  assert.equal(r.code, 1);
  assert.match(r.out, /no changesets/);
});

test('--publish-only does not require changesets (a retry of step 5)', () => {
  const repo = scratchRepo({ changeset: false });
  const r = check(repo, '--publish-only');
  assert.equal(r.code, 0, r.out);
});

test('an unknown flag is refused, never ignored', () => {
  const repo = scratchRepo();
  const r = check(repo, '--yolo');
  assert.equal(r.code, 64);
});
