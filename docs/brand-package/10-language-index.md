---
linked_project: Heddle Branding
type: language-index
status: draft
updated: 2026-06-27
audience: humans and agents writing Heddle UI, website, CLI, and support copy
---

# 10 · Language Index

> **Purpose:** This index is the term-level registry for post-alpha Heddle copy. Use it to pick the canonical label for a concept, check which alternatives fit each surface, avoid internal or overloaded words in user-facing strings, and record the decisions that change this guidance.

## How to use this file (for agents)

1. **Match the concept.** Search by internal term, current UI string, code status, or user-facing noun.
2. **Read the term row.** Use `Canonical` first unless the surface rule says to soften or narrow it.
3. **Check the surface column.** HUD/UI, website, CLI, and support can use different levels of operator language.
4. **Read avoid and rationale.** Do not replace an avoided term with another avoided synonym.
5. **Log feedback if ambiguous.** Add a dated note under **Feedback log** and keep `language-index.json` in sync.

## Relationship to other docs

| Source | Use it for | Relationship |
| --- | --- | --- |
| [[04-voice-and-tone]] | Voice, tone, and surface examples | Sets the feel; this file resolves terms. |
| [[05-copy-guidance]] | Formatting rules and broad vocabulary | Supplies preferred and avoid lists that become term rows here. |
| [[06-ai-agent-style-guide]] | Agent-readable examples by surface | Supplies copy shapes and anti-patterns for CLI, HUD, docs, errors, and marketing. |
| [ERROR_INVENTORY.md](../ERROR_INVENTORY.md) | Supported app error/status states | Supplies alpha status names and user-action context. |

## Maintenance rules

- Add a row when a term appears in UI, website, CLI, docs, support, or agent prompts.
- Use the status enum from `language-index.json`: `preferred`, `allowed`, `allowed-with-context`, `internal-only`, `avoid`, `deprecated`, `review`.
- Mark unsettled product-language calls `review`; do not promote them to `preferred` without a feedback-log note.
- Keep Markdown and `language-index.json` in sync in the same change.
- Put code paths in `code_refs` when a term exists in source, tests, or operator runbooks.
- Use this feedback format: `YYYY-MM-DD - Author - Note`.

## Master terms grid

| ID | Canonical | Status | UI | Website | CLI | Avoid | Preferred alternative |
| -- | -- | -- | -- | -- | -- | -- | -- |
| `sync-degraded` | degraded sync | review | allowed-with-context | avoid | allowed | unhealthy; broken sync | sync warning; needs attention |
| `quarantine` | needs review | review | allowed-with-context | avoid | allowed-with-context | quarantined envelope; bad envelope | held aside; saved change needs review |
| `space-sync-status` | space sync status | review | preferred | allowed-with-context | allowed | space health on website; unhealthy space | sync status |
| `recovery-space` | recovery space | allowed | allowed-with-context | avoid | allowed | restore target; backup clone | recovered space |
| `blocked-source` | blocked | allowed-with-context | allowed-with-context | avoid | allowed | broken; dead | blocked until access is fixed |
| `unreachable-source` | unreachable | allowed | allowed-with-context | avoid | allowed | dead; missing forever | cannot reach; check access |
| `local-reset` | reset local state | review | allowed-with-context | avoid | allowed-with-context | factory reset; wipe everything | local reset |
| `substrate` | background service | avoid | avoid | avoid | internal-only | substrate; context substrate | service; local node; context store |
| `weaving-metaphor` | thread metaphor | allowed-with-context | avoid | allowed-with-context | avoid | loom error copy; woven status | holds work in context |
| `ai-powered` | uses a model | avoid | avoid | avoid | avoid | AI-powered; powered by AI | runs an agent; uses a model |
| `intelligent` | context-aware | avoid | avoid | avoid | avoid | intelligent platform | context-aware; specific behavior |
| `seamless` | quiet background sync | avoid | avoid | avoid | avoid | seamless; frictionless | quiet; background; no setup |
| `space` | space | preferred | preferred | preferred | preferred | workspace; vault as generic | Private space; shared space |
| `private-space` | Private space | preferred | preferred | allowed-with-context | preferred | Personal space as current noun; personal workspace | active Private space; shared space |
| `attach` | attach | preferred | preferred | allowed | preferred | onboard a machine; bind | join an existing space |
| `account-grant` | account grant | preferred | allowed-with-context | allowed-with-context | preferred | invite as the only noun; permission magic | owner-granted access |
| `node` | node | allowed-with-context | allowed-with-context | avoid | allowed | daemon in UI; substrate | background service; Heddle service |
| `authority` | access proof | review | allowed-with-context | avoid | internal-only | authority in HUD copy; canonical authority | membership proof; access check |

