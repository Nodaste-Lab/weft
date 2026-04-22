import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Bold, GripVerticalIcon, Info, Moon, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../app/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../app/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '../app/components/ui/alert';
import { AspectRatio } from '../app/components/ui/aspect-ratio';
import { Avatar, AvatarFallback } from '../app/components/ui/avatar';
import { Badge } from '../app/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../app/components/ui/breadcrumb';
import { Button } from '../app/components/ui/button';
import { Calendar } from '../app/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../app/components/ui/card';
import { Checkbox } from '../app/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../app/components/ui/collapsible';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../app/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../app/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../app/components/ui/form';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../app/components/ui/hover-card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '../app/components/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../app/components/ui/navigation-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../app/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../app/components/ui/popover';
import { Progress } from '../app/components/ui/progress';
import {
  RadioGroup,
  RadioGroupItem,
} from '../app/components/ui/radio-group';
import { ScrollArea } from '../app/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import { Separator } from '../app/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../app/components/ui/sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from '../app/components/ui/sidebar';
import { Skeleton } from '../app/components/ui/skeleton';
import { Slider } from '../app/components/ui/slider';
import { Switch } from '../app/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { Textarea } from '../app/components/ui/textarea';
import { Toggle } from '../app/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '../app/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../app/components/ui/tooltip';
import { HudIssueCallout } from '../app/components/ui/HudIssueCallout';

/** Every `uiPrimitives[].id` from `manifest.json`, in registry order. */
export const SHOWCASED_PRIMITIVE_IDS = [
  'accordion',
  'alert-dialog',
  'alert',
  'aspect-ratio',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'calendar',
  'card',
  'checkbox',
  'collapsible',
  'context-menu',
  'dialog',
  'dropdown-menu',
  'form',
  'hover-card',
  'HudIssueCallout',
  'input',
  'label',
  'menubar',
  'navigation-menu',
  'pagination',
  'popover',
  'progress',
  'radio-group',
  'resizable',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'sidebar',
  'skeleton',
  'slider',
  'switch',
  'table',
  'tabs',
  'textarea',
  'toggle-group',
  'toggle',
  'tooltip',
] as const;

