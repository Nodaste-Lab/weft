import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "./sheet";
import { Button } from "./button";
import { NavigationIcon } from "./navigation-icon";
export const navigationNarrowQuery = "(max-width: 1023px)";

export type NavigationRailLayoutProps = {
  rail: React.ReactNode;
  children: React.ReactNode;
  railId: string;
  label: string;
  openLabel: string;
  resizeLabel: string;
  description: string;
  width?: number;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  onAvailableWidthChange?: (width: number) => void;
  /** Opt-in per-user preference key. Narrow layouts never write it. */
  storageKey?: string;
  mode?: "auto" | "desktop" | "drawer";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  drawerClassName?: string;
  style?: React.CSSProperties;
};
export function NavigationRailLayout({ rail, children, railId, label, openLabel, resizeLabel, description, width, defaultWidth = 280, minWidth = 200, maxWidth = 720, onWidthChange, onAvailableWidthChange, storageKey, mode = "auto", open, onOpenChange, className, drawerClassName, style }: NavigationRailLayoutProps) {
  const clamp = (n: number, max = maxWidth) => Math.max(minWidth, Math.min(max, Number.isFinite(n) ? n : defaultWidth));
  const [preferred, setPreferred] = React.useState(defaultWidth);
  const [available, setAvailable] = React.useState(maxWidth);
  const [small, setSmall] = React.useState(false);
  const [innerOpen, setInnerOpen] = React.useState(false);
  const host = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; width: number; pointer: number } | null>(null);
  const changeOpen = (next: boolean) => { setInnerOpen(next); onOpenChange?.(next); };
  React.useEffect(() => {
    if (!storageKey || width !== undefined) return;
    try { const saved = window.localStorage.getItem(storageKey); if (saved !== null && Number.isFinite(Number(saved))) setPreferred(clamp(Number(saved))); } catch { /* Storage can be unavailable. */ }
  }, [storageKey, minWidth, maxWidth]);
  React.useEffect(() => {
    if (mode !== "auto") return;
    const media = window.matchMedia?.(navigationNarrowQuery);
    if (!media) return;
    const update = () => { setSmall(media.matches); changeOpen(false); };
    setSmall(media.matches); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [mode]);
  const drawer = mode === 'drawer' || (mode === 'auto' && small);
  React.useEffect(() => {
    const element = host.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.max(minWidth, Math.min(maxWidth, Math.floor(entry.contentRect.width - 24)));
      setAvailable(next); onAvailableWidthChange?.(next);
    });
    observer.observe(element); return () => observer.disconnect();
  }, [drawer, minWidth, maxWidth, onAvailableWidthChange]);
  const displayed = clamp(width ?? preferred, available);
  const resize = (next: number) => {
    const value = clamp(next, available);
    setPreferred(value); onWidthChange?.(value);
    if (storageKey) try { window.localStorage.setItem(storageKey, String(value)); } catch { /* Optional persistence. */ }
  };
  if (drawer) return <div className={className} style={style}>
    <Sheet open={open ?? innerOpen} onOpenChange={changeOpen}>
      <SheetTrigger asChild><Button variant="outline" aria-label={openLabel}><NavigationIcon purpose="navigation" />{label}</Button></SheetTrigger>
      <SheetContent side="left" data-navigation-drawer="" className={`weft-navigation-drawer ${drawerClassName ?? ''}`} style={style}>
        <SheetTitle className="sr-only">{label}</SheetTitle><SheetDescription className="sr-only">{description}</SheetDescription>{rail}
      </SheetContent>
    </Sheet><div className="weft-navigation-workspace">{children}</div>
  </div>;
  return <div ref={host} className={`weft-navigation-layout ${className ?? ''}`} style={style}>
    <div className="weft-navigation-layout-rail" style={{ width: displayed }}>{rail}</div>
    <div className="weft-navigation-resize" role="separator" aria-label={resizeLabel} aria-controls={railId} aria-orientation="vertical" aria-valuemin={minWidth} aria-valuemax={available} aria-valuenow={displayed} tabIndex={0}
      onKeyDown={event => {
        if (!['Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault(); resize(event.key === 'Home' ? minWidth : event.key === 'End' ? available : displayed + (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 64 : 16));
      }}
      onPointerDown={event => { if (event.button !== 0) return; drag.current = { x: event.clientX, width: displayed, pointer: event.pointerId }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { const start = drag.current; if (start?.pointer === event.pointerId) resize(start.width + event.clientX - start.x); }}
      onPointerUp={event => { drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} />
    <div className="weft-navigation-workspace">{children}</div>
  </div>;
}
