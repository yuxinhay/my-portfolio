import { AxeBuilder } from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { site } from '../src/content/site.ts'
import { expect, test } from './fixtures.ts'
import { settleMotion, watchForErrors } from './support.ts'

// A first-time visitor: the intro has never been closed in this browser.
test.use({ glanceSeen: false })

// From src/content/glance.ts, which imports an image and cannot load in Node; its content test
// checks the same order.
const LABEL = 'Yuxin Hay at a glance'
const SCENES = ['blush', 'pink', 'cobalt', 'ink', 'blush', 'cobalt']
const COUNT = SCENES.length

const dialog = (page: Page) => page.getByRole('dialog', { name: LABEL })
const currentCard = (page: Page) => dialog(page).locator('[role="group"]:not([inert])')
const h1 = (page: Page) => page.getByRole('heading', { level: 1, name: site.name })

async function expectNoAxeViolations(page: Page, context: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const summary = violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target }) => target.join(' ')),
  }))
  expect(summary, `axe WCAG 2.0 A/AA violations, ${context}`).toEqual([])
}

// Runs in every project: desktop (1280px), mobile (320px) and 200% zoom.
test('every card: no axe violations, no horizontal overflow, controls on screen', async ({
  page,
}) => {
  const errors = watchForErrors(page)
  await page.goto('./')
  await expect(dialog(page)).toBeVisible()
  for (let card = 1; card <= COUNT; card++) {
    await expect(currentCard(page)).toHaveAttribute('aria-label', `Card ${card} of ${COUNT}`)
    await settleMotion(page)
    await expectNoAxeViolations(page, `card ${card}`)
    const overflow = await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement
      return scrollWidth - clientWidth
    })
    expect(overflow, `no horizontal page overflow on card ${card}`).toBeLessThanOrEqual(0)
    const next = page.getByRole('button', { name: card < COUNT ? 'Next' : 'Explore my work' })
    await expect(next).toBeInViewport()
    await expect(page.getByRole('button', { name: 'Skip' })).toBeInViewport()
    if (card < COUNT) await next.click()
  }
  errors.expectNone()
})

test.describe('behaviour', () => {
  test.skip(({ viewport }) => viewport?.width !== 1280, 'Desktop only; layout runs everywhere')

  test('opens on a first visit over a dimmed, blurred page, in the agreed scenes', async ({
    page,
  }) => {
    await page.goto('./')
    await expect(dialog(page)).toBeVisible()
    const backdrop = await dialog(page).evaluate((element) => {
      const style = getComputedStyle(element, '::backdrop')
      return { filter: style.backdropFilter, background: style.backgroundColor }
    })
    expect(backdrop.filter).toContain('blur')
    expect(backdrop.background).not.toBe('rgba(0, 0, 0, 0)')
    // The page behind is inert: its links are not reachable.
    expect(await page.evaluate(() => document.querySelector('header a')?.matches(':modal *'))).toBe(
      false,
    )
    const scenes = await dialog(page)
      .locator('[role="group"]')
      .evaluateAll((cards) => cards.map((card) => card.className.match(/scene-(\w+)/)?.[1]))
    expect(scenes).toEqual(SCENES)
  })

  test('works end to end by keyboard and stays closed after a reload', async ({ page }) => {
    await page.goto('./')
    const next = page.getByRole('button', { name: 'Next' })
    await expect(next).toBeFocused()

    // The page behind is inert: Tab only reaches the dialog's controls (and, past the last one,
    // the browser's own UI, which a modal dialog allows), never the page.
    const reached = new Set<string>()
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      const where = await page.evaluate(() => {
        const focused = document.activeElement
        if (!focused || focused === document.body) return 'browser'
        return focused.closest('dialog') ? 'dialog' : `page: ${focused.outerHTML.slice(0, 80)}`
      })
      reached.add(where)
    }
    expect([...reached].sort()).toEqual(['browser', 'dialog'])
    await next.focus()

    await page.keyboard.press('ArrowRight')
    await expect(currentCard(page)).toHaveAttribute('aria-label', `Card 2 of ${COUNT}`)
    await expect(dialog(page).locator('[aria-live="polite"]')).toHaveText(`Card 2 of ${COUNT}`)
    await page.keyboard.press('ArrowLeft')
    await expect(currentCard(page)).toHaveAttribute('aria-label', `Card 1 of ${COUNT}`)

    await page.getByRole('button', { name: `Go to card 3 of ${COUNT}` }).focus()
    await page.keyboard.press('Enter')
    await expect(currentCard(page)).toHaveAttribute('aria-label', `Card 3 of ${COUNT}`)
    await expect(page.getByRole('button', { name: `Go to card 3 of ${COUNT}` })).toHaveAttribute(
      'aria-current',
      'true',
    )

    for (let card = 3; card < COUNT; card++) await page.keyboard.press('ArrowRight')
    const explore = page.getByRole('button', { name: 'Explore my work' })
    await explore.focus()
    await page.keyboard.press('Enter')
    await expect(dialog(page)).toBeHidden()
    await expect(h1(page)).toBeFocused()

    await page.reload()
    await expect(h1(page)).toBeVisible()
    await expect(dialog(page)).toHaveCount(0)
  })

  test('Escape skips it; Replay reopens it and returns focus to the Replay button', async ({
    page,
  }) => {
    await page.goto('./')
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
    await expect(h1(page)).toBeFocused()

    const replay = page.getByRole('button', { name: 'Replay intro' })
    await replay.click()
    await expect(dialog(page)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
    await expect(replay).toBeFocused()
  })

  test('nothing advances by itself', async ({ page }) => {
    await page.goto('./')
    await page.clock.install()
    await page.clock.fastForward('05:00')
    await expect(currentCard(page)).toHaveAttribute('aria-label', `Card 1 of ${COUNT}`)
  })

  test('slides between cards and counts numbers up', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: `Go to card 3 of ${COUNT}` }).click()
    const sliding = await page.evaluate(() =>
      document.getAnimations().some((animation) => {
        const target = (animation.effect as KeyframeEffect | null)?.target
        return target instanceof Element && target.classList.contains('glance-track')
      }),
    )
    expect(sliding, 'the card row is sliding').toBe(true)
    // The animated copy starts below the final value and lands on it.
    const number = currentCard(page).locator('.sr-only + [aria-hidden] + [aria-hidden]').first()
    await expect(number).toHaveText('40+')
  })

  test('does not open when a visit starts elsewhere, nor when going home from there', async ({
    page,
  }) => {
    await page.goto('./design-system')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(dialog(page)).toHaveCount(0)
    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Work' })
      .click()
    await expect(h1(page)).toBeFocused()
    await expect(dialog(page)).toHaveCount(0)
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('cards swap without movement and numbers show their final value', async ({ page }) => {
      await page.goto('./')
      await page.getByRole('button', { name: 'Next' }).click()
      await page.getByRole('button', { name: 'Next' }).click()
      await expect(currentCard(page)).toHaveAttribute('aria-label', `Card 3 of ${COUNT}`)
      // The base styles cut stray transitions to 0.01ms; nothing longer may run.
      const running = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => Number(animation.effect?.getTiming().duration ?? 0) > 1).length,
      )
      expect(running).toBe(0)
      const slide = await dialog(page)
        .locator('.glance-track')
        .evaluate((track) => Number.parseFloat(getComputedStyle(track).transitionDuration))
      expect(slide).toBeLessThan(0.001)
      // No animated copies, just the values.
      await expect(currentCard(page).locator('.sr-only')).toHaveCount(0)
      await expect(currentCard(page).getByText('40+', { exact: true })).toBeVisible()
    })
  })
})
