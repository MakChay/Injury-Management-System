import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../../components/Auth/AuthLayout'

export function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const type = searchParams.get('type')
    
    if (!token || type !== 'signup') {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    // Simulate verification process
    const verifyEmail = async () => {
      try {
        // In a real app, you would call your API here
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate success for demo
        setStatus('success')
        setMessage('Your email has been successfully verified!')
      } catch (error) {
        setStatus('error')
        setMessage('Failed to verify email. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendVerification = async () => {
    setStatus('loading')
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setMessage('Verification email sent! Please check your inbox.')
    } catch (error) {
      setStatus('error')
      setMessage('Failed to send verification email. Please try again.')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
      case 'expired':
        return <AlertCircle className="w-8 h-8 text-red-600" />
      default:
        return <Mail className="w-8 h-8 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-100'
      case 'success':
        return 'bg-green-100'
      case 'error':
      case 'expired':
        return 'bg-red-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <AuthLayout title="Email Verification" subtitle="Verify your email address to continue">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto`}
        >
          {getStatusIcon()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium text-gray-900">
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {(status === 'error' || status === 'expired') && 'Verification Failed'}
          </h3>
          
          <p className="text-gray-600">
            {message}
          </p>

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-500">
                You can now access all features of the DUT Athletic Injury Management system.
              </p>
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Login
              </Link>
            </motion.div>
          )}

          {(status === 'error' || status === 'expired') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <button
                onClick={handleResendVerification}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </button>
              <div>
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AuthLayout>
  )
}