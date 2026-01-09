import toast from 'react-hot-toast';

export const handleError = (error, customMessage = null) => {
  // Log error only if it's not a user-facing auth error
  const isAuthError = error?.code?.startsWith('auth/');
  if (!isAuthError) {
    console.error('Error:', error);
  }

  let message;

  // If a custom message is provided, use it (don't override it!)
  if (customMessage) {
    message = customMessage;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  } else {
    message = 'Something went wrong';
  }

  toast.error(message);
  return message;
};

export const handleSuccess = (message = 'Success!') => {
  toast.success(message);
};

export const handleInfo = (message) => {
  toast(message, { icon: 'ℹ️' });
};