#!/usr/bin/env node
// Extract the repo-invariants section from a Markdown file for review-gate.sh.
//
// Why this is not awk any more: this logic went through three review rounds as an
// inline awk one-liner, and each round found another CommonMark rule it had
// approximated — naive fence toggling, nested fences, closing fences with info
// strings, indented ATX headings. Every miss had the same shape: the section was
// silently truncated or not found, the constraints block came out short or empty,
// and the gate still exited 0 with a CLEAN verdict. Patching rule-by-rule was
// losing to the spec, so the scanner moved here where it can be a real line
// scanner with direct unit tests instead of an end-to-end shell assertion.
//
// Scope: the block-level subset that decides section boundaries — ATX headings
// and fenced code blocks. Setext headings (underlined with === or ---) are
// deliberately NOT supported; a file that uses them yields no match, which is the
// safe direction (no block rather than the wrong block) and is recoverable with
// --constraints. See scripts/review-gate.md.
//
// Usage: extract-constraints.mjs <file> [--heading "<exact heading>"]
//
// Output protocol. The LAST line of stdout is always one of:
//
//   #__REVIEW_GATE_CONSTRAINTS__: FOUND    (preceded by the section body)
//   #__REVIEW_GATE_CONSTRAINTS__: NONE     (no matching section; benign)
//
// and its absence means this process did not reach a conclusion.
//
// The exit status is deliberately NOT the channel. A process's status cannot
// distinguish "no matching section" from "this script has a syntax error" or
// "an exception escaped" — Node exits 1 for all three — so a broken scanner read
// as a benign miss and the gate reviewed on without the repo's rules. That is the
// same rule review-gate.sh already applies to Codex: a missing or unparseable
// verdict is never a pass. It applies here too. Statuses are still set (0 found,
// 1 none, 2 unusable input) but only as a hint; the trailer is authoritative.
//
// Exit:  0 section found   1 no matching section   2 unusable input

import { readFileSync, lstatSync } from 'node:fs';

export const DEFAULT_HEADINGS = ['invariants', 'hard invariants', 'repo invariants'];

/** Trailer marking a completed run. Its absence means the process did not finish. */
export const SENTINEL = '#__REVIEW_GATE_CONSTRAINTS__:';

/**
 * Strip only markup, not meaning: the optional closing #-sequence and emphasis
 * or code marks, then collapse whitespace and case-fold.
 *
 * This is the comparison used for an operator-supplied heading, and it is applied
 * to BOTH sides. Applying different normalizations to the two sides is what made
 * `--constraints-heading 'Security: strict'` fail to match `## Security: strict`
 * — the file's heading lost its colon clause while the operator's string kept it.
 * Punctuation is content here; a heading that says "Security: strict" is matched
 * by typing exactly that.
 */
