"use client";

import * as React from "react";

/**
 * useCommitBoundary — Weft standardises WHEN a field commits, and nothing else.
 *
 * Decision 7 draws the line this hook must never cross: it emits a signal that
 * a field reached a commit boundary — blur, Enter in a single-line control, or
 * an explicit save the consumer names — and it does not evaluate validity,
 * announce errors, write the value, or touch submission state. The consumer
 * (react-hook-form included) keeps the value, the rule, the error state,
 * whether an error is shown, and the submission. The moment a helper here does
 * any of those it is a form library competing with the consumer's, which is
 * why the ownership line is spy-asserted in __tests__/commit-boundary.test.tsx
 * rather than described in prose.
 *
 * The unit is a TRANSACTION, not an event (Document C §2). Clicking Save from
 * a focused field fires blur and then the click; Enter inside a form fires
 * keydown and then submit. A per-event rule would emit two commits for one
 * user action and the consumer would validate twice. So:
 *
 * - The consumer registers an explicit save on the Save control's
 *   `pointerdown` — before focus moves — via `registerExplicitSave()`. The
 *   blur that follows is suppressed, and the consumer's `commit()` emits one
 *   commit with `reason: "explicit-save"`, `sources: ["blur", "explicit-save"]`
 *   — the strongest semantic action as the reason, the ordered evidence in
 *   `sources` so nothing needs a second commit to carry it.
 * - With no registration, blur emits immediately as `reason: "blur"`. Nothing
 *   is held back on the speculation that a save might arrive; a helper that
 *   delayed every blur on a timer would be guessing about user intent.
 * - Keyboard Save is deliberately different: focus leaves on Tab, the blur
 *   transaction completes and commits, and the later `commit()` is a genuine
 *   second transaction. A Save handler must be safe to run after a blur
 *   already committed.
 * - Enter emits its commit and the helper neither hooks nor prevents the
 *   native submit. A consumer calling `commit()` from `onSubmit` after an
 *   Enter produces a visible second commit — documented misuse, not absorbed.
 *
 * Boundaries that are NOT boundaries: Enter in a textarea (it inserts a
 * newline), Escape (no commit, and the helper never writes or reverts a value
 * in response to it), any keydown inside input-method composition (including
 * the Enter that confirms a candidate), paste, programmatic value updates, and
 * native form.reset() — which also leaves no helper state behind.
 *
 * Opt-in only. Nothing wires this into `Form`, and `Form` gains no behaviour —
 * that is the difference between standardising a signal and owning a workflow.
 */

export type CommitReason = "blur" | "enter" | "explicit-save";

export type CommitDetail = {
  /** The strongest semantic action in the transaction — what the user meant. */
  reason: CommitReason;
  /**
   * The ordered boundaries that occurred inside the transaction, including a
   * suppressed blur. Undeduplicated, `reason` and `sources` agree.
   */
  sources: CommitReason[];
};

export type UseCommitBoundaryOptions = {
  /** Called exactly once per commit transaction. */
  onCommit: (detail: CommitDetail) => void;
};

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

type BoundaryHandlers = {
  onBlur: React.FocusEventHandler<FieldElement>;
  onFocus: React.FocusEventHandler<FieldElement>;
  onKeyDown: React.KeyboardEventHandler<FieldElement>;
  onCompositionStart: React.CompositionEventHandler<FieldElement>;
  onCompositionEnd: React.CompositionEventHandler<FieldElement>;
};

export type UseCommitBoundaryReturn = {
  /**
   * Merge the boundary listeners into a field's props. The consumer's own
   * handlers (react-hook-form's `field.onBlur` included) are called first and
   * are never swallowed; the helper only listens.
   */
  getFieldProps: <P extends Partial<BoundaryHandlers>>(props?: P) => P & BoundaryHandlers;
  /**
   * Register an explicit-save transaction BEFORE focus leaves the field — on
   * the Save control's `pointerdown`, or in a shortcut handler that runs while
   * the field is still focused. The next blur is suppressed and reported in
   * the eventual commit's `sources`. An abandoned registration is cleared when
   * the field regains focus; the helper never infers a save and never watches
   * a button.
   */
  registerExplicitSave: () => void;
  /** The explicit save itself — exactly a consumer call, never inferred. */
  commit: (reason?: "explicit-save") => void;
};

