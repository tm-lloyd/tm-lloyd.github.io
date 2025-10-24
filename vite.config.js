import { defineConfig } from 'vite'

export default defineConfig({
  root: 'docs',
  publicDir: '../public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
