"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

// Explicit state axis, consistent with Input/Textarea/Select. (readonly isn't
// meaningful for a radio group — use disabled.) `error`/`disabled` apply to the
// whole group, so the axis lives on the Root and styling cascades to the items.
// Uses `data-field-state` (not `data-state`) because Radix already drives
// `data-state` on the items (checked/unchecked).
type RadioGroupState = "default" | "error" | "disabled";

function RadioGroup({
  className,
  state,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & { state?: RadioGroupState }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      data-field-state={state}
      className={cn("group/radio grid gap-3", className)}
      {...props}
      aria-invalid={state === "error" ? true : props["aria-invalid"]}
      disabled={state === "disabled" ? true : props.disabled}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // Error state set on the group cascades to each item's border.
        "group-aria-invalid/radio:border-destructive",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
export type { RadioGroupState };
