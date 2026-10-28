import '@fontsource-variable/inter'
import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    // Fail the a11y check (red in the a11y panel, and in any Storybook test run) on axe violations.
    a11y: { test: 'error' },
  },
}

export default preview
