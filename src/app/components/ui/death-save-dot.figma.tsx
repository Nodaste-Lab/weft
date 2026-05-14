// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { DeathSaveDot } from './death-save-dot';

figma.connect(
  DeathSaveDot,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=death-save-dot',
  {
    props: {
      kind: figma.enum('Kind', { success: 'success', fail: 'fail' }),
      filled: figma.boolean('Filled'),
    },
    example: ({ kind, filled }) => <DeathSaveDot kind={kind} filled={filled} />,
  },
);
