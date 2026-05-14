// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { CombatantTypeDot } from './combatant-type-dot';

figma.connect(
  CombatantTypeDot,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=combatant-type-dot',
  {
    props: {
      type: figma.enum('Type', {
        enemy: 'enemy',
        ally: 'ally',
        player: 'player',
      }),
      size: figma.enum('Size', { xs: 'xs', sm: 'sm' }),
      pulsing: figma.boolean('Pulsing'),
    },
    example: ({ type, size, pulsing }) => (
      <CombatantTypeDot type={type} size={size} pulsing={pulsing} />
    ),
  },
);
