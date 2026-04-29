// @ts-nocheck
import figma from '@figma/code-connect';
import { SourcePill } from './source-pill';

figma.connect(
  SourcePill,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=90-9',
  {
    props: {
      children: figma.string('Path'),
    },
    example: ({ children }) => <SourcePill>{children}</SourcePill>,
  },
);
