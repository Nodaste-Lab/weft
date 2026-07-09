// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { CommandCategoryTag } from './command-category-tag';

figma.connect(
  CommandCategoryTag,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=command-category-tag',
  {
    example: () => <CommandCategoryTag tone="danger">Damage</CommandCategoryTag>,
  },
);
