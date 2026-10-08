"use client";
import * as React from "react";
import { fileShellIcons } from "../semantics/file-shell-icons";
const { saved: Check, offline: CloudOff, saveError: CircleAlert, saving: LoaderCircle } = fileShellIcons;
import { Input } from "./input";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

export type FileHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "title" | "children"> & {
  fileId?: string;
  fileKind?: "document" | "htmlFile" | "spreadsheet" | "presentation" | "image";
  title: string;
  fileTypeLabel: string;
  icon?: React.ReactNode;
  context?: React.ReactNode;
  actions?: React.ReactNode;
  saveState?: "saved" | "saving" | "offline" | "error";
  statusMessage?: string;
  onRename?: (title: string) => void | Promise<void>;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};
/** Shared file chrome. The application supplies capabilities and actual persistence state. */
export const FileHeader = React.forwardRef<HTMLElement, FileHeaderProps>(function FileHeader({ fileId, fileKind, title, fileTypeLabel, icon, context, actions, saveState, statusMessage, onRename, headingLevel = 1, className, ...rootProps }, ref) {
  const TypeIcon = fileKind ? fileShellIcons[fileKind] : undefined;
  const identityIcon = TypeIcon ? <TypeIcon size={20} aria-hidden="true"/> : icon;
  const id = React.useId();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(title);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const input = React.useRef<HTMLInputElement>(null);
  const rename = React.useRef<HTMLButtonElement>(null);
  const mounted = React.useRef(true);
  const saving = React.useRef(false);
  const restoreFocus = React.useRef(true);
  const composing = React.useRef(false);
  const request = React.useRef(0);
  const identity = React.useRef(fileId ?? title);
  identity.current = fileId ?? title;
  const previousIdentity = React.useRef(fileId ?? title);
  React.useEffect(() => {
    if (previousIdentity.current === (fileId ?? title)) return;
    const acceptedRename = fileId === undefined && saving.current && title === draft.trim();
    previousIdentity.current = fileId ?? title; if (!acceptedRename) restoreFocus.current = false; request.current++; saving.current = false;
    setEditing(false); setPending(false); setError(""); setDraft(title);
  }, [fileId, title]);
  const wasEditing = React.useRef(false);
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  React.useEffect(() => {
    if (editing) { input.current?.focus(); input.current?.select(); }
    else if (wasEditing.current && restoreFocus.current) rename.current?.focus();
    wasEditing.current = editing;
  }, [editing]);
  React.useEffect(() => { if (!onRename) setEditing(false); }, [onRename]);
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const messages = { saved: "All changes saved", saving: "Saving changes…", offline: "Offline · changes not synced", error: "Changes not saved" };
  const StatusIcon = saveState === "saving" ? LoaderCircle : saveState === "offline" ? CloudOff : saveState === "error" ? CircleAlert : Check;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (saving.current || !onRename) return;
    const next = draft.trim();
    if (!next) { setError("Enter a file name."); input.current?.focus(); return; }
    if (next === title) { setEditing(false); return; }
    const currentRequest = ++request.current;
    const isCurrent = () => mounted.current && request.current === currentRequest && identity.current === (fileId ?? title);
    saving.current = true; setPending(true); setError("");
    try { await onRename(next); if (isCurrent()) setEditing(false); }
    catch { if (isCurrent()) { setError("The file could not be renamed. Try again."); input.current?.focus(); } }
    finally { if (isCurrent()) { saving.current = false; setPending(false); } }
  }
  return <header ref={ref} {...rootProps} role={rootProps.role ?? "group"} aria-label={rootProps["aria-label"] ?? `${title || "Untitled"} file header`} className={`weft-file-header ${className ?? ""}`} data-save-state={saveState}>
    <div className="weft-file-header-topline">{context && <div className="weft-file-header-context">{context}</div>}        <div role="status" aria-atomic="true" className="weft-file-header-status">{(saveState || statusMessage) && <>{saveState && <StatusIcon size={14} aria-hidden="true" className={saveState === "saving" ? "weft-file-header-saving" : undefined} />}<span>{statusMessage ?? (saveState ? messages[saveState] : "")}</span></>}</div></div>
    <div className="weft-file-header-main">
      {identityIcon && <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="weft-file-header-icon" tabIndex={0} role="img" aria-label={fileTypeLabel}>{identityIcon}</span></TooltipTrigger><TooltipContent>{fileTypeLabel}</TooltipContent></Tooltip></TooltipProvider>}
      <div className="weft-file-header-identity">
        <span className="weft-sr-only">{fileTypeLabel}</span>
        {editing && onRename ? <form className="weft-file-header-rename" onSubmit={submit}>
          <Input ref={input} aria-label="File name" value={draft} readOnly={pending} aria-busy={pending || undefined} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-error ${id}-instructions` : `${id}-instructions`} onCompositionStart={() => {composing.current=true;}} onCompositionEnd={() => {composing.current=false;}} onBlur={event => {if (!editing || composing.current || saving.current) return; restoreFocus.current=false; void submit(event);}} onChange={event => { setDraft(event.target.value); if (error) setError(""); }} onKeyDown={event => { if (event.nativeEvent.isComposing || composing.current) return; if (event.key === "Enter") { event.preventDefault(); restoreFocus.current=true; void submit(event); } if (event.key === "Escape" && !pending) { event.preventDefault(); setEditing(false); setError(""); } }} />
          <span id={`${id}-instructions`} className="weft-sr-only">Enter saves. Escape cancels. Leaving the title saves changes.</span>
          {error && <p id={`${id}-error`} role="alert" className="weft-file-header-error">{error}</p>}
          {pending && <span role="status" className="weft-sr-only">Saving file name…</span>}
        </form> : <div className="weft-file-header-title-row"><Heading>{onRename ? <button ref={rename} type="button" className="weft-file-header-title-edit" aria-label={`Rename file: ${title || "Untitled"}`} title="Click to rename" onClick={() => {restoreFocus.current=true;setDraft(title);setError("");setEditing(true);}}>{title || "Untitled"}</button> : title || "Untitled"}</Heading></div>}

      </div>
      {actions && <div className="weft-file-header-actions" role="group" aria-label="File actions">{actions}</div>}
    </div>
  </header>;
});
