import React from 'react';
import propsSnapshot from '../../../props-snapshot.json';
import { DesignSystemUiGallery } from '../../../src/gallery/DesignSystemUiGallery';
import { COMPONENT_DOC_SECTIONS, componentDocs, isWritten, splitSections } from '../content';
import { categoryLabels, displayTitle, patternsUsing, primitiveById, primitives, templatesUsing } from '../nav';
import { hrefFor } from '../routes';
import { Code, LinkList, Markdown, NotYetWritten, PageTitle, SectionHeading, Table, tagStyle } from './shared';

type Surface = { version: string; surface: { variants: Record<string, string[]>; props: Record<string, string>; native: string[] } };

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
    <div>
      <PageTitle
        eyebrow={categoryLabels[primitive.category] ?? primitive.category}
        title={displayTitle(id)}
        summary={primitive.summary}
        meta={
          <>
            <Code>{id}</Code>
            <span style={tagStyle}>v{primitive.version}</span>
          </>
        }
      />

      <SectionHeading id="example">Example</SectionHeading>
      <div data-component-example={id}>
        <DesignSystemUiGallery ids={[id]} showCategoryLinks={false} showTemplates={false} />
      </div>

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
        <Table head={['Prop', 'Type']} rows={props.map(([name, type]) => [<Code key="n">{name}</Code>, <span key="t" style={{ fontFamily: 'var(--weft-font-mono)', fontSize: 12 }}>{String(type)}</span>])} />
      ) : null}
      {native.length ? (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>
          Native element props: {native.map((n) => <Code key={n}>{n}</Code>)}
        </p>
      ) : null}
    </div>
  );
}
