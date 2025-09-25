import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAuth } from './hooks/useAuth'
import { useReminders } from './hooks/useReminders'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthLayout } from './components/Auth/AuthLayout'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLoading } from './components/LoadingSpinner'

// Lazy load page components
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const LoginPage = lazy(() => import('./pages/Auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))
const VerifyEmailPage = lazy(() => import('./pages/Auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })))
const LogoutPage = lazy(() => import('./pages/Auth/LogoutPage').then(m => ({ default: m.LogoutPage })))

// Student pages
const ReportInjuryPage = lazy(() => import('./pages/Student/ReportInjuryPage').then(m => ({ default: m.ReportInjuryPage })))
const MyInjuriesPage = lazy(() => import('./pages/Student/MyInjuriesPage').then(m => ({ default: m.MyInjuriesPage })))
const OnboardingPage = lazy(() => import('./pages/Student/OnboardingPage').then(m => ({ default: m.OnboardingPage })))
const DailyCheckInPage = lazy(() => import('./pages/Student/DailyCheckInPage').then(m => ({ default: m.DailyCheckInPage })))
const RTPChecklistPage = lazy(() => import('./pages/Student/RTPChecklistPage').then(m => ({ default: m.RTPChecklistPage })))
const LearningHubPage = lazy(() => import('./pages/Student/LearningHubPage').then(m => ({ default: m.LearningHubPage })))
const RecoveryPlansPage = lazy(() => import('./pages/Student/RecoveryPlansPage').then(m => ({ default: m.RecoveryPlansPage })))

// Practitioner pages
const AssignedAthletesPage = lazy(() => import('./pages/Practitioner/AssignedAthletesPage').then(m => ({ default: m.AssignedAthletesPage })))
const RecoveryLogsPage = lazy(() => import('./pages/Practitioner/RecoveryLogsPage').then(m => ({ default: m.RecoveryLogsPage })))
const SessionNotesPage = lazy(() => import('./pages/Practitioner/SessionNotesPage').then(m => ({ default: m.SessionNotesPage })))
const TemplateBuilderPage = lazy(() => import('./pages/Practitioner/TemplateBuilderPage').then(m => ({ default: m.TemplateBuilderPage })))
const TreatmentPlansPage = lazy(() => import('./pages/Practitioner/TreatmentPlansPage').then(m => ({ default: m.TreatmentPlansPage })))

// Admin pages
const ManageUsersPage = lazy(() => import('./pages/Admin/ManageUsersPage').then(m => ({ default: m.ManageUsersPage })))
const AssignPractitionersPage = lazy(() => import('./pages/Admin/AssignPractitionersPage').then(m => ({ default: m.AssignPractitionersPage })))
const AnalyticsPage = lazy(() => import('./pages/Admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const SystemStatusPage = lazy(() => import('./pages/Admin/SystemStatusPage').then(m => ({ default: m.SystemStatusPage })))

// Shared pages
const AppointmentsPage = lazy(() => import('./pages/Shared/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })))
const MessagesPage = lazy(() => import('./pages/Shared/MessagesPage').then(m => ({ default: m.MessagesPage })))
const FilesPage = lazy(() => import('./pages/Shared/FilesPage').then(m => ({ default: m.FilesPage })))
const ProfilePage = lazy(() => import('./pages/Settings/ProfilePage').then(m => ({ default: m.ProfilePage })))

// Loading component
const LoadingScreen = () => <PageLoading />

// Wrapper for lazy-loaded components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>
    {children}
  </Suspense>
)

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
              <LazyWrapper>
                <ForgotPasswordPage />
              </LazyWrapper>
            )
          } 
        />
        <Route path="/reset-password" element={<LazyWrapper><ResetPasswordPage /></LazyWrapper>} />
        <Route path="/verify-email" element={<LazyWrapper><VerifyEmailPage /></LazyWrapper>} />
        <Route path="/logout" element={<LazyWrapper><LogoutPage /></LazyWrapper>} />

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
                <LazyWrapper>
                  <DashboardPage />
                </LazyWrapper>
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
                <LazyWrapper>
                  <ReportInjuryPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-injuries" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LazyWrapper>
                  <MyInjuriesPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LazyWrapper>
                  <OnboardingPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/daily-checkin" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LazyWrapper>
                  <DailyCheckInPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rtp-checklist" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LazyWrapper>
                  <RTPChecklistPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/learning-hub" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LazyWrapper>
                  <LearningHubPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recovery-plans" 
          element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <LazyWrapper>
                  <RecoveryPlansPage />
                </LazyWrapper>
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
                <LazyWrapper>
                  <AssignedAthletesPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recovery-logs" 
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <LazyWrapper>
                  <RecoveryLogsPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/session-notes" 
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <LazyWrapper>
                  <SessionNotesPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/template-builder" 
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <LazyWrapper>
                  <TemplateBuilderPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/treatment-plans" 
          element={
            <ProtectedRoute requiredRole="practitioner">
              <Layout>
                <LazyWrapper>
                  <TreatmentPlansPage />
                </LazyWrapper>
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
                <LazyWrapper>
                  <ManageUsersPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assign-practitioners" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <LazyWrapper>
                  <AssignPractitionersPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <LazyWrapper>
                  <AnalyticsPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/system-status" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <LazyWrapper>
                  <SystemStatusPage />
                </LazyWrapper>
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
                <LazyWrapper>
                  <AppointmentsPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Layout>
                <LazyWrapper>
                  <MessagesPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/files" 
          element={
            <ProtectedRoute>
              <Layout>
                <LazyWrapper>
                  <FilesPage />
                </LazyWrapper>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <LazyWrapper>
                  <ProfilePage />
                </LazyWrapper>
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