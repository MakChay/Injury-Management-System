import { AuthLayout } from '../../components/Auth/AuthLayout'
import { LoginForm } from '../../components/Auth/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout
      title="Sign In"
      subtitle="Access your DUT Athletic Injury Management account"
    >
      <LoginForm />
    </AuthLayout>
  )
}