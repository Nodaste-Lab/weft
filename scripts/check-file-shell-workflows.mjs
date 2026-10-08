import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const previewUrl=process.env.WEFT_SITE_URL??'http://127.0.0.1:5197';
const server=process.env.WEFT_SITE_URL?null:spawn(process.execPath,['node_modules/vite/bin/vite.js','--config','site/vite.config.ts','--port','5197','--strictPort'],{stdio:'ignore'});
if(server){for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('Workflow preview server exited');try{if((await fetch(previewUrl)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}}
// Run against site:dev, or set WEFT_SITE_URL to a built site:preview server.
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1314,height:960}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${previewUrl}/#/templates/file-shell`);
 assert.equal(await page.evaluate(()=>document.activeElement.tagName),'BODY');
 const shell=page.locator('.weft-file-shell').first();
 // Remaining focus assertions exercise keyboard activation.
 await page.keyboard.press('Tab');
 const comments=shell.getByRole('button',{name:'Comments',exact:true});
 if(await comments.getAttribute('aria-expanded')==='true')await comments.press('Enter');
 for(const name of ['Comments','Working status','Review','File info','Version history']){
  const trigger=shell.getByRole('button',{name,exact:true});await trigger.focus();await trigger.press('Enter');
  assert.equal(await trigger.getAttribute('aria-expanded'),'true');
  const panel=shell.getByRole('complementary',{name,exact:true});
  await page.waitForFunction(label=>document.activeElement?.getAttribute('aria-label')===label,name);
  assert.equal(await panel.count(),1);await page.keyboard.press('Escape');
  assert.equal(await trigger.getAttribute('aria-expanded'),'true');
  await trigger.focus();await trigger.press('Enter');
  assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  assert.equal(await trigger.evaluate(element=>element===document.activeElement),true);
 }
 await shell.getByRole('button',{name:'Actions for Project proposal'}).click();
 await page.getByRole('menuitem',{name:'More',exact:true}).hover();
 await page.getByRole('menuitem',{name:'Version history',exact:true}).focus();
 await page.getByRole('menuitem',{name:'Version history',exact:true}).press('Enter');
 await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Version history');
 const versionTrigger=shell.getByRole('button',{name:'Version history',exact:true});
 await versionTrigger.focus();await versionTrigger.press('Enter');
 assert.equal(await versionTrigger.evaluate(e=>e===document.activeElement),true);
 await shell.getByRole('button',{name:'Drop pin',exact:true}).click();
 assert.match(decodeURIComponent(await shell.locator('.weft-file-shell-surface').evaluate(e=>getComputedStyle(e).cursor)),/lucide-crosshair/);
 await shell.getByRole('button',{name:'Version history',exact:true}).click();
 const history=shell.getByRole('complementary',{name:'Version history'});
 await history.getByRole('textbox',{name:'Version label (optional)'}).fill('Checkpoint');
 await history.getByRole('button',{name:'Save version',exact:true}).click();
 await history.getByRole('button',{name:'Restore Checkpoint',exact:true}).click();
 await history.getByRole('button',{name:'Confirm restore',exact:true}).click();
 await history.getByText(/restored-.*Current/).waitFor();
 await page.getByRole('button',{name:'Assemblies',exact:true}).click();
 const readOnly=page.locator('details').filter({has:page.locator('summary').getByText('read-only',{exact:true})});
 await readOnly.locator('summary').click();await readOnly.getByRole('button',{name:'Working status',exact:true}).click();
 assert.equal(await readOnly.getByRole('radio').first().isDisabled(),true);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.getByRole('button',{name:'Complete shell',exact:true}).click();
 const mobileShell=page.locator('.weft-file-shell').first();
 const mobileRail=mobileShell.locator('.weft-file-shell-rail');
 await mobileRail.getByRole('button',{name:'Working status',exact:true}).click();
 await mobileShell.getByRole('radio').first().focus();
 await page.keyboard.press('Shift+Tab');
 assert.equal(await mobileRail.getByRole('button',{name:'Working status',exact:true}).evaluate(e=>e===document.activeElement),true,'Shift+Tab from first panel control returns to rail');
 await mobileRail.getByRole('button').first().focus();
 for(const button of await mobileRail.getByRole('button').all()){
  assert.equal(await button.evaluate(e=>e===document.activeElement),true,'Mobile Tab follows visual rail order');
  await page.keyboard.press('Tab');
 }
 assert.equal(await mobileShell.evaluate(s=>s.contains(document.activeElement)),true);
 const small=await mobileShell.locator('button,[tabindex="0"]').evaluateAll(nodes=>nodes.filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.width<44||r.height<44)}).map(e=>e.outerHTML));
 assert.deepEqual(small,[]);
 assert.equal(await mobileShell.locator('.weft-file-person-visual').first().evaluate(e=>e.getBoundingClientRect().width),32);
 const stacked=page.locator('.weft-file-presence > ul[data-stacked="true"]').first();
 const boxes=await stacked.locator('.weft-file-person-visual').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right}}));
 assert.equal(boxes.length,3);
 assert.equal(boxes[1].left<boxes[0].right&&boxes[2].left<boxes[1].right,true,'Stacked avatar visuals overlap');
 assert.equal(await stacked.locator('.weft-file-person').evaluateAll(nodes=>nodes.every(e=>{const r=e.getBoundingClientRect();return r.width===44&&r.height===44})),true);
 assert.deepEqual(errors,[]);console.log('File-shell workflows passed: rail/menu focus, Escape, cursor, version save/restore, read-only status, mobile layout.');
} finally {await browser.close();server?.kill();}
