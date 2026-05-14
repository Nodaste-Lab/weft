// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { HpBarTrack } from './hp-bar-track';

figma.connect(
  HpBarTrack,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=hp-bar-track',
  {
    props: {
      hp: figma.number('Current HP'),
      maxHp: figma.number('Max HP'),
      tempHp: figma.number('Temp HP'),
      tone: figma.enum('Tone', {
        auto: 'auto',
        positive: 'positive',
        warning: 'warning',
        danger: 'danger',
        muted: 'muted',
      }),
      variant: figma.enum('Variant', { rail: 'rail', track: 'track', thick: 'thick' }),
      showReadout: figma.boolean('Show readout'),
    },
    example: ({ hp, maxHp, tempHp, tone, variant, showReadout }) => (
      <HpBarTrack
        hp={hp}
        maxHp={maxHp}
        tempHp={tempHp}
        tone={tone}
        variant={variant}
        showReadout={showReadout}
      />
    ),
  },
);
