import { defineConfig } from '@playwright/test';

// Two Playwright projects with different jobs.
//
//   contract — tests/contract/. Measured assertions against rendered output:
//              accessible names and descriptions, control geometry per density,
//              painted boundary contrast, select chrome, and the sandboxed-iframe
//              consumer condition. These are the gate. They run against the
//              generated specimen page over a static server rooted at the repo,
//              so the page reads the live css/ files.
//   visual   — tests/visual/. Pixel baselines over the public gallery site.
//              A regression alarm that runs after the contract suites; a moved
//              baseline says something changed, never that it is correct.
//              Baselines are Linux-rendered (CI runs in the pinned Playwright
//              container; regenerate via scripts/update-visual-baselines.sh).
//
// testDir is per-project rather than global: vitest's default include matches
// any *.spec.ts, so widening one shared testDir to `tests/` would let vitest
// collect these files and fail on Playwright's globals. vitest.config.ts
// excludes the whole `tests` tree for the same reason — the two changes are a
// pair and must not be separated.

const CONTRACT_PORT = 4318;

// `vite preview` needs site/dist to exist, which only `npm run site:build`
// produces. Starting it for a contract-only run would fail on a clean checkout,
// so the gallery server is opt-in and `npm run test:visual` sets the flag.
const wantsGallery = process.env.WEFT_VISUAL === '1';

export default defineConfig({
  fullyParallel: true,
  // The ratchet's key log is truncated at setup and audited at teardown — see
  // tests/contract/global-teardown.ts for what it catches and why module state
  // could not carry it.
  globalSetup: './tests/contract/global-setup.ts',
  globalTeardown: './tests/contract/global-teardown.ts',
  expect: { toHaveScreenshot: { animations: 'disabled' } },
  use: { viewport: { width: 1080, height: 900 }, deviceScaleFactor: 1 },
  // Playwright's default template carries `{-projectName}`, which is empty
  // while a config has no named projects and becomes `-visual` the moment it
  // does. Introducing projects would therefore have orphaned all 78 committed
  // baselines and quietly rewritten the pixel gate. This is the default with
  // that one token removed; `{-snapshotSuffix}` stays, because it is what makes
  // the committed baselines `-linux` and keeps them scoped to the container
  // that renders them.
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-snapshotSuffix}{ext}',
  projects: [
    {
      name: 'contract',
      testDir: 'tests/contract',
      // Files still run in parallel; tests within a file run serially. The
      // resting-boundary blocks share one capture across the three grounds of a
      // combination via beforeAll, and splitting those tests across workers
      // would re-capture per worker for no gain.
      fullyParallel: false,
      use: { baseURL: `http://127.0.0.1:${CONTRACT_PORT}` },
    },
    {
      name: 'visual',
      testDir: 'tests/visual',
      use: { baseURL: 'http://localhost:4173' },
    },
  ],
  webServer: [
    {
      command: `node scripts/serve-repo.mjs ${CONTRACT_PORT}`,
      port: CONTRACT_PORT,
      reuseExistingServer: true,
    },
    ...(wantsGallery
      ? [
          {
            command: 'npx vite preview --config site/vite.config.ts',
            port: 4173,
            reuseExistingServer: true,
          },
        ]
      : []),
  ],
});
