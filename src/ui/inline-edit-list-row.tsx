import * as React from "react";
import { Pencil, X } from "lucide-react";
import { Textarea } from "./textarea";
import { HudListRow } from "./hud-list-row";
import { cn } from "./utils";

/*
 * InlineEditListRow — click-to-edit text row with hover edit/delete actions.
 *
 * A specialization of the canonical HudListRow (frame=false): HudListRow owns the
 * leading/body/trailing layout; this component owns the inline-edit behavior
 * (click to edit, Enter/Escape, commit-on-blur, hover-revealed actions). Public
 * API + data-slots + visual unchanged.
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

    React.useEffect(() => {
      if (!editing) setDraft(text);
    }, [text, editing]);

    const commit = () => {
      const trimmed = draft.trim();
      if (trimmed && trimmed !== text) onUpdate(trimmed);
      else setDraft(text);
      setEditing(false);
    };

    const startEdit = () => {
      setDraft(text);
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
          <Textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                commit();
              }
              if (e.key === "Escape") {
                setDraft(text);
                setEditing(false);
              }
            }}
            onBlur={commit}
            aria-label={editAriaLabel}
            rows={rows}
          />
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
          onClick={startEdit}
          className={cn(
            "cursor-text text-[length:var(--text-xs)] leading-[1.55] text-[var(--hud-text-2)] [font-family:var(--weft-font-sans)]",
            italic && "italic",
          )}
        >
          {text}
        </span>
      </HudListRow>
    );
  },
);
InlineEditListRow.displayName = "InlineEditListRow";

export { InlineEditListRow };
export type { InlineEditListRowProps };
