---
related:
  - collapsible
  - accordion
  - panel-block-shell
  - section-block
---

# Recap section shell

## Purpose

A collapsible section for a recap rail: a full-width header button with an icon, a title, a count pill and a chevron, over a body region. It is controlled (`open`, `onToggle`) and draws its own bottom rule so sections stack with one rhythm. It owns the disclosure and the rule; the body is the consumer's.

## When to use

- Sections of a recap or summary stacked in a column, each opened independently, each with a count (beats, decisions, open questions).

## When not to use

- One disclosure around inline content. Use `collapsible`.
- Sections with heading semantics that open one at a time. Use `accordion`.
- A block in a composed panel that can be selected. Use `panel-block-shell`.
- Generated output with foldable items inside. Use `section-block`.

## How to use

1. Render `RecapSectionShell` with `title`, `open` and `onToggle`. Keep the open state in the parent so it survives re-render.
2. Pass `count` as the number of items in the body. Leave it off when the section kind has nothing to count.
3. Pass a 12px `icon`; it is decorative.
4. Choose `density` (`default` or `compact`) to match the rail.
5. Set `headerId` and `panelId` when another element needs to reference them; otherwise ids are generated.

## Heuristics

- Stack shells directly inside one framed container. Each draws its own bottom rule; the container draws the outer frame.
- The count matches what the body holds. A section with zero items shows "0", because the section exists for the document kind; a section whose data does not apply is left out.
- Open by default the sections most readers need. Hiding what most readers want costs a click every time.
- The closed body is unmounted. Do not keep unsaved input only inside it.
- The header's hover tint also shows on keyboard focus through the global focus ring.

## Content

- The title is a sentence-case noun ("Beats", "Open questions"). The primitive draws it uppercase with tracking; author it in sentence case so the text is right when the casing ruling lands in the component.
- The count is an integer. Nothing else goes in the pill.

## Accessibility

- Ships: the header is a real button with `aria-expanded` and `aria-controls`; the body is `role="region"` labelled by the header; the chevron is hidden from assistive technology.
- The header button spans the full width at 32px (default) or 28px (compact), above the 24px floor (`--weft-touch-target`).
- Do not put interactive content in `title`, `count` or `icon`; they render inside the button.
- Enter and Space toggle the section, as the disclosure pattern expects.
- The only motion is a colour transition on hover; nothing needs reducing.