export function lightNormalize(text) {
  return text
    .replace(/[ \t]+#+[ \t]*$/, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * The alias form, used ONLY for the built-in default headings. On top of
 * lightNormalize it drops a trailing " — clause" / " - clause" / ": clause", so
 * "Hard invariants — breaking these breaks consumers silently" reduces to
 * "hard invariants" and matches the alias list without the operator naming the
 * whole heading. That leniency is appropriate for a built-in guess and wrong for
 * a string the operator typed, which is why the two are separate.
 */
export function normalizeHeading(text) {
  return lightNormalize(text)
    .replace(/\s+—\s.*$/, '')
    .replace(/\s+-\s.*$/, '')
    .replace(/:.*$/, '')
    .trim();
}

// 0-3 spaces of indent, 1-6 '#', then whitespace or end of line. Four or more
// spaces is an indented code block, never a heading — the regex caps at three.
const ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
// 0-3 spaces of indent, then a run of at least three backticks or tildes.
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;

/**
 * Return the body of the section introduced by a matching heading, up to the next
 * heading of the same or higher level. Returns null if no heading matches.
 *
 * options.exact  — an operator-supplied heading, compared with lightNormalize on
 *                  both sides. Punctuation is significant.
 * options.aliases — the built-in candidate list, compared with normalizeHeading.
 *                  Ignored when `exact` is set.
 */
export function extractSection(markdown, options = {}) {
  const exact = options.exact ?? null;
  const aliases = (options.aliases ?? DEFAULT_HEADINGS).map((h) => normalizeHeading(h));
  const exactWanted = exact === null ? null : lightNormalize(exact);
  const headingMatches = (raw) =>
    exactWanted === null ? aliases.includes(normalizeHeading(raw)) : lightNormalize(raw) === exactWanted;
  const lines = markdown.split('\n');
  const out = [];
  let fence = null;
  let grabbing = false;
  let level = 0;
  let found = false;

  for (const line of lines) {
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      const char = marker[0];
      const rest = fenceMatch[2];
      if (!fence) {
        // A backtick fence's info string may not contain a backtick; such a line
        // is paragraph text, not a fence opener.
        if (!(char === '`' && rest.includes('`'))) {
          fence = { char, length: marker.length };
        }
      } else if (
        char === fence.char &&
        marker.length >= fence.length &&
        // A CLOSING fence takes no info string — only whitespace may follow it.
        // Without this, a ```bash line inside an open ``` fence read as the
        // close, and the next ## ended the section early.
        /^[ \t]*$/.test(rest)
      ) {
        fence = null;
      }
      if (grabbing) out.push(line);
      continue;
    }

    if (fence) {
      if (grabbing) out.push(line);
      continue;
    }

    const atxMatch = ATX.exec(line);
    if (atxMatch) {
      const thisLevel = atxMatch[1].length;
      if (grabbing && thisLevel <= level) break;
      if (!grabbing) {
        if (headingMatches(atxMatch[2] ?? '')) {
          grabbing = true;
          found = true;
          level = thisLevel;
          continue;
        }
      }
    }

    if (grabbing) out.push(line);
  }

  if (!found) return null;
  // Trim leading/trailing blank lines; the caller frames this block itself.
  while (out.length && out[0].trim() === '') out.shift();
  while (out.length && out[out.length - 1].trim() === '') out.pop();
  return out.join('\n');
}

function main(argv) {
  let file = null;
  let heading = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--heading') {
      heading = argv[++i];
      if (heading === undefined) {
        process.stderr.write('extract-constraints: --heading needs a value\n');
        return 2;
      }
    } else if (!file) {
      file = argv[i];
    } else {
      process.stderr.write(`extract-constraints: unexpected argument: ${argv[i]}\n`);
      return 2;
    }
  }
  if (!file) {
    process.stderr.write('usage: extract-constraints.mjs <file> [--heading "<exact heading>"]\n');
    return 2;
  }

  // Defence in depth. review-gate.sh already refuses symlinked discovery paths,
  // but this file's whole job is reading a file whose contents get shipped to an
  // external reviewer, so it does not rely on its caller for that.
  let stat;
  try {
    stat = lstatSync(file);
  } catch {
    process.stderr.write(`extract-constraints: cannot stat ${file}\n`);
    return 2;
  }
  if (stat.isSymbolicLink()) {
    process.stderr.write(`extract-constraints: ${file} is a symlink — refusing to read it.\n`);
    return 2;
  }
  if (!stat.isFile()) {
    process.stderr.write(`extract-constraints: ${file} is not a regular file.\n`);
    return 2;
  }

  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    process.stderr.write(`extract-constraints: cannot read ${file}\n`);
    return 2;
  }

  const section = extractSection(text, heading ? { exact: heading } : {});
  if (section === null || section === '') {
    process.stdout.write(`${SENTINEL} NONE\n`);
    return 1;
  }
  // A body line that looks like the trailer would let a truncated run be read as
  // a complete one. Pathological, and cheap to rule out entirely.
  if (section.split('\n').some((line) => line.trimEnd().startsWith(SENTINEL))) {
    process.stderr.write(
      `extract-constraints: ${file} contains a line beginning with ${SENTINEL}, which is reserved.\n`,
    );
    return 2;
  }
  process.stdout.write(`${section}\n${SENTINEL} FOUND\n`);
  return 0;
}

// Only run as a CLI, so the test file can import the functions directly.
//
// process.exitCode, never process.exit(). When stdout is a pipe — which is
// exactly how review-gate.sh reads this, via "$(...)" — writes are asynchronous,
// and process.exit() discards whatever has not drained. A section larger than the
// pipe buffer came through truncated at 65,536 bytes with the trailer lost, so a
// perfectly valid AGENTS.md aborted the gate. Setting exitCode lets the event loop
// flush first and exit on its own.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main(process.argv.slice(2));
}
