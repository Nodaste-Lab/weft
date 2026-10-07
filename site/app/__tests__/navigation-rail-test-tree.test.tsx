// @vitest-environment jsdom
import React from "react";
import { it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { NavigationRailTestTree, type TestFile } from "../pages/NavigationRailTestTree";
function Fixture({ writable = true, transfer = vi.fn() }) {
  const [files, setFiles] = React.useState<TestFile[]>([
    { id: "a", label: "Alpha", icon: "text", children: [{ id: "child", label: "Child", icon: "text" }] },
    { id: "b", label: "Beta", icon: "folder" },
  ]);
  const [selected, setSelected] = React.useState<string | null>(null);
  return <NavigationRailTestTree files={files} onChange={setFiles} selected={selected} onSelect={setSelected} writable={writable} onMessage={() => {}} onTransfer={transfer}
    renderRow={(file, depth, open, expand, activate, message) => <div className="rail-lab-row">
      <button className="rail-lab-title" onClick={activate}>{file.label}</button>
      <button onClick={expand}>{open ? "Collapse" : "Expand"} {file.label}</button>
      {["Move within this Space…", "New child file", "Remove subtree…", "Copy to Space…"].map((action) => <button key={action} onClick={() => message(`Preview only: ${action} for ${file.label}. Avalandra service/dialog is not connected.`)}>{action} for {file.label}</button>)}
    </div>} />;
}
it("reorders with a keyboard and refuses moving a parent inside its child", () => {
  render(<Fixture />);
  fireEvent.keyDown(screen.getByRole("button", { name: "Alpha", exact: true }), { key: "ArrowDown", altKey: true });
  expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("data-file-id", "b");
  fireEvent.click(screen.getByRole("button", { name: "Move within this Space… for Alpha" }));
  expect(screen.queryByRole("option", { name: "Alpha / Child" })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: "Destination" }), { target: { value: "b" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("data-file-id", "b");
  expect(within(screen.getAllByRole("listitem")[0]).getByRole("button", { name: "Alpha", exact: true })).toBeVisible();
});
it("creates children, removes a subtree and restores it with Undo", () => {
  render(<Fixture />);
  fireEvent.click(screen.getByRole("button", { name: "New child file for Alpha" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "New child" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(screen.getByRole("button", { name: "New child", exact: true })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Remove subtree… for Alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(screen.queryByRole("button", { name: "Child", exact: true })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Undo last tree change" }));
  expect(screen.getByRole("button", { name: "Child", exact: true })).toBeVisible();
});
it("does not allow keyboard reordering for read-only data", () => {
  render(<Fixture writable={false} />);
  fireEvent.keyDown(screen.getByRole("button", { name: "Alpha", exact: true }), { key: "ArrowDown", altKey: true });
  expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("data-file-id", "a");
});
it("clears Undo when Space changes and starts removal confirmation on Cancel", () => {
  const files: TestFile[] = [{ id: "a", label: "Alpha", icon: "text" }];
  const onChange = vi.fn();
  const renderRow = (file: TestFile, depth: number, open: boolean, expand: () => void, activate: () => void, message: (value: string) => void) => <button onClick={() => message(`Preview only: Remove subtree… for ${file.label}.`)}>Remove {file.label}</button>;
  const props = { files, onChange, selected: null, onSelect: vi.fn(), writable: true, onMessage: vi.fn(), onTransfer: vi.fn(), renderRow };
  const view = render(<NavigationRailTestTree {...props} space="Studio" />);
  fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha' }));
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(screen.getByRole('button', { name: 'Undo last tree change' })).toBeVisible();
  view.rerender(<NavigationRailTestTree {...props} space="Private" files={[]} />);
  expect(screen.queryByRole('button', { name: 'Undo last tree change' })).toBeNull();
});
