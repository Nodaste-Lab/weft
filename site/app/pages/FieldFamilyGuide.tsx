import * as React from 'react';
import { TextField } from '../../../src/ui/text-field';
import familySource from './FieldRecipes.tsx?raw';
import { BasicSearchExample } from './FieldRecipes';
import { FieldCode, recipeCode } from './FieldExamples';
import './input-lab.css';

export function FieldFamilyGuide({ kind }: { kind: string }) {
  return <section className="input-lab" aria-label="Related field patterns">
    {kind === 'textarea' && <><TextField label="Description" multiline rows={4} description="Include the context people need to understand this work."/><FieldCode code={'import { TextField } from "@nodaste-lab/weft";\n\n<TextField label="Description" multiline rows={4} description="Include the context people need to understand this work." />'}/></>}
    {kind === 'search-field' && <div className="input-lab-states" style={{display:'block',maxWidth:560}}><BasicSearchExample/></div>}
    {kind === 'calendar' && <><TextField label="Due date (optional)" type="date" description="Enter or choose a calendar date. This example does not set a time or timezone."/><FieldCode code={'import { TextField } from "@nodaste-lab/weft";\n\n<TextField label="Due date (optional)" type="date" description="Enter or choose a calendar date. This example does not set a time or timezone." />'}/></>}
    {kind === 'search-field' && <FieldCode code={recipeCode(familySource,'BasicSearchExample','<BasicSearchExample />')}/>}
    <h3>Choose a field pattern</h3>
    <table><thead><tr><th>Pattern</th><th>Reach for it when</th></tr></thead><tbody>
      <tr><td><a href="#/components/text-field">TextField · forms</a></td><td>One line of information. Border-cutout is primary; underline is for clearly labelled contextual edits.</td></tr>
      <tr><td><a href="#/components/textarea">Textarea</a></td><td>Several lines of plain text, including descriptions and prompts. Enter inserts a newline.</td></tr>
      <tr><td><a href="#/components/search-field">Search field</a></td><td>Finding or filtering existing content. Includes a named search control and clear action.</td></tr>
      <tr><td><a href="#/components/calendar">Date entry and calendar</a></td><td>A calendar date. Use native date entry for a simple date; Calendar supports compositions needing visual date selection.</td></tr>
      <tr><td><a href="#/components/input">Inline rename</a></td><td>Editing an existing title in place, with Rename, Save, Cancel, and focus recovery.</td></tr>
    </tbody></table>
    <p>Date entry uses TextField with the native date type. Calendar is a separate visual date-selection primitive.</p>
  </section>;
}

export function ControlUsageGuide({multiline=false}:{multiline?:boolean}) {
 return <section aria-label="Control treatment guidance">
   <h3>{multiline?'Textarea control':'Input control'} playground</h3>
   <p>These controls are supported building blocks. Use TextField for the standard labelled form composition; use the control directly when your composition owns the label, instructions, feedback, and layout.</p>
   <table><thead><tr><th>Treatment</th><th>Use it for</th><th>Keep in mind</th></tr></thead><tbody>
     <tr><td><code>{multiline?'Textarea':'Input variant="default"'}</code></td><td>{multiline?'Plain-text notes, descriptions, and prompts inside a custom labelled composition.':'Custom labelled fields that need a complete outlined boundary.'}</td><td>{multiline?'Use TextField multiline for the standard cutout presentation. Enter inserts a newline.':'Use TextField for the standard cutout presentation. The bare control does not supply a label.'}</td></tr>
     {!multiline&&<>
       <tr><td><code>Input variant="inline"</code></td><td>Renaming an existing document, file, row, or tab in place.</td><td>Provide a discoverable Rename action, an accessible label, Save/Cancel, error recovery, and restored focus. Do not use it for unfamiliar requested information.</td></tr>
       <tr><td><code>Input variant="underline"</code></td><td>A small number of contextual edits with a persistent associated label.</td><td>Use TextField treatment="underline" when you want the shared label and feedback. Avoid unfamiliar or long forms.</td></tr>
       <tr><td><code>Input variant="low"</code></td><td>Secondary metadata edits whose purpose is already clear, with a quieter text treatment and a complete boundary.</td><td>This is editable, not disabled. Keep the label and accessible text/border contrast. Do not use it to make required fields harder to notice.</td></tr>
     </>}
   </tbody></table>
   <p>State is independent of treatment: error needs corrective feedback; read-only allows viewing and copying; disabled means unavailable. For Input, size="sm" reduces the current density tier by one step; preserve accessible targets in the surrounding layout.</p>
 </section>;
}
