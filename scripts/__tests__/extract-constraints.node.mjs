// Unit tests for the Markdown section scanner behind review-gate.sh.
//
// These are direct rather than end-to-end on purpose. The awk version this
// replaced could only be tested by building a git repo and running the whole
// gate, so each CommonMark rule it got wrong cost a full review round to find.
// Here a case is three lines.
//
// The failure mode being defended against is not a crash — it is the scanner
// silently returning a truncated section, an empty one, or the wrong one, while
// the gate goes on to report CLEAN.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSection, normalizeHeading, DEFAULT_HEADINGS, SENTINEL } from '../extract-constraints.mjs';

const CLI = join(dirname(fileURLToPath(import.meta.url)), '..', 'extract-constraints.mjs');

function runCli(body, args = []) {
  const dir = mkdtempSync(join(tmpdir(), 'extract-cli-'));
  const file = join(dir, 'AGENTS.md');
  writeFileSync(file, body);
  // maxBuffer well above spawnSync's 1MB default: the large-output test
  // deliberately exceeds it, and hitting the cap reports status null, which reads
  // like a crash rather than a harness limit.
  return spawnSync(process.execPath, [CLI, file, ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

const doc = (...lines) => lines.join('\n');

test('normalizeHeading strips emphasis, closing hashes, and trailing clauses', () => {
  assert.equal(normalizeHeading('Hard invariants'), 'hard invariants');
  assert.equal(normalizeHeading('**Hard invariants**'), 'hard invariants');
  assert.equal(normalizeHeading('Hard invariants ##'), 'hard invariants');
  assert.equal(normalizeHeading('Hard invariants — breaking these breaks consumers'), 'hard invariants');
  assert.equal(normalizeHeading('Hard invariants - and more'), 'hard invariants');
  assert.equal(normalizeHeading('Invariants: the list'), 'invariants');
  assert.equal(normalizeHeading('  Repo   invariants  '), 'repo invariants');
});

test('a hyphenated word in a heading is not treated as a trailing clause', () => {
  // " - " needs surrounding whitespace; "Cross-repo" must survive intact.
  assert.equal(normalizeHeading('Cross-repo invariants'), 'cross-repo invariants');
});

test('finds a plain section and stops at the next same-level heading', () => {
  const body = extractSection(doc(
    '# Repo', '', '## Setup', 'noise', '',
    '## Invariants', '- a rule', '', '## Release', 'unrelated', '',
  ));
  assert.equal(body, '- a rule');
});

test('keeps sub-headings inside the section', () => {
  const body = extractSection(doc(
    '## Invariants', '- a rule', '', '### Details', '- nested', '', '## Release', 'unrelated',
  ));
  assert.match(body, /### Details/);
  assert.match(body, /nested/);
  assert.ok(!body.includes('unrelated'));
});

test('exact match: a heading merely containing the word does not win', () => {
  const body = extractSection(doc(
    '## Why the invariant policy exists', 'WRONG', '',
    '## Hard invariants', '- right', '', '## Release', 'unrelated',
  ));
  assert.equal(body, '- right');
});

test('returns null when nothing matches', () => {
  assert.equal(extractSection(doc('# Repo', '', '## Setup', 'x')), null);
});

test('a ## inside a fence does not end the section', () => {
  const body = extractSection(doc(
    '## Invariants', '- first', '', '```bash', '## not a heading', '```', '', '- last', '',
    '## Release', 'unrelated',
  ));
  assert.match(body, /- first/);
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('a nested shorter fence does not close the outer fence', () => {
  const body = extractSection(doc(
    '## Invariants', '- first', '', '````markdown', '```bash', '## not a heading', '```', '````', '',
    '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('a tilde fence does not close a backtick fence', () => {
  const body = extractSection(doc(
    '## Invariants', '- first', '', '```markdown', '~~~', '## not a heading', '~~~', '```', '',
    '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('a closing fence may not carry an info string', () => {
  // ```bash inside an open ``` fence is content, not a close. If it closed the
  // fence, the following ## would end the section and "- last" would vanish.
  const body = extractSection(doc(
    '## Invariants', '- first', '', '```', '```bash', '## not a heading', '```', '',
    '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- first/);
  assert.match(body, /- last/, 'a fence line with an info string closed the fence');
  assert.ok(!body.includes('unrelated'));
});

test('a longer closing run is allowed; whitespace after it is allowed', () => {
  const body = extractSection(doc(
    '## Invariants', '- first', '', '```', 'code', '````   ', '', '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('an indented ATX heading (0-3 spaces) is recognized as the section start', () => {
  const body = extractSection(doc(
    '# Repo', '', '   ## Hard invariants', '- a rule', '', '## Release', 'unrelated',
  ));
  assert.equal(body, '- a rule');
});

test('an indented ATX heading is recognized as the section boundary', () => {
  const body = extractSection(doc(
    '## Invariants', '- a rule', '', '  ## Release', 'unrelated',
  ));
  assert.equal(body, '- a rule', 'an indented boundary heading did not end the section');
});

test('four spaces of indent is an indented code block, not a heading', () => {
  const body = extractSection(doc(
    '## Invariants', '- first', '', '    ## not a heading', '', '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('an indented fence is tracked', () => {
  const body = extractSection(doc(
    '## Invariants', '- first', '', '  ```', '  ## not a heading', '  ```', '',
    '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('a #-run with no space is not a heading', () => {
  // "##Invariants" is not an ATX heading in CommonMark.
  assert.equal(extractSection(doc('# Repo', '', '##Invariants', '- a rule')), null);
});

test('heading level governs the boundary: a deeper heading does not end it', () => {
  const body = extractSection(doc(
    '## Invariants', '- a rule', '', '#### Deep', 'still inside', '', '# Top', 'outside',
  ));
  assert.match(body, /still inside/);
  assert.ok(!body.includes('outside'));
});

test('a custom heading is matched literally, not as a pattern', () => {
  const md = doc('## C rules', 'WRONG', '', '## C++ rules', '- right', '', '## Other', 'unrelated');
  assert.equal(extractSection(md, { exact: 'C++ rules' }), '- right');
  assert.equal(extractSection(md, { exact: '.*' }), null);
});

test('an exact heading keeps its punctuation significant', () => {
  // The two sides once went through different normalizations: the file's heading
  // lost its colon clause while the operator's string kept it, so this returned
  // null for a heading the operator had copied verbatim.
  const md = doc('## Security: strict', '- the rule', '', '## Other', 'unrelated');
  assert.equal(extractSection(md, { exact: 'Security: strict' }), '- the rule');
});

test('an exact heading with a dash clause matches verbatim', () => {
  const md = doc('## Rules — the long form', '- the rule', '', '## Other', 'unrelated');
  assert.equal(extractSection(md, { exact: 'Rules — the long form' }), '- the rule');
});

test('exact matching ignores emphasis on either side', () => {
  assert.equal(
    extractSection(doc('## **Security**', '- a', '', '## Other', 'x'), { exact: 'Security' }),
    '- a',
  );
  assert.equal(
    extractSection(doc('## Security', '- a', '', '## Other', 'x'), { exact: '**Security**' }),
    '- a',
  );
});

test('exact matching does not silently fall back to clause trimming', () => {
  // "truly exact" means a partial heading is a miss, not a fuzzy hit.
  const md = doc('## Security: strict', '- the rule', '', '## Other', 'unrelated');
  assert.equal(extractSection(md, { exact: 'Security' }), null);
});

test('the alias path still tolerates a clause, which is why it is separate', () => {
  const md = doc('## Hard invariants — breaking these breaks consumers', '- the rule', '', '## Other', 'x');
  assert.equal(extractSection(md), '- the rule');
});

test('a backtick fence whose info string contains a backtick is not a fence', () => {
  // Per CommonMark this line is paragraph text; it must not open a fence and
  // swallow the rest of the document.
  const body = extractSection(doc(
    '## Invariants', '- first', '', '```js `x`', '', '- last', '', '## Release', 'unrelated',
  ));
  assert.match(body, /- last/);
  assert.ok(!body.includes('unrelated'));
});

test('an unterminated fence does not leak past the section', () => {
  const body = extractSection(doc('## Invariants', '- first', '', '```', 'code', '## Release', 'unrelated'));
  // The fence never closes, so everything after it is fence content and stays in
  // the section. What matters is that it terminates rather than throwing.
  assert.match(body, /- first/);
  assert.equal(typeof body, 'string');
});

test('the default heading set is the documented three', () => {
  assert.deepEqual(DEFAULT_HEADINGS, ['invariants', 'hard invariants', 'repo invariants']);
  for (const h of DEFAULT_HEADINGS) {
    const body = extractSection(doc(`## ${h}`, '- a rule', '', '## Other', 'unrelated'));
    assert.equal(body, '- a rule', `default heading "${h}" did not match`);
  }
});

test('CLI: a found section ends with the FOUND trailer', () => {
  const r = runCli('# Repo\n\n## Invariants\n- a rule\n');
  assert.equal(r.status, 0);
  const lines = r.stdout.trimEnd().split('\n');
  assert.equal(lines[lines.length - 1], `${SENTINEL} FOUND`);
  assert.equal(lines.slice(0, -1).join('\n'), '- a rule');
});

test('CLI: no matching section emits the NONE trailer, not silence', () => {
  const r = runCli('# Repo\n\n## Setup\nnothing here\n');
  assert.equal(r.stdout.trimEnd(), `${SENTINEL} NONE`);
  // The status is a hint only; the trailer is what the caller reads.
  assert.equal(r.status, 1);
});

test('CLI: a body line impersonating the trailer is refused', () => {
  const r = runCli(`# Repo\n\n## Invariants\n- a rule\n${SENTINEL} FOUND\n`);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /reserved/);
  assert.ok(!r.stdout.includes('FOUND'), 'emitted a forgeable trailer');
});

test('CLI: a section larger than the pipe buffer survives intact', () => {
  // process.exit() discards undrained async writes when stdout is a pipe — which
  // is exactly how review-gate.sh reads this. A body over the 64KiB pipe buffer
  // came through truncated with the trailer lost, aborting a valid review.
  const rule = `- ${'x'.repeat(200)}\n`;
  let body = '# Repo\n\n## Invariants\n';
  while (body.length < 1024 * 1024) body += rule;
  const r = runCli(body);
  assert.equal(r.status, 0);
  const lines = r.stdout.trimEnd().split('\n');
  assert.equal(lines[lines.length - 1], `${SENTINEL} FOUND`, 'trailer lost on a large body');
  assert.ok(r.stdout.length > 1024 * 1024, `output truncated to ${r.stdout.length} bytes`);
});

test('CLI: unusable input emits no trailer at all', () => {
  const r = spawnSync(process.execPath, [CLI, '/nonexistent/AGENTS.md'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.ok(!r.stdout.includes(SENTINEL), 'a failed run still emitted a conclusion');
});

test("this repo's own AGENTS.md still resolves", async () => {
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const { join, dirname } = await import('node:path');
  const agents = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'AGENTS.md');
  const body = extractSection(readFileSync(agents, 'utf8'));
  assert.ok(body, 'AGENTS.md no longer yields an invariants section');
  assert.match(body, /pure token file/);
  assert.match(body, /Byte-stability/);
  assert.ok(!body.includes('Release flow'), 'section ran past its boundary');
});
