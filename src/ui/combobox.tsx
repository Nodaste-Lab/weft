"use client";
import * as React from "react";
import { SelectionLoading, useSelectionLoading } from "../internal/selection-loading";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "./command";

export type SelectionOption = { value: string; label: string; description?: string; keywords?: string[]; disabled?: boolean };
export type ComboboxProps = {
  label: string; options: readonly SelectionOption[]; value: string | null;
  onValueChange: (value: string | null) => void;
  id?: string; name?: string; description?: string; error?: string;
  disabled?: boolean; loading?: boolean; placeholder?: string; emptyMessage?: string;
  clearable?: boolean; className?: string;
};
/** Single selection from supplied options. Search never creates a value. */
export function Combobox({ label, options, value, onValueChange, id, name, description, error, disabled, loading, placeholder = "Choose an option", emptyMessage, clearable, className }: ComboboxProps) {
  const generated = React.useId(); const controlId = id ?? generated;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const trigger = React.useRef<HTMLButtonElement>(null);
  const tabbing = React.useRef(false);
  const input = React.useRef<HTMLInputElement>(null);
  const loadingState = useSelectionLoading(!!loading);
  React.useEffect(() => { if (disabled) setOpen(false); if (!open || disabled) setQuery(""); }, [open, disabled]);
  const isPopoverOpen = open && !disabled;
  const selected = options.find(option => option.value === value);
  const describedBy = [error && `${controlId}-error`, description && `${controlId}-help`].filter(Boolean).join(" ") || undefined;
  return <div className={`weft-selection-field ${className ?? ""}`} data-invalid={!!error || undefined}>
    {name && value !== null && <input type="hidden" name={name} value={value} disabled={disabled} />}
    <Popover open={isPopoverOpen} onOpenChange={next => { setOpen(next); if (!next) setQuery(""); }}>
      <div className="weft-selection-control"><label htmlFor={controlId}>{label}</label><PopoverTrigger asChild>
        <button ref={trigger} id={controlId} type="button" disabled={disabled} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); } }} aria-labelledby={`${controlId}-label ${controlId}-value`} aria-describedby={describedBy} aria-invalid={!!error || undefined} aria-busy={loading || undefined}>
          <span id={`${controlId}-label`} className="weft-sr-only">{label}</span><span id={`${controlId}-value`}>{selected?.label ?? (value === null ? placeholder : "1 selected")}</span>{loading && !isPopoverOpen ? <LoaderCircle size={16} className="weft-selection-loading-spinner" aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        </button>
      </PopoverTrigger></div>
      <PopoverContent align="start" className="weft-selection-popup" aria-label={label} onFocusOutside={() => { tabbing.current = true; setOpen(false); setQuery(""); }} onCloseAutoFocus={event => { if (tabbing.current) { event.preventDefault(); tabbing.current = false; } }} onOpenAutoFocus={event => { event.preventDefault(); input.current?.focus(); }}>
        <Command label={`Search ${label}`} defaultValue={value ?? undefined} loop filter={(id, search) => { const option = options.find(item => item.value === id); return option && [option.label, option.description ?? "", ...(option.keywords ?? [])].join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) ? 1 : 0; }}>
          <CommandInput onKeyDown={event => { if (event.key === "Tab" && (!clearable || value === null || event.shiftKey)) { tabbing.current = true; trigger.current?.focus(); setOpen(false); setQuery(""); } }} ref={input} value={query} onValueChange={setQuery} placeholder={`Search ${label.toLocaleLowerCase()}`} />
          <SelectionLoading active={!!loading} state={loadingState} />
          <CommandList label={label} aria-busy={loading || undefined}>{!loading && <><CommandEmpty>{emptyMessage ?? (query.trim() ? "No matching options." : "No options available.")}</CommandEmpty>{options.map(option => <CommandItem key={option.value} value={option.value} keywords={[option.label, option.description ?? "", ...(option.keywords ?? [])]} disabled={option.disabled} aria-current={value === option.value ? "true" : undefined} data-current={value === option.value || undefined} onSelect={() => { onValueChange(option.value); setOpen(false); }}>
            <span className="weft-selection-option-copy"><span>{option.label}</span>{option.description && <small>{" "}{option.description}</small>}</span>{value === option.value && <><Check size={16} aria-hidden="true" /><span className="weft-sr-only">Selected</span></>}
          </CommandItem>)}</>}</CommandList>
        </Command>
        {clearable && value !== null && <button className="weft-selection-action" onKeyDown={event => { if (event.key === "Tab" && !event.shiftKey) { tabbing.current = true; trigger.current?.focus(); setOpen(false); setQuery(""); } }} type="button" onClick={() => { onValueChange(null); setOpen(false); }}>Clear selection</button>}
      </PopoverContent>
    </Popover>
    <SelectionLoading active={!!loading && !isPopoverOpen} state={loadingState} compact />
    {error && <p id={`${controlId}-error`} className="weft-selection-error">{error}</p>}
    {description && <p id={`${controlId}-help`} className="weft-selection-help">{description}</p>}
  </div>;
}
