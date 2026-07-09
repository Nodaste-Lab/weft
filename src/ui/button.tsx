import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      interactionState: {
        idle: "",
        blocked:
          "cursor-default border border-border/80 bg-muted/30 text-muted-foreground opacity-80 hover:bg-muted/30 hover:text-muted-foreground",
        disabled:
          "border border-border/60 bg-muted/30 text-muted-foreground opacity-60 hover:bg-muted/30 hover:text-muted-foreground",
        loading: "cursor-wait opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      interactionState: "idle",
      size: "default",
    },
  },
);

type ButtonInteractionState = "idle" | "blocked" | "disabled" | "loading";

type ButtonProps = React.ComponentProps<"button"> &
  Omit<VariantProps<typeof buttonVariants>, "interactionState"> & {
    asChild?: boolean;
    blocked?: boolean;
    loading?: boolean;
    /** Toggle/selected state — applies aria-pressed + a pressed visual. */
    pressed?: boolean;
  };

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({
  asChild = false,
  blocked = false,
  children,
  className,
  disabled,
  loading = false,
  pressed,
  size,
  variant,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  const interactionState: ButtonInteractionState = loading
    ? "loading"
    : disabled
      ? "disabled"
      : blocked
        ? "blocked"
        : "idle";
  const isDisabled = disabled || loading;
  const content = asChild ? children : (
    <>
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </>
  );

  return (
    <Comp
      ref={ref}
      data-slot="button"
      data-state={interactionState}
      data-pressed={pressed ? true : undefined}
      aria-busy={loading ? true : undefined}
      aria-pressed={pressed === undefined ? undefined : pressed}
      aria-disabled={!isDisabled && blocked ? true : undefined}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, interactionState, size, className }), pressed ? "bg-accent text-accent-foreground" : null)}
      {...props}
    >
      {content}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
