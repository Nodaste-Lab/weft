import type { NavigationSpace } from '../ui/navigation-space-picker';
import type { WorkspaceNavigationDestination } from './workspace-navigation-rail';
/** Fictional gallery data; applications provide live counts and URLs. */
export const workspaceNavigationSpaces: NavigationSpace[] = [
  { id: 'studio', name: 'Studio', signals: 11 },
  { id: 'private', name: 'Private', private: true, signals: 3 },
];
export const workspaceNavigationDestinations: WorkspaceNavigationDestination[] = [
  { id: 'signals', label: 'Signals', href: '#signals', icon: 'signals', signals: 11, notifications: 30 },
  { id: 'board', label: 'Kanban board', href: '#board', icon: 'board' },
];
