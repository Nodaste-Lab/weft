---
linked_project: Heddle Branding
type: visual-identity
status: draft
updated: 2026-04-28
---

# 08 · Heddle Prompt Handbook

The canonical prompts for generating any Heddle illustration graphic. **This file overrides any other prompt guidance** for graphic creation. The aesthetic foundations these prompts encode — palette mapped to Weft tokens, metaphor library, composition rules — live in [[07-illustration-style]].

## Purpose

This handbook defines the prompt standards for generating **any Heddle illustration graphic.**

Use it for:

- website illustrations *(not Weft page components — see scope below)*
- presentation visuals *(graphics embedded in slides; slide layouts themselves still follow Weft)*
- social graphics
- diagrams
- infographics
- editorial illustrations
- product explainer graphics

The goal is consistency.

Every Heddle graphic should feel:

> **literary, trustworthy, evidence-based, quietly technical, and editorial**

### Scope

This handbook applies to **all illustration graphics**. It does **not** apply to UI / page components — the flow diagram, ecosystem grid, hero stat grid, problem cards, form inputs, and other built-in Weft components stay on the existing Weft system in [[03-color-and-type]] and [[04-design-system]] (royal blue, gold yellow, cream, thread backdrop).

If you're not sure which side of the line your work falls on: if it's a discrete graphic asset that could be exported as a PNG/SVG and embedded somewhere, this handbook governs it. If it's structural page chrome rendered from CSS + HTML on a Weft surface, [[04-design-system]] governs it.

---

## 1. Core Standard

All Heddle illustration graphics should follow these rules:

- Use **Contemporary Engraving / Etching** as the primary illustration style.
- Use the Heddle typography system:
  - **Fraunces** for titles, display numerals, stage names, and italic voice lines
  - **JetBrains Mono** for labels, metadata, pills, footers, and technical annotations
  - **Inter Tight** for body copy, descriptions, captions, and supporting text
- Use a restrained palette:
  - warm off-white / cream
  - charcoal / ink black
  - muted sepia
  - dusty blue
  - soft olive
  - warm gray
  - restrained rust accent
- Use symbolic, archival, and evidence-based imagery.
- Avoid generic SaaS, glossy 3D, neon AI aesthetics, and cartoon-style illustration.

