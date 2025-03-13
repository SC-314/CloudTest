import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/counter': 'http://localhost:3000'
    }
  }
})