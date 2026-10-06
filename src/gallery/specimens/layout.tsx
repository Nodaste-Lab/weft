import * as React from 'react';
import { FileText, Plus } from 'lucide-react';
import { SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from '../../ui/sidebar';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const ICON = <Plus aria-hidden="true" focusable="false" />;

/** Specimens for the layout category. One entry per component id; see ../specimen-types.ts. */
export const layoutSpecimens: Record<string, Specimen> = {
  sidebar: {
    component: 'SidebarMenuButton',
    module: 'sidebar',
    axes: ['variant', 'size'],
    base: { children: 'Documents' },
    states: [
      { label: 'Active', props: { isActive: true }, code: '<SidebarMenuButton isActive>', note: 'The current route. Pair with aria-current="page" on the link.' },
      { label: 'With action', props: { action: true }, code: '<SidebarMenuItem><SidebarMenuButton /><SidebarMenuAction showOnHover aria-label="…" /></SidebarMenuItem>', note: 'Revealed on hover and on focus-within.' },
      { label: 'With count', props: { badge: 3 }, code: '<SidebarMenuItem><SidebarMenuButton /><SidebarMenuBadge>3</SidebarMenuBadge></SidebarMenuItem>' },
      { label: 'Nested row', props: { sub: true }, code: '<SidebarMenuSub><SidebarMenuSubItem><SidebarMenuSubButton /></SidebarMenuSubItem></SidebarMenuSub>' },
      { label: 'Nested row, active', props: { sub: true, isActive: true }, code: '<SidebarMenuSubButton isActive>' },
    ],
    render: ({ children, action, badge, sub, ...p }: P) => (
      <SidebarProvider defaultOpen className="min-h-0 w-[220px]">
        <SidebarMenu className="w-[220px]">
          {sub ? (
            <SidebarMenuItem>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton isActive={Boolean(p.isActive)}>
                    <FileText aria-hidden="true" focusable="false" />
                    <span>{children as React.ReactNode}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton {...(p as React.ComponentProps<typeof SidebarMenuButton>)}>
                <FileText aria-hidden="true" focusable="false" />
                <span>{children as React.ReactNode}</span>
              </SidebarMenuButton>
              {action ? (
                <SidebarMenuAction showOnHover aria-label={`Actions for ${String(children)}`}>
                  {ICON}
                </SidebarMenuAction>
              ) : null}
              {typeof badge === 'number' ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarProvider>
    ),
  },
};
