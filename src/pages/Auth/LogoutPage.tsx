import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LogoutPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-6 text-lg">
          {isSigningOut ? 'Signing out...' : 'Redirecting to login...'}
        </p>
      </div>
    </div>
  )
}

