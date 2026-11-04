import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// "base" relative : le site fonctionne aussi bien sous https://nilsprofgrenoble.github.io/energy-at-school/
// que sous un nom de domaine propre (https://energy.paillasse-virtuelle.fr/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
