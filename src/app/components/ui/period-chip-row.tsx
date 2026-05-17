import * as React from "react";

import { cn } from "./utils";

export type PeriodChipRowProps = React.ComponentPropsWithoutRef<"div">;

/** Flex-wrap row for session recap / date-window preset chips (two logical rows in recap builder). */
function PeriodChipRow({ className, ...props }: PeriodChipRowProps) {
  return (
    <div
      data-slot="period-chip-row"
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  );
}

export { PeriodChipRow };
