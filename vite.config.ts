import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

/**
 * GitHub Pages has no SPA fallback: it serves 404.html for any path without a file. Emitting a
 * copy of index.html as 404.html boots the app on deep links and reloads, and the router renders
 * the page for the URL as it is (see ADR 0005).
 */
function githubPagesFallback(): Plugin {
  return {
    name: 'github-pages-fallback',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') return
      this.emitFile({ type: 'asset', fileName: '404.html', source: index.source })
    },
  }
}

// Served from https://yuxinhay.github.io/my-portfolio/ (GitHub Pages project site)
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [react(), tailwindcss(), githubPagesFallback()],
})
