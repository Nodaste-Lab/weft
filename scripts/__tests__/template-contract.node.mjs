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
  // D8 kept both introduced treatments and landed them as Callout variants, so
  // the board-local band is superseded by .weft-callout.is-band.
  'weft-board-drawer-prov',
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
// Katie's rule, 2026-08: never two filled .weft-btn in an action row. Two
// filled buttons make the operator choose between them instead of acting.
// Caught by eye on the published page, where three specimens taught the wrong
// pattern — including the copy-paste DOM contract in the markdown. The rule is
// only worth stating if the reference material can't drift from it again, so it
// is checked in both the generated page and the documented skeleton.
const classSet = (attr) => new Set(attr.split(/\s+/).filter(Boolean));
const hasAll = (attr, ...needed) => {
  const set = classSet(attr);
  return needed.every((c) => set.has(c));
};

const PRIMARY_BTN = /<button[^>]*\bclass="([^"]*\bweft-btn\b[^"]*)"/gi;
// Only the variants weft-components.css actually defines as non-filled. A class
// the stylesheet does not implement — .weft-btn.is-secondary, say — still renders
// as a filled primary, so exempting it by name would blind the guard to exactly
// the drift it exists to catch. Widen this only alongside a CSS variant.
// Membership, not a substring match. `\bis-ghost\b` also matches inside
// `helper-is-ghost`, because the hyphen is a word boundary — so an unrelated
// helper class silently exempted a filled button. The whole point of matching on
// the set is defeated by asking a regex about the string.
const NON_PRIMARY_CLASSES = ['is-ghost', 'is-link'];
const isNonPrimary = (attr) => {
  const set = classSet(attr);
  return NON_PRIMARY_CLASSES.some((c) => set.has(c));
};

// Depth-matched rather than terminator-matched. The first version required the
// row's </div> to be followed by another </div> or end-of-input, which silently
// found nothing in CSS comments — where an example ends at the comment marker —
// so the guard reported clean on a surface it was not reading. Walking div depth
// makes the extractor independent of what follows the row.
function extractActionRows(text) {
  const open = /<div[^>]*\bclass="([^"]*)"[^>]*>/gi;
  const rows = [];
  let m;
  while ((m = open.exec(text)) !== null) {
    if (!classSet(m[1]).has('weft-action-button-row')) continue;
    const start = m.index + m[0].length;
    const tag = /<(\/?)div\b[^>]*>/gi;
    tag.lastIndex = start;
    let depth = 1;
    let end = text.length;
    let t;
    while (depth > 0 && (t = tag.exec(text)) !== null) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) end = t.index;
    }
    rows.push({ body: text.slice(start, end), index: m.index });
  }
  return rows;
}

function actionRowViolations(text, label) {
  return extractActionRows(text).flatMap((row) => {
    const classes = [...row.body.matchAll(PRIMARY_BTN)].map((m) => m[1]);
    const primaries = classes.filter((c) => !isNonPrimary(c));
    if (primaries.length <= 1) return [];
    const line = text.slice(0, row.index).split('\n').length;
    return [`${label}:${line} — ${primaries.length} filled .weft-btn in one action row (max 1) (${classes.join(' | ')})`];
  });
}

// CSS authoring examples are indented under a leading " * ". Strip that decoration
// so the markup reads the same as it does on the other two surfaces, and every
// detector can be pointed at all three without special-casing.
function undecorate(text) {
  return text.split('\n').map((l) => l.replace(/^\s*\*[ \t]?/, '')).join('\n');
}

// One canonical form for every surface before any detector runs. The generated
// page HTML-escapes its attribute quotes, the markdown and CSS examples are
// hand-authored and may use single quotes; none of that is the contract. Doing
// this once is why the detectors can be literal about `class="…"` without being
// literal about how an author happened to type it.
function normalizeSurface(text) {
  return text
    .replace(/&quot;/g, '"')
    // EVERY attribute, not just class. The first version rewrote class only, so a
    // hand-authored data-size='board' walked straight past the drawer rule — the
    // same under-coverage this normalization exists to prevent, reintroduced by
    // scoping it to the one attribute I happened to be thinking about.
    .replace(/\b([a-zA-Z][\w-]*)='([^']*)'/g, '$1="$2"');
}

