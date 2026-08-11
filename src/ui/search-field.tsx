"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { useCommitBoundary, type CommitDetail } from "./use-commit-boundary";
import { cn } from "./utils";

/*
 * SearchField — search as a stated pattern, not a type attribute (P7,
 * proposals document B §3).
 *
 * Hidden label (the naming ladder's rung for a surface that cannot carry a
 * visible one — the label prop is REQUIRED, so a nameless searchbox cannot be
 * expressed), leading icon as an inline glyph reading currentColor (a data-URI
 * cannot read a token — the select-chevron lesson), and a clear control that
 * appears only when there is something to clear.
 *
 * The clear is specified behaviourally: a real `button type="button"` (inside
 * a form anything else submits — the classic defect), named "Clear search",
 * hidden under disabled and read-only (a value that cannot be edited cannot
 * be cleared), and clearing keeps focus in the field while emitting exactly
 * one change and one commit. Its `pointerdown` prevents default so focus
 * never leaves the input on a pointer clear, registers an explicit save for
 * the blur that fires when it does leave (keyboard activation), and cancels
 * the registration if the activation dies on the way (drag-off, cancel).
 *
 * The trailing padding is provisional: document B has not settled the search
 * input's trailing geometry, and P5's enumerated measurements finalize it.
 */

// aria-label and aria-labelledby are OMITTED, deliberately: the required
// `label` prop is the accessible name (rendered as a hidden <label>), and a
// forwarded aria-label would silently override it — the exact
// two-names-one-control defect the P1–P4 review caught twice on the template
// pages, and the ladder sanctions aria-label for icon-only controls alone.
export type SearchFieldProps = Omit<
  React.ComponentProps<"input">,
  // Native `size` (width-in-characters) is omitted for the same reason Input
  // omits it: the compose axis owns that name. SearchField forwards the
  // compose value straight through, so a rail can ask for a small search.
  "type" | "aria-label" | "aria-labelledby" | "size"
