import * as React from 'react';
import { ProjectFormExample } from './FormRecipes';
import recipeSource from './FormRecipes.tsx?raw';
import statusSource from '../../../src/gallery/specimens/forms.tsx?raw';
import { FieldCode, recipeCode } from './FieldExamples';

export function FormExamples() {
  return <section aria-label="Standard form examples" style={{display:'grid',gap:20}}>
    <h2>Standard form examples</h2><p>Form manages shared form state through react-hook-form. TextField supplies the cutout label, control, helper, and error presentation. Pass the controller value, events, ref, and error to TextField; do not wrap it in FormControl or add a second FormLabel.</p>
    <p>These examples use empty starting values and local simulated saves. They do not change Avalandra data.</p>
    <article style={exampleStyle}><h3>Validate and save</h3>
    <ProjectFormExample/>
    <FieldCode code={`${recipeSource}\n\n<ProjectFormExample />`}/>
    </article><article style={exampleStyle}><h3>Save failure and retry</h3>
    <p>Entries remain editable after failure. This fixture always returns a failed save so you can inspect the recovery state.</p>
    <ProjectFormExample failSave/>
    <FieldCode code={`${recipeSource}\n\n<ProjectFormExample failSave />`}/>
    </article><h3>Choose who owns field presentation</h3>
    <table className="input-system-table"><thead><tr><th>Composition</th><th>Use it when</th><th>Owns labels and feedback</th></tr></thead><tbody>
      <tr><td>FormField + TextField</td><td>Standard single-line, multiline, and native date fields.</td><td>TextField. FormField supplies value, events, ref, and validation error.</td></tr>
      <tr><td>FormItem + FormControl + native control</td><td>Custom field layouts or controls such as Select, Checkbox, and Switch.</td><td>FormLabel, FormDescription, FormMessage, and one FormStatus wire the native control.</td></tr>
    </tbody></table>
    <p>Validate on first blur or submit, then recheck an existing error while the value is corrected. Keep instructions visible beside errors. Submit focuses the first invalid field. Pending blocks duplicate saves; failure preserves entries; a response for an older value must not claim the latest edits were saved.</p>
  </section>;
}

export function FormStatusRecipe() {
 return <><p>This playground isolates FormStatus inside a custom cutout composition. Tone and pending expose supplied state; they do not perform a check or announce a result. The application owns validation and announcements.</p><FieldCode code={recipeCode(statusSource.split('/** Specimens')[0],'FormSpecimen','<FormSpecimen pending>Checking the handle…</FormSpecimen>')}/></>;
}

const exampleStyle: React.CSSProperties = {display:'grid',gap:16,padding:24,border:'1px solid var(--weft-rule)',background:'var(--weft-paper)'};
