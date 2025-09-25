import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ReportInjuryPage } from './pages/Student/ReportInjuryPage'
import { MyInjuriesPage } from './pages/Student/MyInjuriesPage'
import { AssignedAthletesPage } from './pages/Practitioner/AssignedAthletesPage'
import { ManageUsersPage } from './pages/Admin/ManageUsersPage'
import { AppointmentsPage } from './pages/Shared/AppointmentsPage'
import { MessagesPage } from './pages/Shared/MessagesPage'
import { FilesPage } from './pages/Shared/FilesPage'
import { RecoveryLogsPage } from './pages/Practitioner/RecoveryLogsPage'
import { AssignPractitionersPage } from './pages/Admin/AssignPractitionersPage'
import { LogoutPage } from './pages/Auth/LogoutPage'
//
import { TreatmentPlansPage } from './pages/Practitioner/TreatmentPlansPage'
import { ProfilePage } from './pages/Settings/ProfilePage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">DUT</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-6 text-lg">Loading DUT Athletic Injury Management...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        <Route path="/logout" element={<LogoutPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/report-injury"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <ReportInjuryPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-injuries"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <MyInjuriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Practitioner routes */}
        <Route
          path="/assigned-athletes"
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <AssignedAthletesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recovery-logs"
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <RecoveryLogsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ManageUsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign-practitioners"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AssignPractitionersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Analytics</h1>
                  <p className="text-gray-600">Feature coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Shared routes */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <AppointmentsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Layout>
                <MessagesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <Layout>
                <FilesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/treatment-plans"
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <TreatmentPlansPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App