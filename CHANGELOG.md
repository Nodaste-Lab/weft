# @nodaste-lab/weft

## 0.4.0

### Minor Changes

- d265696: The commit boundary is standard, and nothing more is claimed (weft#16, P6).

  `useCommitBoundary` is a new opt-in hook that says **when** a field committed —
  blur, Enter in a single-line control, or an explicit consumer save — as one
  deduplicated transaction: `{ reason, sources }`. A pointer Save registered on
  `pointerdown` suppresses the intervening blur and reports it in `sources`; a
  keyboard Save is deliberately two transactions; `cancelExplicitSave` (wired to
  the Save control's `pointerleave` / `pointercancel`) releases a registration
  whose activation will not complete, replaying an already-suppressed blur so a
  boundary the user crossed is never swallowed. Enter in a textarea, Escape,
  input-method composition (including the confirming Enter), paste, programmatic
  updates and native `form.reset()` are not boundaries and emit nothing.

  The helper never evaluates validity, never announces an error, never writes the
  value, and never touches submission state — asserted with spies over the
  consumer's own callbacks, and every guard in the suite was verified by
  reintroducing its violation. Nothing is wired into `Form`; `Form` gained no
  behaviour. Heuristics 4, 5 and 6 ship as doctrine the consumer implements, with
  worked examples in the design-system doc.

  The input-layer parity record (`scripts/input-parity.json`, `npm run
test:parity`) opens with its first honest entry: the commit boundary is a
  JavaScript behaviour with no plain-CSS counterpart, allowlisted with an owner
  and an expiry that fails the gate the day it passes.

- a565113: `InlineEditListRow` rides the commit boundary (component 1.1.0 → **2.0.0** — a
  behaviour change, decided in proposals document C §5; prop surface unchanged).

  Three behaviours changed, each away from a contract breach the old editing
  state shipped: **Enter now inserts a newline** instead of committing (a
  textarea's Enter is never a boundary — consumers relying on Enter-to-save
  should note blur is the commit path); **an emptied value survives** — select
  all, delete, leave commits `""` instead of silently restoring the previous
  text, which was data loss with a tidy appearance; and **Escape offers a
  discard instead of performing one** — the first press shows a visible,
  `aria-describedby`-exposed offer and touches nothing, a second press performs
  it, typing withdraws it, and an Escape inside IME composition belongs to the
  IME. The draft otherwise commits **as typed**: no trimming, since Enter's
  newline is now real input — all-whitespace normalizing to `""` is the one
  exception.

  Blur commits exactly once, through `useCommitBoundary`; unchanged drafts close
  without calling `onUpdate`. Every changed behaviour was guarded by a test
  first and every guard verified by reintroducing the old behaviour.

  **On the version signal:** this is a breaking behaviour change at the
  component level, mirrored as the component's 2.0.0 per AGENTS.md. The package
  changeset stays **minor** deliberately: the package is 0.x, consumers pin
  exact versions and adopt deliberately (AGENTS.md release flow step 4), and the
  repo's own practice shipped the P2 control-height reflow and the P3
  accessible-name change — both behaviour breaks — in the 0.3.0 minor. A major
  changeset here would stamp 1.0.0, a stability declaration that is the owner's
  to make, not a side effect of one component migration.

- 5e37c4a: **P5 — one sizing model, both layers (the compose model).** Density sets the
  tier; size steps within it. `--weft-control-h-sm` carries the decided per-tier
  step map — 44→36, 36→32, 34→32, chosen so D4's 32px board buttons render
  unchanged at dense — alongside `--weft-textarea-min-h` (96/80/72: the textarea
  floor finally tracks its tier, closing the last recorded defect from the P1
  harness) and `--weft-search-pad-end` (36/32/30, document B's settled trailing
  reserve). All additive `:root` tokens.

  Plain CSS gains the size modifier a sandboxed panel could never express:
  `.weft-input.is-sm`, `.weft-select.is-sm` (left edge only — the chevron
  reserve stays), `.weft-btn.is-sm`. React's `Button` and `SelectTrigger`
  default/sm heights now resolve through the same tokens (old fixed pixels
  remain as `var()` fallbacks, so rendering without `weft.css` is unchanged);
  `lg`, `icon` and `dense` stay fixed-pixel React-only conveniences, recorded
  as such. **This closes D4 against T2**: `size="sm"` no longer names 32px —
  it names the small step of the current tier, and the two calls stop being
  separately citable.

  **Breaking, component-level** (package stays minor per the 0.x clause;
  component majors carry the signal): `Input` 1.2.0 → **2.0.0** — it gains the
  compose `size` axis (`"default" | "sm"`), and the native width-in-characters
  `size` attribute is **removed** from its props so one name cannot mean two
  things. `SearchField` (1.1.0) forwards the compose size and omits the native
  attribute the same way.

  **The recorded React-boundary parity gap is closed**: `--input` and
  `--input-background` now read `--weft-control-border` / `--weft-control-fill`
  — the same Option C pair the plain-CSS boundary reads — so a React field
  paints the ~3.5:1 boundary instead of the 1.30:1 hairline. The
  `dark:bg-input/30` re-dims in the primitives went in the same change; the
  fill token answers both themes itself. `css-contract`'s holds-the-gap record
  is deleted and inverted into a permanent guard, per its own instructions.
  Every moved visual baseline was reviewed individually in the pinned
  container.

- d7a4b4a: P7 — complete the input surface (weft#16). Nothing is left for a consumer to
  hand-roll.

  **New in both layers:** search as a stated pattern (`SearchField` /
  `.weft-search` — hidden label, currentColor glyphs, a named clear that appears
  only with content, never submits, and rides the commit boundary); switch and
  slider as styled **native** inputs (`.weft-switch` 40×24 bare, `.weft-slider`
  with token thumb — keyboard, drag, min/max/step, RTL and serialization are the
  browser's own, the unchecked switch serializes as absent, and read-only is
  asserted unsupported in both layers); resting tiers as modifiers
  (`.is-underline` / `variant="underline"`, `.is-low` / `variant="low"` — Input
  1.1.0 → 1.2.0, additive).

  **The choice row takes its own height:** `--weft-choice-row-h` (32px) and
  `--weft-choice-gap` (12px) put stacked rows exactly 44px apart by
  construction; `.weft-board-check` is retired for the canonical row and its
  stem joins the deprecated-class gate.

  **Quiet-by-default is enforced:** the five sanctioned visibility reasons (`sequence` added at version 2 by owner call) ship
  as `@nodaste-lab/weft/tooling/visibility-reasons` (frozen list, predicate,
  version, 16-case conformance fixture — one list, two repositories, no shared
  CI job), Weft's own surfaces declare their reasons in
  `scripts/visibility-declarations.json`, and the gate fails on a missing or
  unknown one. No reason prop exists on any primitive.

  **Parity is a matrix with a failing build:** seventeen capability cells in
  `scripts/input-parity.json` — fourteen at parity, two allowlisted gaps with an
  owner and an expiry (commit boundary, search clear action), and RangeBounds as
  a documented divergence. `test:parity` fails on an unrecorded capability, a
  fourth status, a dangling reference, or a passed expiry.

### Patch Changes

- 7fe8efa: **Three findings from the owner's visual review, all measured before fixed.**
  (1) Disabled fields carry a **dashed boundary** in both layers — a dimmed
  fill separated disabled from default by measurement but not by glance;
  border-_style_ is a longhand, so a disabled invalid field renders dashed
  **and** red. (2) The plain-CSS **switch takes document B's proposal
  geometry** — the track fills the 40×24 pill and the thumb is an 18px circle
  inset 3px (the shipped shape was a skinny 18px band with a 12px thumb, a
  visibly different control); disabled adds the dashed track bare and B's
  lock glyph beside the label in the wrap, painted through a mask so it reads
  a token. (3) A **hovered ghost button is the button**: deep-blue fill with
  on-blue text — the base hover's (0,3,0) background was landing under the
  ghost's ink text at 2.48:1, and the guard that now holds it waits out the
  colour transition before reading, because its first run passed the broken
  cascade by racing it.
  (4) **Error is never colour alone** (WCAG 1.4.1): invalid input and textarea
  carry a trailing alert glyph — stroke matched to the resolved `--weft-stop`
  per theme and palette, guarded by a tone-invariant test — and the error
  message leads with the same glyph in both layers (masked over currentColor
  in plain CSS; an `aria-hidden` svg in `FormMessage`, so the accessible
  description stays the copy). The select is the stated field-level
  exception: its right edge belongs to the chevron, so the message glyph and
  border carry its non-colour cue — asserted, not omitted.
  (5) **An unavailable dropdown option is struck through** — `option:disabled`
  takes `line-through` + muted in the plain layer, `SelectItem` the matching
  `data-[disabled]:line-through` in React, and every select specimen ships an
  unavailable option so the treatment stays measured.
  (6) **Pill caps, not ellipse taper**: the switch root/track and slider track
  borrowed `--weft-radius-dot: 50%` — correct on squares, but on an oblong it
  renders quarter-ellipse corners that taper to points. Every non-square pill
  now takes `--weft-radius-pill` (999px clamps to true semicircular caps);
  the dot token stays on the genuinely square thumbs and dots.
  (7) **The React search field's invalid glyph steps clear of the clear** —
  the offset rule keyed on `.weft-search` alone, which the React composition
  never wears; its wrapper now carries `data-slot="search-field"` and the one
  stylesheet rule names both arms, CSSOM-asserted so neither can quietly
  drop.
- b588134: **P8 — the heuristics are doctrine, and doctrine is gated.** The eleven input
  heuristics merge into `04-design-system.md` § Form inputs as the operative
  contract, with `12-input-heuristics.md` shipping alongside as the canonical
  record of each rule's provenance — SC/R/C tags, original wording, and eight
  amendments (A8 is new: `scroll-padding-top` on `html` alone does nothing when
  a panel body scrolls; the surface marks its scrollport). Heuristic 4 merges
  **without** its final sentence, held for the deferred asynchronous follow-up
  — an acknowledged gap beats a rule known to be unenforceable. The class-name
  drift is settled the only possible direction: the document now teaches the
  shipped `weft-`-prefixed names, and the read-it-with-a-prefix disclaimer is
  gone. The 05-accessibility contrast audit gains the measured form-control
  boundary table (3.48–3.61:1 painted, disabled exempt per 1.4.11 and held to
  renders-distinctly instead). All of it is machine-checked from this release
  on: `npm run test:doctrine` fails on a named class or token that does not
  ship, superseded wording that returns, a lost source tag, a quietly-filled
  open question, or a doctrine reason list that drifts from the shipped module.

  Two parity corrections the doctrine gate's review surfaced ship with it:
  `Textarea`'s floor now resolves through `--weft-textarea-min-h` (old fixed
  4rem as the tokenless fallback), and `Switch` takes document B's designed
  40×24 control box — it was 32×18.4, under the 24px target floor its own
  parity record claimed. The choice-row cells are reclassified as documented
  divergences (the row is a plain-CSS recipe; React composes rows through its
  form primitives), and the parity matrix now says exactly that.

## 0.3.0

### Minor Changes

- 1b7a22b: Order the `aria-describedby` list error-first, in both layers (amendment A5).

  `FormControl` emitted `${formDescriptionId} ${formMessageId}` — help text before the error — and the plain-CSS specimen wired the same reverse order. A5 settles the opposite: **one ordered list, error id first**, binding the React composition and the documented plain-CSS recipe alike. A field in error has one urgent thing to say and one background thing, and leading with the format hint buries the reason the value was rejected behind text the user has already read.

  **Order is now asserted directly**, which is the part that had been missing. The existing guards checked that both ids were present, resolved, and were named to the convention — every one of which the wrong order satisfies perfectly. `src/ui/__tests__/form-describedby-order.test.tsx` asserts position for React and `S8b` does it page-wide for the plain-CSS recipe; both verified by reintroducing the reverse order.

  `Form` goes to 1.1.0: the prop surface is unchanged but the composed `aria-describedby` a consumer renders is not.

- 04f8017: Make a field identifiable as a control, and keep a focused one out from under sticky chrome (P4 of the input design system).

  **The boundary reaches 3:1 — in the plain-CSS layer.** A text input had no boundary meeting the WCAG 1.4.11 non-text contrast floor in either theme: border 1.30:1 light and 1.38:1 dark, with a fill identical to the surface behind it at 1.00:1. Neither cue identified the control. New tokens `--weft-control-border` and `--weft-control-fill`; `.weft-input`, `.weft-textarea`, `.weft-select` and the ghost button — the controls in the painted matrix — now measure 3.48–3.61:1, on paper, cream and card, in both themes, at all three densities, in default, hover, focus, invalid, invalid-and-focused and read-only. `.weft-checkbox` and `.weft-radio` are not part of this change: they already carried a 1.5px `--weft-ink` border clearing the floor (4.88:1 light, 3.54:1 dark in the audit) and stay on it.

  **The React primitives are NOT covered by that, and this is a recorded parity gap rather than an oversight.** `Input` and its siblings paint from the flat shadcn bridge — `border-input` and `bg-input-background` — and `--input` / `--input-background` still map to `--weft-paper`, so a React field keeps the 1.30:1 hairline. Closing it is a two-token change in the bridge, but it moves the committed pixel baselines for every React form control and interacts with `dark:bg-input/30`, so it belongs with the layer-parity phase rather than here, where the phase's own file list is CSS-only. `scripts/__tests__/css-contract.node.mjs` records the gap so it cannot be forgotten: the assertion fails the day someone closes it without deleting the record. Disabled is exempt — the criterion exempts inactive components — and is instead held to rendering distinctly from an editable control.

  **The border carries it and the fill is decorative, by measurement rather than preference.** Reaching 3:1 as a fill alone needs 45% ink over white, and at that fill the muted placeholder drops to 1.90:1 and fails text contrast — so the fill-without-border option heuristic 2 offers is not available in this palette. One border value covers both light surfaces.

  **Hover no longer carries the boundary.** It used to deepen to `--weft-rule-strong` at 1.90:1, which is weaker than the new resting boundary — hover would have been removing a boundary rather than reinforcing one. Hover does not exist on touch and does not exist for a keyboard-first user (heuristic 3).

  **`.weft-btn.is-ghost` takes the same border token** and deliberately not the field's wash: the border is what carries the floor, and a ghost button sits on coloured slabs where a translucent fill would let the slab through.

  **Focus survives the chrome (SC 2.4.11).** A control scrolled to by an in-page navigation top-aligns, landing under a sticky header — measured at 99% covered, now 0%. The surface declares its chrome height in `--weft-sticky-chrome-h` and the component layer turns it into `scroll-padding-top`. The default is 0, so a panel iframe with no chrome is unaffected. The token is declared in its own bare `:root` block so a consumer's `:root` override wins on source order — under `:root, :root[data-palette="weft"]` it would have lost silently, which is how the first attempt failed.

  Both changes were made inside the existing rules using longhands, per the two cascade traps this surface has already produced.

  `--weft-control-fill-static` rises from 0.055 to 0.075 ink: once the resting fill stopped being opaque paper the two washes differed by about 5/255 and a read-only field stopped being distinguishable from an editable one.

  The last boundary and focus entries come out of `tests/contract/known-defects.ts`; only the textarea floor remains. No visual baseline moved.

- 09f393f: Fix the four input defects that contradict doctrine Weft already publishes (P2 of the input design system). Plain-CSS layer only; no React prop surface changes.

  **Control height, at its cause.** `.weft-input` and `.weft-select` now take `height: var(--weft-control-h)` with no vertical padding, so the declared tier governs. They used to reach the tier through `min-height` while padding plus line-height pushed straight past it: 46.39px against a 44px token at marketing, 43.59px against 36px at compact. Only dense fitted, and only because its `pad-y` had been hand-tuned to 6px — which is how this stayed invisible at two tiers out of three. Both now measure exactly at all three tiers, and an input, select, button and checkbox row sharing a toolbar have a height spread of 0.00px at every density. **The textarea is deliberately outside this model**: it is genuinely multi-line, so it keeps its padding and a `min-height` floor — and that floor is still a hardcoded 96px tracking no tier, recorded as the one remaining known defect and owned by the sizing phase.

  **Disabled and read-only are visible states.** The plain-CSS layer defined neither, so a disabled field rendered at opacity 1 with an unchanged background — pixel-identical to an editable one — while the React `Input` styled both. Disabled now dims to 0.55 with `cursor: not-allowed`; read-only keeps full text contrast and changes only its fill. Neither sets a border colour, because `.weft-input:disabled` weighs exactly as much as `.weft-input[aria-invalid="true"]` and is declared later. New token `--weft-control-fill-static` in all four palette blocks.

  **The focus ring survives the page around it.** The ring is now delivered as an `outline` _and_ a `box-shadow` with identical geometry, so nothing moves visually. One carrier alone was deletable: the global rule is `:where(…):focus-visible`, which weighs (0,1,0) — the same as any page's `.shadow { box-shadow: … }` — so an author rule declared later replaced the ring outright, with no error and no gate. Measured at 0 of 40 ring pixels painted, on the page and inside an injected panel iframe alike; now 20 of 40 under a class shadow, an inline shadow, and an author `outline: none` alike.

  **Help and error text reach the field.** The plain-CSS layer cannot produce ARIA, so what ships is a markup convention — `id="<control-id>-hint"` / `-error`, listed in `aria-describedby` in reading order — enforced across the whole specimen page by `scripts/__tests__/input-specimens.node.mjs`, not demonstrated on two specimens. The React layer already wired the same relationship in `FormControl`.

  **The required marker is text plus the attribute.** A bare `*` landed inside the accessible name as punctuation while `required` stayed false. It is now the word `required` with the attribute set, and the assertion checks both that no glyph is in the name and that the marker reads as a separate word — because the first fix produced "Retentionrequired".

  Seventeen entries come out of `tests/contract/known-defects.ts`. No visual baseline moved, verified in the pinned Linux container.

- 5b093c3: Land the input evidence and consumer-contract harness (P1 of the input design system). No component, class or token changes — this is the measurement the later phases move.

  **The consumer condition is under test.** `tests/contract/consumer-iframe.spec.ts` injects `css/weft.css` and `css/weft-components.css` verbatim into a sandboxed iframe in Heddle's production load order (tokens, transitional `--hud-*` aliases, then components), alongside the CSS a panel package realistically ships: a `content-box` reset, a `.shadow` utility, a bare `input` element rule, a conflicting body font and a class colliding on the `weft-` prefix. A second frame runs the same markup and the same panel CSS with no Weft injected, so every computed-style difference between them is attributable to Weft, and "no selector escapes the namespace" is a reading rather than a claim. No iframe test existed in this repository before.

  **The measured input contract.** A generated specimen page (`docs/brand-package/input-specimens.html`, from `scripts/generate-input-specimens.py`) linking only the two files a panel receives, and five Playwright suites over it: accessible names and descriptions from Chromium's accessibility tree, control geometry against each density tier, painted boundary contrast sampled from composited pixels across theme × density × ground, focus-indicator survival, and a permanent chevron guard for the `background`-shorthand regression.

  **The suites fail in both directions.** `tests/contract/known-defects.ts` records the assertions expected to fail today, each with its measured value and the phase that owns the fix. A recorded defect that starts passing fails the run, so a fix cannot land without the entry coming out with it; an unrecorded assertion that fails is an ordinary regression; and a complete run fails on a recorded defect nothing measured. The reason is in that file's header: axe-core reports zero violations on this surface today, including the unlabelled search field, so a conventional gate would go green over every defect it records.

  **Shipped and packed.** `tokens-snapshot.json` now ships — added to `files` and served at `@nodaste-lab/weft/tokens-snapshot.json`, which it previously was not from either. The CI pack smoke moved out of inline workflow YAML into `scripts/__tests__/packed-artifact.node.mjs`, asserts every contract file by exact path rather than by prefix, checks every literal exports-map target is packed, and joins the local gate battery.

  **Gate battery** gains `test:contract`, `test:specimens` and `test:packed`; `scripts/review-gate.md` documents what each one holds. Playwright now runs two projects (`contract`, `visual`) with the snapshot path template pinned so the 78 committed pixel baselines keep their filenames.

- c86e35f: Give Weft a labelling system: a stated ladder with a working route at every rung (P3 of the input design system).

  **`.weft-sr-only` exists.** Weft had no visually-hidden utility, and that absence is what produced this ticket: every control needs an accessible name, the only route Weft offered was a visible label, so an accessibility requirement silently changed the board rail's visual design and nobody made a decision. Built on `clip-path`, never `display: none` or `visibility: hidden` — both of those remove the element from the accessibility tree along with the layout. `.weft-sr-only-focusable` reveals on focus, for skip-link-style content.

  **Field labels and group legends are sentence case, and that is an accessibility fix wearing a typographic hat.** The accessible name is computed from _rendered_ text, so `text-transform: uppercase` did not restyle the label — it rewrote the name. Markup reading "Project name" was exposed as "PROJECT NAME"; a legend reading "Retention policy" as "RETENTION POLICY". Scope is the input surface only (decision 6): `.weft-eyebrow`, `.weft-pill` and the React primitives keep their uppercase. The mono voice survives because both classes set the family explicitly — verified inside the injected panel frame, not just on the page.

  **A placeholder is never a name, and the rule is now page-wide.** Every control on the specimen page carrying a placeholder is checked, not just the one demonstrating the rule. This is the case a tool-based check will not catch: axe lists a placeholder-named control under _passes_.

  **`aria-label` is sanctioned for icon-only controls and nothing else.** The plan left this open; it is settled here. An invisible name on a text input cannot be verified by the person using the surface and drifts from its visible context — and now that `.weft-sr-only` exists, a real label costs only markup.

  Four more entries come out of `tests/contract/known-defects.ts`. No visual baseline moved.

- 4d5f7f6: Add the template layer and land the D1–D15 / T1–T2 design-system decisions taken on the reviewed operator-board surface.

  **Template layer** — `css/weft-templates.css`, exported as `@nodaste-lab/weft/templates.css` and bundled last in `index.css`. First template is `weft-board`: filter rail, urgency-tiered action list, compact panel variant and item drawer. Token-only and theme-following; it declares no custom properties of its own. Registered under a new `templates` key in `manifest.json` (now validated by `npm run verify`), documented in `docs/brand-package/11-panel-templates.md`.

  **New primitives** — `Dot` (D13), `TierGroup` (D12) and `CopyableRef` (D14), each with a plain-CSS counterpart so sandboxed panel iframes can use them. `TierGroup` never renders an empty tier, including for `{items.length && rows}` and empty fragments.

  **Additive component surface** — `Button` dense size (D4); `Badge` count/space/status variants plus stop/warn/ok tones (D5, D15); `HudListRow` third project caption (D1); `StatRow` board variant with a leading slot (D2); `ActionButtonRow` `dense` (opt-in, default false) and `trailingLink` (D3); `ToggleGroup` joined variant (D7); `Callout` dashed and band variants (D8); `EmptyState` notice variant (D9). Existing defaults are unchanged.

  **Plain-CSS layer** — added `.weft-source-pill` and `.weft-callout` (with `.is-dashed`, `.is-band` and tones) so the documented migration path exists for iframe panels rather than pointing at React-only components.

  **Tokens** — new `data-density="dense"` tier (T2) with `--weft-control-pad-y` per tier so dense controls actually reach 34px; `--weft-muted` and `--weft-info` keep their canonical values (T1).

### Patch Changes

- b3f9d22: Fix white-on-light-violet controls in the dark `heritage-purple` palette.

  That block lifts `--weft-blue` to violet-300 (`#c4b5fd`) and correctly sets `--primary-foreground` to dark ink — the flat shadcn token the React primitives read. The `--weft-on-blue` tier, which is what the plain-CSS component layer reads, went on inheriting white from the light block. So one palette shipped a React button at 9.9:1 and a `.weft-btn` at **1.85:1**, with the plain-CSS layer that a sandboxed panel iframe receives being the broken half. The same white also painted the checked radio dot and the checked-checkbox tick.

  The palette's own comment already stated the correct value. The whole `--weft-on-blue` tier is now declared in that block, so every consumer corrects at once, plus a palette-scoped override for the checkbox tick — a data-URI whose stroke cannot read a token, the same shape of problem as the select chevron.

  Guarded generally rather than for this palette: `contrast-contract` now checks `--weft-on-blue` against `--weft-blue` in **every** palette block that redefines the primary, so a new palette cannot repeat it by being forgotten.

- 87d1b4d: Fix the select chevron disappearing under the `hud-glass` palette.

  Palette and theme are independent axes, and `hud-glass` is a dark palette in its own right — dark `--weft-paper`, near-white `--weft-ink` — whatever `data-theme` says. The cream chevron override keyed on `:root[data-theme^="dark"]` alone, so anyone using `hud-glass` without dark mode got a near-black glyph painted into a dark control: stroke `#0B1020` against ink `#f5f8ff`, a luminance gap of 0.932.

  The override now keys on the palette as well. The guard asserts the invariant rather than a list of dark palettes: the chevron's stroke must be the same tone as `--weft-ink` in every palette × theme combination, so a future palette that forgets the override fails without anyone remembering to extend a list.

- 8a49b77: Make the focus-not-obscured mitigation reach the scrollport that actually scrolls.

  `scroll-padding` applies to the scrollport, so putting it on `html` covers only surfaces where the _document_ scrolls. Inside a HUD panel the panel **body** usually scrolls, and padding on `html` does nothing there — measured at **100% of the control covered** in the injected panel frame.

  Weft ships no scroll container of its own, so it cannot guess which element is one. The surface marks it: `.weft-scrollport` or `[data-weft-scrollport]`, either of which now takes `scroll-padding-top: var(--weft-sticky-chrome-h)` alongside `html`. With the marker, 0% covered.

  Proved on a panel-body scrollport under sticky chrome inside the consumer-iframe condition, not only on a scrolling document.

- b319d6e: Update Vite and transitive build dependencies to remediate reported npm vulnerabilities.

## 0.1.4

### Patch Changes

- 2409c0d: Add three net-new theme-aware tokens the Working Threads panel migration needs:
  `--weft-shadow` (resting card elevation), `--weft-fill-soft` (subtle section
  wash), and `--weft-stop-soft` (danger surface tint). Defined on the light
  `:root` and both dark palette blocks; additive and backward-compatible. Unblocks
  heddle's `workBoard.css` from its last three legacy `--hud-*` aliases (NOD-1263).
