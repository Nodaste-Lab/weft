import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, Bold, GripVerticalIcon, Info, Link2, Moon, Sparkles } from 'lucide-react';
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
import { AttentionTicketCard } from '../app/components/ui/attention-ticket-card';
import { Avatar, AvatarFallback } from '../app/components/ui/avatar';
import { Badge } from '../app/components/ui/badge';
import { BattleCombatantSummaryRow } from '../app/components/ui/battle-combatant-summary-row';
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
import { CodeBlock } from '../app/components/ui/code-block';
import { CommandCategoryTag } from '../app/components/ui/command-category-tag';
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
import { PeriodChipRow } from '../app/components/ui/period-chip-row';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../app/components/ui/popover';
import { Progress } from '../app/components/ui/progress';
import { ProviderStatusBadge } from '../app/components/ui/provider-status-badge';
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
import { Stack } from '../app/components/ui/stack';
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
import { TextContent } from '../app/components/ui/text-content';
import { Textarea } from '../app/components/ui/textarea';
import { TranscriptListItemFrame } from '../app/components/ui/transcript-list-item-frame';
import { Toggle } from '../app/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '../app/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../app/components/ui/tooltip';
import { HudIssueCallout } from '../app/components/ui/HudIssueCallout';
import { HudIssueToast } from '../app/components/ui/HudIssueToast';
import { Callout } from '../app/components/ui/callout';
import { HpBarTrack } from '../app/components/ui/hp-bar-track';
import { HudListRow, HudListRowMeta, HudListRowTitle } from '../app/components/ui/hud-list-row';
import { HudMetaCaption } from '../app/components/ui/hud-meta-caption';
import { HudPopoverDropdown } from '../app/components/ui/hud-popover-dropdown';
import { HudQuickCommandFooter } from '../app/components/ui/hud-quick-command-footer';
import { HudToggleSwitch } from '../app/components/ui/hud-toggle-switch';
import { MetricTile } from '../app/components/ui/metric-tile';
import { ModeOnlyToggle } from '../app/components/ui/mode-only-toggle';
import { CombatantTypeDot } from '../app/components/ui/combatant-type-dot';
import { ConditionChipStrip } from '../app/components/ui/condition-chip-strip';
import { DeathSaveDot } from '../app/components/ui/death-save-dot';
import { PanelBlockShell } from '../app/components/ui/panel-block-shell';
import { PartyCombatantAccordion } from '../app/components/ui/party-combatant-accordion';
import { SettingsModuleShell } from '../app/components/ui/settings-module-shell';
import { SignalFilterChipGroup } from '../app/components/ui/signal-filter-chip-group';
import { SignalGroupCollapsible } from '../app/components/ui/signal-group-collapsible';
import { InlineEditListRow } from '../app/components/ui/inline-edit-list-row';
import { Image } from '../app/components/ui/image';
import { LoreSearchResultRow } from '../app/components/ui/lore-search-result-row';
import { MarkDownRenderer } from '../app/components/ui/markdown-renderer';
import { RecapSectionShell } from '../app/components/ui/recap-section-shell';
import { RepeatListFieldColumn } from '../app/components/ui/repeat-list-field-column';
import { StatusIconRow } from '../app/components/ui/status-icon-row';
import { VaultSheetMatchRow } from '../app/components/ui/vault-sheet-match-row';

/** Every `uiPrimitives[].id` from `manifest.json`, in registry order. */
export const SHOWCASED_PRIMITIVE_IDS = [
  'accordion',
  'action-button-row',
  'add-item-button',
  'alert-dialog',
  'alert',
  'aspect-ratio',
  'attention-ticket-card',
  'avatar',
  'badge',
  'battle-combatant-summary-row',
  'breadcrumb',
  'button',
  'calendar',
  'callout',
  'card',
  'checkbox',
  'code-block',
  'collapsible',
  'combatant-type-dot',
  'command-category-tag',
  'condition-chip-strip',
  'context-menu',
  'death-save-dot',
  'dialog',
  'dropdown-menu',
  'empty-state',
  'eyebrow-label',
  'form',
  'hover-card',
  'hp-bar-track',
  'hud-list-row',
  'hud-meta-caption',
  'hud-popover-dropdown',
  'hud-quick-command-footer',
  'hud-toggle-switch',
  'HudIssueCallout',
  'HudIssueToast',
  'image',
  'inline-edit-list-row',
  'input',
  'label',
  'lore-search-result-row',
  'markdown-renderer',
  'menubar',
  'metric-tile',
  'mode-only-toggle',
  'navigation-menu',
  'pagination',
  'panel-block-shell',
  'panel-header',
  'party-combatant-accordion',
  'period-chip-row',
  'pill-toggle-group',
  'popover',
  'progress',
  'provider-status-badge',
  'radio-group',
  'recap-section-shell',
  'repeat-list-field-column',
  'resizable',
  'scroll-area',
  'select',
  'separator',
  'settings-module-shell',
  'sheet',
  'sidebar',
  'signal-filter-chip-group',
  'signal-group-collapsible',
  'skeleton',
  'slider',
  'source-pill',
  'stack',
  'stat-row',
  'status-icon-row',
  'switch',
  'table',
  'tabs',
  'text-content',
  'textarea',
  'toggle-group',
  'toggle',
  'tooltip',
  'transcript-list-item-frame',
  'vault-sheet-match-row',
] as const;

function PartyCombatantAccordionDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]">
      <PartyCombatantAccordion
        expanded={open}
        expandRegionId="gallery-party-1"
        header={
          <>
            <button
              type="button"
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] border-0 bg-transparent p-0 text-left outline-none hover:bg-[var(--hud-tint-1)] focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="gallery-party-1"
            >
              <div className="size-2 shrink-0 rounded-[var(--radius-pill)] bg-[var(--hud-positive)] shadow-[0_0_6px_var(--hud-positive)]" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[var(--hud-text-1)]">Mira Ashvale</div>
                <div className="text-[length:var(--text-xs)] text-muted-foreground">Ranger 5</div>
              </div>
              <span className="shrink-0 text-[length:var(--text-xs)] text-muted-foreground" aria-hidden>
                {open ? '▴' : '▾'}
              </span>
            </button>
          </>
        }
      >
        <p className="text-[length:var(--text-xs)] leading-[1.45] text-[var(--hud-text-2)]">
          Expanded HP editor, conditions, and stat grid render in this panel in production.
        </p>
      </PartyCombatantAccordion>
      <PartyCombatantAccordion
        expanded={false}
        className="border-b-0"
        header={<span className="text-[length:var(--text-xs)] text-muted-foreground">Static row (no expand control in demo)</span>}
      />
    </div>
  );
}

function AttentionTicketCardDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="max-w-md rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]">
      <AttentionTicketCard
        reasonLabel="New comment"
        reasonColor="var(--hud-info)"
        projectLabel="HUD"
        timestampLabel="3h ago"
        title="Polish ticket row conformance"
        reasonText="Design systems bot left a review"
        snippet="Can we match the Weft spec?"
        issueUrl="#"
        expanded={open}
        onToggle={() => setOpen((v) => !v)}
        openInProviderAriaLabel="Open ticket (demo)"
      >
        {open ? (
          <p className="text-[length:var(--text-xs)] text-[var(--hud-text-2)]">
            Expanded thread body would render here.
          </p>
        ) : null}
      </AttentionTicketCard>
    </div>
  );
}

function HudPopoverDropdownDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
      <HudPopoverDropdown
        open={open}
        onOpenChange={setOpen}
        align="end"
        width="auto"
        contentClassName="min-w-[140px] py-1"
        contentAriaLabel="Demo menu"
        trigger={
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-input-bg)] px-3 py-1.5 text-[length:var(--text-xs)] text-[var(--hud-text-1)] [font-family:var(--weft-font-sans)]"
            aria-expanded={open}
          >
            Open menu
          </button>
        }
      >
        <div className="flex flex-col py-1 text-[length:var(--text-xs)] text-[var(--hud-text-1)] [font-family:var(--weft-font-sans)]">
          <button
            type="button"
            onMouseDown={(event) => { event.preventDefault(); setOpen(false); }}
            className="cursor-pointer border-0 bg-transparent px-2.5 py-1.5 text-left hover:bg-[var(--hud-tint-2)]"
          >
            Action one
          </button>
          <button
            type="button"
            onMouseDown={(event) => { event.preventDefault(); setOpen(false); }}
            className="cursor-pointer border-0 bg-transparent px-2.5 py-1.5 text-left hover:bg-[var(--hud-tint-2)]"
          >
            Action two
          </button>
        </div>
      </HudPopoverDropdown>
    </div>
  );
}

