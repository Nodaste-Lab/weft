import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const css = ['css/weft.css', 'css/weft-components.css'].map(path => readFileSync(path, 'utf8')).join('\n');
for (const theme of ['light', 'dark']) for (const density of ['default', 'compact', 'dense']) {
  test(`TextField composition ${theme} ${density}`, async ({ page }) => {
    await page.setViewportSize({width:320,height:900});
    const fields = [
      {label:'Empty'}, {label:'Filled', defaultValue:'Avery'}, {label:'Read only',readOnly:true, defaultValue:'Avery'},
      {label:'Disabled empty',disabled:true}, {label:'Date',type:'date' as const},
      {label:'A long legal organization name with additional qualifications'},
      {label:'Context',treatment:'underline' as const,defaultValue:'Avery'},
    ];
    await page.setContent(`<html data-palette="weft" data-theme="${theme}" data-density="${density}"><head><style>${css} body{margin:16px;background:var(--weft-paper);color:var(--weft-ink)} input{box-sizing:border-box;font:inherit;color:inherit;background:transparent}</style></head><body>${fields.map((props,i)=>`<div class="weft-text-field" data-treatment="${props.treatment||'cutout'}" ${props.readOnly?'data-readonly="true"':''} ${props.type==='date'?'data-date="true"':''}><div class="weft-text-field-group"><div class="weft-text-field-control"><input id="field-${i}" placeholder=" " value="${props.defaultValue||''}" ${props.disabled?'disabled':''} ${props.readOnly?'readonly':''} type="${props.type||'text'}"><label for="field-${i}">${props.label}</label></div></div></div>`).join('')}</body></html>`);
    const empty=page.getByLabel('Empty',{exact:true});
    const tier=await empty.evaluate(el=>parseFloat(getComputedStyle(el).getPropertyValue('--weft-control-h')));
    expect((await empty.boundingBox())!.height).toBe(tier+10);
    await empty.focus();
    expect(await empty.locator('..').locator('label').evaluate(el=>getComputedStyle(el).top)).toBe('0px');
    expect(await page.getByLabel('Disabled empty').locator('..').locator('label').evaluate(el=>getComputedStyle(el).backgroundImage)).toBe('none');
    expect(await page.getByLabel('Read only',{exact:true}).locator('..').locator('label').evaluate(el=>getComputedStyle(el).backgroundImage)).toContain('linear-gradient');
    expect(await page.getByLabel('Context').locator('..').locator('label').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
