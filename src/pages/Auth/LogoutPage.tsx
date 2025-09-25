import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LogoutPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Attempt to sign the user out
        await signOut();
      } catch (err) {
        console.error('Logout error:', err);
        setError('Failed to sign out. You will be redirected shortly.');
        // Wait 2 seconds to allow the user to see the error message
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        // Always redirect to the login page, whether sign-out succeeded or failed
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [signOut, navigate]); // Dependencies for the effect

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">DUT</span>
        </div>

        {/* Loading spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        
        <p className="text-gray-600 text-lg mb-2">
          Signing out...
        </p>
        
        {/* Display an error message if one occurs */}
        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}