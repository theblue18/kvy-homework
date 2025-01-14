// vite.config.js
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: { open: true },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    mockReset: true,
  },
  build: {
    outDir: 'dist', // Vercel serves from this directory by default
  },
  
  
})
