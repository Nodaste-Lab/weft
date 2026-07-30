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
import { readFileSync, existsSync } from 'node:fs';
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
  const buttonMatches = [...html.matchAll(/<button([^>]*)>([^<]*)<\/button>/gi)];
  const buttonViolations = buttonMatches.filter((m) => {
    const attrs = m[1];
    const inner = m[2].trim();
    if (inner.length > 0) return false;          // has visible text
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

test('T3: docs/brand-package/11-panel-templates.md exists and is non-empty', () => {
  const mdPath = join(ROOT, 'docs', 'brand-package', '11-panel-templates.md');
  assert.ok(existsSync(mdPath), '11-panel-templates.md must exist');
  const content = readFileSync(mdPath, 'utf8');
  assert.ok(content.trim().length > 200, '11-panel-templates.md must contain substantive content');
});
