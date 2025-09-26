import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface RetryButtonProps {
  onRetry: () => void
  canRetry: boolean
  isRetrying: boolean
  error?: Error | null
  className?: string
}

export function RetryButton({ 
  onRetry, 
  canRetry, 
  isRetrying, 
  error,
  className = '' 
}: RetryButtonProps) {
  if (!error && !canRetry) return null

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRetry}
      disabled={!canRetry || isRetrying}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
        transition-colors duration-200
        ${canRetry && !isRetrying
          ? 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }
        ${className}
      `}
    >
      {isRetrying ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Retrying...</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4" />
          <span>Retry</span>
        </>
      )}
    </motion.button>
  )
}