// A deprecated class is superseded guidance wherever it appears — inside a class
// attribute, in a selector label like `.weft-board-drawer-prov`, or in prose.
// The earlier checks only looked inside class="…", so a regression in the
// generated page's selector line or in comment prose would have published the
// old name with a green suite.
function deprecatedClassViolations(text, label) {
  return DEPRECATED_BOARD_CLASSES.flatMap((cls) =>
    [...text.matchAll(new RegExp(`\\b${cls}(?![-\\w])`, 'g'))].map((m) => {
      const line = text.slice(0, m.index).split('\n').length;
      return `${label}:${line} — ${cls} was deleted; published material must not teach it`;
    }),
  );
}

// Prose form of the D6 rule, kept separate from the markup form because a doc can
// get this wrong either way: by showing the old markup, or by describing it.
function proseTypeChipViolations(text, label) {
  return text.split('\n').flatMap((line, i) => {
    if (!/\btype chip/i.test(line)) return [];
    if (!/weft-badge[.\s]is-outline|weft-badge is-outline/.test(line)) return [];
    return [`${label}:${i + 1} maps the type chip to .weft-badge.is-outline — D6 moved it to .weft-source-pill`];
  });
}

test('T2-e: action rows carry at most one primary button', () => {
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
    `Action rows must carry at most one filled .weft-btn; every sibling is .is-ghost or .is-link.\n${violations.join('\n')}`,
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

  // A variant weft-components.css does not implement is still a filled button,
  // so it must count as a primary rather than be exempted by its class name.
  const fakeVariant = twoPrimaries.replace('weft-btn" type="button">Reassign', 'weft-btn is-secondary" type="button">Reassign');
  assert.equal(actionRowViolations(fakeVariant, 'fixture').length, 1);
});

// ── D5 / D6 chip split ───────────────────────────────────────────────────────
// D6 adopted SourcePill for the mono type chip and deleted weft-board-type,
// while D5 kept the space chip on Badge. The decision asked for a guard that the
// two stay distinct and can coexist in one row. The page had been showing the
// type chip as .weft-badge.is-outline — the pre-D6 pattern — so the reference
// material silently taught something the design system had already moved past.
test('T2-f: the row-chip specimen shows the D5/D6 split — Badge space chip beside a SourcePill', () => {
  const html = readFileSync(generatedHtmlPath, 'utf8');
  const row = html.match(/<div class="demo">(?:(?!<\/div>\s*<div class="meta">)[\s\S])*?weft-source-pill[\s\S]*?<div class="meta">/);
  assert.ok(row, 'the generated page must contain a specimen using .weft-source-pill (D6)');
  assert.ok(
    /weft-badge is-space/.test(row[0]),
    'the D5 Badge space chip and the D6 SourcePill must render in the same row without colliding',
  );
  assert.ok(
    !/weft-board-type/.test(html),
    'weft-board-type was deleted by D6 and must not reappear',
  );
});

// The first version of the guard above scanned only the generated page, and
// review immediately found a third copy of the pre-D6 mapping in a second
// markdown table it could not see. Both files are published reference material,
// so both are checked — a rule enforced on one surface is not enforced.
const canonicalMdPath = join(ROOT, 'docs', 'brand-package', '11-panel-templates.md');

test('T2-g: the canonical markdown teaches no superseded mapping', () => {
  const md = readFileSync(canonicalMdPath, 'utf8');
  const problems = [];

  // Deprecated board-local classes must not survive in prose or tables either.
  // The CSS check (T1-d) does not see this file at all.
  for (const cls of DEPRECATED_BOARD_CLASSES) {
    for (const m of md.matchAll(new RegExp(`\\.${cls}(?![-\\w])`, 'g'))) {
      problems.push(`${cls} at line ${md.slice(0, m.index).split('\n').length} — deleted; docs must not teach it`);
    }
  }

  // D6: any line describing the mono/type chip must point at SourcePill, never
  // back at the Badge outline variant it moved off. Badge.is-outline is still
  // correct for evidence chips, so this is scoped by context rather than banned.
  problems.push(...proseTypeChipViolations(md, '11-panel-templates.md'));
  problems.push(...typeChipViolations(md, '11-panel-templates.md'));
  assert.deepEqual(problems, [], `Superseded mappings in 11-panel-templates.md:\n${problems.join('\n')}`);
});

