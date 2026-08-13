---
title: Input heuristics
linked_project: Heddle Branding
status: adopted — merged into 04-design-system.md (weft#16 P8, 2026-08-11); this file stays canonical for the rules' provenance, tags and amendments
scope: Components → Form inputs
---

# Input heuristics

Weft inputs are rarely the primary action on a surface. These rules keep them quiet at rest and strict at commit.

Every rule below is tagged with where it comes from:

- **[SC]** — normative WCAG 2.2 success criterion (October 2023).
- **[R]** — published research, 2020 or later.
- **[C]** — house convention. Reasoned, not measured. Argue with it.

> **Why this file exists.** This draft lived only inside the weft#16 plan document, quoted verbatim, which meant the rules could not be edited, diffed or reviewed independently of the plan — and two of them contradict each other. It now has a home so that can be fixed here rather than carried as an exception somewhere else. **The merge into [[04-design-system]] happened (weft#16 P8):** the Form inputs section there carries the operative rules as shipped and tested; this file stays canonical for where each rule *comes from* — the SC/R/C tags, the original wording, and the amendments that superseded parts of it. One text with the argument, one with the contract; neither restates the other.
>
> Decisions taken against these rules since the draft was written are recorded in **Amendments** at the end. Where an amendment changes a rule, the rule text below is left as originally written and the amendment states what supersedes it — so the argument stays legible rather than being overwritten.

---

## 1. Resting weight follows frequency, not importance **[C]**

Pick the tier by how often the field is touched, not by how much the value matters.

| Tier | Use when | Resting form |
|---|---|---|
| Trigger-then-field | The input is rare and has no value to show | A labelled control (`Add note`, `Set threshold`) that reveals the field |
| Value-as-field | The input has a current or default value | A real `input` or `textarea` styled to read as text — see the contract below |
| Low-weight field | The surface is scanned deliberately | Filled background, no border, reduced contrast |

Default to trigger-then-field. A labelled button is easier to find than an empty box, and it costs nothing at rest.

**Value-as-field is a real native control, not a disclosure.** Settled during weft#16; the appearance is the only thing that is quiet.

- A real `input` or `textarea`, never an element that reveals one on activation.
- Always in normal tab order, with its ordinary accessible name and current value.
- The underline or other quiet treatment is appearance only and changes no behaviour.
- In error the field stays visible and the message attaches to it.
- Overflow uses native input scrolling; the value is never truncated.
- Direction inherits, so right-to-left works without special handling.

> **Amendment A3 supersedes the third tier.** "Filled background, no border" is not achievable — see the amendment.

## 2. Every input keeps one boundary **[C]**

Reduce contrast, not structure. A field may lose its border **or** its fill — never both.

- Fill without border: fine.
- Border without fill: fine.
- Neither: the field is now indistinguishable from layout, and nobody will find it.

> **Amendment A2 narrows this.** "Fill without border" turns out not to be available in Weft's palette.

## 3. Hover is never the only signifier **[C]**

If the input only announces itself on `:hover`, it does not exist on touch, and it does not exist for keyboard-first users. Hover may reinforce. It may not carry.

The same applies to a `cursor: text` change with no visual state.

## 4. Reward early, punish at commit **[R]**

Baymard's checkout testing (2024) found three details separate inline validation that helps from inline validation that drives abandonment: don't validate prematurely, clear the error the moment the input is corrected, and use positive confirmation where the field is hard to get right.

For Weft, that means:

- Validate on blur, `Enter`, or explicit save. Never on keystroke.
- **`Enter` does not commit a multiline `textarea`** — there it inserts a newline, and treating it as a commit boundary would make the control unusable. Multiline fields commit on blur or on an explicit save only.
- **Input-method composition is not a commit.** No commit fires while composition is in progress, whatever key ends a candidate selection.
- **Once a field is in error, re-validate on keystroke.** The error disappears as soon as it is fixed.
- Positive validation only where the format is genuinely ambiguous. Not on every field.

A field that is never submitted as part of a form — an inline setting, a filter, a rename — has no submit event to fall back on, so blur or an explicit save is the only commit boundary it gets. Nothing invalid persists past it.

> **Amendment A4 qualifies the final sentence** for checks that cannot answer synchronously.
>
> The original wording of this rule said *optional* inputs have no submit event. That was false — a field participates in its form regardless of whether it is optional — and it has been corrected above to describe fields that are not submitted at all.

## 5. Empty is a valid state **[C]**

An optional field that is cleared returns silently to rest. No error, no red, no hint.

Absence is an answer.

## 6. Invalid never collapses **[C]**

If a field can close, an invalid value has nowhere to display its error. Two legal outcomes:

1. Hold the field open until it is valid or explicitly discarded.
2. Carry the error state on the collapsed representation, with `aria-invalid` and the hint intact.

Silent revert is not one of them. It eats work without telling anyone.

## 7. Mark the minority **[C]**

The usual advice — mark optional fields — assumes most fields are required. Weft inverts that.

- Most fields optional → mark the required ones.
- Never mark both.

## 8. Never re-ask for what you already have **[SC 3.3.7 Redundant Entry, Level A]**

Information the user has already entered in a process is auto-populated or offered for selection. This is Level A, and it is the criterion low-chrome inputs fail most often, because a quiet field is easy to duplicate across panels without noticing.

## 9. Focus survives the chrome **[SC 2.4.11 Focus Not Obscured, Level AA]**

A focused control must not be entirely hidden by author content. HUD panels, sticky toolbars, and floating chrome are the risk.

- `scroll-padding-top` on `html` handles most cases.
- Check every panel that can overlay a scroll region.
- `var(--weft-focus-ring)` stays visible in both themes.

## 10. Errors are copy first, colour second **[C]**

Already shipped in Weft. Restated because low-chrome fields make it tempting to signal with a border alone.

- `aria-invalid="true"` on the control, plus `aria-describedby` → the error hint.
- Error token is `--weft-stop`. No raw red.
- The hint copy is the signal. The border is reinforcement.

Error copy follows the three-part pattern: what happened, why, what to try.

> **Amendment A5 makes the composition explicit** when a field carries both help and error text.

## 11. Size floors hold at every tier **[SC 2.5.8 Target Size (Minimum), Level AA]** + **[C]**

Quiet does not mean small. **The two floors in this rule come from different places and must not be cited as one.**

- **[SC]** Hit area at least 24 by 24 CSS pixels on every control, including a collapsed trigger. This is the normative criterion.
- **[C]** A 44px clearance convention, defined in A1. This is a Weft house rule and is *not* SC 2.5.8 — that criterion's own figure is 24, and 44 is Level AAA under a different criterion (2.5.5) which Weft does not claim to meet.
- **[C]** A value-as-field control needs padding to reach the 24px floor. A bare line of text will not.

> **Amendment A1 supersedes the original second bullet**, which set a 44px minimum control height and a 16px type minimum.

---

## What this doesn't cover

Three questions we don't have post-2020 evidence for, and shouldn't pretend to:

- **Label alignment.** The eye-tracking work is 2006–2008 and contradicts itself. Weft's top-aligned label is a house choice. (The mono-*caps* treatment is no longer the input-label style: weft#16 settled field labels and group legends as sentence case, which is what fixes the announced name. Uppercase mono survives on non-input labels — eyebrows, pills — and that is out of scope here.)
- **Placeholder-as-label.** Widely criticised, thinly measured. Weft doesn't allow it; that's convention.
- **Optimal reveal animation.** No evidence. Keep it under the `prefers-reduced-motion` override and move on.

Add to this list rather than quietly filling it in.

---

## Amendments

Decisions taken against these rules during weft#16. Each states what supersedes what, and why. The rules above are left as written so the reasoning stays readable.

### A1 · Rule 11 — 24px is the control floor; 44px is a separate clearance convention

**Supersedes** the original second bullet of rule 11 (a 44px minimum control height and a 16px type minimum).

**The two figures are not the same rule and must not be cited together.**

**24 by 24 CSS pixels, [SC 2.5.8 Target Size (Minimum), Level AA].** The floor for the control itself, in both dimensions, for every control including a collapsed trigger. Normative.

**44 pixels of clearance, [C].** A Weft house convention, not a WCAG criterion. Stated measurably, because "no second interactive element inside that zone" is not testable as written:

> For any two interactive elements that are **nearest neighbours along an axis** — meaning no third interactive element lies between them on that axis — the distance between their **centres** along that axis is at least 44px. An element with no neighbour on a given side carries no obligation on that side.

That definition is what was implemented and measured: adjacent choice rows move from 2px to 12px of gap so their 32px boxes sit exactly 44px centre to centre, at marketing, compact and dense density alike. The toolbar never triggered it — its tightest horizontal centre-to-centre distance is 65.5px at dense.

Two consequences worth stating. Keeping 24 as the control floor preserves the compact tier at 36px and the dense tier at 34px, both of which the original 44px wording would have deleted. And the 16px type minimum is dropped entirely: it is not a WCAG requirement at all, it exists because iOS zooms the viewport on a focused smaller field, which is real on touch and irrelevant on a desktop operator board.

### A2 · Rule 2 — "fill without border" is not available

**Narrows** rule 2.

Reaching 3:1 as a fill alone needs roughly 45% ink over white in Weft's light palette. At that fill the muted placeholder drops to 1.90:1 and fails text contrast, so the option trades one WCAG failure for another. In practice the border carries the boundary. One border token clears 3:1 on paper (3.35:1) and on cream (3.15:1), so it is one value per theme rather than one per surface.

Operationally: at least one of border-against-surface or fill-against-surface reaches 3:1, measured on composited pixels rather than token pairs.

### A3 · Rule 1 — the low-weight tier cannot be borderless

**Supersedes** the third row of rule 1's table.

"Filled background, no border" is exactly what A2 rules out. Tier 3 is a bordered field with quieter type and colour.

**This is the correction the plan has been carrying as an exception.** It belongs here, and now that these rules have a file it can be made directly rather than held elsewhere.

### A4 · Rule 4 — the commit boundary starts evaluation

**Qualifies** the final sentence of rule 4, for checks that cannot answer synchronously.

The original — nothing invalid persists past the commit boundary — cannot hold for a check that has to ask a server: the answer arrives after the boundary, so an invalid value provably persists past it while the request is in flight.

**This amendment was written as a condition, and the condition has been met.** Asynchronous pending presentation was deferred out of weft#16 as unrequested scope; the follow-up landed on owner request once a consumer demonstrated the need (Heddle's seven-state `SourceValidationStatus`, which a pending/success/error boolean cannot express). The clause is now doctrine in force:

> **When asynchronous pending presentation is introduced:** commit starts evaluation; the consumer may prevent progression while pending; Weft only presents the supplied pending or result state.

What shipped is exactly the presenting side: `.weft-field-hint.is-pending` / `.is-status-*` and `FormStatus`, with the consumer supplying the pending flag or result tone plus its own words (see A9 for how the status joins the description list). The clause deliberately does not say Weft blocks navigation or submission — it does not, and that stayed true when the follow-up landed. Rule 4's original final sentence remains superseded: for a check that answers after the boundary, the honest contract is presentation of the supplied state, not a promise about persistence.

### A5 · Rule 10 — help and error compose in one ordered reference list

**Extends** rule 10.

A field carries **one `aria-describedby` attribute containing ordered ID references**: the error message's id first, the help text's id second. Removing the error removes its id from the list and leaves the help id in place.

The rule binds the React composition and the documented plain-CSS HTML recipe. CSS creates no ARIA; the recipe produces the relationship and the stylesheet contributes nothing to it.

**Landed** (weft#16, `Form` 1.1.0): `FormControl` emits the message id first, the failing test was written first (`form-describedby-order.test.tsx` asserts *position*, because both ids present in the wrong order satisfies every existence-and-resolution check ever written), and the plain-CSS recipe is held to the same order page-wide. Worth keeping on the record: the first shipped implementation did the opposite, and the guards around it passed the reversed list — order is the whole rule, so order is what the tests assert.

Five cases, not one: help only; error only; both; error removed with help surviving; and no duplicated id or description in any of the four. The last is what catches an implementation that appends rather than orders.

### A6 · Rule 1 — quiet is the default, and the exception is named

**Clarifies** rule 1's default.

Quiet is the default on every surface, not split by surface type. A surface that shows a field at rest declares one of five reasons: `frequent` (touched more than once per visit), `comparative` (only useful read alongside its siblings), `primary` (the input is the surface's job), `live` (typing changes what is already on screen), `sequence` (the field is a step in a visible workflow, so hiding the field hides where the user is in the flow — added at module version 2 by owner call, 2026-08-11, through exactly the challenge route the Open section invites).

The reason is declared in gallery, template and specimen configuration — the layer that knows the surface — and never as a prop on a primitive. An `Input` is visible or it is not; asking it *why* turns a low-level primitive into a product-workflow abstraction, and the plain-CSS layer could not participate in a typed contract in any case.

**Who validates what, stated explicitly so "shared policy" does not become copied arrays:**

- **Weft** validates its own gallery cards and its shipped template specimens.
- **Heddle** validates panel and template uses inside its own repository.
- **Across both**, the permitted strings ship as one versioned module — `@nodaste-lab/weft/tooling/visibility-reasons`, carrying a frozen list, a predicate, a version and a conformance fixture, following the precedent already set by `tooling/raw-colors`. Each side validates against that module rather than against its own copy, and Weft's own validator is asserted to import the frozen array by identity rather than deep-equal a literal.
- **No single CI job gates both repositories**, and nothing here should imply one does.

Whether a declared reason is honest is a design-review judgement; no test establishes it, and this doctrine says so rather than implying otherwise.

### A7 · Rules 7 and 11 — markers and read-only

**Extends** rule 7 and **narrows** rule 11.

The required marker is real text in the label plus the native `required` attribute, so it is announced as required rather than as punctuation. A bare asterisk lands inside the accessible name as a glyph.

Switch and slider are enabled or disabled only. Native `checkbox` and `range` ignore `readonly`, and neither React primitive implements it, so neither layer claims it.

### A8 · Rule 9 — `scroll-padding-top` on `html` does nothing when a panel body scrolls

**Narrows** rule 9's first bullet.

`scroll-padding-top` on `html` only helps when the *document* is the scrollport. Inside a HUD panel the panel body usually scrolls, and the `html` rule does nothing there — measured at 100% of a focused control covered inside the injected frame, 0% once the scrolling surface itself carries the padding. Weft ships no scroll container of its own and cannot guess which element is one, so **the surface marks its scrollport**: `.weft-scrollport` or `data-weft-scrollport`, which take `scroll-padding-top: var(--weft-sticky-chrome-h)` alongside `html`. The token sits in a bare `:root` block at (0,1,0) specificity, deliberately, so a consumer's own `:root` declaration ties and wins on source order.

### A9 · Rule 10 — the asynchronous status joins the ordered description list

**Extends** rule 10 and A5, landed with the asynchronous follow-up that put A4 in force.

A5's list gains a third participant without reordering the two it had: **error id first, status id second, help id third**. The error keeps first position for A5's own reason — a field in error has one urgent thing to say. The status (`id="<control-id>-status"`) precedes the durable help text because it is the newest fact about the field: "checking…" or "degraded — local content stays readable" is worth reading before a format reminder the user has already seen. Every pair A5 ordered keeps its relative order, so no shipped case changed.

Pending is the same list plus `aria-busy="true"` on the control — and both halves of that convention are gated together, in both directions, because a pending hint without the exposure and a busy control without the presentation are each half a contract. All of it is exposure, never announcement: a change to an `aria-describedby` target is not a dependable live update, and nothing in the follow-up claims otherwise.

---

## Open

- **Whether the reasons in A6 are the right set.** That list is the whole rule: it is the only thing standing between quiet-by-default and every surface opting out. It has been challenged once, successfully — `sequence` joined the original four by owner call (2026-08-11, module version 2) — which is the route: an owner call on the record and a version bump, never a string quietly added.

Amendments A1 through A9 are settled. Add to this list rather than resolving it silently.
