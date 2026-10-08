#!/usr/bin/env node
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath,['scripts/generate-html-documents.mjs'],{stdio:'pipe'});
const html=readFileSync('/tmp/weft-html-documents/components.html','utf8');
assert.equal((html.match(/class="html-layout-example"/g)||[]).length,11);
assert(!html.includes('component-heading'));
const tokens=readFileSync('css/weft.css','utf8');
const componentCss=readFileSync('css/weft-components.css','utf8').split('/* Authored document components — shared atoms through organisms. */')[1]+readFileSync('site/app/pages/html-layout-guidance.css','utf8');
const sharedHtml=html.replace(/<style>[\s\S]*?<\/style>/,`<style>${componentCss}</style>`);
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage();let count=0;
 for(const theme of ['light','dark']) for(const density of ['comfortable','compact','dense']) for(const width of [320,768,1280]) {
  await page.setViewportSize({width,height:900});
  await page.setContent(`<html data-theme="${theme}" data-palette="weft" data-density="${density}"><head><style>${tokens} body{margin:0;background:var(--weft-paper)}</style></head><body>${sharedHtml}</body></html>`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${theme}/${density}/${width}`);
  const columns=page.locator('.html-layout-pair').last();
  const boxes=await columns.locator(':scope > section').evaluateAll(els=>els.map(el=>({x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y})));
  if(width===320) assert(boxes[1].y>boxes[0].y,'Comparison must stack');
  if(width===1280) assert.equal(boxes[0].y,boxes[1].y,'Comparison aligns at top');
  const disclosure=page.locator('details.html-layout-panel').last();
  await disclosure.locator('summary').focus();await page.keyboard.press('Enter');assert(await disclosure.evaluate(el=>el.open));
  await page.keyboard.press('Space');assert(!(await disclosure.evaluate(el=>el.open)));
  await disclosure.locator('summary').click();assert(await disclosure.evaluate(el=>el.open));
  assert.equal(await page.locator('script,button,input,form').count(),0);
  for(const href of await page.locator('a[href^="#"]').evaluateAll(els=>els.map(el=>el.getAttribute('href')))) assert(await page.locator(href).count(),`Missing anchor ${href}`);
  assert(await page.locator('.html-layout-bad-demo pre').evaluate(el=>el.scrollWidth<=el.clientWidth),'Failure snippet must wrap');
  assert(await page.locator('#layout-table-title').evaluate(el=>el.scrollWidth<=el.clientWidth),'Table title must stay visible');
  for(const el of await page.locator('pre[aria-label]').all()) assert.equal(await el.getAttribute('role'),'region');
  const target=await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--weft-touch-target')));
  for(const el of await page.locator('summary').all()) assert(await el.evaluate(el=>el.getBoundingClientRect().height)>=target,'Disclosure target follows density');
  count++;
 }
 await page.setViewportSize({width:320,height:900});
 await page.locator('.html-layout-table-scroll td').first().evaluate(el=>{el.style.whiteSpace='nowrap';el.textContent='Evidence'.repeat(60)});
 const table=page.locator('.html-layout-table-scroll').first();assert(await table.evaluate(el=>el.scrollWidth>el.clientWidth));
 await table.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);assert(await table.evaluate(el=>el.scrollLeft>0));
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Text zoom overflows');
 if(process.argv[2]) {
  const rendered=JSON.parse(readFileSync(process.argv[2],'utf8'));assert.deepEqual(rendered.warnings,[]);await page.setContent(rendered.html);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Ava output overflows');
 }
 console.log(`HTML document components: ${count} theme/density/viewport combinations passed, plus native disclosures, local table scrolling and 200% text zoom.`);
}finally{await browser.close();}
