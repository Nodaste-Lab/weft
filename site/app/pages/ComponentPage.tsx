import fileHeaderExampleSource from '../../../src/gallery/FileHeaderExample.tsx?raw';
import { SelectionLoadingExample } from './SelectionLoadingExample';
import React from 'react';
import propsSnapshot from '../../../props-snapshot.json';
import { DesignSystemUiGallery } from '../../../src/gallery/DesignSystemUiGallery';
import { COMPONENT_DOC_SECTIONS, componentDocs, isWritten, splitSections } from '../content';
import { categoryLabels, displayTitle, patternsUsing, primitiveById, primitives, templatesUsing } from '../nav';
import { hrefFor } from '../routes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../src/ui/collapsible';
import { Button } from '../../../src/ui/button';
import { FormExamples, FormStatusRecipe } from './FormExamples';
import { FieldActionExamples } from './FieldActionExamples';
import { FieldExamples, FieldCode } from './FieldExamples';
import { Label } from '../../../src/ui/label';
import { Checkbox } from '../../../src/ui/checkbox';
import { Switch } from '../../../src/ui/switch';
import { TextField } from '../../../src/ui/text-field';
import { FieldFamilyGuide, ControlUsageGuide } from './FieldFamilyGuide';
import { Playground } from './Playground';
import { SpecimenMatrix } from './SpecimenMatrix';
import { Code, LastEdited, LinkList, Markdown, NotYetWritten, PageTitle, SectionHeading, Table, tagStyle } from './shared';
import { componentDate } from '../dates';

type PropContract = { optional: boolean; union: string[] | null };
type Surface = { version: string; surface: { variants: Record<string, string[]>; props: Record<string, PropContract>; native: string[] } };

