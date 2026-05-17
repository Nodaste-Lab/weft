// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { ModeOnlyToggle } from './mode-only-toggle';

figma.connect(
  ModeOnlyToggle,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=mode-only-toggle',
  {
    props: {
      active: figma.boolean('Active'),
    },
    example: ({ active }) => (
      <ModeOnlyToggle active={active} label="Use only in TTRPG mode" onToggle={() => {}} />
    ),
  },
);
