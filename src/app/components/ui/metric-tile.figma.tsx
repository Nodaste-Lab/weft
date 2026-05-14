// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { MetricTile } from './metric-tile';

figma.connect(
  MetricTile,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=metric-tile',
  {
    props: {
      label: figma.string('Label'),
      value: figma.string('Value'),
      hint: figma.string('Hint'),
      valueTone: figma.enum('Value tone', {
        default: 'default',
        danger: 'danger',
        warning: 'warning',
        positive: 'positive',
        muted: 'muted',
        info: 'info',
      }),
      density: figma.enum('Density', { default: 'default', compact: 'compact', relaxed: 'relaxed' }),
    },
    example: ({ label, value, hint, valueTone, density }) => (
      <MetricTile label={label} value={value} hint={hint} valueTone={valueTone} density={density} />
    ),
  },
);
