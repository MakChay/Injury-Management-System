import { useLocation, Link } from 'react-router-dom'
import { AuthLayout } from '../../components/Auth/AuthLayout'

export function VerifyEmailPage() {
  const location = useLocation() as any
  const email = location?.state?.email
  return (
    <AuthLayout title="Verify your email" subtitle="We sent a confirmation link to your inbox">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          {email ? (
            <span>Check {email} for a verification link to activate your account.</span>
          ) : (
            <span>Check your email for a verification link to activate your account.</span>
          )}
        </p>
        <p>
          After verifying, you can <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">sign in</Link>.
        </p>
      </div>
    </AuthLayout>
  )
}

