---
linked_project: Heddle Branding
type: brand-package-index
status: draft
updated: 2026-04-20
owner: Katie
---

# Heddle Brand Package

A working brand kit for **Heddle** — the team-focused context and collaboration layer that brings CCore, HUD, and DocT together.

Use this folder as the single source of truth for anyone (human or agent) writing copy, placing the logo, or shipping a surface under the Heddle name.

> **Vendored copy.** This folder is a snapshot of the brand-package spec, vendored into the Heddle repo so the codebase doesn't depend on any external path. Updates flow in by re-vendoring; treat this as read-only from inside Heddle. Asset binaries (logo SVGs, comps, exports) are not included — they live in the source brand kit and ship to Heddle via `src/assets/` when needed.

## What's in here

- [[01-brand-overview]] — what Heddle is, who it's for, the one-line essence
- [[02-logo-usage]] — marks, lockups, clearspace, do/don't
- [[03-color-and-type]] — palette + type system
- [[04-voice-and-tone]] — personality, tonal flex, surface-by-surface
- [[04-design-system]] — **Weft**, the implementation reference (tokens, components, dark mode) · [Figma file](https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System)
- [[05-accessibility]] — WCAG 2.1 audit + remediation status for Weft
- [[05-copy-guidance]] — formatting rules, vocabulary, patterns
- [[06-ai-agent-style-guide]] — worked examples written for agents to pattern-match against
- [[07-illustration-style]] — engraving / etching aesthetic foundations + Weft palette mapping
- [[08-image-generation-prompts]] — **prompt handbook** (overrides any other prompt guidance for graphic creation; includes per-asset templates + QC checklist)
- [[09-app-primitives]] — Weft extension for the Heddle app: density mode, shadcn → Weft token bridge, per-primitive anatomy for all 41 UI primitives
- [[10-language-index]] + `language-index.json` — term-level registry for canonical labels, alternatives, avoid lists, surface rules, and feedback history
- `landing-page.html` · `design-system.html` — rendered references on Weft
- `assets/` — SVG marks and lockups

## Weft — the design system

Weft is the name of the design system Heddle uses on the website. Every CSS custom property Weft owns is namespaced `--weft-*` (e.g. `--weft-blue`, `--weft-on-blue`, `--weft-focus-ring`). This prefix is the migration signal: any `--token` you see without the `--weft-` prefix in a Heddle file belongs to the older website and needs to be migrated. There is no compatibility bridge between the two namespaces.

For the full token list and component catalog, see [[04-design-system]].

## Status and scope caveat

> ⚠️ **This package is draft-stage working guidance, not a finished brand book.**
> - The name `HEDDLE` has **not** been trademark-cleared. See [[Heddle Naming Clearance and Brand Risk Report - 2026-03-25]] and [[Heddle AI Status Follow-up - 2026-03-25]] for the risk summary.
> - Use this package for internal tools (menu bar, installer, CLI, HUD, internal docs) while the naming question is unresolved.
> - Do **not** ship public marketing, press, or investor materials under this exact brand without attorney review.

## How to use this package

- **Writing copy for a Heddle surface?** Start at [[04-voice-and-tone]], then check [[05-copy-guidance]] for formatting rules.
- **Pointing an agent at Heddle copy?** Hand them [[06-ai-agent-style-guide]] — it's written to be readable by an LLM.
- **Placing the logo anywhere?** Read [[02-logo-usage]] first. Primary mark lives at `assets/heddle-mark.svg`; primary lockup at `assets/heddle-lockup.svg`.
- **Making a new visual surface?** Check [[03-color-and-type]] for palette and type.
- **Drawing or generating an illustration?** Start at [[07-illustration-style]] for the aesthetic, then [[08-image-generation-prompts]] for prompt templates.

## Quick reference — the essence

- **Personality:** easy, intelligent, supportive, quietly capable
- **Tone:** plainspoken, reassuring, smart but never showy, quietly confident, human-first, lightly playful when it fits
- **Copy shape:** bullets, headers, graphics. Never dense blocks of text.
- **Metaphor:** a heddle is the part of a loom that holds threads in the right order so the pattern comes out right. The brand carries forward that sense — structure you barely notice until it's working for you.

## Related vault notes

- [[Heddle Branding]] — parent project note
- [[Heddle Naming Clearance and Brand Risk Report - 2026-03-25]]
- [[Heddle AI Status Follow-up - 2026-03-25]]
- Decision Log `D-022` — Historical package-naming decision for Heddle (CCore + HUD + DocT)