// Prose-matching was not enough: review found `signal` — a type value — rendered
// as a space badge in two drawer examples, on lines that never say "type chip".
// The durable check is on the markup and the vocabulary, not on the description
// beside it: a known item type must never wear the workspace chip.
const ITEM_TYPE_VALUES = ['signal', 'decision', 'clarification'];

// Match on the class SET, never on the attribute string. Review found the literal
// form missed single quotes, reordered classes and extra classes — all valid in
// the hand-authored markdown and CSS examples — so the guard could report clean on
// bad published markup. Order and spelling of the attribute are not the contract;
// the set of classes is.

function typeChipViolations(text, label) {
  const types = new Set(ITEM_TYPE_VALUES);
  const pattern = /<(?:span|div)[^>]*\bclass="([^"]*)"[^>]*>\s*([^<]*?)\s*</gi;
  return [...text.matchAll(pattern)].flatMap((m) => {
    if (!hasAll(m[1], 'weft-badge', 'is-space')) return [];
    if (!types.has(m[2].trim().toLowerCase())) return [];
    const line = text.slice(0, m.index).split('\n').length;
    return [`${label}:${line} — "${m[2].trim()}" is an item type, not a workspace; D6 puts it on .weft-source-pill, not .weft-badge.is-space`];
  });
}

// The page renders every specimen live from css/, which is only faithful if the
// page puts itself in the density the board is designed for. T2 placed the 34px
// tier on :root as an application preference; this page is the application. It
// had shipped without it, so every control rendered at the 44px default — a third
// too large — while the specimen text beside them explained the dense tier.
// Katie caught it as "the preset picker looks wrong, input fields, button size".
// ── Every rule, every published surface ──────────────────────────────────────
// Eight of the last ten review findings on this PR were the same shape: a rule
// enforced on fewer surfaces than it covers, or a detector too literal about how
// an author typed something. The per-surface tests above stay for their specific
// error messages; this one exists so that adding a rule or a surface cannot
// quietly leave a hole. Everything is normalized first, so quoting style, class
// order and comment decoration are not part of the contract.
// The drawer-header rule lived only in T2-j, which reads CSS comments, so the two
// markup surfaces could regress back to a board-scale drawer header with a green
// suite — review confirmed it by mutating both. Same block-walk as the action row.
function extractBlocks(text, className) {
  const open = /<div[^>]*\bclass="([^"]*)"[^>]*>/gi;
  const blocks = [];
  let m;
  while ((m = open.exec(text)) !== null) {
    if (!classSet(m[1]).has(className)) continue;
    const start = m.index + m[0].length;
    const tag = /<(\/?)div\b[^>]*>/gi;
    tag.lastIndex = start;
    let depth = 1;
    let end = text.length;
    let t;
    while (depth > 0 && (t = tag.exec(text)) !== null) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) end = t.index;
    }
    blocks.push({ body: text.slice(start, end), index: m.index });
  }
  return blocks;
}