export function DesignSystemUiGallery() {
  const [switchOn, setSwitchOn] = React.useState(true);
  const [toggleOn, setToggleOn] = React.useState(true);
  const [radioValue, setRadioValue] = React.useState('manual');
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
    () => new Date(2026, 2, 15),
  );

  const form = useForm<{ title: string }>({
    defaultValues: { title: 'Brindlewick arc' },
  });

  return (
    <div style={galleryStyle}>
      <PrimitiveCard
        id="accordion"
        title="Accordion"
        summary="Expandable sections with trigger and content primitives."
      >
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="one">
            <AccordionTrigger className="text-sm">Session goals</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-xs">
              Keep scenes tight and spotlight player choices.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger className="text-sm">Safety tools</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-xs">
              Lines, veils, and pause available at any time.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PrimitiveCard>

      <PrimitiveCard
        id="alert-dialog"
        title="Alert Dialog"
        summary="Confirmation surface for blocking or destructive actions."
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              Open alert dialog
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard draft?</AlertDialogTitle>
              <AlertDialogDescription>
                This demonstrates the alert-dialog layout; no data is changed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PrimitiveCard>

      <PrimitiveCard
        id="alert"
        title="Alert"
        summary="Inline callout for status and lightweight messaging."
      >
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Recap queued</AlertTitle>
          <AlertDescription>
            The summary will appear in Session context when generation finishes.
          </AlertDescription>
        </Alert>
      </PrimitiveCard>

      <PrimitiveCard
        id="aspect-ratio"
        title="Aspect Ratio"
        summary="Locks a region to a fixed width-to-height ratio."
      >
        <AspectRatio ratio={16 / 9} className="bg-muted max-w-xs overflow-hidden rounded-md">
          <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
            16:9
          </div>
        </AspectRatio>
      </PrimitiveCard>

      <PrimitiveCard
        id="avatar"
        title="Avatar"
        summary="Image and fallback circle for people or entities."
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="text-xs">PC</AvatarFallback>
          </Avatar>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="badge"
        title="Badge"
        summary="Small emphasis treatment for states, tags, and counts."
      >
        <div style={rowStyle}>
          <Badge>Stable</Badge>
          <Badge variant="secondary">Preview</Badge>
          <Badge variant="outline">
            <Moon size={12} />
            Night mode
          </Badge>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="breadcrumb"
        title="Breadcrumb"
        summary="Hierarchical trail with links, separators, and current page."
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">HUD</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Design</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Primitives</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PrimitiveCard>

      <PrimitiveCard
        id="button"
        title="Button"
        summary="Primary action with variants and icon support."
      >
        <div style={rowStyle}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button size="icon" aria-label="Magic action">
            <Sparkles size={14} />
          </Button>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="calendar"
        title="Calendar"
        summary="Date picker surface built on react-day-picker."
      >
        <Calendar
          mode="single"
          selected={calendarDate}
          onSelect={setCalendarDate}
          defaultMonth={calendarDate}
          className="rounded-md border"
        />
      </PrimitiveCard>

      <PrimitiveCard
        id="card"
        title="Card"
        summary="Card shell with header, content, and footer slots."
      >
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-base">Party note</CardTitle>
            <CardDescription className="text-xs">
              Styling matches raised surfaces in the HUD.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">
            Short body copy goes here.
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary">
              Action
            </Button>
          </CardFooter>
        </Card>
      </PrimitiveCard>

      <PrimitiveCard
        id="checkbox"
        title="Checkbox"
        summary="Boolean control for lists, filters, and confirmation steps."
      >
        <label style={checkRowStyle}>
          <Checkbox defaultChecked />
          <span>Include vault sources</span>
        </label>
      </PrimitiveCard>

      <PrimitiveCard
        id="collapsible"
        title="Collapsible"
        summary="Show or hide content without a full overlay."
      >
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {collapsibleOpen ? 'Hide' : 'Show'} details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-muted-foreground mt-2 max-w-sm text-xs">
              Collapsible content stays in flow and animates open height.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </PrimitiveCard>

      <PrimitiveCard
        id="context-menu"
        title="Context Menu"
        summary="Right-click or long-press menu anchored to a trigger region."
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground w-full max-w-xs rounded-md border border-dashed px-3 py-6 text-xs"
            >
              Right-click here
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </PrimitiveCard>

      <PrimitiveCard
        id="dialog"
        title="Dialog"
        summary="Modal workflow surface for confirmations and settings."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open example dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish recap</DialogTitle>
              <DialogDescription>
                This dialog demonstrates the shared modal treatment used by design-system primitives.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PrimitiveCard>

      <PrimitiveCard
        id="dropdown-menu"
        title="Dropdown Menu"
        summary="Trigger-anchored menu for actions and navigation."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Open menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Recap settings</DropdownMenuItem>
            <DropdownMenuItem>Export log</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PrimitiveCard>

      <PrimitiveCard
        id="form"
        title="Form"
        summary="Field layout wired to react-hook-form controllers."
      >
        <Form {...form}>
          <form
            className="max-w-xs space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Arc title</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Shown in session headers when set.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm">
              Save (demo)
            </Button>
          </form>
        </Form>
      </PrimitiveCard>

      <PrimitiveCard
        id="hover-card"
        title="Hover Card"
        summary="Rich preview on hover or keyboard focus."
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="h-auto p-0 text-xs">
              Hover for character card
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56 text-xs">
            <p className="font-medium">Lyra Ashford</p>
            <p className="text-muted-foreground mt-1">Investigator · Lantern guild</p>
          </HoverCardContent>
        </HoverCard>
      </PrimitiveCard>

      <PrimitiveCard
        id="HudIssueCallout"
        title="HUD Issue Callout"
        summary="Structured failure callout used across HUD panels, rows, and submit flows."
      >
        <div style={{ display: 'grid', gap: 10 }}>
          <HudIssueCallout
            issue={{
              reason: 'fetch_failed',
              source: 'ccore',
              scope: 'panel',
              severity: 'error',
              title: 'Could not load signals',
              detail: 'Sprite HUD reached C-Core but the request failed: HTTP 503 Service Unavailable.',
              nextAction: 'Use Refresh to try again. If the problem persists, check that the backend is running.',
              preservedStateNote: 'Previously loaded signals are still visible; only the latest refresh failed.',
            }}
          />
          <HudIssueCallout
            issue={{
              reason: 'unsupported_feature',
              source: 'ccore',
              scope: 'capability',
              severity: 'info',
              title: 'Agent actions unavailable on this backend',
              detail: 'C-Core does not expose agent actions yet, so Delegate and Draft are not available for signals from this backend.',
              nextAction: 'Switch the panel to a provider that supports agent actions, or hide these actions in panel settings.',
            }}
          />
          <HudIssueCallout
            issue={{
              reason: 'mutation_failed',
              source: 'signal-provider',
              scope: 'row-action',
              severity: 'error',
              title: 'Could not acknowledge this signal',
              detail: 'the mock provider rejected the request: HTTP 500',
              nextAction: 'Wait a moment and try the action again.',
            }}
          />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="input"
        title="Input and Label"
        summary="Single-line fields with labels and tokenized focus states."
      >
        <div style={fieldStackStyle}>
          <Label htmlFor="ds-campaign-name">Campaign name</Label>
          <Input id="ds-campaign-name" defaultValue="The Iron Lantern" />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="label"
        title="Label"
        summary="Accessible caption paired with inputs and custom controls."
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="ds-label-only">Player handle</Label>
          <Input id="ds-label-only" placeholder="e.g. northstar" className="max-w-xs" />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="menubar"
        title="Menubar"
        summary="Persistent top-level menus with nested content."
      >
        <Menubar className="max-w-md">
          <MenubarMenu>
            <MenubarTrigger className="text-xs">File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-xs">New session</MenubarItem>
              <MenubarItem className="text-xs">Open recap</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-xs">View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-xs">Toggle panels</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </PrimitiveCard>

      <PrimitiveCard
        id="navigation-menu"
        title="Navigation Menu"
        summary="Top-level navigation with animated content panels."
      >
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xs">Learn</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-48 gap-1 p-2">
                  <li>
                    <NavigationMenuLink
                      className="block rounded-sm p-2 text-xs"
                      href="#"
                    >
                      Introduction
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block rounded-sm p-2 text-xs"
                      href="#"
                    >
                      Tokens
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </PrimitiveCard>

      <PrimitiveCard
        id="pagination"
        title="Pagination"
        summary="Previous, next, and page links for long lists."
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </PrimitiveCard>

      <PrimitiveCard
        id="popover"
        title="Popover"
        summary="Anchored floating panel for lightweight tasks."
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Open popover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 text-xs">
            <p className="font-medium">Quick note</p>
            <p className="text-muted-foreground mt-1">
              Popovers work well for filters and compact forms.
            </p>
          </PopoverContent>
        </Popover>
      </PrimitiveCard>

      <PrimitiveCard
        id="progress"
        title="Progress"
        summary="Determinate bar for completion or loading."
      >
        <Progress
          value={62}
          aria-label="Import completion"
          className="max-w-xs"
        />
      </PrimitiveCard>

      <PrimitiveCard
        id="radio-group"
        title="Radio Group"
        summary="Single-choice selection for mutually exclusive modes."
      >
        <RadioGroup value={radioValue} onValueChange={setRadioValue}>
          <label style={checkRowStyle}>
            <RadioGroupItem value="manual" id="ds-radio-manual" />
            <span>Manual review</span>
          </label>
          <label style={checkRowStyle}>
            <RadioGroupItem value="auto" id="ds-radio-auto" />
            <span>Auto-publish</span>
          </label>
        </RadioGroup>
      </PrimitiveCard>

      <PrimitiveCard
        id="resizable"
        title="Resizable"
        summary="Drag handles to resize adjacent panels."
      >
        <div className="flex max-w-md overflow-hidden rounded-md border">
          <div className="text-muted-foreground flex h-28 flex-1 items-center justify-center text-xs">
            Left
          </div>
          <div
            aria-hidden="true"
            className="bg-border relative flex w-px items-center justify-center"
          >
            <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
              <GripVerticalIcon className="size-2.5" />
            </div>
          </div>
          <div className="text-muted-foreground flex h-28 flex-1 items-center justify-center text-xs">
            Right
          </div>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="scroll-area"
        title="Scroll Area"
        summary="Scrollable region with styled scrollbars."
      >
        <ScrollArea className="h-24 w-full max-w-xs rounded-md border p-3">
          <p className="text-muted-foreground text-xs leading-relaxed">
            {Array.from({ length: 6 })
              .map(
                () =>
                  'Long session notes scroll inside this container without affecting the page.',
              )
              .join(' ')}
          </p>
        </ScrollArea>
      </PrimitiveCard>

      <PrimitiveCard
        id="select"
        title="Select"
        summary="Composed dropdown with a trigger and portal-backed content."
      >
        <Select defaultValue="week">
          <SelectTrigger aria-label="Recap period" className="max-w-xs">
            <SelectValue placeholder="Choose a period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">This session</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </PrimitiveCard>

      <PrimitiveCard
        id="separator"
        title="Separator"
        summary="Visual divider between sections or toolbar groups."
      >
        <div className="flex max-w-xs flex-col gap-2 text-xs">
          <span className="text-muted-foreground">Above</span>
          <Separator />
          <span className="text-muted-foreground">Below</span>
          <div className="flex h-8 items-stretch gap-2">
            <span className="text-muted-foreground flex items-center">A</span>
            <Separator orientation="vertical" />
            <span className="text-muted-foreground flex items-center">B</span>
          </div>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="sheet"
        title="Sheet"
        summary="Edge-mounted drawer built on dialog primitives."
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Open sheet
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Panel</SheetTitle>
              <SheetDescription>
                Sheets slide in from an edge for secondary workflows.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </PrimitiveCard>

      <PrimitiveCard
        id="sidebar"
        title="Sidebar"
        summary="Layout primitives for a persistent rail and main inset."
      >
        <SidebarProvider defaultOpen className="min-h-[132px]">
          <div className="flex min-h-[132px] w-full overflow-hidden rounded-md border">
            <Sidebar collapsible="none" className="border-sidebar-border w-36 border-r">
              <SidebarHeader>
                <span className="text-sidebar-foreground px-2 text-xs font-medium">Nav</span>
              </SidebarHeader>
              <SidebarContent>
                <p className="text-sidebar-foreground/80 px-2 text-xs">Sessions</p>
              </SidebarContent>
            </Sidebar>
            <div
              data-slot="sidebar-inset-demo"
              className="bg-background relative flex w-full flex-1 flex-col"
            >
              <div className="text-muted-foreground p-3 text-xs">Main column beside the rail.</div>
            </div>
          </div>
        </SidebarProvider>
      </PrimitiveCard>

      <PrimitiveCard
        id="skeleton"
        title="Skeleton"
        summary="Placeholder block while content or data loads."
      >
        <div className="flex max-w-xs flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-16 w-full" />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="slider"
        title="Slider"
        summary="Continuous value control with one or more thumbs."
      >
        <Slider
          defaultValue={[40]}
          max={100}
          step={1}
          thumbLabels={["Volume level"]}
          className="max-w-xs"
        />
      </PrimitiveCard>

      <PrimitiveCard
        id="switch"
        title="Switch"
        summary="Binary preference control with on/off thumb movement."
      >
        <label style={checkRowStyle}>
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
          <span>{switchOn ? 'Whisper mode enabled' : 'Whisper mode disabled'}</span>
        </label>
      </PrimitiveCard>

      <PrimitiveCard
        id="table"
        title="Table"
        summary="Structured rows and cells for tabular data."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Player</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Mara</TableCell>
              <TableCell>Cleric</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Jun</TableCell>
              <TableCell>Rogue</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PrimitiveCard>

      <PrimitiveCard
        id="tabs"
        title="Tabs"
        summary="Horizontal view switching with active state styling."
      >
        <Tabs defaultValue="recap" className="max-w-md">
          <TabsList>
            <TabsTrigger value="recap">Recap</TabsTrigger>
            <TabsTrigger value="prep">Prep</TabsTrigger>
          </TabsList>
          <TabsContent value="recap">
            <p style={metaTextStyle}>Session recap content uses the active tab surface.</p>
          </TabsContent>
          <TabsContent value="prep">
            <p style={metaTextStyle}>Session prep content lives in a sibling tab panel.</p>
          </TabsContent>
        </Tabs>
      </PrimitiveCard>

      <PrimitiveCard
        id="textarea"
        title="Textarea"
        summary="Multi-line content entry for notes, prompts, and drafts."
      >
        <div style={fieldStackStyle}>
          <Label htmlFor="ds-notes">Session notes</Label>
          <Textarea
            id="ds-notes"
            defaultValue="The party entered Brindlewick at dusk and noticed the wind chimes."
            rows={4}
          />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="toggle-group"
        title="Toggle Group"
        summary="Coordinated toggles for single or multi selection."
      >
        <ToggleGroup type="single" defaultValue="b" variant="outline" size="sm">
          <ToggleGroupItem value="a" aria-label="Left">
            A
          </ToggleGroupItem>
          <ToggleGroupItem value="b" aria-label="Center">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="c" aria-label="Right">
            C
          </ToggleGroupItem>
        </ToggleGroup>
      </PrimitiveCard>

      <PrimitiveCard
        id="toggle"
        title="Toggle"
        summary="Pressed-state button for formatting and quick filters."
      >
        <div style={rowStyle}>
          <Toggle pressed={toggleOn} onPressedChange={setToggleOn} variant="outline" aria-label="Bold">
            <Bold size={14} />
          </Toggle>
          <span style={metaTextStyle}>{toggleOn ? 'Formatting on' : 'Formatting off'}</span>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="tooltip"
        title="Tooltip"
        summary="Hover hint for dense interfaces and icon-only actions."
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Info size={14} />
              Hover for guidance
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Tooltips should add context, not duplicate visible labels.
          </TooltipContent>
        </Tooltip>
      </PrimitiveCard>
    </div>
  );
}

