import { NavigationRailLayout } from "../../../src/ui/navigation-rail-layout";
import { NavigationActions, type NavigationAction } from "../../../src/ui/navigation-actions";
import { NavigationSpacePicker } from "../../../src/ui/navigation-space-picker";
import { NavigationAccount } from "../../../src/ui/navigation-account";
import { NavigationRow, NavigationRowButton, NavigationRowDisclosure } from "../../../src/ui/navigation-row";
import { NavigationCount } from "../../../src/ui/navigation-count";
import { NavigationItemIcon } from "../../../src/ui/navigation-icon";
import { NavigationRailTestTree, flattenFiles, type TestFile } from "./NavigationRailTestTree";
import React from "react";
import {
  NavigationRailSearch,
  type RailSearchItem,
} from "./NavigationRailSearch";
import { NavigationRailParity } from "./NavigationRailParity";
import {
  railDensities,
  railGeometry,
  railPreviewTokens,
  railDecisions,
  railSizingDecision,
} from "./navigation-rail-contract";
import {
  RailIcon,
  railIconDefinitions,
  navigationIconNames,
  supportsListening,
  supportsLock,
  type RailIconName,
  type LeadingRailIcon,
} from "./navigation-rail-icons";
import { Button } from "../../../src/ui/button";
import { Badge } from "../../../src/ui/badge";
import { Avatar, AvatarFallback } from "../../../src/ui/avatar";
import { Textarea } from "../../../src/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../src/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "../../../src/ui/sheet";
import { Input } from "../../../src/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../../src/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "../../../src/ui/dropdown-menu";
import { Playground } from "./Playground";
import { PageTitle } from "./shared";
import "./navigation-rail-lab.css";
import { NavigationRailAccessibility } from "./NavigationRailAccessibility";

