// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { KnowledgeSearchResultRow } from './knowledge-search-result-row';

const SAMPLE = {
  id: '1',
  title: 'Launch Brief',
  path: 'reference/launch-brief.md',
  excerpt: 'A concise brief for the release operator…',
  relevance: 88,
  categories: ['reference'],
};

figma.connect(
  KnowledgeSearchResultRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=knowledge-search-result-row',
  {
    props: {
      browseMode: figma.boolean('Browse mode'),
    },
    example: ({ browseMode }) => (
      <KnowledgeSearchResultRow
        result={SAMPLE}
        obsidianHref="#"
        isBrowseMode={browseMode}
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    ),
  },
);
