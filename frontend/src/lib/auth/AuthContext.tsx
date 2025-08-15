import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import type { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const token = Cookies.get('auth_token');
    
    if (token) {
      // Validate token and get user profile
      validateAndGetUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle successful auth from Google OAuth callback
  useEffect(() => {
    if (router.asPath.includes('/auth/success')) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        login(token);
        router.replace('/');
      } else {
        toast.error('Authentication failed');
        router.replace('/');
      }
    }
  }, [router.asPath]);

  const validateAndGetUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      // Token is invalid or expired
      Cookies.remove('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    // Store token in cookie (expires in 24 hours)
    Cookies.set('auth_token', token, { 
      expires: 1, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Get user profile
    validateAndGetUser();
    
    toast.success('Successfully logged in!');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore logout API errors
    } finally {
      // Clear auth state
      Cookies.remove('auth_token');
      setUser(null);
      
      // Redirect to home page
      router.push('/');
      
      toast.success('Successfully logged out!');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};