import * as React from "react";

import { cn } from "./utils";

type TextareaState = "default" | "error" | "disabled" | "readonly";

function Textarea({ className, state, ...props }: React.ComponentProps<"textarea"> & { state?: TextareaState }) {
  return (
    <textarea
      data-slot="textarea"
      data-state={state}
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        state === "readonly" && "cursor-default bg-muted/40",
        className,
      )}
      {...props}
      aria-invalid={state === "error" ? true : props["aria-invalid"]}
      disabled={state === "disabled" ? true : props.disabled}
      readOnly={state === "readonly" ? true : props.readOnly}
    />
  );
}

export { Textarea };
