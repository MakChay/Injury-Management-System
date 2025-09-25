import { useState } from 'react'
import { AuthLayout } from '../../components/Auth/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import { Mail } from 'lucide-react'
import { pushToast } from '../../components/Toaster'

export function ForgotPasswordPage() {
  const { requestPasswordReset, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await requestPasswordReset(email)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
      pushToast({ type: 'success', message: 'Reset link sent. Check your email.' })
    }
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="We'll send you a password reset link">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {sent ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            If an account exists for {email}, you'll receive a reset link shortly.
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@dut.ac.za"
              />
            </div>
          </div>
        )}
        {!sent && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        )}
      </form>
    </AuthLayout>
  )
}

