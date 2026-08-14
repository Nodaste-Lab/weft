/**
 * Doctrine and code agree (P8, AC7).
 *
 * The Form inputs doctrine and the heuristics file are the documents a
 * consumer reads instead of the source. Every claim in them that names a
 * class or token must name one that ships; no rule may survive in a form an
 * amendment superseded; the source tags and the deliberately-open questions
 * must survive the merge — a convention presented as evidence is how the
 * next reviewer loses the argument they should have won (decision 6).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (...p) => readFileSync(join(ROOT, ...p), 'utf8');

const designSystem = read('docs', 'brand-package', '04-design-system.md');
const heuristics = read('docs', 'brand-package', '12-input-heuristics.md');
const componentsCss = read('css', 'weft-components.css');
const templatesCss = read('css', 'weft-templates.css');
const tokensCss = read('css', 'weft.css');

/** The Form inputs section — from its heading to the next h3-or-higher outside it. */
const formInputs = (() => {
  const start = designSystem.indexOf('### Form inputs');
  assert.ok(start >= 0, 'the Form inputs section must exist');
  return designSystem.slice(start);
})();

test('D1: every weft- class the doctrine names exists in the shipped CSS', () => {
  const problems = [];
  for (const doc of [
    ['04-design-system.md', formInputs],
    ['12-input-heuristics.md', heuristics],
  ]) {
    const [where, text] = doc;
    for (const m of text.matchAll(/`\.?(weft-[a-z-]+)`/g)) {
      const cls = m[1];
      if (cls.startsWith('weft-board')) continue; // template layer, own doc
      // A backticked name may ship as a class selector OR as a keyframes
      // animation (the async doctrine names `weft-pulse`, which is real but
      // is not a class). Either way it must exist — a keyframes reference
      // this misses would let prose cite an animation nothing defines.
      const shipsAsClass = componentsCss.includes(`.${cls}`) || templatesCss.includes(`.${cls}`);
      const shipsAsKeyframes =
        componentsCss.includes(`@keyframes ${cls}`) || templatesCss.includes(`@keyframes ${cls}`);
      if (!shipsAsClass && !shipsAsKeyframes) {
        problems.push(`${where} names ${cls}, which no shipped stylesheet defines as a class or keyframes`);
      }
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('D2: every --weft- token the doctrine names is declared', () => {
  const problems = [];
  for (const m of formInputs.matchAll(/`(--weft-[a-z-]+)`/g)) {
    if (!tokensCss.includes(`${m[1]}:`)) {
      problems.push(`04-design-system.md names ${m[1]}, which css/weft.css does not declare`);
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('D3: the class-name drift is settled — the section teaches shipped, prefixed names', () => {
  // The shipped CSS has been weft- prefixed throughout its life; the doctrine
  // carried unprefixed names plus a read-it-with-a-prefix disclaimer. The
  // merge settles it the only possible direction: the document corrects,
  // because the code cannot change without breaking consumers.
  const unprefixed = [];
  const KNOWN = [
    'input', 'textarea', 'select', 'checkbox', 'radio', 'field', 'field-label',
    'field-hint', 'field-group', 'req', 'checkbox-wrap', 'radio-wrap',
    'sr-only', 'sr-only-focusable', 'btn', 'search', 'switch', 'slider',
  ];
  for (const m of formInputs.matchAll(/`\.([a-z][a-z-]*)`/g)) {
    if (KNOWN.includes(m[1])) unprefixed.push(`.${m[1]}`);
  }
  assert.deepEqual(
    unprefixed,
    [],
    `the Form inputs section still teaches unprefixed names: ${[...new Set(unprefixed)].join(', ')}`,
  );
  assert.ok(
    !/unprefixed and the shipped CSS/.test(formInputs),
    'the read-it-with-a-prefix disclaimer must go with the drift it excused',
  );
});

test('D4: no claim survives that later phases falsified', () => {
  const problems = [];
  if (/recorded gap remains/i.test(formInputs)) {
    problems.push('the section still claims a recorded gap; the ratchet emptied at P5 (46/46)');
  }
  if (/hardcoded 96px/.test(formInputs)) {
    problems.push('the textarea floor is a token (96/80/72) since P5, not a hardcoded 96px');
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('D4b: every documented --input bridge mapping states the one that ships', () => {
  // DERIVED, not phrased: the first shape of D4 caught one stale sentence by
  // its exact wording and let "still maps to --weft-paper" survive two docs
  // over. The shipped mapping is read from css/weft.css, and any document
  // that states a mapping for the bridge pair must state that one — so the
  // guard follows the code wherever the bridge goes next, instead of chasing
  // yesterday's phrasing.
  const shipped = {};
  for (const name of ['--input', '--input-background']) {
    shipped[name] = new RegExp(`${name}:\\s*var\\((--weft-[\\w-]+)\\)`).exec(tokensCss)?.[1];
    assert.ok(shipped[name], `css/weft.css declares no ${name} bridge`);
  }
  const problems = [];
  for (const doc of ['04-design-system.md', '05-accessibility.md', '09-app-primitives.md', '12-input-heuristics.md']) {
    const text = read('docs', 'brand-package', doc);
    for (const [name, target] of Object.entries(shipped)) {
      // Any mapping-shaped statement: a table row, or prose with a mapping
      // verb — "maps to", "resolve(s) to", "points at/to", "reads", an arrow.
      // The first shape only knew tables and "maps to", so the LIVE sentence
      // ("resolve to …") could regress to --weft-paper unseen.
      for (const m of text.matchAll(new RegExp(`\`${name}\`[^|\\n]*\\|\\s*\`var\\((--weft-[\\w-]+)\\)\`|\`${name}\`[^.\\n]{0,80}?(?:maps? to|resolves? to|points? (?:at|to)|reads|→|->)[^.\\n]{0,60}?\`(--weft-[\\w-]+)\``, 'g'))) {
        const stated = m[1] ?? m[2];
        // A joint sentence ("--input and --input-background resolve to A and
        // B") captures the pair's first token for both names, so any member
        // of the shipped pair is accepted; only a token OUTSIDE the pair —
        // --weft-paper being the one that shipped wrong twice — fails.
        if (stated && !Object.values(shipped).includes(stated)) {
          problems.push(`${doc} states ${name} → ${stated}; the shipped bridge pair is ${Object.values(shipped).join(' / ')}`);
        }
      }
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('D5: no rule survives in a form an amendment superseded', () => {
  const problems = [];
  // Heuristic 4's final sentence is held for the asynchronous follow-up; the
  // merged doctrine may not publish it as a rule in force. It survives in the
  // heuristics file only as original rule text under A4's qualification.
  if (/[Nn]othing invalid persists past/.test(formInputs)) {
    problems.push("heuristic 4's held sentence appears in the merged doctrine");
  }
  // The borderless low-weight tier is ruled out by A2/A3.
  if (/filled background, no border/i.test(formInputs)) {
    problems.push('the borderless tier-3 wording appears in the merged doctrine');
  }
  // The 44px control-height wording is superseded by A1.
  if (/44px (minimum )?control height|controls? (must be|are) at least 44px/i.test(formInputs)) {
    problems.push('the superseded 44px control-height wording appears in the merged doctrine');
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('D6: the source tags and the argument structure survive', () => {
  for (const tag of ['[SC', '[R]', '[C]']) {
    assert.ok(heuristics.includes(tag), `the heuristics file lost its ${tag} source tags`);
  }
  assert.ok(
    /merged into|adopted/.test(heuristics.slice(0, 400)),
    'the heuristics frontmatter still says draft — the merge must update its status',
  );
  // The merged section points at the tagged argument rather than restating it.
  assert.ok(
    /12-input-heuristics/.test(formInputs),
    'the Form inputs section must link the heuristics file — the tags and amendments live there',
  );
});

test('D7: the three uncovered questions stay uncovered', () => {
  for (const q of ['Label alignment', 'Placeholder-as-label', 'reveal animation']) {
    assert.ok(
      heuristics.includes(q),
      `"${q}" left the uncovered list — deliberately open questions are added to, never quietly filled in`,
    );
  }
});

test('D8: the reason list in doctrine matches the shipped module', async () => {
  const { VISIBILITY_REASONS } = await import(
    join(ROOT, 'tooling', 'visibility-reasons.js')
  );
  for (const reason of VISIBILITY_REASONS) {
    assert.ok(
      heuristics.includes(`\`${reason}\``),
      `A6 does not name \`${reason}\` — the doctrine list has drifted from the module`,
    );
  }
  assert.ok(
    !/one of four reasons|four permitted strings/.test(heuristics),
    `the heuristics still count four reasons; the module ships ${VISIBILITY_REASONS.length}`,
  );
});
