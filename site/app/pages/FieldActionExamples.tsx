import * as React from 'react';
import { FieldCode, recipeCode } from './FieldExamples';
import { AttachedCreateExample, FilteredSearchExample } from './FieldRecipes';
export { AttachedCreateExample, FilteredSearchExample } from './FieldRecipes';
import actionSource from './FieldRecipes.tsx?raw';
export function FieldActionExamples() {
 return <section className="input-lab" aria-label="Fields with attached actions"><h3>Attached actions</h3><p>Use an attached button for an action on this value. Search filters share the outer boundary but keep their own focus target.</p><div className="field-matrix-grid">
   <article className="field-matrix-card"><h4>Attached text button</h4><AttachedCreateExample/><FieldCode code={recipeCode(actionSource,'AttachedCreateExample','<AttachedCreateExample />')}/></article>
   <article className="field-matrix-card"><h4>Attached icon button</h4><AttachedCreateExample iconOnly/><FieldCode code={recipeCode(actionSource,'AttachedCreateExample','<AttachedCreateExample iconOnly />')}/></article>
   <article className="field-matrix-card"><h4>Inset search filters</h4><FilteredSearchExample/><FieldCode code={recipeCode(actionSource,'FilteredSearchExample','<FilteredSearchExample />')}/></article>
 </div></section>;
}
