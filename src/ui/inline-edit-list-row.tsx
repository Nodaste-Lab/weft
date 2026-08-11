import * as React from "react";
import { Pencil, X } from "lucide-react";
import { Textarea } from "./textarea";
import { HudListRow } from "./hud-list-row";
import { useCommitBoundary } from "./use-commit-boundary";
import { cn } from "./utils";

/*
 * InlineEditListRow — click-to-edit text row with hover edit/delete actions.
 *
 * A specialization of the canonical HudListRow (frame=false): HudListRow owns the
 * leading/body/trailing layout; this component owns the inline-edit behavior
 * (click to edit, commit-on-blur, hover-revealed actions).
 *
 * The editing state rides the commit boundary (v2.0.0, proposals document C §5
 * — decided: migrate). Three behaviours changed, each away from a contract
 * breach the old implementation shipped:
 *
 * - Enter inserts a newline. It used to preventDefault and commit — a textarea's
 *   Enter is never a boundary, and a multi-line editor whose Enter leaves is
 *   unusable as a multi-line editor.
 * - An emptied value is a value. Select-all, delete, leave commits "" — it used
 *   to restore the previous text, which is data loss with a tidy appearance.
 * - Escape OFFERS a discard rather than performing one: the first press shows
 *   the offer and touches nothing, a second press — the user choosing, with the
 *   offer visible — performs it, and typing withdraws it. Nothing happens to
 *   the user's work while they are not looking.
 */
interface InlineEditListRowProps extends Omit<React.ComponentProps<"div">, "onUpdate"> {
  text: string;
  onUpdate: (next: string) => void;
  onDelete: () => void;
  showIndex?: boolean;
  index?: number;
  leadingIcon?: React.ReactNode;
  italic?: boolean;
  editAriaLabel?: string;
  deleteAriaLabel?: string;
  rows?: number;
  as?: "div" | "li";
}

function IndexBadge({ index }: { index: number }) {
  return (
    <span
      data-slot="inline-edit-list-row-index"
      className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-[var(--hud-border-accent)] bg-[var(--hud-primary-tint-medium)] text-[10px] font-[var(--font-weight-semibold)] text-[var(--primary)]"
    >
      {index + 1}
    </span>
  );
}

