import * as React from "react";

import { FollowUpItem, type FollowUpItemProps } from "./follow-up-item";
import { cn } from "./utils";

export type FollowUpBlockDensity = "compact" | "default";
export type FollowUpBlockTone = "default" | "muted" | "accent";

export type FollowUpBlockItem = Pick<
  FollowUpItemProps,
  "id" | "label" | "detail" | "selected" | "disabled" | "onSelect"
>;

export type FollowUpBlockProps = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  items: FollowUpBlockItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  density?: FollowUpBlockDensity;
  tone?: FollowUpBlockTone;
};

const densityClasses: Record<FollowUpBlockDensity, string> = {
  compact: "gap-2 p-2",
  default: "gap-3 p-3",
};

const toneClasses: Record<FollowUpBlockTone, string> = {
  default: "bg-[var(--hud-surface-raised)]",
  muted: "bg-[var(--hud-surface)]",
  accent: "bg-[var(--hud-info-bg-soft)]",
};

const FollowUpBlock = React.forwardRef<HTMLElement, FollowUpBlockProps>(
  (
    {
      className,
      items,
      title,
      description,
      density = "default",
      tone = "default",
      ...props
    },
    ref,
  ) => {
    const listLabel = typeof title === "string" ? title : props["aria-label"];

    return (
      <section
        ref={ref}
        role="region"
        data-slot="follow-up-block"
        data-density={density}
        data-tone={tone}
        className={cn(
          "flex max-w-full flex-col rounded-[var(--radius-sm)] border border-[var(--hud-border)] [font-family:var(--weft-font-sans)]",
          densityClasses[density],
          toneClasses[tone],
          className,
        )}
        {...props}
      >
        {title || description ? (
          <div data-slot="follow-up-block-header" className="flex flex-col gap-1">
            {title ? (
              <div data-slot="follow-up-block-title" className="text-sm font-semibold text-[var(--hud-text-1)]">
                {title}
              </div>
            ) : null}
            {description ? (
              <p data-slot="follow-up-block-description" className="m-0 text-xs leading-snug text-[var(--hud-text-2)]">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        <div
          role="list"
          aria-label={listLabel}
          data-slot="follow-up-block-list"
          className="flex flex-col gap-2"
        >
          {items.map((item) => (
            <FollowUpItem key={item.id} {...item} />
          ))}
        </div>
      </section>
    );
  },
);

FollowUpBlock.displayName = "FollowUpBlock";

export { FollowUpBlock };
