import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { auth } from '@/services/firebase';
import api from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - clear cache to fetch fresh data
        queryClient.clear();
        setUser(firebaseUser);

        // Fetch user profile from backend
        try {
          const { data } = await api.get('/api/users/me');
          // Backend returns ApiResponse wrapper, extract the actual data
          setUserProfile(data?.data || data);
        } catch (error) {
          // 422 means profile not created yet - this is expected for new users
          // Network errors mean backend is not running - don't log as error
          const errorMessage = error?.message || error?.data?.message || '';
          if (
            error?.response?.status === 422 ||
            errorMessage.includes('Network error') ||
            errorMessage.includes('User profile not created') ||
            errorMessage.includes('not created')
          ) {
            // Silently handle - user will be redirected to profile setup if needed
            setUserProfile(null);
          } else {
            console.error('Error fetching user profile:', error);
            setUserProfile(null);
          }
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Clear all React Query cache before signing out
      queryClient.clear();
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    try {
      const { data } = await api.get('/api/users/me');
      // Backend returns ApiResponse wrapper, extract the actual data
      const profile = data?.data || data;
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    refreshUserProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};