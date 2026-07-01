import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import scanHandler from './api/scan.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.GOOGLE_AI_API_KEY ||= env.GOOGLE_AI_API_KEY

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      {
        name: 'local-api-scan',
        configureServer(server) {
          server.middlewares.use('/api/scan', (request, response) => {
            scanHandler(request, response)
          })
        },
      },
    ],
  }
})
