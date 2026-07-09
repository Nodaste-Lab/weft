// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SignalFilterChipGroup } from "../signal-filter-chip-group";

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today", ariaLabel: "Filter today" },
  { value: "week", label: "This week" },
] as const;

describe("SignalFilterChipGroup", () => {
  it("renders the label and one button per option with aria-pressed reflecting active state", () => {
    render(
      <SignalFilterChipGroup
        label="Timeframe"
        options={OPTIONS}
        isActive={(value) => value === "today"}
        onToggle={() => undefined}
      />,
    );

    expect(screen.getByText("Timeframe")).toBeInTheDocument();
    const todayBtn = screen.getByRole("button", { name: "Filter today" });
    expect(todayBtn).toHaveAttribute("aria-pressed", "true");

    const allBtn = screen.getByRole("button", { name: "All" });
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("wires onToggle with the option value when a chip is clicked", () => {
    const onToggle = vi.fn();
    render(
      <SignalFilterChipGroup
        label="Timeframe"
        options={OPTIONS}
        isActive={() => false}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "This week" }));
    expect(onToggle).toHaveBeenCalledWith("week");
  });

  it("exposes a role=group landmark associated with the label", () => {
    render(
      <SignalFilterChipGroup
        label="Priority"
        options={OPTIONS}
        isActive={() => false}
        onToggle={() => undefined}
      />,
    );

    const group = screen.getByRole("group", { name: "Priority" });
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("data-slot", "signal-filter-chip-group-rail");
  });

  it("stops click event propagation so a parent block does not capture chip clicks", () => {
    const parentClick = vi.fn();
    const onToggle = vi.fn();
    render(
      <div onClick={parentClick}>
        <SignalFilterChipGroup
          label="Source"
          options={OPTIONS}
          isActive={() => false}
          onToggle={onToggle}
        />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(onToggle).toHaveBeenCalledWith("all");
    expect(parentClick).not.toHaveBeenCalled();
  });
});