The Weft token mapping for the palette colors is in [[07-illustration-style#Color palette — mapped to Weft tokens|07 · Color palette]]. The descriptive color words are used in prompts because image-gen models respond better to natural language than hex.

---

## 2. Master Prompt

Use this as the base prompt for any Heddle graphic:

```text
Create a Heddle brand graphic using a refined contemporary engraving / etching style. The graphic should feel literary, trustworthy, evidence-based, quietly technical, and editorial.

Use fine ink linework, subtle crosshatching, delicate etched texture, archival paper grain, generous negative space, and restrained composition. The image should feel like an archival editorial artifact for modern team intelligence.

Use Heddle's typography system:
- Fraunces for titles, headlines, display numerals, and italic voice lines
- JetBrains Mono for labels, metadata, section markers, pills, footers, and technical annotations
- Inter Tight for body copy, descriptions, captions, and supporting text

If exact fonts are unavailable, approximate:
- Fraunces as an expressive editorial serif
- JetBrains Mono as a precise technical monospaced font
- Inter Tight as a compact modern sans-serif

Use a restrained palette:
warm off-white, charcoal ink, muted sepia, dusty blue, soft olive, warm gray, and restrained rust accents.

Use symbolic, archival, and evidence-based imagery such as records, ledgers, source materials, stamps, review marks, decision artifacts, and memory systems.

Avoid generic SaaS illustration, corporate Memphis, blob characters, cartoon robots, glossy 3D, neon AI glow, fake dashboards, rainbow networks, cluttered compositions, and overly colorful startup aesthetics.
```

---

## 3. Typography Prompt Block

Add this when you want the generator to respect the Heddle type system:

```text
Use Heddle's typography system:
- Fraunces for the main title, section titles, stage names, display numerals, and italic voice lines
- JetBrains Mono for labels, metadata, pills, footers, source tags, technical annotations, and small system text
- Inter Tight for body copy, readable descriptions, captions, and short explanatory text

If exact fonts are unavailable, approximate:
- Fraunces as an expressive editorial serif with soft curves and strong display presence
- JetBrains Mono as a precise technical monospaced font
- Inter Tight as a compact modern sans-serif optimized for legibility
```

---

## 4. Style Block

Use this when you want to reinforce the approved Heddle art direction:

```text
Use a contemporary engraving / etching style with fine ink linework, subtle crosshatching, delicate etched texture, paper grain, controlled negative space, and restrained editorial composition. The style should feel archival, literary, intelligent, trustworthy, and quietly technical.
```

---

## 5. Negative Prompt Block

Use this with most prompts:

```text
Avoid generic SaaS illustration, corporate Memphis, blob characters, cartoon robots, smiling startup people, glossy 3D, glassmorphism, neon AI glow, cyberpunk effects, fake dashboards, rainbow network diagrams, busy compositions, overly colorful startup graphics, stock vector style, photorealism, and clutter.
```

Short version:

```text
No cartoon SaaS art, no cartoon/mascot robots, no neon glow, no glossy 3D, no fake dashboards, no rainbow networks, no startup illustration clichés.
```

---

## 6. Subject Guidance

Good subjects and motifs for Heddle graphics:

- archives
- ledgers
- books
- records
- source materials
- stamps
- seals
- index cards
- memory systems
- evidence trails
- human review moments
- decision records
- canonical knowledge
- structured paper systems
- instruments of verification
- chain of custody
- review and approval marks

Semantic object guidance:

- Use a restrained mechanical agent marker when the concept is an AI agent, automation actor, or agent-readable workflow. It can have a square head, simple eyes, compact body, and optional antenna, but must stay sober and engraved — not mascot-like.
- Use a bell only for notification, alert, waiting-on-input, or signal events. Do not use bells as generic stand-ins for agents.
- Use human portraits, hands, review marks, or desks when the concept is human review or teammate context.
- Use ledgers, record cards, stamped documents, source trails, or Heddle rails when the concept is canonical memory or source of truth.

Good concepts to visualize:

- provenance
- source of truth
- human review
- decision-making
- alignment
- context sharing
- memory
- authority
- handoff
- canonical knowledge
- evidence-based systems

The full curated metaphor library — including which objects pair with which concepts — lives in [[07-illustration-style#Heddle metaphor library|07 · Metaphor library]]. Reach for an existing metaphor before inventing a new one.

---

## 7. Prompt Formula

Use this simple formula:

```text
[MASTER PROMPT]

Now create a [TYPE OF GRAPHIC] about [SUBJECT].

Purpose:
[WHAT IT NEEDS TO COMMUNICATE]

Include:
[KEY CONTENT OR ELEMENTS]

Semantic constraints:
[WHICH OBJECTS MUST MEAN WHICH PRODUCT CONCEPTS — e.g. agents use restrained robot markers; notifications use bells]

Keep the composition clean, spacious, and editorial.
Keep text concise and on-brand.
```

---

## 8. Ready-to-Use Prompt Templates

### A. General Brand Graphic

```text
Create a Heddle brand graphic using a refined contemporary engraving / etching style. The graphic should feel literary, trustworthy, evidence-based, quietly technical, and editorial.

Use fine ink linework, subtle crosshatching, delicate etched texture, archival paper grain, generous negative space, and restrained composition.

Use Heddle's typography system:
- Fraunces for titles, headlines, display numerals, and italic voice lines
- JetBrains Mono for labels, metadata, section markers, pills, footers, and technical annotations
- Inter Tight for body copy, descriptions, captions, and supporting text

If exact fonts are unavailable, approximate:
- Fraunces as an expressive editorial serif
- JetBrains Mono as a precise technical monospaced font
- Inter Tight as a compact modern sans-serif

Use a restrained palette:
warm off-white, charcoal ink, muted sepia, dusty blue, soft olive, warm gray, and restrained rust accents.

Avoid generic SaaS illustration, corporate Memphis, blob characters, cartoon robots, glossy 3D, neon AI glow, fake dashboards, rainbow networks, cluttered compositions, and overly colorful startup aesthetics.

Now create a brand graphic about [SUBJECT].
Purpose: [PURPOSE].
Include: [CONTENT].
Keep the composition clean, spacious, and editorial.
```

### B. Infographic

```text
Create a Heddle infographic using a refined contemporary engraving / etching style. The infographic should feel literary, structured, trustworthy, and editorial.

Use fine ink linework, subtle crosshatching, delicate etched texture, archival paper grain, and restrained composition.

Use Heddle's typography system:
- Fraunces for the main title, section titles, numerals, and italic voice lines
- JetBrains Mono for labels, metadata, section markers, and footers
- Inter Tight for explanatory text and body copy

Use a restrained palette:
warm off-white, charcoal ink, muted sepia, dusty blue, soft olive, warm gray, and restrained rust accents.

Avoid generic SaaS illustration, glossy 3D, neon AI effects, fake dashboards, cartoon characters, and clutter.

Now create an infographic about [SUBJECT].
Purpose: [PURPOSE].
Include: [SECTIONS / POINTS / STAGES].
Keep the layout spacious, legible, and calm.
```

### C. Process Graphic

```text
Create a Heddle process graphic using a refined contemporary engraving / etching style. Use symbolic, archival, and evidence-based imagery rather than generic tech illustration.

Use fine ink linework, subtle crosshatching, paper grain, generous negative space, and restrained editorial composition.

Use Heddle's typography system:
- Fraunces for the title and major process labels
- JetBrains Mono for small labels, metadata, step tags, and annotations
- Inter Tight for short explanatory text

Use a restrained palette:
warm off-white, charcoal ink, muted sepia, dusty blue, soft olive, warm gray, and restrained rust accents.

Avoid generic SaaS illustration, cartoon robots, glossy 3D, neon glow, rainbow network graphics, and busy layouts.

Now create a process graphic about [PROCESS].
Purpose: [PURPOSE].
Include: [INPUTS, STEPS, OUTPUTS].
Keep the composition clear and editorial.
```

### D. Provenance Graphic

```text
Create a Heddle provenance graphic using a refined contemporary engraving / etching style. The graphic should feel archival, trustworthy, and evidence-based.

Use fine ink linework, subtle crosshatching, delicate etched texture, paper grain, sparse labels, and restrained composition.

Use Heddle's typography system:
- Fraunces for the main title and key display text
- JetBrains Mono for labels, metadata, timestamps, and source tags
- Inter Tight for short explanatory text

Use imagery such as source records, review marks, stamps, evidence trails, canonical records, and human approval cues.

Use a restrained palette:
warm off-white, charcoal ink, muted sepia, dusty blue, soft olive, warm gray, and restrained rust accents.

Avoid generic SaaS illustration, fake dashboards, cartoon characters, glossy 3D, neon AI glow, and clutter.

Now create a provenance graphic about [SUBJECT].
Purpose: show how information becomes reviewed, approved, and canonical.
Include: [SOURCE, REVIEW, APPROVAL, FINAL RECORD].
Keep the composition quiet, precise, and editorial.
```

### E. Social Graphic

```text
Create a Heddle social graphic using a refined contemporary engraving / etching style. The graphic should feel literary, high-trust, and editorial.

Use fine ink linework, subtle crosshatching, paper grain, controlled negative space, and a restrained palette.

Use Heddle's typography system:
- Fraunces for the headline or pull quote
- JetBrains Mono for labels or footer text if needed
- Inter Tight for any short supporting copy

Avoid generic SaaS illustration, neon AI aesthetics, glossy 3D, rainbow networks, fake dashboards, and cartoon characters.

Now create a social graphic about [SUBJECT].
Purpose: communicate one clear idea quickly.
Include: [HEADLINE / CONCEPT / OPTIONAL SUPPORTING COPY].
Keep the composition minimal and memorable.
```

---

## 9. Quality Control Checklist

Before approving a graphic, check:

### Brand Fit

- Does it feel literary and editorial?
- Does it feel high-trust?
- Could it belong specifically to Heddle?
- Does it avoid generic AI/startup visuals?

### Typography

- Is Fraunces used for the primary text?
- Is JetBrains Mono used for labels and metadata only?
- Is Inter Tight used for body copy and readable support text?
- Is the hierarchy clear at a glance?

### Style

- Does it use engraving-like linework?
- Is the texture subtle and refined?
- Is the palette restrained?
- Does it feel calm rather than loud?

### Composition

- Is there enough negative space?
- Is there a clear focal point?
- Is the information easy to scan?
- Is the composition clean and intentional?

### Message

- Does it communicate provenance, memory, review, authority, or alignment?
- Does it feel human-reviewed rather than AI-magical?
- Does it feel like a system of record?

### Semantic Accuracy

- Do agent markers read as agents, not bells, badges, or generic icons?
- Are bells used only for notifications, alerts, or waiting-on-input events?
- Do human reviewers read as humans rather than anonymous avatars when human judgment matters?
- Do source-of-truth elements read as records, ledgers, source cards, or canonical rails rather than fake dashboards?
- If the graphic has stages, does each stage communicate the correct maturity level without relying only on captions?

### Asset Export

- If the graphic is exported as separated assets, are PNGs transparent rather than paper rectangles?
- Does each separated asset have transparent padding so no linework touches the file edge?
- Has the asset been checked on a checkerboard and on Weft cream?
- Is there a full composite source saved beside separated assets for future recrops?

**Approval rule.** A graphic should be approved only if it passes the **Typography Test**, the **Style Test**, the **Brand Test**, and the **Semantic Accuracy Test**. Separated assets must also pass the **Asset Export Test**.

---

## 10. Fast Copy/Paste Version

Use this when you need a quicker version:

```text
Create a Heddle graphic in a refined contemporary engraving / etching style. Make it literary, trustworthy, evidence-based, quietly technical, and editorial. Use fine ink linework, subtle crosshatching, delicate etched texture, archival paper grain, generous negative space, and restrained composition.

Use Heddle's typography system:
- Fraunces for titles, display numerals, and italic voice lines
- JetBrains Mono for labels, metadata, pills, footers, and technical annotations
- Inter Tight for body copy, captions, and supporting text

If exact fonts are unavailable, approximate Fraunces as an expressive editorial serif, JetBrains Mono as a clean technical monospaced font, and Inter Tight as a compact modern sans-serif.

Use a restrained palette: warm off-white, charcoal ink, muted sepia, dusty blue, soft olive, warm gray, and restrained rust accents.

Avoid generic SaaS illustration, corporate Memphis, cartoon robots, glossy 3D, neon glow, fake dashboards, rainbow networks, and clutter.

Now create a [TYPE OF GRAPHIC] about [SUBJECT].
Purpose: [PURPOSE].
Include: [CONTENT].
Keep the composition clean, spacious, and on-brand.
```
