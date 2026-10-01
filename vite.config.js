import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// "base" doit correspondre au nom du dépôt GitHub : https://nilsprofgrenoble.github.io/energy-at-school/
export default defineConfig({
  plugins: [react()],
  base: '/energy-at-school/',
})
