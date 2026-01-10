import { formatDistanceToNow, format } from 'date-fns';
import { parseISO } from 'date-fns';

export const formatPrice = (price) => {
  if (!price && price !== 0) return '₹0';
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

// Parse date string and ensure it's treated as UTC if it has no timezone info
const parseDate = (date) => {
  if (!date) return null;
  
  try {
    if (typeof date === 'string') {
      // If the date string ends with 'Z' or has timezone info, Date will parse it correctly as UTC
      // If it's a LocalDateTime without timezone (from backend), treat it as UTC
      if (!date.includes('Z') && !date.includes('+') && !date.includes('-', 10)) {
        // Assume it's UTC if no timezone indicator is present
        // This handles the case where backend sends "2024-01-01T10:00:00"
        return parseISO(date + 'Z');
      }
      return parseISO(date);
    }
    return date instanceof Date ? date : new Date(date);
  } catch (error) {
    console.error('Error parsing date:', date, error);
    return null;
  }
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = parseDate(date);
    if (!dateObj) return '';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return '';
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = parseDate(date);
    if (!dateObj) return '';
    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = parseDate(date);
    if (!dateObj) return '';
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
};

export const maskEmail = (email) => {
  if (!email) return '';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};