/**
 * Popup focus states, measured in Chromium against the live css/ files.
 *
 * The global :focus-visible ring is unlayered, so it used to outrank the layered
 * utilities Weft's own select, dropdown-menu and context-menu parts rely on to
 * show their state, and Radix's script focus-return painted it on a trigger
 * after a mouse choice. These specimens carry the data-slot and role attributes
 * the React primitives render, so no React runtime is needed here; the tracker
 * itself is covered in src/ui/__tests__/input-modality.test.tsx.
 */
import { expect, test, type Page } from '@playwright/test';
import { SPECIMEN_PAGE, applyAxes } from './harness';

const SPECIMENS = `
  <div id="pf" style="padding:40px">
    <button id="pf-before">before</button>
    <style>
      /* What Tailwind's focus-visible:border-ring utility does, in its layer. */
      @layer utilities { #pf-select-trigger:focus-visible { border-color: rgb(1, 2, 3); } }
    </style>
    <button id="pf-select-trigger" data-slot="select-trigger" style="border-width:1px;border-style:solid">Space</button>
    <button id="pf-menu-trigger" data-slot="dropdown-menu-trigger">Create</button>
    <div data-slot="context-menu-trigger"><a id="pf-row-link" href="#row">Row</a></div>
    <button id="pf-plain">plain</button>
    <div role="listbox" data-slot="select-content" id="pf-listbox" tabindex="-1">
      <div role="option" data-slot="select-item" id="pf-option" tabindex="-1">Private</div>
    </div>
    <div role="menu" data-slot="dropdown-menu-content" id="pf-menu" tabindex="-1">
      <div role="menuitem" data-slot="dropdown-menu-item" id="pf-menuitem" tabindex="-1">Folder</div>
    </div>
  </div>`;

async function setup(page: Page): Promise<void> {
  await page.goto(SPECIMEN_PAGE);
  await applyAxes(page, { theme: 'dark' });
  await page.evaluate((html) => document.body.insertAdjacentHTML('beforeend', html), SPECIMENS);
  await page.focus('#pf-before');
  await page.keyboard.press('Tab');
}

async function ring(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      focusVisible: node.matches(':focus-visible'),
      outline: style.outlineStyle === 'solid',
      shadow: style.boxShadow !== 'none',
      border: style.borderTopColor,
    };
  });
}

test.describe('popup parts', () => {
  for (const selector of ['#pf-listbox', '#pf-option', '#pf-menu', '#pf-menuitem']) {
    test(`${selector} shows no ring when it holds keyboard focus`, async ({ page }) => {
      await setup(page);
      await page.locator(selector).focus();
      expect(await ring(page, selector)).toMatchObject({ focusVisible: true, outline: false, shadow: false });
    });
  }

  test('ordinary controls keep the global ring', async ({ page }) => {
    await setup(page);
    await page.focus('#pf-plain');
    expect(await ring(page, '#pf-plain')).toMatchObject({ focusVisible: true, outline: true });
  });
});

test.describe('popup triggers', () => {
  const triggers = ['#pf-select-trigger', '#pf-menu-trigger', '#pf-row-link'];

  for (const selector of triggers) {
    test(`${selector} keeps the ring until a pointer press, then returns it for navigation keys`, async ({ page }) => {
      await setup(page);
      await page.focus(selector);
      expect(await ring(page, selector)).toMatchObject({ focusVisible: true, outline: true });

      await page.evaluate(() => document.documentElement.setAttribute('data-weft-input-modality', 'pointer'));
      await page.focus('#pf-option');
      await page.focus(selector);
      expect(await ring(page, selector)).toMatchObject({ focusVisible: true, outline: false, shadow: false });

      await page.evaluate(() => document.documentElement.setAttribute('data-weft-input-modality', 'keyboard'));
      expect(await ring(page, selector)).toMatchObject({ focusVisible: true, outline: true });
    });
  }

  test('the select trigger drops the ring-coloured border after a pointer press', async ({ page }) => {
    await setup(page);
    await page.focus('#pf-select-trigger');
    expect((await ring(page, '#pf-select-trigger')).border).toBe('rgb(1, 2, 3)');
    await page.evaluate(() => document.documentElement.setAttribute('data-weft-input-modality', 'pointer'));
    const resting = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.borderTop = '1px solid var(--input)';
      document.body.append(probe);
      const color = getComputedStyle(probe).borderTopColor;
      probe.remove();
      return color;
    });
    expect((await ring(page, '#pf-select-trigger')).border).toBe(resting);
    expect(resting).not.toBe('rgb(1, 2, 3)');
  });

  test('controls outside the popup families keep the ring after a pointer press', async ({ page }) => {
    await setup(page);
    await page.evaluate(() => document.documentElement.setAttribute('data-weft-input-modality', 'pointer'));
    await page.focus('#pf-before');
    await page.focus('#pf-plain');
    expect(await ring(page, '#pf-plain')).toMatchObject({ focusVisible: true, outline: true });
  });
});
