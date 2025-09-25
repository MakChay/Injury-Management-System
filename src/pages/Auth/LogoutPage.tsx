import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LogoutPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        await signOut()
        navigate('/login', { replace: true })
      } catch (err) {
        console.error('Logout error:', err)
        setError('Failed to sign out. Redirecting to login...')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg mb-2">Signing out...</p>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </div>
    </div>
  )
}

