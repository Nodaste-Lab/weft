---
linked_project: Heddle Branding
type: copy-guidance
status: draft
updated: 2026-04-20
---

# 05 · Copy Guidance

> **Core rule:** Copy should never come in large hard-to-read blocks. Use bullets, headers, and graphics to explain rather than heavy text.

This doc covers **mechanics** — how sentences are shaped, words chosen, and pages structured. For the *feel*, see [[04-voice-and-tone]].

## Structural rules

### Shape of a Heddle page

1. **Headline** — what this is about, in 6 words or fewer.
2. **One-sentence lede** — what the reader needs to know first.
3. **Scannable body** — headers, bullets, tables, code. No paragraphs longer than 3 sentences.
4. **Closing line or action** — what to do next, or nothing.

### Paragraph length

- **Max 3 sentences.** If you have more to say, split, break with a subhead, or convert to a list.
- **One idea per paragraph.** If a paragraph makes two points, it's two paragraphs.

### Sentence length

- **Aim for 12–18 words.** Anything past 25 should be checked for a split.
- Short sentences carry weight. Don't be afraid of one.

## Formatting patterns

### When to use bullets

Use a bulleted list when any of these are true:

- Three or more parallel items
- Items the reader might scan rather than read
- A sequence of conditions, options, or outcomes

Don't use bullets for:

- A single item (just write the sentence)
- Two items (use "and" or "or")
- A narrative flow (use prose)

### When to use tables

Use a table when you're comparing **the same attributes across multiple things**. Two columns is often plenty.

### When to use a callout

Use a blockquote-style callout for **one** of these:

- A warning the reader cannot skip
- A non-obvious rule
- A promise or commitment (privacy, security, pricing)

Don't use callouts to decorate. One per page, max two.

### When to use code blocks

- Any command the reader will run, exactly
- Any output they'll see, exactly
- Any file path, exactly

Inline code for short identifiers; fenced code for anything multi-line or runnable.

## Vocabulary

### Preferred

- `space` — a Heddle sync unit (private, studio, shared, etc.)
- `sync` — the noun and verb for what Heddle does
- `attach` — how a machine joins an existing space
- `account grant` — owner-created shared-space access for a Clerk account or email
- `node` — the background service (`ccore-node` / `heddle-node`)
- `account` — the identity tied to Clerk sign-in
- `session` — an authenticated runtime on one machine

### Avoid

| Don't say | Say instead |
|---|---|
| utilize | use |
| leverage | use |
| robust | reliable / sturdy / specific claim |
| seamless | quiet / background / no-setup |
| powerful | capable / specific claim |
| industry-leading | (cut it) |
| cutting-edge | (cut it) |
| revolutionary | (cut it) |
| AI-powered | runs an agent / uses a model |
| intelligent (as an adjective) | context-aware / pick the specific thing it knows |
| magical | (cut it — and rewrite what you meant) |
| simply / just | (usually a tell that the sentence is dismissing a real step) |
| easily | (show it; don't claim it) |
| click here | link the actual noun |

### Carefully

- **"Secure."** Only when you can back it up with a specific mechanism (E2E, keychain, etc.).
- **"Private."** Same bar — name the property.
- **"Free."** Only if it's free forever. "Free during beta" if that's the truth.

## Punctuation + capitalization

### Sentence case everywhere

- Headings: `Set up your account`
- Buttons: `Install Heddle`, `Sign in with Clerk`, `Refresh session`
- Nav items: `Docs`, `Pricing`, `Changelog`

Title Case Only For: **the product word itself when it's a proper noun in running text** (Heddle, CCore, HUD, DocT), **and nowhere else**.

### Oxford comma

Yes. Always.

### Em dashes

- Use sparingly — for a clean aside that doesn't warrant parentheses.
- Set with spaces either side: `word — word`, not `word—word`.
- Never use three in a sentence.

### Ellipses

- Use for genuine trailing-off or a loading state.
- Never use three dots to mean "and so on." That's what "and so on" is for.

### Numbers

- Spell out zero through nine in prose; numeric from 10 on.
- Numeric always for units, versions, counts, and anything in a UI element.
- Time: `2:30 PM MT` or `14:30 MT`, pick one within a surface.
- Dates in the vault: `YYYY-MM-DD`. Dates in prose: `April 20, 2026`.

### Quotes

- Straight quotes in code; curly quotes in prose where the renderer supports them.
- Nested quotes: double outside, single inside.

## Error-message pattern

Every error has three parts in this order:

1. **What happened**, in plain English.
2. **Why**, if it's knowable and short.
3. **What to try**, as a concrete next action — command, link, or ask.

```
Heddle couldn't reach the hub.
Your network or the hub itself is offline.

Try: heddle health
If the node is up, check your connection and retry in a minute.
```

## Link text

- Link the actual noun. `See the onboarding guide.`
- Never "click here," never "learn more," never "read more."
- If a link is the third word of a sentence, it's fine. If the sentence exists to host the link, delete the sentence and write the link.

## Empty states

Empty states have three jobs — in this order:

1. **Acknowledge the emptiness** without apologizing for it.
2. **Explain what fills it**, concretely.
3. **Offer the next action**, if there is one.

```
No spaces yet.
Your Private space appears automatically after heddle init.
Run it now: heddle init
```

## Notifications + HUD microcopy

- **Under 80 characters** for any HUD line.
- **Subject-verb-object** structure: `Studio · synced · 2m ago`.
- **No punctuation at the end** — HUD lines aren't sentences.
- **No emoji** except `✓`, `·`, status dots.

## Docs patterns

- Every doc page begins with a one-sentence summary of what it's for.
- Every doc page ends with either a next step, a related link, or nothing at all. (No "Thanks for reading!")
- Code examples are complete and runnable. No placeholders like `your-thing-here` without an example value next to them.

## What to do when in doubt

1. Read the sentence aloud. If it sounds like a press release, rewrite it.
2. Check the vocabulary table above.
3. Cross-reference [[04-voice-and-tone]] for the tone axes.
4. If still unsure, leave a draft comment and move on. Clarity > polish.
