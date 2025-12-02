import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000')
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: false,
    hmr: {
      clientPort: process.env.PORT || 5173
    }
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: false,
    allowedHosts: [
      '.railway.app',
      '.up.railway.app',
      'pysparkkundenanalysedashboard-production.up.railway.app'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: './index.html'
    }
  }
})
