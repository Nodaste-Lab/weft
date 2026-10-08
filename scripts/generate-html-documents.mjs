#!/usr/bin/env node
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
const root=fileURLToPath(new URL('..',import.meta.url));
const output=resolve(process.argv[2] ?? '/tmp/weft-html-documents');
mkdirSync(output,{recursive:true});
const scratch=mkdtempSync(join(root,'.html-documents-'));
try {
 const modulePath=join(scratch,'specimens.mjs');
 await build({entryPoints:[join(root,'site/app/pages/HtmlDocumentComponents.tsx')],outfile:modulePath,bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',loader:{'.jpg':'dataurl','.css':'empty'},logLevel:'silent'});
 const {HtmlLayoutGuidance}=await import(pathToFileURL(modulePath).href);
 const canonical=readFileSync(join(root,'css/weft-components.css'),'utf8').split('/* Authored document components — shared atoms through organisms. */')[1];
 if(!canonical)throw new Error('Shared document CSS marker missing.');
 const mapping={
  '--weft-radius-card':'var(--ava-radius, 4px)', '--weft-touch-target':'24px',
  '--weft-space-1':'4px','--weft-space-2':'8px','--weft-space-3':'12px','--weft-space-4':'16px','--weft-space-5':'24px','--weft-space-6':'32px',
  '--weft-ink':'var(--ava-fg, CanvasText)', '--weft-muted':'var(--ava-muted, GrayText)',
  '--weft-paper':'var(--ava-surface, Canvas)', '--weft-rule':'var(--ava-rule, GrayText)',
  '--weft-danger':'var(--ava-danger, CanvasText)', '--weft-link':'var(--ava-link, LinkText)', '--weft-blue':'var(--ava-accent, Highlight)',
  '--weft-fill-soft':'var(--ava-code-bg, Canvas)', '--weft-mark':'var(--ava-highlight, Highlight)',
  '--weft-font-serif':'var(--ava-font-serif, Georgia, serif)', '--weft-font-sans':'var(--ava-font-sans, system-ui, sans-serif)',
  '--weft-font-mono':'var(--ava-font-mono, monospace)',
 };
 const layoutCss=readFileSync(join(root,'site/app/pages/html-layout-guidance.css'),'utf8');
 const css=(canonical+layoutCss).replace(/var\((--weft-[\w-]+)\)/g,(_,name)=>{if(!mapping[name])throw new Error(`Unmapped token ${name}`);return mapping[name];});
 const escape=html=>html.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 const inventory=JSON.parse(readFileSync(join(root,'tooling/html-document-components.json'),'utf8'));
 const authoringOverview=`<section id="authoring-rules"><h2>HTML authoring guide</h2>${inventory.authoringRules.map(rule=>`<h3>${escape(rule.title)}</h3><p>${escape(rule.description)}</p>`).join('')}<h2>Explore visual techniques</h2><p>Combine columns, cards, summary metrics, state badges, callouts, expandable panels, code, tables, imagery and diagrams. Adapt these examples or create your own.</p></section>`;

 const source=`<style>${css}</style><main class="weft-doc"><h1>Flexible HTML authoring examples</h1><p>Compose supported native HTML and CSS freely, reusing Weft where it helps. These optional examples do not limit what authors can build.</p>${authoringOverview}<section id="layout-examples"><h2>Layout examples</h2>${renderToStaticMarkup(HtmlLayoutGuidance())}</section></main>`;
 writeFileSync(join(output,'components.html'),source);
 writeFileSync(join(output,'register.json'),JSON.stringify({title:'Flexible HTML authoring — guidance and examples',source,source_format:'html'},null,2));
 console.log(output);
}finally{rmSync(scratch,{recursive:true,force:true});}
