// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { HudMetaCaption } from './hud-meta-caption';

figma.connect(
  HudMetaCaption,
  'https://www.figma.com/design/q58dgHZAnhampton7wlnjXpgcT/Weft-Design-System?node-id=hud-meta-caption',
  {
    example: () => <HudMetaCaption>2h ago</HudMetaCaption>,
  },
);
