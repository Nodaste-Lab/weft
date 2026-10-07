"use client";
import * as React from "react";
import { SelectionLoading } from "../internal/selection-loading";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { SearchField } from "./search-field";
import type { SelectionOption } from "./combobox";

export type MultiSelectProps = {
  label: string; options: readonly SelectionOption[]; value: readonly string[];
  onValueChange: (value: string[]) => void;
  id?: string; name?: string; description?: string; error?: string;
  disabled?: boolean; loading?: boolean; placeholder?: string; emptyMessage?: string; className?: string;
};
/** Searchable checkbox picker. Changes apply immediately; Done closes it. */
export function MultiSelect({ label, options, value, onValueChange, id, name, description, error, disabled, loading, placeholder = "Choose options", emptyMessage = "No matching options.", className }: MultiSelectProps) {
  const generated = React.useId(); const controlId = id ?? generated;
  const [open, setOpen] = React.useState(false); const [query, setQuery] = React.useState("");
  const isPopoverOpen = open && !disabled;
  const selected = options.filter(option => value.includes(option.value));
  const summary = value.length === 0 ? placeholder : value.length <= 2 && selected.length === value.length ? selected.map(option => option.label).join(", ") : `${value.length} selected`;
  const matches = options.filter(option => [option.label, option.description ?? "", ...(option.keywords ?? [])].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const describedBy = [error && `${controlId}-error`, description && `${controlId}-help`].filter(Boolean).join(" ") || undefined;
  return <div className={`weft-selection-field ${className ?? ""}`} data-invalid={!!error || undefined}>
    {name && value.map(item => <input key={item} type="hidden" name={name} value={item} disabled={disabled} />)}
    <Popover open={isPopoverOpen} onOpenChange={next => { setOpen(next); if (!next) setQuery(""); }}>
      <div className="weft-selection-control"><label htmlFor={controlId}>{label}</label><PopoverTrigger asChild><button id={controlId} type="button" disabled={disabled} aria-labelledby={`${controlId}-label ${controlId}-value`} aria-describedby={describedBy} aria-invalid={!!error || undefined} aria-busy={loading || undefined}><span id={`${controlId}-label`} className="weft-sr-only">{label}</span><span id={`${controlId}-value`}>{summary}</span>{loading && !isPopoverOpen ? <LoaderCircle size={16} className="weft-selection-loading-spinner" aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}</button></PopoverTrigger></div>
      <PopoverContent align="start" className="weft-selection-popup" aria-label={label}>
        <SearchField aria-busy={loading || undefined} label={`Search ${label}`} placeholder={`Search ${label.toLocaleLowerCase()}`} value={query} onChange={event => setQuery(event.target.value)} />
        <SelectionLoading active={!!loading} />
        {!loading && <p role="status" className="weft-selection-help weft-selection-count">{`${matches.length} options. ${value.length} selected.`}</p>}
        {!loading && <fieldset className="weft-selection-choices"><legend className="weft-sr-only">{label}</legend>{matches.length === 0 ? <p>{emptyMessage}</p> : matches.map((option, index) => <label key={option.value} className="weft-selection-choice"><input type="checkbox" aria-label={option.label} aria-describedby={option.description ? `${controlId}-option-${index}-help` : undefined} checked={value.includes(option.value)} disabled={option.disabled} onChange={event => onValueChange(event.target.checked ? [...value, option.value] : value.filter(item => item !== option.value))} /><span className="weft-selection-option-copy"><span>{option.label}</span>{option.description && <small id={`${controlId}-option-${index}-help`}>{option.description}</small>}</span></label>)}</fieldset>}
        <div className="weft-selection-actions"><button type="button" disabled={!value.length} onClick={() => onValueChange([])}>Clear selection</button><button type="button" onClick={() => { setOpen(false); setQuery(""); }}>Done</button></div>
      </PopoverContent>
    </Popover>
    <SelectionLoading active={!!loading && !isPopoverOpen} compact />
    {error && <p id={`${controlId}-error`} className="weft-selection-error">{error}</p>}
    {description && <p id={`${controlId}-help`} className="weft-selection-help">{description}</p>}
  </div>;
}
