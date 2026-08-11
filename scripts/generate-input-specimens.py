#!/usr/bin/env python3
"""Generate the input-surface specimen page — the fixture the contract suites measure.

Usage (normal):
  python3 generate-input-specimens.py <repo-root> <scratchpad>

Usage (pure render / freshness check — no writes to repo):
  python3 generate-input-specimens.py <repo-root> <scratchpad> --output <file>
  Writes the linked HTML to <file> instead of docs/brand-package/input-specimens.html.
  The inline copy still goes to <scratchpad>/input-specimens-inline.html.

Emits two files from one source of truth, on the pattern proven by
generate-panel-templates-page.py:

  docs/brand-package/input-specimens.html   relative CSS links — always reads the
                                            live token/component files, so the page
                                            cannot drift from the code
  <scratchpad>/input-specimens-inline.html  self-contained (CSS inlined) for sharing

WHY THIS PAGE LINKS ONLY TWO STYLESHEETS
  css/weft.css + css/weft-components.css are exactly what Heddle injects into a
  sandboxed panel iframe (src/app/panel-packages/weftPanelTheme.ts). Loading
  theme.css or a Tailwind base here would measure a surface no consumer has.
  Fonts are deliberately absent: every number this page exists to produce —
  control height (line-height is a ratio of font-size, not a font metric) and
  painted boundary contrast — is font-independent, and panel-templates.html
  already set the precedent of linking no font bundle.

WHAT THE TESTS DRIVE FROM THE OUTSIDE
  Theme, density and palette are :root attributes, so the suites set them on
  <html> rather than the page shipping one copy per combination. Hover and focus
  are pseudo-classes, so the suites apply them. Everything expressible as markup
  — disabled, readonly, aria-invalid, required, the naming routes — ships here.

  Every measurable element carries data-spec (what it is for), plus the axis
  attributes the suite enumerates. Nothing is located by CSS class.
"""
import pathlib, re, sys, html as html_mod

args = sys.argv[1:]
output_override = None
if '--output' in args:
    idx = args.index('--output')
    output_override = pathlib.Path(args[idx + 1])
    args = args[:idx] + args[idx + 2:]

W = pathlib.Path(args[0])
SP = pathlib.Path(args[1])


def sanctioned_reasons():
    """The reason list, read from the shared module rather than restated —
    prose that carries its own copy of the count is prose that goes stale
    (it did: this page said "four" for a release after the owner added a
    fifth). The regex is anchored to the frozen-array declaration."""
    src = (W / 'tooling' / 'visibility-reasons.js').read_text()
    block = re.search(r'VISIBILITY_REASONS = Object\.freeze\(\[(.*?)\]\)', src, re.S)
    reasons = re.findall(r"'([a-z-]+)'", block.group(1))
    assert reasons, 'could not parse VISIBILITY_REASONS from the shared module'
    return reasons


REASONS = sanctioned_reasons()
REASON_COUNT_WORD = {4: 'four', 5: 'five', 6: 'six', 7: 'seven'}.get(len(REASONS), str(len(REASONS)))

# The two files Heddle injects verbatim, in its production order.
CSS_FILES = ['css/weft.css', 'css/weft-components.css']

E = html_mod.escape


# ── Axes ─────────────────────────────────────────────────────────────────────
# Element-level grounds. Palette is a :root axis (hud-glass is the panel
# surface), so it is driven by the suite on <html>, not modelled here.
GROUNDS = [
    ('paper', 'Paper', 'background: var(--weft-paper)'),
    ('cream', 'Cream', 'background: var(--weft-cream)'),
    ('card', 'Card', None),  # rendered as a real .weft-card on cream
]

# States expressible as markup. Hover, focus and invalid-focus are applied by
# the suite because they are pseudo-classes.
MARKUP_STATES = ['default', 'invalid', 'disabled', 'readonly']

CONTROLS = ['input', 'textarea', 'select']

# <select> has no readonly: the attribute is not in its content model and the
# browser ignores it, so emitting one would be a specimen of nothing. Recorded
# here rather than silently skipped.
NO_READONLY = {'select'}

SELECT_OPTIONS = '<option>Thirty days</option><option>Ninety days</option>'


def control_html(kind, spec, ident, state='default', extra_attrs='', cls_extra='',
                 placeholder=None, label_text=None, value=None, describedby=None,
                 required=False):
    """One bare control. Empty by default — a painted-contrast sample must not
    land on glyphs, so the boundary specimens carry no value and no placeholder."""
    attrs = [f'id="{ident}"', f'data-spec="{spec}"', f'data-control="{kind}"',
             f'data-state="{state}"']
    if placeholder is not None:
        attrs.append(f'placeholder="{E(placeholder)}"')
    if state == 'invalid':
        attrs.append('aria-invalid="true"')
    elif state == 'disabled':
        attrs.append('disabled')
    elif state == 'readonly':
        attrs.append('readonly')
    if describedby:
        attrs.append(f'aria-describedby="{E(describedby)}"')
    if required:
        attrs.append('required')
    if extra_attrs:
        attrs.append(extra_attrs)
    a = ' '.join(attrs)
    cls = {'input': 'weft-input', 'textarea': 'weft-textarea', 'select': 'weft-select'}[kind]
    if cls_extra:
        cls = f'{cls} {cls_extra}'
    # A REAL hidden label, never aria-label. The ladder sanctions aria-label for
    # icon-only controls and nothing else, and a page that teaches a rule while
    # breaking it 40 times over teaches the breach. Measurement specimens are not
    # exempt: if the exemption were needed, the rule would be wrong.
    lbl = (f'<label class="weft-sr-only" for="{ident}">{E(label_text)}</label>'
           if label_text is not None else '')
    if kind == 'select':
        return f'{lbl}<select class="{cls}" {a}>{SELECT_OPTIONS}</select>'
    if kind == 'textarea':
        return f'{lbl}<textarea class="{cls}" {a}>{E(value or "")}</textarea>'
    v = f' value="{E(value)}"' if value else ''
    return f'{lbl}<input class="{cls}" type="text"{v} {a} />'


