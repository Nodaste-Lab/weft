// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { TranscriptListItemFrame } from './transcript-list-item-frame';

figma.connect(
  TranscriptListItemFrame,
  'https://www.figma.com/design/q58dgHZAnhampton7wlnjXpgcT/Weft-Design-System?node-id=transcript-list-item-frame',
  {
    example: () => (
      <TranscriptListItemFrame
        header={<div className="text-xs">Speaker · 00:12</div>}
        body={<p className="text-sm">Line text</p>}
      />
    ),
  },
);