export function ComponentPage({ id }: { id?: string }) {
  if (!id) {
    return (
      <div>
        <PageTitle eyebrow="Components" title="Components" summary="Small, reused elements that carry state and change often. One page each." />
        <ul style={{ columns: 3, padding: 0, listStyle: 'none', gap: 24 }}>
          {primitives.map((p) => (
            <li key={p.id} style={{ breakInside: 'avoid', padding: '2px 0' }}>
              <a href={hrefFor('components', p.id)}>{displayTitle(p.id)}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const primitive = primitiveById.get(id);
  if (!primitive) {
    return <PageTitle eyebrow="Components" title="Not found" summary={`There is no component named ${id}.`} />;
  }
  const doc = componentDocs[id];
  const sections = doc ? splitSections(doc.body) : {};
  const api = (propsSnapshot as { components: Record<string, Surface> }).components[id];
  const related = (doc?.data.related as string[] | undefined) ?? [];
  const usedInPatterns = patternsUsing(id);
  const usedInTemplates = templatesUsing(id);

  return (
    <div className={["input", "text-field", "textarea", "search-field", "calendar", "form", "label"].includes(id) ? "field-component-document" : undefined}>
      <PageTitle
        eyebrow={categoryLabels[primitive.category] ?? primitive.category}
        title={displayTitle(id)}
        summary={primitive.summary}
        meta={
          <>
            <Code>{id}</Code>
            <span style={tagStyle}>v{primitive.version}</span>
            <LastEdited entry={componentDate(id)} />
          </>
        }
      />

      <SectionHeading id="example">Example</SectionHeading>
      <div data-component-example={id}>
        {id === 'label' ? <LabelExamples/> : id === 'form' ? <FormExamples/> : (id === 'input' || id === 'text-field') ? <><TextField label="Display name"/><FieldCode code={'import { TextField } from "@nodaste-lab/weft";\n\n<TextField label="Display name" />'}/><p>Use TextField for labelled forms. Cutout is its default treatment; underline is a contextual alternative. Input is the bare control for specialized compositions.</p></> : (id === 'textarea' || id === 'search-field') ? null : <DesignSystemUiGallery ids={[id]} showCategoryLinks={false} showTemplates={false} />}
      </div>
      {id === 'calendar' && <FieldCode code={'import * as React from "react";\nimport { Calendar } from "@nodaste-lab/weft";\n\nfunction CalendarExample() {\n  const [date, setDate] = React.useState<Date | undefined>(() => new Date(2026, 2, 15));\n  return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} className="rounded-md border" />;\n}'}/>}
      {['combobox','multi-select'].includes(id) && <FieldCode code={`import * as React from 'react';
import { ${id === 'combobox' ? 'Combobox' : 'MultiSelect'} } from '@nodaste-lab/weft';

const options = [{value:'studio',label:'Studio'}, {value:'research',label:'Research'}, {value:'archive',label:'Archive',disabled:true}];
function Example() {
  const [value,setValue] = React.useState<${id === 'combobox' ? 'string | null' : 'string[]'}>(${id === 'combobox' ? 'null' : '[]'});
  return <${id === 'combobox' ? 'Combobox' : 'MultiSelect'} label="${id === 'combobox' ? 'Space' : 'Spaces'}" options={options} value={value} onValueChange={setValue} />;
}`}/>}

      {id === 'file-header' && <FieldCode code={fileHeaderExampleSource}/> }

      {['input', 'text-field', 'textarea', 'search-field', 'calendar'].includes(id) && <FieldFamilyGuide kind={id} />}

      {['combobox','multi-select'].includes(id) && <SelectionLoadingExample multiple={id === 'multi-select'}/>}
      <SectionHeading id="variants-and-states">Variants and states</SectionHeading>
      {['input', 'text-field', 'textarea', 'search-field', 'calendar'].includes(id) && <FieldExamples kind={id} />}
      {id === 'form' && <><h3>Custom field status playground</h3><FormStatusRecipe/></>}
      {(id === 'input' || id === 'text-field' || id === 'search-field') && <FieldActionExamples />}
      {(id === 'input' || id === 'textarea' || id === 'text-field') ? <>
        <h3>TextField playground</h3>
        <p>These properties belong to the labelled form field, including its default cutout treatment.</p>
        <Playground key={id} id="text-field" defaults={id === 'textarea' ? {multiline:true,label:'Description'} : undefined}/>
        <ControlUsageGuide multiline={id === 'textarea'}/>
        <Playground id={id === 'textarea' ? 'textarea' : 'input'}/>
      </> : <Playground id={id} />}
      {['input','text-field','textarea','search-field','calendar','form','combobox','multi-select','file-header'].includes(id) ? <section aria-label="Control variants and states">
        <h3>Control variants and states</h3>
        <SpecimenMatrix id={id}/>
      </section> : <Collapsible style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="outline" size="sm" style={{ justifySelf: 'start' }}>Control variants and states</Button>
        </CollapsibleTrigger>
        <CollapsibleContent><SpecimenMatrix id={id}/></CollapsibleContent>
      </Collapsible>}


      {COMPONENT_DOC_SECTIONS.map((heading) => (
        <React.Fragment key={heading}>
          <SectionHeading id={heading.toLowerCase().replace(/\s+/g, '-')}>{heading}</SectionHeading>
          {isWritten(sections[heading]) ? <Markdown markdown={sections[heading]} /> : <NotYetWritten what={`${id}:${heading}`} />}
        </React.Fragment>
      ))}

      <SectionHeading id="api">API</SectionHeading>
      {api ? <ApiTables api={api} /> : <NotYetWritten what={`${id}:api`} />}

      <SectionHeading id="related">Related</SectionHeading>
      <div style={{ display: 'grid', gap: 14 }}>
        <LinkList label="Related components" section="components" ids={related} labelFor={displayTitle} />
        <LinkList label="Used in patterns" section="patterns" ids={usedInPatterns.map((p) => p.id)} labelFor={(pid) => usedInPatterns.find((p) => p.id === pid)?.title ?? pid} />
        <LinkList label="Used in templates" section="templates" ids={usedInTemplates.map((t) => t.id)} labelFor={displayTitle} />
        {!related.length && !usedInPatterns.length && !usedInTemplates.length ? (
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 13 }}>Nothing links here yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function ApiTables({ api }: { api: Surface }) {
  const variants = Object.entries(api.surface.variants);
  const props = Object.entries(api.surface.props);
  const native = api.surface.native;
  if (!variants.length && !props.length && !native.length) {
    return <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 13 }}>No declared variants or props beyond the native element.</p>;
  }
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {variants.length ? (
        <Table head={['Variant', 'Values']} rows={variants.map(([name, values]) => [<Code key="n">{name}</Code>, values.map((v) => <Code key={v}>{v}</Code>)])} />
      ) : null}
      {props.length ? (
        <Table
          head={['Prop', 'Required', 'Values']}
          rows={props.map(([name, contract]) => [
            <Code key="n">{name}</Code>,
            <span key="r" style={{ fontSize: 12 }}>{contract.optional ? 'optional' : 'required'}</span>,
            contract.union && contract.union.length ? (
              contract.union.map((v) => <Code key={v}>{v}</Code>)
            ) : (
              <span key="v" style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>not enumerable</span>
            ),
          ])}
        />
      ) : null}
      {native.length ? (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>
          Native element props: {native.map((n) => <Code key={n}>{n}</Code>)}
        </p>
      ) : null}
    </div>
  );
}

function LabelExamples() {
 const checkboxId=React.useId();
 const switchId=React.useId();
 return <section aria-label="Label examples" style={{display:'grid',gap:20}}>
   <p>Label names an individual control and connects its text to that control. Use it beside checkboxes and switches, or in custom compositions. TextField already includes its label; do not add another one.</p>
   <div style={{display:'flex',alignItems:'center',gap:12,minHeight:44}}><Checkbox id={checkboxId}/><Label htmlFor={checkboxId}>Email notifications</Label></div>
   <FieldCode code={`import { Checkbox, Label } from '@nodaste-lab/weft';\n\n<Checkbox id="notifications" />\n<Label htmlFor="notifications">Email notifications</Label>`}/>
   <div style={{display:'flex',alignItems:'center',gap:12,minHeight:44}}><Switch id={switchId}/><Label htmlFor={switchId}>Weekly summary</Label></div>
   <FieldCode code={`import { Switch, Label } from '@nodaste-lab/weft';\n\n<Switch id="summary" />\n<Label htmlFor="summary">Weekly summary</Label>`}/>
   <p>Use FormLabel inside a custom FormItem composition. Use fieldset and legend to name a group. Labels are associated control names, not headings or helper text.</p>
 </section>;
}