def section(sid, title, note, body):
    return (f'<section class="sec" data-section="{sid}">'
            f'<h2>{E(title)}</h2>'
            f'<p class="note">{note}</p>'
            f'<div class="sec-body">{body}</div>'
            f'</section>')




# ── 7. Search (P7, document B §3) ────────────────────────────────────────────
SEARCH_ICON = ('<span class="weft-search-icon" aria-hidden="true">'
               '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" '
               'stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/>'
               '<path d="m21 21-4.3-4.3"/></svg></span>')
SEARCH_CLEAR = ('<button type="button" class="weft-search-clear" aria-label="Clear search">'
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" '
                'stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
                '</button>')


def search_section():
    def case(cid, cap, attrs='', value=None):
        v = f' value="{E(value)}"' if value else ''
        return (f'<div class="cell" data-search-case="{cid}"><span class="cap">{E(cap)}</span>'
                f'<div class="weft-search">'
                f'<label class="weft-sr-only" for="{cid}-input">Search projects</label>'
                f'{SEARCH_ICON}'
                f'<input class="weft-input" id="{cid}-input" type="search" name="{cid}" '
                f'placeholder="e.g. weft-board"{v} {attrs}/>'
                f'{SEARCH_CLEAR}'
                f'</div></div>')
    cells = (
        case('search-empty', 'empty — clear hidden')
        + case('search-filled', 'filled — clear visible', value='weft-board')
        + case('search-disabled', 'disabled — clear hidden', attrs='disabled ', value='weft-board')
        + case('search-readonly', 'read-only — clear hidden', attrs='readonly ', value='weft-board')
    )
    return section(
        'search', 'Search — a stated pattern, not a type attribute',
        'Hidden label carries the name; the placeholder is a format hint. The clear is a real '
        'button type="button", named, 24px in both dimensions, and it appears only when there is '
        'something to clear — keyed on native state, so a bare-markup author gets the behaviour '
        'without a modifier class. Glyphs are inline SVG reading currentColor, never data-URI '
        'backgrounds, so they follow every palette and theme.',
        f'<div class="grid">{cells}</div>')

# ── 8. Switch and slider (P7) ────────────────────────────────────────────────
def switch_slider_section():
    cells = (
        '<div class="cell"><span class="cap">switch · off</span>'
        '<label class="weft-sr-only" for="sw-default">Notifications</label>'
        '<input type="checkbox" class="weft-switch" id="sw-default" name="sw-demo" /></div>'

        '<div class="cell"><span class="cap">switch · on</span>'
        '<label class="weft-sr-only" for="sw-checked">Notifications, on</label>'
        '<input type="checkbox" class="weft-switch" id="sw-checked" checked /></div>'

        '<div class="cell"><span class="cap">switch · disabled</span>'
        '<label class="weft-sr-only" for="sw-disabled">Locked setting</label>'
        '<input type="checkbox" class="weft-switch" id="sw-disabled" checked disabled /></div>'

        '<div class="cell"><span class="cap">switch · in a row</span>'
        '<label class="weft-switch-wrap"><input type="checkbox" class="weft-switch" '
        'id="sw-row" /> <span>Email me a digest</span></label></div>'
        # B's disabled card: lock glyph beside the label, dashed muted track —
        # state never carried by colour alone.
        '<div class="cell"><span class="cap">switch · disabled, in a row</span>'
        '<label class="weft-switch-wrap"><input type="checkbox" class="weft-switch" '
        'id="sw-row-disabled" checked disabled /> <span>Locked on</span></label></div>'

        '<div class="cell"><span class="cap">slider</span>'
        '<label class="weft-sr-only" for="sl-default">Volume</label>'
        '<input type="range" class="weft-slider" id="sl-default" '
        'min="0" max="10" step="2" value="4" /></div>'

        '<div class="cell"><span class="cap">slider · disabled</span>'
        '<label class="weft-sr-only" for="sl-disabled">Locked volume</label>'
        '<input type="range" class="weft-slider" id="sl-disabled" '
        'min="0" max="10" step="2" value="4" disabled /></div>'

        '<div class="cell" dir="rtl"><span class="cap">slider · rtl</span>'
        '<label class="weft-sr-only" for="sl-rtl">Volume, right to left</label>'
        '<input type="range" class="weft-slider" id="sl-rtl" '
        'min="0" max="10" step="2" value="4" /></div>'

        '<div class="cell"><span class="cap">serialization form</span>'
        '<form id="switch-slider-form">'
        '<label class="weft-switch-wrap"><input type="checkbox" class="weft-switch" '
        'name="sw-on" id="ssf-sw-on" checked /> <span>On, serializes</span></label>'
        '<label class="weft-switch-wrap"><input type="checkbox" class="weft-switch" '
        'name="sw-off" id="ssf-sw-off" /> <span>Off, absent</span></label>'
        '<label class="weft-sr-only" for="ssf-volume">Volume</label>'
        '<input type="range" class="weft-slider" id="ssf-volume" name="volume" '
        'min="0" max="10" step="2" value="4" />'
        '</form></div>'

        '<div class="cell"><span class="cap">RangeBounds — the documented divergence</span>'
        '<form id="range-bounds-form">'
        '<fieldset class="weft-field-group"><legend>Retention window (days)</legend>'
        '<label class="weft-field-label" for="rb-from">From</label>'
        '<input type="range" class="weft-slider" id="rb-from" name="retention-from" '
        'min="0" max="10" value="2" />'
        '<label class="weft-field-label" for="rb-to">To</label>'
        '<input type="range" class="weft-slider" id="rb-to" name="retention-to" '
        'min="0" max="10" value="8" />'
        '</fieldset></form>'
        '<span class="expect">Two named sliders in a named group. A native range has one thumb '
        'and never two without scripting — which the plain-CSS layer exists to avoid — so this '
        'diverges from the React multi-thumb Slider deliberately, with a rationale and no '
        'expiry. From-at-or-below-To is consumer-owned validation.</span></div>'
    )
    return section(
        'switch-slider', 'Switch and slider — native behaviour, not appearance',
        'Both are styled NATIVE inputs: keyboard, drag, min/max/step, RTL, disabled, focus and '
        'form serialization are the browser\'s own. The bare switch is 40×24 — the target floor '
        'with no wrapper doing the work. An unchecked switch serializes as ABSENT, never as a '
        'falsy value. Read-only is unsupported in both layers, deliberately: the native controls '
        'ignore the attribute, and a claim a test cannot catch is worse than an honest absence.',
        f'<div class="grid">{cells}</div>')


