import React from "react";
import { Button } from "../../../src/ui/button";
import { Input } from "../../../src/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../../../src/ui/dialog";

export type TestFile = {
  id: string; label: string; icon: "text" | "html" | "folder";
  signals?: number; children?: TestFile[];
};
export const flattenFiles = (nodes: TestFile[], parent = ""): { node: TestFile; path: string }[] =>
  nodes.flatMap((node) => {
    const path = parent ? `${parent} / ${node.label}` : node.label;
    return [{ node, path }, ...flattenFiles(node.children ?? [], path)];
  });
function updateFile(nodes: TestFile[], id: string, update: (file: TestFile) => TestFile): TestFile[] {
  return nodes.map((node) => node.id === id ? update(node) : { ...node, children: node.children && updateFile(node.children, id, update) });
}
function removeFile(nodes: TestFile[], id: string): TestFile[] {
  return nodes.filter((node) => node.id !== id).map((node) => ({ ...node, children: node.children && removeFile(node.children, id) }));
}
function insertFile(nodes: TestFile[], node: TestFile, parent: string, before?: string): TestFile[] {
  const insert = (list: TestFile[]) => {
    const index = before ? list.findIndex((file) => file.id === before) : -1;
    return index < 0 ? [...list, node] : [...list.slice(0, index), node, ...list.slice(index)];
  };
  return parent === "" ? insert(nodes) : updateFile(nodes, parent, (file) => ({ ...file, children: insert(file.children ?? []) }));
}
export function NavigationRailTestTree({ files, space = "Studio", onChange, selected, onSelect, writable, renderRow, onMessage, onTransfer, rootExpanded = true, onRootExpand }: {
  rootExpanded?: boolean; onRootExpand?: (open: boolean) => void;
  space?: string; files: TestFile[]; onChange: (files: TestFile[]) => void;
  selected: string | null; onSelect: (id: string) => void; writable: boolean;
  renderRow: (file: TestFile, depth: number, open: boolean, expand: () => void, activate: () => void, message: (value: string) => void, rename: (label: string) => void) => React.ReactNode;
  onMessage: (message: string) => void;
  onTransfer: (node: TestFile, space: string, copy: boolean) => void;
}) {
  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  const [dialog, setDialog] = React.useState<{ action: string; id: string } | null>(null);
  const [name, setName] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [placement, setPlacement] = React.useState("inside");
  const [error, setError] = React.useState("");
  const [undo, setUndo] = React.useState<TestFile[] | null>(null);
  const [retainedFocus, setRetainedFocus] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const pendingFocus = React.useRef<string | null>(null);
  const dialogFile = React.useRef<string | null>(null);
  const [limits, setLimits] = React.useState<Record<string, number>>({});
  const origin = React.useRef<HTMLElement | null>(null);
  const host = React.useRef<HTMLDivElement>(null);
  const flat = flattenFiles(files);
  React.useEffect(() => {
    if (!selected) return;
    const parents = flat.filter(({ node }) => flattenFiles(node.children ?? []).some(({ node: child }) => child.id === selected)).map(({ node }) => node.id);
    setCollapsed((items) => items.filter((id) => !parents.includes(id)));
    if (parents.includes("root")) onRootExpand?.(true);
  }, [selected, files]);
  const active = flat.find(({ node }) => node.id === dialog?.id)?.node;
  const refocus = (id: string) => requestAnimationFrame(() => host.current?.querySelector<HTMLButtonElement>(`[data-file-id="${id}"] .rail-lab-title`)?.focus());
  function commit(next: TestFile[], message: string, focusId: string) {
    pendingFocus.current = focusId; setRetainedFocus(focusId);
    setUndo(files); onChange(next); onMessage(`${message} Local test data only.`); refocus(focusId);
  }
  function move(id: string, destination: string, before?: string) {
    const source = flat.find(({ node }) => node.id === id)?.node;
    if (!source || id === destination || flattenFiles(source.children ?? []).some(({ node }) => node.id === destination || node.id === before) || id === before) {
      onMessage("Choose a destination outside this file and its children."); return;
    }
    const next = insertFile(removeFile(files, id), source, destination, before);
    setCollapsed((items) => items.filter((item) => item !== destination));
    const siblings = destination ? flattenFiles(next).find(({ node }) => node.id === destination)?.node.children ?? [] : next;
    commit(next, `Moved ${source.label}${destination ? ` into ${flat.find(({ node }) => node.id === destination)?.node.label}` : " to Files"}, position ${siblings.findIndex((node) => node.id === id) + 1} of ${siblings.length}.`, id);
  }
  function step(id: string, direction: number, nodes = files): boolean {
    const index = nodes.findIndex((node) => node.id === id);
    if (index >= 0) {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= nodes.length) { onMessage("Already at the boundary of this group."); return true; }
      const before = direction < 0 ? nodes[nextIndex].id : nodes[nextIndex + 1]?.id;
      const parent = flat.find(({ node }) => node.children?.some((child) => child.id === id))?.node.id ?? "";
      move(id, parent, before); return true;
    }
    return nodes.some((node) => step(id, direction, node.children ?? []));
  }
  function action(id: string, message: string) {
    const prefix = "Preview only: ";
    const label = flat.find(({ node }) => node.id === id)?.node.label ?? "";
    if (!message.startsWith(prefix)) { onMessage(message); return; }
    const command = message.slice(prefix.length).split(` for ${label}.`)[0];
    if (/^(New |Duplicate|Move |Copy to Space|Remove)/.test(command)) {
      dialogFile.current = id; origin.current = host.current?.contains(document.activeElement) ? document.activeElement as HTMLElement : host.current?.querySelector<HTMLElement>(`[data-file-id="${id}"] .rail-lab-actions`) ?? null; setName(""); setTarget(space === "Private" ? "Research" : "Private"); setPlacement("inside"); setError(""); setTarget(command.startsWith("Move within") ? "" : space === "Private" ? "Research" : "Private"); setDialog({ action: command, id });
    } else onMessage(message);
  }
  function close() { setDialog(null); }
  function submit(event: React.FormEvent) {
    event.preventDefault(); if (!active || !dialog) return;
    if (dialog.action.startsWith("Move within")) {
      const destination = placement === "before" && target ? flat.find(({ node }) => node.children?.some((child) => child.id === target))?.node.id ?? "" : target;
      if (target === active.id || flattenFiles(active.children ?? []).some(({ node }) => node.id === target)) { setError("Choose a location outside this file and its children."); return; }
      move(active.id, destination, placement === "before" ? target : undefined);
    } else if (/^(Move to Space|Copy to Space)/.test(dialog.action)) {
      // The destination belongs to a separate fixture Space; never imply a server transfer.
      if (target === space) { setError("Choose a different Space."); return; }
      onTransfer(active, target || "Private", dialog.action.startsWith("Copy"));
      onMessage(`${dialog.action.startsWith("Copy") ? "Copied" : "Moved"} ${active.label} to ${target || "Private"} in the transfer preview. No Avalandra data changed.`);
      if (dialog.action.startsWith("Move")) commit(removeFile(files, active.id), `Removed ${active.label} from this Space after the preview transfer.`, files.find((node) => node.id !== active.id)?.id ?? "");
    } else if (dialog.action.startsWith("Remove")) {
      commit(removeFile(files, active.id), `Removed ${active.label} and its children. Undo is available.`, files.find((node) => node.id !== active.id)?.id ?? "");
    } else if (dialog.action.startsWith("Duplicate")) {
      const clone = (file: TestFile): TestFile => ({ ...file, id: crypto.randomUUID(), children: file.children?.map(clone) });
      const copy = { ...clone(active), label: `${active.label} copy` };
      const parent = flat.find(({ node }) => node.children?.some((child) => child.id === active.id))?.node.id ?? "";
      commit(insertFile(files, copy, parent), `Duplicated ${active.label}.`, copy.id);
    } else {
      if (!name.trim()) { setError("Enter a name."); return; }
      if (active.children?.some((child) => child.label.toLocaleLowerCase() === name.trim().toLocaleLowerCase())) { setError("A child with that name already exists."); return; }
      const node: TestFile = { id: crypto.randomUUID(), label: name.trim(), icon: dialog.action === "New Folder" ? "folder" : "text" };
      setCollapsed((items) => items.filter((item) => item !== active.id));
      if (active.id === "root") onRootExpand?.(true);
      commit(insertFile(files, node, active.id), `Created ${node.label} in ${active.label}.`, node.id);
    }
    close();
  }
  const list = (nodes: TestFile[], depth: number) => <div role="list" aria-label={depth === 0 ? "Space files" : undefined}>
    {nodes.filter((file, index) => index < (limits[nodes[0]?.id ?? "root"] ?? 20) || file.id === selected || file.id === retainedFocus || (Boolean(file.children?.length) && !collapsed.includes(file.id)) || flattenFiles(file.children ?? []).some(({ node }) => node.id === selected || node.id === retainedFocus)).map((file) => {
      const open = file.id === "root" ? rootExpanded : !collapsed.includes(file.id);
      const toggle = () => file.id === "root" && onRootExpand ? onRootExpand(!open) : setCollapsed((items) => open ? [...items, file.id] : items.filter((id) => id !== file.id));
      return <div role="listitem" key={file.id} data-file-id={file.id}
        draggable={writable}
        onDragStart={(event) => { event.stopPropagation(); setDragging(file.id); event.dataTransfer.setData("text/plain", file.id); event.dataTransfer.effectAllowed = "move"; }}
        onDragEnd={() => setDragging(null)}
        onDragOver={(event) => { if (writable && dragging && dragging !== file.id) { event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = "move"; } }}
        onDrop={(event) => { event.preventDefault(); event.stopPropagation(); if (writable && dragging) {
          const parent = flat.find(({ node }) => node.children?.some((child) => child.id === file.id))?.node.id ?? "";
          move(dragging, event.shiftKey || file.icon !== "folder" ? parent : file.id, event.shiftKey || file.icon !== "folder" ? file.id : undefined); setDragging(null);
        } }}
        onKeyDown={(event) => {
          if (!writable || (event.target as HTMLElement).closest("input,textarea,[role=menu]")) return;
          if (event.altKey && !event.ctrlKey && ["ArrowUp", "ArrowDown"].includes(event.key)) { event.preventDefault(); event.stopPropagation(); step(file.id, event.key === "ArrowUp" ? -1 : 1); }
          if (event.altKey && event.key.toLowerCase() === "m") { event.preventDefault(); event.stopPropagation(); action(file.id, `Preview only: Move within this Space… for ${file.label}.`); }
        }}>
        {renderRow(file, depth, open,
          toggle,
          () => { if (file.icon === "folder") toggle(); else onSelect(file.id); },
          (message) => action(file.id, message),
          (label) => { onChange(updateFile(files, file.id, (node) => ({ ...node, label }))); onMessage(`Renamed to ${label}.`); })}
        {open && file.children?.length ? list(file.children, depth + 1) : null}
      </div>;
    })}
    {nodes.length > (limits[nodes[0]?.id ?? "root"] ?? 20) && <div role="listitem"><Button variant="ghost" onClick={() => setLimits((current) => ({ ...current, [nodes[0]?.id ?? "root"]: (current[nodes[0]?.id ?? "root"] ?? 20) + 20 }))}>Show more files</Button></div>}
  </div>;
  return <div ref={host}>
    {undo && <Button variant="ghost" onClick={() => { onChange(undo); setUndo(null); setRetainedFocus(undo[0]?.id ?? null); refocus(undo[0]?.id ?? ""); onMessage("Last tree change undone."); }}>Undo last tree change</Button>}
    {list(files, 0)}
    <Dialog open={Boolean(dialog)} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent onCloseAutoFocus={(event) => {
        event.preventDefault();
        const committed = pendingFocus.current;
        const opener = origin.current;
        pendingFocus.current = null; dialogFile.current = null;
        requestAnimationFrame(() => {
          if (committed) {
            (host.current?.querySelector<HTMLButtonElement>(`[data-file-id="${committed}"] .rail-lab-title`) ?? host.current?.querySelector<HTMLButtonElement>(".rail-lab-title"))?.focus();
          } else if (opener?.isConnected) opener.focus();
          else host.current?.querySelector<HTMLButtonElement>(".rail-lab-title")?.focus();
        });
      }}>
        <DialogTitle>{dialog?.action ?? "File action"}</DialogTitle>
        <DialogDescription>{active?.label}. Changes affect fictional local test data only.</DialogDescription>
        <form onSubmit={submit}>
          {dialog?.action.startsWith("New ") && <label className="rail-lab-field">Name<Input autoFocus value={name} onChange={(event) => setName(event.target.value)} /></label>}
          {dialog?.action.startsWith("Move within") && <>
            <label className="rail-lab-field">Placement<select className="weft-select" value={placement} onChange={(event) => { setPlacement(event.target.value); setTarget(""); }}><option value="inside">Inside</option><option value="before">Before</option></select></label>
            <label className="rail-lab-field">Destination<select className="weft-select" value={target} onChange={(event) => setTarget(event.target.value)}>
              <option value="">Files (top level)</option>
              {flat.filter(({ node }) => node.id !== active?.id && !flattenFiles(active?.children ?? []).some(({ node: child }) => child.id === node.id)).map(({ node, path }) => <option key={node.id} value={node.id}>{path}</option>)}
            </select></label>
          </>}
          {/^(Move to Space|Copy to Space)/.test(dialog?.action ?? "") && <label className="rail-lab-field">Destination Space<select className="weft-select" value={target} onChange={(event) => setTarget(event.target.value)}>{space !== "Studio" && <option value="Studio">Studio (fictional destination)</option>}{space !== "Private" && <option value="Private">Private (fictional destination)</option>}{space !== "Research" && <option value="Research">Research (fictional destination)</option>}</select></label>}
          {dialog?.action.startsWith("Remove") && <p>This removes the entire subtree from the local preview. You can undo it.</p>}
          {error && <p role="alert">{error}</p>}
          <Button type="submit" variant="outline">Confirm</Button><Button type="button" variant="ghost" onClick={close}>Cancel</Button>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}
