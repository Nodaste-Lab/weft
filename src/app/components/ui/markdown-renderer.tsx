import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

import { CodeBlock } from "./code-block";
import { TextContent } from "./text-content";
import { cn } from "./utils";

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

export type MarkDownRendererProps = ComponentPropsWithoutRef<"div"> & {
  markdown: string;
};

function isSafeHref(href: string | undefined): href is string {
  if (!href) return false;
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return true;
  }
  try {
    return SAFE_PROTOCOLS.has(new URL(trimmed).protocol);
  } catch {
    return false;
  }
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function languageFromClassName(className: string | undefined): string | undefined {
  return className?.split(/\s+/).find((name) => name.startsWith("language-"))?.replace(/^language-/, "");
}

function stripRawHtmlLines(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return true;
      }
      if (inFence) {
        return true;
      }
      return !/(<\/?[A-Za-z][^>]*>|<!--|<!doctype)/i.test(line);
    })
    .join("\n");
}

function SafeLink({ href, children, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!isSafeHref(href)) {
    return (
      <span data-slot="markdown-renderer-blocked-link" data-blocked-href="true">
        {children}
      </span>
    );
  }
  return (
    <a
      data-slot="markdown-renderer-link"
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className={cn("text-primary underline underline-offset-4", className)}
      {...props}
    >
      {children}
    </a>
  );
}

/*
 * MarkDownRenderer — constrained markdown display for generated content.
 *
 * Raw HTML is skipped. Links are protocol-filtered. Images are blocked by
 * default. Keep richer parsing/sanitizing policy outside this primitive.
 */
function MarkDownRenderer({ className, markdown, ...props }: MarkDownRendererProps) {
  const safeMarkdown = stripRawHtmlLines(markdown);

  return (
    <div
      data-slot="markdown-renderer"
      className={cn("space-y-3 text-[var(--hud-text-2)]", className)}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => (
            <TextContent asChild size="lg" weight="semibold" tone="strong" measure="wide">
              <h1 data-slot="markdown-renderer-heading">{children}</h1>
            </TextContent>
          ),
          h2: ({ children }) => (
            <TextContent asChild size="lg" weight="semibold" tone="strong" measure="wide">
              <h2 data-slot="markdown-renderer-heading">{children}</h2>
            </TextContent>
          ),
          h3: ({ children }) => (
            <TextContent asChild size="default" weight="semibold" tone="strong" measure="wide">
              <h3 data-slot="markdown-renderer-heading">{children}</h3>
            </TextContent>
          ),
          p: ({ children }) => (
            <TextContent data-slot="markdown-renderer-paragraph" measure="wide">
              {children}
            </TextContent>
          ),
          ul: ({ children }) => (
            <ul data-slot="markdown-renderer-list" className="m-0 list-disc space-y-1 pl-5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol data-slot="markdown-renderer-list" className="m-0 list-decimal space-y-1 pl-5">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li data-slot="markdown-renderer-list-item" className="text-sm leading-relaxed text-[var(--hud-text-2)]">
              {children}
            </li>
          ),
          a: SafeLink,
          img: ({ alt }) => (
            <span data-slot="markdown-renderer-blocked-image" data-blocked-image="true">
              {alt ? `[image: ${alt}]` : "[image]"}
            </span>
          ),
          code: ({ children, className }) => {
            const language = languageFromClassName(className);
            if (language) {
              return (
                <CodeBlock
                  code={extractText(children).replace(/\n$/, "")}
                  language={language}
                  data-markdown-code-block="true"
                />
              );
            }
            return (
              <code
                data-slot="markdown-renderer-inline-code"
                data-language={language}
                className="rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-input-bg)] px-1 py-0.5 text-[0.92em] text-[var(--hud-text-1)] [font-family:var(--weft-font-mono)]"
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {safeMarkdown}
      </ReactMarkdown>
    </div>
  );
}

export { MarkDownRenderer };