type Level = "Tokens" | "Atoms" | "Rows" | "Rail";
const levels: Level[] = ["Tokens", "Atoms", "Rows", "Rail"];
const atoms = [
  {
    id: "search",
    name: "Search",
    use: "Weft SearchField",
    note: "Search file names in the selected Space, including collapsed children. Local results preview; full-content service search is not connected.",
    tokens:
      "--weft-control-h-sm · --weft-search-pad-end · --weft-focus-ring-color",
    component: "search-field",
  },
  {
    id: "icon",
    name: "Icon",
    use: "Semantic RailIcon registry",
    note: "Choose a registered purpose. The owning label or status supplies its accessible name; file types and status badges have restricted uses.",
    tokens: "--weft-muted · --weft-ink",
    component: undefined,
  },
  {
    id: "label",
    name: "Label",
    use: "Weft type tokens",
    note: "The name of the destination or file. Keep the full name available.",
    tokens: "--weft-font-sans · --weft-ink · --weft-muted",
    component: undefined,
  },
  {
    id: "disclosure",
    name: "Disclosure",
    use: "Custom control in Avalandra",
    note: "Expands children independently of opening a file. Icon size and target size are separate.",
    tokens: "--rail-lab-target · --weft-focus-ring-color",
    component: undefined,
  },
  {
    id: "button",
    name: "Action button",
    use: "Weft Button, with local sizing",
    note: "Create, open actions, or reveal another control. Explore the existing Button contract below.",
    tokens: "--weft-control-h · --weft-focus-ring-color",
    component: "button",
  },
  {
    id: "badge",
    name: "Count badge",
    use: "Weft Badge",
    note: "Files show only their own signals. The Signals destination alone shows both Space signal and notification totals. Counts are labeled information, not actions.",
    tokens: "--weft-font-mono · --weft-rule · --weft-ink",
    component: "badge",
  },
  {
    id: "avatar",
    name: "Avatar",
    use: "Weft Avatar with rail identity sizing",
    note: "Space initials use a circular border and explicit foreground/background colors; Private uses a lock. Account initials use the same Avatar primitive.",
    tokens: "--weft-radius-pill · --weft-ink",
    component: "avatar",
  },
  {
    id: "select",
    name: "Space selector",
    use: "Weft Select",
    note: "The same selector as the rail: Space initial, Private lock, selected identity and Add new flow.",
    tokens: "--weft-control-h-sm · --weft-control-border",
    component: "select",
  },
  {
    id: "create-menu",
    name: "Create menu",
    use: "Weft DropdownMenu + Button + Input",
    note: "The Files plus opens folder/file choices and then inline naming. Creation here stays local.",
    tokens: "--weft-paper · --weft-ink · --weft-focus-ring-color",
    component: undefined,
  },
  {
    id: "actions-menu",
    name: "Row actions menu",
    use: "Weft DropdownMenu composition",
    note: "File type, subtree, permissions and capabilities determine the available actions. Hidden at rest; available on hover and keyboard focus.",
    tokens: "--weft-paper · --weft-ink · --weft-focus-ring-color",
    component: undefined,
  },
  {
    id: "settings",
    name: "Settings button",
    use: "Weft icon Button + settings icon",
    note: "A persistent trailing action in the account row; separate from file actions.",
    tokens: "--rail-lab-target · --weft-ink · --weft-focus-ring-color",
    component: undefined,
  },
  {
    id: "separator",
    name: "Divider",
    use: "Weft border token",
    note: "Separates regions. A visual divider is different from an interactive resize handle.",
    tokens: "--weft-rule",
    component: "separator",
  },
];
type IconName = LeadingRailIcon;
type Config = {
  icon: IconName;
  label: string;
  iconSize: string;
  count: string;
  notifications: string;
  showIcon: boolean;
  listening: boolean;
  locked: boolean;
  showCount: boolean;
  showActions: boolean;
  current: boolean;
  expanded: boolean;
  hasChildren: boolean;
  disabled: boolean;
  row: string;
  depth: string;
  density: string;
  content: string;
  width: string;
  menuScenario: string;
};
const initial: Config = {
  icon: "text",
  label: "Product direction",
  iconSize: "16",
  count: "3",
  notifications: "12",
  showIcon: true,
  listening: false,
  locked: false,
  showCount: true,
  showActions: true,
  current: true,
  expanded: true,
  hasChildren: true,
  disabled: false,
  row: "File",
  depth: "0",
  density: "compact",
  content: "Populated",
  width: "280",
  menuScenario: "Writable",
};
function Choice({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="rail-lab-field">
      <span>{label}</span>
      <select
        className="weft-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {values.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );
}
function Check({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="rail-lab-check">
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
function Actions({
  name,
  disabled,
  config,
  subtree,
  onRename,
  onMessage,
}: {
  name: string;
  disabled?: boolean;
  config: Config;
  subtree: boolean;
  onRename: () => void;
  onMessage: (v: string) => void;
}) {
  const folder = config.row === "Folder";
  const html = config.icon === "html" && !folder;
  const writable = config.menuScenario !== "Read-only" && config.menuScenario !== "Connector protected";
  const locked = config.menuScenario === "Connector protected";
  const extras = config.menuScenario === "Capabilities available";
  const item = (label: string, disabled = false): NavigationAction => ({ id: label, label, disabled, onSelect: label === "Rename" ? onRename : () => onMessage(`Preview only: ${label} for ${name}. Avalandra service/dialog is not connected.`) });
  const group = (label: string, children: NavigationAction[]): NavigationAction => ({ id: label, label, children });
  const items: NavigationAction[] = [
    ...(locked ? [item("Manage connector")] : []),
    ...(writable ? [item(folder ? "New File in Folder" : "New child file"), item("HTML file — copy agent prompt…"), ...(folder ? [item("New Folder")] : []), item("Rename"), item(folder ? subtree ? "Duplicate Folder Tree" : "Duplicate Folder" : subtree ? "Duplicate subtree" : "Duplicate"), group("Move…", [item("Move within this Space…"), item("Move to Space…", !extras), item("Copy to Space…", !extras)])] : []),
    ...(extras && !folder ? [item("Download PDF")] : []),
    ...(writable && html ? [group("Status", [item("Requires Avalandra board data", true)])] : []),
    ...(writable && !folder ? [group("Working status", ["Active", "Stale", "WIP", "Clear"].map(label => item(label)))] : []),
    group("More", [item("Copy link"), ...(writable ? [item("Mark reviewed")] : []), ...(!folder ? [group("Version history", [item("View versions"), ...(writable ? [item("Save version"), item("Restore version")] : [])])] : [])]),
    ...(writable ? [item(subtree ? "Remove subtree…" : "Remove…")] : []),
  ];
  return <NavigationActions name={name} items={items} disabled={disabled} menuLabel="File actions preview"
    triggerClassName="rail-lab-target rail-lab-actions" contentClassName="rail-lab-menu"
    caption={<span className="rail-lab-menu-caption rail-lab-menu-type"><RailIcon purpose={folder ? "folder" : html ? "html" : "text"} size={14} />{folder ? "Folder" : html ? "HTML file" : "Text file"} · Local preview</span>} />;
}

type SampleNode = {
  label: string;
  icon: "text" | "html" | "folder";
  children?: SampleNode[];
  signals?: number;
  notifications?: number;
};
const nestedFiles: SampleNode[] = [
  {
    label: "Research notes",
    signals: 2,
    notifications: 3,
    icon: "text",
    children: [
      {
        label: "Interview summary",
        signals: 1,
        notifications: 2,
        icon: "text",
      },
      {
        label: "Findings prototype",
        signals: 0,
        notifications: 1,
        icon: "html",
      },
    ],
  },
  {
    label: "Interactive prototype",
    signals: 1,
    notifications: 2,
    icon: "html",
  },
  {
    label: "Supporting material",
    icon: "folder",
    children: [
      {
        label: "Design references",
        icon: "folder",
        children: [
          {
            label: "Navigation examples",
            signals: 1,
            notifications: 3,
            icon: "html",
          },
          {
            label: "Accessibility notes",
            signals: 2,
            notifications: 4,
            icon: "text",
          },
        ],
      },
      { label: "Decision log", signals: 0, notifications: 1, icon: "text" },
    ],
  },
];
function makeTestFiles(config: Config, longList: boolean): TestFile[] {
    const convert = (nodes: SampleNode[], parent: string): TestFile[] => nodes.map((node, index) => ({ ...node, id: `${parent}-${index}`, children: node.children && convert(node.children, `${parent}-${index}`) }));
    return [
      { id: "root", label: config.row === "File" || config.row === "Folder" ? config.label : "Product direction", icon: config.row === "Folder" ? "folder" : config.icon === "html" ? "html" : "text", signals: config.row === "Folder" ? 0 : Number(config.count), children: config.hasChildren ? convert(nestedFiles, "nested") : undefined },
      { id: "reference", label: "Reference", icon: "html", signals: 1 },
      ...(longList ? Array.from({ length: 30 }, (_, i) => ({ id: `reference-${i}`, label: `Reference ${i + 1}`, icon: i % 2 ? "text" : "html", signals: 0 })) : []),
    ] as TestFile[];
}
function NestedSample({
  node,
  depth,
  config,
  onMessage,
  onNavigate,
}: {
  node: SampleNode;
  onNavigate?: (message: string) => void;
  depth: number;
  config: Config;
  onMessage: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <div role="listitem">
      <DemoRow
        expandable={Boolean(node.children?.length)}
        config={{
          ...config,
          label: node.label,
          listening: false,
          locked: false,
          count: String(node.signals ?? 0),
          notifications: String(node.notifications ?? 0),
          icon: node.icon,
          depth: String(depth),
          row: node.icon === "folder" ? "Folder" : "File",
          current: false,
          expanded: open,
        }}
        onExpand={() => setOpen(!open)}
        onActivate={() =>
          node.icon === "folder"
            ? setOpen(!open)
            : (onNavigate ?? onMessage)(`Opened ${node.label}.`)
        }
        onMessage={onMessage}
      />
      {open && node.children?.length ? (
        <div role="list">
          {node.children.map((child) => (
            <NestedSample
              key={child.label}
              node={child}
              onNavigate={onNavigate}
              depth={depth + 1}
              config={config}
              onMessage={onMessage}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
function RailIconWithStatus({ icon, ...props }: { icon: RailIconName; size: number; listening?: boolean; locked?: boolean }) {
  return <NavigationItemIcon purpose={icon} {...props} />;
}
function RowCounters({ config }: { config: Config }) {
  const total = config.row === "Navigation" && config.icon === "signals";
  if (!config.showCount || (config.row !== "File" && !total)) return null;
  return <span className="rail-lab-counters">
    <NavigationCount count={Number(config.count)} name={total ? "this Space" : config.label} scope={total ? "signals-destination" : "file"} />
    {total && <NavigationCount count={Number(config.notifications)} name="this Space" scope="signals-destination" kind="notifications" />}
  </span>;
}
function DemoRow({
  config,
  expandable = config.hasChildren,
  previewState,
  onExpand,
  onActivate,
  onMessage,
  onRenamed,
}: {
  onRenamed?: (label: string) => void;
  config: Config;
  expandable?: boolean;
  previewState?: string;
  onExpand: () => void;
  onActivate: () => void;
  onMessage: (v: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(config.label);
  const [renamed, setRenamed] = React.useState<string>();
  React.useEffect(() => setRenamed(undefined), [config.label]);
  const titleRef = React.useRef<HTMLButtonElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const longPress = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const consumedLongPress = React.useRef(false);
  React.useEffect(() => () => clearTimeout(longPress.current), []);
  const descriptionId = React.useId();
  const displayLabel = renamed ?? config.label;
  const returnFocus = () =>
    requestAnimationFrame(() => titleRef.current?.focus());
  const hierarchical = config.row === "File" || config.row === "Folder";
  return (
    <NavigationRow
      current={config.current}
      disabled={config.disabled}
      hierarchical={hierarchical}
      depth={Number(config.depth)}
      density={config.density as "default" | "compact" | "dense"}
      ref={rowRef}
      className="rail-lab-row"
      onContextMenu={(event) => {
        if (!hierarchical || config.disabled || editing || !config.showActions) return;
        event.preventDefault();
        rowRef.current?.querySelector<HTMLButtonElement>(".rail-lab-actions")?.click();
      }}
      onKeyDown={(event) => {
        if (!hierarchical || config.disabled || editing) return;
        if (event.key === "F2" && config.menuScenario !== "Read-only" && config.menuScenario !== "Connector protected") {
          event.preventDefault(); setDraft(displayLabel); setEditing(true);
        }
        if (config.showActions && (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))) {
          event.preventDefault(); rowRef.current?.querySelector<HTMLButtonElement>(".rail-lab-actions")?.click();
        }
      }}
      onClickCapture={(event) => { if (consumedLongPress.current) { event.preventDefault(); event.stopPropagation(); consumedLongPress.current = false; } }}
      onPointerDown={(event) => {
        consumedLongPress.current = false;
        if (event.pointerType !== "touch" || !hierarchical || editing || config.disabled || !config.showActions) return;
        clearTimeout(longPress.current);
        longPress.current = setTimeout(() => { rowRef.current?.querySelector<HTMLButtonElement>(".rail-lab-actions")?.click(); consumedLongPress.current = true; }, 600);
      }}
      onPointerMove={() => clearTimeout(longPress.current)}
      onPointerUp={() => clearTimeout(longPress.current)}
      onPointerCancel={() => clearTimeout(longPress.current)}
      data-preview-state={previewState}
      data-current={config.current}
      data-disabled={config.disabled}
    >
      {hierarchical && expandable ? (
        <NavigationRowDisclosure
          className="rail-lab-target"
          disabled={config.disabled}
          name={displayLabel}
          expanded={config.expanded}
          onClick={onExpand}
        />
      ) : hierarchical ? (
        <span className="rail-lab-target" aria-hidden="true" />
      ) : null}
      {config.row === "Account" ? (
        <Avatar className="size-7">
          <AvatarFallback className="rail-lab-account-initials">
            AC
          </AvatarFallback>
        </Avatar>
      ) : config.showIcon ? (
        <RailIconWithStatus
          icon={
            config.row === "Folder"
              ? "folder"
              : config.row === "File"
              ? config.icon === "html"
                ? "html"
                : "text"
              : config.icon
          }
          size={Number(config.iconSize)}
          listening={config.row === "File" && config.listening}
          locked={hierarchical && config.locked}
        />
      ) : null}
      {editing ? (
        <Input
          aria-label="Rename file"
          disabled={config.disabled}
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditing(false);
              returnFocus();
            }
            if (e.key === "Enter") {
              e.preventDefault();
              if (!draft.trim()) {
                onMessage("Enter a file name before saving.");
                return;
              }
              setEditing(false);
              setRenamed(draft.trim());
              onRenamed?.(draft.trim());
              returnFocus();
              onMessage(`Preview rename: ${draft}`);
            }
          }}
        />
      ) : (
        <NavigationRowButton
          ref={titleRef}
          className="rail-lab-title"
          aria-describedby={descriptionId}
          disabled={config.disabled}
          aria-current={config.current ? "page" : undefined}
          onClick={onActivate}
          title={renamed ?? config.label}
        >
          {renamed ?? config.label}
        </NavigationRowButton>
      )}
      <span id={descriptionId} className="sr-only">
        {config.row === "File"
          ? `${config.icon === "html" ? "HTML" : "Text"} file${
              config.listening ? ", listening" : ""
            }${config.locked ? ", locked" : ""}`
          : config.row === "Folder"
          ? `Folder${config.locked ? ", locked" : ""}`
          : config.row}{" "}
        {config.showCount &&
        (config.row === "File" ||
          (config.row === "Navigation" && config.icon === "signals"))
          ? [
              Number(config.count) > 0
                ? `${config.count} signals ${
                    config.row === "File"
                      ? `for ${displayLabel}`
                      : "across this Space"
                  }.`
                : "",
              config.row === "Navigation" && Number(config.notifications) > 0
                ? `${config.notifications} notifications across this Space.`
                : "",
            ]
              .filter(Boolean)
              .join(" ")
          : ""}
      </span>
      {config.row === "Account" && (
        <Button
          variant="ghost"
          size="icon"
          className="rail-lab-target"
          aria-label="Account settings"
          disabled={config.disabled}
          onClick={() =>
            onMessage("Account settings requested in the preview.")
          }
        >
          <RailIcon purpose="settings" size={16} />
        </Button>
      )}
      {config.row !== "Account" && <RowCounters config={config} />}
      {config.showActions && hierarchical ? (
        <Actions
          disabled={config.disabled}
          name={displayLabel}
          config={config}
          subtree={expandable && hierarchical}
          onRename={() => {
            setDraft(displayLabel);
            setEditing(true);
          }}
          onMessage={onMessage}
        />
      ) : null}
    </NavigationRow>
  );
}

export function NavigationRailLab() {
  const [level, setLevel] = React.useState<Level>("Atoms");
  const [atom, setAtom] = React.useState("icon");
  const [inspectedIcon, setInspectedIcon] =
    React.useState<RailIconName>("text");
  const [config, setConfig] = React.useState(() => {
    try {
      const width = Number(localStorage.getItem("weft:rail-lab:desktop-width"));
      return { ...initial, width: Number.isFinite(width) && width >= 200 && width <= 720 ? String(width) : initial.width };
    } catch { return initial; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("weft:rail-lab:desktop-width", config.width); }
    catch { /* Resizing remains available when browser storage is blocked. */ }
  }, [config.width]);
  const [message, setMessage] = React.useState("");
  const [note, setNote] = React.useState("");
  const [notes, setNotes] = React.useState<
    {
      key: string;
      text: string;
      options: Config & { inspectedIcon?: RailIconName };
    }[]
  >(() => {
    try {
      const value = JSON.parse(
        localStorage.getItem("weft:rail-lab:notes") ?? "[]"
      );
      return Array.isArray(value)
        ? value.filter(
            (n) =>
              typeof n?.key === "string" &&
              typeof n?.text === "string" &&
              n?.options
          )
        : [];
    } catch {
      return [];
    }
  });
  const noteKey = level === "Atoms" ? `Atoms / ${atom}` : level;
  React.useEffect(
    () => setNote(notes.find((n) => n.key === noteKey)?.text ?? ""),
    [noteKey]
  );
  const [device, setDevice] = React.useState("Auto");
  const [railOpen, setRailOpen] = React.useState(false);
  const [maxRailWidth, setMaxRailWidth] = React.useState(720);
  const displayedRailWidth = Math.min(maxRailWidth, Number(config.width));
  const navigatePreview = (message: string) => {
    setMessage(message);
    setRailOpen(false);
  };
  const [selectedArea, setSelectedArea] = React.useState<"signals" | "board" | null>(null);
  const [documentsOpen, setDocumentsOpen] = React.useState(true);
  const [creatingKind, setCreatingKind] = React.useState<
    "text" | "folder" | null
  >(null);
  const [creationName, setCreationName] = React.useState("");
  const createTrigger = React.useRef<HTMLButtonElement>(null);
  const fileRegion = React.useRef<HTMLElement>(null);
  const beginCreate = (kind: "text" | "folder") => {
    setDocumentsOpen(true);
    setCreationName("");
    setCreatingKind(kind);
  };
  const finishCreate = (cancel = false) => {
    if (!cancel && !creationName.trim()) return;
    if (!cancel && creatingKind) {
      if (testFiles.some((file) => file.label.toLocaleLowerCase() === creationName.trim().toLocaleLowerCase())) {
        setMessage("A file or folder with that name already exists here. Choose another name."); return;
      }
      setTestFiles((files) => [{ id: crypto.randomUUID(), label: creationName.trim(), icon: creatingKind }, ...files]);
      setMessage(
        `Created ${
          creatingKind === "folder" ? "folder" : "file"
        } “${creationName.trim()}” in the local preview only.`
      );
      setConfig((c) => ({ ...c, content: "Populated" }));
    }
    setCreatingKind(null);
    requestAnimationFrame(() => createTrigger.current?.focus());
  };
  const [longList, setLongList] = React.useState(true);
  const spaceTriggerId = React.useId();
  const [space, setSpace] = React.useState("studio");
  const [htmlPromptOpen, setHtmlPromptOpen] = React.useState(false);
  const [htmlCopyStatus, setHtmlCopyStatus] = React.useState("");
  const [newSpaceOpen, setNewSpaceOpen] = React.useState(false);
  const [newSpaceName, setNewSpaceName] = React.useState("");
  const [extraSpaces, setExtraSpaces] = React.useState<string[]>([]);
  const spaceName =
    space === "studio" ? "Studio" : space === "private" ? "Private" : space;
  const seedFiles = React.useMemo(() => makeTestFiles(config, longList), [config.row, config.label, config.icon, config.count, config.hasChildren, longList]);
  const [testFiles, setTestFiles] = React.useState<TestFile[]>(seedFiles);
  const [selectedFile, setSelectedFile] = React.useState<string | null>("root");
  const spaceFixtures = React.useRef<Record<string, TestFile[]>>({});
  const previousSpace = React.useRef(space);
  React.useEffect(() => {
    setTestFiles((files) => files.map((file) => file.id === "root" ? {
      ...file, label: config.row === "File" || config.row === "Folder" ? config.label : "Product direction",
      icon: config.row === "Folder" ? "folder" : config.icon === "html" ? "html" : "text",
      signals: config.row === "Folder" ? 0 : Number(config.count),
    } : file));
  }, [config.row, config.label, config.icon, config.count]);
  React.useEffect(() => {
    setTestFiles((files) => files.map((file) => file.id === "root" ? { ...file, children: config.hasChildren ? file.children ?? seedFiles.find((node) => node.id === "root")?.children : undefined } : file));
  }, [config.hasChildren]);
  React.useEffect(() => {
    setTestFiles((files) => {
      const base = files.filter((file) => !/^reference-\d+$/.test(file.id));
      return longList ? [...base, ...seedFiles.filter((file) => /^reference-\d+$/.test(file.id))] : base;
    });
  }, [longList]);
  React.useEffect(() => {
    if (previousSpace.current === space) return;
    spaceFixtures.current[previousSpace.current] = testFiles;
    const next = spaceFixtures.current[space] ?? (["studio", "private"].includes(space) ? seedFiles : []);
    setTestFiles(next); setSelectedFile(next[0]?.id ?? null); previousSpace.current = space;
  }, [space]);
  React.useEffect(() => {
    if (selectedFile && !flattenFiles(testFiles).some(({ node }) => node.id === selectedFile)) setSelectedFile(testFiles[0]?.id ?? null);
  }, [testFiles, selectedFile]);
  const selectTestFile = (id: string) => {
    setSelectedFile(id); setSelectedArea(null); setDocumentsOpen(true);
    const file = flattenFiles(testFiles).find(({ node }) => node.id === id);
    navigatePreview(`Opened ${file?.node.label ?? "file"}. ${file?.path ?? ""}`);
  };
  const sumNodes = (
    nodes: SampleNode[]
  ): { signals: number; notifications: number } =>
    nodes.reduce(
      (sum, node) => {
        const child = sumNodes(node.children ?? []);
        return {
          signals: sum.signals + (node.signals ?? 0) + child.signals,
          notifications:
            sum.notifications + (node.notifications ?? 0) + child.notifications,
        };
      },
      { signals: 0, notifications: 0 }
    );
  const nestedTotals = sumNodes(config.hasChildren ? nestedFiles : []);
  const totals =
    config.content === "Populated"
      ? {
          signals: flattenFiles(testFiles).reduce((sum, { node }) => sum + (node.signals ?? 0), 0),
          notifications:
            (config.row === "Folder" ? 0 : Number(config.notifications) || 0) +
            nestedTotals.notifications +
            2,
        }
      : { signals: 0, notifications: 0 };
  const spaceIdentity = (name: string, privateSpace = false, signals = 0) => (
    <span className="rail-lab-space-identity">
      {privateSpace ? (
        <RailIcon purpose="private" size={16} />
      ) : (
        <Avatar className="rail-lab-space-avatar">
          <AvatarFallback>
            {name.slice(0, 1).toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <span>{name}</span>
      <NavigationCount count={signals} name={name} scope="space" className="rail-lab-space-signal-count" />
    </span>
  );
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));
  const selected = atoms.find((a) => a.id === atom)!;
  const style = railPreviewTokens(config.density) as React.CSSProperties;
  const controls = (
    <div className="rail-lab-controls">
      <Choice
        label="Row example"
        value={
          config.row === "Account"
            ? "Account"
            : config.row === "Folder"
            ? "Folder"
            : config.row === "File"
            ? config.icon === "html"
              ? "HTML file"
              : "Text file"
            : config.icon === "signals"
            ? "Signals"
            : config.icon === "explorer"
            ? "Space Explorer"
            : config.icon === "board"
            ? "Kanban board"
            : "Choose example"
        }
        values={[
          "Choose example",
          "Text file",
          "HTML file",
          "Folder",
          "Signals",
          "Kanban board",
          "Space Explorer",
          "Account",
        ]}
        onChange={(value) => {
          const presets: Record<string, Partial<Config>> = {
            "Text file": {
              row: "File",
              icon: "text",
              label: "Product direction",
              showActions: true,
              showCount: true,
            },
            "HTML file": {
              row: "File",
              icon: "html",
              label: "Interactive prototype",
              showActions: true,
              showCount: true,
            },
            Folder: {
              row: "Folder",
              icon: "folder",
              label: "Supporting material",
              showActions: true,
              showCount: true,
            },
            Signals: {
              row: "Navigation",
              icon: "signals",
              label: "Signals",
              showActions: false,
              showCount: true,
            },
            "Kanban board": {
              row: "Navigation",
              icon: "board",
              label: "Kanban board",
              showActions: false,
              showCount: true,
            },
            "Space Explorer": {
              row: "Navigation",
              icon: "explorer",
              label: "Space Explorer",
              showActions: false,
              showCount: true,
            },
            Account: {
              row: "Account",
              label: "Avery Chen",
              showActions: false,
              showCount: false,
            },
          };
          if (presets[value]) setConfig((c) => ({ ...c, ...presets[value] }));
        }}
      />
      <Choice
        label="Row composition"
        value={config.row}
        values={["Navigation", "File", "Folder", "Account"]}
        onChange={(v) =>
          setConfig((c) => {
            const icon: IconName =
              v === "Folder"
                ? "folder"
                : v === "File"
                ? "text"
                : v === "Navigation" &&
                  !navigationIconNames.some((icon) => icon === c.icon)
                ? "file"
                : c.icon;
            return {
              ...c,
              row: v,
              icon,
              ...(v === "Navigation"
                ? { label: railIconDefinitions[icon].label }
                : {}),
              showActions: v === "File" || v === "Folder",
              showCount: v !== "Account",
            };
          })
        }
      />
      <label className="rail-lab-field">
        Label
        <Input
          value={config.label}
          disabled={config.row === "Navigation"}
          onChange={(e) => set("label", e.target.value)}
        />
      </label>
      <Choice
        label="Density preview"
        value={config.density}
        values={["default", "compact", "dense"]}
        onChange={(v) => set("density", v)}
      />
      <Choice
        label="Icon"
        value={config.icon}
        values={
          config.row === "Folder"
            ? ["folder"]
            : config.row === "File"
            ? ["text", "html"]
            : config.row === "Navigation"
            ? [...navigationIconNames]
            : [config.icon]
        }
        onChange={(v) =>
          setConfig((c) => ({
            ...c,
            icon: v as IconName,
            ...(c.row === "Navigation"
              ? { label: railIconDefinitions[v as IconName].label }
              : {}),
          }))
        }
      />
      <Choice
        label="Actions scenario"
        value={config.menuScenario}
        values={[
          "Writable",
          "Read-only",
          "Connector protected",
          "Capabilities available",
        ]}
        onChange={(v) => set("menuScenario", v)}
      />
      <Choice
        label="Icon size"
        value={config.iconSize}
        values={["12", "14", "16", "20"]}
        onChange={(v) => set("iconSize", v)}
      />
      <Choice
        label="Depth"
        value={config.depth}
        values={["0", "1", "2", "3"]}
        onChange={(v) => set("depth", v)}
      />
      <label className="rail-lab-field">
        Signals for the example file
        <Input
          type="number"
          min={0}
          value={config.count}
          onChange={(e) => set("count", e.target.value)}
        />
      </label>
      {config.row === "Navigation" && config.icon === "signals" && (
        <label className="rail-lab-field">
          Total notifications across this Space
          <Input
            type="number"
            min={0}
            value={config.notifications}
            onChange={(event) => set("notifications", event.target.value)}
          />
        </label>
      )}
      <Check
        label="Leading icon"
        checked={config.showIcon}
        onChange={(v) => set("showIcon", v)}
      />
      <Check
        label="Listening"
        disabled={config.row !== "File"}
        checked={config.row === "File" && config.listening}
        onChange={(v) => set("listening", v)}
      />
      <Check
        label="Locked"
        disabled={config.row !== "File" && config.row !== "Folder"}
        checked={
          (config.row === "File" || config.row === "Folder") && config.locked
        }
        onChange={(v) => set("locked", v)}
      />
      <Check
        label="Count badges"
        checked={config.showCount}
        onChange={(v) => set("showCount", v)}
      />
      <Check
        label="Row actions"
        checked={config.showActions}
        onChange={(v) => set("showActions", v)}
      />
      <Check
        label="Current page"
        checked={config.current}
        onChange={(v) => set("current", v)}
      />
      <Check
        label="Has children"
        checked={config.hasChildren}
        onChange={(v) => set("hasChildren", v)}
      />
      <Check
        label="Expanded"
        checked={config.expanded}
        onChange={(v) => set("expanded", v)}
      />
      <Check
        label="Disabled"
        checked={config.disabled}
        onChange={(v) => set("disabled", v)}
      />
    </div>
  );
  const spaceSelector = <NavigationSpacePicker id={spaceTriggerId} value={space} label="Preview Space" className="rail-lab-space-trigger" contentClassName="rail-lab-space-options"
    spaces={[{ id: "studio", name: "Studio" }, { id: "private", name: "Private", private: true }, ...extraSpaces.map(name => ({ id: name, name }))].map(option => ({ ...option, signals: flattenFiles(space === option.id ? testFiles : spaceFixtures.current[option.id] ?? (["studio", "private"].includes(option.id) ? seedFiles : [])).reduce((sum, { node }) => sum + (node.signals ?? 0), 0) }))}
    onValueChange={setSpace} onAdd={() => { setNewSpaceName(""); setNewSpaceOpen(true); }} />;
  const htmlPrompt = `Create an HTML file in Avalandra in the Space "${spaceName}". Ask me what the file should contain before creating it. Follow Avalandra's HTML authoring and accessibility requirements, support light and dark themes and responsive layouts, and return a link to the saved file.`;
  const createMenu = config.menuScenario !== "Read-only" && config.menuScenario !== "Connector protected" && (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={createTrigger}
          variant="ghost"
          size="icon"
          className="rail-lab-target"
          aria-label="Create preview file"
          disabled={config.content === "Loading"}
        >
          <RailIcon purpose="create" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        aria-label="Create in Files"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (!creatingKind) createTrigger.current?.focus();
        }}
      >
        <DropdownMenuLabel>Create in {spaceName}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => beginCreate("folder")}>
          <RailIcon purpose="folder" size={16} /> Create Folder
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => beginCreate("text")}>
          <RailIcon purpose="text" size={16} /> Create File
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { setHtmlCopyStatus(""); setHtmlPromptOpen(true); }}>
          <RailIcon purpose="html" size={16} /> HTML file — copy agent prompt…
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Local preview only</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  const creationForm = creatingKind && (
    <form
      className="rail-lab-row"
      onSubmit={(event) => {
        event.preventDefault();
        finishCreate();
      }}
    >
      {creatingKind === "folder" ? (
        <RailIcon purpose="folder" size={16} />
      ) : (
        <RailIcon purpose="text" size={16} />
      )}
      <Input
        autoFocus
        required
        aria-label={
          creatingKind === "folder" ? "New folder name" : "New file name"
        }
        placeholder={creatingKind === "folder" ? "Folder name" : "File name"}
        value={creationName}
        onChange={(event) => setCreationName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            finishCreate(true);
          }
        }}
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={!creationName.trim()}
      >
        Create
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => finishCreate(true)}
      >
        Cancel
      </Button>
    </form>
  );
  const documentsHeading = (
    <div className="rail-lab-documents-heading">
      <Button
        variant="ghost"
        className="rail-lab-documents-toggle"
        aria-expanded={documentsOpen}
        aria-controls="rail-lab-document-list"
        onClick={() => setDocumentsOpen(!documentsOpen)}
      >
        {documentsOpen ? (
          <RailIcon purpose="collapse" size={14} />
        ) : (
          <RailIcon purpose="expand" size={14} />
        )}
        <RailIcon purpose="file" size={16} /> Files
      </Button>
      {createMenu}
    </div>
  );
  const row = (
    <DemoRow
      config={
        config.row === "Navigation" && config.icon === "signals"
          ? {
              ...config,
              count: String(totals.signals),
              notifications: String(totals.notifications),
            }
          : config
      }
      onExpand={() => set("expanded", !config.expanded)}
      onActivate={() => setMessage(`Opened ${config.label} in the preview.`)}
      onMessage={setMessage}
    />
  );
  const searchItems: RailSearchItem[] = config.content === "Populated" ? flattenFiles(testFiles).map(({ node, path }) => ({ label: node.label, path: `${spaceName} / ${path}`, icon: node.icon })) : [];
  const railSearch = (
    <NavigationRailSearch
      space={spaceName}
      items={searchItems}
      onExplore={(category) =>
        navigatePreview(
          `Space Explorer: ${category}. Resource data is not connected in this preview.`
        )
      }
      onOpen={(item) => {
        const match = flattenFiles(testFiles).find(({ path }) => `${spaceName} / ${path}` === item.path);
        if (match) selectTestFile(match.node.id);
      }}
    />
  );
  const railPreview = (
    <nav
      aria-label="Space navigation"
      className="rail-lab-full"
      id="rail-lab-navigation"
      style={{ "--rail-width": `${displayedRailWidth}px` } as React.CSSProperties}
    >
      <header>
        <label>
          Space
          {spaceSelector}
        </label>
      </header>
      {railSearch}
      <DemoRow
        config={{
          ...config,
          row: "Navigation",
          label: "Signals",
          icon: "signals",
          count: String(totals.signals),
          notifications: String(totals.notifications),
          current: selectedArea === "signals" || (selectedArea === null &&
            config.row === "Navigation" && config.icon === "signals" && config.current),
          showActions: false,
          disabled: false,
        }}
        onExpand={() => {}}
        onActivate={() => {
          setSelectedArea("signals");
          setDocumentsOpen(true);
          navigatePreview("Opened Signals in the preview.");
        }}
        onMessage={setMessage}
      />
      <div className="rail-lab-tools">
        <div role="group" aria-label="Preview navigation">
          {["Kanban board"].map((label, i) => (
            <DemoRow
              key={label}
              config={{
                ...config,
                row: "Navigation",
                label,
                icon: (["board", "explorer"] as IconName[])[i],
                current: selectedArea === "board" || (selectedArea === null &&
                  config.row === "Navigation" &&
                  config.icon === (["board", "explorer"] as IconName[])[i] &&
                  config.current),
                count: String(totals.signals),
                notifications: String(totals.notifications),
                showCount: false,
                showActions: false,
                disabled: false,
              }}
              onExpand={() => {}}
              onActivate={() => {
                setSelectedArea("board");
                setDocumentsOpen(true);
                navigatePreview(`Opened ${label} in the preview.`);
              }}
              onMessage={setMessage}
            />
          ))}
        </div>
      </div>
      {documentsHeading}
      <section
        className="rail-lab-tree"
        ref={fileRegion}
        id="rail-lab-document-list"
        hidden={!documentsOpen}
        tabIndex={documentsOpen ? 0 : -1}
        aria-label="Preview files"
      >
        {creationForm}
        <div role="status" className="sr-only">
          {config.content === "Loading"
            ? "Loading files"
            : config.content === "Error"
            ? "Could not load files. Use Retry."
            : config.content === "Empty"
            ? "No files yet"
            : ""}
        </div>

        {config.content === "Populated" ? (
          <NavigationRailTestTree files={testFiles} space={spaceName} rootExpanded={config.expanded} onRootExpand={(value) => set("expanded", value)} onChange={(files) => {
            setTestFiles(files);
            if (selectedFile && !flattenFiles(files).some(({ node }) => node.id === selectedFile)) setSelectedFile(files[0]?.id ?? null);
          }}
            onTransfer={(node, destination, copy) => {
              const destinationKey = destination === "Private" ? "private" : destination === "Studio" ? "studio" : destination;
              const clone = (file: TestFile): TestFile => ({ ...file, id: crypto.randomUUID(), children: file.children?.map(clone) });
              spaceFixtures.current[destinationKey] = [...(spaceFixtures.current[destinationKey] ?? (["studio", "private"].includes(destinationKey) ? seedFiles : [])), clone(node)];
              if (!["studio", "private"].includes(destinationKey)) setExtraSpaces((spaces) => spaces.includes(destinationKey) ? spaces : [...spaces, destinationKey]);
            }}
            selected={selectedArea === null ? selectedFile : null}
            onSelect={selectTestFile}
            writable={config.menuScenario !== "Read-only" && config.menuScenario !== "Connector protected"}
            onMessage={(value) => {
              if (value.includes("HTML file — copy agent prompt")) { setHtmlCopyStatus(""); setHtmlPromptOpen(true); }
              else setMessage(value);
            }}
            renderRow={(file, depth, open, expand, activate, announce, rename) => (
              <DemoRow config={{ ...config, label: file.label,
                row: file.icon === "folder" ? "Folder" : "File", icon: file.icon,
                depth: String(depth + Number(config.depth)), expanded: open,
                current: selectedArea === null && selectedFile === file.id && config.current,
                count: String(file.signals ?? 0), notifications: "0",
                listening: file.id === "root" && config.listening,
                locked: file.id === "root" && config.locked,
              }} expandable={Boolean(file.children?.length)}
                onExpand={expand} onActivate={activate} onMessage={announce} onRenamed={rename} />
            )} />
          ) : (
            <div>
              <p className="rail-lab-empty">
                {config.content === "Loading"
                  ? "Loading files…"
                  : config.content === "Error"
                  ? "Could not load files."
                  : "No files yet."}
                {config.content === "Error" ? (
                  <Button
                    variant="link"
                    onClick={() => {
                      set("content", "Populated");
                      setMessage(
                        "Files loaded. Focus returned to the file list."
                      );
                      requestAnimationFrame(() => fileRegion.current?.focus());
                    }}
                  >
                    Retry
                  </Button>
                ) : null}
              </p>
            </div>
          )}
      </section>
      <footer><NavigationAccount name={config.row === "Account" ? config.label : "Avery Chen"} initials="AC" settingsLabel="Account settings" onAccount={() => navigatePreview("Account opened in the preview.")} onSettings={() => navigatePreview("Settings opened in the preview.")} /></footer>
    </nav>
  );
  return (
    <div className="rail-lab" style={style}>
      <PageTitle
        eyebrow="Navigation rail lab"
        title="Build from the smallest part"
        summary="Explore each element, assemble a row, then see the whole rail. Change one thing and see what it contributes."
      />
      <div
        role="group"
        className="rail-lab-levels"
        aria-label="Atomic design levels"
      >
        {levels.map((l, i) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            pressed={level === l}
            onClick={() => {
              setLevel(l);
              setMessage("");
            }}
          >
            <span className="rail-lab-step">{i + 1}</span>
            {l}
          </Button>
        ))}
      </div>
      <p className="rail-lab-note">
        Working lab · proposed compositions use real Weft primitives. Proposed
        navigation sizing uses dedicated package tokens; it does not change the existing Sidebar
        contract.
      </p>
      <section className="rail-lab-accessibility">
        <h3>Row density</h3>
        <p>
          <strong>Confirmed:</strong> {railSizingDecision}
        </p>
      </section>
      <details className="rail-lab-accessibility">
        <summary>Shared component implementation direction</summary>
        <p>
          These proposals affect other Weft consumers. The lab demonstrates the
          current rail behavior. These composition choices preserve released component contracts.
        </p>
        {railDecisions.map((decision) => (
          <section key={decision.title}>
            <h3>{decision.title}</h3>
            <p>{decision.current}</p>
            <p>
              <strong>Recommendation:</strong> {decision.recommendation}
            </p>
          </section>
        ))}
      </details>
      <NavigationRailAccessibility />
      {level === "Tokens" ? (
        <>
          <h2>Foundations shared by every element</h2>
          <div className="rail-lab-token-grid">
            {[
              ["Type", "font", "--weft-font-sans", "Destination labels"],
              ["Color", "color", "--weft-ink", "Text and semantic states"],
              [
                "Space",
                "space",
                "--weft-space-1 / --weft-space-2",
                "4px row gap/inset; 8px per hierarchy level",
              ],
              [
                "Targets",
                "control",
                "--rail-lab-target",
                "24px desktop width; 44px touch/drawer targets",
              ],
              [
                "Radius",
                "radius",
                "--weft-radius-card",
                "Control and container shape",
              ],
              [
                "Motion",
                "motion",
                "--weft-dur-fast",
                "Overlay transitions; disclosure changes immediately",
              ],
            ].map(([name, family, token, note]) => (
              <a
                className="rail-lab-token"
                href={`#/tokens/${family}`}
                key={name}
              >
                <strong>{name}</strong>
                <code>{token}</code>
                <span>{note}</span>
              </a>
            ))}
          </div>
          <h3>Rail geometry used by every preview</h3>
          <table className="rail-lab-icon-definitions">
            <caption>
              Navigation-specific sizing — published tokens stay unchanged
            </caption>
            <thead>
              <tr>
                <th scope="col">Density</th>
                <th scope="col">Row minimum</th>
                <th scope="col">Control height floor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(railDensities).map(([name, tier]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{tier.row}px</td>
                  <td>{tier.target}px</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Gap and inset: {railGeometry.gap}px. Each hierarchy level adds{" "}
            {railGeometry.indent}px. Desktop disclosure/action width:{" "}
            {railGeometry.pointerTarget}px; touch and drawer targets:{" "}
            {railGeometry.touchTarget}px. Rows can grow when controls wrap.
          </p>
          <p>
            Open a family to see its values and theme/density overrides. The
            site’s light/dark control applies to every example.
          </p>
        </>
      ) : null}
      {level === "Atoms" ? (
        <>
          <div className="rail-lab-workbench">
            <div
              role="group"
              aria-label="Rail elements"
              className="rail-lab-parts"
            >
              {atoms.map((a) => (
                <button
                  key={a.id}
                  aria-pressed={atom === a.id}
                  onClick={() => setAtom(a.id)}
                >
                  <strong>{a.name}</strong>
                  <span>{a.use}</span>
                </button>
              ))}
            </div>
            <section
              className="rail-lab-inspector"
              aria-label={`${selected.name} playground`}
            >
              <h2>{selected.name}</h2>
              <p>{selected.note}</p>
              <p className="rail-lab-adoption">
                Avalandra today: {selected.use}
              </p>
              {[
                "badge",
                "avatar",
                "search",
                "select",
                "create-menu",
                "actions-menu",
                "settings",
              ].includes(atom) && (
                <div
                  className="rail-lab-atom-stage"
                  role="group"
                  aria-label="Rail composition example"
                >
                  {atom === "search" ? (
                    railSearch
                  ) : atom === "select" ? (
                    spaceSelector
                  ) : atom === "create-menu" ? (
                    <div>
                      {createMenu}
                      {creationForm}
                    </div>
                  ) : atom === "actions-menu" ? (
                    <DemoRow
                      config={{
                        ...config,
                        row: config.row === "Folder" ? "Folder" : "File",
                        showActions: true,
                      }}
                      onExpand={() => set("expanded", !config.expanded)}
                      onActivate={() => setMessage("Opened file in preview.")}
                      onMessage={setMessage}
                    />
                  ) : atom === "settings" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rail-lab-target"
                      aria-label="Account settings"
                      onClick={() =>
                        setMessage("Account settings requested in the preview.")
                      }
                    >
                      <RailIcon purpose="settings" size={16} />
                    </Button>
                  ) : atom === "avatar" ? (
                    <div className="rail-lab-space-identity">
                      {spaceIdentity("Studio")}
                      {spaceIdentity("Private", true, space === "private" ? totals.signals : flattenFiles(spaceFixtures.current.private ?? seedFiles).reduce((sum, { node }) => sum + (node.signals ?? 0), 0))}
                      <Avatar className="size-7">
                        <AvatarFallback className="rail-lab-account-initials">
                          AC
                        </AvatarFallback>
                      </Avatar>
                      <span>Account</span>
                    </div>
                  ) : (
                    <div>
                      <p>File: its own positive signals only</p>
                      <DemoRow
                        config={{
                          ...config,
                          row: "File",
                          icon: "text",
                          showCount: true,
                          showActions: false,
                        }}
                        onExpand={() => {}}
                        onActivate={() => setMessage("Opened file in preview.")}
                        onMessage={setMessage}
                      />
                      <p>Signals: both Space totals</p>
                      <DemoRow
                        config={{
                          ...config,
                          row: "Navigation",
                          icon: "signals",
                          label: "Signals",
                          count: String(totals.signals),
                          notifications: String(totals.notifications),
                          showCount: true,
                          showActions: false,
                          current: false,
                        }}
                        onExpand={() => {}}
                        onActivate={() =>
                          setMessage("Opened Signals in the preview.")
                        }
                        onMessage={setMessage}
                      />
                    </div>
                  )}
                  {["badge", "actions-menu"].includes(atom) && controls}
                  <p className="rail-lab-note">
                    This composition is shared with the rail. The primitive
                    reference below explores the wider Weft API independently.
                  </p>
                </div>
              )}
              {selected.component ? (
                <Playground key={selected.component} id={selected.component} />
              ) : ["create-menu", "actions-menu", "settings"].includes(
                  atom
                ) ? null : (
                <div data-playground={atom} className="rail-lab-atom-stage">
                  <div className="rail-lab-sample">
                    {atom === "icon" ? (
                      <RailIconWithStatus
                        icon={inspectedIcon}
                        size={Number(config.iconSize)}
                        listening={config.listening}
                        locked={config.locked}
                      />
                    ) : atom === "label" ? (
                      <span style={{ fontFamily: "var(--weft-font-sans)" }}>
                        {config.label}
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rail-lab-target"
                        aria-label={
                          config.expanded
                            ? "Collapse example"
                            : "Expand example"
                        }
                        aria-expanded={config.expanded}
                        onClick={() => set("expanded", !config.expanded)}
                      >
                        {config.expanded ? (
                          <RailIcon
                            purpose="collapse"
                            size={Number(config.iconSize)}
                          />
                        ) : (
                          <RailIcon
                            purpose="expand"
                            size={Number(config.iconSize)}
                          />
                        )}
                      </Button>
                    )}
                  </div>
                  {atom === "icon" && (
                    <div role="group" aria-label="Avalandra file types">
                      <h3>{railIconDefinitions[inspectedIcon].label}</h3>
                      <p>{railIconDefinitions[inspectedIcon].meaning}</p>
                      <p>
                        <strong>Do not use for:</strong>{" "}
                        {railIconDefinitions[inspectedIcon].notFor}
                      </p>
                      <details>
                        <summary>
                          Semantic definitions for every rail icon
                        </summary>
                        <table className="rail-lab-icon-definitions">
                          <caption>
                            Rail icon contract: choose a meaning, not a shape
                          </caption>
                          <thead>
                            <tr>
                              <th scope="col">Icon</th>
                              <th scope="col">Meaning</th>
                              <th scope="col">Do not use for</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(railIconDefinitions).map(
                              ([purpose, definition]) => (
                                <tr key={purpose}>
                                  <th scope="row">
                                    <RailIcon
                                      purpose={purpose as RailIconName}
                                    />{" "}
                                    {definition.label}
                                  </th>
                                  <td>{definition.meaning}</td>
                                  <td>{definition.notFor}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </details>

                      <p>
                        File type stays visible when a file has children. The
                        disclosure arrow represents nesting. Ear and lock
                        sub-icons show listening and locked states; both can
                        appear together. These are visual previews, independent
                        of the Actions scenario.
                      </p>
                      <p>
                        <RailIcon purpose="text" size={16} /> Text file ·{" "}
                        <RailIcon purpose="html" size={16} /> HTML file ·{" "}
                        <RailIcon purpose="folder" size={16} /> Folder
                      </p>
                      <p>
                        Avalandra supports all three in its file tree. Text and
                        HTML files can also be parents. Attachments inside files
                        are not separate sidebar file types.
                      </p>
                    </div>
                  )}
                  <div className="rail-lab-controls">
                    {atom === "label" ? (
                      <label className="rail-lab-field">
                        Label
                        <Input
                          value={config.label}
                          disabled={config.row === "Navigation"}
                          onChange={(e) => set("label", e.target.value)}
                        />
                      </label>
                    ) : (
                      <>
                        <Choice
                          label="Icon size"
                          value={config.iconSize}
                          values={["12", "14", "16", "20"]}
                          onChange={(v) => set("iconSize", v)}
                        />
                        {atom === "icon" ? (
                          <>
                            <Check
                              label="Listening"
                              disabled={!supportsListening(inspectedIcon)}
                              checked={
                                supportsListening(inspectedIcon) &&
                                config.listening
                              }
                              onChange={(v) => set("listening", v)}
                            />
                            <Check
                              label="Locked"
                              disabled={!supportsLock(inspectedIcon)}
                              checked={
                                supportsLock(inspectedIcon) && config.locked
                              }
                              onChange={(v) => set("locked", v)}
                            />
                            <Choice
                              label="Icon purpose"
                              value={inspectedIcon}
                              values={Object.keys(railIconDefinitions)}
                              onChange={(v) => {
                                setInspectedIcon(v as RailIconName);
                                if (v === "text" || v === "html")
                                  setConfig((c) => ({
                                    ...c,
                                    icon: v,
                                    row: "File",
                                  }));
                                else if (v === "folder")
                                  setConfig((c) => ({
                                    ...c,
                                    icon: v,
                                    row: "Folder",
                                  }));
                                else if (
                                  [...navigationIconNames].includes(
                                    v as (typeof navigationIconNames)[number]
                                  )
                                )
                                  setConfig((c) => ({
                                    ...c,
                                    icon: v as IconName,
                                    row: "Navigation",
                                    label:
                                      railIconDefinitions[v as RailIconName]
                                        .label,
                                  }));
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <Choice
                              label="Density preview"
                              value={config.density}
                              values={["default", "compact", "dense"]}
                              onChange={(v) => set("density", v)}
                            />
                            <Check
                              label="Expanded"
                              checked={config.expanded}
                              onChange={(v) => set("expanded", v)}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              <details>
                <summary>Variables used</summary>
                <code>{selected.tokens}</code>
                <p>
                  For Weft components, the playground above lists the existing
                  variant axes and named states. Icon, label and disclosure
                  controls are lab options, not new package props.
                </p>
              </details>
            </section>
          </div>
          <p>
            Next:{" "}
            <Button variant="link" onClick={() => setLevel("Rows")}>
              Combine the elements into rows →
            </Button>
          </p>
        </>
      ) : null}
      {level === "Rows" ? (
        <>
          <h2>One row, built from visible parts</h2>
          <p>
            The controls here are shared with the complete rail. Icons, labels
            and disclosure choices also carry over from the atom examples.
          </p>
          <section aria-label="Files parent row example">
            <h3>Files parent</h3>
            <p className="rail-lab-note">
              Disclosure + destination icon + label + create menu. Files expand
              beneath this row; its expansion is independent of individual file
              rows.
            </p>
            <div style={{ maxWidth: "360px" }}>
              {documentsHeading}
              <div
                role="list"
                id="rail-lab-document-list"
                hidden={!documentsOpen}
              >
                {creationForm}
                <NestedSample
                  node={{ label: "Example file", icon: "text" }}
                  depth={0}
                  config={config}
                  onMessage={setMessage}
                />
              </div>
            </div>
          </section>
          <section
            aria-label="Row state comparison"
            className="rail-lab-state-grid"
          >
            {[
              ["Rest", false, "rest"],
              ["Hover", false, "hover"],
              ["Pressed", false, "pressed"],
              ["Keyboard focus", false, "focus"],
              ["Current page", true, "rest"],
              ["Current + hover", true, "hover"],
              ["Current + keyboard focus", true, "focus"],
              ["Disabled", false, "disabled"],
            ].map(([label, current, state]) => (
              <div key={String(label)}>
                <h3>{label}</h3>
                <DemoRow
                  expandable={false}
                  previewState={String(state)}
                  config={{
                    ...config,
                    count:
                      config.row === "Navigation" && config.icon === "signals"
                        ? String(totals.signals)
                        : config.count,
                    notifications:
                      config.row === "Navigation" && config.icon === "signals"
                        ? String(totals.notifications)
                        : config.notifications,
                    label: `${config.label} — ${label}`,
                    current: Boolean(current),
                    disabled: state === "disabled",
                  }}
                  onExpand={() => {}}
                  onActivate={() => setMessage(`${label} example activated.`)}
                  onMessage={setMessage}
                />
              </div>
            ))}
          </section>
          <p className="rail-lab-note">
            These examples pin the visual states for comparison. Current page is
            persistent; hover and pressed are temporary. Focus belongs to the
            keyboard control. Expanded, actions-menu open and renaming are
            independent behaviors you can try below.
          </p>
          <div className="rail-lab-composition">
            <div className="rail-lab-stage">
              <div className="rail-lab-recipe">
                {config.row === "Account"
                  ? "Avatar"
                  : config.row === "Navigation"
                  ? "Icon"
                  : "Disclosure + icon"}{" "}
                + label
                {config.showCount && config.row === "File"
                  ? " + file signals"
                  : config.showCount &&
                    config.row === "Navigation" &&
                    config.icon === "signals"
                  ? " + Space signals + Space notifications"
                  : ""}
                {config.row === "Account"
                  ? " + settings"
                  : config.showActions &&
                    (config.row === "File" || config.row === "Folder")
                  ? " + actions (hover/focus)"
                  : ""}
              </div>
              {row}
              <p className="rail-lab-note">
                {config.row === "Account"
                  ? "Activate the account name or its settings button."
                  : config.row === "Navigation"
                  ? "Activate the destination. Signals received and total notifications are separate labeled counts."
                  : "Expand children independently of opening a file. Actions appear on hover or keyboard focus. Rename is local; Enter confirms and Escape cancels."}
              </p>
              <details>
                <summary>What Avalandra uses today</summary>
                <p>
                  Navigation: custom link layout + Weft Badge. File: custom row
                  and disclosure + Weft ContextMenu and rename Input. Account:
                  custom avatar and layout. Shared navigation rows, identity, search, action menus and responsive layout are now exported from Weft; Avalandra adoption remains pending.
                </p>
              </details>
            </div>
            {controls}
          </div>
          <Button variant="link" onClick={() => setLevel("Rail")}>
            See the complete rail →
          </Button>
        </>
      ) : null}
      {level === "Rail" ? (
        <>
          <h2>Combine the rows into the complete rail</h2>
          <p>
            Signals sits above Files and its scrolling file tree. Kanban board sits below Signals; Files stays expanded; Explorer filters are beside Search.
            The highlighted example row uses your choices from Rows.
          </p>
          <p><a href="https://nodaste.hub.avalandra.com/d/52679eb9-62ce-4c2d-978a-8f84d1af6bae">Open the prototype usability test kit</a> · Uses fictional local data; production integration remains separate.</p>
          <div className="rail-lab-composition">
            <div className="rail-lab-stage">
              <div className="rail-lab-responsive-preview">
                <NavigationRailLayout rail={railPreview} railId="rail-lab-navigation" label="Space navigation" openLabel="Open navigation" resizeLabel="Resize navigation rail" description="Browse files and switch destinations. Escape or Close dismisses navigation."
                  width={Number(config.width)} onWidthChange={(width) => set("width", String(width))} onAvailableWidthChange={setMaxRailWidth}
                  mode={device === "Auto" ? "auto" : device === "Desktop" ? "desktop" : "drawer"} open={railOpen} onOpenChange={setRailOpen} drawerClassName="rail-lab-drawer" style={style}>
                  <div className="rail-lab-preview-content"><h3>{selectedArea === "signals" ? "Signals" : selectedArea === "board" ? "Kanban board" : flattenFiles(testFiles).find(({ node }) => node.id === selectedFile)?.node.label ?? "File workspace"}</h3>
                    <p>{selectedArea ? `${spaceName} / ${selectedArea === "signals" ? "Signals" : "Kanban board"}` : flattenFiles(testFiles).find(({ node }) => node.id === selectedFile)?.path}</p>
                    <p>Resize the rail by dragging its edge or using the arrow keys. On small screens, navigation opens as a drawer.</p></div>
                </NavigationRailLayout>
              </div>
            </div>
            <div>
              {controls}
              <div className="rail-lab-controls">
                <Choice
                  label="Device preview"
                  value={device}
                  values={["Auto", "Desktop", "Tablet", "Phone"]}
                  onChange={(value) => {
                    setDevice(value);
                    setRailOpen(false);
                  }}
                />
                <p className="rail-lab-note">
                  Auto: persistent rail from 1024px; drawer below. Phone and
                  tablet modes let you try the drawer at any window size.
                </p>
                <Check
                  label="Long file list"
                  checked={longList}
                  onChange={setLongList}
                />
                <label className="rail-lab-field">
                  Rail width: {config.width}px
                  <Input
                    type="range"
                    aria-label="Rail width"
                    min={200}
                    max={maxRailWidth}
                    step={1}
                    value={config.width}
                    onChange={(event) => set("width", event.target.value)}
                  />
                </label>
                <Choice
                  label="File content"
                  value={config.content}
                  values={["Populated", "Empty", "Loading", "Error"]}
                  onChange={(v) => set("content", v)}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
      <NavigationRailParity />
      <Dialog open={htmlPromptOpen} onOpenChange={setHtmlPromptOpen}>
        <DialogContent onCloseAutoFocus={(event) => {
          event.preventDefault(); createTrigger.current?.focus();
        }}>
          <DialogTitle>Create an HTML file with your agent</DialogTitle>
          <DialogDescription>Copy this prompt to your agent. This does not create a file directly.</DialogDescription>
          <label className="rail-lab-field">Agent prompt
            <Textarea readOnly value={htmlPrompt} onFocus={(event) => event.target.select()} />
          </label>
          <Button variant="outline" onClick={async () => {
            try {
              await navigator.clipboard.writeText(htmlPrompt);
              setHtmlCopyStatus("Prompt copied. Paste it into your agent.");
            } catch {
              setHtmlCopyStatus("Could not copy automatically. Select the prompt and copy it manually.");
            }
          }}>Copy prompt</Button>
          <p role="status">{htmlCopyStatus}</p>
        </DialogContent>
      </Dialog>
      <Dialog open={newSpaceOpen} onOpenChange={setNewSpaceOpen}>
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            requestAnimationFrame(() =>
              document.getElementById(spaceTriggerId)?.focus()
            );
          }}
        >
          <DialogTitle>Add new Space</DialogTitle>
          <DialogDescription>
            Create a Space in this local preview.
          </DialogDescription>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const name = newSpaceName.trim();
              if (!name) return;
              if (
                !["Studio", "Private", "__add-space", ...extraSpaces].some(
                  (existing) =>
                    existing.toLocaleLowerCase() === name.toLocaleLowerCase()
                )
              ) {
                setExtraSpaces((names) => [...names, name]);
                setSpace(name);
                setNewSpaceOpen(false);
                setMessage(
                  `Created Space “${name}” in the local preview only.`
                );
              }
            }}
          >
            <label>
              Space name
              <Input
                value={newSpaceName}
                aria-describedby="rail-lab-space-name-help"
                onChange={(event) => setNewSpaceName(event.target.value)}
                required
              />
            </label>
            <p id="rail-lab-space-name-help">
              Use a unique Space name. Studio, Private and existing names are
              unavailable.
            </p>
            <Button
              type="submit"
              disabled={
                !newSpaceName.trim() ||
                ["Studio", "Private", "__add-space", ...extraSpaces].some(
                  (name) =>
                    name.toLocaleLowerCase() ===
                    newSpaceName.trim().toLocaleLowerCase()
                )
              }
            >
              Create Space
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <p role="status" className="rail-lab-status">
        {message}
      </p>
      <section
        className="rail-lab-feedback-notes"
        aria-label="Feedback on this example"
      >
        <h2>Notes on {noteKey}</h2>
        <label className="rail-lab-field">
          What would you change?
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what works or what needs to change in this element."
          />
        </label>
        <div className="rail-lab-feedback">
          <Button
            disabled={!note.trim()}
            onClick={() => {
              const next = [
                ...notes.filter((n) => n.key !== noteKey),
                {
                  key: noteKey,
                  text: note,
                  options: {
                    ...config,
                    ...(level === "Atoms" && atom === "icon"
                      ? { inspectedIcon }
                      : {}),
                  },
                },
              ];
              try {
                localStorage.setItem(
                  "weft:rail-lab:notes",
                  JSON.stringify(next)
                );
                setNotes(next);
                setMessage(`Saved note on ${noteKey}.`);
              } catch {
                setMessage(
                  "Browser storage is unavailable. Copy your note before leaving."
                );
              }
            }}
          >
            Save note
          </Button>
          <Button
            variant="outline"
            disabled={!notes.length}
            onClick={() => {
              const text = notes
                .map(
                  (n) =>
                    `## ${n.key}\n\n${n.text}\n\nOptions: ${JSON.stringify(
                      n.options
                    )}\n`
                )
                .join("\n");
              const url = URL.createObjectURL(
                new Blob([text], { type: "text/markdown" })
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = "weft-navigation-rail-notes.md";
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Export notes ({notes.length})
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setConfig(initial); setLongList(true); setTestFiles(makeTestFiles(initial, true)); setSelectedFile("root"); setSelectedArea(null); setDocumentsOpen(true); spaceFixtures.current = {};
              setMessage("Examples reset.");
            }}
          >
            Reset examples
          </Button>
          <span>
            Notes and shared row options are saved in this browser. Include any
            primitive playground variants in your note, then export to share
            feedback.
          </span>
        </div>
        {notes.length ? (
          <details>
            <summary>Saved notes</summary>
            {notes.map((n) => (
              <div key={n.key}>
                <strong>{n.key}</strong>
                <p>{n.text}</p>
              </div>
            ))}
          </details>
        ) : null}
      </section>
    </div>
  );
}