## Term details

### Degraded sync

Use operator precision in Settings and CLI; soften steady-state HUD copy.

- **Say:** `Studio - sync warning - 2 saved changes need review`
- **Do not say:** `Studio space is degraded and unhealthy`
- **Rationale:** Alpha source validation uses `degraded` for non-blocking sync warnings. HUD copy should lead with what the operator can do.
- **Code refs:** `docs/ERROR_INVENTORY.md`, `src/app/services/sourceValidationService.ts`, `src/app/services/ccoreSpaceSourcePicker.ts`

### Needs review

Prefer the user outcome over the internal quarantine mechanism.

- **Say:** `One saved change needs review`
- **Do not say:** `This quarantined sync envelope is bad`
- **Rationale:** `quarantine` is useful for support and CLI diagnostics, but UI should explain that Heddle held a saved change aside until it is reviewed.
- **Code refs:** `src/app/services/sourceValidationService.ts`, `src/app/services/ccoreSpaceSourcePicker.ts`, `src/app/components/panels/SpacesPreferencesPanel.tsx`

### Space sync status

Use status language for product copy; reserve health language for current alpha headings until renamed.

- **Say:** `Review space sync status`
- **Do not say:** `Space Health proves the space is healthy`
- **Rationale:** `health` reads clinical and binary. `status` fits product surfaces and supports partial states like `blocked`, `degraded`, and `unreachable`.
- **Code refs:** `docs/ERROR_INVENTORY.md`, `src/app/components/panels/SpaceHealthReportSection.tsx`

### Recovery space

Use for the import flow that creates a separate inspection copy.

- **Say:** `Restore into a new recovery space`
- **Do not say:** `Restore over this backup clone`
- **Rationale:** The Settings flow creates a new space before writes. It is not an existing-destination restore.
- **Code refs:** `docs/SPACE_BACKUP_EXPORT_IMPORT_RUNBOOK.md`, `src/app/services/backupExportImportService.ts`

### Blocked

Pair the status with the blocker and next action.

- **Say:** `Studio - blocked until access is verified`
- **Do not say:** `Studio is broken`
- **Rationale:** `blocked` is accurate for validation and error states when Heddle cannot safely continue.
- **Code refs:** `docs/ERROR_INVENTORY.md`, `src/app/services/sourceValidationService.ts`

### Unreachable

Use when Heddle cannot reach a path, runtime, or selected space.

- **Say:** `Heddle cannot reach this source. Check access, then revalidate.`
- **Do not say:** `This source is dead`
- **Rationale:** `unreachable` is concrete and reversible. Lead with the next check.
- **Code refs:** `docs/ERROR_INVENTORY.md`, `src/app/services/sourceValidationService.ts`

### Reset local state

Use destructive-recovery copy that names the local scope.

- **Say:** `Reset local state`
- **Do not say:** `Factory reset Heddle`
- **Rationale:** The reset is local product state, not the user's account, cloud data, or every machine.
- **Code refs:** `src/app/components/LocalResetDialog.tsx`, `src/app/services/localResetService.ts`, `native/macos/SpriteHUD/SpriteHUD/LocalResetCoordinator.swift`

### Background service

Do not expose `substrate` in user-facing copy.

- **Say:** `Heddle service`, `background sync`, `local node`, or `context store`, based on the mechanism.
- **Do not say:** `context substrate`
- **Rationale:** `substrate` is internal architecture language. User-facing copy should name the service or behavior they can observe.
- **Code refs:** `docs/brand-package/01-brand-overview.md`, `docs/brand-package/05-copy-guidance.md`

### Thread metaphor