function PrimitiveCard({
  id,
  title,
  summary,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`${id}-example`}
      style={{
        border: '1px solid var(--hud-border)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--hud-surface-raised)',
        padding: 16,
        display: 'grid',
        gap: 12,
      }}
    >
      <div style={{ display: 'grid', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={titleStyle}>{title}</span>
          <code style={codeStyle}>{id}</code>
        </div>
        <p style={summaryStyle}>{summary}</p>
      </div>
      <div style={exampleSurfaceStyle}>{children}</div>
    </section>
  );
}

const galleryStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 14,
};

const exampleSurfaceStyle: CSSProperties = {
  background: 'rgba(0,0,0,0.18)',
  border: '1px solid var(--hud-border)',
  borderRadius: 'var(--radius-sm)',
  padding: 14,
  display: 'grid',
  gap: 12,
  minHeight: 112,
  alignContent: 'start',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const fieldStackStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
};

const checkRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: 'var(--hud-text-2)',
  fontSize: 12,
};

const titleStyle: CSSProperties = {
  color: 'var(--hud-text-1)',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
};

const summaryStyle: CSSProperties = {
  margin: 0,
  color: 'var(--hud-text-2)',
  fontSize: 12,
  lineHeight: 1.5,
};

const metaTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--hud-text-2)',
  fontSize: 12,
  lineHeight: 1.5,
};

const codeStyle: CSSProperties = {
  color: 'var(--primary)',
  fontSize: 11,
  fontFamily: 'monospace',
  background: 'rgba(127,86,217,0.12)',
  border: '1px solid var(--hud-border-accent)',
  borderRadius: 'var(--radius-xs)',
  padding: '1px 5px',
};
