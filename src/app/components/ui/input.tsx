import * as React from "react";

import { cn } from "./utils";

type InputState = "default" | "error" | "disabled" | "readonly";

// Named (not inline in the forwardRef generic) so the prop-contract extractor's
// *Props-alias scan captures the surface — keeps Input's contract gate-guarded.
export type InputProps = React.ComponentProps<"input"> & { state?: InputState };

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, state, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      data-state={state}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input text-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // readonly reads as filled-but-static, distinct from disabled's dimming.
        state === "readonly" && "cursor-default bg-muted/40",
        className,
      )}
      {...props}
      aria-invalid={state === "error" ? true : props["aria-invalid"]}
      disabled={state === "disabled" ? true : props.disabled}
      readOnly={state === "readonly" ? true : props.readOnly}
    />
  );
});

Input.displayName = "Input";

export { Input };
