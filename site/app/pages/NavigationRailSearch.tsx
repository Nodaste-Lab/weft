import React from "react";
import { NavigationSearch } from "../../../src/ui/navigation-search";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../../../src/ui/dropdown-menu";
import { Button } from "../../../src/ui/button";
import { RailIcon, type LeadingRailIcon } from "./navigation-rail-icons";
export type RailSearchItem = {
  label: string;
  path: string;
  icon: LeadingRailIcon;
};
export function NavigationRailSearch({
  space,
  items,
  onOpen,
  onExplore,
}: {
  space: string;
  items: RailSearchItem[];
  onOpen: (item: RailSearchItem) => void;
  onExplore: (category: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const input = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => setQuery(""), [space]);
  const term = query.trim().toLocaleLowerCase();
  const results = term
    ? items.filter((item) => item.label.toLocaleLowerCase().includes(term))
    : [];
  return (
    <div className="rail-lab-search">
      <NavigationSearch toolbarClassName="rail-lab-search-toolbar"
          ref={input}
          size="sm"
          label={`Search in ${space}`}
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && query) {
              setQuery("");
              event.stopPropagation();
            }
          }}
        filter={<DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rail-lab-explorer-filter"
              aria-label={`Space Explorer filters in ${space}`}
            >
              <RailIcon purpose="filter" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rail-lab-menu"
            aria-label="Space Explorer filters"
          >
            <DropdownMenuLabel>Space Explorer</DropdownMenuLabel>
            {[
              "All resources",
              "Plans",
              "Evidence",
              "Decisions",
              "Files",
              "Signals",
            ].map((category) => (
              <DropdownMenuItem
                key={category}
                onSelect={() => onExplore(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
            <DropdownMenuLabel>Resource navigation preview</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>} />
      {term && (
        <section
          aria-label="File search results"
          className="rail-lab-search-results"
        >
          <p role="status">
            {results.length} {results.length === 1 ? "match" : "matches"} in{" "}
            {space}
          </p>
          <ul>
            {results.slice(0, 20).map((item, index) => (
              <li key={`${item.path}-${index}`}>
                <Button
                  variant="ghost"
                  className="rail-lab-search-result"
                  onClick={() => {
                    setQuery("");
                    input.current?.focus();
                    onOpen(item);
                  }}
                >
                  <RailIcon purpose={item.icon} />
                  <span>
                    {item.label}
                    <small>{item.path}</small>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
          {results.length > 20 && (
            <p>Showing the first 20 matches. Refine your search.</p>
          )}
          {results.length === 0 && (
            <p>No matching file names. Try another search.</p>
          )}
          <p className="rail-lab-note">
            Local file-name preview. Full-content search is not connected.
          </p>
        </section>
      )}
    </div>
  );
}