const InlineEditListRow = React.forwardRef<HTMLDivElement | HTMLLIElement, InlineEditListRowProps>(
  (
    {
      className,
      text,
      onUpdate,
      onDelete,
      showIndex = false,
      index = 0,
      leadingIcon,
      italic = false,
      editAriaLabel = "Edit item",
      deleteAriaLabel = "Delete item",
      rows = 2,
      as = "div",
      ...props
    },
    ref,
  ) => {
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(text);
    const [hovered, setHovered] = React.useState(false);
    // Escape's two-step: the first press sets this and shows the hint; the
    // second performs the discard. Typing, blur or close withdraws it.
    const [discardOffered, setDiscardOffered] = React.useState(false);
    const discardHintId = React.useId();

    React.useEffect(() => {
      if (!editing) setDraft(text);
    }, [text, editing]);

    // The helper says WHEN the field committed; applying the draft is this
    // component's (the consumer's) side of the line. Empty is a value —
    // whitespace trims to "" and "" commits like anything else.
    // Escape during IME composition cancels the candidate UI, not the edit —
    // the same keydown-inside-composition rule the commit helper applies to
    // Enter, tracked here because the offer logic is this component's own.
    const imeComposingRef = React.useRef(false);

    const boundary = useCommitBoundary({
      onCommit: () => {
        // The draft commits as typed — Enter is real input now, so a trailing
        // newline or deliberate whitespace is the user's. The one normalized
        // case is all-whitespace, which commits as the empty value.
        const value = draft.trim() === "" ? "" : draft;
        if (value !== text) onUpdate(value);
        setDiscardOffered(false);
        setEditing(false);
      },
    });

    const startEdit = () => {
      setDraft(text);
      setDiscardOffered(false);
      setEditing(true);
    };

    const leading =
      showIndex || leadingIcon ? (
        <>
          {showIndex ? <IndexBadge index={index} /> : null}
          {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
        </>
      ) : undefined;

    if (editing) {
      return (
        <HudListRow
          ref={ref}
          as={as}
          frame={false}
          data-slot="inline-edit-list-row"
          data-state="editing"
          className={className}
          leadingClassName="pt-0"
          leading={leading}
          {...props}
        >
          <div className="flex w-full flex-col gap-1">
            <Textarea
              {...boundary.getFieldProps({
                autoFocus: true,
                value: draft,
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDraft(e.target.value);
                  // The user kept working; the offer no longer stands.
                  setDiscardOffered(false);
                },
                onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  // Enter falls through: on a textarea it is a newline, and the
                  // boundary helper emits nothing for it.
                  if (e.key !== "Escape") return;
                  // The open editor owns Escape outright. Without this, the
                  // first dirty press shows the offer AND bubbles to a
                  // dialog's dismiss handler, which closes the parent over the
                  // draft — losing exactly the work the offer protects. Never
                  // preventDefault: the IME's candidate dismissal is a default
                  // action, not propagation.
                  e.stopPropagation();
                  if (
                    imeComposingRef.current ||
                    e.nativeEvent.isComposing ||
                    e.keyCode === 229
                  ) {
                    return;
                  }
                  if (draft === text) {
                    // Nothing to lose — close without ceremony.
                    setDiscardOffered(false);
                    setEditing(false);
                    return;
                  }
                  if (!discardOffered) {
                    setDiscardOffered(true);
                    return;
                  }
                  // Second press with the offer visible: the user chose this.
                  setDraft(text);
                  setDiscardOffered(false);
                  setEditing(false);
                },
                onCompositionStart: () => {
                  imeComposingRef.current = true;
                },
                onCompositionEnd: () => {
                  imeComposingRef.current = false;
                },
                "aria-label": editAriaLabel,
                "aria-describedby": discardOffered ? discardHintId : undefined,
                rows,
              })}
            />
            {discardOffered ? (
              <span
                id={discardHintId}
                data-slot="inline-edit-list-row-discard-hint"
                className="text-[10px] leading-tight text-[var(--hud-text-3)]"
              >
                Unsaved edit — press Escape again to discard, or click away to save.
              </span>
            ) : null}
          </div>
        </HudListRow>
      );
    }

    return (
      <HudListRow
        ref={ref}
        as={as}
        frame={false}
        data-slot="inline-edit-list-row"
        data-state="idle"
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        leadingClassName="pt-0"
        leading={leading}
        trailingClassName={cn(
          "gap-0.5 transition-opacity duration-150",
          hovered ? "pointer-events-auto opacity-70" : "pointer-events-none opacity-0",
        )}
        trailing={
          <>
            <button
              type="button"
              onClick={startEdit}
              aria-label={editAriaLabel}
              className="flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0.5 text-[var(--hud-text-3)] hover:text-[var(--primary)]"
            >
              <Pencil size={10} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={deleteAriaLabel}
              className="flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0.5 text-[var(--hud-text-3)] hover:text-[var(--hud-danger)]"
            >
              <X size={10} />
            </button>
          </>
        }
        {...props}
      >
        <span
          data-slot="inline-edit-list-row-body"
          data-empty={text.trim() === "" || undefined}
          onClick={startEdit}
          className={cn(
            "block min-h-[1.55em] cursor-text text-[length:var(--text-xs)] leading-[1.55] text-[var(--hud-text-2)] [font-family:var(--weft-font-sans)]",
            italic && "italic",
            // Empty is a valid value the editor can now produce, so the idle
            // row must stay re-editable: an empty span is a zero-area click
            // target. The placeholder is presentation, never the value.
            text.trim() === "" && "italic text-[var(--hud-text-3)]",
          )}
        >
          {text.trim() === "" ? "Empty" : text}
        </span>
      </HudListRow>
    );
  },
);
InlineEditListRow.displayName = "InlineEditListRow";

export { InlineEditListRow };
export type { InlineEditListRowProps };
