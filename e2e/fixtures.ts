import { test as base } from '@playwright/test'
import { GLANCE_SEEN_KEY } from '../src/components/glance/glanceStorage.ts'

export { expect } from '@playwright/test'

export interface GlanceOptions {
  /**
   * Whether the visitor has closed the At a glance intro before. Defaults to `true`, so specs that
   * test the pages themselves are not covered by the intro on the home page; `glance.spec.ts`
   * sets it to `false` to test a first visit.
   */
  glanceSeen: boolean
}

/**
 * Playwright's `test`, plus the `glanceSeen` option: before any page script runs, it records in
 * localStorage that the intro was closed (or makes sure it was not). Every spec imports `test`
 * from here.
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
        if (seen) localStorage.setItem(key, '1')
        else localStorage.removeItem(key)
      },
      [GLANCE_SEEN_KEY, glanceSeen] as const,
    )
    await run(page)
  },
})
