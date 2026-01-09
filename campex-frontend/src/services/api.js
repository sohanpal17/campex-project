import axios from 'axios';
import { auth } from './firebase';

// Use environment variable for API URL in production, fallback to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 422:
          // Unprocessable Entity - User profile not created or validation error
          // Don't log as error for profile-related endpoints, it's expected for new users
          const requestUrl = error.config?.url || '';
          if (requestUrl.includes('/users/me') || requestUrl.includes('/notifications')) {
            // Silently handle - user needs to complete profile setup
            break;
          }
          console.error('API Error:', data?.message || 'Validation error');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Something went wrong');
      }

      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response - backend might not be running
      // Don't log as error in development, it's expected if backend is stopped
      if (import.meta.env.PROD) {
        console.error('Network error - No response from server');
      }
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;