import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebase';
import api from './api';
import { validateEmail } from '@/utils/validators';

export const authService = {
  // Sign up with email and password
  signup: async (email, password) => {
    // Validate email domain
    const emailError = validateEmail(email);
    if (emailError) {
      throw new Error(emailError);
    }

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Send verification code (name will be collected during profile setup)
    await api.post('/api/auth/send-verification-code', {
      email,
    });

    return userCredential.user;
  },

  // Login with email and password
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Get Firebase token
    const token = await userCredential.user.getIdToken();

    // Verify with backend
    const { data } = await api.post('/api/auth/verify-token', { token });

    return data;
  },

  // Send verification code
  sendVerificationCode: async (email) => {
    await api.post('/api/auth/send-verification-code', { email });
  },

  // Verify email code
  verifyCode: async (email, code) => {
    const { data } = await api.post('/api/auth/verify-code', { email, code });
    return data;
  },

  // Complete profile setup
  completeProfile: async (profileData) => {
    const token = await auth.currentUser.getIdToken();
    const { data } = await api.post('/api/users/create-profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  // Send password reset code
  sendPasswordResetCode: async (email) => {
    await api.post('/api/auth/send-password-reset-code', { email });
  },

  // Verify password reset code
  verifyPasswordResetCode: async (email, code) => {
    const { data } = await api.post('/api/auth/verify-reset-code', { email, code });
    return data;
  },

  // Reset password with code
  resetPassword: async (email, newPassword) => {
    const { data } = await api.post('/api/auth/reset-password', { email, newPassword });
    return data;
  },

  // Get current user token
  getCurrentToken: async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  },
};