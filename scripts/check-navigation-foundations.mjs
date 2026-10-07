import { chromium } from '@playwright/test';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const css = ['css/weft.css', 'css/weft-components.css'].map((p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')).join('\n');
const browser = await chromium.launch({ headless: true });
let scans = 0;
try {
  const page = await browser.newPage();
  for (const theme of ['light', 'dark']) for (const [density, height] of [['default',44],['compact',36],['dense',28]]) {
    await page.setContent(`<html lang="en" data-palette="weft" data-theme="${theme}"><head><title>Navigation foundations</title><style>${css}</style></head><body style="background:var(--weft-paper)"><main><h1 style="color:var(--weft-ink)">Navigation foundations</h1><nav aria-label="Files"><div class="weft-navigation-row" data-navigation-density="${density}" data-current="true"><button class="weft-navigation-disclosure" aria-expanded="false" aria-label="Expand Research">›</button><a class="weft-navigation-label" href="#research" aria-current="page">Research</a><span class="weft-navigation-count" role="img" aria-label="3 signals awaiting action for Research">3</span></div></nav></main></body></html>`);
    await page.addScriptTag({ content: axe.source });
    const row = page.locator('.weft-navigation-row');
    assert.equal(await row.evaluate((el) => parseFloat(getComputedStyle(el).minHeight)),height);
    for (const state of ['rest','hover','pressed','focus']) {
      if (state === 'hover') await row.hover();
      if (state === 'pressed') await page.mouse.down();
      if (state === 'focus') await page.locator('a').focus();
      const results = await page.evaluate(() => window.axe.run(document, { rules: { 'color-contrast': { enabled: true } } }));
      assert.deepEqual(results.violations.map((v) => ({ id:v.id, nodes:v.nodes.map((n)=>n.target) })),[],`${theme}/${density}/${state}`);
      scans++;
      if (state === 'pressed') await page.mouse.up();
    }
    await row.evaluate((el) => el.setAttribute('data-touch','true'));
    for (const selector of ['.weft-navigation-label','.weft-navigation-disclosure']) {
      const box = await page.locator(selector).boundingBox(); assert.ok(box.width >= 44 && box.height >= 44);
    }
  }
  console.log(`Navigation foundations: ${scans} standalone accessibility scans passed; density and touch geometry verified without site CSS.`);
} finally { await browser.close(); }
