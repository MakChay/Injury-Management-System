import { useState, useCallback } from 'react'
import { pushToast } from '../components/Toaster'

interface ErrorState {
  hasError: boolean
  error: Error | null
  retryCount: number
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    retryCount: 0
  })

  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error)
    
    setErrorState(prev => ({
      hasError: true,
      error,
      retryCount: prev.retryCount + 1
    }))

    // Show user-friendly error message
    const errorMessage = getErrorMessage(error)
    pushToast({
      type: 'error',
      message: errorMessage
    })
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0
    })
  }, [])

  const retry = useCallback((retryFn: () => Promise<void>) => {
    clearError()
    retryFn().catch((error) => handleError(error, 'retry'))
  }, [clearError, handleError])

  return {
    ...errorState,
    handleError,
    clearError,
    retry
  }
}

function getErrorMessage(error: Error): string {
  // Network errors
  if (error.message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.'
  }
  
  // Authentication errors
  if (error.message.includes('auth') || error.message.includes('unauthorized')) {
    return 'Your session has expired. Please log in again.'
  }
  
  // Permission errors
  if (error.message.includes('permission') || error.message.includes('forbidden')) {
    return 'You don\'t have permission to perform this action.'
  }
  
  // Validation errors
  if (error.message.includes('validation') || error.message.includes('invalid')) {
    return 'Please check your input and try again.'
  }
  
  // Generic error
  return 'Something went wrong. Please try again.'
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