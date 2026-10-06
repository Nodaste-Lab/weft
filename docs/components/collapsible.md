---
related:
  - accordion
  - section-item
  - signal-group-collapsible
  - sidebar
---

# Collapsible

## Purpose

The smallest disclosure: one trigger that shows or hides one region of content in place. It owns the open state and the ARIA wiring between trigger and content and nothing else; it has no border, no chevron and no animation of its own. Other primitives build on it.

## When to use

- One optional block beneath a control: advanced options, details of a row, a long explanation under a summary line.
- A nested group in a `sidebar` that expands under its parent row.
- As the state and wiring under a custom disclosure, when the visual shell is the consumer's.

## When not to use

- Several titled sections in a stack. Use `accordion`.
- Foldable generated output with a label, meta and content slots. Use `section-item` or `section-block`.
- A collapsible group header with a count and header actions. Use `signal-group-collapsible`.
- Content most people need. Show it; a disclosure is for the minority path.

## How to use

1. Wrap the trigger and content in `Collapsible`. Use `defaultOpen` for uncontrolled state or `open` and `onOpenChange` to control it.
2. Render `CollapsibleTrigger` `asChild` around a `button` with a visible label. The primitive sets `aria-expanded` and `aria-controls` on it.
3. Put the hidden region in `CollapsibleContent`. It is unmounted when closed unless `forceMount` is set, in which case the consumer must set `hidden` to match `open`.
4. Draw the state yourself: a chevron that rotates on `data-state="open"`, or a label that changes ("Show details" / "Hide details"). The primitive draws nothing.

## Heuristics

- The trigger says what it reveals. "Show details" tells the person what the click does; "More" does not.
- Keep the trigger and the content adjacent so the revealed region appears where the eye already is.
- State is readable without colour: a rotating chevron, a changed label, or both.
- Do not put required inputs inside a closed collapsible. A form that fails validation on a field the person could not see is a dead end.
- A collapsible that remembers its state across visits should do so per surface, not globally.

## Content

- Trigger labels are sentence case verb phrases naming the content ("Show advanced options"), or the content's own heading when the chevron carries the verb.
- If the label changes with state, both forms are the same length and start with the verb ("Show details" / "Hide details").
- No trailing punctuation on triggers.

## Accessibility

- The trigger exposes `aria-expanded` and `aria-controls`; the content carries the matching id. Enter and Space toggle it (WCAG 4.1.2 name, role, value is met by the primitive).
- The trigger must be a real `button`. Rendering it `asChild` around a `div` loses keyboard activation.
- Keep the trigger at the 24px floor (`--weft-touch-target`); the primitive adds no size.
- Opening and closing has no built-in animation; if the consumer adds one, it collapses under `prefers-reduced-motion: reduce`.
- Expanding does not need a live region (WCAG 4.1.3 excludes disclosure state). If the revealed content loads asynchronously, the loading text inside it is the `status`.
