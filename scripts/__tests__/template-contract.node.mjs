/**
 * Template-layer contract guard — fails closed across:
 *   CSS (weft-templates.css), generator source, generated HTML, canonical markdown
 *
 * Gates:
 *   T1-a  No custom property declarations in weft-templates.css
 *   T1-b  No raw hex/rgb/hsl color literals
 *   T1-c  Every var() ref resolves to an actually declared shipped CSS variable
 *          (weft.css + weft-components.css) — not prefix allowlisting
 *   T1-d  Zero deprecated board-duplicate class names in template CSS
 *   T1-e  Zero --hud-* var references in template CSS
 *   T2-a  Generated HTML exists and carries the GENERATED sentinel comment
 *   T2-b  Generator is deterministic: --output mode produces output byte-for-byte
 *          equal to the committed file (freshness check without self-mutation)
 *   T2-c  Generated HTML contains only real accessible controls
 *          (inputs/selects/textareas have associated labels; buttons have text or
 *          aria-label; no naked unlabelled interactive elements)
 *   T2-d  Generator source references no deprecated board-local class names
 *   T3    Canonical markdown exists and is non-empty
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { RAW_COLOR_PATTERN } from '../../tooling/raw-color-pattern.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const templateCss = readFileSync(join(ROOT, 'css', 'weft-templates.css'), 'utf8');
const stripped = templateCss.replace(/\/\*[\s\S]*?\*\//g, '');

// ── Shipped token inventory ──────────────────────────────────────────────────
// Collect every custom property actually declared in the shipped layers so we
// can verify references resolve, rather than just matching by namespace prefix.
function collectDeclaredTokens(cssText) {
  // Matches "  --foo-bar: value;" at the start of a property in any rule.
  return new Set([...cssText.matchAll(/^\s+(--[a-zA-Z][\w-]+)\s*:/gm)].map((m) => m[1]));
}
const weftTokens = collectDeclaredTokens(
  readFileSync(join(ROOT, 'css', 'weft.css'), 'utf8') +
  readFileSync(join(ROOT, 'css', 'weft-components.css'), 'utf8'),
);

// ── Deprecated board-local class list ───────────────────────────────────────
// These were board-local duplicates of canonical components; they must not
// appear in the template CSS (or generated HTML specimens) post-cleanup.
const DEPRECATED_BOARD_CLASSES = [
  // Retired in P7: the canonical .weft-checkbox-wrap took the choice-row
  // height, closing the reason this duplicate existed. The container
  // (.weft-board-checks) survives — the trailing 's' keeps it clear of the
  // word-boundary matcher — and the old -note suffix was renamed
  // .weft-board-note so the retired stem cannot ride back in on a hyphen.
  'weft-board-check',
  'weft-board-btn',
  'weft-board-status',
  'weft-board-type',
  'weft-board-dot',
  'weft-board-tier',
  'weft-board-notice',
  'weft-board-head',
  'weft-board-title',
  'weft-board-refresh',
  'weft-board-seg',
  'weft-board-space',
  'weft-board-evidence',
  'weft-board-rail-search',
  'weft-board-pick',
];

// ── CSS tests ────────────────────────────────────────────────────────────────

test('T1-a: weft-templates.css declares no custom properties of its own', () => {
  const declarations = [...stripped.matchAll(/(?<![a-z-])--[a-zA-Z][\w-]*\s*:/g)];
  assert.equal(
    declarations.length,
    0,
    `weft-templates.css must not declare custom properties — found: ${declarations.map((m) => m[0]).join(', ')}`,
  );
});

test('T1-b: weft-templates.css contains no raw hex/rgb/hsl color literals', () => {
  const lines = templateCss.split('\n');
  const hits = lines
    .map((line, i) => ({ line, i: i + 1 }))
    .filter(({ line }) => !line.trim().startsWith('*') && !line.trim().startsWith('/*'))
    .filter(({ line }) => RAW_COLOR_PATTERN.test(line));
  assert.equal(
    hits.length,
    0,
    `weft-templates.css has raw color literals:\n${hits.map(({ line, i }) => `  line ${i}: ${line.trim()}`).join('\n')}`,
  );
});

test('T1-c: every var() reference in weft-templates.css resolves to a declared shipped token', () => {
  // Allowed non-weft vars: structural shadcn/Tailwind flat tokens that the
  // template may consume from the host page (same allowlist as the components layer).
  const ALLOWED_NON_WEFT = new Set([
    '--radius-sm', '--radius-xs', '--radius-md', '--radius-lg',
    '--text-xs', '--text-sm', '--text-base',
    '--border', '--background', '--foreground',
    '--muted', '--muted-foreground',
    '--primary', '--primary-foreground',
    '--accent', '--accent-foreground',
    '--card', '--card-foreground',
    '--ring',
  ]);

  const varRefs = [...stripped.matchAll(/var\((--[a-zA-Z][\w-]*)/g)].map((m) => m[1]);
  const violations = varRefs.filter((ref) => {
    if (weftTokens.has(ref)) return false;       // declared in shipped layers
    if (ALLOWED_NON_WEFT.has(ref)) return false; // known flat tokens
    return true;
  });
  assert.equal(
    violations.length,
    0,
    `weft-templates.css references undeclared vars (not in weft.css or weft-components.css):\n${[...new Set(violations)].map((v) => `  ${v}`).join('\n')}`,
  );
});

test('T1-d: weft-templates.css contains zero deprecated board-duplicate class names', () => {
  const pattern = new RegExp(`\\.(${DEPRECATED_BOARD_CLASSES.join('|')})[\\s{,]`, 'g');
  const matches = [...stripped.matchAll(pattern)].map((m) => m[0].trim());
  assert.equal(
    matches.length,
    0,
    `weft-templates.css must not contain deprecated board-local classes:\n${[...new Set(matches)].map((m) => `  ${m}`).join('\n')}`,
  );
});

test('T1-e: weft-templates.css contains zero --hud-* var references', () => {
  const hudRefs = [...stripped.matchAll(/var\(--hud-[a-zA-Z][\w-]*/g)].map((m) => m[0]);
  assert.equal(
    hudRefs.length,
    0,
    `weft-templates.css must not reference --hud-* vars (use --weft-* instead):\n${[...new Set(hudRefs)].map((r) => `  ${r}`).join('\n')}`,
  );
});

