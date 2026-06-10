---
linked_project: Heddle Branding
type: voice-and-tone
status: draft
updated: 2026-04-20
---

# 04 · Voice & Tone

## Voice vs. tone

- **Voice** is who Heddle *is.* It doesn't change.
- **Tone** is how Heddle *sounds in a given moment.* It flexes with the surface and the situation.

## Voice — four words

### Easy

- Plain sentences, short when short works.
- No jargon unless the reader asked for it.
- If a technical term is unavoidable, translate it once and then use it.

### Intelligent

- Doesn't over-explain. Trusts the reader.
- Specific, not vague. Names the thing.
- Quotes the actual number, file, command — not "several items" or "recent activity."

### Supportive

- On the reader's side, always.
- When something's broken, says what broke and what to try — not "oops!" or "something went wrong."
- Never blames the user for Heddle's state.

### Quietly capable

- Competent without advertising it.
- Doesn't use "powerful," "revolutionary," "industry-leading," or any word a VP of Marketing picked.
- Lets the behavior speak. The copy describes, the tool delivers.

## Tone axes

Three dials that Heddle flexes by surface and situation.

### 1. Formality

- **Informal** — morning update, Slack message, HUD microcopy, onboarding hand-offs
- **Neutral** — product UI, docs, installer, CLI
- **Formal** — legal, privacy, status page during an incident

Default: **neutral**. Most surfaces live here.

### 2. Warmth

- **Warm** — first-run, success moments, end-of-task summaries
- **Even** — steady-state UI, most copy
- **Cool** — errors, destructive confirmations, legal

Default: **even**. Warmth is earned, not sprinkled on everything.

### 3. Playfulness

- **None** — errors, destructive actions, legal, incidents
- **Dry** — empty states, light asides, minor confirmations
- **Light** — first-run, success, rare moments of delight

Default: **none to dry**. Playfulness is a garnish. If you notice it, it's too much.

## Tone by surface

| Surface | Formality | Warmth | Playfulness |
|---|---|---|---|
| `heddle init` / first-run | Neutral | Warm | Dry |
| CLI output | Neutral | Even | None |
| CLI errors | Neutral | Cool | None |
| Installer | Neutral | Warm | Dry |
| HUD microcopy | Informal | Even | Dry |
| Morning update | Informal | Warm | Dry |
| Docs | Neutral | Even | None |
| Marketing site | Neutral | Warm | Dry |
| Incident status | Formal | Cool | None |
| Legal / privacy | Formal | Cool | None |

## Tonal flex examples

Same intent, different surface.

### "Sync finished."

- **CLI:** `✓ synced 12 files · 2.3s`
- **HUD:** `Synced · 12 files · just now`
- **Morning update:** `Heddle caught up overnight — 12 files synced, nothing held back.`
- **Installer:** `You're all set. Heddle is running in the background and will sync quietly from here.`

### "This space can't attach right now."

- **CLI:** `space_attach_forbidden: you're not a member of "studio". Ask the owner to add your Clerk account to the space.`
- **HUD:** `Studio space · can't attach yet · ask an owner for access`
- **Morning update:** `The studio space didn't attach this morning — you're not a member yet. Aaron can add your account when you're ready.`
- **Docs:** `If you see space_attach_forbidden, you're not a member of that space. Ask a space owner to add your Clerk account, then sign in again so Heddle can attach it automatically.`

## Signature moves

### Plain-English error prefaces

Every error leads with **what broke** in a sentence a human can read, *then* the technical detail. Not the other way around.

```
Heddle couldn't sync your Private space.
The node service isn't responding — it may not be running.

Try: brew services restart ccore
Then: heddle health
```

### Truthful state, not cheerleading

Heddle tells the reader **what is actually true**. It does not motivate, reassure, or celebrate routine events.

- ✅ "3 files synced. 1 skipped — identical to remote."
- ❌ "Great job! You're all caught up! 🎉"

### Specificity over vagueness

- ✅ "Last synced 4 minutes ago."
- ❌ "Recently synced."

### One idea per sentence

- ✅ "You're signed in with Clerk. This machine stores a local keychain credential for Heddle sync."
- ✅ "Your Clerk credential stays in Clerk. This machine can re-authenticate through Clerk if the local sync credential is missing."
- ❌ "Enter your Heddle passphrase to repair this Clerk-backed account."

## Things Heddle never says

- "Oops!" · "Uh oh!" · "Something went wrong." — always say what actually went wrong.
- "Click here." — link the actual thing.
- "Powerful," "seamless," "revolutionary," "game-changing," "next-generation." — marketing vapor.
- "We're sorry for the inconvenience." — own the problem, don't apologize reflexively.
- "Just…" — "just click the button" diminishes the reader. Cut it.
- Emoji in product copy (✓ and status dots excepted). Morning updates are the one place light emoji can appear.
- Exclamation points in error states. Reserve them for the rare genuine celebration — max one per first-run.

## Things Heddle says carefully

- **"We"** — only when Heddle speaks as the team (legal, release notes). Product copy usually has no first-person at all.
- **"You"** — freely. The reader is the protagonist.
- **Humor** — dry, situational, never at the reader's expense. If it needs an `😅` to land, it doesn't land.

## When to flex playful

Light playfulness is *earned* by the moment:

- First-run success — "Your Heddle is awake." is fine.
- An empty state — "Nothing here yet. That's allowed."
- A 404 — "This page isn't on the loom."

If the surface is routine, skip the flex. A well-made plain sentence is always better than a clever one that makes the reader wait.

## Calibration check

Before shipping copy, read it aloud once. If you'd feel uncomfortable saying it to a friend on a walk, rewrite it.

See [[05-copy-guidance]] for formatting mechanics and [[06-ai-agent-style-guide]] for rich worked examples.
