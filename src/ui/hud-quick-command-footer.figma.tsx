// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { HudQuickCommandFooter } from './hud-quick-command-footer';

figma.connect(
  HudQuickCommandFooter,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=hud-quick-command-footer',
  {
    example: () => (
      <HudQuickCommandFooter footerBar={<div className="border-t p-2 text-center text-[10px]">Footer actions</div>}>
        <div className="p-2 text-[10px]">Quick command column</div>
      </HudQuickCommandFooter>
    ),
  },
);
