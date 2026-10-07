import React from "react";
import {
  Activity,
  AlignLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  Ear,
  FileText,
  Folder,
  Lock,
  Menu,
  MoreHorizontal,
  Network,
  Plus,
  Settings,
  PanelTop,
  SlidersHorizontal,
} from "lucide-react";

/** Rail-specific meanings. A glyph is never selected independently of its purpose. */
export const navigationIconDefinitions = {
  filter: {
    label: "Explorer filters",
    meaning: "Open Space Explorer resource categories from the search toolbar.",
    notFor:
      "File actions, sorting, account settings or silently filtering file-name results.",
    kind: "destination",
  },
  file: {
    label: "Files",
    meaning: "The Files destination and its file collection.",
    notFor: "Individual file types, folders, creation or generic pages.",
    kind: "destination",
  },
  text: {
    label: "Text file",
    meaning: "A text file, including a text file with children.",
    notFor: "Paragraph formatting, alignment actions or HTML files.",
    kind: "file",
  },
  html: {
    label: "HTML file",
    meaning: "An HTML file, including an HTML file with children.",
    notFor: "Browser windows, arbitrary layouts or text files.",
    kind: "file",
  },
  folder: {
    label: "Folder",
    meaning: "A folder that groups files and other folders.",
    notFor: "A file merely because it has children, or a Space.",
    kind: "folder",
  },
  board: {
    label: "Kanban board",
    meaning: "The Kanban board destination.",
    notFor: "A generic table, columns control or layout switcher.",
    kind: "destination",
  },
  signals: {
    label: "Signals",
    meaning:
      "Signals awaiting action, either a file-scoped count or a selected-Space total.",
    notFor: "Notifications, loading, audio listening or generic activity.",
    kind: "count",
  },
  notifications: {
    label: "Notifications",
    meaning:
      "Total notifications across the Space, shown only on the Signals destination.",
    notFor: "Per-file badges, signals, listening status or alert severity.",
    kind: "count",
  },
  explorer: {
    label: "Space Explorer",
    meaning: "The Space Explorer destination.",
    notFor: "Folders, sharing, network connectivity or file nesting.",
    kind: "destination",
  },
  listening: {
    label: "Listening",
    meaning: "A file is being listened to; a sub-icon on its file-type icon.",
    notFor:
      "Microphone recording, audio playback, unread counts or permission state.",
    kind: "status",
  },
  locked: {
    label: "Locked",
    meaning: "An item's locked state; a sub-icon on a file or folder.",
    notFor:
      "Private Space identity, disabled controls or read-only permissions without a real lock state.",
    kind: "status",
  },
  private: {
    label: "Private Space",
    meaning: "The Private Space identity in the Space picker.",
    notFor: "An item's lock state or generic security settings.",
    kind: "identity",
  },
  settings: {
    label: "Account settings",
    meaning: "The account settings action.",
    notFor: "File actions, Space identity or expansion.",
    kind: "action",
  },
  create: {
    label: "Create or add",
    meaning:
      "Create a file/folder or add a Space, with the control label specifying the object.",
    notFor: "Expansion, selection, zoom or navigation.",
    kind: "action",
  },
  actions: {
    label: "Item actions",
    meaning: "Open the named file or folder's actions menu.",
    notFor: "Settings, creation, dragging or an unnamed generic menu.",
    kind: "action",
  },
  expand: {
    label: "Expand children",
    meaning: "Reveal the children of a collapsed Files group, file or folder.",
    notFor: "Opening the file, moving an item or indicating its file type.",
    kind: "disclosure",
  },
  collapse: {
    label: "Collapse children",
    meaning: "Hide the children of an expanded Files group, file or folder.",
    notFor: "Download, navigation or indicating its file type.",
    kind: "disclosure",
  },
  navigation: {
    label: "Open navigation",
    meaning: "Open the responsive Space navigation drawer.",
    notFor: "File actions, reordering or account settings.",
    kind: "action",
  },
} as const;

export type NavigationIconPurpose = keyof typeof navigationIconDefinitions;
export type NavigationLeadingIcon =
  | "file"
  | "text"
  | "html"
  | "folder"
  | "board"
  | "signals"
  | "explorer";
export const navigationIconNames = [
  "file",
  "board",
  "signals",
  "explorer",
] as const;
export function supportsListening(icon: NavigationIconPurpose) {
  return icon === "text" || icon === "html";
}
export function supportsLock(icon: NavigationIconPurpose) {
  return supportsListening(icon) || icon === "folder";
}

// Matches Avalandra's board glyph in apps/web/src/icons.tsx.
function KanbanOutline({ size = 16, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round"
      strokeLinejoin="round" focusable="false" {...props}>
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="10" rx="1" />
      <rect x="17" y="4" width="4" height="13" rx="1" />
    </svg>
  );
}

const railIconGlyphs = {
  filter: SlidersHorizontal,
  file: FileText,
  text: AlignLeft,
  html: PanelTop,
  folder: Folder,
  board: KanbanOutline,
  signals: Activity,
  notifications: Bell,
  explorer: Network,
  listening: Ear,
  locked: Lock,
  private: Lock,
  settings: Settings,
  create: Plus,
  actions: MoreHorizontal,
  expand: ChevronRight,
  collapse: ChevronDown,
  navigation: Menu,
} satisfies Record<NavigationIconPurpose, React.ComponentType<{ size?: number }>>;

/** Decorative only: the owning button, count or status provides its accessible name. */
export function NavigationIcon({
  purpose,
  size = 16,
}: {
  purpose: NavigationIconPurpose;
  size?: number;
}) {
  const Glyph = railIconGlyphs[purpose];
  return <Glyph size={size} aria-hidden="true" data-rail-icon={purpose} />;
}


/** Statuses only apply to the semantic item types that support them. */
export function NavigationItemIcon({ purpose, size = 16, listening = false, locked = false }: {
  purpose: NavigationIconPurpose; size?: number; listening?: boolean; locked?: boolean;
}) {
  return <span className="weft-navigation-item-icon" style={{ width: size, height: size }}>
    <NavigationIcon purpose={purpose} size={size} />
    {listening && supportsListening(purpose) && <span className="weft-navigation-item-status" data-status="listening" role="img" aria-label="Listening" title="Listening"><NavigationIcon purpose="listening" size={10} /></span>}
    {locked && supportsLock(purpose) && <span className="weft-navigation-item-status" data-status="locked" role="img" aria-label="Locked" title="Locked"><NavigationIcon purpose="locked" size={10} /></span>}
  </span>;
}
