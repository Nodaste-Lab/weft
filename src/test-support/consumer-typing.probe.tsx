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
        onPointerDown={boundary.registerExplicitSave}
        onClick={() => boundary.commit("explicit-save")}
      >
        Save
      </button>
    </>
  );
}
