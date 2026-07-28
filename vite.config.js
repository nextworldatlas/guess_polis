import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served at the root of guesspolis.nextworldatlas.com, not under a subpath.
  base: '/',
  plugins: [react()],
})
