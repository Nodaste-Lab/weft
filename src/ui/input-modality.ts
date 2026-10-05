import * as React from "react";

/** Keys that are not navigation: a screenshot chord or an Escape that only
 *  dismisses a popup must not make the next focus look keyboard-driven. */
const NON_NAVIGATION_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "AltGraph",
  "CapsLock",
  "Fn",
  "OS",
  "Escape",
]);

export const INPUT_MODALITY_ATTRIBUTE = "data-weft-input-modality";

const bound = new WeakSet<Document>();

/** Records the last input kind on `<html>` as `data-weft-input-modality`
 *  ("pointer" or "keyboard"). Radix hands focus back to a popup's trigger by
 *  script when it closes, and the browser treats that as keyboard focus
 *  (`:focus-visible`) because the popup item held it. CSS reads this attribute
 *  to keep the trigger's ring off after a mouse interaction. Idempotent per
 *  document; the attribute stays unset until the first input. */
export function bindInputModality(doc: Document = document): void {
  if (bound.has(doc)) return;
  bound.add(doc);
  const root = doc.documentElement;
  doc.addEventListener(
    "pointerdown",
    () => root.setAttribute(INPUT_MODALITY_ATTRIBUTE, "pointer"),
    true,
  );
  doc.addEventListener(
    "keydown",
    (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (NON_NAVIGATION_KEYS.has(event.key)) return;
      root.setAttribute(INPUT_MODALITY_ATTRIBUTE, "keyboard");
    },
    true,
  );
}

/** Popup triggers call this so the tracker runs wherever they render, with no
 *  setup step for consumers. */
export function useInputModality(): void {
  React.useEffect(() => {
    bindInputModality();
  }, []);
}