// ── Generated HTML tests ─────────────────────────────────────────────────────

const generatedHtmlPath = join(ROOT, 'docs', 'brand-package', 'panel-templates.html');

test('T2-a: docs/brand-package/panel-templates.html exists and carries the GENERATED sentinel', () => {
  assert.ok(existsSync(generatedHtmlPath), 'panel-templates.html must exist');
  const html = readFileSync(generatedHtmlPath, 'utf8');
  assert.ok(
    html.includes('GENERATED by scripts/generate-panel-templates-page.py'),
    'panel-templates.html must contain the GENERATED sentinel comment',
  );
});

test('T2-b: generator is deterministic — --output mode matches committed file', () => {
  const html = readFileSync(generatedHtmlPath, 'utf8');
  const sp = mkdtempSync(join(tmpdir(), 'weft-gen-'));
  const outFile = join(sp, 'panel-templates-check.html');
  execFileSync('python3', [
    join(ROOT, 'scripts', 'generate-panel-templates-page.py'),
    ROOT, sp, '--output', outFile,
  ]);
  const generated = readFileSync(outFile, 'utf8');
  assert.equal(
    generated,
    html,
    'Generator output does not match the committed docs/brand-package/panel-templates.html. Run: python3 scripts/generate-panel-templates-page.py . <scratchpad>',
  );
});

