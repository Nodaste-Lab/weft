/**
 * T1 — Template CSS contract guard.
 *
 * Enforces that weft-templates.css:
 *   1. Declares no custom properties (--*) of its own — all tokens must come
 *      from the canonical weft.css layer (injected separately).
 *   2. Contains no raw hex/rgb/hsl color literals — everything must resolve
 *      via var(--weft-*) using the shared raw-color gate.
 *   3. Every var() reference uses the --weft-* namespace (or a well-known
 *      structural var allowed by design: --radius-*, --text-*, --border,
 *      --background, --foreground, --muted*, --primary*, --hud-*).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAW_COLOR_PATTERN } from '../../tooling/raw-color-pattern.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const template = readFileSync(join(ROOT, 'css', 'weft-templates.css'), 'utf8');

// Strip comments for cleaner analysis
const stripped = template.replace(/\/\*[\s\S]*?\*\//g, '');

test('T1: weft-templates.css declares no custom properties of its own', () => {
  // Match CSS custom-property declarations: --foo: value; (the property being SET, not read)
  // We look for lines/rules that SET a --* property, which would be defining a new token.
  // Allowed: consuming vars via var(--weft-*) is fine; declaring new --* is not.
  const declarations = [...stripped.matchAll(/(?<![a-z-])--[a-zA-Z][\w-]*\s*:/g)];
  const forbidden = declarations.filter((m) => {
    // Allow var(--foo) references; only flag actual property declarations
    // A declaration looks like: "  --my-var: value;" — the -- is at the start of a property.
    return true; // All matches are declarations (the regex anchors out var() reads)
  });
  assert.equal(
    forbidden.length,
    0,
    `weft-templates.css must not declare custom properties — found: ${forbidden.map((m) => m[0]).join(', ')}`,
  );
});

test('T1: weft-templates.css contains no raw hex/rgb/hsl color literals', () => {
  const lines = template.split('\n');
  const hits = lines
    .map((line, i) => ({ line, i: i + 1 }))
    .filter(({ line }) => !line.trim().startsWith('*') && !line.trim().startsWith('/*'))
    .filter(({ line }) => RAW_COLOR_PATTERN.test(line));

  assert.equal(
    hits.length,
    0,
    `weft-templates.css has raw color literals (must use var(--weft-*)):\n${hits.map(({ line, i }) => `  line ${i}: ${line.trim()}`).join('\n')}`,
  );
});

test('T1: all var() references in weft-templates.css use the weft or allowed namespaces', () => {
  // Extract all var(--foo) references; check they're --weft-* or allowlisted
  const ALLOWED_PREFIXES = [
    '--weft-',
    '--hud-',      // HUD transitional aliases (AGENTS.md; scheduled for 1.0.0 deprecation)
    '--radius-',   // shadcn flat token
    '--text-',     // shadcn flat token
    '--border',    // shadcn flat token
    '--background',
    '--foreground',
    '--muted',
    '--primary',
    '--accent',
    '--card',
    '--ring',
  ];
  const varRefs = [...stripped.matchAll(/var\((--[a-zA-Z][\w-]*)/g)].map((m) => m[1]);
  const violations = varRefs.filter(
    (ref) => !ALLOWED_PREFIXES.some((prefix) => ref.startsWith(prefix)),
  );
  assert.equal(
    violations.length,
    0,
    `weft-templates.css references vars outside the allowed namespaces:\n${[...new Set(violations)].map((v) => `  ${v}`).join('\n')}`,
  );
});
