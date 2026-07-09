import * as React from "react";

import { Button } from "./button";
import { cn } from "./utils";

export type CodeBlockDensity = "compact" | "default";

export type CodeBlockProps = React.ComponentPropsWithoutRef<"div"> & {
  code: string;
  language?: string;
  label?: React.ReactNode;
  wrap?: boolean;
  density?: CodeBlockDensity;
  onCopy?: (code: string) => void;
  copyLabel?: string;
};

const densityClasses: Record<CodeBlockDensity, { root: string; pre: string }> = {
  compact: {
    root: "text-[11px]",
    pre: "p-2",
  },
  default: {
    root: "text-xs",
    pre: "p-3",
  },
};

/*
 * CodeBlock — display-only plain text code surface.
 *
 * Markdown parsing, syntax highlighting, and sanitization belong to richer
 * content renderers. This primitive only owns tokenized chrome and code layout.
 */
function CodeBlock({
  className,
  code,
  language,
  label,
  wrap = false,
  density = "default",
  onCopy,
  copyLabel = "Copy code",
  ...props
}: CodeBlockProps) {
  const hasHeader = Boolean(label || language || onCopy);

  return (
    <div
      data-slot="code-block"
      data-language={language}
      data-density={density}
      data-wrap={wrap ? "true" : "false"}
      className={cn(
        "overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] text-[var(--hud-text-2)] shadow-sm",
        densityClasses[density].root,
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div
          data-slot="code-block-header"
          className="flex min-h-8 items-center justify-between gap-2 border-b border-[var(--hud-border)] bg-[var(--hud-section-fill-medium)] px-3 py-1.5"
        >
          <div className="flex min-w-0 items-center gap-2">
            {label ? (
              <span
                data-slot="code-block-label"
                className="min-w-0 truncate font-medium text-[var(--hud-text-1)]"
              >
                {label}
              </span>
            ) : null}
            {language ? (
              <span
                data-slot="code-block-language"
                className="shrink-0 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-input-bg)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--hud-text-3)] [font-family:var(--weft-font-mono)]"
              >
                {language}
              </span>
            ) : null}
          </div>
          {onCopy ? (
            <Button
              type="button"
              data-slot="code-block-copy"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[10px]"
              onClick={() => onCopy(code)}
              aria-label={copyLabel}
            >
              Copy
            </Button>
          ) : null}
        </div>
      ) : null}
      <pre
        data-slot="code-block-pre"
        className={cn(
          "m-0 max-w-full overflow-x-auto text-[var(--hud-text-2)] [font-family:var(--weft-font-mono)]",
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
          densityClasses[density].pre,
        )}
      >
        <code data-slot="code-block-code">{code}</code>
      </pre>
    </div>
  );
}

export { CodeBlock };
