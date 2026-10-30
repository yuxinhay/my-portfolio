import type { Page } from '@playwright/test'
import { expect, test } from './fixtures.ts'

/** Opacity of every child of a reveal group (what the reveals would hide). */
function opacities(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('main section [data-reveal-group] > *'), (element) =>
      Number(getComputedStyle(element).opacity),
    ),
  )
}

test.describe('scroll reveals', () => {
  test('hide sections below the fold until they scroll in, then show them', async ({ page }) => {
    await page.goto('./projects/flowcentral')
    await expect(page.locator('html')).toHaveAttribute('data-motion', '')
    const last = page.locator('main section').last().locator('[data-reveal]').first()
    await expect(last).not.toHaveAttribute('data-revealed')
    expect(await last.evaluate((element) => getComputedStyle(element).opacity)).toBe('0')
    await last.scrollIntoViewIfNeeded()
    await expect(last).toHaveAttribute('data-revealed', '')
    await expect.poll(() => last.evaluate((e) => getComputedStyle(e).opacity)).toBe('1')
  })

  test('leave every section visible when IntersectionObserver is missing', async ({ page }) => {
    await page.addInitScript(() => {
      Reflect.deleteProperty(window, 'IntersectionObserver')
    })
    await page.goto('./projects/flowcentral')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-reveal]')).toHaveCount(0)
    await expect(page.locator('html')).not.toHaveAttribute('data-motion')
    const values = await opacities(page)
    expect(values.length).toBeGreaterThan(0)
    expect(values.every((value) => value === 1)).toBe(true)
    // Numbers show their final value too.
    await expect(page.getByText('40+', { exact: true }).first()).toBeAttached()
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('hide nothing', async ({ page }) => {
      await page.goto('./')
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-reveal]')).toHaveCount(0)
      const values = await opacities(page)
      expect(values.every((value) => value === 1)).toBe(true)
    })
  })
})

test.describe('page transitions', () => {
  /** Counts calls to document.startViewTransition (if the browser has it). */
  async function countViewTransitions(page: Page) {
    await page.addInitScript(() => {
      const start = document.startViewTransition?.bind(document)
      if (!start) return
      Object.assign(window, { viewTransitions: 0 })
      document.startViewTransition = ((update: ViewTransitionUpdateCallback) => {
        Object.assign(window, {
          viewTransitions: (window as unknown as { viewTransitions: number }).viewTransitions + 1,
        })
        return start(update)
      }) as typeof document.startViewTransition
    })
  }
  const calls = (page: Page) =>
    page.evaluate(() => (window as unknown as { viewTransitions?: number }).viewTransitions)

  test('crossfade and keep focus on the new h1', async ({ page }) => {
    await countViewTransitions(page)
    await page.goto('./')
    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Design system' })
      .click()
    await expect(page.getByRole('heading', { level: 1, name: 'Design system' })).toBeFocused()
    expect(await calls(page)).toBe(1)
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('change pages without a transition, focus still on the h1', async ({ page }) => {
      await countViewTransitions(page)
      await page.goto('./')
      await page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: 'How I built this' })
        .click()
      await expect(page.getByRole('heading', { level: 1, name: 'How I built this' })).toBeFocused()
      expect(await calls(page)).toBe(0)
    })
  })
})

test.describe('count-up numbers', () => {
  test('land on the final value; screen readers only ever get that value', async ({ page }) => {
    await page.goto('./')
    const achievements = page.getByRole('region', { name: 'Achievements' })
    const stat = achievements.locator('.sr-only', { hasText: '10+' }).first()
    await expect(stat).toBeAttached()
    // Scroll the number itself in: the section is taller than the viewport.
    await stat.locator('..').scrollIntoViewIfNeeded()
    await expect(stat.locator('xpath=following-sibling::*[2]')).toHaveText('10+')
    // The accessibility tree has the final value and its label, never an intermediate number.
    const tree = await achievements.getByRole('list').first().ariaSnapshot()
    expect(tree).toContain('10+ AI use cases completed and handed over')
    expect(tree).not.toMatch(/\b0\+/)
  })
})