# ── 9. Resting tiers (P7, heuristic 1 as amended) ────────────────────────────
def tiers_section():
    long_value = 'A value considerably longer than the box it lives in, which must scroll natively rather than truncate'
    cells = (
        '<div class="cell"><span class="cap">tier 1 · quiet (the default)</span>'
        '<button type="button" class="weft-btn is-ghost">Add a retention note</button>'
        '<span class="expect">Trigger-then-field is the DEFAULT on every surface. The reveal '
        'contract (focus into the field on reveal, back to the trigger on user-initiated '
        'dismissal) travels with the deferred QuietField; a surface that instead ships an '
        f'always-visible field declares one of the {REASON_COUNT_WORD} sanctioned reasons '
        f'({", ".join(REASONS)}).</span></div>'

        '<div class="cell"><span class="cap">tier 2 · underline</span>'
        '<label class="weft-sr-only" for="tier2-underline">Owner</label>'
        '<input class="weft-input is-underline" type="text" id="tier2-underline" '
        'value="katie@nodaste.com" /></div>'

        '<div class="cell"><span class="cap">tier 2 · invalid</span>'
        '<label class="weft-sr-only" for="tier2-invalid">Owner, invalid</label>'
        '<input class="weft-input is-underline" type="text" id="tier2-invalid" value="not-an-address" '
        'aria-invalid="true" aria-describedby="tier2-invalid-error" />'
        '<span class="weft-field-hint is-error" id="tier2-invalid-error">Needs a full address.</span></div>'

        f'<div class="cell"><span class="cap">tier 2 · overflow</span>'
        f'<label class="weft-sr-only" for="tier2-overflow">Overflowing note</label>'
        f'<input class="weft-input is-underline" type="text" id="tier2-overflow" '
        f'value="{long_value}" /></div>'

        '<div class="cell" dir="rtl"><span class="cap">tier 2 · rtl</span>'
        '<label class="weft-sr-only" for="tier2-rtl">Right-to-left owner</label>'
        '<input class="weft-input is-underline" type="text" id="tier2-rtl" value="قيمة" /></div>'

        '<div class="cell"><span class="cap">tier 3 · low</span>'
        '<label class="weft-sr-only" for="tier3-low">Secondary detail</label>'
        '<input class="weft-input is-low" type="text" id="tier3-low" value="Rarely touched" /></div>'
    )
    return section(
        'tiers', 'Resting tiers — weight by frequency, boundary always',
        'Quiet is the default and is enforced where surfaces are declared. The underline tier is '
        'a REAL control whose underline is appearance only and carries the full 3:1 boundary; the '
        'low tier is a bordered field with quieter colour — the borderless filled tier is ruled '
        'out because a 3:1 fill costs the placeholder its text contrast. Hover reinforces, never '
        'carries: everything here passes at rest.',
        f'<div class="grid">{cells}</div>')


