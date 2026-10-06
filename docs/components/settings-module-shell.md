---
related:
  - card
  - panel-block-shell
  - eyebrow-label
  - form
---

# Settings module shell

## Purpose

A bordered module for one group of settings: a header with an eyebrow, an `<h3>` title, a description and an actions slot; a flex-column body; an optional footer. Three tones (`default`, `subtle` for a nested module, `inset` for inside a dialog) and a `collapsed` flag that hides the body. It owns the chrome and the header layout; the fields are the consumer's.

## When to use

- A self-contained group of settings with a name and a master control in its header: account, app settings, a module's configuration.
- Modules nested in a settings page (`subtle`) or shown inside a dialog (`inset`).

## When not to use

- A container with no settings semantics. Use `card`.
- A block in a composed panel. Use `panel-block-shell`.
- A section the reader opens and closes. The shell has `collapsed` but ships no toggle; compose one, or use `collapsible` or `accordion`.

## How to use

1. Render `SettingsModuleShell` with `title`, and optionally `eyebrow` (a string renders through `eyebrow-label`) and `description`.
2. Put the module's master control or action in `actions`: a switch, a button.
3. Put labelled fields in the body as children (`form`, `label`, `input`, `switch`). Use `bodyClassName` for a grid.
4. Put secondary actions in `footer`; they align right above a top rule.
5. Pick `tone` for the context. Pass `collapsed` to hide the body while keeping the header.

## Heuristics

- One module, one concern. Two unrelated groups are two modules.
- The header action is the module's master switch when it has one; its state is the module's state.
- The description says what the module does, not how to operate it.
- The body's top rule appears only when there are children, so an empty module reads as a header alone.
- `subtle` nests inside `default`. Do not nest `default` inside `default`.
- Hover-revealed actions in the header also appear on `:focus-within`.

## Content

- The eyebrow is a category label in sentence case ("Module", "Account").
- The title is a sentence-case noun phrase ("Live transcription").
- The description is one sentence ending in a full stop.
- Footer links are verb-first ("Open advanced settings").
- No copy ships by default; every slot is empty until filled.

## Accessibility

- Ships: `<section>`, `<header>`, `<h3>` and `<footer>` land in the outline. Check that `h3` is the right level for the page.
- The section has no accessible name. Pass `aria-label` equal to the title when the module should be a landmark readers can jump to.
- The header control is named with the module ("Toggle live transcription"), not just "Toggle".
- Every field in the body has a label; a hint or error is linked with `aria-describedby`.
- If a consumer adds a collapse control, it carries `aria-expanded` and `aria-controls` to the body.
- Actions meet the 24px floor (`--weft-touch-target`). The global focus ring applies.
