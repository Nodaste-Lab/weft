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
import pathlib, sys, html as html_mod

args = sys.argv[1:]
output_override = None
if '--output' in args:
    idx = args.index('--output')
    output_override = pathlib.Path(args[idx + 1])
    args = args[:idx] + args[idx + 2:]

W = pathlib.Path(args[0])
SP = pathlib.Path(args[1])

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
                 placeholder=None, label_text=None, value=None):
    """One bare control. Empty by default — a painted-contrast sample must not
    land on glyphs, so the boundary specimens carry no value and no placeholder."""
    attrs = [f'id="{ident}"', f'data-spec="{spec}"', f'data-control="{kind}"',
             f'data-state="{state}"']
    if placeholder is not None:
        attrs.append(f'placeholder="{E(placeholder)}"')
    if label_text is not None:
        attrs.append(f'aria-label="{E(label_text)}"')
    if state == 'invalid':
        attrs.append('aria-invalid="true"')
    elif state == 'disabled':
        attrs.append('disabled')
    elif state == 'readonly':
        attrs.append('readonly')
    if extra_attrs:
        attrs.append(extra_attrs)
    a = ' '.join(attrs)
    cls = {'input': 'weft-input', 'textarea': 'weft-textarea', 'select': 'weft-select'}[kind]
    if cls_extra:
        cls = f'{cls} {cls_extra}'
    if kind == 'select':
        return f'<select class="{cls}" {a}>{SELECT_OPTIONS}</select>'
    if kind == 'textarea':
        return f'<textarea class="{cls}" {a}>{E(value or "")}</textarea>'
    v = f' value="{E(value)}"' if value else ''
    return f'<input class="{cls}" type="text"{v} {a} />'


def section(sid, title, note, body):
    return (f'<section class="sec" data-section="{sid}">'
            f'<h2>{E(title)}</h2>'
            f'<p class="note">{note}</p>'
            f'<div class="sec-body">{body}</div>'
            f'</section>')


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
    singles = ''.join(
        f'<div class="cell"><span class="cap">{E(kind)}</span>'
        + control_html(kind, 'geometry', f'geo-{kind}', label_text=f'Standalone {kind}')
        + '</div>'
        for kind in CONTROLS)
    singles += (
        '<div class="cell"><span class="cap">radio row</span>'
        '<label class="weft-radio-wrap" data-spec="geometry" data-control="radio-row" '
        'data-state="default"><input type="radio" name="geo-radio" class="weft-radio" '
        'id="geo-radio-input" /> '
        '<span>Weekly</span></label></div>'
    )
    return section(
        'geometry', 'Geometry — does a control hit its tier height?',
        'Measured against the tier\'s own --weft-control-h at marketing, compact and dense.',
        row + f'<div class="grid">{singles}</div>')


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

    row('placeholder-only', 'Placeholder only',
        '<div class="weft-field">'
        + control_html('input', 'naming', 'nm-placeholder', placeholder='Search projects…')
        + '</div>',
        'a failure — a placeholder is not a name (this is the case axe passes)')

    row('aria-label-only', 'aria-label only',
        '<div class="weft-field">'
        + control_html('input', 'naming', 'nm-arialabel', label_text='Filter results')
        + '</div>',
        'name "Filter results"')

    row('hidden-label', 'Hidden label',
        '<div class="weft-field">'
        '<label class="weft-sr-only" for="nm-hidden">Filter results</label>'
        + control_html('input', 'naming', 'nm-hidden') + '</div>',
        'name "Filter results", and the label occupies no layout space')

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
        + control_html('input', 'naming', 'nm-help')
        + '<span class="weft-field-hint" id="nm-help-hint">Must be reachable over HTTPS.</span>'
          '</div>',
        'description contains "Must be reachable over HTTPS."')

    row('error-text', 'Error text',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-error">Webhook URL</label>'
        + control_html('input', 'naming', 'nm-error', state='invalid', value='not-a-url')
        + '<span class="weft-field-hint is-error" id="nm-error-hint">'
          'That address did not resolve. Check the host, then try again.</span>'
          '</div>',
        'description contains the error copy, and aria-invalid is true')

    row('help-then-error', 'Help plus error',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-both">Retention window</label>'
        + control_html('input', 'naming', 'nm-both', state='invalid', value='0')
        + '<span class="weft-field-hint" id="nm-both-hint">Whole days, 1 or more.</span>'
          '<span class="weft-field-hint is-error" id="nm-both-error">'
          'Zero is not a window. Enter 1 or more days.</span>'
          '</div>',
        'description contains each message exactly once')

    row('required-marker', 'Required marker',
        '<div class="weft-field">'
        '<label class="weft-field-label" for="nm-required">Retention'
        '<span class="weft-req">*</span></label>'
        + control_html('input', 'naming', 'nm-required') + '</div>',
        'required is true, and the name carries no marker glyph')

    return section(
        'naming', 'Naming — what does this control expose?',
        'Names and descriptions are read from the accessibility tree. That proves '
        'exposure, never announcement — what a screen reader does with a string is '
        'product-dependent and is not claimed here.',
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
    return section(
        'select-chrome', 'Select chrome — the chevron guard',
        'Permanent guard for the background-shorthand regression: a shorthand resets '
        'background-image, -repeat, -position and -size, which deleted the chevron in '
        'light and tiled it across the whole control in dark.',
        f'<div class="grid">{"".join(cells)}</div>')


# ── Page chrome ──────────────────────────────────────────────────────────────
# Deliberately namespaced away from weft-*: nothing here may style a specimen.
# The two author-* classes are the exception and exist to BE hostile — they are
# the realistic reproduction of the focus defect at class specificity.
CHROME = """
:root { color-scheme: light dark; }
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
.toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: nowrap;
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
