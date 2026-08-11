/**
 * Error is never colour alone (owner call, visual pass; WCAG 1.4.1 Use of
 * Color). An invalid field carries an alert glyph at its trailing edge and
 * the error message leads with the same glyph — so the state survives every
 * kind of colour-blindness and a monochrome screen.
 *
 * The select is the stated exception at FIELD level: its right edge belongs
 * to the chevron (the same slot-arbitration reasoning document B applied to
 * search), so its non-colour cue is the message icon plus the border. That
 * is a decision this suite asserts, not an omission.
 */
import { expect, test } from '@playwright/test';
import { SPECIMEN_PAGE, applyAxes } from './harness';

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

test('the invalid field carries the alert glyph; every other state carries none', async ({ page }) => {
  await applyAxes(page, { density: 'marketing' });
  const readings = await page.evaluate(() => {
    const out: Record<string, string> = {};
    for (const el of document.querySelectorAll<HTMLElement>('[data-spec="boundary"]')) {
      const { control, state } = el.dataset;
      if (['input', 'textarea'].includes(control!)) {
        out[`${control}/${state}`] = getComputedStyle(el).backgroundImage;
      }
    }
    return out;
  });
  const problems: string[] = [];
  for (const [key, bg] of Object.entries(readings)) {
    const hasIcon = bg.includes('url(');
    const wantIcon = key.endsWith('/invalid');
    if (wantIcon && !hasIcon) problems.push(`${key}: no alert glyph — error is colour alone`);
    if (!wantIcon && hasIcon) problems.push(`${key}: carries a glyph it should not`);
  }
  expect(problems, problems.join('\n')).toEqual([]);
});

test('the select keeps exactly its chevron — the message icon is its non-colour cue', async ({ page }) => {
  await applyAxes(page, { density: 'marketing' });
  const urls = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>(
      '[data-spec="boundary"][data-control="select"][data-state="invalid"]',
    )!;
    return (getComputedStyle(el).backgroundImage.match(/url\(/g) ?? []).length;
  });
  expect(urls, 'the select right edge belongs to the chevron — one image, not two').toBe(1);
});

test('the glyph clears the text: invalid inputs reserve trailing padding, sm included', async ({ page }) => {
  // The sm modifier sets padding-inline at (0,2,0), the same weight as the
  // invalid rule — whichever is declared LATER wins the tie. This test pins
  // the required outcome (the icon rule is declared after is-sm), because
  // that ordering is exactly the cascade-trap class this plan has shipped
  // twice and probed six times.
  await applyAxes(page, { density: 'marketing' });
  const pads = await page.evaluate(() => {
    const read = (sel: string) =>
      parseFloat(getComputedStyle(document.querySelector<HTMLElement>(sel)!).paddingRight);
    return {
      invalid: read('[data-spec="boundary"][data-control="input"][data-state="invalid"]'),
      smInvalid: read('[data-spec="error-icon"][data-control="input-sm-invalid"]'),
    };
  });
  expect(pads.invalid, 'text would run under the glyph').toBeGreaterThanOrEqual(32);
  expect(pads.smInvalid, 'the sm tie must resolve toward the glyph clearance').toBeGreaterThanOrEqual(32);
});

test('the glyph paints the palette\'s own stop tone — every palette × theme', async ({ page }) => {
  // The chevron lesson, applied at authoring time instead of found in review:
  // a data-URI stroke cannot read a token, --weft-stop changes per theme and
  // palette (#a8382b / #f87171 / #ef4444), and an icon in the WRONG red is a
  // guard that quietly stopped guarding. The stroke is parsed from the
  // computed image and compared against the RESOLVED token, so a future
  // palette that overrides --weft-stop and forgets the icon fails here
  // without anyone extending a list.
  const combos: Array<{ palette?: string; theme?: string }> = [
    {},
    { theme: 'dark' },
    { palette: 'hud-glass' },
    { palette: 'hud-glass', theme: 'dark' },
    { palette: 'heritage-purple' },
    { palette: 'heritage-purple', theme: 'dark' },
  ];
  const problems: string[] = [];
  for (const combo of combos) {
    await applyAxes(page, { density: 'marketing', ...combo });
    const r = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(
        '[data-spec="boundary"][data-control="input"][data-state="invalid"]',
      )!;
      const stroke = /stroke='?%23([0-9a-fA-F]{6})/.exec(getComputedStyle(el).backgroundImage)?.[1];
      const stop = getComputedStyle(document.documentElement).getPropertyValue('--weft-stop').trim();
      return { stroke, stop };
    });
    const hex = r.stop.startsWith('#') ? r.stop.slice(1) : r.stop;
    if (!r.stroke || r.stroke.toLowerCase() !== hex.toLowerCase()) {
      problems.push(
        `${JSON.stringify(combo)}: glyph stroke #${r.stroke} against --weft-stop ${r.stop}`,
      );
    }
  }
  expect(problems, problems.join('\n')).toEqual([]);
});

test('an unavailable option is struck through, not merely greyed', async ({ page }) => {
  // The owner's fifth finding, the same rule one level deeper: a disabled
  // <option> signalled only by the UA's grey is colour-alone inside the
  // popup. Dashes cannot reach option text, so the unavailable heuristic
  // there is line-through plus the muted colour — computed on the option,
  // because the popup itself is UA chrome no screenshot can reach.
  await applyAxes(page, { density: 'marketing' });
  const r = await page.evaluate(() => {
    const sel = document.querySelector<HTMLSelectElement>(
      '[data-spec="boundary"][data-control="select"][data-state="default"]',
    )!;
    const disabled = sel.querySelector('option:disabled');
    const enabled = sel.querySelector('option:not(:disabled)')!;
    return {
      hasDisabledSpecimen: !!disabled,
      disabledDecoration: disabled ? getComputedStyle(disabled).textDecorationLine : 'missing',
      enabledDecoration: getComputedStyle(enabled).textDecorationLine,
    };
  });
  expect(r.hasDisabledSpecimen, 'the specimen select must ship an unavailable option').toBe(true);
  expect(r.disabledDecoration, 'unavailable reads as struck through').toBe('line-through');
  expect(r.enabledDecoration, 'available options carry no strike').toBe('none');
});

test('the error message leads with the glyph; a plain hint does not', async ({ page }) => {
  await applyAxes(page, { density: 'marketing' });
  const r = await page.evaluate(() => {
    const mask = (sel: string) => {
      const cs = getComputedStyle(document.querySelector(sel)!, '::before');
      return (
        cs.maskImage || (cs as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage || 'none'
      );
    };
    return {
      error: mask('.weft-field-hint.is-error'),
      plain: mask('.weft-field-hint:not(.is-error)'),
    };
  });
  expect(r.error, 'the message is the primary copy — the glyph makes it findable').toContain('url(');
  expect(r.plain, 'help text is not an alarm').not.toContain('url(');
});
