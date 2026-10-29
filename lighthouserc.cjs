// Lighthouse CI on the production build (`dist/`), served by `vite preview` under the GitHub Pages
// base path. Runs the mobile preset (Lighthouse's default); `LIGHTHOUSE_FORM_FACTOR=desktop` runs
// the desktop preset. (Not an `LHCI_*` variable: LHCI reads those as its own CLI options.)
// Score thresholds sit a few points under the scores measured when they were set (ADR 0007);
// accessibility must be 100 on every page.
const formFactor = process.env.LIGHTHOUSE_FORM_FACTOR === 'desktop' ? 'desktop' : 'mobile'
const PORT = 4318
const BASE = `http://localhost:${PORT}/my-portfolio/`
const KB = 1024

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npm run preview -- --port ${PORT} --strictPort`,
      startServerReadyPattern: 'Local',
      url: [
        BASE,
        // One UX and one PM case study; the UX one has the most media above the fold.
        `${BASE}projects/adaptive-tables`,
        `${BASE}projects/flowcentral`,
        `${BASE}design-system`,
        `${BASE}how-i-built-this`,
      ],
      numberOfRuns: 3,
      settings: formFactor === 'desktop' ? { preset: 'desktop' } : {},
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        // Transfer sizes per page (what Lighthouse loads; lazy media below the fold is not counted).
        'resource-summary:script:size': ['error', { maxNumericValue: 180 * KB }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 20 * KB }],
        'resource-summary:font:size': ['error', { maxNumericValue: 80 * KB }],
        'resource-summary:image:size': ['error', { maxNumericValue: 600 * KB }],
        'resource-summary:total:size': ['error', { maxNumericValue: 900 * KB }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: `.lighthouseci/reports/${formFactor}`,
    },
  },
}
