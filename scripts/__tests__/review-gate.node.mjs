// Shell-level coverage for scripts/review-gate.sh.
//
// The gate has no unit seams — it is one bash script — so each case builds a
// throwaway git repo, runs the real script against a stub wrapper that returns
// VERDICT: CLEAN, and asserts on the review input the script actually generated.
// That is the artefact that gets shipped to an external reviewer, so it is the
// thing worth pinning.
//
// These exist because three real defects here all failed OPEN: a symlinked
// constraints file exfiltrated an arbitrary local file, a substring heading match
// selected the wrong section, and a fenced `##` line truncated the section — and
// every one of them still exited 0 with a CLEAN verdict.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, symlinkSync, readFileSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const GATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'review-gate.sh');

const WRAPPER = `#!/usr/bin/env bash
while [ $# -gt 0 ]; do
  case "$1" in --input) IN="$2"; shift 2;; --output) OUT="$2"; shift 2;; *) shift;; esac
done
cp "$IN" "$CAPTURE"
printf 'stub\\n\\nVERDICT: CLEAN\\n' > "$OUT"
`;

const sandboxes = [];
process.on('exit', () => {
  for (const dir of sandboxes) {
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ }
  }
});

/** Build a repo with a base commit on main and a feature branch that differs. */
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), 'review-gate-'));
  sandboxes.push(root);
  const repo = join(root, 'repo');
  mkdirSync(repo);

  const wrapper = join(root, 'wrapper.sh');
  writeFileSync(wrapper, WRAPPER);
  chmodSync(wrapper, 0o755);

  const git = (...args) => execFileSync('git', args, { cwd: repo, stdio: 'pipe' });
  git('init', '-q', '.');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  git('config', 'commit.gpgsign', 'false');
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ name: 'x', scripts: { test: 'true' } }));
  writeFileSync(join(repo, 'a.txt'), 'a\n');
  git('add', '-A');
  git('commit', '-qm', 'base');
  git('branch', '-M', 'main');
  git('checkout', '-qb', 'feature');
  writeFileSync(join(repo, 'a.txt'), 'a\nb\n');

  return {
    repo,
    wrapper,
    capture: join(root, 'capture.md'),
    write(rel, body) {
      const abs = join(repo, rel);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, body);
    },
    link(rel, target) {
      const abs = join(repo, rel);
      mkdirSync(dirname(abs), { recursive: true });
      symlinkSync(target, abs);
    },
    commit() {
      git('add', '-A');
      git('commit', '-qm', 'change');
    },
    /** Run the gate. Returns {status, stdout, stderr, input} — input is the generated review input, or null. */
    run(extraArgs = []) {
      // spawnSync, not execFileSync: stderr must be captured on success too, or a
      // refusal that exits 0 looks indistinguishable from a clean run.
      const res = spawnSync('bash', [GATE, '--base', 'main', '--wrapper', this.wrapper, ...extraArgs], {
        cwd: this.repo,
        env: { ...process.env, CAPTURE: this.capture },
        encoding: 'utf8',
      });
      let input = null;
      try { input = readFileSync(this.capture, 'utf8'); } catch { /* wrapper never ran */ }
      return { status: res.status, stdout: res.stdout ?? '', stderr: res.stderr ?? '', input };
    },
  };
}

/** The constraints block only, so assertions cannot accidentally match the diff body. */
function constraintsBlock(input) {
  const m = input?.match(/^Repo constraints that findings must respect \(from (.+?)\):\n([\s\S]*?)\n\nChanged files:/m);
  return m ? { source: m[1], body: m[2] } : null;
}

test('no constraints source: block omitted, no foreign rules injected', () => {
  const s = sandbox();
  s.commit();
  const r = s.run();
  assert.equal(r.status, 0);
  assert.equal(constraintsBlock(r.input), null);
  assert.ok(!r.input.includes('Repo constraints'));
});

