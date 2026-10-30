import type { Meta, StoryObj } from '@storybook/react-vite'
import { TEXT_RECIPES, cx } from '../ui/styles'
import { StatValue } from './StatValue'

/**
 * A Wrapped number that counts up from 0 when it is half on screen (`duration.count`, eased).
 * Screen readers only get the final value. Under reduced motion, or for values that are not a
 * single number, the final value shows at once.
 */
const meta = {
  title: 'Motion/StatValue',
  component: StatValue,
  args: { value: '40+', className: cx(TEXT_RECIPES.stat, 'text-scene-accent') },
  decorators: [
    (Story) => (
      <div className="scene-cobalt p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatValue>

export default meta
type Story = StoryObj<typeof meta>

export const CountsUpInView: Story = {}

/** Prefix, thousands separator and suffix stay in place while the number counts. */
export const PrefixAndSuffix: Story = { args: { value: '$7,000+' } }

export const WordSuffix: Story = { args: { value: '10 weeks' } }

/** A range is not one number, so it is shown as it is. */
export const NotANumber: Story = { args: { value: '1–2 weeks' } }

/** Driven from outside, as on an overlay card: counts each time `active` turns true. */
export const Controlled: Story = { args: { value: '24', active: true } }
