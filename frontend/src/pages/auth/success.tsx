import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';

const AuthSuccessPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const { token } = router.query;
        
        if (!token || typeof token !== 'string') {
          throw new Error('No authentication token received');
        }

        // Store the token in localStorage for persistence
        localStorage.setItem('auth_token', token);
        
        // Login the user with the token
        await login(token);
        
        // Get the redirect URL from localStorage (set during OAuth initiation)
        const redirectUrl = localStorage.getItem('auth_redirect') || '/';
        localStorage.removeItem('auth_redirect'); // Clean up
        
        // Redirect to the intended page
        router.push(redirectUrl);
        
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        toast.error('Authentication failed. Please try again.');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    // Only run when router is ready and query parameters are available
    if (router.isReady) {
      handleAuthSuccess();
    }
  }, [router.isReady, router.query, login, router]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Signing you in... - Ergiva</title>
          <meta name="description" content="Completing your Google sign-in" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-4xl font-bold">E</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Signing you in...</h1>
            <p className="text-gray-600 mb-8">Please wait while we complete your authentication.</p>
            
            {/* Loading spinner */}
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Authentication Failed - Ergiva</title>
          <meta name="description" content="Google sign-in failed" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center items-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-8">Redirecting to login page...</p>
            
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return null; // This should never render as we redirect in useEffect
};

export default AuthSuccessPage;