test('symlinked .review-gate/constraints.md is refused, not followed', () => {
  const s = sandbox();
  const secret = join(s.repo, '..', 'secret.txt');
  writeFileSync(secret, 'BEGIN PRIVATE KEY sentinel-do-not-leak\n');
  s.link('.review-gate/constraints.md', secret);
  s.commit();
  const r = s.run();
  assert.equal(r.status, 1, 'an unsafe constraints file must be fatal, not a silent downgrade');
  assert.match(r.stderr, /symlink/i);
  assert.equal(r.input, null, 'a review was built despite the refusal');
});

test('symlinked AGENTS.md is refused too', () => {
  const s = sandbox();
  const secret = join(s.repo, '..', 'secret2.txt');
  writeFileSync(secret, '## Invariants\nsentinel-agents-leak\n');
  s.link('AGENTS.md', secret);
  s.commit();
  const r = s.run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /symlink/i);
  assert.equal(r.input, null);
});

test('a symlinked parent directory is refused', () => {
  const s = sandbox();
  const outside = join(s.repo, '..', 'outside');
  mkdirSync(outside, { recursive: true });
  writeFileSync(join(outside, 'constraints.md'), 'sentinel-parent-leak\n');
  s.link('.review-gate', outside);
  s.commit();
  const r = s.run();
  assert.equal(r.status, 1);
  assert.equal(r.input, null);
  assert.ok(!(r.input ?? '').includes('sentinel-parent-leak'));
});

test('explicit --constraints is operator intent and is honoured', () => {
  const s = sandbox();
  s.commit();
  const explicit = join(s.repo, '..', 'explicit.md');
  writeFileSync(explicit, '- rule from an explicit flag\n');
  const r = s.run(['--constraints', explicit]);
  assert.equal(r.status, 0);
  assert.match(constraintsBlock(r.input).body, /rule from an explicit flag/);
});

test('.review-gate/constraints.md wins over AGENTS.md', () => {
  const s = sandbox();
  s.write('AGENTS.md', '## Invariants\n- from agents\n');
  s.write('.review-gate/constraints.md', '- from the constraints file\n');
  s.commit();
  const r = s.run();
  const block = constraintsBlock(r.input);
  assert.equal(block.source, '.review-gate/constraints.md');
  assert.match(block.body, /from the constraints file/);
  assert.ok(!block.body.includes('from agents'));
});

test('heading is matched exactly, not by substring', () => {
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '## Why the invariant policy exists',
    'prose that is not the rule list',
    '',
    '## Hard invariants — breaking these breaks consumers',
    '- the real rule',
    '',
    '## Release',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run().input);
  assert.match(block.body, /the real rule/);
  assert.ok(!block.body.includes('prose that is not the rule list'), 'substring match selected the wrong section');
  assert.ok(!block.body.includes('unrelated'));
});

test('a ## line inside a fenced block does not truncate the section', () => {
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '## Invariants',
    '- first rule',
    '',
    '```bash',
    '## this is a shell comment, not a heading',
    'echo hi',
    '```',
    '',
    '- last rule',
    '',
    '## Release',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run().input);
  assert.match(block.body, /first rule/);
  assert.match(block.body, /last rule/, 'fenced ## truncated the section');
  assert.ok(!block.body.includes('unrelated'));
});

test('a nested shorter fence does not close the outer fence', () => {
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '## Invariants',
    '- first rule',
    '',
    '````markdown',            // four-backtick outer fence
    'Example of documenting a fence:',
    '```bash',                 // three backticks: NOT a close
    '## not a heading, still inside the outer fence',
    '```',
    '````',                    // this closes it
    '',
    '- last rule',
    '',
    '## Release',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run().input);
  assert.match(block.body, /first rule/);
  assert.match(block.body, /last rule/, 'a nested three-backtick fence closed the four-backtick fence');
  assert.ok(!block.body.includes('unrelated'));
});

