import * as React from 'react';
import { HudMetaCaption } from '../../ui/hud-meta-caption';
import { TextContent } from '../../ui/text-content';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the typography category. One entry per component id; see ../specimen-types.ts. */
export const typographySpecimens: Record<string, Specimen> = {
  'text-content': {
    component: 'TextContent',
    module: 'text-content',
    base: { children: 'The export runs in the background and emails you when it is done.' },
    render: ({ children, ...p }: P) => <TextContent {...(p as React.ComponentProps<typeof TextContent>)}>{children as React.ReactNode}</TextContent>,
  },
  'hud-meta-caption': {
    component: 'HudMetaCaption',
    module: 'hud-meta-caption',
    base: { children: '2h ago' },
    states: [
      { label: 'Timestamp', props: { children: '2h ago' }, code: '<HudMetaCaption>2h ago</HudMetaCaption>' },
      { label: 'Count', props: { children: '12 items' }, code: '<HudMetaCaption>12 items</HudMetaCaption>' },
      { label: 'Beside a label', props: { children: 'Editing', beside: 'Session notes' }, code: '<span>Session notes</span><HudMetaCaption>Editing</HudMetaCaption>', note: 'Secondary meta trails the primary text in a row; it never stands in for it.' },
    ],
    render: ({ children, beside, ...p }: P) =>
      beside ? (
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--text-sm)] text-[var(--hud-text-1)]">{beside as React.ReactNode}</span>
          <HudMetaCaption {...(p as React.ComponentProps<typeof HudMetaCaption>)}>{children as React.ReactNode}</HudMetaCaption>
        </div>
      ) : (
        <HudMetaCaption {...(p as React.ComponentProps<typeof HudMetaCaption>)}>{children as React.ReactNode}</HudMetaCaption>
      ),
  },
};
