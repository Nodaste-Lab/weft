import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Playwright owns the whole `tests` tree — tests/visual/ (pixel baselines)
    // and tests/contract/ (the measured contract suites). vitest's default
    // include matches any *.spec.ts anywhere, so anything narrower than this
    // collects a Playwright spec here and fails on Playwright's globals.
    // Paired with the per-project testDir in playwright.config.ts.
    exclude: [...configDefaults.exclude, 'tests/**'],
    setupFiles: ['./test-setup.ts'],
    css: false,
  },
});
