import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe over a rendered container and fails with a readable list of violations.
 * Mirrors the Storybook a11y addon: all rules except `region`, because a component rendered on
 * its own has no page landmarks around it. jsdom has no layout, so axe reports colour contrast as
 * "incomplete" rather than failing; contrast is enforced by `npm run tokens:check`.
 */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const { violations } = await axe.run(container, { rules: { region: { enabled: false } } })
  const summary = violations.map(
    ({ id, help, nodes }) => `${id}: ${help} (${nodes.map((node) => node.html).join(', ')})`,
  )
  expect(summary).toEqual([])
}
