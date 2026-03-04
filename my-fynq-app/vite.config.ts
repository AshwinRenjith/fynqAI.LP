import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Code-split heavy 3D libraries into their own chunk
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Split GSAP into its own chunk
          'gsap-vendor': ['gsap'],
        }
      }
    }
  }
})