test('a tilde fence inside a backtick fence does not close it', () => {
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '## Invariants',
    '- first rule',
    '',
    '```markdown',
    '~~~',
    '## not a heading',
    '~~~',
    '```',
    '',
    '- last rule',
    '',
    '## Release',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run().input);
  assert.match(block.body, /last rule/, 'a ~~~ line closed a ``` fence');
  assert.ok(!block.body.includes('unrelated'));
});

test('an indented ATX heading resolves end-to-end through the gate', () => {
  // Boundary and discovery rules are unit-tested in extract-constraints.node.mjs;
  // this proves the shell wiring actually reaches that scanner.
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '   ## Hard invariants',
    '- the indented rule',
    '',
    '  ## Release',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run().input);
  assert.ok(block, 'an indented heading yielded no constraints block');
  assert.match(block.body, /the indented rule/);
  assert.ok(!block.body.includes('unrelated'));
});

test('a closing fence with an info string does not truncate, end-to-end', () => {
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '## Invariants',
    '- first rule',
    '',
    '```',
    '```bash',
    '## not a heading',
    '```',
    '',
    '- last rule',
    '',
    '## Release',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run().input);
  assert.match(block.body, /last rule/);
  assert.ok(!block.body.includes('unrelated'));
});

test('--constraints-heading is a literal, not a regex', () => {
  const s = sandbox();
  s.write('AGENTS.md', [
    '# Repo',
    '',
    '## C rules',
    'the WRONG section',
    '',
    '## C++ rules',
    '- the right rule',
    '',
    '## Other',
    'unrelated',
    '',
  ].join('\n'));
  s.commit();
  const block = constraintsBlock(s.run(['--constraints-heading', 'C++ rules']).input);
  assert.match(block.body, /the right rule/);
  assert.ok(!block.body.includes('the WRONG section'), 'heading was interpreted as a regex');
});

test('a regex-metacharacter heading that matches nothing yields no block', () => {
  const s = sandbox();
  s.write('AGENTS.md', '# Repo\n\n## Invariants\n- a rule\n');
  s.commit();
  // '.*' must not match the Invariants heading by accident.
  const r = s.run(['--constraints-heading', '.*']);
  assert.equal(r.status, 0);
  assert.equal(constraintsBlock(r.input), null);
});

test('--constraints-heading selects a non-conventional heading', () => {
  const s = sandbox();
  s.write('AGENTS.md', '# Repo\n\n## House rules\n- the house rule\n\n## Other\nnope\n');
  s.commit();
  const block = constraintsBlock(s.run(['--constraints-heading', 'House rules']).input);
  assert.match(block.body, /the house rule/);
  assert.ok(!block.body.includes('nope'));
});

test('a scanner failure is fatal, not an empty constraints block', () => {
  // The scanner reserves exit 1 for "no such section" and anything else for a
  // real failure. Collapsing those would resume the review without the repo's
  // rules and still reach CLEAN. Simulated with a stand-in scanner that errors,
  // placed next to a copy of the gate so SCRIPT_DIR resolves to it.
  const s = sandbox();
  s.write('AGENTS.md', '# Repo\n\n## Invariants\n- a rule\n');
  s.commit();

  const fakeDir = join(s.repo, '..', 'fakebin');
  mkdirSync(fakeDir, { recursive: true });
  writeFileSync(join(fakeDir, 'extract-constraints.mjs'), 'console.error("boom"); process.exit(2);\n');
  const gateCopy = join(fakeDir, 'review-gate.sh');
  writeFileSync(gateCopy, readFileSync(GATE, 'utf8'));
  chmodSync(gateCopy, 0o755);

  const res = spawnSync('bash', [gateCopy, '--base', 'main', '--wrapper', s.wrapper], {
    cwd: s.repo,
    env: { ...process.env, CAPTURE: s.capture },
    encoding: 'utf8',
  });
  assert.equal(res.status, 1, 'a failing scanner did not stop the run');
  assert.match(res.stderr, /no parseable result/);
});

