// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/face-controller/',
  server: {
    allowedHosts: [
      '.trycloudflare.com',
    ],
  },
})
