// @ts-nocheck
import figma from '@figma/code-connect';
import { Sparkles } from 'lucide-react';
import { EmptyState } from './empty-state';

figma.connect(
  EmptyState,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=92-14',
  {
    props: {
      title: figma.string('Title'),
      description: figma.string('Description'),
      tone: figma.enum('Tone', { default: 'default', warning: 'warning' }),
    },
    example: ({ title, description, tone }) => (
      <EmptyState
        icon={<Sparkles />}
        title={title}
        description={description}
        tone={tone}
      />
    ),
  },
);
