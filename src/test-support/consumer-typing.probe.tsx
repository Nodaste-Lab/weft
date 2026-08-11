/**
 * Consumer-typing probe — compiled by `npm run test:types`, never bundled and
 * never run.
 *
 * The runtime suites cannot see a type-level API break: vitest strips types
 * without checking them, and the DTS build only proves Weft's own source is
 * coherent, not that a CONSUMER's ordinary patterns still compile. That gap
 * shipped one real defect: `getFieldProps` once constrained its parameter with
 * `Record<string, unknown>`, which every object literal satisfies and no
 * consumer interface does — interfaces carry no string index signature, so
 * `React.ComponentProps<"input">` wrappers failed to type-check while all 24
 * runtime tests stayed green.
 *
 * So this file IS the consumer: it exercises the public surface the way a
 * consumer's code does, under `--strict` (consumers commonly are, this repo's
 * own tsconfig is not), and `test:types` fails if any pattern here stops
 * compiling. Add a pattern when a type-level finding lands — the probe grows
 * the same way known-defects.ts did, one recorded regression at a time.
 */
import * as React from "react";
import { useCommitBoundary, type CommitDetail } from "../ui/use-commit-boundary";
import { SearchField, type SearchFieldProps } from "../ui/search-field";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";

// A consumer interface extending intrinsic input props — no index signature.
// This is the exact shape the Record<string, unknown> constraint rejected.
interface WrapperProps extends React.ComponentProps<"input"> {
  extra?: string;
}

declare const intrinsicProps: React.ComponentProps<"input">;
declare const wrapperProps: WrapperProps;
declare const detailSink: (detail: CommitDetail) => void;

export function CommitBoundaryConsumer() {
  const boundary = useCommitBoundary({ onCommit: detailSink });

  // Extra props must survive the merge in the return type.
  const merged = boundary.getFieldProps(wrapperProps);
  const extraSurvives: string | undefined = merged.extra;
  void extraSurvives;

  return (
    <>
      <input {...boundary.getFieldProps(intrinsicProps)} />
      <input {...boundary.getFieldProps(wrapperProps)} />
      <input {...boundary.getFieldProps()} />
      <button
        type="button"
        onPointerDown={(e) => {
          if (e.button === 0 && e.isPrimary && !e.ctrlKey) boundary.registerExplicitSave();
        }}
        onContextMenu={boundary.cancelExplicitSave}
        onPointerLeave={boundary.cancelExplicitSave}
        onPointerCancel={boundary.cancelExplicitSave}
        onClick={() => boundary.commit("explicit-save")}
      >
        Save
      </button>
    </>
  );
}

// Read-only is unsupported on switch and slider in BOTH layers — decided, and
// asserted here at the type level, where the claim actually lives: native
// checkbox and range ignore the attribute and Radix does not implement it, so
// the surface must never offer it. If either component grows a readOnly prop,
// these expect-error markers become unused and test:types fails.
export function ReadOnlyStaysUnsupported() {
  return (
    <>
      {/* @ts-expect-error — readOnly is deliberately not part of Switch's surface */}
      <Switch readOnly name="sw" />
      {/* @ts-expect-error — readOnly is deliberately not part of Slider's surface */}
      <Slider readOnly name="sl" defaultValue={[1]} />
    </>
  );
}

// SearchField's accessible name is the required `label` prop, full stop. An
// aria-label would silently override the hidden label it renders — two names,
// one control — and the ladder sanctions aria-label for icon-only controls
// only.
//
// The assertions below use OBJECT-LITERAL form deliberately: TypeScript does
// not excess-check hyphenated JSX attributes on components, so
// `<SearchField aria-label="…" />` compiles no matter what the props type
// says — measured while writing this probe, and the reason the component
// ALSO strips both props at runtime (the strip is the enforcement; this type
// records the contract for every typed object-building path).
export function SearchFieldNameIsTheLabelProp() {
  // @ts-expect-error — aria-label is deliberately not part of SearchField's surface
  const sneakyLabel: SearchFieldProps = { label: "Search projects", "aria-label": "Sneaky" };
  // @ts-expect-error — aria-labelledby is deliberately not part of SearchField's surface
  const sneakyRef: SearchFieldProps = { label: "Search projects", "aria-labelledby": "el" };
  void sneakyLabel;
  void sneakyRef;
  return <SearchField label="Search projects" />;
}
