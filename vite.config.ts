import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'hls': ['hls.js'],
          'swiper': ['swiper'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/ophim-api': {
        target: 'https://ophim1.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ophim-api/, ''),
      },
      '/v1/api': {
        target: 'https://ophim1.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
