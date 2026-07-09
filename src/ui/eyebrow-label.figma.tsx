// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { EyebrowLabel } from './eyebrow-label';

figma.connect(
  EyebrowLabel,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=86-24',
  {
    props: {
      children: figma.string('Label'),
      size: figma.enum('Size', { sm: 'sm', default: 'default', lg: 'lg' }),
      tone: figma.enum('Tone', { muted: 'muted', default: 'default', accent: 'accent' }),
    },
    example: ({ children, size, tone }) => (
      <EyebrowLabel size={size} tone={tone}>
        {children}
      </EyebrowLabel>
    ),
  },
);
