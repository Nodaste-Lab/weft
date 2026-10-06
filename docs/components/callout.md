---
related:
  - alert
  - HudIssueCallout
  - empty-state
  - text-content
  - markdown-renderer
---

# Callout

## Purpose

A low-weight inline message panel for help notes, status lines, generated explanations and panel-level hints. It owns the tinted frame, the `inline`, `text`, `dashed` and `band` variants, the five tones, the compact density, the optional icon, title and action slots, and the live-region role chosen from the tone. It is the lighter of the two inline message primitives; `alert` is the heavier.

## When to use

- A one-line status or hint inside a panel: "Recap queued", "Saved", "Showing operator view".
- A short explanation beside generated content, with a title and a paragraph or two (`text`).
- A failure notice that sits left-aligned inside a content area (`dashed`).
- A section-level notice that spans its container with a left accent (`band`).

## When not to use

- A titled message with structured icon, title and description layout and stronger weight. Use `alert`.
- A structured failure with source, next action and preserved-state note. Use `HudIssueCallout`.
- A surface with nothing in it yet. Use `empty-state`.
- Plain readable copy with no tone. Use `text-content`.
- A transient notice. Use `HudIssueToast`.

## How to use

1. Render `Callout` with a `tone`: `info` (default), `warning`, `danger`, `positive` or `muted`. The tone sets the colour and the live-region role.
2. Choose a `variant`: `inline` (default) for one line, `text` for a readable body with the `text-content` measure, `dashed` for an inline failure, `band` for a section stripe.
3. Pass `title` for a bold first line and `children` for the body. For `text`, pass `markdown` instead of children to render through `markdown-renderer`; children win when both are given.
4. Pass `icon` for a leading glyph (sized to 14px, marked `aria-hidden` for you) and `action` for a trailing `button`.
5. Set `density="compact"` in dense panels; `contentMeasure` adjusts the `text` variant's line length.

## Heuristics

- Tone is a state: `danger` for a failure, `warning` for something to check before it fails, `positive` for a completed outcome, `info` for a note, `muted` for a hint that should not draw the eye.
- A callout says one thing. If it needs a title, a body and an action, check whether `alert` is the better weight.
- The action is one `button`, and the callout itself is never interactive; only the action is.
- Remove the callout when its condition resolves; a `positive` "Saved" that stays reads as current.
- The words carry the tone; the tint and icon reinforce it (WCAG 1.4.1).

## Content

- Title: sentence case, short, no trailing punctuation ("Review generated notes").
- Body: one or two sentences in `inline`; short paragraphs in `text`. Errors follow the pattern: what happened, why if short, what to try.
- Action label: a verb, sentence case ("Review", "Open settings").
- Never fixture text as a default; a callout with nothing to say is not rendered.

## Accessibility

- `danger` and `warning` render `role="alert"` with `aria-live="assertive"`; other tones render `role="status"` with `aria-live="polite"`. That satisfies WCAG 4.1.3 for a callout inserted after load; one present at page load is read in order like other content.
- The callout never takes focus. An `action` is a real `button` reached by Tab in document order, at the 24px floor (`--weft-touch-target`).
- The icon is `aria-hidden`; the title and body carry the meaning.
- Markdown bodies inherit `markdown-renderer`'s safety policy: raw HTML is skipped.
- No animation; nothing to collapse under `prefers-reduced-motion: reduce`.
