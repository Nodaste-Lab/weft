/**
 * The consumer condition: both CSS files injected verbatim into a sandboxed
 * panel iframe, with the panel's own hostile CSS after them.
 *
 * Review round 3's verdict was that this plan's tests proved a component looks
 * right in a gallery rather than that a consumer stays safe, and that the gap
 * was large enough to green-light a release that breaks Heddle's injected-frame
 * path. Confirmed absent at the time: no iframe test existed anywhere in this
 * repository. This is that test, and it lands before anything is changed,
 * because every later phase needs it in place first.
 *
 * Three frames' worth of evidence, from two frames:
 *   #panel    Weft's two files in Heddle's production order, then the panel CSS
 *   #control  the same panel CSS and the same markup, no Weft at all
 * Every computed-style difference between them is attributable to Weft. That is
 * what turns "no selector escapes the namespace" from a claim into a reading.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type FrameLocator, type Page } from '@playwright/test';
import {
  BOUNDARY_FLOOR,
  THEMES,
  VISIBLE_DELTA,
  captureRegion,
  maxChannelDelta,
  readBoundary,
  rgbText,
  samplePoints,
  settle,
  type Rgb,
  type Theme,
} from './harness';
import { atLeast, binary, measure } from './ratchet';
import {
  WEFT_PANEL_CSP,
  panelRootAttributes,
  weftPanelStyle,
} from './fixtures/heddle-panel-injection';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FIXTURE = '/tests/contract/fixtures/consumer-host.html';

// Read verbatim off disk. Not through a bundler, not through the dev server —
// the bytes Heddle imports with ?raw.
const WEFT_TOKENS = readFileSync(join(ROOT, 'css', 'weft.css'), 'utf8');
const WEFT_COMPONENTS = readFileSync(join(ROOT, 'css', 'weft-components.css'), 'utf8');

interface FrameOptions {
  withWeft: boolean;
  /**
   * Whether the panel's ADVERSARIAL rules are present. Its ordinary styling
   * always is. Both frames must agree, or the comparison measures the panel
   * sheet rather than Weft.
   */
  hostile?: boolean;
  theme?: Theme;
  density?: 'marketing' | 'compact';
}

async function fillFrame(page: Page, id: string, options: FrameOptions): Promise<void> {
  const { withWeft, hostile = true, theme = 'light', density = 'marketing' } = options;
  const rootAttrs = panelRootAttributes({
    palette: 'weft',
    theme,
    density: density === 'compact' ? 'compact' : 'marketing',
  });
  const weftStyle = withWeft ? weftPanelStyle(WEFT_TOKENS, WEFT_COMPONENTS) : '';

  await page.evaluate(
    ({ frameId, attrs, weft, csp, hostileOn }) => {
      const tpl = (id: string) => (document.getElementById(id) as HTMLTemplateElement).innerHTML;
      const panelCss = tpl('panel-css-base') + (hostileOn ? tpl('panel-css-hostile') : '');
      const panelBody = (document.getElementById('panel-body') as HTMLTemplateElement).innerHTML;
      const frame = document.getElementById(frameId) as HTMLIFrameElement;
      // allow-same-origin so the test can read computed styles out of the frame.
      // Heddle's own sandbox is tighter; the CSP below is reproduced verbatim so
      // the frame is still forbidden from fetching anything.
      frame.setAttribute('sandbox', 'allow-same-origin');
      frame.srcdoc =
        `<!DOCTYPE html><html lang="en" ${attrs}><head>` +
        `<meta http-equiv="Content-Security-Policy" content="${csp}">` +
        (weft ? `<style>${weft}</style>` : '') +
        `<style>${panelCss}</style>` +
        `</head><body>${panelBody}</body></html>`;
    },
    { frameId: id, attrs: rootAttrs, weft: weftStyle, csp: WEFT_PANEL_CSP, hostileOn: hostile },
  );

  await page.waitForFunction((frameId) => {
    const frame = document.getElementById(frameId) as HTMLIFrameElement;
    return frame.contentDocument?.readyState === 'complete' && !!frame.contentDocument.body?.firstElementChild;
  }, id);
  await settle(page);
}

function panelFrame(page: Page): FrameLocator {
  return page.frameLocator('#panel');
}

