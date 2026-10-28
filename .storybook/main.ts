import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  // vite.config.ts sets base '/my-portfolio/' for the app. Storybook is published one level deeper
  // (/my-portfolio/storybook/), so its preview uses relative asset URLs instead.
  viteFinal: (viteConfig) => ({ ...viteConfig, base: './' }),
}

export default config
