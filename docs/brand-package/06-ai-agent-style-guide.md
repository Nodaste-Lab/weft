---
linked_project: Heddle Branding
type: ai-agent-style-guide
status: draft
updated: 2026-04-20
audience: LLMs and agents producing copy for Heddle surfaces
---

# 06 · AI-Agent Style Guide

> **Purpose:** This doc is written to be read by an LLM or agent writing copy for a Heddle surface. Human readers can use it too, but the examples are structured for pattern-matching, not narrative reading.

## How to use this file (for agents)

1. **Read the one-paragraph context** at the top of each section.
2. **Match the user's request to the closest surface type** (CLI, HUD, installer, docs, morning update, error, marketing, Slack/internal).
3. **Find the nearest worked example below.** Copy its *shape* — sentence length, voice, density, punctuation.
4. **Avoid anything in the "Anti-patterns" block** for that surface.
5. **If the situation isn't covered here**, default to [[04-voice-and-tone]] and [[05-copy-guidance]].

## Global behavior rules (non-negotiable)

- **Never invent Heddle capabilities.** If you don't know whether Heddle does something, say so or ask.
- **Never use marketing puffery.** No "powerful," "seamless," "revolutionary," "intelligent," "AI-powered," "magical."
- **Never open an error with "Oops!" or "Uh oh!"** Always lead with what broke.
- **Never use "simply" or "just"** before an instruction.
- **Never celebrate routine events.** No 🎉, no "Great job!", no "You're all set!" unless it's a genuine first-run completion.
- **Always be specific.** Use the real count, file name, command, duration. "Recently" and "several" are banned.
- **Always link the noun.** Not "click here."
- **Always use sentence case** except for proper nouns (Heddle, CCore, HUD, DocT).

---

## Surface 1: CLI output

**Context:** Terminal text. Mono font. Read fast by users who know what they're doing. Every character has to earn its place.

### Patterns

**Success line — single action:**
```
✓ synced 12 files · 2.3s
```

**Success line — with context:**
```
✓ Private space attached · account_rooted · 2 devices
```

**Progress:**
```
→ syncing Private space…
→ attached 4 / 7 spaces
```

**Warning:**
```
! studio space is legacy_compatible
  run: heddle space authority status studio
```

**Error — short:**
```
✗ space_attach_forbidden: studio
  you're not a member of this space.
  ask the owner to add your Clerk account.
  after they do, sign in again and Heddle will attach it automatically.
```

**Error — longer context:**
```
✗ heddle couldn't reach the hub.

  the node service isn't responding — it may not be running.

  try:
    brew services restart ccore
    heddle health
```

### Anti-patterns

- `✓ Successfully synced 12 files in 2.3 seconds!` — too much punctuation, cheerleading tone
- `Oops! Something went wrong.` — no specifics, no lead with the real problem
- `Click here for more info` — not clickable in a terminal anyway
- `Please wait while we sync your files…` — "please wait" is filler

---

## Surface 2: HUD microcopy

**Context:** Tiny UI strings in the ambient HUD. Under 80 characters. Read in peripheral vision. Must work without punctuation at the end.

### Patterns

**Steady state:**
```
Private · synced · 2m ago
Studio · synced · just now
DocT · 4 drafts
```

**In-progress:**
```
Private · syncing…
Studio · attaching
```

**Needs attention:**
```
Studio · can't attach · needs an invite
Private · stale · 6h since last sync
```

**Error:**
```
Node offline · check brew services
Studio · forbidden · ask the owner
```

### Anti-patterns

- `Your Private space has been successfully synchronized!` — too long, too formal, end punctuation
- `✨ All synced up!` — emoji + cheerleading
- `Syncing your files, please wait...` — "please" and ellipsis together read as nagging

---

## Surface 3: Installer / first-run

**Context:** Onboarding a new human. Warm tone, still plain. Make them confident without making promises Heddle can't keep.

### Patterns

**First screen:**
```
## Welcome to Heddle

Heddle keeps your work in context — quietly, in the background.

Let's get you set up. It takes about a minute.

[ Continue ]
```

