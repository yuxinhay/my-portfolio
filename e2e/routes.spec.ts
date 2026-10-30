import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from './fixtures.ts'
import { ROUTES, mediaUrls, scrollThrough, watchForErrors } from './support.ts'

// Runs in every project: desktop (1280px), mobile (320px) and 200% zoom (see playwright.config.ts).
for (const { name, path } of ROUTES) {
  test(`${name}: one h1, no overflow, no axe violations, no errors`, async ({ page }) => {
    const errors = watchForErrors(page)
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()

    // Load lazy images and let videos reach their in-view state before scanning.
    await scrollThrough(page)

    const overflow = await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement
      return { scrollWidth, clientWidth }
    })
    expect(overflow.scrollWidth, 'no horizontal overflow').toBeLessThanOrEqual(overflow.clientWidth)

    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const summary = violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map(({ target }) => target.join(' ')),
    }))
    expect(summary, 'axe WCAG 2.0 A/AA violations').toEqual([])

    // Every image, video and poster must exist under the base path, whether or not it has loaded.
    for (const url of await mediaUrls(page)) {
      expect(url).toContain('/my-portfolio/')
      const response = await page.request.get(url)
      expect(response.status(), url).toBe(200)
    }

    errors.expectNone()
  })
}