# ── 1. Boundary — the painted-contrast matrix ────────────────────────────────
def boundary_section():
    blocks = []
    for gid, glabel, gstyle in GROUNDS:
        cells = []
        for kind in CONTROLS:
            for state in MARKUP_STATES:
                if state == 'readonly' and kind in NO_READONLY:
                    continue
                ident = f'bnd-{gid}-{kind}-{state}'
                cells.append(
                    f'<div class="cell"><span class="cap">{E(kind)} · {E(state)}</span>'
                    + control_html(kind, 'boundary', ident, state=state,
                                   label_text=f'{kind} {state} on {gid}')
                    + '</div>')
        # The ghost button carries the identical hairline and fill as the field,
        # so it fails the boundary rule for the identical reason and has to move
        # with it. Measured in the same matrix rather than in a footnote.
        cells.append(
            f'<div class="cell"><span class="cap">ghost button · default</span>'
            f'<button type="button" class="weft-btn is-ghost" id="bnd-{gid}-ghost-default" '
            f'data-spec="boundary" data-control="ghost-button" data-state="default">Resolve</button>'
            f'</div>')
        inner = f'<div class="grid">{"".join(cells)}</div>'
        if gid == 'card':
            blocks.append(f'<div class="ground" data-ground="cream" style="background: var(--weft-cream)">'
                          f'<div class="ground-label">{E(glabel)}</div>'
                          f'<div class="weft-card" data-ground="card">{inner}</div></div>')
        else:
            blocks.append(f'<div class="ground" data-ground="{gid}" style="{gstyle}">'
                          f'<div class="ground-label">{E(glabel)}</div>{inner}</div>')
    return section(
        'boundary', 'Boundary — is this a control?',
        'Every control empty, so a painted sample lands on fill rather than on a glyph. '
        'Heuristic 2: at least one of border-against-surface or fill-against-surface reaches 3:1.',
        ''.join(blocks))


# ── 2. Geometry ──────────────────────────────────────────────────────────────
def geometry_section():
    row = (
        '<div class="toolbar" data-spec="geometry-row">'
        + control_html('input', 'geometry', 'geo-row-input', label_text='Toolbar filter')
        + control_html('select', 'geometry', 'geo-row-select', label_text='Toolbar range')
        + '<button type="button" class="weft-btn" data-spec="geometry" data-control="button" '
          'data-state="default">Apply</button>'
        + '<label class="weft-checkbox-wrap" data-spec="geometry" data-control="checkbox-row" '
          'data-state="default">'
          '<input type="checkbox" class="weft-checkbox" id="geo-row-checkbox" /> '
          '<span>Only mine</span></label>'
        + '</div>'
    )
    # The size step (P5, compose model): density sets the tier, size steps
    # within it. `sm` is one step down — the pixel map lives in the tokens
    # (--weft-control-h-sm per density block), and the suite pins the decided
    # values so the map cannot drift by token edit alone.
    sm_row = (
        '<div class="toolbar" data-spec="geometry-sm-row">'
        '<label class="weft-sr-only" for="geo-sm-input">Small filter</label>'
        '<input class="weft-input is-sm" id="geo-sm-input" data-spec="geometry-sm" '
        'data-control="input" data-state="default" />'
        '<label class="weft-sr-only" for="geo-sm-select">Small range</label>'
        '<select class="weft-select is-sm" id="geo-sm-select" data-spec="geometry-sm" '
        'data-control="select" data-state="default"><option>All</option></select>'
        '<button type="button" class="weft-btn is-sm" data-spec="geometry-sm" '
        'data-control="button" data-state="default">Apply</button>'
        '<label class="weft-sr-only" for="geo-sm-invalid">Small invalid filter</label>'
        '<input class="weft-input is-sm" id="geo-sm-invalid" data-spec="error-icon" '
        'data-control="input-sm-invalid" data-state="invalid" aria-invalid="true" />'
        '</div>'
    )
    singles = ''.join(
        f'<div class="cell"><span class="cap">{E(kind)}</span>'
        + control_html(kind, 'geometry', f'geo-{kind}', label_text=f'Standalone {kind}')
        + '</div>'
        for kind in CONTROLS)
    singles += (
        # Standalone, so it measures the natural 32px row — the toolbar copy
        # above shares its data-control but is read per-row only: in a flex
        # row the wrap stretches to its neighbours, which is the intended
        # behaviour, not the row's own height.
        '<div class="cell"><span class="cap">checkbox row</span>'
        '<label class="weft-checkbox-wrap" data-spec="geometry" data-control="checkbox-row" '
        'data-state="default"><input type="checkbox" class="weft-checkbox" '
        'id="geo-checkbox-standalone" /> '
        '<span>Only mine</span></label></div>'
        '<div class="cell"><span class="cap">radio row</span>'
        '<label class="weft-radio-wrap" data-spec="geometry" data-control="radio-row" '
        'data-state="default"><input type="radio" name="geo-radio" class="weft-radio" '
        'id="geo-radio-input" /> '
        '<span>Weekly</span></label></div>'
        # Stacked rows measure the clearance rule: row height plus stack gap
        # puts adjacent rows exactly 44px apart (decision 1, reading (b)).
        '<div class="cell"><span class="cap">stacked choice rows</span>'
        '<fieldset class="weft-field-group" data-spec="choice-stack">'
        '<legend>Sources</legend>'
        '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" '
        'id="geo-stack-a" /> <span>Nodaste Studio</span></label>'
        '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" '
        'id="geo-stack-b" /> <span>ccore/heddle</span></label>'
        '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" '
        'id="geo-stack-c" disabled /> <span>ccore/archive</span></label>'
        '</fieldset></div>'
    )
    return section(
        'geometry', 'Geometry — does a control hit its tier height?',
        'Measured against the tier\'s own --weft-control-h at marketing, compact and dense. '
        'The is-sm row measures the size step: density sets the tier, size steps within it '
        '(compose model, decision 1 reconciliation of D4 and T2).',
        row + sm_row + f'<div class="grid">{singles}</div>')


