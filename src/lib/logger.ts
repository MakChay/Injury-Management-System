/**
 * Production-safe logging utility
 * Only logs in development mode or when explicitly enabled
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isLoggingEnabled = isDevelopment || process.env.VITE_ENABLE_LOGGING === 'true'

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (isLoggingEnabled) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (isLoggingEnabled) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isLoggingEnabled) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },
  
  error: (message: string, error?: Error, ...args: any[]) => {
    // Always log errors in production for monitoring
    console.error(`[ERROR] ${message}`, error, ...args)
  }
}

export default logger