// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HudPopoverDropdown } from "../hud-popover-dropdown";

describe("HudPopoverDropdown", () => {
  it("renders the trigger and hides content when closed", () => {
    render(
      <HudPopoverDropdown
        open={false}
        onOpenChange={() => {}}
        trigger={<button>Open me</button>}
      >
        <div data-testid="dropdown-body">Body</div>
      </HudPopoverDropdown>,
    );
    expect(screen.getByText("Open me")).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown-body")).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="hud-popover-dropdown"]')?.getAttribute("data-state"),
    ).toBe("closed");
  });

  it("renders the content with align/width attributes when open", () => {
    render(
      <HudPopoverDropdown
        open
        onOpenChange={() => {}}
        align="end"
        width="trigger"
        trigger={<button>Trigger</button>}
      >
        <div data-testid="dropdown-body">Body</div>
      </HudPopoverDropdown>,
    );
    expect(screen.getByTestId("dropdown-body")).toBeInTheDocument();
    const content = document.querySelector('[data-slot="hud-popover-dropdown-content"]');
    expect(content).toBeTruthy();
    expect(content?.getAttribute("data-align")).toBe("end");
    expect(content?.getAttribute("data-width")).toBe("trigger");
  });

  it("invokes onOpenChange(false) when Escape is pressed", () => {
    const onOpenChange = vi.fn();
    render(
      <HudPopoverDropdown open onOpenChange={onOpenChange} trigger={<button>Trigger</button>}>
        <div>body</div>
      </HudPopoverDropdown>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("invokes onOpenChange(false) when a click lands outside the dropdown", () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <div data-testid="outside">outside</div>
        <HudPopoverDropdown open onOpenChange={onOpenChange} trigger={<button>Trigger</button>}>
          <div>body</div>
        </HudPopoverDropdown>
      </div>,
    );
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not dismiss when a click lands inside the dropdown content", () => {
    const onOpenChange = vi.fn();
    render(
      <HudPopoverDropdown open onOpenChange={onOpenChange} trigger={<button>Trigger</button>}>
        <button data-testid="inside-button">inside</button>
      </HudPopoverDropdown>,
    );
    fireEvent.mouseDown(screen.getByTestId("inside-button"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
