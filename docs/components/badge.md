---
related:
  - chip
  - dot
  - provider-status-badge
  - source-pill
  - stat-row
---

# Badge

## Purpose

A small read-only label that marks a thing with a state, a category, a count or an attribution. It owns the pill shape, the `default`, `secondary`, `destructive`, `outline`, `count`, `space` and `status` variants, and the tone axis that colours a status. It does nothing when clicked unless rendered `asChild` around a link.

## When to use

- A state word on a row or in a header: "Queued", "Agent working", "Resolved".
- A count beside a label: items in a tier, unread in a group (`count`).
- An attribution to a workspace or space (`space`).
- A machine-state label in a dense panel (`status`, with a tone).

## When not to use

- A removable or selectable token. Use `chip`.
- A presence or health indicator with no word. Use `dot`.
- A provider probe state with its own vocabulary. Use `provider-status-badge`.
- A path or identifier shown as written. Use `source-pill`.
- A label and value pair. Use `stat-row`.
- A message with a sentence in it. Use `callout` or `alert`.

## How to use

1. Render `Badge` with text children and a `variant`. Default is the filled primary pill; `outline` for a quiet tag; `count` for an integer in the mono face; `space` for a tinted attribution; `status` for a mono bordered machine state.
2. Add `tone` with `outline` or `status` to colour a state: `info`, `warning`, `danger`, `positive`, or the token-named `stop`, `warn`, `ok`. The tone changes the text and border; the variant stays.
3. Put an icon before the text as a child; it is sized to 12px. Mark it `aria-hidden`.
4. Render `asChild` around an `<a>` only when the badge is a link; a plain badge is a `span`.
5. Place the badge after the text it qualifies, separated by a gap or a middle dot, never run into it.

## Heuristics

- Colour is a state or a category, never a person. Two badges with the same tone mean the same thing everywhere.
- Tone and word agree. A `danger` tone on "Resolved" is a bug; the word is what a screen reader hears.
- Omit a `count` badge at zero. "0" is a fact the row's absence already states.
- One or two words. A badge that wraps is a `callout`.
- The casing follows the register of the row: mono caps inside a dense panel (a queue pill beside a stat row), sentence case when it stands alone in header chrome. Never two registers in one row.
- Do not rely on the fill alone: a `destructive` and a `default` badge in forced-colours mode differ only by their text.

## Content

- One or two words, no trailing punctuation.
- State words are adjectives or participles ("Queued", "Resolved"); category words are nouns ("Launch", "Operations").
- Counts are plain integers; the noun lives in the row label, not the badge.
- Never fixture text as a default; a badge with nothing to say is not rendered.

## Accessibility

- A badge is a `span` with no role. Its text is read inline with the row, so give it text, not just colour, and separate it from the row title so the two do not run together.
- A badge cannot receive focus, so a truncated badge has no tooltip route. Keep the text short enough to show whole.
- Colour is never the only cue (WCAG 1.4.1): the tone pairs with the word, and status badges keep the `status` border so they read in forced-colours mode.
- A badge rendered `asChild` as a link needs the global Focus Ring (it carries `focus-visible` styles) and the 24px floor (`--weft-touch-target`); a plain badge is not a target.
- No animation.
