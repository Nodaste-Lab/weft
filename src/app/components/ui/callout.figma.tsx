// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { Callout } from './callout';

figma.connect(
  Callout,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=callout',
  {
    props: {
      title: figma.string('Title'),
      children: figma.string('Body'),
      tone: figma.enum('Tone', {
        info: 'info',
        warning: 'warning',
        danger: 'danger',
        positive: 'positive',
        muted: 'muted',
      }),
      density: figma.enum('Density', { default: 'default', compact: 'compact' }),
    },
    example: ({ title, children, tone, density }) => (
      <Callout tone={tone} density={density} title={title}>
        {children}
      </Callout>
    ),
  },
);
