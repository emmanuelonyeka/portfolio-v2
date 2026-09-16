import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // This project is often reviewed from copied folders. Always clear stale
    // fingerprinted chunks so removed features cannot survive in `dist/`.
    emptyOutDir: true,
    // Keep even small visual textures cacheable instead of embedding random
    // noise as base64 inside render-blocking CSS.
    assetsInlineLimit: 1024,
  },
})