# ── Clearance under adversarial geometry (P5) ────────────────────────────────
def clearance_section():
    """Fixtures the equal-height stacked-row case cannot stand in for — the
    plan's words: wrapped rows, long labels, trailing actions, narrow rails,
    RTL, diagonal neighbours, container edges, hidden controls. The suite
    asserts non-overlap and target spacing computationally; a screenshot
    proves none of it."""
    fixtures = (
        # Many sm buttons forced to wrap in a narrow container: the wrap
        # brings rows close vertically while flex gaps govern horizontally.
        '<div class="cell"><span class="cap">wrapped sm buttons, 220px</span>'
        '<div data-clearance="wrapped-row" style="width:220px;display:flex;flex-wrap:wrap;'
        'gap:var(--weft-choice-gap)">'
        + ''.join(f'<button type="button" class="weft-btn is-sm">B{i}</button>' for i in range(6))
        + '</div></div>'
        # A choice row whose label wraps to three lines, with a trailing
        # icon-button action — the trailing target must clear the row's own
        # checkbox despite the wrap changing the row's height.
        # The action sits BESIDE the label, never inside it: a real button
        # nested in a label is invalid interactive-in-label markup, and a
        # click on it ambiguously toggles the checkbox — the label association
        # runs through for/id instead, and the flex row keeps the trailing
        # geometry this fixture exists to measure.
        '<div class="cell"><span class="cap">long label + trailing action</span>'
        '<div data-clearance="long-label" style="width:240px;display:flex;'
        'align-items:flex-start;gap:8px">'
        '<label class="weft-checkbox-wrap" for="cl-long" style="align-items:flex-start">'
        '<input type="checkbox" class="weft-checkbox" id="cl-long" /> '
        '<span>Retention notes and every archived thread from the studio workspace, '
        'including drafts nobody has opened since the spring migration</span>'
        '</label>'
        '<button type="button" class="weft-btn is-ghost is-sm" aria-label="Retention help" '
        'style="margin-inline-start:auto">?</button>'
        '</div></div>'
        # The 258px rail with mixed stacked controls — the surface the board
        # actually ships, in miniature.
        '<div class="cell"><span class="cap">narrow rail, mixed stack</span>'
        '<div data-clearance="narrow-rail" style="width:258px;display:flex;flex-direction:column;'
        'gap:var(--weft-choice-gap)">'
        '<label class="weft-sr-only" for="cl-rail-search">Search projects</label>'
        '<input class="weft-input is-sm" id="cl-rail-search" />'
        '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" '
        'id="cl-rail-a" /> <span>Only mine</span></label>'
        '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" '
        'id="cl-rail-b" /> <span>Archived too</span></label>'
        '<button type="button" class="weft-btn is-sm">Apply</button>'
        '</div></div>'
        # The same rail mirrored: clearance is direction-blind or it is not
        # clearance.
        '<div class="cell"><span class="cap">the same rail, RTL</span>'
        '<div data-clearance="narrow-rail-rtl" dir="rtl" style="width:258px;display:flex;'
        'flex-direction:column;gap:var(--weft-choice-gap)">'
        '<label class="weft-sr-only" for="cl-rtl-search">Search projects</label>'
        '<input class="weft-input is-sm" id="cl-rtl-search" />'
        '<label class="weft-checkbox-wrap"><input type="checkbox" class="weft-checkbox" '
        'id="cl-rtl-a" /> <span>Only mine</span></label>'
        '<button type="button" class="weft-btn is-sm">Apply</button>'
        '</div></div>'
        # Diagonal neighbours: a two-column grid offset so targets approach
        # corner-to-corner — the geometry centre-to-centre reads miss.
        '<div class="cell"><span class="cap">diagonal neighbours</span>'
        '<div data-clearance="diagonal" style="width:280px;display:grid;'
        'grid-template-columns:1fr 1fr;gap:var(--weft-choice-gap)">'
        '<button type="button" class="weft-btn is-sm">One</button>'
        '<div></div><div></div>'
        '<button type="button" class="weft-btn is-sm">Two</button>'
        '</div></div>'
        # A control flush against its container edge, inside overflow:hidden —
        # the visible target must still be the whole target.
        '<div class="cell"><span class="cap">container edge</span>'
        '<div data-clearance="edge" style="width:200px;overflow:hidden;'
        'border:1px dashed var(--weft-rule)">'
        '<button type="button" class="weft-btn is-sm" style="margin:0">Flush</button>'
        '</div></div>'
        # A hidden control in the set: zero-size targets are not targets, and
        # the scanner must skip them rather than divide by them.
        '<div class="cell"><span class="cap">hidden control among visible</span>'
        '<div data-clearance="hidden" style="width:240px;display:flex;'
        'gap:var(--weft-choice-gap)">'
        '<button type="button" class="weft-btn is-sm">Shown</button>'
        '<button type="button" class="weft-btn is-sm" style="display:none">Ghost</button>'
        '<button type="button" class="weft-btn is-sm">Also shown</button>'
        '</div></div>'
    )
    return section(
        'clearance', 'Clearance — adversarial geometry',
        'Decision 1, reading (b): a 44px undisturbed band where a neighbour exists, and the '
        '24px target floor with SC 2.5.8 spacing everywhere. The stacked equal-height case is '
        'proved in Geometry; these are the shapes that break naive centre-to-centre reads.',
        f'<div class="grid">{fixtures}</div>')


