import React from 'react';
import { brandDocs, guidelineDocs } from '../content';
import { hrefFor } from '../routes';
import { Markdown, PageTitle } from './shared';

export function GuidelinesPage({ id }: { id?: string }) {
  if (!id) {
    return (
      <div>
        <PageTitle eyebrow="Guidelines" title="Guidelines" summary="Brand, colour and type, accessibility, voice and copy." />
        <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
          {guidelineDocs.map((d) => {
            const slug = d.file.split('/').pop()!.replace(/\.md$/, '');
            return (
              <li key={slug}>
                <a href={hrefFor('guidelines', slug)}>{d.title}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  const doc = brandDocs[id];
  if (!doc) {
    return <PageTitle eyebrow="Guidelines" title="Not found" summary={`There is no guideline document named ${id}.`} />;
  }
  const body = doc.body.replace(/^#\s+.+\n/, '');
  return (
    <div>
      <PageTitle eyebrow="Guidelines" title={doc.title} />
      <Markdown markdown={body} />
    </div>
  );
}