// ── One primary per action row ───────────────────────────────────────────────
// Katie's rule, 2026-08: exactly one filled .weft-btn in an action row. Two
// filled buttons make the operator choose between them instead of acting.
// Caught by eye on the published page, where three specimens taught the wrong
// pattern — including the copy-paste DOM contract in the markdown. The rule is
// only worth stating if the reference material can't drift from it again, so it
// is checked in both the generated page and the documented skeleton.
const PRIMARY_BTN = /<button[^>]*\bclass="([^"]*\bweft-btn\b[^"]*)"/gi;
const NON_PRIMARY = /\bis-(ghost|link|outline|quiet|secondary)\b/;

function actionRowViolations(text, label) {
  const rows = [...text.matchAll(
    /<div[^>]*class="[^"]*weft-action-button-row(?![-\w])[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|$)/gi,
  )];
  return rows.flatMap((row) => {
    const classes = [...row[1].matchAll(PRIMARY_BTN)].map((m) => m[1]);
    const primaries = classes.filter((c) => !NON_PRIMARY.test(c));
    if (primaries.length <= 1) return [];
    const line = text.slice(0, row.index ?? 0).split('\n').length;
    return [`${label}:${line} — ${primaries.length} filled .weft-btn in one action row (${classes.join(' | ')})`];
  });
}

test('T2-e: action rows carry exactly one primary button', () => {
  const violations = [
    ...actionRowViolations(readFileSync(generatedHtmlPath, 'utf8'), 'panel-templates.html'),
    ...actionRowViolations(
      readFileSync(join(ROOT, 'docs', 'brand-package', '11-panel-templates.md'), 'utf8'),
      '11-panel-templates.md',
    ),
  ];
  assert.deepEqual(
    violations,
    [],
    `Action rows must have exactly one filled .weft-btn; every sibling is .is-ghost or .is-link.\n${violations.join('\n')}`,
  );
});

test('T2-e regression: the guard actually catches a second primary', () => {
  const twoPrimaries =
    '<div class="weft-action-button-row">' +
    '<button class="weft-btn" type="button">Resolve</button>' +
    '<button class="weft-btn" type="button">Reassign</button>' +
    '</div>';
  assert.equal(actionRowViolations(twoPrimaries, 'fixture').length, 1);

  const onePrimary = twoPrimaries.replace('weft-btn" type="button">Reassign', 'weft-btn is-ghost" type="button">Reassign');
  assert.deepEqual(actionRowViolations(onePrimary, 'fixture'), []);

  // A trailing link is not a second primary, and the trailing wrapper class
  // must not be mistaken for the row itself.
  const withTrailing =
    '<div class="weft-action-button-row">' +
    '<button class="weft-btn" type="button">Resolve</button>' +
    '<span class="weft-action-button-row-trailing"><button class="weft-btn is-link" type="button">Open</button></span>' +
    '</div>';
  assert.deepEqual(actionRowViolations(withTrailing, 'fixture'), []);

  // Zero primaries is deliberately allowed, not an oversight. The rule is a
  // ceiling, not a quota: .weft-action-button-row is also the container for
  // peer-action toolbars (Copy / Email / Vault / Generate — 09-app-primitives.md
  // §action-button-row), where every control is a ghost and none is *the*
  // action. Requiring exactly one would fail that documented use.
  const allGhost =
    '<div class="weft-action-button-row">' +
    '<button class="weft-btn is-ghost" type="button">Copy</button>' +
    '<button class="weft-btn is-ghost" type="button">Email</button>' +
    '<button class="weft-btn is-ghost" type="button">Vault</button>' +
    '</div>';
  assert.deepEqual(actionRowViolations(allGhost, 'fixture'), []);
});

