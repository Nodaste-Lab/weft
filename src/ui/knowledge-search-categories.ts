/**
 * Knowledge-search category vocabulary rendered by
 * knowledge-search-result-row. The app's `services/vaultSearchService.ts`
 * re-exports these so search logic and the design system can never drift
 * on the category id → label mapping.
 */

export type SearchCategory =
  | 'people' | 'documents' | 'meetings' | 'tasks' | 'reference'
  | 'uncategorized';

export interface CategoryMeta {
  id: SearchCategory;
  label: string;
  icon: string;
}

export const SEARCH_CATEGORIES: CategoryMeta[] = [
  { id: 'people', label: 'People', icon: 'Users' },
  { id: 'documents', label: 'Documents', icon: 'FileText' },
  { id: 'meetings', label: 'Meetings', icon: 'CalendarDays' },
  { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
  { id: 'reference', label: 'Reference', icon: 'BookOpen' },
];
