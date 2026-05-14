// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SignalGroupCollapsible } from "../signal-group-collapsible";

describe("SignalGroupCollapsible", () => {
  it("renders header label + count and exposes data-signal-group + test id", () => {
    render(
      <SignalGroupCollapsible
        groupKey="my-project"
        label="My project"
        count={4}
        collapsed={false}
        onToggle={() => undefined}
      >
        <div>body</div>
      </SignalGroupCollapsible>,
    );

    const root = screen.getByTestId("signal-group-my-project");
    expect(root).toHaveAttribute("data-signal-group", "my-project");
    expect(screen.getByText("My project")).toBeInTheDocument();
    expect(screen.getByText("(4)")).toBeInTheDocument();
    const button = screen.getByRole("button", {
      name: "Collapse My project group",
    });
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("hides the body when collapsed and exposes Expand toggle label", () => {
    render(
      <SignalGroupCollapsible
        groupKey="my-project"
        label="My project"
        collapsed
        onToggle={() => undefined}
      >
        <div>body content</div>
      </SignalGroupCollapsible>,
    );

    expect(screen.queryByText("body content")).not.toBeInTheDocument();
    const root = screen.getByTestId("signal-group-my-project");
    expect(root).toHaveAttribute("data-collapsed", "true");
    expect(
      screen.getByRole("button", { name: "Expand My project group" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("fires onToggle on header click and stops event propagation", () => {
    const onToggle = vi.fn();
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <SignalGroupCollapsible
          groupKey="g1"
          label="Group"
          collapsed={false}
          onToggle={onToggle}
        >
          <div />
        </SignalGroupCollapsible>
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Collapse Group/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("renders headerActions only when not collapsed", () => {
    const { rerender } = render(
      <SignalGroupCollapsible
        groupKey="g1"
        label="Group"
        collapsed={false}
        onToggle={() => undefined}
        headerActions={<button type="button">Acknowledge all</button>}
      >
        <div />
      </SignalGroupCollapsible>,
    );

    expect(
      screen.getByRole("button", { name: "Acknowledge all" }),
    ).toBeInTheDocument();

    rerender(
      <SignalGroupCollapsible
        groupKey="g1"
        label="Group"
        collapsed
        onToggle={() => undefined}
        headerActions={<button type="button">Acknowledge all</button>}
      >
        <div />
      </SignalGroupCollapsible>,
    );

    expect(
      screen.queryByRole("button", { name: "Acknowledge all" }),
    ).not.toBeInTheDocument();
  });
});
