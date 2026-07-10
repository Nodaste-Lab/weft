import { defineConfig } from '@playwright/test';

// Visual regression over the public gallery site — the pixel gate for the
// design system. Baselines are Linux-rendered (CI runs in the pinned
// Playwright container; regenerate via scripts/update-visual-baselines.sh).
export default defineConfig({
  testDir: 'tests/visual',
  fullyParallel: true,
  expect: { toHaveScreenshot: { animations: 'disabled' } },
  use: { viewport: { width: 1080, height: 900 }, deviceScaleFactor: 1 },
  webServer: {
    command: 'npx vite preview --config site/vite.config.ts',
    port: 4173,
    reuseExistingServer: true,
  },
});
