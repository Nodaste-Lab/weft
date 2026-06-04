import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Button } from "./button";
import { cn } from "./utils";

export type SectionItemProps = Omit<React.ComponentPropsWithoutRef<"li">, "children"> & {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  meta?: React.ReactNode;
  defaultOpen?: boolean;
};

const SectionItem = React.forwardRef<HTMLLIElement, SectionItemProps>(
  (
    {
      className,
      id,
      label,
      content,
      meta,
      defaultOpen = false,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
      <li
        ref={ref}
        data-slot="section-item"
        data-item-id={id}
        data-open={open ? "true" : "false"}
        className={cn(
          "rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface)] [font-family:var(--weft-font-sans)]",
          className,
        )}
        {...props}
      >
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-slot="section-item-trigger"
              className="h-auto min-h-0 w-full justify-between gap-3 rounded-[var(--radius-sm)] p-2 text-left hover:bg-[var(--hud-surface-raised)]"
            >
              <span data-slot="section-item-label" className="min-w-0 text-sm font-semibold text-[var(--hud-text-1)]">
                {label}
              </span>
              {meta ? (
                <span data-slot="section-item-meta" className="shrink-0 text-xs font-medium text-[var(--hud-text-3)]">
                  {meta}
                </span>
              ) : null}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent
            forceMount
            data-slot="section-item-content"
            hidden={!open}
            className="border-t border-[var(--hud-border)] p-2 text-sm leading-snug text-[var(--hud-text-2)]"
          >
            {content}
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  },
);

SectionItem.displayName = "SectionItem";

export { SectionItem };
