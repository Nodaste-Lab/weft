import * as React from "react";

import { ListItem, type ListItemProps } from "./list-item";
import { cn } from "./utils";

export type ListBlockSelectionMode = "none" | "single" | "multiple";

export type ListBlockItem = Pick<
  ListItemProps,
  "id" | "label" | "detail" | "selected" | "disabled" | "onSelect"
>;

export type ListBlockProps = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  items: ListBlockItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  selectionMode?: ListBlockSelectionMode;
};

const ListBlock = React.forwardRef<HTMLElement, ListBlockProps>(
  (
    {
      className,
      items,
      title,
      description,
      selectionMode = "none",
      ...props
    },
    ref,
  ) => {
    const listLabel = typeof title === "string" ? title : props["aria-label"];

    return (
      <section
        ref={ref}
        role="region"
        data-slot="list-block"
        data-selection-mode={selectionMode}
        className={cn(
          "flex max-w-full flex-col gap-3 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3 [font-family:var(--weft-font-sans)]",
          className,
        )}
        {...props}
      >
        {title || description ? (
          <div data-slot="list-block-header" className="flex flex-col gap-1">
            {title ? (
              <div data-slot="list-block-title" className="text-sm font-semibold text-[var(--hud-text-1)]">
                {title}
              </div>
            ) : null}
            {description ? (
              <p data-slot="list-block-description" className="m-0 text-xs leading-snug text-[var(--hud-text-2)]">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        <ul
          role="list"
          aria-label={listLabel}
          data-slot="list-block-list"
          className="m-0 flex list-none flex-col gap-2 p-0"
        >
          {items.map((item) => (
            <ListItem key={item.id} {...item} />
          ))}
        </ul>
      </section>
    );
  },
);

ListBlock.displayName = "ListBlock";

export { ListBlock };
