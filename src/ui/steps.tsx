import * as React from "react";

import {
  StepsItem,
  type StepsDensity,
  type StepsOrientation,
  type StepsStatus,
} from "./steps-item";
import { cn } from "./utils";

export type StepsItemData = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  status?: StepsStatus;
  meta?: React.ReactNode;
};

export type StepsProps = Omit<React.ComponentPropsWithoutRef<"ol">, "children"> & {
  items: StepsItemData[];
  orientation?: StepsOrientation;
  density?: StepsDensity;
  showConnectors?: boolean;
};

const orientationClasses: Record<StepsOrientation, string> = {
  vertical: "flex flex-col",
  horizontal: "grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]",
};

const densityClasses: Record<StepsDensity, string> = {
  compact: "gap-2 text-xs",
  default: "gap-3 text-sm",
};

const Steps = React.forwardRef<HTMLOListElement, StepsProps>(
  (
    {
      className,
      items,
      orientation = "vertical",
      density = "default",
      showConnectors = true,
      ...props
    },
    ref,
  ) => {
    return (
      <ol
        ref={ref}
        data-slot="steps"
        data-orientation={orientation}
        data-density={density}
        data-connectors={showConnectors ? "true" : "false"}
        className={cn(
          "m-0 list-none p-0 [font-family:var(--weft-font-sans)]",
          orientationClasses[orientation],
          densityClasses[density],
          className,
        )}
        {...props}
      >
        {items.map((item, index) => {
          const hasConnector = showConnectors && index < items.length - 1;

          return (
            <StepsItem
              key={item.id}
              id={item.id}
              index={index}
              label={item.label}
              description={item.description}
              status={item.status}
              meta={item.meta}
              orientation={orientation}
              density={density}
              showConnector={hasConnector}
            />
          );
        })}
      </ol>
    );
  },
);

Steps.displayName = "Steps";

export { Steps };
export type { StepsDensity, StepsOrientation, StepsStatus };
