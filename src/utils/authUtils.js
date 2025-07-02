import { toast } from 'react-toastify';

/**
 * Secure logout function that clears all sensitive data
 * @param {Function} navigate - React Router navigate function
 * @param {boolean} showToast - Whether to show logout success toast
 * @param {boolean} shouldReload - Whether to reload the page (default: true)
 */
export const secureLogout = (navigate, showToast = true, shouldReload = true) => {
  try {
    // Clear all sensitive data from localStorage
    const sensitiveKeys = [
      'userInfo',
      'token',
      'refreshToken',
      'authToken',
      'sessionToken',
      'userData',
      'authData'
    ];

    // Remove specific sensitive keys
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Also clear any other potential auth-related keys
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('auth') || 
          key.toLowerCase().includes('user') ||
          key.toLowerCase().includes('session')) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage as well
    sessionStorage.clear();

    // Show success message
    if (showToast) {
      toast.success('Logged out successfully!');
    }

    // Navigate to login page instead of reloading
    if (navigate) {
      navigate('/login');
    } else if (shouldReload) {
      // Fallback: only reload if navigate function is not provided
      window.location.href = '/login';
    }

  } catch (error) {
    console.error('Error during logout:', error);
    toast.error('Error during logout. Please try again.');
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (!token || !userInfo) {
      return false;
    }

    // Check if token is expired (if it's a JWT)
    if (token.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
          // Token is expired, clear it
          secureLogout(null, false);
          return false;
        }
      } catch (error) {
        // Invalid token format, clear it
        secureLogout(null, false);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current user info
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

/**
 * Get auth token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Handle API errors and auto-logout on auth errors
 * @param {Error} error - API error
 * @param {Function} navigate - React Router navigate function
 */
export const handleAuthError = (error, navigate) => {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    toast.error('Session expired. Please login again.');
    secureLogout(navigate, false);
  }
}; 