test('a missing sibling scanner is fatal, not a tolerated no-match', () => {
  // `exit` inside "$(...)" kills only the subshell, so a prerequisite failure
  // raised there arrives as plain status 1 — the same status the caller tolerates
  // as "no such section". The run then proceeds with no constraints and reaches
  // CLEAN. Prerequisites must therefore be checked outside the substitution.
  const s = sandbox();
  s.write('AGENTS.md', '# Repo\n\n## Invariants\n- a rule\n');
  s.commit();

  const lonely = join(s.repo, '..', 'lonely');
  mkdirSync(lonely, { recursive: true });
  const gateCopy = join(lonely, 'review-gate.sh');   // copied WITHOUT its sibling
  writeFileSync(gateCopy, readFileSync(GATE, 'utf8'));
  chmodSync(gateCopy, 0o755);

  const res = spawnSync('bash', [gateCopy, '--base', 'main', '--wrapper', s.wrapper], {
    cwd: s.repo,
    env: { ...process.env, CAPTURE: s.capture },
    encoding: 'utf8',
  });
  assert.equal(res.status, 1, 'a missing scanner did not stop the run');
  assert.match(res.stderr, /extract-constraints\.mjs is missing/);
  let built = true;
  try { readFileSync(s.capture, 'utf8'); } catch { built = false; }
  assert.equal(built, false, 'a review was built without the constraints it needed');
});

test('a missing node is fatal when AGENTS.md needs scanning', () => {
  const s = sandbox();
  s.write('AGENTS.md', '# Repo\n\n## Invariants\n- a rule\n');
  s.commit();
  // A PATH with the coreutils the script needs but no node. --gates sidesteps
  // gate discovery, which would otherwise need node for its own reasons.
  const res = spawnSync('bash', [GATE, '--base', 'main', '--wrapper', s.wrapper, '--gates', 'true'], {
    cwd: s.repo,
    env: { ...process.env, PATH: '/usr/bin:/bin', CAPTURE: s.capture },
    encoding: 'utf8',
  });
  assert.equal(res.status, 1, 'a missing node did not stop the run');
  assert.match(res.stderr, /node is required/);
});

test('an empty .review-gate/constraints.md is fatal, not silently skipped', () => {
  const s = sandbox();
  s.write('.review-gate/constraints.md', '');
  s.write('AGENTS.md', '# Repo\n\n## Invariants\n- would be a fallback\n');
  s.commit();
  const r = s.run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /empty/);
});

