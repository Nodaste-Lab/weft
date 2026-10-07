import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";

export type NavigationFileNode = {
  id: string;
  label: string;
  children?: NavigationFileNode[];
  /** True when children exist remotely but have not loaded. */
  hasChildren?: boolean;
};
export type NavigationFileListState = "ready" | "loading" | "empty" | "error";
export type NavigationFileRowContext = { depth: number; expanded: boolean; expandable: boolean; toggle: () => void };
export type NavigationFileListProps<T extends NavigationFileNode & { children?: T[] } = NavigationFileNode> = {
  nodes: T[];
  label: string;
  expandedIds: readonly string[];
  onExpandedChange: (id: string, expanded: boolean) => void;
  renderRow: (node: T, context: NavigationFileRowContext) => React.ReactNode;
  selectedId?: string | null;
  /** Keep editing/focused rows and their ancestors mounted across local pages. */
  retainedIds?: readonly string[];
  state?: NavigationFileListState;
  loadingLabel?: string;
  emptyLabel?: string;
  errorLabel?: string;
  retryLabel?: string;
  moreLabel?: string;
  onRetry?: (parent: T | null) => void;
  /** Server state belongs to the consumer. This is called for each expanded branch. */
  getChildState?: (node: T) => NavigationFileListState;
  hasMore?: (parent: T | null) => boolean;
  onLoadMore?: (parent: T | null) => void;
  /** Optional local fixture paging. Omit for server-paged data. */
  pageSize?: number;
  canDrag?: (node: T) => boolean;
  isContainer?: (node: T) => boolean;
  canDrop?: (source: T, target: T, placement: "before" | "inside") => boolean;
  onDrop?: (source: T, target: T, placement: "before" | "inside") => void;
  onReorder?: (node: T, direction: -1 | 1) => void;
  onMove?: (node: T) => void;
  className?: string;
};
/** Nested native lists: application callbacks own data and permissions, never ARIA tree navigation. */
export function NavigationFileList<T extends NavigationFileNode & { children?: T[] }>({ nodes, label, expandedIds, onExpandedChange, renderRow, selectedId, retainedIds = [], state = "ready", loadingLabel = "Loading files…", emptyLabel = "No files yet.", errorLabel = "Could not load files.", retryLabel = "Retry", moreLabel = "Show more files", onRetry, getChildState, hasMore, onLoadMore, pageSize, canDrag, isContainer, canDrop, onDrop, onReorder, onMove, className }: NavigationFileListProps<T>) {
  const [limits, setLimits] = React.useState<Record<string, number>>({});
  const [dragging, setDragging] = React.useState<T | null>(null);
  const [drop, setDrop] = React.useState<{ id: string; placement: "before" | "inside" } | null>(null);
  const children = (node: T) => (node.children ?? []) as T[];
  const contains = (node: T, ids: readonly string[]): boolean => ids.includes(node.id) || children(node).some(child => contains(child, ids));
  const keep = [selectedId, ...retainedIds].filter((id): id is string => Boolean(id));
  const localPage = pageSize && Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : Infinity;
  const clearDrag = () => { setDragging(null); setDrop(null); };
  const feedback = (value: NavigationFileListState, parent: T | null) => <div className="weft-navigation-file-state" role="status" aria-live="polite">
    <span>{value === "loading" ? loadingLabel : value === "error" ? errorLabel : emptyLabel}</span>
    {value === "error" && onRetry && <Button type="button" variant="ghost" onClick={() => onRetry(parent)}>{retryLabel}</Button>}
  </div>;
  const list = (items: T[], parent: T | null, depth: number, branchState: NavigationFileListState): React.ReactNode => {
    if (branchState !== "ready" || (!items.length && !hasMore?.(parent))) return feedback(branchState === "ready" ? "empty" : branchState, parent);
    const key = parent ? `child:${parent.id}` : "root";
    const limit = limits[key] ?? localPage;
    const more = items.length > limit || Boolean(hasMore?.(parent));
    return <ul role="list" aria-label={parent ? `${parent.label} files` : label} className="weft-navigation-file-items">
      {items.filter((node, index) => index < limit || contains(node, keep) || (expandedIds.includes(node.id) && Boolean(node.hasChildren || children(node).length))).map(node => {
        const expanded = expandedIds.includes(node.id);
        const expandable = Boolean(node.hasChildren || children(node).length);
        return <li role="listitem" key={node.id} data-file-id={node.id} className="weft-navigation-file-item" data-dragging={dragging?.id === node.id || undefined} data-drop={drop?.id === node.id ? drop.placement : undefined}
          draggable={Boolean(onDrop && canDrag?.(node))}
          onDragStart={event => { if (!onDrop || !canDrag?.(node)) { event.preventDefault(); event.stopPropagation(); return; } event.stopPropagation(); setDragging(node); event.dataTransfer.setData("text/plain", node.id); event.dataTransfer.effectAllowed = "move"; }}
          onDragEnd={clearDrag}
          onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDrop(null); }}
          onDragOver={event => {
            const placement = event.shiftKey || !(isContainer?.(node) ?? expandable) ? "before" : "inside";
            event.stopPropagation();
            if (!dragging || !canDrag?.(dragging) || contains(dragging, [node.id]) || canDrop?.(dragging, node, placement) === false) { setDrop(null); return; }
            event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = "move"; setDrop({ id: node.id, placement });
          }}
          onDrop={event => {
            event.preventDefault(); event.stopPropagation();
            const placement = event.shiftKey || !(isContainer?.(node) ?? expandable) ? "before" : "inside";
            if (dragging && canDrag?.(dragging) && !contains(dragging, [node.id]) && canDrop?.(dragging, node, placement) !== false) onDrop?.(dragging, node, placement);
            clearDrag();
          }}
          onKeyDown={event => {
            if ((event.target as HTMLElement).closest('input,textarea,select,[role="menu"]') || event.defaultPrevented || event.ctrlKey || event.metaKey || !event.altKey) return;
            if (onReorder && (event.key === "ArrowUp" || event.key === "ArrowDown")) { event.preventDefault(); event.stopPropagation(); onReorder(node, event.key === "ArrowUp" ? -1 : 1); }
            if (onMove && event.key.toLowerCase() === "m") { event.preventDefault(); event.stopPropagation(); onMove(node); }
          }}>
          {renderRow(node, { depth, expanded, expandable, toggle: () => onExpandedChange(node.id, !expanded) })}
          {expanded && expandable ? list(children(node), node, depth + 1, getChildState?.(node) ?? (node.hasChildren && !children(node).length ? "loading" : "ready")) : null}
        </li>;
      })}
      {more && <li role="listitem" className="weft-navigation-file-page"><Button type="button" variant="ghost" onClick={() => { if (items.length > limit) setLimits(current => ({ ...current, [key]: limit + localPage })); else onLoadMore?.(parent); }}>{moreLabel}</Button></li>}
    </ul>;
  };
  return <div className={cn("weft-navigation-file-list", className)} aria-busy={state === "loading" || undefined}>{list(nodes, null, 0, state)}</div>;
}

