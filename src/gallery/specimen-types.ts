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

export interface SurfaceLike {
  variants?: Record<string, string[]>;
  props?: Record<string, { optional?: boolean; union: string[] | null }>;
  native?: string[];
}

const AXIS_ORDER = ['variant', 'tone', 'size', 'density', 'state', 'urgency', 'orientation', 'measure', 'weight'];
const EXCLUDED_AXES = new Set(['as', 'asChild']);

/**
 * The enumerable axes of a component from its prop-contract surface. A cva
 * `variants` entry wins over the prop union of the same name: for a
 * multi-part component the union merges every part, while `variants` is the
 * part the specimen renders.
 */
export function axesFromSurface(surface: SurfaceLike | undefined): { prop: string; values: string[] }[] {
  if (!surface) return [];
  const names = new Set<string>([...Object.keys(surface.variants ?? {}), ...Object.keys(surface.props ?? {})]);
  const out: { prop: string; values: string[] }[] = [];
  for (const prop of names) {
    if (EXCLUDED_AXES.has(prop)) continue;
    const values = surface.variants?.[prop] ?? surface.props?.[prop]?.union ?? null;
    if (Array.isArray(values) && values.length > 0) out.push({ prop, values });
  }
  return out.sort((a, b) => {
    const ia = AXIS_ORDER.indexOf(a.prop);
    const ib = AXIS_ORDER.indexOf(b.prop);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.prop.localeCompare(b.prop);
  });
}

/** Keep only props the contract knows (or ARIA / common native state attributes) for a code reference. */
export function contractProps(
  props: Record<string, unknown>,
  surface: SurfaceLike | undefined,
): Record<string, unknown> {
  const known = new Set<string>([...Object.keys(surface?.variants ?? {}), ...Object.keys(surface?.props ?? {})]);
  const NATIVE = new Set(['disabled', 'checked', 'defaultChecked', 'defaultOpen', 'open', 'pressed', 'defaultPressed', 'readOnly', 'required', 'placeholder', 'indeterminate', 'loading', 'blocked', 'isActive', 'selected', 'value', 'defaultValue']);
  return Object.fromEntries(
    Object.entries(props).filter(([k, v]) => (known.has(k) || NATIVE.has(k) || k.startsWith('aria-')) && (typeof v !== 'object' || v === null)),
  );
}
