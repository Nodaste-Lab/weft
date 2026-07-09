import * as React from "react";

import { cn } from "./utils";

export type ConditionChipStripProps = React.ComponentPropsWithoutRef<"div">;

/** Flex-wrap row for removable condition chips plus an “add condition” control slot. */
function ConditionChipStrip({ className, ...props }: ConditionChipStripProps) {
  return (
    <div
      data-slot="condition-chip-strip"
      className={cn("flex flex-wrap gap-1 pl-0.5", className)}
      {...props}
    />
  );
}

export { ConditionChipStrip };
