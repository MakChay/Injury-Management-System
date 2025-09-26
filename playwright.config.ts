import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_FORCE_REGISTER_FIRST: 'true'
    }
  },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  testDir: 'tests',
})

