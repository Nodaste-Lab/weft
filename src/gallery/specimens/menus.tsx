import * as React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../ui/command';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from '../../ui/context-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { HudPopoverDropdown } from '../../ui/hud-popover-dropdown';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '../../ui/menubar';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;
const noop = () => undefined;
const COPY = <Copy aria-hidden="true" focusable="false" />;
const TRASH = <Trash2 aria-hidden="true" focusable="false" />;

/** Content for the HUD popover, shaped to satisfy the role it is given. */
function PopoverBody({ role }: { role: string }) {
  const rowClass = 'px-2.5 py-1.5 text-left text-xs text-[var(--hud-text-1)]';
  if (role === 'listbox') {
    return (
      <>
        <div role="option" aria-selected="true" className={rowClass}>Recent</div>
        <div role="option" aria-selected="false" className={rowClass}>Starred</div>
      </>
    );
  }
  if (role === 'menu') {
    return (
      <>
        <button type="button" role="menuitem" className={`${rowClass} w-full border-0 bg-transparent`}>Rename</button>
        <button type="button" role="menuitem" className={`${rowClass} w-full border-0 bg-transparent`}>Duplicate</button>
      </>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-2.5 text-xs text-[var(--hud-text-1)]">
      <span>Filter the board by owner.</span>
      <Button size="sm" variant="outline">Apply</Button>
    </div>
  );
}

/** Specimens for the menus category. One entry per component id; see ../specimen-types.ts. */
export const menusSpecimens: Record<string, Specimen> = {
  command: {
    component: 'Command',
    module: 'command',
    base: { placeholder: 'Search panels…', groups: 1 },
    states: [
      { label: 'One group', props: {}, code: '<Command><CommandInput placeholder="…" aria-label="Search panels" /><CommandList><CommandEmpty /><CommandGroup heading="Widgets"><CommandItem value="notes">Notes</CommandItem></CommandGroup></CommandList></Command>' },
      { label: 'Several groups', props: { groups: 2 }, code: '<CommandGroup heading="Widgets">…</CommandGroup><CommandGroup heading="Actions">…</CommandGroup>', note: 'Each group has a heading; the headings separate the groups, so no CommandSeparator is needed between them.' },
      { label: 'No matches', props: { defaultValue: 'zzz' }, code: '<CommandList><CommandEmpty>No panels found.</CommandEmpty>…</CommandList>', note: 'CommandEmpty renders only when the filter leaves nothing.' },
    ],
    render: ({ placeholder, groups, defaultValue, ...p }: P) => (
      <Command {...(p as React.ComponentProps<typeof Command>)} className="w-[280px] border shadow-sm">
        <CommandInput placeholder={placeholder as string} aria-label="Search panels" defaultValue={defaultValue as string | undefined} />
        <CommandList>
          <CommandEmpty>No panels found.</CommandEmpty>
          <CommandGroup heading="Widgets">
            <CommandItem value="signals">Signals</CommandItem>
            <CommandItem value="notes">Notes</CommandItem>
          </CommandGroup>
          {(groups as number) > 1 ? (
            <CommandGroup heading="Actions">
              <CommandItem value="export">Export log</CommandItem>
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    ),
  },
  'dropdown-menu': {
    component: 'DropdownMenu',
    module: 'dropdown-menu',
    axes: [],
    states: [
      { label: 'Closed', props: {}, code: '<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger><DropdownMenuContent>…</DropdownMenuContent></DropdownMenu>', note: 'The trigger is a real button and reads aria-expanded; the content portals to the body when open.' },
      { label: 'Open', props: {}, code: '<DropdownMenu defaultOpen>', note: 'Opens on click, Enter, Space or Arrow down; the first item takes focus and Escape returns it to the trigger.' },
      { label: 'Destructive item', props: {}, code: '<DropdownMenuItem variant="destructive"><Trash2 aria-hidden /> Delete</DropdownMenuItem>', note: 'Reserved for an action that removes something; keep it last, after a separator.' },
      { label: 'Inset item', props: {}, code: '<DropdownMenuItem inset>Rename</DropdownMenuItem>', note: 'Leaves room for an icon column so labels align with iconed siblings.' },
      { label: 'With label and shortcut', props: {}, code: '<DropdownMenuLabel>Session</DropdownMenuLabel><DropdownMenuItem>Export log<DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>' },
    ],
    render: (p: P) => (
      <DropdownMenu {...(p as React.ComponentProps<typeof DropdownMenu>)}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Session</DropdownMenuLabel>
          <DropdownMenuItem>{COPY}Duplicate</DropdownMenuItem>
          <DropdownMenuItem inset>Rename</DropdownMenuItem>
          <DropdownMenuItem>Export log<DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">{TRASH}Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  'context-menu': {
    component: 'ContextMenu',
    module: 'context-menu',
    axes: [],
    states: [
      { label: 'Closed', props: {}, code: '<ContextMenu><ContextMenuTrigger>Right-click here</ContextMenuTrigger><ContextMenuContent>…</ContextMenuContent></ContextMenu>', note: 'Opens on right-click or the context-menu key at the pointer; the content portals to the body.' },
      { label: 'Destructive item', props: {}, code: '<ContextMenuItem variant="destructive"><Trash2 aria-hidden /> Delete</ContextMenuItem>', note: 'Keep it last, after a separator.' },
      { label: 'Inset item', props: {}, code: '<ContextMenuItem inset>Rename</ContextMenuItem>' },
      { label: 'With shortcut', props: {}, code: '<ContextMenuItem>Copy<ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>', note: 'Every action in a context menu should also be reachable without the menu.' },
    ],
    render: (p: P) => (
      <ContextMenu {...(p as React.ComponentProps<typeof ContextMenu>)}>
        <ContextMenuTrigger className="flex w-[220px] items-center justify-center rounded-md border border-dashed px-3 py-6 text-xs text-muted-foreground">
          Right-click here
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>{COPY}Copy<ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem inset>Rename</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">{TRASH}Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
  menubar: {
    component: 'Menubar',
    module: 'menubar',
    axes: [],
    states: [
      { label: 'Closed', props: {}, code: '<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent>…</MenubarContent></MenubarMenu></Menubar>', note: 'Arrow keys move between triggers; a menu opens on click, Enter or Arrow down and its content portals to the body.' },
      { label: 'Destructive item', props: {}, code: '<MenubarItem variant="destructive">Delete session</MenubarItem>', note: 'Keep it last, after a separator.' },
      { label: 'Inset item', props: {}, code: '<MenubarItem inset>Rename</MenubarItem>' },
      { label: 'With shortcut', props: {}, code: '<MenubarItem>New session<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>' },
    ],
    render: (p: P) => (
      <Menubar {...(p as React.ComponentProps<typeof Menubar>)}>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New session<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
            <MenubarItem inset>Rename</MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">{TRASH}Delete session</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Toggle panels</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
  },
  'hud-popover-dropdown': {
    component: 'HudPopoverDropdown',
    module: 'hud-popover-dropdown',
    axes: ['align', 'width', 'contentRole'],
    axisBase: { align: { open: true }, width: { open: true }, contentRole: { open: true } },
    base: { open: false, onOpenChange: noop, contentAriaLabel: 'Board options', contentClassName: 'min-w-[150px]' },
    states: [
      { label: 'Closed', props: {}, code: '<HudPopoverDropdown open={false} onOpenChange={setOpen} trigger={<button aria-expanded={false}>Options</button>}>…</HudPopoverDropdown>', note: 'The trigger is supplied by the consumer and carries aria-expanded itself.' },
      { label: 'Open', props: { open: true }, code: '<HudPopoverDropdown open onOpenChange={setOpen} trigger={…}>', note: 'Renders inline below the trigger; a click outside or Escape calls onOpenChange(false).' },
      { label: 'Open, aligned end', props: { open: true, align: 'end' }, code: '<HudPopoverDropdown open align="end">' },
      { label: 'Open, trigger width', props: { open: true, width: 'trigger' }, code: '<HudPopoverDropdown open width="trigger">', note: 'The content stretches to the trigger wrapper; size the wrapper with className.' },
    ],
    render: ({ open, contentRole, ...p }: P) => (
      <div style={{ width: 200, minHeight: open ? 120 : undefined }}>
        <HudPopoverDropdown
          {...(p as unknown as React.ComponentProps<typeof HudPopoverDropdown>)}
          open={Boolean(open)}
          contentRole={contentRole as React.ComponentProps<typeof HudPopoverDropdown>['contentRole']}
          className="w-full"
          trigger={
            <Button variant="outline" size="sm" aria-expanded={Boolean(open)}>
              Options
            </Button>
          }
        >
          <PopoverBody role={(contentRole as string | undefined) ?? 'dialog'} />
        </HudPopoverDropdown>
      </div>
    ),
  },
};