> & {
  /** The accessible name, rendered as a visually hidden label. Required. */
  label: string;
  /** The compose size step, forwarded to the underlying Input. */
  size?: "default" | "sm";
  /** Accessible name for the clear control. */
  clearLabel?: string;
  /** Opt-in commit signal (blur, Enter, clear) via useCommitBoundary. */
  onCommit?: (detail: CommitDetail) => void;
};

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    { label, clearLabel = "Clear search", onCommit, className, id, onChange, ...props },
    ref,
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    // Runtime belt for the type-level omission: an untyped caller can still
    // spread an aria-label in, and it would silently override the required
    // hidden label — two names, one control, the defect the naming ladder
    // exists to prevent. The type rejects it; this makes JS agree.
    delete (props as Record<string, unknown>)["aria-label"];
    delete (props as Record<string, unknown>)["aria-labelledby"];
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const clearRef = React.useRef<HTMLButtonElement | null>(null);
    // True while clearInput's own focus() bounce is in flight, so the clear
    // button's blur is not mistaken for an abandoned activation.
    const clearingRef = React.useRef(false);
    const setRef = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    // Content tracking so the clear appears only when there is something to
    // clear. Controlled fields answer from the value prop; uncontrolled ones
    // from state seeded by defaultValue and fed by change events.
    const [innerValue, setInnerValue] = React.useState(String(props.defaultValue ?? ""));

    // Three native paths write the DOM value WITHOUT firing input/change, and
    // each would strand the uncontrolled mirror above — a clear button shown
    // for an empty field, or missing over real content, either way a wrong
    // accessible affordance: form.reset() (restores defaults), session
    // restore (the browser refills the field it remembers), and autofill.
    // The sync is the same for all three: read the DOM's settled value.
    // No commit is ever emitted — none of these is a boundary.
    React.useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const sync = () => {
        if (innerRef.current) setInnerValue(innerRef.current.value);
      };
      // Session restore can land before effects run: reconcile at mount.
      if (el.value !== String(props.defaultValue ?? "")) sync();
      // reset(): the event fires first, the restoration follows in the same
      // task — a microtask reads the settled value.
      const onReset = () => queueMicrotask(sync);
      // pageshow: bfcache restores fire no input events at all.
      const form = el.form;
      form?.addEventListener("reset", onReset);
      window.addEventListener("pageshow", sync);
      return () => {
        form?.removeEventListener("reset", onReset);
        window.removeEventListener("pageshow", sync);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-time reconciliation only
    }, []);

    const value = props.value !== undefined ? String(props.value) : innerValue;
    const hasContent = value.length > 0;
    const clearable = hasContent && !props.disabled && !props.readOnly;

    const onCommitRef = React.useRef(onCommit);
    onCommitRef.current = onCommit;
    const boundary = useCommitBoundary({
      onCommit: (detail) => onCommitRef.current?.(detail),
    });

    const clearInput = () => {
      const el = innerRef.current;
      if (!el) return;
      clearingRef.current = true;
      // Through the native setter + a real input event, so controlled and
      // uncontrolled consumers both see exactly ONE ordinary change — the
      // helper never writes a value, and this component writes it as the
      // user's own action, not as a state mutation behind React's back.
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.focus();
      // The commit waits one microtask, until AFTER React flushes the change:
      // committed synchronously, a controlled consumer's onCommit would still
      // observe the pre-clear value and validate the wrong thing. Not a timer,
      // not a guess — event ordering.
      queueMicrotask(() => {
        boundary.commit("explicit-save");
        clearingRef.current = false;
      });
    };

    // data-slot lets the shared stylesheet reach this composition the way
    // .weft-search reaches the plain one — the invalid glyph's step-left-of-
    // the-clear offset keys on either marker, one rule, both layers.
    return (
      <div data-slot="search-field" className={cn("relative inline-flex w-full items-center", className)}>
        <label className="sr-only" htmlFor={inputId}>
          {label}
        </label>
        <Search
          aria-hidden="true"
          size={14}
          className="pointer-events-none absolute left-2.5 text-muted-foreground"
        />
        <Input
          {...boundary.getFieldProps({
            ...props,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setInnerValue(e.target.value);
              onChange?.(e);
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
              // SearchField OWNS its clear button, so unlike a generic Save
              // control (where keyboard activation is inherently two
              // transactions — document C §2), a Tab into our own clear can
              // register the explicit save BEFORE the helper sees the blur:
              // supplied handlers run first, so the blur is suppressed and the
              // eventual commit reports { reason: "explicit-save",
              // sources: ["blur", "explicit-save"] }. One commit, keyboard too.
              if (e.relatedTarget === clearRef.current) {
                boundary.registerExplicitSave();
              }
              props.onBlur?.(e);
            },
          })}
          id={inputId}
          ref={setRef}
          type="search"
          // The trailing reserve reads the same token the plain-CSS recipe
          // reads — document B's owner-called map, 36/32/30 by density. The
          // fallback is the old fixed 32px, so rendering without weft.css is
          // unchanged. The leading 32px is the icon reserve, fixed in both
          // layers alike.
          className={cn(
            "pl-8",
            clearable && "pr-[var(--weft-search-pad-end,32px)]",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
        {clearable ? (
          <button
            ref={clearRef}
            type="button"
            aria-label={clearLabel}
            onPointerDown={(e) => {
              // Primary activation only. A right-click (context menu), a
              // secondary touch, or a macOS Ctrl-click — which arrives as
              // BUTTON 0 with ctrlKey — fires pointerdown but never the click
              // that commits; an armed registration with no activation coming
              // would suppress and swallow the next blur.
              if (e.button !== 0 || !e.isPrimary || e.ctrlKey) return;
              // Keep focus in the field on a pointer clear; register for the
              // keyboard path, where focus genuinely moves and blurs first.
              e.preventDefault();
              boundary.registerExplicitSave();
            }}
            // The net under the gate: however a context menu arrives, it means
            // no activation is coming — release the registration, replaying
            // any already-suppressed blur.
            onContextMenu={boundary.cancelExplicitSave}
            onPointerLeave={boundary.cancelExplicitSave}
            onPointerCancel={boundary.cancelExplicitSave}
            onBlur={() => {
              // Tabbed in, tabbed on, never activated: the registration is
              // abandoned and the suppressed blur replays as an ordinary blur
              // commit. Skipped while clearInput's own focus() bounce is in
              // flight — that blur is part of the clear, not an abandonment.
              if (!clearingRef.current) boundary.cancelExplicitSave();
            }}
            onClick={clearInput}
            className="absolute right-1 flex size-6 min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" size={14} />
          </button>
        ) : null}
      </div>
    );
  },
);

SearchField.displayName = "SearchField";

export { SearchField };