**Account step:**
```
## Create your account

Your account is how Heddle recognizes you across machines.

- Sign in with Clerk
- Heddle stores a local keychain credential for this machine
- If the local credential is missing, Heddle re-authenticates through Clerk

[ Handle: _________ ]   [ Continue ]
```

**Success screen:**
```
## You're set

Heddle is running in the background. Your Private space will sync quietly from here.

- Check status anytime with `heddle health`
- Shared spaces appear automatically after a space owner grants your Clerk account access
- Manage account sign-in from Clerk

[ Open Heddle ]
```

### Anti-patterns

- "🎉 Congratulations! You've successfully installed Heddle!" — cheerleading, emoji, redundant
- "Let's get started on your Heddle journey!" — "journey" is banned
- "Heddle is an intelligent, AI-powered context platform…" — puffery, and not what Heddle actually is

---

## Surface 4: Docs

**Context:** Readers looking up a specific answer. They want specifics, a command, an example. Prose is fine but bullets and code blocks do most of the work.

### Pattern — a command reference page

```
# Shared space access

Join a shared space after an owner grants access to your Clerk account.

## Usage

    heddle init

## What happens

- Heddle signs in with Clerk and reads the account catalog
- Any shared spaces granted to the account are attached locally
- Sync begins immediately, in the background

## When to use it

When a space owner has added your Clerk account or email to a shared space. For a second machine on the same account, use the same flow — Heddle attaches existing spaces automatically.

## Related

- `heddle space members` — list shared-space members when your permission allows it
- `heddle space invite` — grant another Clerk account access to a shared space
```

### Anti-patterns

- Long paragraphs explaining rationale before the command
- "This powerful command allows you to…" — no
- Missing a concrete example

---

## Surface 5: Morning update / written summary

**Context:** A longer-form written piece that reports on state. Warm but specific. Bullets carry the structure. A dry aside is allowed; a pun isn't.

### Pattern

```
# Morning Update — Monday, April 20

Heddle caught up overnight. Three things worth your eye today:

## 🔴 Studio sync — blocked on an invite

The studio space tried to attach at 06:14 and couldn't — you're not a member yet. Aaron can add your Clerk account when you're ready.

**What to do:** ping Aaron to add your account, then sign in again.

## 🟡 Local session — needs refresh

Not urgent. This machine needs a fresh Clerk-backed session before it can sync again.

## 🟢 Resolved since Friday

- Private space cut over to `account_rooted` on Friday at 11:42
- 37 files synced overnight, all clean

---

*Generated by heddle-updates · 2026-04-20 · covers since your last work day*
```

### Anti-patterns

- Starting with "Good morning!" every day — becomes noise fast
- Using "you" as a cheerleader: "You're doing great!"
- Padding: "Just wanted to let you know that…"

---

## Surface 6: Errors and blockers

**Context:** The reader is frustrated or confused. The copy's job is to lower the temperature by being specific and actionable.

### Pattern — three-part error

```
Heddle couldn't refresh your local session.

Clerk is the credential broker, but this machine could not write the refreshed local sync credential.

What to do:
1. Do not retry the rotation — it will fail closed.
2. Check the service: brew services list | grep ccore
3. If the service is up, run: heddle account repair-session
4. If that fails, open a ticket and include the session id printed above.
```

### Pattern — short error

```
This account grant is no longer active.

Ask a space owner to grant your Clerk account access again, then sign in again.
```

### Anti-patterns

- "Something went wrong :(" — useless
- "Error: ENOENT: no such file or directory, open '/Users/.../config.toml'" — raw trace without a human lead
- "Please try again later." — later *when*? say what to check.

---

## Surface 7: Marketing / landing page

**Context:** A stranger lands on heddle.com (or wherever). They have eight seconds. The page has to read as serious software without posturing.

### Pattern — hero

```
# Heddle

Your work has context. Heddle holds it.

A quiet layer that keeps your spaces, docs, and signals in the right order — across every machine you sign in on.

[ Install Heddle ]   [ See how it works ]
```

