import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LogoutPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
 cursor/fix-login-redirect-and-logout-page-9b99
  const [isSigningOut, setIsSigningOut] = useState(true)

  const [error, setError] = useState<string | null>(null)
 main

  useEffect(() => {
    const run = async () => {
      try {
 cursor/fix-login-redirect-and-logout-page-9b99
        setIsSigningOut(true)
        await signOut()
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100))
        navigate('/login', { replace: true })
      } catch (error) {
        console.error('Logout error:', error)
        // Even if there's an error, redirect to login
        navigate('/login', { replace: true })
      } finally {
        setIsSigningOut(false)

        await signOut()
        navigate('/login', { replace: true })
      } catch (err) {
        console.error('Logout error:', err)
        setError('Failed to sign out. Redirecting to login...')
        // Still redirect to login even if signOut fails
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
 main
      }
    }
    run()
  }, [signOut, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">DUT</span>
        </div>
 cursor/fix-login-redirect-and-logout-page-9b99
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-6 text-lg">
          {isSigningOut ? 'Signing out...' : 'Redirecting to login...'}
        </p>

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg mb-2">Signing out...</p>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
 main
      </div>
    </div>
  )
}

