// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecapSectionShell } from "../recap-section-shell";

describe("RecapSectionShell", () => {
  it("renders title, count, body, and slot attributes when open", () => {
    render(
      <RecapSectionShell
        icon={<span data-testid="icon">i</span>}
        title="Beats"
        count={3}
        open
        onToggle={() => {}}
      >
        <div data-testid="body-content">body</div>
      </RecapSectionShell>,
    );

    const shell = document.querySelector('[data-slot="recap-section-shell"]');
    expect(shell).toBeTruthy();
    expect(shell?.getAttribute("data-state")).toBe("open");

    const header = screen.getByRole("button", { name: /Beats/i });
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(header.querySelector('[data-slot="recap-section-count"]')?.textContent).toBe("3");

    expect(screen.getByTestId("body-content")).toBeInTheDocument();
    const body = document.querySelector('[data-slot="recap-section-body"]');
    expect(body).toBeTruthy();
    expect(body?.getAttribute("aria-labelledby")).toBe(header.getAttribute("id"));
  });

  it("hides the body and reports closed state when not open", () => {
    render(
      <RecapSectionShell title="Mysteries" open={false} onToggle={() => {}}>
        <div data-testid="hidden-body">hidden</div>
      </RecapSectionShell>,
    );

    expect(document.querySelector('[data-slot="recap-section-shell"]')?.getAttribute("data-state")).toBe(
      "closed",
    );
    expect(screen.queryByTestId("hidden-body")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mysteries/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("invokes onToggle when the header is clicked", () => {
    const onToggle = vi.fn();
    render(
      <RecapSectionShell title="NPCs" open={false} onToggle={onToggle}>
        body
      </RecapSectionShell>,
    );
    fireEvent.click(screen.getByRole("button", { name: /NPCs/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("propagates density via data attribute", () => {
    render(
      <RecapSectionShell title="X" open onToggle={() => {}} density="compact">
        body
      </RecapSectionShell>,
    );
    expect(document.querySelector('[data-slot="recap-section-shell"]')?.getAttribute("data-density")).toBe(
      "compact",
    );
  });
});
