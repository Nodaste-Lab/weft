import * as React from "react";
import { NavigationRailLayout, type NavigationRailLayoutProps } from "../ui/navigation-rail-layout";
import { NavigationSpacePicker, type NavigationSpacePickerProps } from "../ui/navigation-space-picker";
import { NavigationSearch, type NavigationSearchProps } from "../ui/navigation-search";
import { NavigationAccount, type NavigationAccountProps } from "../ui/navigation-account";
import { NavigationRow, NavigationRowLink, NavigationRowDisclosure } from "../ui/navigation-row";
import { NavigationIcon, type NavigationIconPurpose } from "../ui/navigation-icon";
import { NavigationCount } from "../ui/navigation-count";
export type WorkspaceNavigationDestination = {
  id: string;
  label: string;
  href: string;
  icon: NavigationIconPurpose;
  signals?: number;
  notifications?: number;
  /** Future destinations with subsections replace the Files panel. */
  panel?: React.ReactNode;
};
export type WorkspaceNavigationRailProps = {
  id: string;
  label: string;
  spaceLabel: string;
  filesLabel: string;
  filesHref: string;
  /** ID used by currentDestination for the Files destination. */
  filesId?: string;
  spacePicker: NavigationSpacePickerProps;
  search: NavigationSearchProps;
  destinations: WorkspaceNavigationDestination[];
  currentDestination?: string;
  files: React.ReactNode;
  create?: React.ReactNode;
  account: NavigationAccountProps;
  layout: Omit<NavigationRailLayoutProps, "rail" | "railId" | "children" | "label">;
  children: React.ReactNode;
};
/** App owns file data, selection, paging, permissions, routes and mutation. */
export function WorkspaceNavigationRail({ id, label, spaceLabel, filesLabel, filesHref, filesId = "files", spacePicker, search, destinations, currentDestination, files, create, account, layout, children }: WorkspaceNavigationRailProps) {
  const [filesOpen, setFilesOpen] = React.useState(true);
  const current = destinations.find(item => item.id === currentDestination);
  const hasPanel = current?.panel !== undefined;
  React.useEffect(() => { if (!hasPanel) setFilesOpen(true); }, [currentDestination, hasPanel]);
  const spaceName = spacePicker.spaces.find(space => space.id === spacePicker.value)?.name ?? label;
  const filesCurrent = currentDestination === filesId;
  const rail = <nav id={id} aria-label={label} className="weft-workspace-navigation">
    <header><label>{spaceLabel}<NavigationSpacePicker {...spacePicker} /></label></header>
    <NavigationSearch {...search} />
    {destinations.map(item => <NavigationRow key={item.id} current={item.id === currentDestination}>
      <NavigationRowLink href={item.href} aria-current={item.id === currentDestination ? 'page' : undefined}><NavigationIcon purpose={item.icon} /><span className="weft-navigation-space-name">{item.label}</span></NavigationRowLink>
      {item.icon === 'signals' && <NavigationCount count={item.signals ?? 0} name={spaceName} scope="signals-destination" />}
      {item.icon === 'signals' && <NavigationCount count={item.notifications ?? 0} name={spaceName} scope="signals-destination" kind="notifications" />}
    </NavigationRow>)}
    <NavigationRow current={filesCurrent}><NavigationRowDisclosure name={filesLabel} disabled={hasPanel} expanded={!hasPanel && filesOpen} aria-controls={`${id}-files`} onClick={() => setFilesOpen(!filesOpen)} /><NavigationIcon purpose="file" /><NavigationRowLink href={filesHref} aria-current={filesCurrent ? "page" : undefined}>{filesLabel}</NavigationRowLink>{create}</NavigationRow>
    <section id={`${id}-files`} aria-label={filesLabel} hidden={hasPanel || !filesOpen} className="weft-workspace-navigation-files">{files}</section>
    {hasPanel && <section className="weft-workspace-navigation-files" aria-label={current.label}>{current.panel}</section>}
    <NavigationAccount {...account} />
  </nav>;
  return <NavigationRailLayout {...layout} railId={id} rail={rail} label={label}>{children}</NavigationRailLayout>;
}
