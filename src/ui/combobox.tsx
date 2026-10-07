"use client";
import * as React from "react";
import { SelectionLoading } from "../internal/selection-loading";
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
export function Combobox({ label, options, value, onValueChange, id, name, description, error, disabled, loading, placeholder = "Choose an option", emptyMessage = "No matching options.", clearable, className }: ComboboxProps) {
  const generated = React.useId(); const controlId = id ?? generated;
  const [open, setOpen] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const isPopoverOpen = open && !disabled;
  const selected = options.find(option => option.value === value);
  const describedBy = [error && `${controlId}-error`, description && `${controlId}-help`].filter(Boolean).join(" ") || undefined;
  return <div className={`weft-selection-field ${className ?? ""}`} data-invalid={!!error || undefined}>
    {name && value !== null && <input type="hidden" name={name} value={value} disabled={disabled} />}
    <Popover open={isPopoverOpen} onOpenChange={setOpen}>
      <div className="weft-selection-control"><label htmlFor={controlId}>{label}</label><PopoverTrigger asChild>
        <button id={controlId} type="button" disabled={disabled} aria-labelledby={`${controlId}-label ${controlId}-value`} aria-describedby={describedBy} aria-invalid={!!error || undefined} aria-busy={loading || undefined}>
          <span id={`${controlId}-label`} className="weft-sr-only">{label}</span><span id={`${controlId}-value`}>{selected?.label ?? (value === null ? placeholder : value)}</span>{loading && !isPopoverOpen ? <LoaderCircle size={16} className="weft-selection-loading-spinner" aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        </button>
      </PopoverTrigger></div>
      <PopoverContent align="start" className="weft-selection-popup" aria-label={label} onOpenAutoFocus={event => { event.preventDefault(); input.current?.focus(); }}>
        <Command label={label} loop>
          <CommandInput ref={input} aria-label={`Search ${label}`} placeholder={`Search ${label.toLocaleLowerCase()}`} />
          <SelectionLoading active={!!loading} />
          <CommandList aria-label={label} aria-busy={loading || undefined}>{!loading && <><CommandEmpty>{emptyMessage}</CommandEmpty>{options.map(option => <CommandItem key={option.value} value={option.value} keywords={[option.label, option.description ?? "", ...(option.keywords ?? [])]} disabled={option.disabled} aria-current={value === option.value ? "true" : undefined} data-current={value === option.value || undefined} onSelect={() => { onValueChange(option.value); setOpen(false); }}>
            <span className="weft-selection-option-copy"><span>{option.label}</span>{option.description && <small>{" "}{option.description}</small>}</span>{value === option.value && <><Check size={16} aria-hidden="true" /><span className="weft-sr-only">Selected</span></>}
          </CommandItem>)}</>}</CommandList>
        </Command>
        {clearable && value !== null && <button className="weft-selection-action" type="button" onClick={() => { onValueChange(null); setOpen(false); }}>Clear selection</button>}
      </PopoverContent>
    </Popover>
    <SelectionLoading active={!!loading && !isPopoverOpen} compact />
    {error && <p id={`${controlId}-error`} className="weft-selection-error">{error}</p>}
    {description && <p id={`${controlId}-help`} className="weft-selection-help">{description}</p>}
  </div>;
}
