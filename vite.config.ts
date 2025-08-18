import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ssb-api': {
        target: 'https://data.ssb.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ssb-api/, ''),
      },
    },
  },
})