# ── 3. Naming ────────────────────────────────────────────────────────────────
def naming_section():
    rows = []

    def row(sid, cap, markup, expect):
        rows.append(f'<div class="cell" data-naming="{sid}">'
                    f'<span class="cap">{E(cap)}</span>{markup}'
                    f'<span class="expect">expects: {E(expect)}</span></div>')

    row('visible-label', 'Visible label',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-visible">Project name</label>'
        + control_html('input', 'naming', 'nm-visible') + '</div>',
        'name "Project name" — the case the markup uses')

    row('placeholder-as-hint', 'Placeholder as a format hint',
        '<div class="weft-field">'
        '<label class="weft-sr-only" for="nm-placeholder">Search projects</label>'
        + control_html('input', 'naming', 'nm-placeholder', placeholder='e.g. weft-board')
        + '</div>',
        'name "Search projects" from the hidden label; the placeholder shows the '
        'format and is never the name. Before this rung existed the control was '
        'named "Search projects…" by its placeholder alone — which axe lists under '
        'passes, and which disappears the moment the user types.')

    row('hidden-label', 'Hidden label',
        '<div class="weft-field">'
        '<label class="weft-sr-only" for="nm-hidden">Filter results</label>'
        + control_html('input', 'naming', 'nm-hidden') + '</div>',
        'name "Filter results", and the label occupies no layout space')

    row('aria-label-icon', 'aria-label on an icon-only control',
        '<button type="button" class="weft-btn is-ghost" id="nm-icon" '
        'aria-label="Refresh results">&#8635;</button>',
        'the one rung where aria-label is sanctioned: there is no text to label, '
        'and the glyph carries no name of its own')

    row('sr-only-focusable', 'Hidden until focused',
        '<a class="weft-sr-only weft-sr-only-focusable" id="nm-skip" '
        'href="#nm-naming-end">Skip to the end of this section</a>'
        '<span class="expect">Tab to it — it takes layout space only while focused.</span>',
        'the skip-link case: hidden at rest, visible on focus, named throughout')

    row('group-legend', 'Group legend',
        '<fieldset class="weft-field-group" data-spec="naming" data-control="group" '
        'data-state="default" id="nm-group">'
        '<legend>Retention policy</legend>'
        '<label class="weft-radio-wrap"><input type="radio" name="nm-ret" class="weft-radio" '
        'id="nm-ret-30" /> <span>Thirty days</span></label>'
        '<label class="weft-radio-wrap"><input type="radio" name="nm-ret" class="weft-radio" '
        'id="nm-ret-90" /> <span>Ninety days</span></label>'
        '</fieldset>',
        'group name "Retention policy"')

    row('help-text', 'Help text',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-help">Webhook URL</label>'
        + control_html('input', 'naming', 'nm-help', describedby='nm-help-hint')
        + '<span class="weft-field-hint" id="nm-help-hint">Must be reachable over HTTPS.</span>'
          '</div>',
        'description contains "Must be reachable over HTTPS."')

    row('error-text', 'Error text',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-rejected">Webhook URL</label>'
        + control_html('input', 'naming', 'nm-rejected', state='invalid', value='not-a-url',
                       describedby='nm-rejected-error')
        + '<span class="weft-field-hint is-error" id="nm-rejected-error">'
          'That address did not resolve. Check the host, then try again.</span>'
          '</div>',
        'description contains the error copy, aria-invalid is true, and the id ends -error')

    row('error-then-help', 'Error plus help',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-both">Retention window</label>'
        + control_html('input', 'naming', 'nm-both', state='invalid', value='0',
                       describedby='nm-both-error nm-both-hint')
        + '<span class="weft-field-hint is-error" id="nm-both-error">'
          'Zero is not a window. Enter 1 or more days.</span>'
          '<span class="weft-field-hint" id="nm-both-hint">Whole days, 1 or more.</span>'
          '</div>',
        'one ordered list, error id first — amendment A5. Each message exactly once.')

    row('required-marker', 'Required marker',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-required">Retention '
        '<span class="weft-req">required</span></label>'
        + control_html('input', 'naming', 'nm-required', required=True) + '</div>',
        'name "Retention required", required true, and no marker glyph in the name')

    rows.append('<div class="cell" id="nm-naming-end">'
                '<span class="cap">end of section</span>'
                '<span class="expect">The skip link above lands here. A skip link with no '
                'target is a skip link that does nothing.</span></div>')

    return section(
        'naming', 'Naming — what does this control expose?',
        'Names and descriptions are read from the accessibility tree. That proves '
        'exposure, never announcement — what a screen reader does with a string is '
        'product-dependent and is not claimed here.<br />'
        'The plain-CSS layer cannot produce ARIA, so what it ships is a markup '
        'convention: a hint carries <code>id="&lt;control-id&gt;-hint"</code>, an error '
        'carries <code>id="&lt;control-id&gt;-error"</code>, and the control lists them in '
        '<code>aria-describedby</code> as ONE ORDERED LIST WITH THE ERROR FIRST '
        '(amendment A5) — a field in error has one urgent thing to say and one '
        'background thing, and leading with the format hint buries the reason the '
        'value was rejected. The React layer wires the same order by construction in '
        '<code>FormControl</code>. '
        'scripts/__tests__/input-specimens.node.mjs enforces the convention across this '
        'whole page, so it is a rule rather than two hand-wired specimens.',
        f'<div class="grid">{"".join(rows)}</div>')


