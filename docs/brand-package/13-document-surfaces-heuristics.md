---
title: Document surfaces heuristics
linked_project: Heddle Branding
status: adopted — companion to 09-app-primitives § Document surfaces (W3, 2026-09-01) and the DocT owner rulings through 2026-09-09; W4 folds the entries into the primitive definitions
scope: App primitives → Document surfaces
---

# Document surfaces heuristics

*Companion to [[09-app-primitives]] § Document surfaces (W3) and the owner rulings that followed it in the DocT plan *Port the designed document view into DocT with every feature honest* (https://doct.nodaste.com/d/mL10IjAsSsC8oKN3hc0UVg). The definitions say what each surface is; this says when to reach for it, what to check, and what not to do. Where a later ruling supersedes the W3 text, the ruling wins and is marked.*

## How to read an entry

Each entry has the same five parts. **Use when** is the situation that calls for it. **Not for** is the nearest situation that looks similar and is not. **Heuristics** are checks a reviewer can apply from a screenshot or a click. **Pattern** is the shape that works. **Anti-pattern** is the shape that was tried, or is tempting, and fails — most of these were caught in the epic and are recorded in the plan log.

## Foundations that every entry inherits

### The three channels — as ruled

**Colour is semantic only: it means a state or a category, never a person. Underline style is context. Fill is ownership.**

- Use when: anything on a document surface carries meaning by colour, decoration or fill.
- Not for: telling people apart. The W3 text still says "colour is identity or state"; the owner ruled on 2026-09-06 that colour never names a person and re-affirmed it at the epic pass. Identity is carried by a name, initials or the agent glyph — the attribution mark — never by a hue.
- Heuristics: cover the labels and ask what each colour means; if the answer is "who", it is wrong. A tag must be readable with colour removed and with decoration removed: the underline style carries it for the eye, and a non-style cue carries it for everyone else — the marker's number tone, the type word on the thread header, and the mark's accessible name ("Thread 2 · Action needed"), so a reader who cannot tell wavy from dashed still knows (WCAG 1.4.1). Mine-versus-theirs must be readable in greyscale (solid versus outline) and in the pill's text ("you" / the owner's name).
- Pattern: one neutral wash on every anchored passage; the selected thread keeps the primary ring; the tag changes only the underline style; the badge changes only its fill for ownership.
- Anti-pattern: a per-person hue on anchors, carets and avatars (the identity-colour subsystem, weft#31). It looked rich and told a reader nothing they could act on, and it collided with state colour on the same mark. The frames stay in the library as history; do not ship them.

### Casing on app surfaces

- Use when: any label on an app surface. Sentence case everywhere except the dense-info register (table headers, stat-row labels, badge text inside a dense panel, avatar initials, calendar weekday labels). The face stays mono with its tracking for eyebrows, menu section labels, compact form labels and menubar triggers; app tabs are the one exception and use the sans face (owner ruling 2026-09-02, weft#43).
- Not for: marketing surfaces, where the `.eyebrow` and the mono tabs are unchanged, and identifiers, which are written as they are.
- Heuristics: two registers never meet in one row of one component. A board column header is a heading, not a table header: sentence case.
- Pattern: sentence-case label, mono face, tracking kept; caps only where the entry is a dense-info register and says so.
- Anti-pattern: uppercase tabs and eyebrows on app surfaces (weft#43, weft#44 fix the shipped primitives). Shouting labels read as marketing inside a working tool.

### Honest empties

- Use when: a row is a real fact whose value is absent — Last reviewed, Plan fields, Related documents.
- Not for: hiding a fact a person would look for; an absent Last reviewed is information, an absent Plan section on a text document is not.
- Heuristics: read each row and ask whether its absence would mislead; if it would, keep the row and show the honest empty. Every value on the surface must trace to a field the route serves.
- Pattern: show the row with an honest empty ("Never", "—", "No plan metadata") when the row itself is the fact; leave the row out entirely when the data does not apply to the document kind (no Plan section on a text document, no Related documents block when there is neither a fork nor a parent).
- Anti-pattern: a placeholder value that reads as data ("Design review draft · Signed off" in a fixture is illustration, not a default), or a "None" line that fills a section a person did not need.

### One panel at a time

- Use when: the rail carries more than one panel (Comments, Info, History).
- Not for: surfaces with room for two panels by design (a wide compare view is its own region, not a rail panel).
- Heuristics: for every control, name the panel its result appears in; open every other panel and press it; the result must still appear.
- Pattern: the rail panels are exclusive; opening one closes the others, and any action that needs a panel reveals it — starting a comment, selecting a thread, pressing the Comments control, opening History from the Info panel's version count.
- Anti-pattern: an action that flips a flag while the panel it needs stays hidden. The epic shipped three of these before the pass caught them: starting a comment under an open History rail, selecting a marker under it, and the Comments control collapsing the comments it was hiding. Every one looked like a dead click.

### Keyboard, focus and touch

- Use when: any entry has a hover affordance, an overlay, or a tappable part — which is every entry below.
- Not for: decorative marks that are `aria-hidden` by definition (the peer caret), whose presence is announced elsewhere.
- Heuristics: tab through the surface with the mouse unplugged; every hover affordance (Restore on a version row, a row's action buttons, a thread's kebab) appears on `:focus-within`; every overlay moves focus in on open, closes on Escape and returns focus to its trigger; nothing tappable is under `--weft-touch-target` (24px compact); the global Focus Ring shows on every interactive part unless the entry says otherwise; every animation collapses under reduced motion.
- Pattern: the sheet's contract (focus in, Escape, scrim, close button, focus back) reused by every popover that becomes a sheet; the bottom bar's 44px touch wrap around a 34px glyph.
- Anti-pattern: a hover-only Restore that a keyboard never reaches; a sheet that leaves focus behind the scrim; crumb links, comment markers and board card titles at 20px on a phone (the epic pass recorded these as the residual to fix); colour as the only focus indicator.

## Additions

### document-tree (weft#28)

- Use when: a workspace's documents form a hierarchy a person navigates and reorders, and the row must also tell them what is happening on each document (listener state, comment count, working status).
- Not for: flat lists of results (use a list), or a single document's outline (use the plan's contents navigation).
- Heuristics: the row is one control — its `aria-expanded` is the state and a click on the caret glyph reaches the row; there is no separate expand button. Indent is drawn by padding, so hover and selected fills run edge to edge. Row height is `--weft-row-h`. The kebab appears on hover, on `:focus-within`, and while its menu is open — never on hover alone — and never takes the row's name. Keyboard, as W3 defines it: arrows move between rows, Left collapses or moves to the parent, Right expands or moves to the first child, Enter opens, F2 renames, Shift+F10 opens the menu.
- Pattern: title, then status as text ("· All comments addressed · plan-reviewer (A) · theirs") in the accessible name, so the name a screen reader gives equals what the eye sees; the listening badge sits on the type icon and the count on the right.
- Anti-pattern: per-row expand buttons (they double the tab stops); nesting children in a way that makes the parent's text unmatchable (tests broke on exactly this); a "stale" or count badge whose text runs into the title ("Team notesstale") — badges need a separator or an accessible name of their own.

### comment-thread (weft#29)

- Use when: a discussion is anchored to a passage or a plan node and belongs in the rail beside the document.
- Not for: free-standing conversation with no anchor (that is chat), or a single reply field (that is `thread-reply-field`).
- Heuristics: the header goes to the thread's place in the document on click; the number circle carries the tone (neutral, action needed, risk / issue, resolved) and the attribution mark carries who; the type word appears only for the three tagged states; the robot glyph appears only while an agent is queued, working, acknowledged, needing attention or resolved.
- Pattern: header outside the body, uniform message rows, one reply field at the bottom that starts a thread on Enter and says so in its hint.
- Anti-pattern: a submit button still named "Comment" after the ruling made it "Start thread" — copy and tests must move with the ruling; an identity colour on the number; a resolved thread whose passage keeps a loud underline (resolved is the dotted, muted style).

### text-anchor (weft#30)

- Use when: a run of prose has a thread, on a text document or a rendered plan.
- Not for: search hits, spelling marks or selection — those are transient and must never look like an anchor.
- Heuristics: one neutral wash for every anchored passage; the selected thread's passage keeps the primary ring; the underline style is the tag (solid, wavy, dashed, dotted) and the resolved tag is dotted and muted; the mark shows a number plus initials for a person or the agent glyph, never both. The style is never the only cue: the number's tone and the mark's accessible name carry the tag too, and the thread header spells the type word, so action needed and risk / issue are told apart without reading a line style.
- Pattern: overlapping threads on one node list on `data-html-comment-thread-ids`, the passage's style follows the newest thread's tag, and the marker for each thread stays visible beside it.
- Anti-pattern: an anchor tinted by its author (weft#31 era); a resolved anchor painted the old blue; treating the passage's colour as proof of state in a test — the state lives on the tag attribute, not on a colour.

### identity-colour (weft#31) — superseded

- Status: superseded by the semantic-colour ruling (owner, 2026-09-06; re-affirmed 2026-09-09).
- Use when: never, for new work. The token names stay documented in [[09-app-primitives]] as the history of what was tried.
- Not for: anchors, carets, avatars, thread numbers or any mark a person's name already covers. Where the definition says "the author's identity accent", read "the attribution mark".
- Heuristics: if a design needs a legend to say which person is which colour, the design has already lost; names are the legend. A colour that changes when the author changes is identity colour by another name.
- Pattern: one neutral wash, the attribution mark (number plus initials, or the agent glyph) for who, colour reserved for state and category.
- Anti-pattern: the four-pair palette applied per person, and W4 shipping it as a primitive; the ruling asks W4 to drop it.

### peer-caret (weft#32)

- Use when: another editor is live in the same text document.
- Not for: a plan (rendered HTML has no live caret) or a person merely viewing.
- Heuristics: never blinks, never animates in or out, `aria-hidden` — presence is announced by the collaborator list. The flag reads the name.
- Pattern: one neutral caret with a name flag (option B in the library's "Peer caret / options"). The name is the identity.
- Anti-pattern: a per-person hue (option A) and a caret that blinks like the person's own.

### selection-toolbar (weft#33)

- Use when: a person has selected text in a **text document** and can act on the selection (format it, comment on it).
- Not for: HTML plans. On a plan a click on a paragraph opens the composer and a dragged range is for copying; the toolbar never appears there.
- Heuristics: hidden while the selection is collapsed; tracks the selection; flips below when there is no room above; docks above the bottom bar on a phone; its ground is the fixed ink in both themes; the comment control is named "Comment on this text".
- Pattern: format controls, a separator, then the comment control; the composer it opens reveals the comments sidebar and closes any open rail panel.
- Anti-pattern: an "Add comment" button somewhere in the page chrome (there is none since P4); a toolbar that lingers after the selection collapses; two different controls with one accessible name — DocT's anchors currently share the toolbar's "Comment on this text", which is a defect to fix by naming the marks ("Thread 2 on this text"), not a scoping tip for tests and screen readers.

### comment-composer (weft#34)

- Use when: a person starts a thread from a paragraph of a plan or a selection in a text document.
- Not for: replies (that is the thread's reply field) or a mention-only note.
- Heuristics: opens at 320 by default and is resizable (ruled 2026-09-06); anchored 8px from the paragraph the click actually selected — not the section around it; keeps 12px clear of that paragraph above or below; on a phone it is a bottom sheet with the drag handle. The hint reads "↵ starts thread · ⌘↵ asks agent · Esc cancels". On a plan the submit is dual: Agent primary, Thread secondary; a selected mention disables Agent with the existing copy.
- Pattern: quoted source, textarea, actions row; Cancel left, submit set right.
- Anti-pattern: the composer bottom-docking over the target because its placement used an estimated height; a composer that opens while the comments sidebar stays hidden, so the posted thread has nowhere to appear; a fixed width on the tablet; measuring the composer against the whole section rather than the selected paragraph (a test did this and blamed the product).

### listening-badge (weft#35)

- Use when: an agent is attached to a plan and there is something left to listen for: `pending` or `agent_working`.
- Not for: `all_addressed` (no badge — nothing is waiting), unread (there is no unread state, ruling 6), or text documents.
- Heuristics: colour is the queue state (info for pending, warn for working); fill is ownership (solid mine, outline theirs); the pulse runs only on a live claim and collapses under reduced motion; the cut-out ring reads the row's ground through one custom property, so the selected row never touches the fill.
- Pattern: the badge sits on the type icon in the tree and, statically, at the head of the listener pill.
- Anti-pattern: a glow on the icon for "unread"; a dimmed badge for "read"; state and ownership sharing a colour; a badge that stays after the last comment is addressed.

### listener-pill (weft#36)

- Use when: a plan is open and a person needs to know, at a glance, who is listening and whether they are working — the crumb row's one live plan field.
- Not for: text documents (hidden), or as a control (it names, it does not act).
- Heuristics: the strings are exact — "Queued · waiting for a listener"; "{agent} · {owner or you} · working"; "{agent} · {owner or you} · idle"; no pill when nothing was ever claimed. "you" means the agent's owner is the session user. On a phone it takes its own row beneath the trail.
- Pattern: badge, then text, right-aligned in the crumb row.
- Anti-pattern: a pill that says "Listening" (the word was retired); colouring the agent's name; hiding the pill behind a truncated trail on a phone.

### board (weft#37)

- Use when: a workspace's documents are worked as columns of a flow and the person wants the whole space in one view.
- Not for: a single document's tasks, or as a second navigation for the tree.
- Heuristics: replaces the document area in place (`?view=kanban`) and leaving returns to the same document; column headers are sentence case with the count pushed right; cards carry the type icon, the title and the open-thread count; the Working step in the Info panel writes the same column the board shows.
- Pattern: columns top-aligned, horizontal scroll, `View Kanban` from the Info panel closes the panel and switches the sidebar tab.
- Anti-pattern: a count baked into the heading text ("Backlog2") so the number and the label read as one word; health chips inside the heading; card titles under 24px tall on a phone (an AC10 residual, recorded).

### version-diff (weft#38)

- Use when: two versions of a **text document** are picked in the History rail and a person wants to see the words that changed.
- Not for: HTML plans — the same picker offers one control, "Ask your agent what changed", which opens the composer on the plan's title node, pre-filled. No diff is drawn for a plan.
- Heuristics: the picker rows carry name, tag chip, meta line and a word delta ("+18 / −4 words", "no word change"); an autosave reads "Autosave" in italic and carries no name; Compare shows both texts side by side with per-line status and a word delta; Back to document returns without losing the picks.
- Pattern: pick two, Compare (or Ask), read, back. Restore lives on the row, shown on hover and on `:focus-within` so a keyboard reaches it, and is disabled with a reason on a commented text document because the body route refuses to rewrite anchored text.
- Anti-pattern: a Restore that shows a "not yet supported" toast (the stub P6 replaced); a version list repeated in the Info panel (ruled: consolidate — the panel keeps only the count, which opens the rail); expecting a named save to be the only new version when an autosave of the same edit lands beside it.

### bottom-bar (weft#39)

- Use when: `mobile-portrait` and the document has rail panels (Comments, Info, History).
- Not for: tablet or wider (the rail keeps its column), marketing pages, or as a place for page navigation.
- Heuristics: 52px, fixed at the bottom, the main region padded by 52px so nothing loads covered; items are the rail buttons with a 44px touch wrap; a tap opens that panel as a bottom sheet above the bar, a second tap closes it; panels start closed on a phone.
- Pattern: the same three controls, names and testids as the desktop rail, so a person moving between devices finds the same things.
- Anti-pattern: a bar that covers the last lines of the document; a bar whose panels open at rest; a fourth item added "because there is room".

## Changes to existing primitives

### sheet — bottom variant (weft#40)

- Use when: a rail panel or an anchored popover has to appear on a phone.
- Not for: the tree on a phone (that is a left sheet) or anything that fits as a popover on a tablet.
- Heuristics: opaque paper ground, never inherited; drag handle; close button labelled "Close panel"; `min(70vh, 560px)` for a panel, `max-height 80vh` for a popover that became a sheet; sits above the bottom bar; focus moves into the sheet on open; Escape, scrim and the close button all close it; focus returns to the trigger; no slide under reduced motion.
- Pattern: History, Info and Comments each open as this sheet; Compare, Ask and Restore from the History sheet close the sheet first so the document is in view.
- Anti-pattern: a sheet that stays open under a confirm dialog; a sheet that inherits the column's transparent ground and shows the page through it; a test that taps a node under an open sheet and blames the node.

### badge — spinner slot (weft#41)

- Use when: a queue pill shows `claimed` (Agent working) and needs motion to say "in progress".
- Not for: `pending`, `acknowledged` or `resolved`, and never as a generic loading indicator on a surface that is not a queue pill.
- Heuristics: a 7px ring, `currentColor`, one rotation per 0.9s, static under reduced motion; the other three states have no spinner; mono caps only inside a dense panel, sentence case in the comments rail.
- Pattern: the pill reads "Agent working" with the ring leading; the same badge, static, heads the listener pill.
- Anti-pattern: a spinner on `pending` (nothing is happening yet); a spinner that keeps spinning after the claim ends.

### avatar — identity variant (weft#42) — narrowed by the ruling

- Use when: initials must stand for a person or an agent.
- Not for: carrying state (a working agent is the badge's job) or identity by colour.
- Heuristics: initials keep caps (an identifier); an agent's "(A)" lives in the name, not the initials; the identity-coloured ground is out under the semantic ruling — neutral ground, ink initials.
- Pattern: 24 inline in a thread or member row, 32 as the compact default, 40 in the hover card; a stacked group overlaps by 6px with a paper ring.
- Anti-pattern: a coloured avatar ring used as the only way to tell two commenters apart.

### tabs — sentence case, sans face (weft#43)

- Use when: two or more views of the same region (Document tree / Kanban board).
- Not for: navigation between routes (that is a link or the sidebar), or a single view with no alternative.
- Heuristics: quiet tabs — no primary fill on the pressed tab; the underline and the text weight carry the state; sans face on app surfaces (owner ruling 2026-09-02), mono stays on marketing.
- Pattern: two sentence-case labels, a 2px underline on the active one over the list's 1px rule, `aria-pressed` on the active tab, the same region swapped in place.
- Anti-pattern: a filled, button-like active tab; uppercase tab labels; a tab that navigates away from the region it labels.

### eyebrow-label — sentence case (weft#44)

- Use when: a small label above a group on an app surface ("Spaces").
- Not for: a heading (an eyebrow labels a group, it does not title a page) or a badge.
- Heuristics: sentence case with the tracking kept; the shipped primitive still uppercases until W4, so the doc and the code disagree on purpose and the ticket says so.
- Pattern: mono, small, tracked, sentence case, muted; sits above the group it names with the group's own spacing.
- Anti-pattern: an eyebrow that shouts over the content it labels.

## Patterns

### filter-popover (weft#45)

- Use when: a list can be narrowed on several axes at once and the person needs to see what is applied.
- Not for: a single search box, or a sort control.
- Heuristics: search first, then chip groups in the ruled order (Name, Listeners, Type, Health, Status, Visibility, Board column, Comments); chips are toggle buttons with `aria-pressed` and `min-height: var(--weft-touch-target)`; Tab walks the input and every chip, Escape closes and returns focus to the trigger; the trigger shows the applied count; `max-height min(400px, 100vh − 24px)` with internal scroll; on a phone it is a bottom sheet with the sheet's focus contract.
- Pattern: the same shell serves the tree filter and the comments strip's filter (Status, Type, People, Agent on plans only).
- Anti-pattern: a popover that outgrows the viewport (the harness pass found one at 560px and capped it); an "Unread" chip (ruling 6: there is no unread); chip labels in caps.

### share-flyout (weft#46) — closed after the Copy-link ruling

- Use when: a person needs to know who can see a document and move it between their personal space and Shared.
- Not for: per-document permissions (there are none; access is per workspace) or inviting people (an admin's job elsewhere).
- Heuristics: one Share button, locked on a personal document; the flyout tells the truth — access is per workspace, membership is an admin's — and offers exactly one mutation, the move through the existing transfer, which is the one tab stop after the trigger (member rows are static and their avatars are skipped); Escape closes and returns focus; it must be capped to the viewport and scroll inside, because a workspace with many agents grows the member list past 800px.
- Pattern: heading, access card with the sentence, the member list, one move button; the ruling of 2026-09-04 narrowed the header control to Copy link, so the flyout's truth-telling is the pattern to keep wherever a share control returns.
- Anti-pattern: a flyout listing members a person cannot change with no way to act (the reason the owner narrowed it); a flyout whose only action sits below the fold.

### person-hover-card (weft#47)

- Use when: a name in the header or a thread can carry a little more — documents, last active, owner for an agent — and two actions (Documents, Mention).
- Not for: a profile page, or anything a person must read before acting (a hover card is glanceable and dismisses on leave).
- Heuristics: opens on hover after the delay and on focus; Escape and leaving dismiss it and focus returns to the name; a live dot when the person is present, with a text equivalent ("In this document") so presence is not colour alone; every action resolves to a real route or a real insertion.
- Pattern: avatar and name, then stat rows, then two equal-width actions; the same card for a person and an agent, with the "Agent" pill and the Owner row the only differences.
- Anti-pattern: a card with stats that are not fetched; a Mention that inserts nothing when no editor is focused.

### Responsive workspace — tablet (weft#48)

- Use when: 768–1199. The sidebar is a 56px icon rail and the tree opens as a left sheet; the rail keeps its column and its panel is a right sheet; the comments rail is a sheet below 1280.
- Not for: widths at or above 1280, where the rail keeps its panel as a column and the comments rail is a column, or below 768, where the phone pattern takes over.
- Heuristics: the document region is present and unobscured on load; explicit grid areas so an item leaving flow cannot shift the others; choosing a document closes the tree sheet; the driver opens the sheet before touching a sidebar control.
- Pattern: `56px minmax(0, 1fr) auto` with named areas; icon rail on the left, the tree as a left sheet at 288px, the rail strip on the right with its panel as a right sheet at `min(360px, 70vw)`.
- Anti-pattern: a sidebar control the layout hides with no opener (the harness pass added "Open documents"); resizers left visible at a width where they cannot act.

### Responsive workspace — phone (weft#49)

- Use when: below 768. One column; mobile bar on top with the sidebar trigger and the title; bottom bar and bottom sheets for the rail; anchored popovers become sheets; the crumb trail scrolls on its own line with the listener pill beneath it; the document head wraps to title, then Share and the menu.
- Not for: landscape phones at 844 wide, which take the phone pattern's usability invariants but have no pixel reference, or tablets.
- Heuristics: nothing tappable is under `--weft-touch-target` — this is a floor, not a preference, and the crumb links, comment markers, title field and board cards the epic pass found at 20px are defects to clear, not residuals to keep; the chrome collapses while the document scrolls and returns when it stops, and the collapse never moves a hit target or focus at the moment of a tap; a tap on a plan node opens the composer as a sheet.
- Pattern: one column at viewport height; mobile bar, scrolling crumb trail with the listener pill beneath, the document, the bottom bar; every panel and popover a bottom sheet above the bar.
- Anti-pattern: a full desktop rail squeezed into 390px; panels open at rest; the chrome collapse leaving a node under the bar at the moment of the tap.

## Cross-cutting anti-patterns from the epic pass

These are the ones that survived every unit test and were caught only by running the product end to end. They are the checks to run before a surface is called done.

1. **A control that works only when another panel happens to be closed.** Every action names the panel it needs and reveals it.
2. **A popover with no height cap.** Data grows; the viewport does not. Cap to the viewport and scroll inside.
3. **A label renamed by a ruling without the copy, the tests and the docs moving with it.** "Comment" became "Start thread" and four suites went red for days without anyone running them. Grep the tests the day of the ruling.
4. **Proving state by colour.** A resolved anchor, a selected target, a working badge — each is an attribute first; colour is how it is drawn, not what it is.
5. **A fixture value that reads as data.** Reference captures may illustrate; the product shows only what the route serves.
6. **Two facts in one channel.** If a hue means both "risk" and "Ana", neither reads.
7. **A suite that nobody has run since its ruling.** The verification matrix names the suite; the phase that changes the control runs it.
8. **A hover-only affordance.** Anything that appears on hover also appears on `:focus-within`, or a keyboard never reaches it.
9. **An overlay without the focus contract.** Focus moves in on open, Escape dismisses, focus returns to the trigger; a sheet that leaves focus behind the scrim strands keyboard and screen-reader users.
10. **A target under the touch floor.** `--weft-touch-target` (24px compact) is the minimum for anything tappable.
11. **Two controls with one accessible name.** Rename one; never document a scoping workaround.

## Where the visuals are

- Figma: the DocT Design System Library, pages *DocT · Components (proposals to Weft)* (component sets for every addition), *DocT · Weft primitive skins* (avatar, hover card, eyebrow row), *DocT · Document view — states* (states 01–14) and *DocT · Document view — responsive* (10–18). Each ticket names its frames.
- DocT product captures: the `assets/document-view-screenshots` branch of `Nodaste-Lab/doct`, one folder per phase (`p4`, `p4c`, `p4d`, `p5a`, `p5b`, `p5c`, `p6`, `p6b`, `p8`, `harness-pass`), before and after.
- The frozen design reference: `tests/fixtures/design/*.png` on `epic/weft-document-view` in DocT — the captures the design-match harness holds both repos to.

## Cross-references

- [[09-app-primitives]] § Document surfaces — the definitions these heuristics sit beside; § Casing on app surfaces — the casing ruling applied per entry.
- [[05-accessibility]] — the contrast floors, focus and reduced-motion rules the keyboard, focus and touch foundation applies; read with the accessibility paragraph at the head of § Document surfaces.
- [[05-copy-guidance]] § When caps — the casing ruling verbatim.
- [[04-design-system]] Tokens — the fixed tokens (`--weft-fixed-ink`, `--weft-fixed-cream`) the composer, toolbar and tooltip grounds read.
- [[12-input-heuristics]] — the same five-part shape applied to form inputs; the two documents are read together when a document surface carries a field.