export function useCommitBoundary({
  onCommit,
}: UseCommitBoundaryOptions): UseCommitBoundaryReturn {
  // Refs, not state: the transaction bookkeeping must never cause a render,
  // and none of it survives a boundary — there is nothing to reconcile.
  const composingRef = React.useRef(false);
  const saveRegisteredRef = React.useRef(false);
  const suppressedBlurRef = React.useRef(false);
  const onCommitRef = React.useRef(onCommit);
  onCommitRef.current = onCommit;

  const emit = React.useCallback((reason: CommitReason, sources: CommitReason[]) => {
    onCommitRef.current({ reason, sources });
  }, []);

  const commit = React.useCallback(
    (reason: "explicit-save" = "explicit-save") => {
      const sources: CommitReason[] = suppressedBlurRef.current
        ? ["blur", reason]
        : [reason];
      suppressedBlurRef.current = false;
      saveRegisteredRef.current = false;
      emit(reason, sources);
    },
    [emit],
  );

  const registerExplicitSave = React.useCallback(() => {
    saveRegisteredRef.current = true;
  }, []);

  const handleBlur = React.useCallback(() => {
    // A blur mid-composition ends the composition; the boundary is real.
    composingRef.current = false;
    if (saveRegisteredRef.current) {
      // A pre-registered explicit save owns this transaction. The blur is
      // recorded, not emitted — commit() will report it in `sources`.
      suppressedBlurRef.current = true;
      return;
    }
    emit("blur", ["blur"]);
  }, [emit]);

  const handleFocus = React.useCallback(() => {
    // The user came back before the registered save committed: the
    // transaction is abandoned, not held open. A stale registration must
    // never suppress a later, unrelated blur.
    saveRegisteredRef.current = false;
    suppressedBlurRef.current = false;
  }, []);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<FieldElement>) => {
      if (event.key !== "Enter") return;
      // Enter in a textarea inserts a newline. Treating it as a boundary
      // makes the control unusable, so the check is on the element, not an
      // option a consumer has to know to pass.
      if (event.currentTarget.tagName === "TEXTAREA") return;
      // The Enter that confirms an IME candidate is part of the composition,
      // not a boundary. Browsers disagree on how they say so — isComposing on
      // the native event, the legacy 229 keyCode, or only the composition
      // events themselves — so all three are honoured.
      if (
        composingRef.current ||
        event.nativeEvent.isComposing ||
        event.keyCode === 229
      ) {
        return;
      }
      // No preventDefault, ever: an Enter inside an unblocked form still
      // submits that form. The helper deduplicates its own signal and
      // nothing else.
      emit("enter", ["enter"]);
    },
    [emit],
  );

  const handleCompositionStart = React.useCallback(() => {
    composingRef.current = true;
  }, []);

  const handleCompositionEnd = React.useCallback(() => {
    composingRef.current = false;
  }, []);

  const getFieldProps = React.useCallback(
    // No index-signature constraint (`Record<string, unknown>` was here once):
    // it rejects ordinary typed prop objects — React.ComponentProps<"input">,
    // or any consumer interface extending it — because interfaces carry no
    // string index signature. Partial<BoundaryHandlers> alone still infers P
    // and preserves every extra prop in the return type.
    <P extends Partial<BoundaryHandlers>>(props?: P): P & BoundaryHandlers => {
      const supplied = (props ?? {}) as P;
      return {
        ...supplied,
        onBlur: (event: React.FocusEvent<FieldElement>) => {
          supplied.onBlur?.(event);
          handleBlur();
        },
        onFocus: (event: React.FocusEvent<FieldElement>) => {
          supplied.onFocus?.(event);
          handleFocus();
        },
        onKeyDown: (event: React.KeyboardEvent<FieldElement>) => {
          supplied.onKeyDown?.(event);
          handleKeyDown(event);
        },
        onCompositionStart: (event: React.CompositionEvent<FieldElement>) => {
          supplied.onCompositionStart?.(event);
          handleCompositionStart();
        },
        onCompositionEnd: (event: React.CompositionEvent<FieldElement>) => {
          supplied.onCompositionEnd?.(event);
          handleCompositionEnd();
        },
      };
    },
    [handleBlur, handleFocus, handleKeyDown, handleCompositionStart, handleCompositionEnd],
  );

  return { getFieldProps, registerExplicitSave, commit };
}
