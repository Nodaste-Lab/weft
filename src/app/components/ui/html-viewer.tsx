import * as React from "react";

import { ContentViewer } from "./content-viewer";
import { cn } from "./utils";

export type HtmlViewerProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Raw HTML source to render. */
  html: string;
  /** Accessible title for the sandboxed frame. */
  frameTitle?: string;
  /** Title shown when `html` is empty. */
  emptyLabel?: React.ReactNode;
  /** Show the Rendered / Source toggle. Defaults to true. */
  showSourceToggle?: boolean;
  /** Show the copy-source action. Defaults to true. */
  showCopy?: boolean;
};

/*
 * Strict, script-free policy for displaying arbitrary/agent-produced HTML:
 * markup, inline styles, and images render; scripts, network, and form
 * submission are all denied. Paired with a fully restricted iframe sandbox.
 */
const HTML_VIEWER_CSP = [
  "default-src 'none'",
  "img-src data: https:",
  "media-src data: https:",
  "style-src 'unsafe-inline'",
  "font-src data:",
  "script-src 'none'",
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
].join("; ");

export function buildHtmlViewerSrcDoc(html: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="${HTML_VIEWER_CSP}" />
<style>
  :root { color-scheme: light dark; }
  html, body { margin: 0; }
  body {
    background: transparent;
    color: CanvasText;
    font-family: Inter, system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    padding: 12px;
    overflow-wrap: anywhere;
  }
  img, video, canvas, svg { max-width: 100%; height: auto; }
  a { color: AccentColor; }
  table { border-collapse: collapse; }
</style>
</head>
<body>${html}</body>
</html>`;
}

/*
 * HtmlViewer — read-only viewer for a passed-in HTML string.
 *
 * Renders the HTML inside a fully sandboxed iframe (empty `sandbox`, so no
 * `allow-scripts` and no `allow-same-origin`) with a strict `script-src 'none'`
 * CSP, so arbitrary or agent-produced markup displays faithfully — styles,
 * images, layout — without executing scripts or reaching the host page. The
 * raw source can be inspected via the shared ContentViewer toggle.
 */
function HtmlViewer({
  className,
  html,
  frameTitle = "HTML preview",
  emptyLabel = "No HTML to display",
  showSourceToggle,
  showCopy,
  ...props
}: HtmlViewerProps) {
  const srcDoc = React.useMemo(() => buildHtmlViewerSrcDoc(html), [html]);

  return (
    <ContentViewer
      data-slot="html-viewer"
      className={cn(className)}
      source={html}
      sourceLanguage="html"
      emptyLabel={emptyLabel}
      showSourceToggle={showSourceToggle}
      showCopy={showCopy}
      {...props}
    >
      <iframe
        data-slot="html-viewer-frame"
        title={frameTitle}
        srcDoc={srcDoc}
        sandbox=""
        className="h-full min-h-64 w-full border-0 bg-transparent"
      />
    </ContentViewer>
  );
}

export { HtmlViewer };
