import React from "react";
import { Textarea } from "../../../src/ui/textarea";

const commit = "c8a57cce6ecc88a259cc5e64f4eed74941ceab7d";
type Coverage =
  | "Intentional change"
  | "Missing"
  | "Partial local"
  | "Preview only"
  | "Decision needed"
  | "Local behavior";
export const railParity: {
  id: string;
  title: string;
  status: Coverage;
  confirmedDecision?: "Retain" | "Redesign";
  existing: string;
  gap: string;
  source: string;
}[] = [
  {
    id: "space-actions",
    confirmedDecision: "Redesign",
    title: "Space management",
    status: "Intentional change",
    existing:
      "Space actions include Add User to Space, View users, Change sharing, Export, and New shared space. Private exposes Export and New shared space.",
    gap: "Confirmed: Space management moves to Settings; no separate Space actions menu is required in the rail. Preserve membership, sharing and export functionality there. Add new remains available in the Space picker. Settings destination/service wiring remains a prototype gap.",
    source: "space-row-actions.ts",
  },
  {
    id: "organization",
    confirmedDecision: "Redesign",
    title: "Organization switching",
    status: "Intentional change",
    existing:
      "Account area shows an Organization switcher when multiple Organizations are accessible.",
    gap: "Confirmed: Organization switching moves to Settings. No Organization switcher is required in the rail. Preserve access to switching between accessible Organizations in Settings; Settings destination/service wiring remains a prototype gap.",
    source: "organization-switcher.tsx",
  },
  {
    id: "explorer",
    confirmedDecision: "Redesign",
    title: "Explorer-specific navigation",
    status: "Intentional change",
    existing:
      "Space Explorer replaces the file list with scoped object-category navigation.",
    gap: "Confirmed: Space Explorer is represented by the filter control beside Search, replacing the pinned Explorer row. Categories are available in its menu; resource routing, real category data and selected scope remain prototype gaps.",
    source: "sidebar-explorer-sections.tsx",
  },
  {
    id: "routing",
    confirmedDecision: "Retain",
    title: "Destination links and remembered navigation",
    status: "Preview only",
    existing:
      "File and destination anchors support real URLs. Space switching preserves the tool when supported, restores last file and saved Signals lens, and falls back from unsupported Kanban.",
    gap: "Preserve existing behavior during migration; no product decision or intentional accessibility change is required. Destinations must remain real links, with browser history, new-tab support and remembered navigation. Lab buttons only announce preview messages, so production routing remains unverified. See Accessibility requirements for acceptance checks.",
    source: "sidebar.tsx",
  },
  {
    id: "signals-scope",
    confirmedDecision: "Redesign",
    title: "Signals row total",
    status: "Intentional change",
    existing:
      "Badge counts waiting assigned Signals across accessible Spaces; destination resolves an eligible Space and restores its saved lens.",
    gap: "Confirmed: count only signals awaiting action. Each file shows its own awaiting-action signals, hides zero and shows no notifications. The Signals row totals cover the selected Space, and the Space picker shows each Space’s positive awaiting-action signal count. Studio and Private reuse sample data in this lab; live per-Space counts and action-status filtering remain integration requirements. The signal-count design decision is complete.",
    source: "sidebar-navigation.tsx",
  },
  {
    id: "conditional-tools",
    confirmedDecision: "Redesign",
    title: "Conditional destinations and content",
    status: "Intentional change",
    existing:
      "Kanban appears only where enabled; Signals needs an eligible destination. File tree is shown in Documents; Explorer has its own region; Kanban/Signals leave that region empty.",
    gap: "Confirmed: selecting Signals or Kanban marks that area as current and keeps Files visible and expanded; these tools have no sidebar subsections. For a future top-level item with its own expandable panel, opening that panel collapses Files to make room for its content. Preserve capability gating: only offer tools available in the selected Space. Live tool availability remains an integration requirement.",
    source: "sidebar.tsx",
  },
  {
    id: "context",
    confirmedDecision: "Retain",
    title: "Alternative menu entry points",
    status: "Partial local",
    existing:
      "Row right-click, touch long-press, Shift+F10 / ContextMenu key open the same actions. F2 starts rename.",
    gap: "Confirmed: retain row right-click, touch long-press, Shift+F10 and the Context Menu key to open the same permission-appropriate actions menu, plus F2 to start rename when allowed. The ellipsis remains an alternative. These entry points work in the local prototype. Physical long-press, assistive-technology compatibility and production permission integration still need acceptance testing.",
    source: "tree-context-menu.tsx",
  },
  {
    id: "mobile-menu",
    confirmedDecision: "Retain",
    title: "Mobile file actions and nested-file access",
    status: "Partial local",
    existing:
      "Compact action menus drill into groups with back navigation rather than relying only on cascading submenus.",
    gap: "Confirmed direction: prioritize accessible selection of nested files. Retain mobile action menus that show one group at a time with an explicit Back control, rather than sideways cascading menus on narrow screens. This concerns actions on a file; the file hierarchy remains visible in the drawer with separate expand and open controls, full accessible names and parent context. Mobile menu drill-in and Back focus work locally; touch-device and screen-reader acceptance testing remain pending.",
    source: "tree-menu-content.tsx",
  },
  {
    id: "reorder",
    confirmedDecision: "Redesign",
    title: "Drag and sibling reorder",
    status: "Partial local",
    existing:
      "Drag supports tree placement, with Move up/down alternatives and boundary eligibility.",
    gap: "Confirmed: retain drag-and-drop tree placement and sibling reordering. Remove Move up and Move down from the actions menu, while providing keyboard-accessible move-up/down reordering outside that menu. Preserve permissions, valid placement and boundary rules. The local tree implements drag/drop, Alt+Up/Down sibling moves, and Alt+M or Move… for a non-drag destination picker. Changes announce and preserve focus; live tree placement and human acceptance remain pending.",
    source: "tree-drag.ts",
  },
  {
    id: "large-tree",
    confirmedDecision: "Retain",
    title: "Large and asynchronous file lists",
    status: "Partial local",
    existing:
      "Root/child paging offers Show more; selected/expanded/editing rows remain mounted. Expansion loads children and guards against late responses from an old Space.",
    gap: "Confirmed: retain Avalandra’s existing performance and loading behavior: page root and child lists with Show more, load children on expansion, keep selected/expanded/editing rows mounted, and reject late responses from a previously selected Space. Preserve prefetch and loading/error recovery behavior during migration. The local tree pages long sibling lists with Show more and retains the selected file and ancestors. Server child loading, prefetch, stale-response protection and live-data performance remain production integration requirements.",
    source: "tree.tsx",
  },
  {
    id: "expansion",
    title: "Expand, collapse and file identity",
    status: "Local behavior",
    existing:
      "Disclosure is separate from opening. Files retain type icons; folders expand. Current file ancestry influences expansion.",
    gap: "Nested disclosure, folder-title expansion, live local selection, and revealing a selected file’s ancestors work in the test tree. Server refresh and production routing integration remain unverified; no new product decision is required.",
    source: "tree-branch.tsx",
  },
  {
    id: "create",
    confirmedDecision: "Redesign",
    title: "Root and child creation",
    status: "Partial local",
    existing:
      "Root folder/text creation; child file/folder choices; optimistic insertion, server save, discard, validation and focus recovery.",
    gap: "Root and child file/folder naming work with local test data and validation. Real server save, pending and failure flows remain integration requirements. Confirmed: HTML creation is offered as a copyable prompt to the user’s agent, rather than direct sidebar creation. The root create menu provides that prompt with manual-copy fallback. Child menus also offer the prompt; agent-created file integration remains external to this prototype.",
    source: "tree.tsx",
  },
  {
    id: "actions",
    title: "Duplicate, move, remove and transfer",
    status: "Partial local",
    existing:
      "Subtree-aware duplicate/removal dialogs, within-Space move and eligible cross-Space transfer, with permission/protection rules and errors.",
    gap: "Local fixtures support duplicate, within-Space destination and placement selection, cross-Space copy/move, subtree removal confirmation and Undo. Cross-Space copies appear in the destination fixture Space. Server permissions, transfer failures, progress and durable results remain unverified.",
    source: "tree-action-dialogs.tsx",
  },
  {
    id: "more",
    title: "PDF, review, statuses and versions",
    status: "Preview only",
    existing:
      "Conditional PDF export, Copy link, Mark reviewed, HTML board columns, working status, and view/save/restore versions.",
    gap: "Menu structure is represented. Clipboard/download, real columns, status persistence, review updates and version dialogs are not functional.",
    source: "tree-menu-content.tsx",
  },
  {
    id: "permissions",
    title: "Permissions and connector protection",
    status: "Preview only",
    existing:
      "Writable/read-only roles, protected items, connector management and eligible transfer targets determine each action.",
    gap: "Fixture scenarios are selectable but no actual role/capability data controls them. Generic locked status must not replace connector-protection semantics.",
    source: "tree-menu-content.tsx",
  },
  {
    id: "space-create",
    title: "Create shared Space",
    status: "Partial local",
    existing:
      "Creation collects Name, Handle and Description and routes to the created Space after server success.",
    gap: "Local Add new asks only for a name. Missing handle validation, description, save/error states and real navigation.",
    source: "space-create.tsx",
  },
  {
    id: "account",
    confirmedDecision: "Redesign",
    title: "Account identity and Settings",
    status: "Preview only",
    existing:
      "Viewer name/email load dynamically. Account link opens scoped General Settings; Organization control is adjacent.",
    gap: "Confirmed: account email belongs in Settings and is intentionally omitted from the sidebar to reduce PII exposure during usability testing. Keep the sidebar’s account name/initials and Settings entry. The lab uses a fictional identity and message-only Settings; live identity and the scoped Settings destination remain integration gaps.",
    source: "sidebar-profile-row.tsx",
  },
  {
    id: "resize",
    confirmedDecision: "Retain",
    title: "Resize behavior and persistence",
    status: "Partial local",
    existing:
      "Stored width survives reload: 276px default, 220–480px range, 16px arrows / 64px Shift-arrows and Home/End.",
    gap: "Confirmed: remember the user’s chosen desktop width and restore it after refresh. Small screens use the responsive drawer without overwriting the saved desktop width; returning to desktop restores that preference, constrained only by available screen space. Drag, keyboard and slider resizing work locally and chosen desktop width is restored from browser storage without narrow-view clamping overwriting it. Preserve Avalandra’s existing keyboard resize shortcuts during migration. These are implementation requirements, not an open design decision.",
    source: "navigation-resizer.tsx",
  },
  {
    id: "recovery",
    title: "Unavailable Space list and action errors",
    status: "Missing",
    existing:
      "Incomplete Space-list notice offers Retry. Tree expansion and service actions report failures without silently losing context.",
    gap: "Generic file loading/error examples exist, but incomplete Space list, action-specific errors, lost access and unavailable destinations need explicit scenarios.",
    source: "space-list-notice.tsx",
  },
  {
    id: "approved-design",
    confirmedDecision: "Redesign",
    title: "Requested design changes",
    status: "Local behavior",
    existing:
      "Current layout separates Documents navigation from its tree and puts tools together; file rows do not carry the prototype's signal counters.",
    gap: "User-directed design: Signals above Files, nested files beneath Files, Kanban below Signals and Explorer represented by Search filters, file-only signals with zero hidden, Space identity treatment and trailing Settings. These are design changes, not evidence of backend parity.",
    source: "sidebar-navigation.tsx",
  },
];
const key = "weft-rail-parity-decisions-v1";
type Notes = Record<string, { decision: string; note: string }>;
export function NavigationRailParity() {
  const [filter, setFilter] = React.useState("All");
  const [saved, setSaved] = React.useState("");
  const [notes, setNotes] = React.useState<Notes>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? "{}");
      if (!stored || typeof stored !== "object" || Array.isArray(stored))
        return {};
      return Object.fromEntries(
        railParity.map((item) => {
          const entry = stored[item.id];
          return [
            item.id,
            {
              decision: [
                "Undecided",
                "Retain",
                "Intentionally remove",
                "Redesign",
              ].includes(entry?.decision)
                ? entry.decision
                : item.confirmedDecision ?? "Undecided",
              note: typeof entry?.note === "string" ? entry.note : "",
            },
          ];
        })
      );
    } catch {
      return {};
    }
  });
  function update(
    id: string,
    changes: Partial<Notes[string]>,
    announce = true
  ) {
    const next = { ...notes, [id]: { ...notes[id], ...changes } };
    setNotes(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      if (announce) setSaved("Decision saved in this browser.");
    } catch {
      setSaved("Browser storage unavailable; copy your note before leaving.");
    }
  }
  return (
    <details className="rail-lab-honesty rail-lab-accessibility" open>
      <summary>Avalandra functionality coverage — gaps and decisions</summary>
      <p>
        Source audit: Avalandra origin/main {commit.slice(0, 8)}, October 6,
        2026. This compares source behavior with the lab; it is not a live
        production acceptance test. Nothing below is assumed removed. Menu
        visibility does not mean a working flow. Decision made labels record
        confirmed direction; coverage status still identifies implementation gaps.
      </p>
      <label className="rail-lab-field">
        Coverage filter
        <select
          className="weft-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {[
            "All",
            "Decision made",
            "Intentional change",
            "Missing",
            "Partial local",
            "Preview only",
            "Decision needed",
            "Local behavior",
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <p role="status">{saved}</p>
      {railParity
        .slice()
        .sort((a, b) => {
          const priority = (item: (typeof railParity)[number]) =>
            item.confirmedDecision ? 2 : item.status === "Decision needed" ? 0 : 1;
          return priority(a) - priority(b);
        })
        .filter((item) => filter === "All" || item.status === filter ||
          (filter === "Decision made" && Boolean(item.confirmedDecision)))
        .map((item) => (
          <section key={item.id}>
            <h3>
              {item.title} · {item.confirmedDecision ? "Decision made · " : ""}{item.status}
            </h3>
            {item.confirmedDecision && (
              <p><strong>Confirmed decision:</strong> {item.confirmedDecision}.
                This direction is recorded in the project; browser feedback below
                does not replace the confirmed decision.</p>
            )}
            <p>
              <strong>Avalandra today:</strong> {item.existing}
            </p>
            <p>
              <strong>New rail / decision:</strong> {item.gap}
            </p>
            <a
              href={`https://github.com/Nodaste-Lab/ccore2/blob/${commit}/apps/web/src/${item.source}`}
              target="_blank"
              rel="noreferrer"
            >
              Source: {item.source}
            </a>
            <details>
              <summary>Record feedback for {item.title}</summary>
              <label className="rail-lab-field">
                Decision for {item.title}
                <select
                  className="weft-select"
                  value={notes[item.id]?.decision ?? item.confirmedDecision ?? "Undecided"}
                  onChange={(e) =>
                    update(item.id, { decision: e.target.value })
                  }
                >
                  {[
                    "Undecided",
                    "Retain",
                    "Intentionally remove",
                    "Redesign",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="rail-lab-field">
                Feedback for {item.title}
                <Textarea
                  value={notes[item.id]?.note ?? ""}
                  onBlur={(e) => update(item.id, { note: e.target.value })}
                  onChange={(e) =>
                    update(item.id, { note: e.target.value }, false)
                  }
                />
              </label>
            </details>
          </section>
        ))}
    </details>
  );
}