export type NavigationFileInteractionsOptions = { disabled?: boolean; editing?: boolean; onActions?: () => void; onRename?: () => void };
/** Apply to the visible row; long press cancels on movement, release and unmount. */
export function useNavigationFileInteractions({ disabled, editing, onActions, onRename }: NavigationFileInteractionsOptions): Pick<React.HTMLAttributes<HTMLElement>, "onContextMenu" | "onKeyDown" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel" | "onClickCapture"> {
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const consumed = React.useRef(false);
  const cancel = () => clearTimeout(timer.current);
  React.useEffect(() => cancel, [disabled, editing, onActions]);
  return {
    onContextMenu: event => { if (disabled || editing || !onActions) return; event.preventDefault(); event.stopPropagation(); if (!consumed.current) onActions(); },
    onKeyDown: event => {
      if (disabled || editing || event.defaultPrevented || (event.target as HTMLElement).closest('input,textarea,select,[role="menu"]')) return;
      if (event.key === "F2" && onRename) { event.preventDefault(); event.stopPropagation(); onRename(); }
      if (onActions && (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))) { event.preventDefault(); event.stopPropagation(); onActions(); }
    },
    onPointerDown: event => { cancel(); consumed.current = false; if (event.pointerType === "touch" && !disabled && !editing && onActions) timer.current = setTimeout(() => { onActions(); consumed.current = true; }, 600); },
    onPointerMove: cancel, onPointerUp: cancel, onPointerCancel: cancel,
    onClickCapture: event => { if (consumed.current) { event.preventDefault(); event.stopPropagation(); consumed.current = false; } },
  };
}
export type NavigationFileRenameProps = { value: string; label: string; disabled?: boolean; onChange: (value: string) => void; onCommit: (value: string) => void; onCancel: () => void; onInvalid: () => void };
/** Consumer controls editing and commit persistence; blank names never commit. */
export function NavigationFileRename({ value, label, disabled, onChange, onCommit, onCancel, onInvalid }: NavigationFileRenameProps) {
  return <Input className="weft-navigation-file-rename" aria-label={label} autoFocus disabled={disabled} value={value} onFocus={event => event.target.select()} onChange={event => onChange(event.target.value)} onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onCancel(); }
    if (event.key === "Enter") { event.preventDefault(); event.stopPropagation(); if (!value.trim()) onInvalid(); else onCommit(value.trim()); }
  }} />;
}
