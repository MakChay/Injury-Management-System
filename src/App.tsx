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
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage'
import { VerifyEmailPage } from './pages/Auth/VerifyEmailPage'
//
import { TreatmentPlansPage } from './pages/Practitioner/TreatmentPlansPage'
import { SessionNotesPage } from './pages/Practitioner/SessionNotesPage'
import { TemplateBuilderPage } from './pages/Practitioner/TemplateBuilderPage'
import { ProfilePage } from './pages/Settings/ProfilePage'
import { OnboardingPage } from './pages/Student/OnboardingPage'
import { DailyCheckInPage } from './pages/Student/DailyCheckInPage'
import { RTPChecklistPage } from './pages/Student/RTPChecklistPage'
import { LearningHubPage } from './pages/Student/LearningHubPage'
import { useReminders } from './hooks/useReminders'
import { AnalyticsPage } from './pages/Admin/AnalyticsPage'
import { SystemStatusPage } from './pages/Admin/SystemStatusPage'

function App() {
  const { user, loading } = useAuth()
  useReminders()

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
          element={user ? <Navigate to="/login" replace /> : <LoginPage />}
        />
        {/* Auth aliases */}
        <Route
          path="/signin"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/sign-in"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />
        <Route
          path="/signup"
          element={<Navigate to="/register" replace />}
        />
        <Route
          path="/sign-up"
          element={<Navigate to="/register" replace />}
        />
        <Route
          path="/auth/login"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/auth/register"
          element={<Navigate to="/register" replace />}
        />

        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/signout" element={<Navigate to="/logout" replace />} />

        {/* Password reset & verification */}
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />
        <Route
          path="/auth/verify"
          element={<Navigate to="/verify-email" replace />}
        />

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
          path="/onboarding"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <OnboardingPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-checkin"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <DailyCheckInPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rtp-checklist"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <RTPChecklistPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-hub"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LearningHubPage />
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
        <Route
          path="/session-notes"
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <SessionNotesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/template-builder"
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <TemplateBuilderPage />
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
          path="/system-status"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <SystemStatusPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AnalyticsPage />
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