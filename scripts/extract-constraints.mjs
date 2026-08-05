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
// Exit:  0 section found (printed to stdout)
//        1 no matching section
//        2 unusable input (unsafe path, unreadable file, bad arguments)

import { readFileSync, lstatSync } from 'node:fs';

export const DEFAULT_HEADINGS = ['invariants', 'hard invariants', 'repo invariants'];

/**
 * Normalize an ATX heading's raw text for exact comparison.
 * Drops the optional closing #-sequence, emphasis/code marks, and a trailing
 * " — clause" / " - clause" / ": clause", so "Hard invariants — breaking these
 * breaks consumers silently" compares equal to "hard invariants".
 */
export function normalizeHeading(text) {
  return text
    .replace(/[ \t]+#+[ \t]*$/, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+—\s.*$/, '')
    .replace(/\s+-\s.*$/, '')
    .replace(/:.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// 0-3 spaces of indent, 1-6 '#', then whitespace or end of line. Four or more
// spaces is an indented code block, never a heading — the regex caps at three.
const ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
// 0-3 spaces of indent, then a run of at least three backticks or tildes.
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;

/**
 * Return the body of the section introduced by a heading matching `headings`,
 * up to the next heading of the same or higher level. Returns null if no
 * heading matches.
 */
export function extractSection(markdown, headings = DEFAULT_HEADINGS) {
  const wanted = headings.map((h) => h.toLowerCase());
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
        if (wanted.includes(normalizeHeading(atxMatch[2] ?? ''))) {
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

  const section = extractSection(text, heading ? [heading] : DEFAULT_HEADINGS);
  if (section === null || section === '') return 1;
  process.stdout.write(section + '\n');
  return 0;
}

// Only run as a CLI, so the test file can import the functions directly.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main(process.argv.slice(2)));
}
