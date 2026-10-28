import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from https://yuxinhay.github.io/my-portfolio/ (GitHub Pages project site)
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [react()],
})
