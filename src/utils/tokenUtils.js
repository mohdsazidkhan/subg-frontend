import { jwtDecode } from 'jwt-decode';

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token has expired (with 5 minute buffer)
    return decoded.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Get token expiration time
export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get time until token expires (in seconds)
export const getTimeUntilExpiration = (token) => {
  if (!token) return 0;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return Math.max(0, decoded.exp - currentTime);
  } catch (error) {
    console.error('Error decoding token:', error);
    return 0;
  }
};

// Check if token will expire soon (within 10 minutes)
export const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token expires within 10 minutes
    return decoded.exp < (currentTime + 600);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Handle token expiration - logout and redirect
export const handleTokenExpiration = () => {
  // Clear all stored data
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('refreshToken');
  
  // Clear any other auth-related data
  sessionStorage.clear();
  
  // Redirect to login page
  window.location.href = '/login';
};

// Validate token and handle expiration
export const validateToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    handleTokenExpiration();
    return false;
  }
  
  if (isTokenExpired(token)) {
    console.log('Token expired, logging out user');
    handleTokenExpiration();
    return false;
  }
  
  return true;
};

// Set up token expiration monitoring
export const setupTokenMonitoring = () => {
  const checkToken = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      handleTokenExpiration();
      return;
    }
    
    if (isTokenExpired(token)) {
      console.log('Token expired during monitoring, logging out user');
      handleTokenExpiration();
      return;
    }
    
    // Check if token expires soon and show warning
    if (isTokenExpiringSoon(token)) {
      const timeLeft = getTimeUntilExpiration(token);
      const minutesLeft = Math.floor(timeLeft / 60);
      
      if (minutesLeft <= 5) {
        // Show warning notification
        if (Notification.permission === 'granted') {
          new Notification('Session Expiring Soon', {
            body: `Your session will expire in ${minutesLeft} minutes. Please save your work.`,
            icon: '/favicon.ico'
          });
        }
      }
    }
  };
  
  // Check token every minute
  const interval = setInterval(checkToken, 60000);
  
  // Also check when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkToken();
    }
  });
  
  // Return cleanup function
  return () => clearInterval(interval);
};
