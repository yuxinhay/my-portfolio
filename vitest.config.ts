import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Unit + axe tests run in jsdom. The Tailwind plugin is left out: jsdom has no layout, so styles
// would not change any assertion, and colour contrast is checked by `tokens:check` instead.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
  },
})
