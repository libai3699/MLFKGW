import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getDataChunk(id) {
  const match = id.match(/[/\\]src[/\\]data[/\\](investor[^/\\]+\.json)/)
  if (!match) {
    return null
  }

  return `data-${match[1].replace('.json', '')}`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 8000,
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id) {
          const dataChunk = getDataChunk(id)
          if (dataChunk) {
            return dataChunk
          }

          if (id.includes('node_modules/react-dom')) {
            return 'vendor-react-dom'
          }

          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('node_modules/react/')) {
            return 'vendor-react'
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }

          return null
        },
      },
    },
  },
})