test('T2-c: generated HTML contains only real accessible controls', () => {
  const html = readFileSync(generatedHtmlPath, 'utf8');

  // Every <input> must have an aria-label, a matching <label for="…">, or be
  // wrapped inside a <label> element (the label-wrap association pattern).
  const inputMatches = [...html.matchAll(/<input[^>]*>/gi)];
  const inputViolations = inputMatches.filter((m) => {
    const tag = m[0];
    const offset = m.index ?? 0;
    // Hidden inputs need no label
    if (/type=["']hidden["']/i.test(tag)) return false;
    if (/aria-label=/i.test(tag)) return false;
    if (/id=["']([^"']+)["']/i.test(tag)) {
      const id = tag.match(/id=["']([^"']+)["']/i)?.[1];
      if (id && (html.includes(`for="${id}"`) || html.includes(`for='${id}'`))) return false;
    }
    // Accept label-wrap: a <label …> opened within 300 chars before this input
    // and not yet closed (i.e. the input sits inside the label element).
    const preceding = html.slice(Math.max(0, offset - 300), offset);
    const lastLabelOpen = preceding.lastIndexOf('<label');
    const lastLabelClose = preceding.lastIndexOf('</label>');
    if (lastLabelOpen >= 0 && lastLabelOpen > lastLabelClose) return false;
    return true;
  });
  assert.equal(
    inputViolations.length,
    0,
    `Generated HTML has unlabelled <input> elements:\n${inputViolations.map((m) => `  ${m[0]}`).join('\n')}`,
  );

  // Every <select> must have an aria-label or a matching <label for="…">
  const selectMatches = [...html.matchAll(/<select[^>]*>/gi)];
  const selectViolations = selectMatches.filter((m) => {
    const tag = m[0];
    if (/aria-label=/i.test(tag)) return false;
    if (/id=["']([^"']+)["']/i.test(tag)) {
      const id = tag.match(/id=["']([^"']+)["']/i)?.[1];
      if (id && (html.includes(`for="${id}"`) || html.includes(`for='${id}'`))) return false;
    }
    return true;
  });
  assert.equal(
    selectViolations.length,
    0,
    `Generated HTML has unlabelled <select> elements:\n${selectViolations.map((m) => `  ${m[0]}`).join('\n')}`,
  );

  // Every <button> without visible text must have an aria-label
  // Body may contain nested markup: an icon-only <button><svg/></button> is the
  // exact case this guard exists for, and [^<]* would skip it entirely.
  const buttonMatches = [...html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/gi)];
  const buttonViolations = buttonMatches.filter((m) => {
    const attrs = m[1];
    const inner = m[2].trim();
    // Strip tags before asking whether there is visible text, so an icon-only
    // button counts as empty rather than as labelled by its <svg>.
    const visible = inner.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, '').trim();
    if (visible.length > 0) return false;        // has visible text
    if (/aria-label=/i.test(attrs)) return false; // has aria-label
    return true;
  });
  assert.equal(
    buttonViolations.length,
    0,
    `Generated HTML has empty <button> without aria-label:\n${buttonViolations.map((m) => `  ${m[0]}`).join('\n')}`,
  );

  // No deprecated board-local class names in specimen HTML
  const classPattern = new RegExp(`class="[^"]*\\b(${DEPRECATED_BOARD_CLASSES.join('|')})\\b`, 'g');
  const specimenViolations = [...html.matchAll(classPattern)].map((m) => m[0].slice(0, 80));
  assert.equal(
    specimenViolations.length,
    0,
    `Generated HTML specimen uses deprecated board classes:\n${[...new Set(specimenViolations)].map((s) => `  ${s}`).join('\n')}`,
  );
});

test('T2-e2: the shipped panel-templates markdown teaches no retired class', () => {
  // The retirement's missed callsite (P7 review round 1): the DOM-contract doc
  // still taught .weft-board-check after the CSS retired it. Docs ship in the
  // package, so a stale copyable skeleton is a consumer-facing regression.
  const md = readFileSync(join(ROOT, 'docs', 'brand-package', '11-panel-templates.md'), 'utf8');
  const pattern = new RegExp(`\\b(${DEPRECATED_BOARD_CLASSES.join('|')})\\b`, 'g');
  const hits = [...md.matchAll(pattern)].map((m) => m[0]);
  assert.deepEqual(
    [...new Set(hits)],
    [],
    `11-panel-templates.md still teaches retired classes: ${[...new Set(hits)].join(', ')}`,
  );
});

