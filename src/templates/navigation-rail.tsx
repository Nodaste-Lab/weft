import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronRight, FileText, Folder, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '../ui/sidebar';

/**
 * Navigation rail — React template.
 *
 * A workspace rail: space picker, section navigation with counts, a document
 * tree with folders and per-row actions, and the signed-in profile. Composed
 * only from Weft primitives; every piece of content arrives through props
 * (see navigation-rail.fixture.ts for the gallery's data). Nothing here is a
 * default value, so a consumer that passes an empty tree renders an empty
 * tree, not a placeholder.
 *
 * Templates are heuristics. A product wires the same primitives to its own
 * data and routing; matching this file line for line is not the goal.
 */

export interface NavigationRailSpace {
  id: string;
  label: string;
}

export interface NavigationRailNavItem {
  id: string;
  label: string;
  href: string;
  /** Leading icon, 16px, decorative. */
  icon?: ReactNode;
  /** Shown as a trailing count badge when present. */
  count?: number;
  isActive?: boolean;
}

export interface NavigationRailFolderNode {
  id: string;
  title: string;
  kind: 'folder';
  children?: NavigationRailTreeNode[];
}

export interface NavigationRailDocumentNode {
  id: string;
  title: string;
  kind: 'document';
  /** Where the row navigates. Required: a document row is always a link. */
  href: string;
}

export type NavigationRailTreeNode = NavigationRailFolderNode | NavigationRailDocumentNode;

export interface NavigationRailProfile {
  name: string;
  email: string;
  /** Avatar fallback text, one or two characters. */
  initials: string;
  href: string;
}

export interface NavigationRailLabels {
  /** Group label above the space picker. */
  space: string;
  /** Group label above the section navigation. */
  navigation: string;
  /** Accessible name of the space picker trigger. */
  spacePicker: string;
  /** Accessible name of the group action that creates a document. */
  create: string;
  /** Accessible name of a row's actions control, given the row title. */
  nodeActions: (title: string) => string;
  /** Accessible name of the trigger in the main column that opens and closes the rail. */
  toggle: string;
  /** Accessible name of the edge rail, the pointer affordance on wide viewports. Distinct from `toggle`: two controls never share a name. */
  rail: string;
}

export interface NavigationRailProps {
  spaces: NavigationRailSpace[];
  currentSpaceId: string;
  onSpaceChange?: (spaceId: string) => void;
  navigation: NavigationRailNavItem[];
  /** Group label above the tree; usually the current space's name. */
  treeLabel: string;
  tree: NavigationRailTreeNode[];
  onCreate?: () => void;
  onNodeAction?: (node: NavigationRailTreeNode) => void;
  profile: NavigationRailProfile;
  labels: NavigationRailLabels;
  /** Main column content rendered beside the rail. */
  children?: ReactNode;
  className?: string;
}

function TreeNode({
  node,
  depth,
  labels,
  onNodeAction,
}: {
  node: NavigationRailTreeNode;
  depth: number;
  labels: NavigationRailLabels;
  onNodeAction?: (node: NavigationRailTreeNode) => void;
}) {
  const action = (
    <SidebarMenuAction
      showOnHover
      aria-label={labels.nodeActions(node.title)}
      onClick={() => onNodeAction?.(node)}
    >
      <MoreHorizontal aria-hidden="true" focusable="false" />
    </SidebarMenuAction>
  );

  if (node.kind === 'folder') {
    return (
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <Folder aria-hidden="true" focusable="false" />
              <span>{node.title}</span>
              <ChevronRight
                aria-hidden="true"
                focusable="false"
                className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {action}
          {node.children && node.children.length > 0 ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {node.children.map((child) => (
                  <SubTreeNode key={child.id} node={child} depth={depth + 1} labels={labels} onNodeAction={onNodeAction} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={node.href}>
          <FileText aria-hidden="true" focusable="false" />
          <span>{node.title}</span>
        </a>
      </SidebarMenuButton>
      {action}
    </SidebarMenuItem>
  );
}

function SubTreeNode({
  node,
  depth,
  labels,
  onNodeAction,
}: {
  node: NavigationRailTreeNode;
  depth: number;
  labels: NavigationRailLabels;
  onNodeAction?: (node: NavigationRailTreeNode) => void;
}) {
  if (node.kind === 'folder') {
    return (
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton>
              <Folder aria-hidden="true" focusable="false" />
              <span>{node.title}</span>
              <ChevronRight
                aria-hidden="true"
                focusable="false"
                className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          {node.children && node.children.length > 0 ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {node.children.map((child) => (
                  <SubTreeNode key={child.id} node={child} depth={depth + 1} labels={labels} onNodeAction={onNodeAction} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <a href={node.href}>
          <FileText aria-hidden="true" focusable="false" />
          <span>{node.title}</span>
        </a>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function NavigationRail({
  spaces,
  currentSpaceId,
  onSpaceChange,
  navigation,
  treeLabel,
  tree,
  onCreate,
  onNodeAction,
  profile,
  labels,
  children,
  className,
}: NavigationRailProps) {
  return (
    <SidebarProvider defaultOpen className={className}>
      <Sidebar collapsible="offcanvas" data-template="navigation-rail">
        <SidebarHeader>
          <SidebarGroupLabel>{labels.space}</SidebarGroupLabel>
          <Select value={currentSpaceId} onValueChange={onSpaceChange}>
            <SelectTrigger size="sm" aria-label={labels.spacePicker}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spaces.map((space) => (
                <SelectItem key={space.id} value={space.id}>
                  {space.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{labels.navigation}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.href} aria-current={item.isActive ? 'page' : undefined}>
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {typeof item.count === 'number' ? (
                      <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>{treeLabel}</SidebarGroupLabel>
            {onCreate ? (
              <SidebarGroupAction aria-label={labels.create} onClick={onCreate}>
                <Plus aria-hidden="true" focusable="false" />
              </SidebarGroupAction>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {tree.map((node) => (
                  <TreeNode key={node.id} node={node} depth={0} labels={labels} onNodeAction={onNodeAction} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href={profile.href}>
                  <Avatar className="size-7">
                    <AvatarFallback>{profile.initials}</AvatarFallback>
                  </Avatar>
                  <span className="grid leading-tight">
                    <span>{profile.name}</span>
                    <span className="text-muted-foreground text-xs">{profile.email}</span>
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail aria-label={labels.rail} />
      </Sidebar>
      <SidebarInset>
        {/* The rail is off-canvas: on a narrow viewport it is a closed sheet,
            and the edge rail is a desktop affordance, so the main column
            always carries a named trigger. */}
        <div data-slot="navigation-rail-bar" className="flex items-center gap-2 px-2 py-1">
          <SidebarTrigger aria-label={labels.toggle} />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
