import * as React from 'react';
import { Info } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { Button } from '../../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/**
 * Every overlay here portals its content to document.body, so a cell can only
 * show the closed trigger: an open instance would float over the whole site
 * (and, for the modal ones, lock scroll). The open composition is written out
 * in each "Open" state's code reference instead; the cell stays interactive,
 * so activating the trigger shows the real thing.
 */
const PORTAL_NOTE = 'Content portals to document.body, so the cell shows the closed trigger; activate it to open.';

/** Specimens for the overlay category. One entry per component id; see ../specimen-types.ts. */
export const overlaySpecimens: Record<string, Specimen> = {
  'alert-dialog': {
    component: 'AlertDialog',
    module: 'alert-dialog',
    base: { trigger: 'Discard draft' },
    states: [
      { label: 'Closed', props: {}, code: '<AlertDialog><AlertDialogTrigger asChild><Button variant="outline">Discard draft</Button></AlertDialogTrigger>…</AlertDialog>' },
      {
        label: 'Open',
        props: {},
        code: '<AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Discard draft?</AlertDialogTitle><AlertDialogDescription>…</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep editing</AlertDialogCancel><AlertDialogAction>Discard</AlertDialogAction></AlertDialogFooter></AlertDialogContent>',
        note: `Blocks until Cancel or Action is chosen; Escape cancels. ${PORTAL_NOTE}`,
      },
    ],
    render: ({ trigger, ...p }: P) => (
      <AlertDialog {...(p as React.ComponentProps<typeof AlertDialog>)}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">{trigger as React.ReactNode}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard draft?</AlertDialogTitle>
            <AlertDialogDescription>Unsaved edits are lost. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  dialog: {
    component: 'Dialog',
    module: 'dialog',
    base: { trigger: 'Rename' },
    states: [
      { label: 'Closed', props: {}, code: '<Dialog><DialogTrigger asChild><Button variant="outline">Rename</Button></DialogTrigger>…</Dialog>' },
      {
        label: 'Open',
        props: {},
        code: '<DialogContent><DialogHeader><DialogTitle>Rename item</DialogTitle><DialogDescription>…</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose><Button>Save</Button></DialogFooter></DialogContent>',
        note: `DialogContent adds its own Close control; Escape and the overlay also close. ${PORTAL_NOTE}`,
      },
    ],
    render: ({ trigger, ...p }: P) => (
      <Dialog {...(p as React.ComponentProps<typeof Dialog>)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">{trigger as React.ReactNode}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename item</DialogTitle>
            <DialogDescription>The new name shows everywhere the item is listed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  'hover-card': {
    component: 'HoverCard',
    module: 'hover-card',
    base: { trigger: 'Launch brief' },
    states: [
      { label: 'Closed', props: {}, code: '<HoverCard><HoverCardTrigger asChild><Button variant="link">Launch brief</Button></HoverCardTrigger>…</HoverCard>' },
      {
        label: 'Open',
        props: {},
        code: '<HoverCardContent><p>Launch brief</p><p>Document · updated today</p></HoverCardContent>',
        note: `Opens on hover and on keyboard focus of the trigger; the content is a preview, not a place for controls. ${PORTAL_NOTE}`,
      },
    ],
    render: ({ trigger, ...p }: P) => (
      <HoverCard {...(p as React.ComponentProps<typeof HoverCard>)}>
        <HoverCardTrigger asChild>
          <Button variant="link" className="h-auto p-0">{trigger as React.ReactNode}</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-56 text-xs">
          <p className="font-medium">{trigger as React.ReactNode}</p>
          <p className="text-muted-foreground mt-1">Document · updated today</p>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  popover: {
    component: 'Popover',
    module: 'popover',
    base: { trigger: 'Filters' },
    states: [
      { label: 'Closed', props: {}, code: '<Popover><PopoverTrigger asChild><Button variant="outline">Filters</Button></PopoverTrigger>…</Popover>' },
      {
        label: 'Open',
        props: {},
        code: '<PopoverContent align="start"><p>Filters</p><p>…</p></PopoverContent>',
        note: `Anchored to the trigger; focus moves in on open and returns on Escape or outside click. ${PORTAL_NOTE}`,
      },
    ],
    render: ({ trigger, ...p }: P) => (
      <Popover {...(p as React.ComponentProps<typeof Popover>)}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">{trigger as React.ReactNode}</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 text-xs">
          <p className="font-medium">{trigger as React.ReactNode}</p>
          <p className="text-muted-foreground mt-1">Narrow the list without leaving the page.</p>
        </PopoverContent>
      </Popover>
    ),
  },
  sheet: {
    component: 'Sheet',
    module: 'sheet',
    base: { trigger: 'Open panel', side: 'right' },
    states: [
      { label: 'Closed', props: {}, code: '<Sheet><SheetTrigger asChild><Button variant="outline">Open panel</Button></SheetTrigger>…</Sheet>' },
      {
        label: 'Open, right',
        props: { side: 'right' },
        code: '<SheetContent side="right"><SheetHeader><SheetTitle>Panel</SheetTitle><SheetDescription>…</SheetDescription></SheetHeader></SheetContent>',
        note: `Slides in from the right edge (the default). ${PORTAL_NOTE}`,
      },
      { label: 'Open, left', props: { side: 'left' }, code: '<SheetContent side="left">', note: 'Same shell from the left edge; top and bottom take the full width instead.' },
    ],
    render: ({ trigger, side, ...p }: P) => (
      <Sheet {...(p as React.ComponentProps<typeof Sheet>)}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">{trigger as React.ReactNode}</Button>
        </SheetTrigger>
        <SheetContent side={side as React.ComponentProps<typeof SheetContent>['side']}>
          <SheetHeader>
            <SheetTitle>Panel</SheetTitle>
            <SheetDescription>Secondary workflow beside the page, not over it.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ),
  },
  tooltip: {
    component: 'Tooltip',
    module: 'tooltip',
    base: { 'aria-label': 'About this field', content: 'Applies to this workspace only.' },
    states: [
      { label: 'Closed', props: {}, code: '<Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="About this field"><Info aria-hidden /></Button></TooltipTrigger>…</Tooltip>', note: 'The trigger keeps its own accessible name; the tooltip adds context, it is not the label.' },
      {
        label: 'Open',
        props: {},
        code: '<TooltipContent>Applies to this workspace only.</TooltipContent>',
        note: `Shows on hover and on focus, with the arrow pointing at the trigger. ${PORTAL_NOTE}`,
      },
    ],
    render: ({ content, 'aria-label': ariaLabel, ...p }: P) => (
      <Tooltip {...(p as React.ComponentProps<typeof Tooltip>)}>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label={ariaLabel as string}>
            <Info aria-hidden="true" focusable="false" />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{content as React.ReactNode}</TooltipContent>
      </Tooltip>
    ),
  },
};
