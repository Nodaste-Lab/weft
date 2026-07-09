// @ts-nocheck
import figma from '@figma/code-connect';
import { AddItemButton } from './add-item-button';

figma.connect(
  AddItemButton,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=90-11',
  {
    props: {
      children: figma.string('Label'),
    },
    example: ({ children }) => <AddItemButton>{children}</AddItemButton>,
  },
);
