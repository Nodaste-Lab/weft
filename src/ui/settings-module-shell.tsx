import * as React from "react";

import { cn } from "./utils";
import { EyebrowLabel } from "./eyebrow-label";

/*
 * SettingsModuleShell — bordered settings card.
 *
 * Used by Session Context, App Settings, My Account, and Mode Manager
 * surfaces to render a self-contained settings module: a header strip
 * with eyebrow + title + optional actions, a bordered body, and an
 * optional footer.
 *
 * The body is a flex column by default so consumers can drop labelled
 * fields directly inside without re-deriving the shell chrome. Pass
 * `bodyClassName` to override (e.g. `grid grid-cols-2 gap-3`).
 *
 * `tone`:
 *   - default → workspace-neutral chrome (--hud-surface-raised)
 *   - subtle  → flatter chrome (--hud-surface) for nested modules
 *   - inset   → no border, minimal chrome (used inside dialogs)
 */

type SettingsModuleTone = "default" | "subtle" | "inset";

interface SettingsModuleShellProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: SettingsModuleTone;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  collapsed?: boolean;
}

const SHELL_BY_TONE: Record<SettingsModuleTone, string> = {
  default:
    "border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] rounded-[var(--radius-md)]",
  subtle:
    "border border-[var(--hud-border)] bg-[var(--hud-surface)] rounded-[var(--radius-sm)]",
  inset: "border-0 bg-transparent rounded-none",
};

const SettingsModuleShell = React.forwardRef<HTMLElement, SettingsModuleShellProps>(
  (
    {
      className,
      title,
      eyebrow,
      description,
      actions,
      footer,
      tone = "default",
      bodyClassName,
      headerClassName,
      footerClassName,
      collapsed,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        data-slot="settings-module-shell"
        data-tone={tone}
        data-collapsed={collapsed ? "true" : undefined}
        className={cn("flex flex-col", SHELL_BY_TONE[tone], className)}
        {...props}
      >
        <header
          data-slot="settings-module-header"
          className={cn(
            "flex items-start justify-between gap-3 px-3.5 py-2.5",
            "[font-family:var(--weft-font-sans)]",
            tone !== "inset" && children ? "border-b border-[var(--hud-border)]" : "",
            headerClassName,
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {eyebrow ? (
              typeof eyebrow === "string" ? (
                <EyebrowLabel size="sm">{eyebrow}</EyebrowLabel>
              ) : (
                eyebrow
              )
            ) : null}
            <h3 className="m-0 text-[length:var(--text-sm)] font-semibold text-[var(--hud-text-1)]">
              {title}
            </h3>
            {description ? (
              <p className="m-0 text-[length:var(--text-xs)] text-[var(--hud-text-3)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div data-slot="settings-module-actions" className="flex shrink-0 items-center gap-1.5">
              {actions}
            </div>
          ) : null}
        </header>
        {children && !collapsed ? (
          <div
            data-slot="settings-module-body"
            className={cn("flex flex-col gap-3 px-3.5 py-3", bodyClassName)}
          >
            {children}
          </div>
        ) : null}
        {footer ? (
          <footer
            data-slot="settings-module-footer"
            className={cn(
              "flex items-center justify-end gap-2 border-t border-[var(--hud-border)] px-3.5 py-2",
              footerClassName,
            )}
          >
            {footer}
          </footer>
        ) : null}
      </section>
    );
  },
);
SettingsModuleShell.displayName = "SettingsModuleShell";

export { SettingsModuleShell };
export type { SettingsModuleShellProps, SettingsModuleTone };