### Pattern — feature block

```
## Spaces that sync themselves

- One install, one account, every machine attached in seconds
- Private and shared spaces, encrypted end-to-end
- Background sync — no menu to open, no button to click
```

### Anti-patterns

- "Heddle is a revolutionary AI-powered platform that…" — lose in the first three words
- "Unleash your productivity!" — verb crime
- Hero image of a handshake, lightbulb, or glowing brain

---

## Surface 8: Internal Slack / hand-off

**Context:** A human (or agent on behalf of one) asking a teammate for something. Short, specific, kind.

### Pattern — ask

```
Hey — can you add my Clerk account to the studio space when you have a sec? Stuck at space_attach_forbidden on my laptop.

No rush, just when it's convenient.
```

### Pattern — hand-off

```
Handing off the Fueled packet review — it's sitting at `ready-for-review`, ~10 min read. Anonymization is the thing I'd check most carefully.

Pingback here when you have a take.
```

### Anti-patterns

- "Hey!! Hope you're having a great Monday!! Just wondering if maybe when you have a chance…" — all padding
- "Per my last message…" — this never lands warmly
- "Circling back" — as a verb, avoid

---

## Worked rewrites (before / after)

### Rewrite 1 — success message

**Before:** "🎉 Congratulations! Your Heddle account has been successfully created and you're now ready to start your Heddle journey!"

**After:** "Your account is set up. Heddle is syncing your Private space now — give it a minute and you're good to go."

### Rewrite 2 — error

**Before:** "Oops! Something went wrong while trying to sync. Please try again later or contact support if the issue persists."

**After:**
```
Heddle couldn't sync your Private space.
The node service isn't responding — it may not be running.

Try: brew services restart ccore
Then: heddle health
```

### Rewrite 3 — docs intro

**Before:** "In this section, we will walk you through the powerful capabilities of Heddle's robust account management system, which provides industry-leading security for your valuable data."

**After:** "Your account is how Heddle recognizes you across machines. This page covers Clerk sign-in, local device trust, and session recovery."

### Rewrite 4 — HUD line

**Before:** "Your Private space has finished synchronizing all pending changes just now."

**After:** `Private · synced · just now`

### Rewrite 5 — marketing hero

**Before:** "Heddle is the next-generation AI-powered context platform that seamlessly integrates with your workflow to unleash unprecedented productivity gains."

**After:**
```
Heddle holds your work in context.

Spaces, docs, and signals — synced quietly across every machine you sign in on.
```

---

## Tone calibration cheat sheet

If an agent is unsure how warm or playful to be, use this:

| Is the user… | Write like… |
|---|---|
| seeing this for the first time | a kind colleague showing them around |
| hitting an error | a calm senior engineer on the phone |
| reading an error log | a code comment — clear and structured |
| in a working loop (HUD, CLI) | the fewest words that carry the meaning |
| reading a morning update | a thoughtful peer summarizing the night |
| on a marketing page | a product-minded founder who doesn't oversell |
| reading legal / privacy | a careful, honest draft a lawyer would sign |

---

## When the situation is new

If an agent faces a copy task that doesn't fit these patterns:

1. **Identify the surface** closest in character (CLI, HUD, docs, etc.).
2. **Take one worked example** and use its sentence shape.
3. **Check anti-patterns** for that surface.
4. **Cut every sentence by a quarter.** If it still reads, the first draft was too long.
5. **If in doubt, be plainer.** Heddle's brand has never been hurt by a sentence being too simple.

---

## Self-check (run this on every piece of copy)

- [ ] Does it lead with what the reader needs to know first?
- [ ] Any sentence over 25 words?
- [ ] Any banned word (`powerful`, `seamless`, `simply`, `just`, `intelligent`, `AI-powered`)?
- [ ] Any cheerleading in a steady-state context?
- [ ] Is every claim specific — real number, real file, real command?
- [ ] Is the action clear, and is it the next command/link the reader can use?
- [ ] Would you feel comfortable saying this aloud to a colleague?

If any answer is "no" or "not sure," revise before shipping.
