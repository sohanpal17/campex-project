import { COLLEGE_EMAIL_DOMAIN, PASSWORD_MIN_LENGTH } from '@constants';

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  
  if (!email.endsWith(COLLEGE_EMAIL_DOMAIN)) {
    return `Email must be from ${COLLEGE_EMAIL_DOMAIN} domain`;
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'none', label: '', color: '' };
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Character variety
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  
  if (strength <= 2) {
    return { 
      strength: 'weak', 
      label: 'Weak', 
      color: 'bg-red-500',
      textColor: 'text-red-600'
    };
  } else if (strength <= 4) {
    return { 
      strength: 'medium', 
      label: 'Medium', 
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    };
  } else {
    return { 
      strength: 'strong', 
      label: 'Strong', 
      color: 'bg-green-500',
      textColor: 'text-green-600'
    };
  }
};

export const validateProductTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 10) return 'Title must be at least 10 characters';
  if (title.length > 100) return 'Title must not exceed 100 characters';
  return null;
};

export const validateProductDescription = (description) => {
  if (!description) return 'Description is required';
  if (description.length < 20) return 'Description must be at least 20 characters';
  if (description.length > 500) return 'Description must not exceed 500 characters';
  return null;
};

export const validatePrice = (price, isFree) => {
  if (isFree) return null;
  
  if (!price && price !== 0) return 'Price is required';
  
  const numPrice = Number(price);
  if (isNaN(numPrice)) return 'Price must be a number';
  if (numPrice < 0) return 'Price cannot be negative';
  if (numPrice === 0) return 'Price must be greater than 0 for non-free items';
  
  return null;
};