Keep weaving language for brand and illustration, not status lines.

- **Say:** `Heddle holds your work in context`
- **Do not say:** `This page is not on the loom` in product errors
- **Rationale:** Loom/thread language supports the brand metaphor on website and illustration surfaces. Error, Settings, CLI, and status copy need direct operator language.
- **Code refs:** `docs/brand-package/01-brand-overview.md`, `docs/brand-package/07-illustration-style.md`

### Puffery terms

Replace broad claims with specific mechanisms.

- **Say:** `runs an agent`, `uses a model`, `context-aware`, `background sync`, or `no setup`
- **Do not say:** `AI-powered`, `intelligent`, or `seamless`
- **Rationale:** These terms are already banned in copy guidance because they hide the actual capability.
- **Code refs:** `docs/brand-package/05-copy-guidance.md`, `docs/brand-package/06-ai-agent-style-guide.md`

### Space

Use as the canonical sync unit noun.

- **Say:** `Private space`, `shared space`, `studio space`
- **Do not say:** `workspace` when the user-visible Heddle sync unit is meant
- **Rationale:** `space` is already the preferred noun across copy guidance, onboarding examples, and source validation surfaces.
- **Code refs:** `docs/brand-package/05-copy-guidance.md`, `docs/brand-package/06-ai-agent-style-guide.md`

### Private space

Use for the canonical synced workspace for the active account/organization context.

- **Say:** `Your Private space is synced`, `active Private space`, `Private space for Nodaste`
- **Do not say:** `Personal space` for current product behavior, `personal workspace`, or copy implying individual ownership
- **Rationale:** NOD-900/NOD-977 made the default workspace organization- or account-as-organization-custodied. `Personal` remains only for legacy migration/history, not current user-facing copy.
- **Code refs:** `ccore/spec/architecture/private-space-ownership-v1.md`, `spec/architecture/private-space-ownership-implementation.md`, `src/app/services/accountSharingService.ts`, `plugins/heddle/scripts/lib/ccore.js`

### Attach

Use for a machine joining an existing space.

- **Say:** `Heddle attaches existing spaces automatically`
- **Do not say:** `Bind this machine to a space`
- **Rationale:** `attach` is short, concrete, and already used in CLI/HUD examples.
- **Code refs:** `docs/brand-package/04-voice-and-tone.md`, `docs/brand-package/06-ai-agent-style-guide.md`

### Account grant

Use for owner-created shared access tied to a Clerk account or email.

- **Say:** `Ask a space owner to grant your Clerk account access`
- **Do not say:** `The invite grants magic access`
- **Rationale:** `account grant` distinguishes access policy from invitation messaging and keeps CLI/docs precise.
- **Code refs:** `docs/brand-package/05-copy-guidance.md`, `docs/brand-package/06-ai-agent-style-guide.md`

### Node

Use `node` where the reader expects system precision; soften it in HUD copy.

- **Say:** `The Heddle service is not responding`
- **Do not say:** `The substrate daemon failed`
- **Rationale:** CLI/docs readers can handle `node`; HUD and support should name the service first.
- **Code refs:** `docs/brand-package/05-copy-guidance.md`, `docs/brand-package/06-ai-agent-style-guide.md`, `src/app/services/localRuntimeDiscovery.ts`

### Access proof

Avoid internal authority language unless the surface is diagnostic.

- **Say:** `membership proof`, `access check`, or `producer proof`
- **Do not say:** `canonical authority failed` in HUD copy
- **Rationale:** Authority/canonical terms are useful in diagnostics and engineering docs, but normal product copy should explain the proof or check that failed.
- **Code refs:** `src/app/services/sourceValidationService.ts`, `src/app/services/accountSharingService.ts`

## Feedback log

Use this section for changes that affect term status, canonical labels, or surface rules.

- `2026-06-11 - Symphony - Seeded v1 from alpha UI terminology, brand-package copy guidance, error inventory, source validation, and backup/import runbook.`
- `2026-06-27 - agent - Added Private space as the canonical term for the current account/org default workspace; Personal space is legacy/history only.`
- `YYYY-MM-DD - Author - Term ID: decision or ambiguity to resolve.`
