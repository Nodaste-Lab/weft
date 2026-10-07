// @vitest-environment jsdom
import React from "react";
import { expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NavigationRailSearch } from "../pages/NavigationRailSearch";
it("searches collapsed-name fixtures, clears and resets on Space change", () => {
  const onOpen = vi.fn();
  const props = {
    space: "Studio",
    items: [
      {
        label: "Interview summary",
        path: "Studio / Research / Interview summary",
        icon: "text" as const,
      },
    ],
    onOpen,
    onExplore: vi.fn(),
  };
  const view = render(<NavigationRailSearch {...props} />);
  const field = screen.getByRole("searchbox", {
    name: "Search in Studio",
  });
  fireEvent.change(field, { target: { value: "INTERVIEW" } });
  expect(screen.getByRole("status")).toHaveTextContent("1 match in Studio");
  fireEvent.click(screen.getByRole("button", { name: /Interview summary/ }));
  expect(onOpen).toHaveBeenCalledWith(props.items[0]);
  expect(field).toHaveValue("");
  fireEvent.change(field, { target: { value: "missing" } });
  expect(screen.getByText(/No matching file names/)).toBeVisible();
  view.rerender(<NavigationRailSearch {...props} space="Private" />);
  expect(
    screen.getByRole("searchbox", { name: "Search in Private" })
  ).toHaveValue("");
});
