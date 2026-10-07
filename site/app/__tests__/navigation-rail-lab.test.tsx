// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { NavigationRailLab } from "../pages/NavigationRailLab";
import {
  railIconDefinitions,
  supportsListening,
  supportsLock,
} from "../pages/navigation-rail-icons";
import { railPreviewTokens } from "../pages/navigation-rail-contract";
import { readFileSync } from "node:fs";

describe("NavigationRailLab", () => {
  it("opens the complete rail for template entry points", () => {
    render(<NavigationRailLab initialLevel="Rail" />);
    expect(screen.getByRole("heading", { name: "Combine the rows into the complete rail" })).toBeVisible();
  });
  it("shares density geometry between foundations, atoms, rows and rail", () => {
    const { container } = render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /3\s*Rows/ }));
    fireEvent.change(
      screen.getByRole("combobox", { name: "Density preview" }),
      { target: { value: "dense" } }
    );
    expect(
      (
        container.querySelector(".rail-lab") as HTMLElement
      ).style.getPropertyValue("--rail-lab-row-h")
    ).toBe(railPreviewTokens("dense")["--rail-lab-row-h"]);
    fireEvent.click(screen.getByRole("button", { name: /1\s*Tokens/ }));
    expect(screen.getByText("28px")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Shared component implementation direction"));
    expect(screen.getByRole("heading", { name: "Row density" })).toBeVisible();
  });
  it("carries element choices through rows and the complete rail", () => {
    render(<NavigationRailLab />);
    fireEvent.click(
      screen.getByRole("button", { name: /Label.*Weft type tokens/ })
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Label" }), {
      target: { value: "Project notes" },
    });
    fireEvent.click(screen.getByRole("button", { name: /3\s*Rows/ }));
    expect(
      screen.getByRole("button", { name: "Project notes" })
    ).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Density preview" }),
      { target: { value: "dense" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
    expect(
      screen.getByRole("button", { name: "Project notes" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Density preview" })
    ).toHaveValue("dense");
    expect(
      screen.getByRole("button", { name: "Research notes" })
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Collapse Project notes" })
    );
    expect(
      screen.queryByRole("button", { name: "Research notes" })
    ).not.toBeInTheDocument();
  });
  it("exposes existing component axes and recovers from a preview error", () => {
    render(<NavigationRailLab />);
    fireEvent.click(
      screen.getByRole("button", { name: /Count badge.*Weft Badge/ })
    );
    expect(
      screen.getAllByText("Props on", { exact: false })[0]
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
    fireEvent.change(screen.getByRole("combobox", { name: "File content" }), {
      target: { value: "Error" },
    });
    expect(screen.getByText("Could not load files.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(
      screen.getByRole("button", { name: "Product direction" })
    ).toBeInTheDocument();
  });
  it("matches Signals and Account row presets to the rail compositions", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /3\s*Rows/ }));
    fireEvent.change(screen.getByRole("combobox", { name: "Row example" }), {
      target: { value: "Signals" },
    });
    expect(screen.getAllByLabelText("11 signals awaiting action in Studio").length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByLabelText("30 total notifications in Studio").length
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: "Actions for Signals" })
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Row example" }), {
      target: { value: "Account" },
    });
    expect(
      screen.getAllByRole("button", { name: "Account settings" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: "Actions for Avery Chen" })
    ).not.toBeInTheDocument();
  });
  it("scopes file counters individually and reserves totals for Signals", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
    const row = (name: string) =>
      within(screen.getByRole("button", { name, exact: true }).parentElement!);
    expect(
      row("Product direction").getByLabelText("3 signals awaiting action for Product direction")
    ).toBeInTheDocument();
    expect(
      row("Product direction").queryByLabelText(
        "12 notifications for this file"
      )
    ).not.toBeInTheDocument();
    expect(
      row("Research notes").getByLabelText("2 signals awaiting action for Research notes")
    ).toBeInTheDocument();
    expect(
      row("Research notes").queryByLabelText("3 notifications for this file")
    ).not.toBeInTheDocument();
    expect(
      row("Signals").getByLabelText("11 signals awaiting action in Studio")
    ).toBeInTheDocument();
    expect(
      row("Signals").getByLabelText("30 total notifications in Studio")
    ).toBeInTheDocument();
    for (const name of [
      "Files",
      "Supporting material",
      "Kanban board",
      "Avery Chen",
    ])
      expect(
        row(name).queryByLabelText(/signals|notifications/)
      ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Collapse Product direction" })
    );
    expect(
      row("Signals").getByLabelText("11 signals awaiting action in Studio")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Count badges" }));
    expect(row("Signals").queryByLabelText("11 signals awaiting action in Studio")).not.toBeInTheDocument();
  });
  it("keeps navigation presets outside the file tree", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /3\s*Rows/ }));
    fireEvent.change(screen.getByRole("combobox", { name: "Row example" }), {
      target: { value: "Signals" },
    });
    fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
    const tree = screen.getByRole("region", { name: "Preview files" });
    expect(
      within(tree).queryByRole("button", { name: "Signals" })
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Signals" })).toHaveLength(1);
  });
  it("uses the rail Space selector in the atom example", () => {
    render(<NavigationRailLab />);
    fireEvent.click(
      screen.getByRole("button", { name: /Space selector.*Weft Select/ })
    );
    expect(
      screen.getByRole("combobox", { name: "Preview Space" })
    ).toHaveTextContent("Studio");
  });
  it("switches to a dismissible phone drawer and supports keyboard resizing on desktop", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
    const separator = screen.getByRole("separator", {
      name: "Resize navigation rail",
    });
    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(separator).toHaveAttribute("aria-valuenow", "296");
    fireEvent.change(screen.getByRole("combobox", { name: "Device preview" }), {
      target: { value: "Phone" },
    });
    expect(
      screen.queryByRole("button", { name: "Avery Chen" })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(
      screen.getByRole("dialog", { name: "Space navigation" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Avery Chen" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close", exact: true }));
    expect(
      screen.queryByRole("dialog", { name: "Space navigation" })
    ).not.toBeInTheDocument();
  });
  it("keeps feedback tied to an element and saves an option snapshot", () => {
    localStorage.clear();
    render(<NavigationRailLab />);
    fireEvent.change(
      screen.getByRole("textbox", { name: "What would you change?" }),
      { target: { value: "Try a stronger icon." } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    const saved = JSON.parse(localStorage.getItem("weft:rail-lab:notes")!);
    expect(saved[0].key).toBe("Atoms / icon");
    expect(saved[0].options.iconSize).toBe("16");
    fireEvent.click(
      screen.getByRole("button", { name: /Label.*Weft type tokens/ })
    );
    expect(
      screen.getByRole("textbox", { name: "What would you change?" })
    ).toHaveValue("");
    fireEvent.click(
      screen.getByRole("button", { name: /Icon.*Semantic RailIcon/ })
    );
    expect(
      screen.getByRole("textbox", { name: "What would you change?" })
    ).toHaveValue("Try a stronger icon.");
  });
  it("describes file states and hides each zero counter independently", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /3\s*Rows/ }));
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Listening", exact: true })
    );
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Locked", exact: true })
    );
    const file = screen.getByRole("button", {
      name: "Product direction",
      exact: true,
    });
    expect(file).toHaveAccessibleDescription(/^Text file, listening, locked/);
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Signals for the example file" }),
      { target: { value: "0" } }
    );
    const row = within(file.parentElement!);
    expect(
      row.queryByLabelText("0 signals awaiting action for this file")
    ).not.toBeInTheDocument();
    expect(
      row.queryByLabelText(/notifications for this file/)
    ).not.toBeInTheDocument();
  });
  it("exposes disclosure navigation as a named landmark and nested lists", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
    const nav = within(
      screen.getByRole("navigation", { name: "Space navigation" })
    );
    const files = within(nav.getByRole("list", { name: "Space files" }));
    expect(files.getAllByRole("listitem").length).toBeGreaterThan(3);
    expect(nav.queryByRole("tree")).not.toBeInTheDocument();
    fireEvent.click(
      nav.getByRole("button", { name: "Collapse Product direction" })
    );
    expect(
      files.queryByRole("button", { name: "Research notes" })
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByText("Accessibility requirements and verification")
    );
    expect(
      screen.getByRole("heading", { name: "Navigation accessibility" })
    ).toBeVisible();
  });
  it("keeps a semantic contract for every rail icon and rejects incompatible status uses", () => {
    expect(Object.keys(railIconDefinitions).sort()).toEqual(
      [
        "file",
        "text",
        "html",
        "folder",
        "board",
        "signals",
        "notifications",
        "explorer",
        "listening",
        "locked",
        "private",
        "settings",
        "create",
        "actions",
        "expand",
        "collapse",
        "navigation",
        "filter",
      ].sort()
    );
    for (const definition of Object.values(railIconDefinitions)) {
      expect(definition.meaning.length).toBeGreaterThan(20);
      expect(definition.notFor.length).toBeGreaterThan(20);
    }
    expect(supportsListening("folder")).toBe(false);
    expect(supportsListening("html")).toBe(true);
    expect(supportsLock("folder")).toBe(true);
    expect(supportsLock("private")).toBe(false);
    expect(railIconDefinitions.private.kind).toBe("identity");
    expect(railIconDefinitions.locked.kind).toBe("status");
    const source = readFileSync("site/app/pages/NavigationRailLab.tsx", "utf8");
    expect(source).not.toMatch(/from ["']lucide-react["']/);
  });
  it("keeps destination labels paired with their semantic icons", () => {
    render(<NavigationRailLab />);
    fireEvent.click(screen.getByRole("button", { name: /3\s*Rows/ }));
    fireEvent.change(
      screen.getByRole("combobox", { name: "Row composition" }),
      {
        target: { value: "Navigation" },
      }
    );
    expect(
      screen.getByRole("textbox", { name: "Label", exact: true })
    ).toHaveValue("Files");
    expect(
      screen.getByRole("textbox", { name: "Label", exact: true })
    ).toBeDisabled();
  });
  it("documents purposes in the Icon atom and prevents attaching file states to actions", () => {
    const { container } = render(<NavigationRailLab />);
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Listening", exact: true })
    );
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Locked", exact: true })
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Icon purpose" }), {
      target: { value: "settings" },
    });
    expect(
      screen.getByRole("checkbox", { name: "Listening", exact: true })
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: "Locked", exact: true })
    ).toBeDisabled();
    expect(container.querySelector('[data-status="listening"]')).toBeNull();
    expect(container.querySelector('[data-status="locked"]')).toBeNull();
    expect(
      screen.getByText("The account settings action.", { selector: "p" })
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText("Semantic definitions for every rail icon")
    );
    expect(screen.getByRole("table")).toHaveAccessibleName(
      "Rail icon contract: choose a meaning, not a shape"
    );
  });
});

it("keeps reordered local files when creating a root file", () => {
  render(<NavigationRailLab />);
  fireEvent.click(screen.getByRole("button", { name: /4\s*Rail/ }));
  const nav = screen.getByRole("navigation", { name: "Space navigation", exact: true });
  fireEvent.keyDown(within(nav).getByRole("button", { name: "Reference", exact: true }), { key: "ArrowUp", altKey: true });
  expect(nav.querySelector("[data-file-id]")).toHaveAttribute("data-file-id", "reference");
  fireEvent.pointerDown(within(nav).getByRole("button", { name: "Create preview file" }), { button: 0, ctrlKey: false });
  fireEvent.click(screen.getByRole("menuitem", { name: "Create File", exact: true }));
  fireEvent.change(screen.getByRole("textbox", { name: "New file name" }), { target: { value: "Usability task" } });
  fireEvent.submit(screen.getByRole("textbox", { name: "New file name" }).closest("form")!);
  expect(within(nav).getByRole("button", { name: "Usability task", exact: true })).toBeVisible();
  const ids = Array.from(nav.querySelectorAll("[data-file-id]")).map((node) => node.getAttribute("data-file-id"));
  expect(ids.indexOf("reference")).toBeLessThan(ids.indexOf("root"));
});
