import { AuthLayout } from '../../components/Auth/AuthLayout'
import { RegisterForm } from '../../components/Auth/RegisterForm'

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the DUT Athletic Injury Management system"
    >
      <RegisterForm />
    </AuthLayout>
  )
}