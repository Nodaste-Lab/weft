// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineEditListRow } from "../inline-edit-list-row";

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
      <InlineEditListRow
        text="Beat 1"
        index={0}
        showIndex
        onUpdate={() => {}}
        onDelete={() => {}}
      />,
    );
    const badge = document.querySelector('[data-slot="inline-edit-list-row-index"]');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe("1");
  });

  it("enters editing state when the body is clicked and commits on Enter", () => {
    const onUpdate = vi.fn();
    render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
    fireEvent.click(screen.getByText("Initial"));
    expect(
      document.querySelector('[data-slot="inline-edit-list-row"]')?.getAttribute("data-state"),
    ).toBe("editing");
    const textarea = screen.getByLabelText("Edit item") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Updated text" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onUpdate).toHaveBeenCalledWith("Updated text");
  });

  it("reverts the draft when Escape is pressed", () => {
    const onUpdate = vi.fn();
    render(<InlineEditListRow text="Initial" onUpdate={onUpdate} onDelete={() => {}} />);
    fireEvent.click(screen.getByText("Initial"));
    const textarea = screen.getByLabelText("Edit item") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Updated text" } });
    fireEvent.keyDown(textarea, { key: "Escape" });
    expect(onUpdate).not.toHaveBeenCalled();
    expect(
      document.querySelector('[data-slot="inline-edit-list-row"]')?.getAttribute("data-state"),
    ).toBe("idle");
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
});
