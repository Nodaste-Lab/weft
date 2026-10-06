import React from 'react';
import { TemplateExample } from '../../../src/gallery/DesignSystemUiGallery';
import { docForPath, sectionFor } from '../content';
import { displayTitle, templates } from '../nav';
import { hrefFor } from '../routes';
import { Code, Frame, LinkList, Markdown, NotYetWritten, PageTitle, SectionHeading, tagStyle } from './shared';

export function TemplatePage({ id }: { id?: string }) {
  if (!id) {
    return (
      <div>
        <PageTitle eyebrow="Templates" title="Templates" summary="A surface ready to apply in a product, with enough documentation for a person or an agent to wire it to real infrastructure." />
        <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
          {templates.map((t) => (
            <li key={t.id}>
              <a href={hrefFor('templates', t.id)}>{displayTitle(t.id)}</a>{' '}
              <span style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>{t.summary}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const template = templates.find((t) => t.id === id);
  if (!template) return <PageTitle eyebrow="Templates" title="Not found" summary={`There is no template named ${id}.`} />;
  const register = docForPath(template.docs);
  const entry = sectionFor(register, id);
  const entryBody = entry ? entry.split('\n').slice(1).join('\n').trim() : undefined;
  const kind = template.kind ?? 'css';
  return (
    <div>
      <PageTitle
        eyebrow="Templates"
        title={displayTitle(id)}
        summary={template.summary}
        meta={
          <>
            <Code>{id}</Code>
            <span style={tagStyle}>{kind}</span>
            <span style={tagStyle}>v{template.version}</span>
          </>
        }
      />
      {kind === 'react' ? (
        <>
          <SectionHeading id="example">Example</SectionHeading>
          <Frame>
            <TemplateExample id={id} />
          </Frame>
        </>
      ) : null}
      <SectionHeading id="components-used">Components used</SectionHeading>
      {template.composes?.length ? (
        <LinkList label="Components used" section="components" ids={template.composes} labelFor={displayTitle} />
      ) : (
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 13 }}>
          A CSS template composes <Code>weft-*</Code> classes rather than React components; see the register entry below for the class map.
        </p>
      )}
      <SectionHeading id="documentation">Documentation</SectionHeading>
      {entryBody ? <Markdown markdown={entryBody} /> : <NotYetWritten what={`template:${id}`} />}
      {register ? (
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--muted-foreground)' }}>
          From <Code>{template.docs}</Code>.
        </p>
      ) : null}
    </div>
  );
}
