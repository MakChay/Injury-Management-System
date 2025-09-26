import { useState, useCallback } from 'react'
import { logger } from '../lib/logger'
import { pushToast } from '../components/Toaster'

interface ErrorState {
  hasError: boolean
  error: Error | null
  retryCount: number
  lastRetryTime: number | null
}

interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
}

export function useErrorHandler(options: RetryOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true
  } = options

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    retryCount: 0,
    lastRetryTime: null
  })

  const handleError = useCallback((error: Error, context?: string) => {
    logger.error(`Error in ${context || 'unknown context'}:`, error)
    
    setErrorState(prev => ({
      hasError: true,
      error,
      retryCount: prev.retryCount + 1,
      lastRetryTime: Date.now()
    }))

    // Show user-friendly error message
    const errorMessage = getErrorMessage(error, context)
    pushToast({
      type: 'error',
      message: errorMessage,
      duration: 5000
    })
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
      lastRetryTime: null
    })
  }, [])

  const retry = useCallback(async (retryFn: () => Promise<void> | void) => {
    if (errorState.retryCount >= maxRetries) {
      pushToast({
        type: 'error',
        message: 'Maximum retry attempts reached. Please refresh the page or contact support.'
      })
      return
    }

    // Calculate delay with exponential backoff
    const delay = exponentialBackoff 
      ? retryDelay * Math.pow(2, errorState.retryCount)
      : retryDelay

    // Show retry message
    pushToast({
      type: 'info',
      message: `Retrying... (${errorState.retryCount + 1}/${maxRetries})`,
      duration: delay
    })

    // Wait for delay
    await new Promise(resolve => setTimeout(resolve, delay))

    try {
      clearError()
      await retryFn()
    } catch (error) {
      handleError(error as Error, 'retry operation')
    }
  }, [errorState.retryCount, maxRetries, retryDelay, exponentialBackoff, clearError, handleError])

  const canRetry = errorState.retryCount < maxRetries
  const isRetrying = errorState.lastRetryTime && (Date.now() - errorState.lastRetryTime) < 5000

  return {
    ...errorState,
    handleError,
    clearError,
    retry,
    canRetry,
    isRetrying
  }
}

function getErrorMessage(error: Error, context?: string): string {
  const errorMessage = error.message.toLowerCase()
  
  // Network errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'Network error. Please check your internet connection and try again.'
  }
  
  // Authentication errors
  if (errorMessage.includes('auth') || errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
    return 'Authentication error. Please log in again.'
  }
  
  // Permission errors
  if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
    return 'You don\'t have permission to perform this action.'
  }
  
  // Not found errors
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'The requested resource was not found.'
  }
  
  // Server errors
  if (errorMessage.includes('500') || errorMessage.includes('server error')) {
    return 'Server error. Please try again later or contact support.'
  }
  
  // Timeout errors
  if (errorMessage.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }
  
  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return 'Invalid data provided. Please check your input and try again.'
  }
  
  // Generic error with context
  return context 
    ? `Error in ${context}. Please try again.`
    : 'An unexpected error occurred. Please try again.'
}

export function useAsyncOperation<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  options?: {
    onSuccess?: (result: R) => void
    onError?: (error: Error) => void
    showSuccessToast?: boolean
    successMessage?: string
  }
) {
  const [loading, setLoading] = useState(false)
  const { handleError } = useErrorHandler()

  const execute = useCallback(async (...args: T) => {
    setLoading(true)
    try {
      const result = await operation(...args)
      options?.onSuccess?.(result)
      
      if (options?.showSuccessToast) {
        pushToast({
          type: 'success',
          message: options.successMessage || 'Operation completed successfully'
        })
      }
      
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      options?.onError?.(errorObj)
      handleError(errorObj, 'async operation')
      throw error
    } finally {
      setLoading(false)
    }
  }, [operation, options, handleError])

  return { execute, loading }
}