test('T2-d: generator source references no deprecated board-local class names in specimen strings', () => {
  const generatorSrc = readFileSync(
    join(ROOT, 'scripts', 'generate-panel-templates-page.py'),
    'utf8',
  );
  // Only flag class= attribute usage (not the DEPRECATED_BOARD_CLASSES list itself)
  const classPattern = new RegExp(`class=(?:"|')[^"']*\\b(${DEPRECATED_BOARD_CLASSES.join('|')})\\b`, 'g');
  const hits = [...generatorSrc.matchAll(classPattern)].map((m) => m[0].slice(0, 80));
  assert.equal(
    hits.length,
    0,
    `Generator source emits deprecated board classes in specimens:\n${[...new Set(hits)].map((h) => `  ${h}`).join('\n')}`,
  );
});

// ── Canonical markdown ───────────────────────────────────────────────────────

test('T2-e: no text-entry control in the template specimens is named by aria-label', () => {
  // The naming ladder sanctions aria-label for icon-only controls and nothing
  // else (docs/brand-package/04-design-system.md). These specimens are published
  // guidance, so a forbidden pattern here teaches it regardless of what the
  // prose says. Both offenders found by review already had a perfectly good
  // visible <label for>, and the aria-label was silently overriding it — on the
  // reply textarea with different words.
  //
  // Icon-only BUTTONS are the sanctioned case and are not matched here; nor are
  // role="group"/"region" containers, which are not form controls.
  const html = readFileSync(join(ROOT, 'docs', 'brand-package', 'panel-templates.html'), 'utf8');
  const offenders = [];
  for (const [, tag, attrs] of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    if (!/\baria-label="/.test(attrs)) continue;
    offenders.push(`<${tag} ${/\bid="([^"]+)"/.exec(attrs)?.[1] ?? '(no id)'}>`);
  }
  assert.deepEqual(
    offenders,
    [],
    `Template specimens naming a text-entry control with aria-label:\n  ${offenders.join('\n  ')}\n` +
      'Use a real <label>, hidden with .weft-sr-only where the surface cannot carry a visible one.',
  );
});

/**
 * Search-pattern containment scan, shared by T2-f (generated HTML) and T2-f2
 * (markdown skeleton). A real tag-walk with a div stack, NOT a proximity
 * window: the first shape of this guard looked backwards N chars/lines for
 * "weft-search", and its own probe proved that decorative — a bare input
 * pasted right AFTER a compliant recipe block sat inside the window and
 * passed. Containment is the actual rule, so containment is what's checked:
 * a type="search" input passes only if an ENCLOSING, still-open
 * .weft-search div holds it, and that div's subtree must also hold the
 * named clear button.
 */
function searchPatternProblems(text, where) {
  const problems = [];
  const tagRe = /<div\b[^>]*>|<\/div>|<input\b[^>]*>|<button\b[^>]*>/gi;
  // Each frame: { isSearch, sawSearchInput, sawNamedClear }
  const stack = [];
  const inSearch = () => stack.some((f) => f.isSearch);
  let m;
  while ((m = tagRe.exec(text)) !== null) {
    const tag = m[0];
    if (/^<div\b/i.test(tag)) {
      stack.push({
        isSearch: /class="[^"]*\bweft-search\b[^"]*"/.test(tag),
        sawSearchInput: false,
        sawNamedClear: false,
      });
    } else if (/^<\/div>/i.test(tag)) {
      const frame = stack.pop();
      if (frame?.isSearch && frame.sawSearchInput && !frame.sawNamedClear) {
        problems.push(`${where}: a .weft-search block carries a search input but no named .weft-search-clear button`);
      }
    } else if (/^<input\b/i.test(tag) && /type="search"/i.test(tag)) {
      if (!inSearch()) {
        problems.push(`${where}: bare type="search" outside .weft-search: ${tag.slice(0, 80)}`);
      } else {
        for (const f of stack) if (f.isSearch) f.sawSearchInput = true;
      }
    } else if (/^<button\b/i.test(tag) && /weft-search-clear/.test(tag)) {
      if (/aria-label="[^"]+"/.test(tag) && /type="button"/.test(tag)) {
        for (const f of stack) if (f.isSearch) f.sawNamedClear = true;
      }
    }
  }
  return problems;
}

