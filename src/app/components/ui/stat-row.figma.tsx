// @ts-nocheck
import figma from '@figma/code-connect';
import { StatRow } from './stat-row';

figma.connect(
  StatRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=90-6',
  {
    props: {
      label: figma.string('Label'),
      value: figma.string('Value'),
    },
    example: ({ label, value }) => <StatRow label={label} value={value} />,
  },
);
