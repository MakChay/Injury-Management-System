import { useAuth } from '../hooks/useAuth'
import { StudentDashboard } from '../components/Dashboard/StudentDashboard'
import { PractitionerDashboard } from '../components/Dashboard/PractitionerDashboard'
import { AdminDashboard } from '../components/Dashboard/AdminDashboard'

export function DashboardPage() {
  const { profile } = useAuth()

  if (!profile) return null

  switch (profile.role) {
    case 'student':
      return <StudentDashboard />
    case 'practitioner':
      return <PractitionerDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <div>Invalid role</div>
  }
}