# ── 4. States ────────────────────────────────────────────────────────────────
def states_section():
    cells = []
    for kind in CONTROLS:
        for state in MARKUP_STATES:
            if state == 'readonly' and kind in NO_READONLY:
                continue
            cells.append(
                f'<div class="cell"><span class="cap">{E(kind)} · {E(state)}</span>'
                + control_html(kind, 'state', f'st-{kind}-{state}', state=state,
                               label_text=f'{kind} {state}',
                               value=None if kind == 'select' else 'Ninety days')
                + '</div>')
    return section(
        'states', 'States — is disabled visibly disabled?',
        'A disabled control and a read-only control must each render distinctly from '
        'an editable one, and from each other.',
        f'<div class="grid">{"".join(cells)}</div>')


# ── 5. Focus survival ────────────────────────────────────────────────────────
def focus_section():
    cells = [
        ('plain', 'No author shadow',
         control_html('input', 'focus', 'fc-plain', label_text='Plain focus')),
        ('author-shadow-class', 'Author shadow (class selector)',
         control_html('input', 'focus', 'fc-shadow-class', label_text='Author shadow class',
                      cls_extra='author-shadow')),
        ('author-shadow-inline', 'Author shadow (inline style)',
         control_html('input', 'focus', 'fc-shadow-inline', label_text='Author shadow inline',
                      extra_attrs='style="box-shadow: 0 1px 3px var(--weft-rule-strong)"')),
        ('author-outline-none', 'Author outline: none',
         control_html('input', 'focus', 'fc-outline-none', label_text='Author outline none',
                      cls_extra='author-outline-none')),
        ('wrapper-shadow', 'Wrapper carries the shadow',
         '<div class="author-shadow">'
         + control_html('input', 'focus', 'fc-wrapper', label_text='Wrapper shadow')
         + '</div>'),
    ]
    body = ''.join(
        f'<div class="cell" data-focus="{sid}"><span class="cap">{E(cap)}</span>{markup}</div>'
        for sid, cap, markup in cells)
    return section(
        'focus', 'Focus — does the ring survive the page around it?',
        'The global ring is delivered by a zero-specificity :where() rule as a '
        'box-shadow. Any author box-shadow at class specificity or above replaces it, '
        'with no error and no gate.',
        f'<div class="grid">{body}</div>')


# ── 6. Select chrome ─────────────────────────────────────────────────────────
def select_chrome_section():
    cells = []
    for state in ['default', 'invalid', 'disabled']:
        cells.append(
            f'<div class="cell"><span class="cap">select · {E(state)}</span>'
            + control_html('select', 'select-chrome', f'sc-{state}', state=state,
                           label_text=f'Select {state}')
            + '</div>')
    cells.append(
        '<div class="cell"><span class="cap">checkbox · checked</span>'
        '<label class="weft-checkbox-wrap">'
        '<input type="checkbox" class="weft-checkbox" id="sc-checkbox-checked" checked '
        'data-spec="select-chrome" data-control="checkbox" data-state="checked" /> '
        '<span>Checked</span></label></div>')
    cells.append(
        '<div class="cell"><span class="cap">radio · checked</span>'
        '<label class="weft-radio-wrap">'
        '<input type="radio" name="sc-radio" class="weft-radio" id="sc-radio-checked" checked '
        'data-spec="select-chrome" data-control="radio" data-state="checked" /> '
        '<span>Checked</span></label></div>')
    return section(
        'select-chrome', 'Glyph chrome — the chevron and tick guards',
        'Permanent guard for the background-shorthand regression: a shorthand resets '
        'background-image, -repeat, -position and -size, which deleted the chevron in '
        'light and tiled it across the whole control in dark.<br />'
        'These glyphs are data URIs, so their colour cannot read a token — each needs a '
        'palette-scoped override wherever the surface behind it flips. The checked tick '
        'and dot are here for the same reason as the chevron.',
        f'<div class="grid">{"".join(cells)}</div>')


