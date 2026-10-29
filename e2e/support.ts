import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { projects } from '../src/content/projects.ts'

/** Every route, relative to the `/my-portfolio/` base URL. Case studies come from the content. */
export const ROUTES: readonly { name: string; path: string }[] = [
  { name: 'home', path: './' },
  ...projects.map(({ slug }) => ({ name: `project ${slug}`, path: `./projects/${slug}` })),
  { name: 'design system', path: './design-system' },
  { name: 'how I built this', path: './how-i-built-this' },
  { name: 'not found', path: './no-such-page' },
]

export const PROJECT_PATHS = projects.map(({ slug }) => `./projects/${slug}`)

/**
 * Records console errors, uncaught exceptions, failed requests and HTTP errors on the page. Call
 * before navigating; `expectNone()` asserts nothing was recorded.
 *
 * The browser cancels a video's range request when it stops buffering (`ERR_ABORTED`); that is
 * not recorded. Every video source is requested separately and must return 200 (see `mediaUrls`).
 */
export function watchForErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`exception: ${error.message}`))
  page.on('requestfailed', (request) => {
    const errorText = request.failure()?.errorText ?? 'unknown'
    if (request.resourceType() === 'media' && errorText === 'net::ERR_ABORTED') return
    errors.push(`request failed: ${request.url()} (${errorText})`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`)
  })
  return {
    expectNone: () => expect(errors, 'console errors and failed requests').toEqual([]),
  }
}

/** Scrolls to the bottom in viewport steps, so lazy images load, then back to the top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight / 2, 100)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    window.scrollTo(0, 0)
  })
}

/** Absolute URLs of every image, video source and poster on the page. */
export function mediaUrls(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const urls = [
      ...Array.from(document.images, (image) => image.currentSrc || image.src),
      ...Array.from(document.querySelectorAll('video source'), (source) =>
        source.getAttribute('src'),
      ),
      ...Array.from(document.querySelectorAll('video'), (video) => video.getAttribute('poster')),
    ]
    return [
      ...new Set(
        urls.filter((url): url is string => !!url).map((url) => new URL(url, location.href).href),
      ),
    ]
  })
}
