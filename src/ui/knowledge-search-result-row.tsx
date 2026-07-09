import * as React from "react";
import { Copy, ExternalLink, FileText } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";
import { cn } from "./utils";
import { SEARCH_CATEGORIES } from "./knowledge-search-categories";

const CATEGORY_LABELS = new Map(SEARCH_CATEGORIES.map(({ id, label }) => [id, label]));

function getCategoryLabel(categoryId: string) {
  return CATEGORY_LABELS.get(categoryId) ?? categoryId;
}

function relevanceToneColor(r: number) {
  if (r >= 90) return "var(--hud-positive)";
  if (r >= 75) return "var(--hud-warning)";
  return "var(--hud-text-3)";
}

export interface KnowledgeSearchResultRowModel {
  id: string;
  title: string;
  path: string;
  excerpt: string;
  relevance: number;
  categories: string[];
}

interface KnowledgeSearchResultRowProps {
  result: KnowledgeSearchResultRowModel;
  obsidianHref: string;
  isBrowseMode: boolean;
  copiedPath: string | null;
  onCopyPath: (path: string, e: React.MouseEvent) => void;
}

const KnowledgeSearchResultRow = React.forwardRef<HTMLDivElement, KnowledgeSearchResultRowProps>(
  ({ result: r, obsidianHref, isBrowseMode, copiedPath, onCopyPath }, ref) => {
    const relColor = relevanceToneColor(r.relevance);
    const categoryLabels = r.categories.slice(0, 2).map(getCategoryLabel);
    return (
      <div ref={ref} data-slot="knowledge-search-result-row" className="relative border-b border-[var(--hud-border)]">
        <a
          href={obsidianHref}
          aria-label={`Open ${r.title} in Obsidian`}
          className={cn(
            "block py-2.5 pl-3.5 pr-9 outline-none transition-colors",
            "hover:bg-[var(--hud-surface-hover)] focus-visible:bg-[var(--hud-surface-hover)]",
            "focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          )}
        >
          <div className="mb-1.5 flex items-start gap-[9px]">
            <FileText size={13} className="mt-px shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground [font-family:var(--weft-font-sans)]">{r.title}</span>
                <ExternalLink size={10} className="text-muted-foreground" aria-hidden />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground [font-family:var(--weft-font-mono)]">{r.path}</span>
                {categoryLabels.length > 0 && (
                  <Badge
                    variant="outline"
                    className="h-auto rounded-[var(--radius-xs)] border-transparent bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-1 py-0 text-[9px] font-medium text-primary"
                  >
                    {categoryLabels.join(", ")}
                  </Badge>
                )}
              </div>
            </div>
            {!isBrowseMode && (
              <div className="flex shrink-0 items-center gap-[3px] rounded-[var(--radius-xs)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] px-[7px] py-0.5">
                <div
                  className="size-[5px] rounded-[var(--radius-pill)]"
                  style={{ background: relColor }}
                  aria-hidden
                />
                <span
                  className="text-[10px] font-semibold [font-family:var(--weft-font-sans)]"
                  style={{ color: relColor }}
                >
                  {r.relevance}%
                </span>
              </div>
            )}
          </div>
          {!isBrowseMode && (
            <div className="ml-[22px] mb-1.5 h-0.5 overflow-hidden rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--hud-text-1)_5%,transparent)]">
              <div
                className="h-full rounded-[var(--radius-pill)]"
                style={{ width: `${r.relevance}%`, background: relColor }}
                aria-hidden
              />
            </div>
          )}
          <p className="m-0 ml-[22px] text-xs italic leading-[1.55] text-muted-foreground [font-family:var(--weft-font-sans)]">
            {r.excerpt}
          </p>
        </a>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => onCopyPath(r.path, e)}
          aria-label={`Copy path ${r.path}`}
          title="Copy path"
          className={cn(
            "absolute right-2.5 top-2.5 h-auto min-h-0 rounded-[var(--radius-xs)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] p-1 text-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          )}
        >
          {copiedPath === r.path ? (
            <span className="text-[9px] text-[var(--hud-positive)]">Copied</span>
          ) : (
            <Copy size={10} aria-hidden />
          )}
        </Button>
      </div>
    );
  },
);
KnowledgeSearchResultRow.displayName = "KnowledgeSearchResultRow";

export { KnowledgeSearchResultRow, relevanceToneColor };
export type { KnowledgeSearchResultRowProps };
