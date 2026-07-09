import * as React from "react";

import { SectionItem, type SectionItemProps } from "./section-item";
import { cn } from "./utils";

export type SectionBlockItem = Pick<
  SectionItemProps,
  "id" | "label" | "content" | "meta" | "defaultOpen"
>;

export type SectionBlockProps = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  items: SectionBlockItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
};

const SectionBlock = React.forwardRef<HTMLElement, SectionBlockProps>(
  (
    {
      className,
      items,
      title,
      description,
      ...props
    },
    ref,
  ) => {
    const listLabel = typeof title === "string" ? title : props["aria-label"];

    return (
      <section
        ref={ref}
        role="region"
        data-slot="section-block"
        className={cn(
          "flex max-w-full flex-col gap-3 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-3 [font-family:var(--weft-font-sans)]",
          className,
        )}
        {...props}
      >
        {title || description ? (
          <div data-slot="section-block-header" className="flex flex-col gap-1">
            {title ? (
              <div data-slot="section-block-title" className="text-sm font-semibold text-[var(--hud-text-1)]">
                {title}
              </div>
            ) : null}
            {description ? (
              <p data-slot="section-block-description" className="m-0 text-xs leading-snug text-[var(--hud-text-2)]">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        <ul
          role="list"
          aria-label={listLabel}
          data-slot="section-block-list"
          className="m-0 flex list-none flex-col gap-2 p-0"
        >
          {items.map((item) => (
            <SectionItem key={item.id} {...item} />
          ))}
        </ul>
      </section>
    );
  },
);

SectionBlock.displayName = "SectionBlock";

export { SectionBlock };
