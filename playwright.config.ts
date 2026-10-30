import { defineConfig, devices } from '@playwright/test'

// Not Vite's default preview port, so a preview left running elsewhere is never mistaken for this build.
const PORT = 4317

/**
 * End-to-end tests against the production build (`dist/`, built by `npm run test:e2e`), served by
 * `vite preview` under the GitHub Pages base path. Chromium only in CI; set `E2E_WEBKIT=1` to add
 * WebKit locally (see ADR 0007).
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/my-portfolio/`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/my-portfolio/`,
    // Always start a fresh server on the current dist/; fail rather than test another one on the port.
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-320',
      testMatch: ['routes.spec.ts', 'glance.spec.ts'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 }, hasTouch: true },
    },
    {
      // 200% browser zoom of a 1280×800 window: the CSS viewport halves to 640×400 and each CSS
      // pixel covers two device pixels, which is what zooming does to layout and media queries.
      name: 'zoom-200',
      testMatch: ['routes.spec.ts', 'glance.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 640, height: 400 },
        deviceScaleFactor: 2,
      },
    },
    ...(process.env['E2E_WEBKIT']
      ? [
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } },
          },
        ]
      : []),
  ],
})
