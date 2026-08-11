// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineEditListRow } from "../inline-edit-list-row";

/**
 * InlineEditListRow, migrated onto the commit boundary (proposals document C
 * §5, decided: migrate). The old editing state did three things the commit
 * contract forbids, and each has a test here asserting the NEW behaviour:
 *
 *  - Enter on the textarea committed (preventDefault + apply). Now Enter
 *    inserts a newline and commits nothing — a textarea's Enter is never a
 *    boundary.
 *  - Escape silently reverted the draft. Now Escape OFFERS a discard: the
 *    first press shows the offer and touches nothing; a second press — the
 *    user choosing, with the offer visible — performs it. Typing withdraws
 *    the offer. Nothing happens to the user's work while they are not looking.
 *  - An emptied value was discarded and the previous text restored on commit —
 *    silent data loss with a tidy appearance. Now empty is a value: selecting
 *    all, deleting, and leaving commits the empty string.
 */

function editInto(text: string) {
  fireEvent.click(screen.getByText(text));
  return screen.getByLabelText("Edit item") as HTMLTextAreaElement;
}

const state = () =>
  document.querySelector('[data-slot="inline-edit-list-row"]')?.getAttribute("data-state");

describe("InlineEditListRow", () => {
  it("renders the text body and slot attribute in idle state", () => {
    render(<InlineEditListRow text="Party crossed the bridge." onUpdate={() => {}} onDelete={() => {}} />);
    const row = document.querySelector('[data-slot="inline-edit-list-row"]');
    expect(row).toBeTruthy();
    expect(row?.getAttribute("data-state")).toBe("idle");
    expect(screen.getByText("Party crossed the bridge.")).toBeInTheDocument();
  });

  it("shows an index badge when showIndex is true", () => {
    render(
      <InlineEditListRow text="Beat 1" index={0} showIndex onUpdate={() => {}} onDelete={() => {}} />,
    );
    const badge = document.querySelector('[data-slot="inline-edit-list-row-index"]');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe("1");
  });

  it("invokes onDelete when the delete affordance is clicked", () => {
    const onDelete = vi.fn();
    render(<InlineEditListRow text="Doomed text" onUpdate={() => {}} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete item" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("applies italic styling when italic is true", () => {
    render(<InlineEditListRow text="Whispers" italic onUpdate={() => {}} onDelete={() => {}} />);
    const body = document.querySelector('[data-slot="inline-edit-list-row-body"]');
    expect(body?.className).toMatch(/italic/);
  });

  describe("Enter is a newline, never a commit", () => {
    it("does not commit and does not prevent the default on Enter", () => {
      const onUpdate = vi.fn();
      const prevented: boolean[] = [];
      render(
        <div onKeyDown={(e) => prevented.push(e.defaultPrevented)}>
          <InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />
        </div>,
      );
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Updated text" } });
      fireEvent.keyDown(textarea, { key: "Enter" });
      expect(onUpdate, "Enter on a textarea is not a boundary").not.toHaveBeenCalled();
      expect(state(), "the editor stays open — Enter is typing, not leaving").toBe("editing");
      expect(prevented, "preventDefault would eat the newline").toEqual([false]);
    });
  });

  describe("blur is the commit boundary", () => {
    it("applies the edit exactly once on blur", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Updated text" } });
      fireEvent.blur(textarea);
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith("Updated text");
      expect(state()).toBe("idle");
    });

    it("closes without calling onUpdate when the draft is unchanged", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.blur(textarea);
      expect(onUpdate).not.toHaveBeenCalled();
      expect(state()).toBe("idle");
    });

    it("an emptied value survives: select-all, delete, leave commits the empty string", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "" } });
      fireEvent.blur(textarea);
      expect(
        onUpdate,
        "restoring the previous text over a deliberate deletion is data loss with a tidy appearance",
      ).toHaveBeenCalledWith("");
    });

    it("whitespace-only normalizes to the empty string, and it still counts", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "   " } });
      fireEvent.blur(textarea);
      expect(onUpdate).toHaveBeenCalledWith("");
    });

    it("everything else commits as typed — Enter is real input, so its newline is the user's", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Two lines\nof note  " } });
      fireEvent.blur(textarea);
      expect(
        onUpdate,
        "normalizing whitespace away would silently rewrite input the contract just made real",
      ).toHaveBeenCalledWith("Two lines\nof note  ");
    });
  });

  describe("Escape offers a discard, never performs one silently", () => {
    it("closes without ceremony when there is nothing to lose", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.keyDown(textarea, { key: "Escape" });
      expect(onUpdate).not.toHaveBeenCalled();
      expect(state()).toBe("idle");
    });

    it("first Escape with a dirty draft offers — nothing reverts, nothing closes, the offer is exposed", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Updated text" } });
      fireEvent.keyDown(textarea, { key: "Escape" });
      expect(state(), "the editor holds open — the user's work is still on screen").toBe("editing");
      expect(textarea.value, "the draft is untouched").toBe("Updated text");
      expect(onUpdate).not.toHaveBeenCalled();
      const hint = document.querySelector('[data-slot="inline-edit-list-row-discard-hint"]');
      expect(hint, "the offer must be visible, or it is not an offer").toBeTruthy();
      const ids = (textarea.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
      expect(ids, "the offer is exposed as the field's description").toContain(hint!.id);
    });

    it("second Escape performs the discard the user was offered", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Updated text" } });
      fireEvent.keyDown(textarea, { key: "Escape" });
      fireEvent.keyDown(textarea, { key: "Escape" });
      expect(onUpdate, "a discard is not a commit").not.toHaveBeenCalled();
      expect(state()).toBe("idle");
      // The discarded draft is gone: re-entering shows the original.
      const reopened = editInto("Initial");
      expect(reopened.value).toBe("Initial");
    });

    it("typing withdraws the offer", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Updated text" } });
      fireEvent.keyDown(textarea, { key: "Escape" });
      fireEvent.change(textarea, { target: { value: "Updated text more" } });
      expect(
        document.querySelector('[data-slot="inline-edit-list-row-discard-hint"]'),
        "the user kept working; the offer no longer stands",
      ).toBeNull();
      // The next Escape is a fresh offer, not a stale second press.
      fireEvent.keyDown(textarea, { key: "Escape" });
      expect(state()).toBe("editing");
      expect(textarea.value).toBe("Updated text more");
    });

    it("Escape inside IME composition is candidate-dismissal, not an edit action", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "かん" } });
      fireEvent.compositionStart(textarea);
      fireEvent.keyDown(textarea, { key: "Escape", isComposing: true });
      expect(state(), "the editor must not close under the IME").toBe("editing");
      expect(
        document.querySelector('[data-slot="inline-edit-list-row-discard-hint"]'),
        "no offer either — the user was talking to the IME, not to the editor",
      ).toBeNull();
      expect(textarea.value).toBe("かん");
      fireEvent.compositionEnd(textarea);
      // Composition over: Escape is the editor's again, and offers.
      fireEvent.keyDown(textarea, { key: "Escape" });
      expect(state()).toBe("editing");
      expect(
        document.querySelector('[data-slot="inline-edit-list-row-discard-hint"]'),
      ).toBeTruthy();
    });

    it("keyCode 229 alone marks the Escape as composition", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "draft" } });
      fireEvent.keyDown(textarea, { key: "Escape", keyCode: 229 });
      expect(state()).toBe("editing");
      expect(document.querySelector('[data-slot="inline-edit-list-row-discard-hint"]')).toBeNull();
    });

    it("blur while the offer is showing commits normally — an offer is not a hold", () => {
      const onUpdate = vi.fn();
      render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
      const textarea = editInto("Initial");
      fireEvent.change(textarea, { target: { value: "Updated text" } });
      fireEvent.keyDown(textarea, { key: "Escape" });
      fireEvent.blur(textarea);
      expect(onUpdate).toHaveBeenCalledWith("Updated text");
      expect(state()).toBe("idle");
    });
  });
});
