// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { LoreSearchResultRow } from './lore-search-result-row';

const SAMPLE = {
  id: '1',
  title: 'Ancient Tomb',
  path: 'lore/places/tomb.md',
  excerpt: 'A buried ruin beneath the salt flats…',
  relevance: 88,
  categories: ['place'],
};

figma.connect(
  LoreSearchResultRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=lore-search-result-row',
  {
    props: {
      browseMode: figma.boolean('Browse mode'),
    },
    example: ({ browseMode }) => (
      <LoreSearchResultRow
        result={SAMPLE}
        obsidianHref="#"
        isBrowseMode={browseMode}
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    ),
  },
);
