/**
 * Canonical raw-color detection shared by every design-system guard
 * (audit-design-system.mjs, panel-authoring-validator.mjs, and — mirrored —
 * src/app/panel-packages/packageValidator.ts). One definition so the rules
 * never drift.
 *
 * Raw colors are only legal in the token-definition files; everywhere else,
 * code must read `var(--weft-*)` / `var(--hud-*)` tokens so it flips with the
 * light/dark theme. See thoughts plan: panels on the design system.
 */

/**
 * Matches a raw color literal:
 *  - hex (`#fff`, `#1a1a1a`, `#10b98180`) — the `(?<!&)` guard avoids HTML
 *    numeric entities like `&#10003;`.
 *  - functional notations: `rgb()`, `rgba()`, `hsl()`, `hsla()`.
 * Kept byte-compatible with packageValidator.ts's FORBIDDEN raw-color pattern
 * (which also bans `rgb`/`rgba`); `hsl` is added here for CSS coverage.
 */
export const RAW_COLOR_PATTERN = /(?<!&)#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?)\(/i;

/** Global variant for iterating every match on a line. */
export const RAW_COLOR_PATTERN_GLOBAL = new RegExp(RAW_COLOR_PATTERN.source, `${RAW_COLOR_PATTERN.flags}g`);

/**
 * The ONLY files allowed to contain raw colors: the token-definition layer.
 * Paths are matched as suffixes against a posix-normalized file path.
 */
export const TOKEN_FILE_ALLOWLIST = [
  'src/styles/theme.css',
  'src/styles/weft.css',
  'src/styles/tailwind.css',
];

/** True when `filePath` is a sanctioned token-definition file. */
export function isTokenFile(filePath) {
  const norm = String(filePath).replace(/\\/g, '/');
  return TOKEN_FILE_ALLOWLIST.some((allowed) => norm.endsWith(allowed));
}

/**
 * Find raw-color literals in `source`. Skips lines that are clearly comments
 * (`//`, `*`) and any literal that sits inside a `var(...)` fallback (e.g.
 * `var(--hud-warning, #f5b942)` is reported separately as a fallback
 * antipattern by callers, not here). Returns `[{ line, value }]`, 1-based.
 */
/**
 * True when `marker` appears inside a `//` or `/* … *\/` comment on the line —
 * not in a string literal or prose. Prevents an unrelated mention of the marker
 * (or a literal that happens to contain it) from silently suppressing the gate.
 */
export function lineHasIgnoreMarker(line, marker = 'ds-raw-color-ok') {
  const idx = line.indexOf(marker);
  if (idx < 0) return false;
  const before = line.slice(0, idx);
  return before.includes('//') || before.includes('/*');
}

export function findRawColors(source) {
  const out = [];
  const lines = String(source).split('\n');
  // Legitimate color *data* opts out via a `ds-raw-color-ok` comment, or a
  // `ds-raw-color-ok-start` / `ds-raw-color-ok-end` comment block.
  let inIgnore = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (lineHasIgnoreMarker(line, 'ds-raw-color-ok-start')) inIgnore = true;
    if (lineHasIgnoreMarker(line, 'ds-raw-color-ok-end')) inIgnore = false;
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
    if (inIgnore || lineHasIgnoreMarker(line, 'ds-raw-color-ok')) continue;
    RAW_COLOR_PATTERN_GLOBAL.lastIndex = 0;
    let m;
    while ((m = RAW_COLOR_PATTERN_GLOBAL.exec(line)) !== null) {
      // `hsl(var(--x))` / `rgb(var(--x))` are token-based, not raw colors —
      // a functional notation wrapping a var() reads its channels from a token.
      if (m[0].endsWith('(') && line.slice(m.index + m[0].length).trimStart().startsWith('var(')) {
        continue;
      }
      out.push({ line: i + 1, value: m[0] });
    }
  }
  return out;
}

/**
 * Flag `var(--token, #hex)` style fallbacks — legal-looking but they pin a raw
 * color that won't flip. Returns `[{ line, value }]`.
 */
export function findTokenHexFallbacks(source) {
  const out = [];
  const re = /var\(\s*--[\w-]+\s*,\s*(#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?)\([^)]*\))/gi;
  const lines = String(source).split('\n');
  for (let i = 0; i < lines.length; i++) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(lines[i])) !== null) {
      out.push({ line: i + 1, value: m[0] });
    }
  }
  return out;
}
