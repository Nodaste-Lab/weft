import React from 'react';
import { docForPath, patternDocs } from '../content';
import { displayTitle, patterns } from '../nav';
import { hrefFor } from '../routes';
import { LinkList, Markdown, NotYetWritten, PageTitle, SectionHeading } from './shared';

export function PatternPage({ id }: { id?: string }) {
  if (!id) {
    return (
      <div>
        <PageTitle eyebrow="Patterns" title="Patterns" summary="Guidance for a recurring interaction: which components it uses and the rules for combining them." />
        <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
          {patterns.map((p) => (
            <li key={p.id}>
              <a href={hrefFor('patterns', p.id)}>{p.title}</a>{' '}
              <span style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>{p.summary}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const pattern = patterns.find((p) => p.id === id);
  if (!pattern) return <PageTitle eyebrow="Patterns" title="Not found" summary={`There is no pattern named ${id}.`} />;
  const own = patternDocs[id];
  const register = docForPath(pattern.docs);
  const body = own ? own.body.replace(/^#\s+.+\n/, '') : register ? register.body.replace(/^#\s+.+\n/, '') : undefined;
  return (
    <div>
      <PageTitle eyebrow="Patterns" title={pattern.title} summary={pattern.summary} />
      <LinkList label="Components used" section="components" ids={pattern.uses} labelFor={displayTitle} />
      <SectionHeading id="guidance">Guidance</SectionHeading>
      {body ? <Markdown markdown={body} /> : <NotYetWritten what={`pattern:${id}`} />}
    </div>
  );
}
