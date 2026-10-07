import * as React from 'react';
import { Combobox } from '../../../src/ui/combobox';
import { MultiSelect } from '../../../src/ui/multi-select';
import { Button } from '../../../src/ui/button';
import { FieldCode } from './FieldExamples';
const options = [{value:'studio',label:'Studio'},{value:'research',label:'Research'}];
export function SelectionLoadingExample({multiple}:{multiple:boolean}) {
  const [loading,setLoading]=React.useState(false);
  const [single,setSingle]=React.useState<string|null>(null);
  const [many,setMany]=React.useState<string[]>([]);
  const timer=React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(()=>()=>clearTimeout(timer.current),[]);
  const name=multiple?'MultiSelect':'Combobox';
  return <section style={{marginBlock:24,display:'grid',gap:12}} aria-label="Loading demonstration">
    <h3>Loading → ready</h3>
    <p>Start this simulated 1.8-second request, then open the picker. The Loading state below can be held open for inspection.</p>
    <div style={{maxWidth:440}}>{multiple ? <MultiSelect label="Spaces" options={options} value={many} onValueChange={setMany} loading={loading}/> : <Combobox label="Space" options={options} value={single} onValueChange={setSingle} loading={loading}/>}</div>
    <Button type="button" disabled={loading} style={{justifySelf:'start'}} onClick={()=>{setLoading(true);timer.current=setTimeout(()=>setLoading(false),1800);}}>{loading?'Demo request running…':'Simulate loading'}</Button>
    <Button type="button" variant="outline" disabled={loading} style={{justifySelf:'start'}} onClick={()=>{setLoading(true);timer.current=setTimeout(()=>setLoading(false),12000);}}>Simulate longer wait (12 seconds)</Button>
    <FieldCode code={`import * as React from 'react';\nimport { ${name} } from '@nodaste-lab/weft';\nconst options = [{value:'studio',label:'Studio'}, {value:'research',label:'Research'}];\nfunction Example() {\n  const [value,setValue] = React.useState<${multiple?'string[]':'string | null'}>(${multiple?'[]':'null'});\n  const [loading,setLoading] = React.useState(false);\n  const timer = React.useRef<ReturnType<typeof setTimeout>>();\n  React.useEffect(() => () => clearTimeout(timer.current), []);\n  return <>\n    <${name} label="${multiple?'Spaces':'Space'}" options={options} value={value} onValueChange={setValue} loading={loading} />\n    <button disabled={loading} onClick={() => {\n      setLoading(true);\n      // Demo only. Production loading follows the real request lifecycle.\n      timer.current = setTimeout(() => setLoading(false), 1800);\n    }}>Simulate loading</button>\n    <button disabled={loading} onClick={() => {\n      setLoading(true);\n      timer.current = setTimeout(() => setLoading(false), 12000);\n    }}>Simulate longer wait (12 seconds)</button>\n  </>;\n}`}/>
  </section>;
}
