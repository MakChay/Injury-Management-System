import { useEffect } from 'react'
import { logger } from '../../lib/logger'
import { useAuth } from '../../hooks/useAuth'
import { AuthLayout } from '../../components/Auth/AuthLayout'
import { RefreshCw } from 'lucide-react'

export function LogoutPage() {
  const { signOut } = useAuth()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut()
      } catch (error) {
        logger.error('Logout error:', error as Error)
      }
    }

    performLogout()
  }, [signOut])

  return (
    <AuthLayout title="Signing Out" subtitle="Please wait while we sign you out">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <p className="text-gray-600">
          You are being signed out of your account...
        </p>
        <p className="text-sm text-gray-500">
          You will be redirected to the login page shortly.
        </p>
      </div>
    </AuthLayout>
  )
}