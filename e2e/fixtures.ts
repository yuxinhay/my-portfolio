import { test as base } from '@playwright/test'
import { GLANCE_SEEN_KEY } from '../src/components/glance/glanceStorage.ts'

export { expect } from '@playwright/test'

export interface GlanceOptions {
  /**
   * Whether the At a glance intro was closed earlier in this browser session. Defaults to `true`,
   * so specs that test the pages themselves are not covered by the intro on the home page;
   * `glance.spec.ts` sets it to `false` to test a first visit.
   */
  glanceSeen: boolean
}

/**
 * Playwright's `test`, plus the `glanceSeen` option: before any page script runs, it records in
 * sessionStorage that the intro was closed (or makes sure it was not). Every spec imports `test`
 * from here. Only `page` is seeded: another page of the same context is a new tab, a new session.
 */
export const test = base.extend<GlanceOptions>({
  glanceSeen: [true, { option: true }],
  // `run` is Playwright's `use` callback, renamed so the React hooks lint rule leaves it alone.
  page: async ({ page, glanceSeen }, run) => {
    await page.addInitScript(
      ([key, seen]) => {
        // Only on the first document of the test, so a reload keeps what the page itself stored.
        if (sessionStorage.getItem('e2e-seeded')) return
        sessionStorage.setItem('e2e-seeded', '1')
        if (seen) sessionStorage.setItem(key, '1')
        else sessionStorage.removeItem(key)
      },
      [GLANCE_SEEN_KEY, glanceSeen] as const,
    )
    await run(page)
  },
})
