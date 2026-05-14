// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { BattleCombatantSummaryRow } from './battle-combatant-summary-row';

figma.connect(
  BattleCombatantSummaryRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=battle-combatant-summary-row',
  {
    props: {
      isActive: figma.boolean('Active turn'),
      isOnDeck: figma.boolean('On deck'),
      isDead: figma.boolean('Dead'),
    },
    example: ({ isActive, isOnDeck, isDead }) => (
      <BattleCombatantSummaryRow
        initiative={17}
        name="Goblin archer"
        combatantType="enemy"
        isActive={isActive}
        isOnDeck={isOnDeck}
        isDead={isDead}
        ac={15}
        onReorderUp={() => {}}
        onReorderDown={() => {}}
        onRemove={() => {}}
        disableReorderUp={false}
        disableReorderDown={false}
      />
    ),
  },
);
