import * as React from "react";

import { Button } from "./button";
import { cn } from "./utils";

export type ListItemProps = Omit<React.ComponentPropsWithoutRef<"li">, "children" | "onSelect"> & {
  id: string;
  label: React.ReactNode;
  detail?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (id: string) => void;
};

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      className,
      id,
      label,
      detail,
      selected = false,
      disabled = false,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const isInteractive = Boolean(onSelect);

    return (
      <li
        ref={ref}
        data-slot="list-item"
        data-item-id={id}
        data-selected={selected ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-interactive={isInteractive ? "true" : "false"}
        className={cn(
          "rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface)] p-2 [font-family:var(--weft-font-sans)]",
          selected && "border-[var(--primary)] bg-[var(--hud-info-bg-soft)]",
          disabled && "opacity-70",
          className,
        )}
        {...props}
      >
        {isInteractive ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-slot="list-item-action"
            aria-pressed={selected}
            disabled={disabled}
            className="h-auto min-h-[var(--weft-touch-target)] w-full justify-start px-2 py-1 text-left text-[var(--hud-text-1)] hover:bg-transparent"
            onClick={() => onSelect?.(id)}
          >
            <span data-slot="list-item-label" className="min-w-0 text-sm font-semibold leading-tight">
              {label}
            </span>
          </Button>
        ) : (
          <div data-slot="list-item-label" className="text-sm font-semibold leading-tight text-[var(--hud-text-1)]">
            {label}
          </div>
        )}
        {detail ? (
          <p data-slot="list-item-detail" className="m-0 mt-1 text-xs leading-snug text-[var(--hud-text-2)]">
            {detail}
          </p>
        ) : null}
      </li>
    );
  },
);

ListItem.displayName = "ListItem";

export { ListItem };