function drawerHeaderSizeViolations(text, label) {
  return extractBlocks(text, 'weft-board-drawer').flatMap((block) => {
    const headers = [...block.body.matchAll(/<div[^>]*\bclass="([^"]*)"[^>]*>/gi)]
      .filter((h) => classSet(h[1]).has('weft-panel-header'))
      // Quote-agnostic as well as normalized, so the rule does not depend on the
      // normalizer having thought of this attribute.
      .filter((h) => /\bdata-size\s*=\s*["']board["']/i.test(h[0]));
    if (!headers.length) return [];
    const line = text.slice(0, block.index).split('\n').length;
    return [`${label}:${line} — drawer header carries data-size="board"; board scale belongs to the board's own header`];
  });
}

function publishedSurfaces() {
  return [
    ['panel-templates.html', normalizeSurface(readFileSync(generatedHtmlPath, 'utf8'))],
    ['11-panel-templates.md', normalizeSurface(readFileSync(canonicalMdPath, 'utf8'))],
    ['weft-templates.css (comment)', normalizeSurface(undecorate(cssComments))],
  ];
}

test('T2-k: every rule holds on every published surface', () => {
  const problems = publishedSurfaces().flatMap(([label, text]) => [
    ...deprecatedClassViolations(text, label),
    ...typeChipViolations(text, label),
    ...proseTypeChipViolations(text, label),
    ...actionRowViolations(text, label),
    ...drawerHeaderSizeViolations(text, label),
  ]);
  assert.deepEqual(problems, [], `Published material is out of date:\n${problems.join('\n')}`);
});

test('T2-k coverage: the detectors survive quoting, ordering and extra classes', () => {
  // Each of these was a real miss reported by review, in the exact form reported.
  const singleQuoted = normalizeSurface(
    "<div class='weft-action-button-row'>" +
    "<button class='weft-btn'>Resolve</button><button class='weft-btn'>Reassign</button></div>",
  );
  assert.equal(actionRowViolations(singleQuoted, 'f').length, 1, 'single-quoted class attributes must still be read');

  const reordered = normalizeSurface(`<span class='is-space weft-badge is-compact'>signal</span>`);
  assert.equal(typeChipViolations(reordered, 'f').length, 1, 'class order and extra classes must not defeat the chip check');

  const selectorLabel = 'The band lives at .weft-board-drawer-prov in the template layer.';
  assert.equal(deprecatedClassViolations(selectorLabel, 'f').length, 1, 'a deprecated class in prose or a selector label must be caught');

  // And the negatives, so the detectors are not simply always-on.
  assert.deepEqual(typeChipViolations(normalizeSurface("<span class='weft-badge is-space'>ccore/heddle</span>"), 'f'), []);
  assert.deepEqual(actionRowViolations(normalizeSurface("<div class='weft-action-button-row'><button class='weft-btn'>Go</button></div>"), 'f'), []);
  assert.deepEqual(deprecatedClassViolations('the weft-board-drawer holds the detail panel', 'f'), []);

  // A helper class must not exempt a filled button: \bis-ghost\b also matches
  // inside `helper-is-ghost`, because the hyphen is a word boundary.
  const helperClass = normalizeSurface(
    '<div class="weft-action-button-row">' +
    '<button class="weft-btn">Resolve</button><button class="weft-btn helper-is-ghost">Reassign</button></div>',
  );
  assert.equal(actionRowViolations(helperClass, 'f').length, 1, 'an unrelated helper class must not exempt a filled button');

  // The drawer-header rule must hold on the markup surfaces, not only in CSS comments.
  const boardScaleDrawer = normalizeSurface(
    '<div class="weft-board-drawer"><div class="weft-panel-header" data-size="board">' +
    '<div class="weft-panel-header-title">x</div></div></div>',
  );
  assert.equal(drawerHeaderSizeViolations(boardScaleDrawer, 'f').length, 1);

  // Single-quoted data-size, the exact bypass review demonstrated.
  const singleQuotedSize = normalizeSurface(
    "<div class='weft-board-drawer'><div class='weft-panel-header' data-size='board'>x</div></div>",
  );
  assert.equal(drawerHeaderSizeViolations(singleQuotedSize, 'f').length, 1, 'single-quoted attributes must not bypass the drawer rule');
  assert.deepEqual(
    drawerHeaderSizeViolations(normalizeSurface('<div class="weft-board"><div class="weft-panel-header" data-size="board">x</div></div>'), 'f'),
    [],
    "the board's own header keeps board scale",
  );
});

test('T2-i: the generated page sets the density the board is designed for', () => {
  const html = readFileSync(generatedHtmlPath, 'utf8');
  const htmlTag = html.match(/<html[^>]*>/);
  assert.ok(htmlTag, 'generated page must have an <html> tag');
  assert.match(
    htmlTag[0],
    /data-density="dense"/,
    `The breakdown page must render at the board's density, or its specimens misrepresent the template. Got: ${htmlTag[0]}`,
  );
});

// Third published surface. weft-templates.css carries plain-CSS authoring examples
// inside its comments — the markup a panel author copies when they are not using
// React. Every CSS guard above runs against `stripped`, which deletes comments, so
// those examples were structurally invisible to all of them. Review found the
// drawer-header guidance there still teaching data-size="board" after both other
// surfaces had been corrected: the third time in this PR that a rule was enforced
// on fewer surfaces than it covers. The same detectors now run over all three.
const cssComments = [...templateCss.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => m[0]).join('\n');

test('T2-j: authoring examples in CSS comments obey the same rules as the published pages', () => {
  const problems = [];

  for (const cls of DEPRECATED_BOARD_CLASSES) {
    if (new RegExp(`class="[^"]*\\b${cls}\\b`).test(cssComments)) {
      problems.push(`${cls} appears in a weft-templates.css authoring example — it was deleted`);
    }
  }
  const examples = undecorate(cssComments);
  problems.push(...typeChipViolations(examples, 'weft-templates.css (comment)'));
  problems.push(...actionRowViolations(examples, 'weft-templates.css (comment)'));
  problems.push(...proseTypeChipViolations(examples, 'weft-templates.css (comment)'));

  // The drawer is subordinate to the board: board scale belongs to the board's
  // own header, so drawer guidance must not hand it out. Only the markup lines
  // are checked — prose in the same block legitimately names data-size="board"
  // to say what it is for, and an earlier version of this check flagged that
  // explanation as a violation.
  for (const block of cssComments.split('/*')) {
    if (!/drawer header/i.test(block)) continue;
    const markupLines = block.split('\n').filter((l) => /^\s*\*?\s*</.test(l));
    if (markupLines.some((l) => /data-size="board"/.test(l))) {
      problems.push('a drawer-header authoring example still sets data-size="board" — that scale is the board header\'s');
    }
  }

  assert.deepEqual(problems, [], `weft-templates.css authoring examples are out of date:\n${problems.join('\n')}`);

  // Coverage proof, not just a clean result. Review demonstrated by mutation that
  // the previous version of this test found zero action rows in CSS comments and
  // still reported clean — a guard asserting coverage it did not have. These
  // fixtures reproduce the comment shape, decoration and terminator included, so
  // the test fails if the surface ever stops being read.
  const commentShaped = [
    '/* Plain-CSS markup:',
    ' *   <div class="weft-action-button-row">',
    ' *     <button class="weft-btn">Resolve</button>',
    ' *     <button class="weft-btn">Reassign</button>',
    ' *   </div>',
    ' */',
  ].join('\n');
  assert.equal(
    actionRowViolations(undecorate(commentShaped), 'fixture').length,
    1,
    'the action-row detector must read markup inside CSS comments',
  );
  assert.equal(
    proseTypeChipViolations(undecorate('/* the mono type chip uses .weft-badge.is-outline */'), 'fixture').length,
    1,
    'the prose detector must read guidance inside CSS comments',
  );
});

test('T2-h: item type values never wear the workspace chip', () => {
  const violations = [
    ...typeChipViolations(readFileSync(generatedHtmlPath, 'utf8'), 'panel-templates.html'),
    ...typeChipViolations(readFileSync(canonicalMdPath, 'utf8'), '11-panel-templates.md'),
  ];
  assert.deepEqual(violations, [], `D5/D6 chip split violated:\n${violations.join('\n')}`);

  // Both directions, so the fixture proves the matcher rather than the file.
  assert.equal(typeChipViolations('<span class="weft-badge is-space">signal</span>', 'f').length, 1);
  assert.deepEqual(typeChipViolations('<span class="weft-badge is-space">ccore/heddle</span>', 'f'), []);
  assert.deepEqual(typeChipViolations('<span class="weft-source-pill">signal</span>', 'f'), []);
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
