/**
 * Plain-CSS switch and slider — NATIVE BEHAVIOUR, not appearance (P7, AC5).
 *
 * A visually matching CSS slider that cannot be dragged or serialized is not
 * a slider. Both controls are styled NATIVE inputs (checkbox, range), so
 * keyboard, drag, min/max/step, RTL, disabled, focus and form serialization
 * are the browser's own — and this suite proves the styling did not break
 * them, which appearance:none plus pseudo-element painting absolutely can.
 *
 * Read-only appears nowhere here, deliberately: native checkbox and range
 * ignore the attribute, neither React primitive implements it, and the test
 * of that decision is in the parity suite — neither layer CLAIMS it.
 *
 * The unchecked switch is the serialization case that matters: an unchecked
 * checkbox serializes as ABSENT, not as a falsy value, and Radix reaches its
 * value through a hidden bubble input — exactly where the two layers can
 * diverge with no visual difference at all.
 */
import { expect, test, type Page } from '@playwright/test';
import { SPECIMEN_PAGE, applyAxes } from './harness';

/**
 * Region capture (never document capture) of a padded rect around an element,
 * decoded in-browser. Returns RGBA pixel data plus the element's offset inside
 * the capture, so callers can sample by element-relative coordinates or count
 * paint changes in the halo where a focus ring lives.
 */
async function paintedRegion(page: Page, selector: string, pad = 6) {
  const el = page.locator(selector);
  await el.scrollIntoViewIfNeeded();
  const box = (await el.boundingBox())!;
  const clip = {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
  const shot = await page.screenshot({ clip });
  const pixels = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
    return { data: [...data], width, height };
  }, shot.toString('base64'));
  // Device-pixel-ratio scale between CSS px and captured px.
  const scale = pixels.width / clip.width;
  return { ...pixels, scale, elX: (box.x - clip.x) * scale, elY: (box.y - clip.y) * scale, elW: box.width * scale, elH: box.height * scale };
}

function sampleAt(region: Awaited<ReturnType<typeof paintedRegion>>, x: number, y: number) {
  const px = Math.round(region.elX + x * region.scale);
  const py = Math.round(region.elY + y * region.scale);
  const i = (py * region.width + px) * 4;
  return [region.data[i], region.data[i + 1], region.data[i + 2]] as const;
}

const dist = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

test.describe('switch', () => {
  test('Space toggles it, from the keyboard alone', async ({ page }) => {
    const sw = page.locator('#sw-default');
    await sw.focus();
    await expect(sw).not.toBeChecked();
    await page.keyboard.press('Space');
    await expect(sw).toBeChecked();
    await page.keyboard.press('Space');
    await expect(sw).not.toBeChecked();
  });

  test('a pointer click toggles it', async ({ page }) => {
    const sw = page.locator('#sw-default');
    await sw.click();
    await expect(sw).toBeChecked();
  });

  test('GUARD — the bare control meets the 24px floor in both dimensions, with no wrapper doing the work', async ({ page }) => {
    // Conformance may not depend on composition an iframe author has no
    // reason to know about. The BARE class is the contract.
    const box = await page.locator('#sw-default').boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });

  test('the focus ring survives whatever paints the track — measured as paint, not as computed style', async ({ page }) => {
    // The first attempt at this control used clip-path and clipped the ring
    // off entirely. A computed-style check CANNOT see that class of failure —
    // clip-path leaves outline and box-shadow computing exactly as before
    // while painting neither (this test's own first version passed the
    // reintroduced clip, which is how it earned this shape). So the claim is
    // painted pixels: focusing must change the halo around the control.
    const before = await paintedRegion(page, '#sw-default');
    await page.locator('#sw-default').focus();
    const after = await paintedRegion(page, '#sw-default');
    let changed = 0;
    for (let i = 0; i < before.data.length; i += 4) {
      if (
        Math.abs(before.data[i] - after.data[i]) +
          Math.abs(before.data[i + 1] - after.data[i + 1]) +
          Math.abs(before.data[i + 2] - after.data[i + 2]) >
        30
      ) {
        changed++;
      }
    }
    expect(changed, 'focus must visibly paint a ring around the switch').toBeGreaterThan(50);
  });

  test('disabled takes no input', async ({ page }) => {
    const sw = page.locator('#sw-disabled');
    await expect(sw).toBeChecked();
    await sw.click({ force: true });
    await expect(sw, 'a disabled switch must not toggle').toBeChecked();
  });
});

