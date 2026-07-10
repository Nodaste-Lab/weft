import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Playwright visual specs run via `npm run test:visual`, not vitest.
    exclude: [...configDefaults.exclude, 'tests/visual/**'],
    setupFiles: ['./test-setup.ts'],
    css: false,
  },
});
