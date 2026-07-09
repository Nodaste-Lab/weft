// @ts-nocheck
import figma from '@figma/code-connect';
import { PillToggleGroup, PillToggleGroupItem } from './pill-toggle-group';

// Container — composes a set of items
figma.connect(
  PillToggleGroup,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=91-18',
  {
    example: () => (
      <PillToggleGroup value={value} onValueChange={setValue}>
        <PillToggleGroupItem value="today">This Session</PillToggleGroupItem>
        <PillToggleGroupItem value="week">Last 7 Days</PillToggleGroupItem>
        <PillToggleGroupItem value="month">Last 30 Days</PillToggleGroupItem>
        <PillToggleGroupItem value="quarter">Last 90 Days</PillToggleGroupItem>
        <PillToggleGroupItem value="custom">Custom</PillToggleGroupItem>
      </PillToggleGroup>
    ),
  },
);

// Item — a single pill, used inside <PillToggleGroup>
figma.connect(
  PillToggleGroupItem,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=91-17',
  {
    props: {
      children: figma.string('Label'),
    },
    example: ({ children }) => (
      <PillToggleGroupItem value={children.toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </PillToggleGroupItem>
    ),
  },
);
