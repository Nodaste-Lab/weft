import * as React from 'react';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../ui/breadcrumb';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../../ui/navigation-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the navigation category. One entry per component id; see ../specimen-types.ts. */
export const navigationSpecimens: Record<string, Specimen> = {
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
