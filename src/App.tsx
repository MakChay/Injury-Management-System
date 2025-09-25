import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useReminders } from './hooks/useReminders'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthLayout } from './components/Auth/AuthLayout'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLoading } from './components/LoadingSpinner'

// Page imports
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage'
import { VerifyEmailPage } from './pages/Auth/VerifyEmailPage'
import { LogoutPage } from './pages/Auth/LogoutPage'

// Student pages
import { ReportInjuryPage } from './pages/Student/ReportInjuryPage'
import { MyInjuriesPage } from './pages/Student/MyInjuriesPage'
import { OnboardingPage } from './pages/Student/OnboardingPage'
import { DailyCheckInPage } from './pages/Student/DailyCheckInPage'
import { RTPChecklistPage } from './pages/Student/RTPChecklistPage'
import { LearningHubPage } from './pages/Student/LearningHubPage'
import { RecoveryPlansPage } from './pages/Student/RecoveryPlansPage'

// Practitioner pages
import { AssignedAthletesPage } from './pages/Practitioner/AssignedAthletesPage'
import { RecoveryLogsPage } from './pages/Practitioner/RecoveryLogsPage'
import { SessionNotesPage } from './pages/Practitioner/SessionNotesPage'
import { TemplateBuilderPage } from './pages/Practitioner/TemplateBuilderPage'
import { TreatmentPlansPage } from './pages/Practitioner/TreatmentPlansPage'

// Admin pages
import { ManageUsersPage } from './pages/Admin/ManageUsersPage'
import { AssignPractitionersPage } from './pages/Admin/AssignPractitionersPage'
import { AnalyticsPage } from './pages/Admin/AnalyticsPage'
import { SystemStatusPage } from './pages/Admin/SystemStatusPage'

// Shared pages
import { AppointmentsPage } from './pages/Shared/AppointmentsPage'
import { MessagesPage } from './pages/Shared/MessagesPage'
import { FilesPage } from './pages/Shared/FilesPage'
import { ProfilePage } from './pages/Settings/ProfilePage'

// Loading component
const LoadingScreen = () => <PageLoading />

function App() {
  const { user, loading } = useAuth()
  useReminders()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout title="Sign In" subtitle="Welcome back to DUT Athletic Injury Management">
                <LoginForm />
              </AuthLayout>
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
            <AuthLayout title="Get Started" subtitle="Create your account to access DUT Athletic Injury Management">
              <RegisterForm />
            </AuthLayout>
            )
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPasswordPage />
            )
          } 
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Auth aliases */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/sign-in" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/sign-up" element={<Navigate to="/register" replace />} />
        <Route path="/auth/login" element={<Navigate to="/login" replace />} />
        <Route path="/auth/register" element={<Navigate to="/register" replace />} />
        <Route path="/signout" element={<Navigate to="/logout" replace />} />
        <Route path="/auth/verify" element={<Navigate to="/verify-email" replace />} />

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
        
        {/* Student-specific routes */}
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
          path="/recovery-plans" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <RecoveryPlansPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Practitioner-specific routes */}
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
        
        {/* Admin-specific routes */}
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
                <AnalyticsPage />
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

        {/* Shared/General protected routes */}
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
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/register"} replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/register"} replace />} 
        />
      </Routes>
    </Router>
    </ErrorBoundary>
  )
}

export default App