test.describe('slider', () => {
  test('arrows move by step; Home and End reach min and max', async ({ page }) => {
    const sl = page.locator('#sl-default'); // min 0, max 10, step 2, value 4
    await sl.focus();
    await page.keyboard.press('ArrowRight');
    await expect(sl).toHaveValue('6');
    await page.keyboard.press('ArrowLeft');
    await expect(sl).toHaveValue('4');
    await page.keyboard.press('End');
    await expect(sl).toHaveValue('10');
    await page.keyboard.press('Home');
    await expect(sl).toHaveValue('0');
  });

  test('a pointer drag moves the value', async ({ page }) => {
    const sl = page.locator('#sl-default');
    // page.mouse speaks viewport coordinates and does not auto-scroll.
    await sl.scrollIntoViewIfNeeded();
    const box = (await sl.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    const value = await sl.inputValue();
    expect(Number(value), 'dragging to the right end must raise the value').toBeGreaterThanOrEqual(8);
  });

  test('step constrains every route to a value', async ({ page }) => {
    const sl = page.locator('#sl-default');
    await sl.scrollIntoViewIfNeeded();
    const box = (await sl.boundingBox())!;
    // Near the right end, where the nearest step is unambiguous. The
    // assertion demands MOVEMENT to a stepped value — "still divisible by
    // two" alone is satisfied by a click that never landed (4 % 2 == 0),
    // which is exactly how the first version of this test passed vacuously.
    await page.mouse.click(box.x + box.width * 0.92, box.y + box.height / 2);
    const value = Number(await sl.inputValue());
    expect(value, 'the click must actually move the value').not.toBe(4);
    expect(value % 2, 'step=2: a pointer click still lands on a step').toBe(0);
  });

  test('RTL flips the horizontal arrows and the rendered direction', async ({ page }) => {
    const sl = page.locator('#sl-rtl'); // inside dir="rtl", min 0 max 10 step 2 value 4
    await sl.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(sl, 'in RTL, ArrowLeft moves toward max').toHaveValue('6');
    await page.keyboard.press('ArrowUp');
    await expect(sl, 'ArrowUp increases regardless of direction').toHaveValue('8');
  });

  test('GUARD — the bare control meets the 24px floor', async ({ page }) => {
    const box = await page.locator('#sl-default').boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });

  test('disabled takes neither keys nor pointer', async ({ page }) => {
    const sl = page.locator('#sl-disabled');
    const before = await sl.inputValue();
    await sl.click({ force: true });
    await page.keyboard.press('ArrowRight');
    await expect(sl).toHaveValue(before);
  });
});

test.describe('form serialization — actual named values, not "the form has entries"', () => {
  test('checked serializes, unchecked is ABSENT, the slider always carries its value', async ({ page }) => {
    const entries = await page.evaluate(() => {
      const form = document.querySelector<HTMLFormElement>('#switch-slider-form')!;
      return [...new FormData(form).entries()];
    });
    const asMap = Object.fromEntries(entries);
    expect(asMap['sw-on'], 'the checked switch serializes under its name').toBe('on');
    expect(
      'sw-off' in asMap,
      'the unchecked switch is ABSENT — absent, not falsy, is native semantics',
    ).toBe(false);
    expect(asMap['volume']).toBe('4');
  });

  test('RangeBounds: two named sliders in a named group serialize as two named values', async ({ page }) => {
    const result = await page.evaluate(() => {
      const form = document.querySelector<HTMLFormElement>('#range-bounds-form')!;
      const group = form.querySelector('fieldset')!;
      const legend = group.querySelector('legend')!;
      return {
        entries: Object.fromEntries(new FormData(form).entries()),
        groupName: legend.textContent,
      };
    });
    expect(result.entries['retention-from']).toBe('2');
    expect(result.entries['retention-to']).toBe('8');
    expect(result.groupName).toContain('Retention window');
  });

  test('the RangeBounds group is exposed as a named group', async ({ page }) => {
    // Exposure, never announcement: the fieldset/legend pair computes to a
    // group with an accessible name. What a screen reader says is not claimed.
    const snapshot = await page.locator('#range-bounds-form fieldset').ariaSnapshot();
    expect(snapshot).toContain('group');
    expect(snapshot).toContain('Retention window');
  });
});

test('neither layer claims read-only — asserted, not assumed', async ({ page }) => {
  // Native checkbox and range IGNORE the readonly attribute; claiming the
  // state would be a lie a test could not catch later. The specimen page must
  // not teach it either.
  const readonlyClaims = await page.evaluate(
    () =>
      document.querySelectorAll('.weft-switch[readonly], .weft-slider[readonly]').length,
  );
  expect(readonlyClaims).toBe(0);
});

test('the switch carries document B\'s proposal geometry — full pill, large inset thumb', async ({ page }) => {
  // The owner's visual pass against B's rendering: the shipped switch was a
  // skinny 18px track with a 12px thumb — it read as "stretched off", a
  // different control from the proposal's full-height pill with a fat
  // circular thumb. B's geometry, asserted computed: the track fills the
  // 40×24 box; the thumb is an 18px CIRCLE inset 3px, travelling to 19px
  // when checked (40 − 18 − 3).
  await applyAxes(page, { theme: 'light' });
  const g = await page.evaluate(() => {
    const el = document.querySelector('#sw-default')!;
    const track = getComputedStyle(el, '::before');
    const thumb = getComputedStyle(el, '::after');
    const checked = getComputedStyle(document.querySelector('#sw-checked')!, '::after');
    // Vendor pseudo-elements are invisible to getComputedStyle (it returns
    // the element's own style — this suite's select-chrome cousin learned
    // that the hard way), so the slider track's radius is read from the
    // CSSOM rule that authored it.
    let sliderTrackRadius = 'rule not found';
    for (const sheet of document.styleSheets) {
      for (const rule of sheet.cssRules) {
        const r = rule as CSSStyleRule;
        if (r.selectorText?.includes('::-webkit-slider-runnable-track')) {
          sliderTrackRadius = r.style.borderRadius;
        }
      }
    }
    return {
      trackTop: track.top, trackBottom: track.bottom,
      thumbW: thumb.width, thumbH: thumb.height, thumbLeft: thumb.left,
      checkedLeft: checked.left,
      trackRadius: track.borderTopLeftRadius,
      rootRadius: getComputedStyle(el).borderTopLeftRadius,
      sliderTrackRadius,
    };
  });
  expect(g.trackTop, 'the track fills the box — no skinny inset band').toBe('0px');
  expect(g.trackBottom).toBe('0px');
  // Pill caps, not ellipse taper (owner's visual pass): border-radius: 50% is
  // the DOT token, correct only on squares — on the 40×24 oblong it renders
  // quarter-ellipse corners that taper to points. The pill token (999px,
  // clamped by the browser to half the short side) gives true semicircular
  // caps. Percentage radii on non-square shapes are the defect class.
  expect(g.trackRadius, 'an oblong takes the pill token — 50% tapers it').toBe('999px');
  expect(g.rootRadius).toBe('999px');
  expect(
    g.sliderTrackRadius,
    'the slider track is the same oblong class — authored radius, via CSSOM',
  ).toBe('var(--weft-radius-pill)');
  expect(g.thumbW, 'an 18px thumb, per the proposal').toBe('18px');
  expect(g.thumbH, 'circular: width equals height').toBe(g.thumbW);
  expect(g.thumbLeft).toBe('3px');
  expect(g.checkedLeft, 'checked travel = 40 − 18 − 3').toBe('19px');
});

test('a disabled switch says so without colour: dashed track, and the wrap adds a lock', async ({ page }) => {
  // B's disabled card: "Lock glyph plus a muted track — state is not carried
  // by colour alone." The BARE control carries the dashed unavailable stroke
  // (the same language the text controls took this round — conformance may
  // not depend on the wrap); the wrap composition adds B's lock beside the
  // label.
  await applyAxes(page, { theme: 'light' });
  const g = await page.evaluate(() => {
    const bare = getComputedStyle(document.querySelector('#sw-disabled')!, '::before');
    const wrap = document.querySelector('.weft-switch-wrap:has(.weft-switch:disabled)');
    const lock = wrap ? getComputedStyle(wrap, '::after') : null;
    return {
      borderStyle: bare.borderTopStyle,
      lockMask: lock ? (lock.maskImage || (lock as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage || 'none') : 'missing',
    };
  });
  expect(g.borderStyle, 'the bare disabled switch carries the dashed stroke').toBe('dashed');
  expect(g.lockMask, 'the disabled wrap composes B\'s lock glyph').toContain('url(');
});

for (const theme of ['light', 'dark'] as const) {
  test(`the checked thumb reads distinctly against its own track — ${theme}`, async ({ page }) => {
    // The glyphless equivalent of the chevron invariant. Sampled at POINTS —
    // thumb centre against a track point — because a whole-element variance
    // metric is satisfied by the page ground alone and passed a
    // thumb-painted-as-track reintroduction (this test's first shape did
    // exactly that, which is why it now samples).
    await applyAxes(page, { theme });
    const sw = page.locator('#sw-checked');
    await expect(sw).toBeChecked();
    const region = await paintedRegion(page, '#sw-checked');
    // Checked (B geometry): thumb centre sits at left 19 + 9 = 28 of the
    // 40×24 box; the track's own paint is sampled clear of the thumb, at x=9.
    const thumb = sampleAt(region, 28, 12);
    const track = sampleAt(region, 9, 12);
    expect(
      dist(thumb, track),
      `thumb ${thumb} against track ${track}: a thumb the track's own colour is an invisible state`,
    ).toBeGreaterThan(60);
  });
}

test('a hovered ghost button keeps readable text — the filled-button hover pattern', async ({ page }) => {
  // The owner's visual pass: .weft-btn:hover (0,3,0) outweighs
  // .weft-btn.is-ghost (0,2,0), so a hovered ghost took the filled hover's
  // deep-blue background while KEEPING its ink text — ink on deep blue,
  // unreadable. The fix is the pattern the owner named: on hover a ghost IS
  // the button — deep-blue fill, on-blue text — asserted from the computed
  // pair's own contrast, not from a class.
  await applyAxes(page, { theme: 'light' });
  const btn = page.locator('.weft-btn.is-ghost').first();
  await btn.hover();
  // The colours transition at --weft-dur-fast: a reading taken immediately
  // after hover() sees the PRE-hover paint and passes anything — this test's
  // first run did exactly that, green on the broken cascade. Wait the
  // transition out; the harness learned this lesson at P1 (the mid-transition
  // token reading) and it holds for computed styles too.
  await page.waitForTimeout(450);
  const contrast = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    const lum = (c: string) => {
      const [r, g, b] = c.match(/\d+(\.\d+)?/g)!.map(Number);
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const L1 = lum(cs.color);
    const L2 = lum(cs.backgroundColor);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  });
  expect(contrast, `hovered ghost label contrast ${contrast.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
});

test('the slider thumb paints from the token, not from the UA default', async ({ page }) => {
  // Losing appearance:none on the vendor thumb pseudo silently swaps the
  // token-styled thumb for the UA's — every behavioural test keeps passing,
  // because the UA thumb behaves perfectly. The claim is paint: some pixel at
  // the thumb's position must be the computed --weft-blue.
  const blue = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.color = 'var(--weft-blue)';
    document.body.append(probe);
    const rgb = getComputedStyle(probe).color.match(/\d+/g)!.map(Number);
    probe.remove();
    return rgb;
  });
  const region = await paintedRegion(page, '#sl-default');
  // value 4 of 0–10: thumb centre ≈ 9 + 0.4 * (width - 18) in element space.
  const el = page.locator('#sl-default');
  const width = (await el.boundingBox())!.width;
  const cx = 9 + 0.4 * (width - 18);
  let best = Infinity;
  for (let dx = -6; dx <= 6; dx += 2) {
    best = Math.min(best, dist(sampleAt(region, cx + dx, 12), blue));
  }
  expect(best, 'no pixel near the thumb position matches the token blue').toBeLessThan(60);
});
