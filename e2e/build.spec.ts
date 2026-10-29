import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

// GitHub Pages serves 404.html for every path without a file; it must be the app (ADR 0005).
// `vite preview` falls back to index.html instead, so this is checked on the built files.
test('dist/404.html is a copy of dist/index.html', async () => {
  const [index, notFound] = await Promise.all([
    readFile('dist/index.html', 'utf8'),
    readFile('dist/404.html', 'utf8'),
  ])
  expect(index).toContain('/my-portfolio/assets/')
  expect(notFound).toBe(index)
})
