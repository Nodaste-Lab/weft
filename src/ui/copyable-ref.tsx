"use client";

import * as React from "react";
import { Check, Copy, X } from "lucide-react";

import { cn } from "./utils";

/*
 * CopyableRef — truncated canonical reference with an accessible copy action.
 *
 * Accessibility contract:
 *   - Copy button has `aria-label="Copy {label}"` so it is announced without
 *     relying on the icon alone.
 *   - After a successful copy, the label changes to "Copied" for 1.5 s — both
 *     a visual and announced change via aria-live="polite" aria-atomic="true".
 *   - On failure, the label changes to "Failed" for 1.5 s — never silent.
 *   - Rapid repeat clicks clear the pending timer before restarting it.
 *   - Unmount clears the timer so setState is never called post-unmount.
 *
 * Plain-CSS counterpart: see `.weft-copyable-ref` in weft-components.css.
 */

type CopyState = "idle" | "success" | "failure";

function CopyableRef({
  className,
  value,
  label = "reference",
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The string to copy to the clipboard. */
  value: string;
  /** Describes what is being copied; used in the button aria-label. */
  label?: string;
  /** Optional display node; falls back to rendering `value` as code. */
  children?: React.ReactNode;
}) {
  const [state, setState] = React.useState<CopyState>("idle");
  // Stored timer ID so repeat clicks and unmount can clear it.
  const timerRef = React.useRef<number | null>(null);
  // Generation counter: each click increments this; the async callback checks
  // it matches before committing state, so a superseded write never wins.
  const genRef = React.useRef(0);

  // On unmount: increment the generation counter so any in-flight async write
  // fails its generation check and does not call setState; also cancel any
  // pending revert timer.
  React.useEffect(() => {
    return () => {
      genRef.current++;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const copy = React.useCallback(async () => {
    // Claim this request's generation slot; cancel any pending revert.
    const gen = ++genRef.current;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    try {
      await navigator.clipboard.writeText(value);
      // Drop if a newer click already claimed the slot.
      if (gen !== genRef.current) return;
      setState("success");
    } catch {
      if (gen !== genRef.current) return;
      setState("failure");
    }
    // Schedule revert regardless of outcome.
    timerRef.current = window.setTimeout(() => {
      setState("idle");
      timerRef.current = null;
    }, 1500);
  }, [value]);

  const buttonLabel =
    state === "success" ? "Copied" : state === "failure" ? "Failed" : `Copy ${label}`;

  return (
    <div
      data-slot="copyable-ref"
      data-copy-state={state}
      className={cn(
        "flex items-center gap-2 rounded-[var(--radius-sm)] border",
        "border-[var(--weft-rule,var(--border))] bg-[var(--weft-fill-soft,var(--muted))]",
        "px-2.5 py-1.5",
        className,
      )}
      {...props}
    >
      <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-[var(--weft-muted,var(--muted-foreground))]">
        {children ?? value}
      </code>
      <button
        type="button"
        aria-label={buttonLabel}
        onClick={copy}
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center gap-1.5",
          "min-h-6 rounded-[var(--radius-sm)] border",
          "border-[var(--weft-rule-strong,var(--border))] bg-transparent",
          "px-2 py-0.5 text-[11px] text-[var(--weft-ink,var(--foreground))]",
          "transition-colors hover:bg-[var(--weft-fill-soft,var(--accent))]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--weft-blue,var(--ring))]",
          state === "success" && "text-[var(--weft-ok)]",
          state === "failure" && "text-[var(--weft-stop)]",
        )}
      >
        {state === "success" ? (
          <Check className="size-3" aria-hidden="true" />
        ) : state === "failure" ? (
          <X className="size-3" aria-hidden="true" />
        ) : (
          <Copy className="size-3" aria-hidden="true" />
        )}
        <span aria-live="polite" aria-atomic="true">
          {state === "success" ? "Copied" : state === "failure" ? "Failed" : "Copy"}
        </span>
      </button>
    </div>
  );
}

export { CopyableRef };
