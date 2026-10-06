/** Last-edited dates from git, written by scripts/component-dates.mjs before the site runs. */
const files = import.meta.glob('../generated/component-dates.json', { eager: true, import: 'default' }) as Record<string, DatesFile>;

export interface DateEntry {
  source: string | null;
  docs: string | null;
  specimen?: string | null;
  fixture?: string | null;
  latest: string | null;
}
export interface DatesFile {
  generatedAt: string;
  components: Record<string, DateEntry>;
  templates: Record<string, DateEntry>;
}

const dates: DatesFile | undefined = Object.values(files)[0];

export function componentDate(id: string): DateEntry | undefined {
  return dates?.components[id];
}
export function templateDate(id: string): DateEntry | undefined {
  return dates?.templates[id];
}
export const datesGeneratedAt = dates?.generatedAt;
