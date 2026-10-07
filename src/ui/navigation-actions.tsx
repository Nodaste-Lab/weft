import * as React from "react";
import { navigationNarrowQuery } from "./navigation-rail-layout";
import { Button } from "./button";
import { NavigationIcon } from "./navigation-icon";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "./dropdown-menu";

export type NavigationAction = {
  id: string;
  label: string;
  disabled?: boolean;
  onSelect?: () => void;
  children?: NavigationAction[];
};
export type NavigationActionsProps = {
  name: string;
  items: NavigationAction[];
  caption?: React.ReactNode;
  disabled?: boolean;
  compact?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  menuLabel?: string;
  backLabel?: string;
};
/** One action model, cascading on desktop and one panel with Back on touch. */
export function NavigationActions({ name, items, caption, disabled, compact, triggerClassName, contentClassName, menuLabel = "File actions", backLabel = "Back" }: NavigationActionsProps) {
  const [open, setOpen] = React.useState(false);
  const [narrow, setNarrow] = React.useState(false);
  const [path, setPath] = React.useState<string[]>([]);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const menuId = React.useId();
  const returningTo = React.useRef<string | null>(null);
  const changeOpen = (next: boolean) => {
    if (next) {
      setNarrow(compact ?? (Boolean(trigger.current?.closest('[data-navigation-drawer]')) || Boolean(window.matchMedia?.(navigationNarrowQuery).matches)));
      returningTo.current = null;
      setPath([]);
    }
    setOpen(next);
  };
  React.useEffect(() => {
    if (!open || !narrow) return;
    const frame = requestAnimationFrame(() => {
      const menu = document.getElementById(menuId);
      const origin = returningTo.current;
      const item = origin ? Array.from(menu?.querySelectorAll<HTMLElement>('[data-navigation-action]') ?? []).find(node => node.dataset.navigationAction === origin) : null;
      (item ?? menu?.querySelector<HTMLElement>(path.length ? '[data-navigation-back]' : '[role="menuitem"]:not([data-disabled])'))?.focus();
      returningTo.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, narrow, path, menuId]);
  let level = items;
  let heading = menuLabel;
  for (const id of path) {
    const group = level.find(item => item.id === id);
    if (!group?.children) break;
    heading = group.label;
    level = group.children;
  }
  const desktop = (entries: NavigationAction[]): React.ReactNode => entries.map(item => item.children ?
    <DropdownMenuSub key={item.id}><DropdownMenuSubTrigger disabled={item.disabled}>{item.label}</DropdownMenuSubTrigger><DropdownMenuSubContent className={`weft-navigation-actions-menu ${contentClassName ?? ""}`}>{desktop(item.children)}</DropdownMenuSubContent></DropdownMenuSub> :
    <DropdownMenuItem key={item.id} disabled={item.disabled} onSelect={item.onSelect}>{item.label}</DropdownMenuItem>);
  return <DropdownMenu open={open} onOpenChange={changeOpen} modal={narrow}>
    <DropdownMenuTrigger asChild><Button ref={trigger} type="button" variant="ghost" size="icon" className={triggerClassName} disabled={disabled} aria-label={`Actions for ${name}`} onClick={event => { if (event.detail === 0) changeOpen(true); }}><NavigationIcon purpose="actions" /></Button></DropdownMenuTrigger>
    <DropdownMenuContent id={menuId} className={`weft-navigation-actions-menu ${contentClassName ?? ""}`} aria-labelledby={undefined} aria-label={narrow ? `${menuLabel}: ${heading}` : menuLabel}>
      <DropdownMenuLabel>{name}{caption}</DropdownMenuLabel>
      {narrow ? <>
        {path.length > 0 && <DropdownMenuItem data-navigation-back="" onSelect={event => { event.preventDefault(); returningTo.current = path.at(-1) ?? null; setPath(path.slice(0, -1)); }}>{backLabel}</DropdownMenuItem>}
        <DropdownMenuLabel>{heading}</DropdownMenuLabel>
        {level.map(item => <DropdownMenuItem key={item.id} data-navigation-action={item.id} aria-haspopup={item.children ? "menu" : undefined} disabled={item.disabled} onSelect={event => {
          if (item.children) { event.preventDefault(); setPath([...path, item.id]); } else item.onSelect?.();
        }}>{item.label}{item.children && <span aria-hidden="true"> →</span>}</DropdownMenuItem>)}
      </> : desktop(items)}
    </DropdownMenuContent>
  </DropdownMenu>;
}
