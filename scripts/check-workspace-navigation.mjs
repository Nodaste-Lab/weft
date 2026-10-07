import { chromium, expect } from '@playwright/test';
import axe from 'axe-core';
import { readFile } from 'node:fs/promises';
const option = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const base = option('--url', 'http://127.0.0.1:5179');
const browser = await chromium.launch({ headless: true });
let scans = 0;
try {
 const standalone = await browser.newPage();
 const css = await Promise.all(['../css/weft.css','../css/weft-components.css'].map(path => readFile(new URL(path, import.meta.url), 'utf8')));
 await standalone.setContent(`<style>${css.join('\n')}</style><div id=fixture></div>`);
 for (const [density,height] of [['default',44],['compact',36],['dense',28]]) {
  await standalone.locator('#fixture').evaluate((el,density)=>{el.innerHTML=`<div class="weft-navigation-row" data-navigation-density="${density}"><a class="weft-navigation-label" href="#file"><span>File</span></a></div>`;},density);
  const actual=await standalone.locator('.weft-navigation-row').evaluate(el=>el.getBoundingClientRect().height);
  if(actual!==height)throw new Error(`Standalone CSS ${density}: expected ${height}, got ${actual}`);
 }
 await standalone.close();
 const page = await browser.newPage({ viewport: { width: 1490, height: 1091 } });
 for (const theme of ['light', 'dark']) for (const [density, height] of [['default',44],['compact',36],['dense',28]]) {
  await page.goto(`${base}/#/all`);
  await page.evaluate(({ theme, density }) => { document.documentElement.setAttribute('data-theme', theme); document.documentElement.setAttribute('data-density', density); }, { theme, density });
  const nav = page.locator('#workspace-example');
  await expect(nav).toBeVisible();
  for (const label of ['Signals','Kanban board','Research notes']) {
   const link = nav.getByRole('link', { name: label, exact: true });
   const metrics = await link.evaluate(el => {
    const svg=el.querySelector('svg').getBoundingClientRect(), text=el.querySelector('span')?.getBoundingClientRect() ?? el.getBoundingClientRect();
    return { display:getComputedStyle(el).display, row:el.closest('.weft-navigation-row').getBoundingClientRect().height, dy:Math.abs((svg.y+svg.height/2)-(text.y+text.height/2)) };
   });
   if (metrics.display!=='flex' || metrics.dy>3 || Math.abs(metrics.row-height)>1) throw new Error(`${theme}/${density}/${label}: ${JSON.stringify(metrics)}`);
  }
  const picker=nav.getByRole('combobox',{name:'Space',exact:true});
  await picker.click(); await page.getByRole('option',{name:/Studio/}).click();
  const alignment=await picker.evaluate(el=>{const icon=el.querySelector('.weft-navigation-space-avatar').getBoundingClientRect(),name=el.querySelector('.weft-navigation-space-name').getBoundingClientRect(),count=el.querySelector('.weft-navigation-count').getBoundingClientRect();return {gap:name.x-icon.right, trailing:el.getBoundingClientRect().right-count.right};});
  if(alignment.gap<6 || alignment.gap>10 || alignment.trailing>50)throw new Error(`Space identity alignment: ${JSON.stringify(alignment)}`);
  await page.addScriptTag({content:axe.source});
  const result=await page.evaluate(()=>axe.run(document.querySelector('#workspace-example')));
  if(result.violations.length)throw new Error(JSON.stringify(result.violations)); scans++;
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/#/all`);
 await page.locator('[data-template-id=workspace-navigation-rail]').getByRole('button',{name:'Open navigation',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 const nav=page.locator('#workspace-example');
 await expect(nav.getByRole('link',{name:'Signals',exact:true})).toHaveAttribute('aria-current','page');
 for(const label of ['Signals','Kanban board','Research notes'])await expect(nav.getByRole('link',{name:label,exact:true})).toBeVisible();
 await page.addScriptTag({content:axe.source});
 const result=await page.evaluate(()=>axe.run(document.querySelector('[role=dialog]')));
 if(result.violations.length)throw new Error(JSON.stringify(result.violations));scans++;
 await page.keyboard.press('Escape'); await expect(page.locator('[data-template-id=workspace-navigation-rail]').getByRole('button',{name:'Open navigation',exact:true})).toBeFocused();
 console.log(`PASS workspace template: ${scans} axe scans, inline icon/text geometry at all densities, Chrome Space identity alignment, native current links and narrow drawer focus return.`);
} finally { await browser.close(); }
