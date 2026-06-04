import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { MarkDownRenderer } from "./markdown-renderer";
import { TextContent, type TextContentMeasure } from "./text-content";
import { cn } from "./utils";

/*
 * Callout — denser inline message panel.
 *
 * Differs from `Alert` (the shadcn primitive) and `HudIssueCallout`
 * (issue-specific) in that this is a generic, low-visual-weight notice
 * meant for inline help text, status banners, and panel-level hints.
 *
 * Use `Alert` when content needs structured title/description/icon
 * affordances and stronger visual weight. Use `HudIssueCallout` for
 * structured `HudIssue` payloads. Use `Callout` everywhere else: panel
 * help notes, recap status banners, "Add a key in App Settings"
 * empty-state warnings, etc.
 */

const calloutVariants = cva(
  "flex w-full items-start gap-2 rounded-[var(--radius-sm)] border [font-family:var(--weft-font-sans)]",
  {
    variants: {
      variant: {
        inline: "",
        text: "gap-3",
      },
      tone: {
        info: "border-[var(--hud-border-accent)] bg-[var(--hud-info-bg-soft)] text-[var(--hud-text-1)]",
        warning:
          "border-[color-mix(in_srgb,var(--hud-warning)_30%,transparent)] bg-[var(--hud-attention-bg-soft)] text-[var(--hud-text-1)]",
        danger:
          "border-[color-mix(in_srgb,var(--hud-danger)_32%,transparent)] bg-[var(--hud-danger-bg-soft)] text-[var(--hud-text-1)]",
        positive:
          "border-[color-mix(in_srgb,var(--hud-positive)_30%,transparent)] bg-[var(--hud-positive-bg-soft,color-mix(in_srgb,var(--hud-positive)_10%,transparent))] text-[var(--hud-text-1)]",
        muted: "border-[var(--hud-border)] bg-[var(--hud-surface-raised)] text-[var(--hud-text-2)]",
      },
      density: {
        compact: "px-2.5 py-1.5 text-[length:var(--text-xs)]",
        default: "px-3 py-2 text-[length:var(--text-sm)]",
      },
    },
    defaultVariants: {
      variant: "inline",
      tone: "info",
      density: "default",
    },
  },
);

const calloutIconVariants = cva("inline-flex shrink-0 items-center justify-center [&>svg]:size-3.5", {
  variants: {
    tone: {
      info: "text-[var(--hud-info,var(--primary))]",
      warning: "text-[var(--hud-warning)]",
      danger: "text-[var(--hud-danger)]",
      positive: "text-[var(--hud-positive)]",
      muted: "text-[var(--hud-text-3)]",
    },
  },
  defaultVariants: { tone: "info" },
});

interface CalloutProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof calloutVariants> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  markdown?: string;
  contentMeasure?: TextContentMeasure;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      variant = "inline",
      tone,
      density,
      icon,
      title,
      action,
      markdown,
      contentMeasure = "wide",
      children,
      ...props
    },
    ref,
  ) => {
    const role = tone === "danger" || tone === "warning" ? "alert" : "status";
    const hasBody = Boolean(children || markdown);
    return (
      <div
        ref={ref}
        data-slot="callout"
        data-variant={variant}
        data-tone={tone ?? "info"}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        className={cn(calloutVariants({ variant, tone, density }), className)}
        {...props}
      >
        {icon ? (
          <span aria-hidden="true" className={cn(calloutIconVariants({ tone }), "mt-0.5")}>
            {icon}
          </span>
        ) : null}
        <div className={cn("flex min-w-0 flex-1 flex-col", variant === "text" ? "gap-2" : "gap-1")}>
          {title ? (
            <p className="m-0 font-semibold leading-tight text-[length:inherit]">{title}</p>
          ) : null}
          {variant === "text" && hasBody ? (
            children ? (
              <TextContent
                asChild
                data-slot="callout-text-content"
                measure={contentMeasure}
                size={density === "compact" ? "sm" : "default"}
              >
                <div>{children}</div>
              </TextContent>
            ) : (
              <MarkDownRenderer
                markdown={markdown ?? ""}
                className="space-y-2 text-[length:inherit]"
              />
            )
          ) : children ? (
            <div className="m-0 leading-snug text-[length:inherit] text-[var(--hud-text-2)]">
              {children}
            </div>
          ) : null}
        </div>
        {action ? (
          <div data-slot="callout-action" className="ml-1 shrink-0">
            {action}
          </div>
        ) : null}
      </div>
    );
  },
);
Callout.displayName = "Callout";

export { Callout, calloutVariants };
export type { CalloutProps };
