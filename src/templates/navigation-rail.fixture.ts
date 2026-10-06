import type {
  NavigationRailLabels,
  NavigationRailNavItem,
  NavigationRailProfile,
  NavigationRailSpace,
  NavigationRailTreeNode,
} from './navigation-rail';

/**
 * Gallery fixture for the navigation-rail template. Synthetic data shaped like
 * a workspace rail (spaces, section navigation, a document tree, a profile).
 * Fixtures illustrate; the template never ships any of these as a default.
 */

export const navigationRailSpaces: NavigationRailSpace[] = [
  { id: 'private', label: 'Private' },
  { id: 'studio', label: 'Studio' },
];

export const navigationRailCurrentSpaceId = 'private';

export const navigationRailNavigation: Omit<NavigationRailNavItem, 'icon'>[] = [
  { id: 'documents', label: 'Documents', href: '#documents', isActive: true },
  { id: 'board', label: 'Kanban board', href: '#board' },
  { id: 'signals', label: 'Signals', href: '#signals', count: 1 },
  { id: 'explorer', label: 'Space explorer', href: '#explorer' },
];

export const navigationRailTreeLabel = 'Private';

export const navigationRailTree: NavigationRailTreeNode[] = [
  {
    id: 'crm',
    title: 'CRM records',
    kind: 'folder',
    children: [
      { id: 'crm-1', title: 'Acme — notes', kind: 'document', href: '#crm-1' },
      { id: 'crm-2', title: 'Renewal checklist', kind: 'document', href: '#crm-2' },
      {
        id: 'crm-archive',
        title: 'Archive',
        kind: 'folder',
        children: [{ id: 'crm-3', title: '2025 renewals', kind: 'document', href: '#crm-3' }],
      },
    ],
  },
  { id: 'legal', title: 'Legal', kind: 'folder', children: [] },
  { id: 'coding', title: 'Coding work', kind: 'folder', children: [] },
  { id: 'doc-1', title: 'Onboarding checklist', kind: 'document', href: '#doc-1' },
  { id: 'doc-2', title: '2026-10-05 Weekly recap', kind: 'document', href: '#doc-2' },
  { id: 'doc-3', title: 'Product feedback record', kind: 'document', href: '#doc-3' },
];

export const navigationRailProfile: NavigationRailProfile = {
  name: 'Avery Chen',
  email: 'avery@example.com',
  initials: 'A',
  href: '#account',
};

export const navigationRailLabels: NavigationRailLabels = {
  space: 'Space',
  navigation: 'Navigation',
  spacePicker: 'Space',
  create: 'Create document',
  nodeActions: (title) => `Document actions for ${title}`,
  toggle: 'Toggle navigation',
  rail: 'Collapse or expand navigation from the edge',
};