test('T2-f: every search input on the shipped template page uses the stated pattern, not a bare type attribute', () => {
  // Search is a stated pattern (P7, document B §3). A bare
  // <input type="search"> on the page consumers copy from teaches the
  // superseded form — no named clear, no affordance — which is exactly how
  // the pattern decays back out of the product one paste at a time.
  const html = readFileSync(join(ROOT, 'docs', 'brand-package', 'panel-templates.html'), 'utf8');
  const problems = searchPatternProblems(html, 'panel-templates.html');
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('T2-f2: no shipped markdown teaches a bare search — every brand-package doc, from disk', () => {
  // T2-f covers the generated HTML; this covers every hand-written markdown
  // file that ships (docs/ is in `files`), enumerated from disk so a new doc
  // is scanned the day it lands — the same lesson the visibility audit and
  // this guard each learned once: a fixed filename list is coverage that
  // quietly stops covering. Same containment scan. Single-line inline-code
  // spans are stripped first: a prose row saying "real `<input
  // type="search">`" is a mention, not markup — while fenced skeletons keep
  // their lines intact (they carry no backticks) and stay fully scanned.
  const dir = join(ROOT, 'docs', 'brand-package');
  const docs = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  assert.ok(docs.length >= 5, `expected the shipped brand-package docs, found ${docs.length}`);
  const problems = [];
  for (const doc of docs) {
    const md = readFileSync(join(dir, doc), 'utf8');
    const prose = md.replace(/`[^`\n]*`/g, '');
    problems.push(...searchPatternProblems(prose, doc));
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('T3: docs/brand-package/11-panel-templates.md exists and is non-empty', () => {
  const mdPath = join(ROOT, 'docs', 'brand-package', '11-panel-templates.md');
  assert.ok(existsSync(mdPath), '11-panel-templates.md must exist');
  const content = readFileSync(mdPath, 'utf8');
  assert.ok(content.trim().length > 200, '11-panel-templates.md must contain substantive content');
});

// ── pure-token-file guard: the palette bridge must stay an allowlist ─────────
// Regression for review round 14. The bridge exemption was briefly a wildcard
// (`:root[data-palette="weft"] <anything>`), which would have let a component
// rule ship inside css/weft.css — a file injected verbatim into panel iframes.
test('check-pure-token-file rejects arbitrary palette-scoped component selectors', () => {
  const cssPath = join(ROOT, 'css/weft.css');
  const original = readFileSync(cssPath, 'utf8');
  const offenders = [
    ':root[data-palette="weft"] .weft-board { display: none; }',
    ':root[data-palette="weft"] button { color: var(--weft-ink); }',
    ':root[data-palette="weft"] h4 { font-size: 1px; }',
    '[data-density="dense"] { --weft-control-h: 1px; }',
    // Review round 15: statement at-rules have no braces, so the rule parser
    // never saw them. @import is the dangerous one — it would pull external CSS
    // into every sandboxed panel iframe weft.css is injected into.
    '@import "https://example.com/panel.css";',
    '@import url("https://example.com/panel.css");',
    '@media (min-width: 40em) { :root { --weft-control-h: 1px; } }',
    '@supports (display: grid) { :root { --weft-control-h: 1px; } }',
    '@font-face { font-family: Smuggled; }',
    // Review round 16: CSS escapes let a keyword be spelled around a literal
    // match, and function names are case-insensitive.
    '@\\69mport "https://example.com/panel.css";',
    '@IMPORT "https://example.com/panel.css";',
    ':root { --weft-bg: URL(https://example.com/x.png); }',
    ':root { --weft-bg: Url (https://example.com/x.png); }',
  ];
  try {
    for (const rule of offenders) {
      writeFileSync(cssPath, `${original}\n${rule}\n`);
      let rejected = false;
      try {
        execFileSync(process.execPath, [join(ROOT, 'scripts/check-pure-token-file.mjs')], { stdio: 'pipe' });
      } catch {
        rejected = true;
      }
      assert.ok(rejected, `guard accepted a rule it must reject: ${rule}`);
    }
  } finally {
    writeFileSync(cssPath, original);
  }
  execFileSync(process.execPath, [join(ROOT, 'scripts/check-pure-token-file.mjs')], { stdio: 'pipe' });
});
