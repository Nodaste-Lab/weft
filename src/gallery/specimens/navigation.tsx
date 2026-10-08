import { NavigationFileList } from '../../ui/navigation-file-list';
import { NavigationActions } from '../../ui/navigation-actions';
import { NavigationSpacePicker } from '../../ui/navigation-space-picker';
import { NavigationSearch } from '../../ui/navigation-search';
import { NavigationAccount } from '../../ui/navigation-account';
import { NavigationRailLayout } from '../../ui/navigation-rail-layout';
import { NavigationRow, NavigationRowDisclosure, NavigationRowLink } from '../../ui/navigation-row';
import { NavigationCount } from '../../ui/navigation-count';
import { NavigationIcon, NavigationItemIcon } from '../../ui/navigation-icon';
import * as React from 'react';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../ui/breadcrumb';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../../ui/navigation-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the navigation category. One entry per component id; see ../specimen-types.ts. */
export const navigationSpecimens: Record<string, Specimen> = {
'navigation-file-list': {component:'NavigationFileList',module:'navigation-file-list',axes:[],base:{},states:[{label:'Files',props:{},code:'<NavigationFileList nodes={nodes} label="Files" expandedIds={[]} onExpandedChange={onExpandedChange} renderRow={renderRow}/>'}],render:()=> <NavigationFileList nodes={[{id:'research',label:'Research'}]} label="Example files" expandedIds={[]} onExpandedChange={()=>{}} renderRow={node=><span>{node.label}</span>}/>},
'navigation-actions': { component: 'NavigationActions', module: 'navigation-actions', axes: [], base: {}, states: [{ label: 'Default', props: {}, code: "<NavigationActions name=\"Research\" items={[{ id: \"more\", label: \"More\", children: [{ id: \"copy\", label: \"Copy link\", onSelect: () => {} }] }]} />" }], render: () => <NavigationActions name="Research" items={[{ id: "more", label: "More", children: [{ id: "copy", label: "Copy link", onSelect: () => {} }] }]} /> },
'navigation-space-picker': { component: 'NavigationSpacePicker', module: 'navigation-space-picker', axes: [], base: {}, states: [{ label: 'Default', props: {}, code: "<NavigationSpacePicker label=\"Space\" value=\"studio\" onValueChange={() => {}} spaces={[{ id: \"studio\", name: \"Studio\", signals: 3 }]} />" }], render: () => <NavigationSpacePicker label="Space" value="studio" onValueChange={() => {}} spaces={[{ id: "studio", name: "Studio", signals: 3 }]} /> },
'navigation-search': { component: 'NavigationSearch', module: 'navigation-search', axes: [], base: {}, states: [{ label: 'Default', props: {}, code: "<NavigationSearch label=\"Search in Studio\" placeholder=\"Search\" />" }], render: () => <NavigationSearch label="Search in Studio" placeholder="Search" /> },
'navigation-account': { component: 'NavigationAccount', module: 'navigation-account', axes: [], base: {}, states: [{ label: 'Default', props: {}, code: "<NavigationAccount name=\"Avery Chen\" initials=\"AC\" settingsLabel=\"Account settings\" settingsHref=\"#settings\" />" }], render: () => <NavigationAccount name="Avery Chen" initials="AC" settingsLabel="Account settings" settingsHref="#settings" /> },
'navigation-rail-layout': { component: 'NavigationRailLayout', module: 'navigation-rail-layout', axes: [], base: {}, states: [{ label: 'Default', props: {}, code: "<NavigationRailLayout railId=\"layout-example\" label=\"Navigation\" openLabel=\"Open navigation\" resizeLabel=\"Resize navigation\" description=\"Browse destinations\" rail={<nav id=\"layout-example\" aria-label=\"Example navigation\">Files</nav>}><p>Workspace</p></NavigationRailLayout>" }], render: () => <NavigationRailLayout railId="layout-example" label="Navigation" openLabel="Open navigation" resizeLabel="Resize navigation" description="Browse destinations" rail={<nav id="layout-example" aria-label="Example navigation">Files</nav>}><p>Workspace</p></NavigationRailLayout> },
  'navigation-file-list': {
    component: 'NavigationFileList', module: 'navigation-file-list', axes: [],
    render: () => <NavigationFileList nodes={[{id:'example',label:'Example file'}]} label="Example files" expandedIds={[]} onExpandedChange={() => {}} renderRow={node => <NavigationRow><NavigationRowLink href="#example">{node.label}</NavigationRowLink></NavigationRow>} />,
  },
  'navigation-count': {
    component: 'NavigationCount', module: 'navigation-count', axes: [],
    base: { count: 3, name: 'Research', scope: 'file' },
    states: [
      { label: 'Awaiting action', props: {}, code: '<NavigationCount count={3} name="Research" scope="file" />' },
      { label: 'Zero hidden', props: { count: 0 }, code: '<NavigationCount count={0} name="Research" scope="file" />' },
      { label: 'Notifications', props: { scope: 'signals-destination', kind: 'notifications' }, code: '<NavigationCount count={3} name="Studio" scope="signals-destination" kind="notifications" />' },
    ],
    render: (p: P) => <NavigationCount {...(p as React.ComponentProps<typeof NavigationCount>)} />,
  },
  'navigation-icon': {
    component: 'NavigationIcon', module: 'navigation-icon', axes: [], base: { purpose: 'board' },
    states: [
      { label: 'Kanban', props: {}, code: '<NavigationIcon purpose="board" />' },
      { label: 'File statuses', props: { statuses: true }, code: '<NavigationItemIcon purpose="text" listening locked />' },
    ],
    render: (p: P) => p.statuses ? <NavigationItemIcon purpose="text" listening locked /> : <NavigationIcon purpose={p.purpose as 'board'} />,
  },
  'navigation-row': {
    component: 'NavigationRow', module: 'navigation-row', axes: ['density'], base: { density: 'compact' },
    states: [
      { label: 'Current destination', props: { current: true }, code: '<NavigationRow current><NavigationRowLink href="/file" aria-current="page">Research</NavigationRowLink></NavigationRow>' },
      { label: 'Expanded', props: { expanded: true }, code: '<NavigationRowDisclosure name="Research" expanded />' },
    ],
    render: (p: P) => <NavigationRow density={p.density as 'compact'} current={Boolean(p.current)} hierarchical>
      <NavigationRowDisclosure name="Research" expanded={Boolean(p.expanded)} />
      <NavigationRowLink href="#research" aria-current={p.current ? 'page' : undefined}>Research</NavigationRowLink>
    </NavigationRow>,
  },
  breadcrumb: {
    component: 'Breadcrumb',
    module: 'breadcrumb',
    base: { trail: ['Workspace', 'Projects'], current: 'Settings' },
    states: [
      { label: 'Full trail', props: {}, code: '<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href>…</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>', note: 'The last item is the current page: a span with aria-current, never a link.' },
      { label: 'Collapsed', props: { collapsed: true, trail: ['Workspace', 'Projects', 'Archive', 'Season two'], 'aria-label': 'Breadcrumb, collapsed' }, code: '<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>', note: 'Middle levels fold into an ellipsis when the trail is long; the first and last stay.' },
      { label: 'Two levels', props: { trail: ['Workspace'], 'aria-label': 'Breadcrumb, two levels' }, code: '<Breadcrumb>{one link, one page}</Breadcrumb>' },
    ],
    render: ({ trail, current, collapsed, ...p }: P) => {
      const links = trail as string[];
      const shown = collapsed ? [links[0]] : links;
      return (
        <Breadcrumb {...(p as React.ComponentProps<typeof Breadcrumb>)}>
          <BreadcrumbList>
            {shown.map((label) => (
              <React.Fragment key={label}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            ))}
            {collapsed ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : null}
            <BreadcrumbItem>
              <BreadcrumbPage>{current as React.ReactNode}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    },
  },
  'navigation-menu': {
    component: 'NavigationMenu',
    module: 'navigation-menu',
    base: { 'aria-label': 'Site' },
    states: [
      { label: 'Closed', props: {}, code: '<NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger>Guides</NavigationMenuTrigger><NavigationMenuContent>…</NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu>' },
      { label: 'Open', props: { defaultValue: 'guides', viewport: false, 'aria-label': 'Site, open' }, code: '<NavigationMenu defaultValue="guides" viewport={false}>', note: 'The content renders inline below its trigger; with viewport, every item shares one panel.' },
      { label: 'Without viewport', props: { viewport: false, 'aria-label': 'Site, no viewport' }, code: '<NavigationMenu viewport={false}>', note: 'Each item positions its own content instead of sharing the viewport panel.' },
    ],
    render: (p: P) => (
      <div style={{ minHeight: p.defaultValue ? 150 : undefined }}>
        <NavigationMenu {...(p as React.ComponentProps<typeof NavigationMenu>)}>
          <NavigationMenuList>
            <NavigationMenuItem value="guides">
              <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-48 gap-1 p-2">
                  <li>
                    <NavigationMenuLink href="#">Getting started</NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">Tokens</NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="pricing">
              <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    ),
  },
  pagination: {
    component: 'Pagination',
    module: 'pagination',
    base: { pages: 5, page: 2 },
    states: [
      { label: 'Middle page', props: {}, code: '<Pagination><PaginationContent><PaginationItem><PaginationPrevious href /></PaginationItem><PaginationItem><PaginationLink href isActive>2</PaginationLink></PaginationItem>…<PaginationItem><PaginationNext href /></PaginationItem></PaginationContent></Pagination>', note: 'The current page link carries isActive, which sets aria-current="page".' },
      { label: 'First page', props: { page: 1, 'aria-label': 'Pagination, first page' }, code: '<PaginationPrevious aria-disabled tabIndex={-1} />', note: 'Previous stays in the row but is not actionable; it never disappears and shifts the layout.' },
      { label: 'Last page', props: { page: 5, 'aria-label': 'Pagination, last page' }, code: '<PaginationNext aria-disabled tabIndex={-1} />' },
      { label: 'Collapsed', props: { pages: 12, page: 2, 'aria-label': 'Pagination, collapsed' }, code: '<PaginationItem><PaginationEllipsis /></PaginationItem>', note: 'Long ranges show the first pages, an ellipsis and the last page.' },
    ],
    render: ({ pages, page, ...p }: P) => {
      const total = pages as number;
      const current = page as number;
      const visible = total > 6 ? [1, 2, 3] : Array.from({ length: total }, (_, i) => i + 1);
      const atStart = current === 1;
      const atEnd = current === total;
      return (
        <Pagination {...(p as React.ComponentProps<typeof Pagination>)}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={atStart ? undefined : '#'} aria-disabled={atStart || undefined} tabIndex={atStart ? -1 : undefined} className={atStart ? 'pointer-events-none opacity-50' : undefined} />
            </PaginationItem>
            {visible.map((n) => (
              <PaginationItem key={n}>
                <PaginationLink href="#" isActive={n === current}>{n}</PaginationLink>
              </PaginationItem>
            ))}
            {total > 6 ? (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive={total === current}>{total}</PaginationLink>
                </PaginationItem>
              </>
            ) : null}
            <PaginationItem>
              <PaginationNext href={atEnd ? undefined : '#'} aria-disabled={atEnd || undefined} tabIndex={atEnd ? -1 : undefined} className={atEnd ? 'pointer-events-none opacity-50' : undefined} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
    },
  },
};
