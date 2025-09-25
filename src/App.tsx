import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// All components and hooks are defined within this single file for a self-contained application.

// A custom hook to manage authentication state.
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to check auth status
    setTimeout(() => {
      // For demonstration, user is initially null.
      // You can simulate a logged-in user by setting a value here.
      // setUser({ role: 'admin' });
      setLoading(false);
    }, 1000);
  }, []);

  // For demonstration purposes, we provide a way to change roles
  const loginAs = (role) => {
    setUser({ role });
  };
  const logout = () => {
    setUser(null);
  };

  return { user, loading, loginAs, logout };
};

// A hook for handling application reminders.
const useReminders = () => {
  useEffect(() => {
    console.log("Reminders hook initialized.");
  }, []);
};

// The main application layout component.
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getRole = () => {
    if (!user) return 'Guest';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sidebar for Navigation */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Nav</h1>
        <ul className="space-y-2">
          {user && (
            <>
              <li><a href="/dashboard" className={`block px-4 py-2 rounded-lg ${location.pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Dashboard</a></li>
              {user.role === 'student' && (
                <>
                  <li><a href="/report-injury" className={`block px-4 py-2 rounded-lg ${location.pathname === '/report-injury' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Report Injury</a></li>
                  <li><a href="/my-injuries" className={`block px-4 py-2 rounded-lg ${location.pathname === '/my-injuries' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>My Injuries</a></li>
                  <li><a href="/onboarding" className={`block px-4 py-2 rounded-lg ${location.pathname === '/onboarding' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Onboarding</a></li>
                  <li><a href="/daily-checkin" className={`block px-4 py-2 rounded-lg ${location.pathname === '/daily-checkin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Daily Check-In</a></li>
                  <li><a href="/rtp-checklist" className={`block px-4 py-2 rounded-lg ${location.pathname === '/rtp-checklist' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>RTP Checklist</a></li>
                  <li><a href="/learning-hub" className={`block px-4 py-2 rounded-lg ${location.pathname === '/learning-hub' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Learning Hub</a></li>
                  <li><a href="/recovery-plans" className={`block px-4 py-2 rounded-lg ${location.pathname === '/recovery-plans' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Recovery Plans</a></li>
                </>
              )}
              {user.role === 'practitioner' && (
                <>
                  <li><a href="/assigned-athletes" className={`block px-4 py-2 rounded-lg ${location.pathname === '/assigned-athletes' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Assigned Athletes</a></li>
                  <li><a href="/recovery-logs" className={`block px-4 py-2 rounded-lg ${location.pathname === '/recovery-logs' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Recovery Logs</a></li>
                  <li><a href="/session-notes" className={`block px-4 py-2 rounded-lg ${location.pathname === '/session-notes' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Session Notes</a></li>
                  <li><a href="/template-builder" className={`block px-4 py-2 rounded-lg ${location.pathname === '/template-builder' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Template Builder</a></li>
                  <li><a href="/treatment-plans" className={`block px-4 py-2 rounded-lg ${location.pathname === '/treatment-plans' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Treatment Plans</a></li>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <li><a href="/manage-users" className={`block px-4 py-2 rounded-lg ${location.pathname === '/manage-users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Manage Users</a></li>
                  <li><a href="/assign-practitioners" className={`block px-4 py-2 rounded-lg ${location.pathname === '/assign-practitioners' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Assign Practitioners</a></li>
                  <li><a href="/analytics" className={`block px-4 py-2 rounded-lg ${location.pathname === '/analytics' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Analytics</a></li>
                  <li><a href="/system-status" className={`block px-4 py-2 rounded-lg ${location.pathname === '/system-status' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>System Status</a></li>
                </>
              )}
              <li><a href="/appointments" className={`block px-4 py-2 rounded-lg ${location.pathname === '/appointments' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Appointments</a></li>
              <li><a href="/messages" className={`block px-4 py-2 rounded-lg ${location.pathname === '/messages' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Messages</a></li>
              <li><a href="/files" className={`block px-4 py-2 rounded-lg ${location.pathname === '/files' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Files</a></li>
              <li><a href="/settings" className={`block px-4 py-2 rounded-lg ${location.pathname === '/settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Profile Settings</a></li>
            </>
          )}
        </ul>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, {getRole()}</h2>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Login
            </a>
          )}
        </header>
        <main className="bg-white rounded-xl p-6 shadow-md min-h-[calc(100vh-14rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

// A wrapper that protects routes based on authentication and role.
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-6 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout for authentication pages.
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{title}</h1>
      <p className="text-center text-gray-600 mb-6">{subtitle}</p>
      {children}
    </div>
  </div>
);

// Form for user registration.
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginAs } = useAuth(); // Assuming registration leads to login

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering with:', { email, password });
    // Simulate successful registration and login
    loginAs('student'); // Default role for new users
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Sign Up
      </button>
      <div className="text-center mt-4">
        <a href="/LoginForm" className="text-sm text-blue-500 hover:underline">Already have an account? Sign In</a>
      </div>
    </form>
  );
};

// PAGE COMPONENTS
const LoginPage = () => {
  const { loginAs } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <p className="text-center text-gray-600 mb-4">Select a role to log in as:</p>
        <div className="flex flex-col space-y-4">
          <button onClick={() => loginAs('student')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Log in as Student</button>
          <button onClick={() => loginAs('practitioner')} className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">Log in as Practitioner</button>
          <button onClick={() => loginAs('admin')} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">Log in as Admin</button>
        </div>
        <div className="text-center mt-6">
          <a href="/RegisterForm" className="text-blue-500 hover:underline">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  );
};
const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the DUT Athletic Injury Management system"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
const LogoutPage = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <div className="min-h-screen flex items-center justify-center"><h1>Logging out...</h1></div>;
};
const ForgotPasswordPage = () => <div className="p-8"><h1>Forgot Password Page</h1><p>Placeholder for password reset form.</p></div>;
const ResetPasswordPage = () => <div className="p-8"><h1>Reset Password Page</h1><p>Placeholder for new password form.</p></div>;
const VerifyEmailPage = () => <div className="p-8"><h1>Verify Email Page</h1><p>Placeholder for email verification message.</p></div>;
const DashboardPage = () => <div className="p-8"><h1>Dashboard Page</h1><p>Welcome to the main dashboard.</p></div>;
const ReportInjuryPage = () => <div className="p-8"><h1>Report Injury Page</h1><p>Placeholder for injury report form.</p></div>;
const MyInjuriesPage = () => <div className="p-8"><h1>My Injuries Page</h1><p>Placeholder for a list of my injuries.</p></div>;
const AssignedAthletesPage = () => <div className="p-8"><h1>Assigned Athletes Page</h1><p>Placeholder for a list of assigned athletes.</p></div>;
const ManageUsersPage = () => <div className="p-8"><h1>Manage Users Page</h1><p>Placeholder for user management interface.</p></div>;
const AppointmentsPage = () => <div className="p-8"><h1>Appointments Page</h1><p>Placeholder for appointments calendar.</p></div>;
const MessagesPage = () => <div className="p-8"><h1>Messages Page</h1><p>Placeholder for messaging system.</p></div>;
const FilesPage = () => <div className="p-8"><h1>Files Page</h1><p>Placeholder for file management.</p></div>;
const RecoveryLogsPage = () => <div className="p-8"><h1>Recovery Logs Page</h1><p>Placeholder for recovery logs.</p></div>;
const AssignPractitionersPage = () => <div className="p-8"><h1>Assign Practitioners Page</h1><p>Placeholder for assigning practitioners.</p></div>;
const TreatmentPlansPage = () => <div className="p-8"><h1>Treatment Plans Page</h1><p>Placeholder for treatment plans.</p></div>;
const SessionNotesPage = () => <div className="p-8"><h1>Session Notes Page</h1><p>Placeholder for session notes.</p></div>;
const TemplateBuilderPage = () => <div className="p-8"><h1>Template Builder Page</h1><p>Placeholder for template builder.</p></div>;
const ProfilePage = () => <div className="p-8"><h1>Profile Settings Page</h1><p>Placeholder for user profile settings.</p></div>;
const OnboardingPage = () => <div className="p-8"><h1>Onboarding Page</h1><p>Placeholder for student onboarding.</p></div>;
const DailyCheckInPage = () => <div className="p-8"><h1>Daily Check-In Page</h1><p>Placeholder for daily check-in form.</p></div>;
const RTPChecklistPage = () => <div className="p-8"><h1>RTP Checklist Page</h1><p>Placeholder for Return to Play checklist.</p></div>;
const LearningHubPage = () => <div className="p-8"><h1>Learning Hub Page</h1><p>Placeholder for learning resources.</p></div>;
const AnalyticsPage = () => <div className="p-8"><h1>Analytics Page</h1><p>Placeholder for system analytics.</p></div>;
const SystemStatusPage = () => <div className="p-8"><h1>System Status Page</h1><p>Placeholder for system status and health.</p></div>;
const RecoveryPlansPage = () => <div className="p-8"><h1>Recovery Plans Page</h1><p>Placeholder for student recovery plans.</p></div>;


// Main App Component
function App() {
  const { user, loading } = useAuth();
  useReminders();

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
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
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
        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
        
        {/* Student-specific routes */}
        <Route path="/report-injury" element={<ProtectedRoute requiredRole="student"><Layout><ReportInjuryPage /></Layout></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute requiredRole="student"><Layout><OnboardingPage /></Layout></ProtectedRoute>} />
        <Route path="/daily-checkin" element={<ProtectedRoute requiredRole="student"><Layout><DailyCheckInPage /></Layout></ProtectedRoute>} />
        <Route path="/rtp-checklist" element={<ProtectedRoute requiredRole="student"><Layout><RTPChecklistPage /></Layout></ProtectedRoute>} />
        <Route path="/learning-hub" element={<ProtectedRoute requiredRole="student"><Layout><LearningHubPage /></Layout></ProtectedRoute>} />
        <Route path="/my-injuries" element={<ProtectedRoute requiredRole="student"><Layout><MyInjuriesPage /></Layout></ProtectedRoute>} />
        <Route path="/recovery-plans" element={<ProtectedRoute requiredRole="student"><Layout><RecoveryPlansPage /></Layout></ProtectedRoute>} />
        
        {/* Practitioner-specific routes */}
        <Route path="/assigned-athletes" element={<ProtectedRoute requiredRole="practitioner"><Layout><AssignedAthletesPage /></Layout></ProtectedRoute>} />
        <Route path="/recovery-logs" element={<ProtectedRoute requiredRole="practitioner"><Layout><RecoveryLogsPage /></Layout></ProtectedRoute>} />
        <Route path="/session-notes" element={<ProtectedRoute requiredRole="practitioner"><Layout><SessionNotesPage /></Layout></ProtectedRoute>} />
        <Route path="/template-builder" element={<ProtectedRoute requiredRole="practitioner"><Layout><TemplateBuilderPage /></Layout></ProtectedRoute>} />
        <Route path="/treatment-plans" element={<ProtectedRoute requiredRole="practitioner"><Layout><TreatmentPlansPage /></Layout></ProtectedRoute>} />
        
        {/* Admin-specific routes */}
        <Route path="/manage-users" element={<ProtectedRoute requiredRole="admin"><Layout><ManageUsersPage /></Layout></ProtectedRoute>} />
        <Route path="/assign-practitioners" element={<ProtectedRoute requiredRole="admin"><Layout><AssignPractitionersPage /></Layout></ProtectedRoute>} />
        <Route path="/system-status" element={<ProtectedRoute requiredRole="admin"><Layout><SystemStatusPage /></Layout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute requiredRole="admin"><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />

        {/* Shared/General protected routes */}
        <Route path="/appointments" element={<ProtectedRoute><Layout><AppointmentsPage /></Layout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Layout><MessagesPage /></Layout></ProtectedRoute>} />
        <Route path="/files" element={<ProtectedRoute><Layout><FilesPage /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
