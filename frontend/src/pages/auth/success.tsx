import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/AuthContext';
import Head from 'next/head';

const AuthSuccessPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const { token, error } = router.query;

    if (error) {
      console.error('OAuth error:', error);
      router.replace('/auth/login?error=auth_failed');
      return;
    }

    if (token && typeof token === 'string') {
      // Process the token
      login(token);
      
      // Get stored redirect URL or default to home
      const redirectUrl = localStorage.getItem('auth_redirect') || '/';
      localStorage.removeItem('auth_redirect'); // Clean up
      
      router.replace(redirectUrl);
    } else {
      // No token received
      router.replace('/auth/login?error=no_token');
    }
  }, [router.query, login, router]);

  return (
    <>
      <Head>
        <title>Authenticating... - Ergiva</title>
        <meta name="description" content="Processing authentication" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600">Ergiva</h1>
            <p className="text-sm text-gray-500 mt-1">Physiotherapy & Wellness</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Completing authentication...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we complete your sign-in process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthSuccessPage;