function SignalFilterChipGroupShowcase() {
  const [timeframe, setTimeframe] = React.useState<string>("today");
  const [priorities, setPriorities] = React.useState<string[]>(["high"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
      <SignalFilterChipGroup
        label="Timeframe"
        options={[
          { value: "all", label: "All" },
          { value: "today", label: "Today" },
          { value: "week", label: "This week" },
          { value: "month", label: "This month" },
        ]}
        isActive={(value) => value === timeframe}
        onToggle={(value) => setTimeframe(value)}
      />
      <SignalFilterChipGroup
        label="Priority"
        options={[
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "low", label: "Low" },
        ]}
        isActive={(value) => priorities.includes(value)}
        onToggle={(value) =>
          setPriorities((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
          )
        }
      />
    </div>
  );
}

function SignalGroupCollapsibleShowcase() {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({
    "my-project": false,
    "team-project": true,
  });
  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex w-full max-w-md flex-col gap-2 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
      <SignalGroupCollapsible
        groupKey="my-project"
        label="My project"
        count={4}
        collapsed={collapsed["my-project"]}
        onToggle={() => toggle("my-project")}
      >
        <div className="px-3 py-2 text-[length:var(--text-xs)] text-[var(--hud-text-2)]">
          Group body — list rows go here.
        </div>
      </SignalGroupCollapsible>
      <SignalGroupCollapsible
        groupKey="team-project"
        label="Team project"
        count={11}
        collapsed={collapsed["team-project"]}
        onToggle={() => toggle("team-project")}
      >
        <div className="px-3 py-2 text-[length:var(--text-xs)] text-[var(--hud-text-2)]">
          Hidden when collapsed.
        </div>
      </SignalGroupCollapsible>
    </div>
  );
}

