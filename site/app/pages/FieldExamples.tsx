import * as React from 'react';
import { TextField, type TextFieldProps } from '../../../src/ui/text-field';
import { SearchField } from '../../../src/ui/search-field';
import './input-lab.css';

function fieldCode(props:TextFieldProps) {
  const attributes=Object.entries(props).map(([key,value])=>typeof value==='boolean'?value?key:null:typeof value==='number'?`${key}={${value}}`:typeof value==='string'?`${key}=${JSON.stringify(value)}`:null).filter(Boolean);
  return `import { TextField } from '@nodaste-lab/weft';\n\n<TextField\n  ${attributes.join('\n  ')}\n/>`;
}
/** Include only the selected live recipe, with its imports and invocation. */
export function recipeCode(source:string,name:string,usage:string) {
 const start=source.indexOf(`export function ${name}`);
 const next=source.indexOf('export function ',start+1);
 const imports=source.slice(0,source.indexOf('export function '));
 return `${imports}\n${source.slice(start,next<0?undefined:next).trim()}\n\n${usage}`;
}
export function FieldCode({code}:{code:string}) {
  return <details className="field-example-code"><summary>Code for this example</summary><pre tabIndex={0}><code>{code}</code></pre></details>;
}
export function FieldExamples({kind}:{kind:string}) {
 const multiline=kind==='textarea';
 const date=kind==='calendar';
 const search=kind==='search-field';
 const label=multiline?'Description':date?'Due date':'Display name';
 const base:TextFieldProps={label,...(multiline?{multiline:true,rows:3}:{}),...(date?{type:'date' as const}:{})};
 const help=date?'This date does not include a time or timezone.':multiline?'Include the context people need.':'The name others see in your workspace.';
 const filled=date?'2026-10-06':'Avery Chen';
 const cases:{title:string;props:Partial<TextFieldProps>}[]=[
   {title:'Empty · default cutout',props:{}},
   ...(!search?[{title:'With optional help',props:{description:help}}]:[]),
   ...(!multiline&&!date&&!search?[{title:'Underline · contextual edit',props:{treatment:'underline' as const,defaultValue:filled}}]:[]),
   {title:'Filled',props:{defaultValue:filled}},
   {title:'Error with durable help',props:{description:help,error:date?'Choose a date.':'Enter a value people will recognize.'}},
   {title:'Disabled',props:{disabled:true,defaultValue:filled}},
   {title:'Read only',props:{readOnly:true,defaultValue:filled}},
   {title:'Pending check',props:{pending:true,status:'Checking this example…',defaultValue:filled}},
   {title:'Confirmed result',props:{status:'This example was confirmed.',defaultValue:filled}},
 ];
 return <section className="input-lab" aria-label="Field examples with code">
   <h2>{search?'Search states':'Treatments and states'}</h2>
   <p>Each example includes the code that produces it. Tab or click to inspect focus, and hover to inspect hover. Feedback examples show supplied states; your application owns validation and asynchronous checks.</p>
   <div className="field-matrix-grid">{cases.filter(item=>!search||!['Pending check','Confirmed result','Error with durable help'].includes(item.title)).map(({title,props})=>{
     const example={...base,...props};
     return <article className="field-matrix-card" key={title}><h3>{search&&title==='Empty · default cutout'?'Empty search':title}</h3>
       {search?<SearchField label={`Search documents, ${title}`} clearLabel={`Clear search, ${title}`} defaultValue={title.startsWith('Empty')?'':'Research'} disabled={props.disabled} readOnly={props.readOnly} aria-invalid={!!props.error||undefined}/>:<TextField {...example}/>}
       <FieldCode code={search?`import { SearchField } from '@nodaste-lab/weft';\n\n<SearchField label=${JSON.stringify(`Search documents, ${title}`)} clearLabel=${JSON.stringify(`Clear search, ${title}`)} defaultValue=${JSON.stringify(title.startsWith('Empty')?'':'Research')}${props.disabled?' disabled':''}${props.readOnly?' readOnly':''}${props.error?' aria-invalid':''} />`:fieldCode(example)}/>
     </article>;
   })}</div>
 </section>;
}
