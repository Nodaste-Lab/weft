import * as React from "react";

import { ContentViewer } from "./content-viewer";
import { MarkDownRenderer } from "./markdown-renderer";
import { cn } from "./utils";

export type MarkdownViewerProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Raw Markdown source to render. */
  markdown: string;
  /** Title shown when `markdown` is empty. */
  emptyLabel?: React.ReactNode;
  /** Show the Rendered / Source toggle. Defaults to true. */
  showSourceToggle?: boolean;
  /** Show the copy-source action. Defaults to true. */
  showCopy?: boolean;
};

/*
 * MarkdownViewer — read-only viewer for a passed-in Markdown string.
 *
 * Pairs the shared ContentViewer chrome (Rendered / Source toggle, copy, empty
 * state) with MarkDownRenderer, which already renders GitHub-flavored Markdown
 * with safe links, skipped raw HTML, and blocked images. The result mirrors
 * HtmlViewer so both formats share one viewer pattern.
 */
function MarkdownViewer({
  className,
  markdown,
  emptyLabel = "No Markdown to display",
  showSourceToggle,
  showCopy,
  ...props
}: MarkdownViewerProps) {
  return (
    <ContentViewer
      data-slot="markdown-viewer"
      className={cn(className)}
      source={markdown}
      sourceLanguage="markdown"
      emptyLabel={emptyLabel}
      showSourceToggle={showSourceToggle}
      showCopy={showCopy}
      {...props}
    >
      <MarkDownRenderer markdown={markdown} className="p-3" />
    </ContentViewer>
  );
}

export { MarkdownViewer };
