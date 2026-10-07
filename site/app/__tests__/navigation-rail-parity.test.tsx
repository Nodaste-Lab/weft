// @vitest-environment jsdom
import React from "react";
import { expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  NavigationRailParity,
  railParity,
} from "../pages/NavigationRailParity";
it("flags source-backed gaps without treating undecided functions as removed", () => {
  localStorage.removeItem("weft-rail-parity-decisions-v1");
  const view = render(<NavigationRailParity />);

  expect(screen.getByText("Avalandra functionality coverage — gaps and decisions").parentElement).toHaveAttribute("open");
  expect(railParity).toHaveLength(20);
  const coverageHeadings = screen.getAllByRole("heading", { level: 3 });
  expect(coverageHeadings[0]).toHaveTextContent("Expand, collapse and file identity · Local behavior");
  expect(coverageHeadings.slice(-14).every((heading) =>
    heading.textContent?.includes("Decision made")
  )).toBe(true);

  expect(new Set(railParity.map((item) => item.id)).size).toBe(20);
  expect(
    screen.getByRole("heading", { name: "Organization switching · Decision made · Intentional change" })
  ).toBeVisible();
  fireEvent.click(
    screen.getByText("Record feedback for Organization switching")
  );
  fireEvent.change(
    screen.getByRole("combobox", {
      name: "Decision for Organization switching",
    }),
    { target: { value: "Retain" } }
  );
  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Feedback for Organization switching",
    }),
    { target: { value: "Keep this above the account." } }
  );
  expect(screen.getByRole("status")).toHaveTextContent("Decision saved");
  view.unmount();
  render(<NavigationRailParity />);
  expect(
    screen.getByRole("textbox", {
      name: "Feedback for Organization switching",
      hidden: true,
    })
  ).toHaveValue("Keep this above the account.");

  fireEvent.change(screen.getByRole("combobox", { name: "Coverage filter" }), {
    target: { value: "Missing" },
  });
  expect(
    screen.queryByRole("heading", { name: /Organization switching/ })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "Unavailable Space list and action errors · Missing",
    })
  ).toBeVisible();
});
