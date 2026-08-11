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
    // Checked: thumb centre sits at left 24 + 6 = 30 of the 40×24 box; the
    // track's own paint is sampled clear of the thumb, at x=10.
    const thumb = sampleAt(region, 30, 12);
    const track = sampleAt(region, 10, 12);
    expect(
      dist(thumb, track),
      `thumb ${thumb} against track ${track}: a thumb the track's own colour is an invisible state`,
    ).toBeGreaterThan(60);
  });
}

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
