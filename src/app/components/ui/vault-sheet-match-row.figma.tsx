// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { VaultSheetMatchRow } from './vault-sheet-match-row';

figma.connect(
  VaultSheetMatchRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=vault-sheet-match-row',
  {
    props: {
      characterName: figma.string('Character name'),
      confidence: figma.enum('Confidence', {
        exact: 'exact',
        partial: 'partial',
        none: 'none',
      }),
      filePath: figma.string('File path'),
      hp: figma.number('HP'),
      ac: figma.number('AC'),
      addLabel: figma.string('Add label'),
    },
    example: ({ characterName, confidence, filePath, hp, ac, addLabel }) => (
      <VaultSheetMatchRow
        match={{
          characterName,
          confidence,
          filePath,
          parsedData: { hp, ac },
        }}
        onAdd={() => undefined}
        addLabel={addLabel}
      />
    ),
  },
);