/** Run the gate from a copy placed beside a stand-in scanner. */
function withScanner(s, scannerSource) {
  const dir = join(s.repo, '..', `stand-in-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'extract-constraints.mjs'), scannerSource);
  const gateCopy = join(dir, 'review-gate.sh');
  writeFileSync(gateCopy, readFileSync(GATE, 'utf8'));
  chmodSync(gateCopy, 0o755);
  return spawnSync('bash', [gateCopy, '--base', 'main', '--wrapper', s.wrapper], {
    cwd: s.repo,
    env: { ...process.env, CAPTURE: s.capture },
    encoding: 'utf8',
  });
}

const AGENTS_WITH_RULES = '# Repo\n\n## Invariants\n- a rule\n';

test('a scanner with a syntax error is fatal, not a tolerated no-match', () => {
  // node exits 1 for a SyntaxError — the same status a benign "no section" once
  // used, which is why the exit status cannot be the channel.
  const s = sandbox();
  s.write('AGENTS.md', AGENTS_WITH_RULES);
  s.commit();
  const res = withScanner(s, 'this is not valid javascript {{{\n');
  assert.equal(res.status, 1, 'a scanner syntax error did not stop the run');
  assert.match(res.stderr, /no parseable result/);
});

test('a scanner throwing an uncaught exception is fatal', () => {
  const s = sandbox();
  s.write('AGENTS.md', AGENTS_WITH_RULES);
  s.commit();
  const res = withScanner(s, 'throw new Error("boom");\n');
  assert.equal(res.status, 1);
  assert.match(res.stderr, /no parseable result/);
});

test('a scanner that exits 0 with no trailer is fatal', () => {
  const s = sandbox();
  s.write('AGENTS.md', AGENTS_WITH_RULES);
  s.commit();
  const res = withScanner(s, 'process.stdout.write("- some plausible rules\\n"); process.exit(0);\n');
  assert.equal(res.status, 1, 'plausible output without a trailer was accepted');
  assert.match(res.stderr, /no parseable result/);
});

test('a scanner truncated mid-body is fatal', () => {
  const s = sandbox();
  s.write('AGENTS.md', AGENTS_WITH_RULES);
  s.commit();
  const res = withScanner(s, 'process.stdout.write("- half a rule\\n"); process.exit(1);\n');
  assert.equal(res.status, 1);
  assert.match(res.stderr, /no parseable result/);
});

test('a scanner reporting FOUND with an empty body is fatal', () => {
  const s = sandbox();
  s.write('AGENTS.md', AGENTS_WITH_RULES);
  s.commit();
  const res = withScanner(s, 'process.stdout.write("#__REVIEW_GATE_CONSTRAINTS__: FOUND\\n");\n');
  assert.equal(res.status, 1);
  assert.match(res.stderr, /empty body/);
});

test('a stand-in scanner reporting NONE is accepted as benign', () => {
  // Proves the fatal cases above are not simply "any stand-in fails".
  const s = sandbox();
  s.write('AGENTS.md', AGENTS_WITH_RULES);
  s.commit();
  const res = withScanner(s, 'process.stdout.write("#__REVIEW_GATE_CONSTRAINTS__: NONE\\n"); process.exit(1);\n');
  assert.equal(res.status, 0, 'a well-formed NONE was not accepted');
});

test('a large invariants section reaches the review input intact', () => {
  // End-to-end companion to the scanner's pipe-buffer test: review-gate.sh reads
  // the scanner through "$(...)", so a truncated stream would lose the trailer
  // and abort a valid run.
  const s = sandbox();
  const rule = `- ${'x'.repeat(200)}\n`;
  let agents = '# Repo\n\n## Invariants\n';
  while (agents.length < 200 * 1024) agents += rule;
  agents += '\n## Release\nunrelated\n';
  s.write('AGENTS.md', agents);
  s.commit();
  const r = s.run();
  assert.equal(r.status, 0, 'a large but valid AGENTS.md aborted the run');
  const block = constraintsBlock(r.input);
  assert.ok(block, 'no constraints block for a large section');
  assert.ok(block.body.length > 190 * 1024, `constraints truncated to ${block.body.length} bytes`);
  assert.ok(!block.body.includes('unrelated'));
});

test('a genuine no-match is not treated as a scanner failure', () => {
  const s = sandbox();
  s.write('AGENTS.md', '# Repo\n\n## Setup\nnothing matching here\n');
  s.commit();
  const r = s.run();
  assert.equal(r.status, 0, 'a section that simply is not there must not be fatal');
  assert.equal(constraintsBlock(r.input), null);
});

test('--mark-ready without --pr fails before the gates run', () => {
  const s = sandbox();
  s.commit();
  const r = s.run(['--mark-ready']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /--mark-ready needs --pr/);
  assert.ok(!r.stdout.includes('repo gates'), 'preflight ran after the gate battery');
  assert.equal(r.input, null, 'a review was built despite the preflight failure');
});

test('a dirty tree is refused', () => {
  const s = sandbox();
  s.commit();
  s.write('untracked.txt', 'x\n');
  const r = s.run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /working tree is dirty/);
});

test('missing wrapper names both overrides', () => {
  const s = sandbox();
  s.commit();
  const r = s.run(['--wrapper', '/nonexistent/run-review.sh']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /--wrapper/);
  assert.match(r.stderr, /REVIEW_GATE_WRAPPER/);
});
