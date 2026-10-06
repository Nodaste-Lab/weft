import type { ReactNode } from 'react';

/**
 * A specimen says how to render one instance of a component with a given set
 * of props, so the site can lay out every variant and every state, each
 * labelled with the code that produces it. The axes (enumerable props) come
 * from props-snapshot.json; the specimen only supplies the rendering and the
 * states that are not enumerable from the contract.
 */
export interface SpecimenState {
  /** Short label, e.g. "Disabled". */
  label: string;
  /** Props that put the component in this state. */
  props: Record<string, unknown>;
  /** The code reference, e.g. `<Button disabled>`. Written out so it can say more than props alone. */
  code: string;
  /** One line on when this state occurs. */
  note?: string;
}

export interface Specimen {
  /** The exported component name the labels refer to, e.g. "Button" or "SidebarMenuButton". */
  component: string;
  /** Module id under src/ui, e.g. "button". */
  module: string;
  /** Which snapshot props to lay out as axes, in order. Defaults to every prop with a value union, minus `as` / `asChild`. */
  axes?: readonly string[];
  /** Extra props applied when laying out one axis, e.g. tone only shows on the status badge. */
  axisBase?: Record<string, Record<string, unknown>>;
  /** Props the base instance always carries (labels, content). Not shown in the code reference. */
  base?: Record<string, unknown>;
  /** States beyond the enumerable axes. */
  states?: readonly SpecimenState[];
  /** Render one instance. `props` already includes base + axis/state props. */
  render: (props: Record<string, unknown>) => ReactNode;
}

/** `<Button variant="ghost" size="sm">` from a name and the props that matter. */
export function jsxReference(component: string, props: Record<string, unknown>): string {
  const parts = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}=${typeof v === 'string' ? `"${v}"` : `{${String(v)}}`}`));
  return parts.length ? `<${component} ${parts.join(' ')}>` : `<${component}>`;
}

/** Union values arrive as strings; `"true"` / `"false"` are booleans on the component. */
export function coerceAxisValue(value: string): string | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}
