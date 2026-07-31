import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // Copy _redirects to build
    outDir: 'dist',
    emptyOutDir: true
  },
  // Move _redirects to dist
  publicDir: 'public'
})