import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` makes the built site work from any GitHub Pages repo URL,
// including https://USERNAME.github.io/REPO-NAME/ without editing this file.
export default defineConfig({
  plugins: [react()],
  base: './',
})