# ── Page chrome ──────────────────────────────────────────────────────────────
# Deliberately namespaced away from weft-*: nothing here may style a specimen.
# The two author-* classes are the exception and exist to BE hostile — they are
# the realistic reproduction of the focus defect at class specificity.
CHROME = """
:root {
  color-scheme: light dark;
  /* This page has a sticky bar, so it declares its height — exactly what a
   * consumer surface does. Weft ships the mechanism and the default of 0; the
   * surface supplies the number, because Weft cannot know it. */
  --weft-sticky-chrome-h: 68px;   /* the sticky bar computes to 65px */
}
body { margin: 0; padding: 0 0 64px; }
.bar {
  position: sticky; top: 0; z-index: 10;
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  padding: 10px 20px;
  background: var(--weft-paper); border-bottom: 1px solid var(--weft-rule);
  font-family: var(--weft-font-mono); font-size: 12px; color: var(--weft-muted);
}
.bar h1 { margin: 0; font-family: var(--weft-font-serif); font-size: 17px;
          font-weight: 500; color: var(--weft-ink); }
.bar .sp { margin-left: auto; }
.bar label { display: inline-flex; gap: 6px; align-items: center; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 24px 20px 0; }
.sec { margin: 0 0 40px; }
.sec h2 { font-family: var(--weft-font-serif); font-weight: 500; font-size: 20px;
          color: var(--weft-ink); margin: 0 0 4px; }
.sec .note { margin: 0 0 16px; max-width: 76ch; font-family: var(--weft-font-sans);
             font-size: 13px; line-height: 1.5; color: var(--weft-muted); }
.ground { padding: 20px; border-radius: 10px; margin-bottom: 16px; }
.ground-label { font-family: var(--weft-font-mono); font-size: 11px;
                letter-spacing: 0.12em; text-transform: uppercase;
                color: var(--weft-muted); margin-bottom: 12px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px; align-items: start; }
.cell { min-width: 0; }
.cap { display: block; font-family: var(--weft-font-mono); font-size: 10.5px;
       letter-spacing: 0.1em; text-transform: uppercase; color: var(--weft-muted);
       margin-bottom: 6px; }
.expect { display: block; margin-top: 6px; font-family: var(--weft-font-sans);
          font-size: 11.5px; line-height: 1.45; color: var(--weft-muted); }
.toolbar { display: flex; gap: 10px; align-items: stretch; flex-wrap: nowrap;
  /* stretch, the flex default: a choice row is 32px on its own and takes the
     row's height when a toolbar stretches it — which is how BDD-AC3-1's
     "all four agree" and the 32px row model hold at the same time. */
           margin-bottom: 20px; }
.toolbar .weft-input, .toolbar .weft-select { width: auto; flex: 1 1 0; min-width: 0; }
/* ── Hostile on purpose ──
 * A page-author box-shadow at class specificity. The global focus rule is
 * :where(...):focus-visible, which is (0,1,0) — the same specificity — and this
 * sheet loads later, so this wins and the ring disappears. That is the defect,
 * reproduced the way a real page produces it. */
.author-shadow { box-shadow: 0 1px 3px var(--weft-rule-strong); }
.author-outline-none { outline: none; }
"""

TOGGLES = """
<script>
  var r = document.documentElement;
  document.getElementById('t').addEventListener('click', function () {
    var d = r.getAttribute('data-theme') === 'dark';
    if (d) { r.removeAttribute('data-theme'); this.textContent = 'Toggle dark';
             this.setAttribute('aria-pressed', 'false'); }
    else   { r.setAttribute('data-theme', 'dark'); this.textContent = 'Toggle light';
             this.setAttribute('aria-pressed', 'true'); }
  });
  document.getElementById('d').addEventListener('change', function () {
    if (this.value === 'marketing') r.removeAttribute('data-density');
    else r.setAttribute('data-density', this.value);
  });
  document.getElementById('p').addEventListener('change', function () {
    r.setAttribute('data-palette', this.value);
  });
</script>
"""


def build(css_block):
    body = ''.join([
        boundary_section(),
        geometry_section(),
        naming_section(),
        states_section(),
        focus_section(),
        select_chrome_section(),
        search_section(),
        switch_slider_section(),
        clearance_section(),
        tiers_section(),
    ])
    return f"""<!DOCTYPE html>
<!-- GENERATED by scripts/generate-input-specimens.py — do not hand-edit.
     The fixture the tests/contract/ suites measure. Links only the two files
     Heddle injects into a sandboxed panel iframe, so the page IS the consumer
     surface rather than a gallery of it. Theme, density and palette are :root
     attributes the suites set on <html>; hover and focus are pseudo-classes the
     suites apply. Every measurable element carries data-spec. -->
<html lang="en" data-palette="weft">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Weft input specimens</title>
{css_block}
<style>{CHROME}</style>
</head>
<body>
<div class="bar">
  <h1>Input specimens</h1>
  <span>the measured surface</span>
  <label class="sp">density
    <select id="d" class="weft-select" style="width:auto">
      <option value="marketing">marketing</option>
      <option value="compact">compact</option>
      <option value="dense">dense</option>
    </select>
  </label>
  <label>palette
    <select id="p" class="weft-select" style="width:auto">
      <option value="weft">weft</option>
      <option value="hud-glass">hud-glass</option>
      <option value="heritage-purple">heritage-purple</option>
    </select>
  </label>
  <button type="button" class="weft-btn is-ghost" id="t" aria-pressed="false">Toggle dark</button>
</div>
<div class="wrap">
{body}
</div>
{TOGGLES}
</body>
</html>
"""


# repo copy — relative links, always reads the live CSS
linked = "\n".join(f'<link rel="stylesheet" href="../../{f}" />' for f in CSS_FILES)
dest = output_override if output_override else (W / 'docs/brand-package/input-specimens.html')
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(build(linked))

# shareable copy — CSS inlined
inline = "<style>\n" + "\n".join((W / f).read_text() for f in CSS_FILES) + "\n</style>"
SP.mkdir(parents=True, exist_ok=True)
(SP / 'input-specimens-inline.html').write_text(build(inline))
print("wrote docs/brand-package/input-specimens.html and the inline copy")
