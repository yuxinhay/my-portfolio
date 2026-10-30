import { expect, test } from './fixtures.ts'
import type { Page } from '@playwright/test'
import { projects } from '../src/content/projects.ts'
import { PROJECT_PATHS } from './support.ts'

/** Presses Tab until `target` has focus, failing after `limit` presses. */
async function tabTo(page: Page, target: ReturnType<Page['locator']>, limit = 10) {
  for (let presses = 0; presses < limit; presses++) {
    await page.keyboard.press('Tab')
    if (await target.evaluate((element) => element === document.activeElement)) return
  }
  throw new Error(`Not reached within ${limit} Tab presses`)
}

test('the skip link is the first Tab stop and moves focus to main', async ({ page }) => {
  await page.goto('./')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('main#main')).toBeFocused()
})

test.describe('mobile menu at 320px', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  test('opens and closes by keyboard, and Escape returns focus to the toggle', async ({ page }) => {
    await page.goto('./')
    const toggle = page.getByRole('button', { name: 'Menu' })
    const nav = page.getByRole('navigation', { name: 'Primary' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(nav).toBeHidden()

    await tabTo(page, toggle)
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(nav).toBeVisible()

    // The menu opens in the page flow, so the next Tab stop is its first link.
    await page.keyboard.press('Tab')
    await expect(nav.getByRole('link', { name: 'Work' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toBeFocused()
    await expect(nav).toBeHidden()

    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

test('client-side navigation focuses the new h1; the first load does not', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('h1')).toBeVisible()
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)

  const link = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Design system' })
  await tabTo(page, link)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/my-portfolio\/design-system$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Design system' })).toBeFocused()

  await page.goBack()
  await expect(page).toHaveURL(/\/my-portfolio\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
})

test('a case study loads directly from a deep link', async ({ page }) => {
  const project = projects.at(-1)
  if (!project) throw new Error('No projects')
  // `vite preview` falls back to index.html; GitHub Pages serves the same file as 404.html (see
  // build.spec.ts). Either way the app boots and the router renders the case study.
  const response = await page.goto(`./projects/${project.slug}`)
  expect(response?.ok()).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)
})

test.describe('case-study videos', () => {
  /** Scrolls every video on every case study into view and reports its state. */
  async function videoStates(page: Page) {
    const states: {
      path: string
      paused: boolean
      currentTime: number
      autoplay: boolean
      controls: boolean
    }[] = []
    for (const path of PROJECT_PATHS) {
      await page.goto(path)
      const videos = page.locator('video')
      for (let index = 0; index < (await videos.count()); index++) {
        const video = videos.nth(index)
        await video.scrollIntoViewIfNeeded()
        // Give the in-view observer time to act (it plays at 60% visibility).
        await page.waitForTimeout(500)
        states.push({
          path,
          ...(await video.evaluate((element: HTMLVideoElement) => ({
            paused: element.paused,
            currentTime: element.currentTime,
            autoplay: element.hasAttribute('autoplay'),
            controls: element.hasAttribute('controls'),
          }))),
        })
      }
    }
    expect(states.length, 'case studies have videos to check').toBeGreaterThan(0)
    return states
  }

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('never play', async ({ page }) => {
      for (const state of await videoStates(page)) {
        expect(state, state.path).toMatchObject({ paused: true, currentTime: 0 })
      }
    })
  })

  test('with normal motion, have no autoplay attribute and keep controls', async ({ page }) => {
    for (const state of await videoStates(page)) {
      expect(state, state.path).toMatchObject({ autoplay: false, controls: true })
    }
  })
})
