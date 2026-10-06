---
related:
  - collapsible
  - section-block
  - tabs
  - tier-group
---

# Accordion

## Purpose

A stack of titled sections that each expand and collapse in place, so a long page can be scanned by heading and read one part at a time. It owns the item rule, the trigger row with its chevron, the expand state and the height animation. The consumer owns the headings and the section bodies.

## When to use

- Several independent sections where most people need only one or two: FAQs, settings groups, a reference split by topic.
- Space-constrained surfaces (a side panel, a phone) where showing everything would push the first section out of view.

## When not to use

- One section to show or hide. Use `collapsible`.
- Sections of generated output in a response or review surface. Use `section-block` and `section-item`.
- Alternative views of the same region. Use `tabs`.
- Content most people need in full, or that reads in sequence. Show it on the page with headings; hiding it adds a click to every reader.
- Grouped rows with a tier heading rather than disclosure. Use `tier-group`.

## How to use

1. Render `Accordion` with `type="single"` (one open at a time) or `type="multiple"`. With `type="single"`, add `collapsible` so the open item can be closed again; otherwise it cannot.
2. Add one `AccordionItem` per section with a unique `value`. Set `defaultValue` on the root to open a section on load, or `value` and `onValueChange` to control it.
3. Put the heading text in `AccordionTrigger`. It renders a heading wrapper around a button and draws the chevron for you; do not add a second chevron.
4. Put the section body in `AccordionContent`. Pass `className` to adjust the inner padding.

## Heuristics

- Headings say what is inside. A person decides whether to open a section from the heading alone, so a vague heading hides the content twice.
- Prefer `type="multiple"` when sections are compared or read together; `single` suits mutually exclusive settings.
- Start collapsed unless one section is what most people came for; then open that one with `defaultValue`.
- Keep the stack short. Past about six items, the page is a list of links or a set of `tabs`, not an accordion.
- The chevron points down when closed and rotates 180° when open; state also reads from the `data-state` attribute, not only from the icon.

## Content

- Trigger text: sentence case, a noun phrase naming the section, no trailing punctuation ("Session goals", "Safety tools").
- No counts or status in the trigger unless the section is a group with a number; then put the count after the label as a `badge`.
- Bodies are plain content in the body size for the density; headings inside a body start one level below the trigger's heading.

## Accessibility

- Each trigger is a `button` inside a heading with `aria-expanded` and `aria-controls`; each content panel carries `role="region"` labelled by its trigger. The heading level is fixed at `h3` by the primitive; place the accordion where an `h3` fits the page outline (WCAG 1.3.1).
- Enter and Space toggle the focused trigger. Tab moves through triggers and any focusable content in order. Arrow keys move between triggers.
- With `type="single"` and no `collapsible`, the open trigger is `aria-disabled`; add `collapsible` so every state is reachable.
- A trigger row is at least the 24px floor (`--weft-touch-target`); the default row is taller.
- The open and close height animation runs 200ms. Under `prefers-reduced-motion: reduce` the consumer's global override collapses it; the component does not.
- Expanding a section does not need a live region; WCAG 4.1.3 excludes disclosure state, which `aria-expanded` already exposes.
