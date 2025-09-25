import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LogoutPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      await signOut()
      navigate('/login', { replace: true })
    }
    run()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Signing out...</div>
    </div>
  )
}