test.beforeEach(async ({ page }) => {
  await page.goto(FIXTURE);
});

// ── 1. Every token resolves inside the frame ─────────────────────────────────

test('every --weft-* token declared in weft.css resolves inside the frame', async ({ page }) => {
  await fillFrame(page, 'panel', { withWeft: true });

  // The base block is the contract: a token declared only under an axis (dark,
  // compact, hud-glass) is legitimately absent in the default frame. The base
  // block is the one whose selector LIST contains a bare `:root` — today that
  // is `:root, :root[data-palette="weft"]`, and matching on the whole selector
  // string would break the next time a variant is added to it.
  const declared: string[] = [];
  for (const [, selector, body] of WEFT_TOKENS.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(
    /([^{}]+)\{([^{}]*)\}/g,
  )) {
    if (!selector.split(',').some((s2) => s2.trim() === ':root')) continue;
    declared.push(...[...body.matchAll(/(--weft-[\w-]+)\s*:/g)].map((m) => m[1]));
  }
  expect(declared.length, 'no --weft-* tokens found in the base :root block').toBeGreaterThan(40);

  const unresolved = await page.evaluate((names) => {
    const doc = (document.getElementById('panel') as HTMLIFrameElement).contentDocument!;
    const style = doc.defaultView!.getComputedStyle(doc.documentElement);
    return names.filter((n) => style.getPropertyValue(n).trim() === '');
  }, declared);

  await measure({
    key: 'iframe/tokens-resolve',
    shortfall: unresolved.length,
    evidence: `${declared.length - unresolved.length} of ${declared.length} base tokens resolve`,
    failure:
      'Tokens declared in weft.css do not resolve inside the injected frame. Heddle hash-compares ' +
      `this file and injects it verbatim; a token that resolves here and not there is a panel ` +
      `rendering with a blank value: ${unresolved.join(', ')}`,
  });
});

