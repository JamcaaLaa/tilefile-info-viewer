import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tilefile-info-viewer/',
  build: {
    sourcemap: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
})