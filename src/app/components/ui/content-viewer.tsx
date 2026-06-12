import * as React from "react";

import { Button } from "./button";
import { CodeBlock } from "./code-block";
import { EmptyState } from "./empty-state";
import { cn } from "./utils";

export type ContentViewerView = "rendered" | "source";

export type ContentViewerProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Raw source text. Shown in the Source view and used for the empty check. */
  source: string;
  /** Rendered representation of the source — the default "Rendered" view. */
  children: React.ReactNode;
  /** Language tag for the Source code view, e.g. "html" or "markdown". */
  sourceLanguage?: string;
  /** Show the Rendered / Source segmented toggle. Defaults to true. */
  showSourceToggle?: boolean;
  /** Show a copy-source action in the toolbar. Defaults to true. */
  showCopy?: boolean;
  /** Which view to show first. Defaults to "rendered". */
  defaultView?: ContentViewerView;
  /** Title shown when there is nothing to display. */
  emptyLabel?: React.ReactNode;
  /** Invoked when the source is copied, alongside the clipboard write. */
  onCopySource?: (source: string) => void;
};

/*
 * ContentViewer — read-only viewer shell shared by HtmlViewer and MarkdownViewer.
 *
 * Owns the chrome common to every "render content passed in" surface: a
 * Rendered / Source toggle, a copy-source action, an empty state, and a
 * scrollable body. The rendering of `source` is supplied as children so each
 * format (HTML, Markdown, …) plugs in its own renderer while keeping one shape.
 */
function ContentViewer({
  className,
  source,
  children,
  sourceLanguage,
  showSourceToggle = true,
  showCopy = true,
  defaultView = "rendered",
  emptyLabel = "Nothing to display",
  onCopySource,
  ...props
}: ContentViewerProps) {
  const [view, setView] = React.useState<ContentViewerView>(defaultView);
  const isEmpty = source.trim().length === 0;

  const handleCopy = React.useCallback(() => {
    onCopySource?.(source);
    void navigator?.clipboard?.writeText?.(source);
  }, [onCopySource, source]);

  const showToolbar = !isEmpty && (showSourceToggle || showCopy);

  return (
    <div
      data-slot="content-viewer"
      data-view={isEmpty ? "empty" : view}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]",
        className,
      )}
      {...props}
    >
      {showToolbar ? (
        <div
          data-slot="content-viewer-toolbar"
          className="flex min-h-8 items-center justify-between gap-2 border-b border-[var(--hud-border)] bg-[var(--hud-section-fill-medium)] px-2 py-1.5"
        >
          {showSourceToggle ? (
            <div
              data-slot="content-viewer-view-toggle"
              role="group"
              aria-label="Choose view"
              className="flex items-center gap-0.5"
            >
              {(["rendered", "source"] as const).map((value) => (
                <Button
                  key={value}
                  type="button"
                  data-slot="content-viewer-view-option"
                  data-view-option={value}
                  variant={view === value ? "secondary" : "ghost"}
                  size="sm"
                  aria-pressed={view === value}
                  className="h-7 px-2 text-[11px] capitalize"
                  onClick={() => setView(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {showCopy ? (
            <Button
              type="button"
              data-slot="content-viewer-copy"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={handleCopy}
              aria-label="Copy source"
            >
              Copy
            </Button>
          ) : null}
        </div>
      ) : null}

      <div
        data-slot="content-viewer-body"
        className="min-h-0 flex-1 overflow-auto"
      >
        {isEmpty ? (
          <EmptyState data-slot="content-viewer-empty" title={emptyLabel} />
        ) : view === "source" ? (
          <CodeBlock
            data-slot="content-viewer-source"
            code={source}
            language={sourceLanguage}
            wrap
            className="rounded-none border-0 shadow-none"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export { ContentViewer };