test('every var(--weft-*) the component layer reads is declared by the token layer', async ({ page }) => {
  await fillFrame(page, 'panel', { withWeft: true });

  const referenced = [
    ...new Set([...WEFT_COMPONENTS.matchAll(/var\(\s*(--weft-[\w-]+)/g)].map((m) => m[1])),
  ].sort();
  expect(referenced.length, 'the component layer reads no tokens at all').toBeGreaterThan(10);

  const unresolved = await page.evaluate((names) => {
    const doc = (document.getElementById('panel') as HTMLIFrameElement).contentDocument!;
    const style = doc.defaultView!.getComputedStyle(doc.documentElement);
    return names.filter((n) => style.getPropertyValue(n).trim() === '');
  }, referenced);

  await measure({
    key: 'iframe/component-token-references-resolve',
    shortfall: unresolved.length,
    evidence: `${referenced.length - unresolved.length} of ${referenced.length} referenced tokens resolve`,
    failure: `The component layer reads tokens the token layer does not declare: ${unresolved.join(', ')}`,
  });
});

// ── 2. Nothing escapes the namespace, and nothing escapes the frame ──────────

/**
 * Properties Weft is EXPECTED to change on unclassed markup, each because a
 * global rule in the shipped CSS deliberately sets it. Anything outside this
 * list is a component selector reaching markup it does not own.
 */
const INHERITED_BY_DESIGN = new Set([
  // :root[data-palette="weft"] body { color; font-family } — weft.css. Only the
  // two INHERITED properties of that rule are allowed here. `background` is
  // deliberately NOT on this list even though the same rule sets it: background
  // does not inherit, so allowing it would let a real escape through — a bare
  // `input { background: … }` reaching #p-bare would paint a control Weft does
  // not own while this test stayed green on the property that showed it.
  'color',
  'font-family',
  // @media (prefers-reduced-motion: reduce) { *, *::before, *::after } — weft-components.css
  'animation-duration',
  'animation-iteration-count',
  'transition-duration',
  // Derived from the above by the engine rather than set independently.
  'caret-color',
  'column-rule-color',
  'row-rule-color',
  'outline-color',
  'text-decoration-color',
  'text-emphasis-color',
  '-webkit-text-fill-color',
  '-webkit-text-stroke-color',
  'border-block-end-color',
  'border-block-start-color',
  'border-inline-end-color',
  'border-inline-start-color',
  'border-bottom-color',
  'border-left-color',
  'border-right-color',
  'border-top-color',
]);

const UNOWNED_MARKUP = ['#p-collides', '#p-note', '#p-bare', '#p-bare-button'];

/**
 * Compare the two frames' unowned markup and return every unexplained property
 * change. Both frames must be filled with the same panel-CSS setting.
 */
async function namespaceDiffs(page: Page): Promise<string[]> {
  return page.evaluate(
    ({ selectors, allowed }) => {
      const read = (frameId: string, selector: string) => {
        const doc = (document.getElementById(frameId) as HTMLIFrameElement).contentDocument!;
        const el = doc.querySelector(selector);
        if (!el) throw new Error(`fixture: ${selector} is missing from the ${frameId} frame`);
        const style = doc.defaultView!.getComputedStyle(el);
        const out: Record<string, string> = {};
        for (let i = 0; i < style.length; i += 1) {
          const prop = style.item(i);
          // Custom properties are excluded by definition: inheriting the whole
          // --weft-* set into every element is what injection is FOR. What is
          // being tested is whether a component SELECTOR matched.
          if (prop.startsWith('--')) continue;
          out[prop] = style.getPropertyValue(prop);
        }
        return out;
      };
      const found: string[] = [];
      for (const selector of selectors) {
        const withWeft = read('panel', selector);
        const without = read('control', selector);
        for (const prop of Object.keys(withWeft)) {
          if (allowed.includes(prop)) continue;
          if (withWeft[prop] !== without[prop]) {
            found.push(`${selector} ${prop}: ${without[prop]} → ${withWeft[prop]}`);
          }
        }
      }
      return found;
    },
    { selectors: UNOWNED_MARKUP, allowed: [...INHERITED_BY_DESIGN] },
  );
}

test('no Weft selector reaches markup outside the namespace', async ({ page }) => {
  // TWO PASSES, and the second is the one that matters.
  //
  // With the panel's adversarial rules present, a Weft escape at element
  // specificity — `input { border: 0 }`, say — is overwritten by the panel's own
  // later `input {}` rule, so both frames agree and the diff comes back empty
  // while Weft has in fact escaped its namespace. The masked pass is still worth
  // running: it is the arrangement a real panel ships. The unmasked pass drops
  // only the adversarial half, keeping the panel's ordinary typography so the
  // two frames stay comparable, and nothing can hide behind a later rule.
  await fillFrame(page, 'panel', { withWeft: true, hostile: true });
  await fillFrame(page, 'control', { withWeft: false, hostile: true });
  const masked = await namespaceDiffs(page);

  await fillFrame(page, 'panel', { withWeft: true, hostile: false });
  await fillFrame(page, 'control', { withWeft: false, hostile: false });
  const unmasked = await namespaceDiffs(page);

  const all = [
    ...masked.map((d) => `with panel CSS: ${d}`),
    ...unmasked.map((d) => `unmasked: ${d}`),
  ];

  await measure({
    key: 'iframe/no-selector-escape',
    shortfall: all.length,
    evidence:
      `${masked.length} change(s) with the adversarial rules present, ${unmasked.length} with ` +
      `them removed, across ${UNOWNED_MARKUP.length} unowned elements`,
    failure:
      'Injecting Weft changed markup it does not own. `.weft-widget` is a panel class that ' +
      'merely collides on the prefix; prefixing is not ownership of the prefix:\n  ' +
      all.join('\n  '),
  });
});

test('the injected CSS does not reach the embedding document', async ({ page }) => {
  const before = await page.evaluate(() => {
    const el = document.getElementById('host-input')!;
    const s = getComputedStyle(el);
    return { border: s.borderTopWidth, radius: s.borderTopLeftRadius, minHeight: s.minHeight };
  });
  await fillFrame(page, 'panel', { withWeft: true });
  const after = await page.evaluate(() => {
    const el = document.getElementById('host-input')!;
    const s = getComputedStyle(el);
    return { border: s.borderTopWidth, radius: s.borderTopLeftRadius, minHeight: s.minHeight };
  });

  const moved = (Object.keys(before) as (keyof typeof before)[]).filter((k) => before[k] !== after[k]);
  await measure({
    key: 'iframe/no-escape-to-host-document',
    shortfall: moved.length,
    evidence: `host .weft-input before ${JSON.stringify(before)}, after ${JSON.stringify(after)}`,
    failure:
      'The embedding document carries markup with weft-* class names. Injecting into the frame ' +
      `must not style it — a panel restyling its host is the failure mode the sandbox exists to ` +
      `prevent. Moved: ${moved.join(', ')}`,
  });
});

// ── 3. Fonts: the control classes set theirs, the panel keeps its own ────────

test('the control classes keep their font against a conflicting body font', async ({ page }) => {
  await fillFrame(page, 'panel', { withWeft: true });
  const fonts = await page.evaluate(() => {
    const doc = (document.getElementById('panel') as HTMLIFrameElement).contentDocument!;
    const read = (sel: string) => doc.defaultView!.getComputedStyle(doc.querySelector(sel)!).fontFamily;
    return {
      input: read('#p-default'),
      label: read('label[for="p-default"]'),
      button: read('#p-button'),
      panelNote: read('#p-note'),
    };
  });

  // The panel sets `body { font-family: "Comic Sans MS" }`. The control classes
  // set font-family explicitly rather than inheriting, which is also what lets
  // decision 6 drop the uppercase transform without losing the mono voice — the
  // same property, verified in the frame that matters.
  //
  // A panel rule at CLASS specificity keeps the panel's font. The bare
  // `body { font-family }` does NOT: it loses to weft.css's
  // `:root[data-palette="weft"] body`, which is a documented palette rule and an
  // opt-in Heddle makes deliberately when it sets data-palette on the frame.
  // Recorded as a tested behaviour rather than discovered downstream.
  const fontProblems: string[] = [];
  if (!fonts.input.includes('Inter Tight')) fontProblems.push('the field inherited the panel body font');
  if (!fonts.button.includes('Inter Tight')) fontProblems.push('the button inherited the panel body font');
  if (!fonts.label.includes('JetBrains Mono')) fontProblems.push('the label lost its mono voice');
  if (!fonts.panelNote.includes('Comic Sans MS')) fontProblems.push('a panel class rule lost to Weft');
  await measure({
    key: 'iframe/font-families',
    shortfall: fontProblems.length,
    evidence: JSON.stringify(fonts),
    failure: fontProblems.join('; '),
  });
});

test('the panel reset does not push controls off their tier', async ({ page }) => {
  // The panel ships `*, *::before, *::after { box-sizing: content-box }`.
  // weft-components.css sets box-sizing on the control classes explicitly and
  // says in a comment that this is why; class specificity beats the universal
  // selector, and this is that comment as a measurement.
  await fillFrame(page, 'panel', { withWeft: true });
  const boxes = await page.evaluate(() => {
    const doc = (document.getElementById('panel') as HTMLIFrameElement).contentDocument!;
    const read = (sel: string) => doc.defaultView!.getComputedStyle(doc.querySelector(sel)!).boxSizing;
    return { input: read('#p-default'), select: read('#p-select'), textarea: read('#p-textarea') };
  });

  const contentBox = Object.entries(boxes).filter(([, v]) => v !== 'border-box').map(([k]) => k);
  await measure({
    key: 'iframe/box-sizing-holds',
    shortfall: contentBox.length,
    evidence: JSON.stringify(boxes),
    failure:
      `The panel's universal content-box reset reached ${contentBox.join(', ')}, which pushes ` +
      `the control past its --weft-control-h tier.`,
  });
});

// ── 4. Every state renders inside the frame, focus included ──────────────────

const FRAME_STATES = [
  ['default', '#p-default'],
  ['invalid', '#p-invalid'],
  ['disabled', '#p-disabled'],
  ['readonly', '#p-readonly'],
] as const;

test('every control state renders distinctly inside the frame', async ({ page }) => {
  await fillFrame(page, 'panel', { withWeft: true });
  const frame = panelFrame(page);

  const readings: Record<string, { border: Rgb; fill: Rgb }> = {};
  for (const [state, selector] of FRAME_STATES) {
    const box = (await frame.locator(selector).boundingBox())!;
    await captureRegion(page, { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 });
    const r = await readBoundary(page, box);
    readings[state] = { border: r.border, fill: r.fill };
  }

  const evidence = Object.entries(readings)
    .map(([s, r]) => `${s} border ${rgbText(r.border)} fill ${rgbText(r.fill)}`)
    .join('; ');

  // Only the invalid case is measured here. Disabled and read-only are the same
  // defect as on the page, tracked by the states/* keys — recording them twice
  // would mean P2 has to delete two entries for one fix, and one of the two
  // would inevitably be missed.
  const invalidDelta = Math.max(
    maxChannelDelta(readings.invalid.border, readings.default.border),
    maxChannelDelta(readings.invalid.fill, readings.default.fill),
  );
  await measure({
    key: 'iframe/invalid-renders-distinctly',
    shortfall: atLeast(invalidDelta, VISIBLE_DELTA),
    evidence,
    failure:
      `Inside the frame, an invalid field separates from an ordinary one by ${invalidDelta}, ` +
      `under the ${VISIBLE_DELTA} floor — which is what a later selector tying with ` +
      `[aria-invalid="true"] looks like.`,
  });
});

test('focus renders inside the frame under the panel shadow utility', async ({ page }) => {
  // One key across both themes: it is one defect with one fix, and a per-theme
  // key would let a phase half-fix it and still delete an entry.
  const results: string[] = [];
  const blind: string[] = [];

  for (const theme of THEMES) {
    await fillFrame(page, 'panel', { withWeft: true, theme });
    const shadowed = panelFrame(page).locator('#p-shadowed');

    const box = (await shadowed.boundingBox())!;
    const clip = { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 };
    const points: [number, number][] = [];
    for (const d of [1, 2, 3, 4]) {
      for (const fx of [0.25, 0.5, 0.75]) {
        points.push([box.x + box.width * fx, box.y - d]);
        points.push([box.x + box.width * fx, box.y + box.height + d - 1]);
      }
    }

    await captureRegion(page, clip);
    const before = await samplePoints(page, points);
    await shadowed.focus();
    await settle(page);
    await captureRegion(page, clip);
    const after = await samplePoints(page, points);

    const changed = before.filter((b: Rgb, i: number) => maxChannelDelta(b, after[i]) >= VISIBLE_DELTA).length;
    results.push(`${theme}: ${changed}/${points.length} ring pixels changed`);
    if (changed < points.length / 4) blind.push(theme);
  }

  await measure({
    key: 'iframe/focus-survives-host-shadow-utility',
    shortfall: blind.length,
    evidence: results.join('; '),
    failure:
      'A panel shipping an ordinary `.shadow { box-shadow: … }` utility deletes the focus ring ' +
      'on any field carrying it. The global rule is :where(...):focus-visible — (0,1,0), the ' +
      `same weight — and the panel sheet loads later. Blind in: ${blind.join(', ')}`,
  });
});

// ── 5. The boundary rule, measured on the surface that matters ───────────────

for (const theme of THEMES) {
  test(`a field is identifiable as a control inside the frame — ${theme}`, async ({ page }) => {
    await fillFrame(page, 'panel', { withWeft: true, theme });
    const frame = panelFrame(page);

    const cells: string[] = [];
    const failures: string[] = [];
    for (const [state, selector] of FRAME_STATES) {
      if (state === 'disabled') continue; // WCAG 1.4.11 exempts inactive components.
      const box = (await frame.locator(selector).boundingBox())!;
      await captureRegion(page, {
        x: box.x - 12,
        y: box.y - 12,
        width: box.width + 24,
        height: box.height + 24,
      });
      const r = await readBoundary(page, box);
      const line = `${state}: border ${r.borderRatio.toFixed(2)}:1, fill ${r.fillRatio.toFixed(2)}:1`;
      cells.push(line);
      if (r.best < BOUNDARY_FLOOR) failures.push(line);
    }

    await measure({
      key: `iframe/boundary/${theme}`,
      shortfall: failures.length,
      evidence: `${failures.length} of ${cells.length} under ${BOUNDARY_FLOOR}:1 — ${cells.join('; ')}`,
      failure:
        `Inside the injected panel frame, ${failures.length} of ${cells.length} states reach ` +
        `neither ${BOUNDARY_FLOOR}:1 border nor ${BOUNDARY_FLOOR}:1 fill:\n  ${failures.join('\n  ')}`,
    });
  });
}
