import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from "./select";
import { NavigationCount } from "./navigation-count";
import { NavigationIcon } from "./navigation-icon";
export type NavigationSpace = { id: string; name: string; initials?: string; private?: boolean; signals?: number; disabled?: boolean };
export type NavigationSpacePickerProps = {
  spaces: NavigationSpace[];
  value: string;
  onValueChange: (value: string) => void;
  onAdd?: () => void;
  label: string;
  addLabel?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};
function Identity({ space }: { space: NavigationSpace }) {
  return <span className="weft-navigation-space-identity">
    <span className="weft-navigation-space-avatar" aria-hidden="true">{space.private ? <NavigationIcon purpose="private" size={14} /> : space.initials ?? space.name.slice(0, 1)}</span>
    <span className="weft-navigation-space-name">{space.name}</span>
    <NavigationCount count={space.signals ?? 0} name={space.name} scope="space" />
  </span>;
}
const ADD = "__weft_add_space__";
export function NavigationSpacePicker({ spaces, value, onValueChange, onAdd, label, addLabel = "Add new", id, disabled, className, contentClassName }: NavigationSpacePickerProps) {
  return <Select value={value} onValueChange={next => next === ADD && onAdd ? onAdd() : onValueChange(next)} disabled={disabled}>
    <SelectTrigger id={id} aria-label={label} className={`weft-navigation-space-trigger ${className ?? ""}`}><SelectValue /></SelectTrigger>
    <SelectContent className={`weft-navigation-space-options ${contentClassName ?? ""}`}>
      {spaces.map(space => <SelectItem key={space.id} value={space.id} disabled={space.disabled}><Identity space={space} /></SelectItem>)}
      {onAdd && <><SelectSeparator /><SelectItem value={ADD}><NavigationIcon purpose="create" />{addLabel}</SelectItem></>}
    </SelectContent>
  </Select>;
}
