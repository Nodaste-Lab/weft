import * as React from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { TextField } from '../../../src/ui/text-field';
import { SearchField } from '../../../src/ui/search-field';
import { Button } from '../../../src/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../../../src/ui/popover';
import './input-lab.css';

export function AttachedCreateExample({iconOnly=false}:{iconOnly?:boolean}) {
 const [name,setName]=React.useState('');
 const [error,setError]=React.useState('');
 const [message,setMessage]=React.useState('');
 const ref=React.useRef<HTMLInputElement|HTMLTextAreaElement>(null);
 return <form className="field-action-form" noValidate onSubmit={e=>{e.preventDefault();if(!name.trim()){setError('Enter a project name.');ref.current?.focus();return;}setError('');setMessage(`Created “${name.trim()}” in this local example.`);}}>
   <TextField ref={ref} label="Project name (required)" value={name} required error={error} description="Creates a fictional local example. Enter or the button submits." onChange={e=>{setName(e.target.value);setMessage('');if(e.target.value.trim())setError('');}} action={<Button className="weft-btn" type="submit" aria-label={iconOnly?'Create example project':undefined}>{iconOnly?<ArrowRight aria-hidden="true" size={18}/>: 'Create example'}</Button>}/>
   <p role="status">{message}</p>
 </form>;
}
export function FilteredSearchExample() {
 const id=React.useId();
 const [query,setQuery]=React.useState('');
 const [text,setText]=React.useState(true);
 const [html,setHtml]=React.useState(true);
 const [open,setOpen]=React.useState(false);
 const selected=Number(text)+Number(html);
 const results=[{title:'Research notes',type:'text'},{title:'Product direction',type:'text'},{title:'Findings prototype',type:'html'}].filter(file=>(file.type==='text'?text:html)&&file.title.toLowerCase().includes(query.toLowerCase()));
 return <>
   <div className="field-action-group field-action-search">
     <SearchField className="field-action-query" label="Search filtered example files" clearLabel="Clear filtered file search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. Research" aria-describedby={`${id}-help`}/>
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild><Button type="button" variant="ghost" className="field-filter-button" aria-label={`Filter example files, ${selected} file types selected`}><SlidersHorizontal aria-hidden="true" size={16}/><span aria-hidden="true">{selected}</span></Button></PopoverTrigger>
       <PopoverContent align="end" aria-label="Example file filters"><fieldset className="field-filter-options"><legend>File types</legend><label><input type="checkbox" checked={text} onChange={e=>setText(e.target.checked)}/> Text files</label><label><input type="checkbox" checked={html} onChange={e=>setHtml(e.target.checked)}/> HTML files</label></fieldset><Button type="button" variant="outline" onClick={()=>{setText(true);setHtml(true);}}>Reset filters</Button></PopoverContent>
     </Popover>
   </div>
   <small id={`${id}-help`}>Search text and file-type filters work together. Clearing the query keeps your filters.</small>
   <p role="status">{results.length?`${results.length} matching files`:'No files match. Change the query or filters.'}</p>
   <ul>{results.map(file=><li key={file.title}>{file.title}</li>)}</ul>
 </>;
}

export function BasicSearchExample() {
 const [query,setQuery]=React.useState('');
 const results=['Product direction','Research notes'].filter(title=>title.toLowerCase().includes(query.toLowerCase()));
 return <><SearchField label="Search example documents" clearLabel="Clear example document search" placeholder="e.g. Research" value={query} onChange={e=>setQuery(e.target.value)}/><p role="status">{results.length?`${results.length} matching documents`:'No documents match.'}</p><ul>{results.map(title=><li key={title}>{title}</li>)}</ul></>;
}
