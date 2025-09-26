import { AuthLayout } from '../../components/Auth/AuthLayout'
import { LoginForm } from '../../components/Auth/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to DUT Athletic Injury Management">
      <LoginForm />
    </AuthLayout>
  )
}