function HudToggleSwitchDemo() {
  const [defaultOn, setDefaultOn] = React.useState(true);
  const [smallOn, setSmallOn] = React.useState(false);
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <HudToggleSwitch
          active={defaultOn}
          onToggle={() => setDefaultOn((value) => !value)}
          ariaLabel="Toggle default size"
        />
        <span className="text-xs text-muted-foreground">default (34×18)</span>
      </div>
      <div className="flex items-center gap-2">
        <HudToggleSwitch
          active={smallOn}
          onToggle={() => setSmallOn((value) => !value)}
          ariaLabel="Toggle small size"
          size="sm"
        />
        <span className="text-xs text-muted-foreground">sm (28×16)</span>
      </div>
      <div className="flex items-center gap-2">
        <HudToggleSwitch active={false} onToggle={() => undefined} ariaLabel="Disabled toggle" disabled />
        <span className="text-xs text-muted-foreground">disabled</span>
      </div>
    </div>
  );
}

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
        id="attention-ticket-card"
        title="Attention Ticket Card"
        summary="Linear-style attention row: reason pill, title, snippet, external link, expand slot for thread."
      >
        <AttentionTicketCardDemo />
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
        id="battle-combatant-summary-row"
        title="Battle Combatant Summary Row"
        summary="Initiative pill, name + type dot + deck/dead affordances, AC, reorder column, remove — Battle Tracker row 1."
      >
        <div className="max-w-md rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-2">
          <BattleCombatantSummaryRow
            initiative={14}
            name="Shadow griffon"
            combatantType="enemy"
            isActive
            isOnDeck={false}
            isDead={false}
            ac={16}
            onReorderUp={() => {}}
            onReorderDown={() => {}}
            onRemove={() => {}}
            disableReorderUp={false}
            disableReorderDown={false}
          />
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
        id="callout"
        title="Callout"
        summary="Inline message panel — denser than Alert, generic for help notes, status banners, and panel-level hints."
      >
        <div className="flex w-full max-w-md flex-col gap-2">
          <Callout tone="info" title="Recap queued">
            Generation will resume the next time the workspace mode opens.
          </Callout>
          <Callout tone="warning" density="compact" title="Add an OpenAI API key">
            Open App Settings → AI providers to enable transcription.
          </Callout>
          <Callout tone="danger" density="compact">
            Vault unreachable — last sync 4h ago.
          </Callout>
          <Callout tone="positive" density="compact">
            Saved. Local changes synced to the Personal vault.
          </Callout>
        </div>
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
        id="code-block"
        title="Code Block"
        summary="Tokenized plain-text code block for generated snippets and diagnostics."
      >
        <Stack gap="sm" className="w-full max-w-md">
          <CodeBlock
            label="Install command"
            language="shell"
            code="npm run mac:dev:web"
            onCopy={() => undefined}
            copyLabel="Copy install command"
          />
          <CodeBlock
            label="Diagnostic output"
            language="text"
            wrap
            density="compact"
            code="CodeBlock displays already-safe plain text only. Markdown parsing, HTML rendering, and syntax highlighting belong to MarkDownRenderer."
          />
        </Stack>
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
        id="combatant-type-dot"
        title="Combatant Type Dot"
        summary="Round dot that color-codes a combatant's type (enemy/ally/player). Default 7px; pulsing wrapper variant for TPK warning banner."
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CombatantTypeDot type="player" />
            <span className="text-xs text-muted-foreground">player</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CombatantTypeDot type="ally" />
            <span className="text-xs text-muted-foreground">ally</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CombatantTypeDot type="enemy" />
            <span className="text-xs text-muted-foreground">enemy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CombatantTypeDot type="enemy" pulsing />
            <span className="text-xs text-muted-foreground">enemy · pulsing</span>
          </div>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="command-category-tag"
        title="Command Category Tag"
        summary="Tone-colored reference label for NLP quick-command categories (5e palette)."
      >
        <div className="flex flex-wrap gap-2">
          <CommandCategoryTag tone="danger">Damage</CommandCategoryTag>
          <CommandCategoryTag tone="positive">Heal</CommandCategoryTag>
          <CommandCategoryTag tone="warning">Condition</CommandCategoryTag>
          <CommandCategoryTag tone="bulk">Bulk</CommandCategoryTag>
          <CommandCategoryTag tone="muted">Turn</CommandCategoryTag>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="condition-chip-strip"
        title="Condition Chip Strip"
        summary="Flex-wrap rail for removable condition chips plus add-condition control slot."
      >
        <ConditionChipStrip className="max-w-xs rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-section-fill-strong)] p-2">
          <Badge variant="outline" className="h-auto border-[color-mix(in_srgb,var(--hud-warning)_25%,transparent)] bg-[var(--hud-attention-bg-soft)] text-[10px] text-[var(--hud-warning)]">
            Poisoned ×
          </Badge>
          <Button variant="outline" size="sm" className="h-7 min-h-0 rounded-[var(--radius-xs)] border border-dashed text-[10px]">
            + condition
          </Button>
        </ConditionChipStrip>
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
        id="death-save-dot"
        title="Death Save Dot"
        summary="8×8 success/fail dot used inside the death-save row for downed PCs. Color follows kind + filled state."
      >
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>successes:</span>
            <DeathSaveDot kind="success" filled />
            <DeathSaveDot kind="success" filled />
            <DeathSaveDot kind="success" filled={false} />
          </div>
          <div className="flex items-center gap-1">
            <span>failures:</span>
            <DeathSaveDot kind="fail" filled />
            <DeathSaveDot kind="fail" filled={false} />
            <DeathSaveDot kind="fail" filled={false} />
          </div>
        </div>
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
        id="hp-bar-track"
        title="HP Bar Track"
        summary="HP bar track + temp-HP sliver + readout — auto-tones positive/warning/danger from hp/maxHp."
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <HpBarTrack hp={42} maxHp={50} />
          <HpBarTrack hp={18} maxHp={50} variant="track" tempHp={6} />
          <HpBarTrack hp={4} maxHp={50} variant="thick" tempHp={2} />
          <HpBarTrack hp={0} maxHp={0} tone="muted" showReadout={false} />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="hud-list-row"
        title="HUD List Row"
        summary="Leading-media + title-stack + trailing-actions list row chrome with state accent (default/unread/overdue/resolved/active)."
      >
        <div className="flex w-full max-w-md flex-col">
          <HudListRow
            state="unread"
            leading={<div className="size-2 rounded-full bg-[var(--primary)]" aria-hidden />}
            trailing={<Button size="sm" variant="ghost">View</Button>}
          >
            <HudListRowTitle emphasis>Review Q3 roadmap</HudListRowTitle>
            <HudListRowMeta>3h ago · #product · Slack</HudListRowMeta>
          </HudListRow>
          <HudListRow
            state="overdue"
            leading={<div className="size-2 rounded-full bg-[var(--hud-danger)]" aria-hidden />}
            trailing={<Badge variant="destructive">overdue</Badge>}
          >
            <HudListRowTitle>Send signed contract</HudListRowTitle>
            <HudListRowMeta>2d overdue · vendor.com</HudListRowMeta>
          </HudListRow>
          <HudListRow state="resolved" interactive>
            <HudListRowTitle>Approved expense report</HudListRowTitle>
            <HudListRowMeta>resolved · 4h ago</HudListRowMeta>
          </HudListRow>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="hud-meta-caption"
        title="HUD Meta Caption"
        summary="Muted micro-label for relative timestamps and compact secondary text in list rows and note cards."
      >
        <div className="flex flex-col gap-2">
          <HudMetaCaption>2h ago</HudMetaCaption>
          <div className="flex items-center gap-2">
            <span className="text-[length:var(--text-sm)] text-[var(--hud-text-1)]">Session notes</span>
            <HudMetaCaption>Editing</HudMetaCaption>
          </div>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="hud-popover-dropdown"
        title="HUD Popover Dropdown"
        summary="Anchored popover wrapper that pairs a trigger element with absolute-positioned content. Handles outside-click + Escape dismissal. Drives RoleSelector and the campaign dropdown."
      >
        <HudPopoverDropdownDemo />
      </PrimitiveCard>

      <PrimitiveCard
        id="hud-quick-command-footer"
        title="HUD Quick Command Footer"
        summary="Sticky bottom shell for NLP quick-command column — surface fill, top border, lift shadow."
      >
        <div className="relative h-28 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-section-fill-medium)]">
          <div className="p-2 text-[length:var(--text-xs)] text-[var(--hud-text-3)]">Scroll content above…</div>
          <HudQuickCommandFooter className="absolute bottom-0 left-0 right-0 border-t-0 shadow-none" footerBar={(
            <div className="border-t border-[var(--hud-border)] px-2 py-1.5 text-center text-[10px] text-[var(--hud-text-3)]">
              Footer action strip
            </div>
          )}
          >
            <div className="px-2 py-1.5 text-[length:var(--text-xs)] text-[var(--hud-text-2)]">Quick command body</div>
          </HudQuickCommandFooter>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="hud-toggle-switch"
        title="HUD Toggle Switch"
        summary="HUD-density binary toggle (34×18). Use in HUD chrome where Switch is too tall."
      >
        <HudToggleSwitchDemo />
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
        id="HudIssueToast"
        title="HUD Issue Toast"
        summary="Global toast surface for panel-level data-load failures with source attribution and next-action guidance."
      >
        <HudIssueToast
          issue={{
            reason: 'connection_failed',
            source: 'integration',
            sourceLabel: 'Linear',
            scope: 'panel',
            severity: 'error',
            title: 'Ticket updates unavailable',
            detail: 'Linear is not reachable from this workspace right now.',
            nextAction: 'Reconnect Linear in settings and refresh this panel.',
          }}
          onDismiss={() => undefined}
        />
      </PrimitiveCard>

      <PrimitiveCard
        id="image"
        title="Image"
        summary="Tokenized content image primitive with required alt text, fit/radius controls, and predictable loading defaults."
      >
        <Stack gap="sm" className="w-full max-w-md">
          <Image
            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20360'%3E%3Crect%20width='640'%20height='360'%20fill='%23233443'/%3E%3Ccircle%20cx='180'%20cy='145'%20r='64'%20fill='%237cc4ff'/%3E%3Cpath%20d='M80%20300%20L250%20180%20L330%20240%20L450%20135%20L600%20300Z'%20fill='%23c8df72'/%3E%3C/svg%3E"
            alt="Abstract landscape preview with a blue moon and green ridge"
            aspectRatio="video"
            bordered
            radius="lg"
          />
          <TextContent size="sm" tone="muted" measure="wide">
            Use Image for meaningful content images that need alt text. Pass `alt=""` only
            when the caller intentionally marks the image decorative; captions and media
            collections belong to ImageBlock and ImageGallery.
          </TextContent>
        </Stack>
      </PrimitiveCard>

      <PrimitiveCard
        id="inline-edit-list-row"
        title="Inline Edit List Row"
        summary="Editable text row with optional index badge / leading icon, click-to-edit body, and hover edit + delete affordances. Used in recap beats + mysteries."
      >
        <div className="flex w-full max-w-md flex-col gap-2 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-2">
          <InlineEditListRow
            text="The party negotiated safe passage."
            showIndex
            index={0}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
          <InlineEditListRow
            text="Who is the Whisper Court answering to?"
            italic
            leadingIcon={<AlertTriangle size={12} className="text-[var(--hud-warning)]" />}
            onUpdate={() => {}}
            onDelete={() => {}}
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
        id="lore-search-result-row"
        title="Lore Search Result Row"
        summary="Vault search hit with Obsidian link, relevance strip, excerpt, and copy-path control."
      >
        <div className="max-w-md overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]">
          <LoreSearchResultRow
            result={{
              id: 'demo',
              title: 'The Seal of Kervahn',
              path: 'lore/artifacts/seal.md',
              excerpt: 'A wax seal carried by the envoy…',
              relevance: 91,
              categories: ['artifact'],
            }}
            obsidianHref="#"
            isBrowseMode={false}
            copiedPath={null}
            onCopyPath={() => {}}
          />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="markdown-renderer"
        title="MarkDownRenderer"
        summary="Constrained markdown renderer with safe links, skipped raw HTML, blocked images, and Weft typography/code primitives."
      >
        <div className="w-full max-w-md rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
          <MarkDownRenderer
            markdown={[
              '### Morning summary',
              '',
              'The party found `three clues` near the east gate.',
              '',
              '- Safe list item',
              '- [Safe link](https://example.com)',
              '- [Blocked link](javascript:alert(1))',
              '',
              '```ts',
              'const clues = 3;',
              '```',
              '',
              '![Map preview](https://example.com/map.png)',
              '<button onclick="alert(1)">unsafe</button>',
            ].join('\n')}
          />
          <TextContent size="sm" tone="muted" measure="wide" className="mt-3">
            Accessibility: render real headings, paragraphs, lists, links, and code blocks from trusted
            markdown structure. Consumers own heading hierarchy; unsafe links become inert text, images
            become alt-text placeholders, and raw HTML is skipped.
          </TextContent>
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
        id="metric-tile"
        title="Metric Tile"
        summary="Label-over-value tile with tone-aware value (default/danger/warning/positive/muted/info). Used in Signal stats and dashboard-style HUD readouts."
      >
        <div className="flex w-full max-w-xl flex-wrap gap-2">
          <MetricTile label="Urgent" value={3} valueTone="danger" />
          <MetricTile label="Overdue" value={1} valueTone="warning" />
          <MetricTile label="Open" value={12} />
          <MetricTile label="Total" value={38} valueTone="muted" />
          <MetricTile label="Completed" value={24} valueTone="positive" hint="this week" />
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="mode-only-toggle"
        title="Mode Only Toggle"
        summary="“Use only in {mode} mode” control for vault paths, OpenAI key scope, and transcription (Session Context + App Settings)."
      >
        <div className="flex flex-col gap-2 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
          <ModeOnlyToggle active={false} label="Use only in TTRPG mode" onToggle={() => {}} />
          <ModeOnlyToggle active label="Use only in Productivity mode" onToggle={() => {}} />
        </div>
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
        id="period-chip-row"
        title="Period Chip Row"
        summary="Flex-wrap row for recap period / date-window preset chips."
      >
        <PeriodChipRow className="max-w-md">
          <span className="rounded-full border border-[var(--hud-border)] bg-[var(--hud-surface)] px-2.5 py-1 text-[10px] text-[var(--hud-text-2)]">
            Last 7 days
          </span>
          <span className="rounded-full border border-[var(--hud-border-accent)] bg-[var(--hud-primary-tint-medium)] px-2.5 py-1 text-[10px] font-medium text-[var(--primary)]">
            Last 90 days
          </span>
        </PeriodChipRow>
      </PrimitiveCard>

      <PrimitiveCard
        id="panel-block-shell"
        title="Panel Block Shell"
        summary="Outer chrome for custom-panel runtime blocks — title strip, optional collapse, selection ring, body padding (with seamless variant for full-bleed lists)."
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <PanelBlockShell title="Stats" headerRight={<Badge variant="outline">live</Badge>}>
            <div className="flex flex-wrap gap-2">
              <MetricTile label="Open" value={9} />
              <MetricTile label="Done" value={42} valueTone="positive" />
            </div>
          </PanelBlockShell>
          <PanelBlockShell
            title="Filters"
            collapsible
            sectionLabel="Filters"
            activeCountText="3 active"
          >
            <div className="text-xs text-muted-foreground">
              Body content collapses with the title chevron.
            </div>
          </PanelBlockShell>
          <PanelBlockShell title="Selected card" selected>
            <div className="text-xs text-muted-foreground">
              Selected blocks render with the accent border ring.
            </div>
          </PanelBlockShell>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="party-combatant-accordion"
        title="Party Combatant Accordion"
        summary="Roster row shell — header row triggers expand; optional non-interactive header; bordered body stack."
      >
        <PartyCombatantAccordionDemo />
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
        id="provider-status-badge"
        title="Provider Status Badge"
        summary="Capsule for local transcription provider probe status on Apple Speech / Wispr rows."
      >
        <div className="flex flex-wrap gap-2">
          <ProviderStatusBadge status="available" />
          <ProviderStatusBadge status="checking" />
          <ProviderStatusBadge status="running" />
          <ProviderStatusBadge status="unavailable" />
          <ProviderStatusBadge status="error" />
        </div>
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
        id="recap-section-shell"
        title="Recap Section Shell"
        summary="Collapsible section shell with icon + uppercase title + count pill + chevron. Used to wrap each visible recap section (beats, decisions, npcMoments, promises, mysteries)."
      >
        <div className="flex w-full max-w-md flex-col rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]">
          <RecapSectionShell
            icon={<Sparkles size={12} className="text-[var(--primary)]" />}
            title="Beats"
            count={3}
            open
            onToggle={() => {}}
          >
            <span className="text-[length:var(--text-xs)] text-[var(--hud-text-3)] [font-family:var(--weft-font-sans)]">
              Section body (beats list lives here)
            </span>
          </RecapSectionShell>
          <RecapSectionShell title="Mysteries" count={1} open={false} onToggle={() => {}}>
            <span>Collapsed body is hidden.</span>
          </RecapSectionShell>
        </div>
      </PrimitiveCard>

      <PrimitiveCard
        id="repeat-list-field-column"
        title="Repeat List Field Column"
        summary="Uppercase micro-label + control slot for repeat-list grids in the custom panel runtime."
      >
        <div className="max-w-xs rounded-[var(--radius-xs)] border border-[var(--hud-border)] bg-[var(--hud-surface)] p-3">
          <RepeatListFieldColumn label="Party member">
            <Input placeholder="Name" className="h-8 text-xs" />
          </RepeatListFieldColumn>
        </div>
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
        id="settings-module-shell"
        title="Settings Module Shell"
        summary="Bordered settings card — eyebrow + title + actions header, padded body, optional footer. Used by Session Context, App Settings, My Account, and Mode Manager."
      >
        <SettingsModuleShell
          className="max-w-md"
          eyebrow="Module"
          title="Live transcription"
          description="Captures session audio for recap and signal extraction."
          actions={<HudToggleSwitch active onToggle={() => undefined} ariaLabel="Toggle live transcription" />}
          footer={
            <Button size="sm" variant="ghost">
              Open advanced settings
            </Button>
          }
        >
          <p className="m-0 text-xs text-muted-foreground">
            Body content lives here. Compose labelled fields, selects, or any panel chrome inside.
          </p>
        </SettingsModuleShell>
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
        id="signal-filter-chip-group"
        title="Signal Filter Chip Group"
        summary="Label + flex-wrap rail of toggle chips. Owns the role=group landmark, the uppercase caption, and the active/idle chip chrome — consumer drives isActive + onToggle."
      >
        <SignalFilterChipGroupShowcase />
      </PrimitiveCard>

      <PrimitiveCard
        id="signal-group-collapsible"
        title="Signal Group Collapsible"
        summary="Collapse-toggle header + body for grouped signal lists. Owns chevron, uppercase label, count meta, ARIA wiring, and data-signal-group marker."
      >
        <SignalGroupCollapsibleShowcase />
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
        id="stack"
        title="Stack"
        summary="Tokenized flex stack for neutral vertical or horizontal child layout."
      >
        <Stack className="w-full max-w-md rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
          <Stack gap="xs">
            <span className="text-sm font-semibold text-[var(--hud-text-1)]">Session checklist</span>
            <span className="text-xs text-[var(--hud-text-2)]">
              Use Stack for spacing and alignment only; keep lists, forms, and navigation semantic at the caller.
            </span>
          </Stack>
          <Stack direction="horizontal" gap="sm" align="center" wrap>
            <Badge variant="secondary">Briefing</Badge>
            <Badge variant="outline">Transcript</Badge>
            <Badge variant="outline">Vault</Badge>
          </Stack>
          <Stack direction="horizontal" gap="sm" align="center" justify="between">
            <span className="text-xs text-[var(--hud-text-2)]">Keyboard order follows DOM order.</span>
            <Button size="sm" variant="secondary">Review</Button>
          </Stack>
        </Stack>
      </PrimitiveCard>

      <PrimitiveCard
        id="status-icon-row"
        title="Status Icon Row"
        summary="Leading-icon + title + detail row for status inside SettingsModuleShell bodies (device-login status, ccore runtime row, agent-plugin install status). Tone-aware title accent."
      >
        <div className="flex w-full max-w-md flex-col gap-2 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-2">
          <StatusIconRow
            tone="success"
            icon={<Link2 size={11} className="text-[var(--hud-positive)]" />}
            title="ccore sync connected"
            detail="Account alyx"
          />
          <StatusIconRow
            tone="warning"
            icon={<AlertTriangle size={11} className="text-[var(--hud-warning)]" />}
            title="Sign-in needs attention"
            detail="Heddle could not reach the local ccore runtime."
          />
          <StatusIconRow
            tone="muted"
            icon={<AlertTriangle size={11} className="text-[var(--hud-text-3)]" />}
            title="ccore sync off"
            detail="ccore Clerk sync is off for this build."
          />
        </div>
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
        id="text-content"
        title="Text Content"
        summary="Readable generated copy primitive with bounded size, weight, tone, and measure variants."
      >
        <Stack gap="sm" className="w-full max-w-md rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3">
          <TextContent asChild size="lg" weight="semibold" tone="strong" measure="narrow">
            <h3>Generated session summary</h3>
          </TextContent>
          <TextContent>
            The party followed the signal through the east gate and found three fresh cart tracks near the old watch post.
          </TextContent>
          <TextContent size="sm" tone="muted" measure="narrow">
            Use TextContent for readable generated copy. Keep headings, lists, and captions semantic at the caller.
          </TextContent>
          <TextContent weight="medium" tone="accent" measure="none">
            Tone is decorative unless adjacent text carries the meaning.
          </TextContent>
        </Stack>
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
        id="transcript-list-item-frame"
        title="Transcript List Item Frame"
        summary="Header meta + body text + optional footer for transcript, highlight, and pinned lines."
      >
        <div className="max-w-md border border-[var(--hud-border)] rounded-[var(--radius-sm)] overflow-hidden bg-[var(--hud-surface-raised)]">
          <TranscriptListItemFrame
            header={(
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[var(--hud-positive)]" aria-hidden />
                  <span className="text-sm font-semibold text-[var(--hud-text-1)]">Lyra</span>
                  <span className="text-xs text-[var(--hud-text-3)]">Investigator</span>
                </div>
                <span className="text-xs text-[var(--hud-text-3)] [font-family:var(--weft-font-mono)]">00:12</span>
              </div>
            )}
            body={<p className="text-sm text-[var(--hud-text-2)]">We should check the east gate before nightfall.</p>}
            footer={(
              <div className="flex justify-between gap-2">
                <span className="rounded-[var(--radius-pill)] border border-[var(--hud-border-accent)] bg-[var(--hud-primary-tint-medium)] px-1.5 py-px text-[10px] text-[var(--primary)]">
                  #clue
                </span>
                <span className="text-[10px] text-[var(--hud-text-3)]">Assign ▾</span>
              </div>
            )}
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

      <PrimitiveCard
        id="vault-sheet-match-row"
        title="Vault Sheet Match Row"
        summary="Sheet match row used by the BattleTracker vault search results (staging + in-combat). Name + confidence pill + HP/AC summary + file path + Add button."
      >
        <div className="flex w-full max-w-lg flex-col">
          <VaultSheetMatchRow
            match={{
              characterName: 'Aboleth',
              confidence: 'exact',
              filePath: 'monsters/aboleth.md',
              parsedData: { hp: 135, ac: 17 },
            }}
            onAdd={() => undefined}
          />
          <VaultSheetMatchRow
            match={{
              characterName: 'Bandit Captain',
              confidence: 'partial',
              filePath: 'monsters/bandit-captain.md',
              parsedData: { hp: 65, ac: 15 },
            }}
            onAdd={() => undefined}
            addLabel="Add to Combat"
          />
        </div>
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
  background: 'var(--hud-section-fill-medium)',
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
