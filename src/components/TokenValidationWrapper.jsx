import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken, isTokenExpired, isTokenExpiringSoon, getTimeUntilExpiration } from '../utils/tokenUtils';

const TokenValidationWrapper = ({ children, showWarning = true }) => {
  const navigate = useNavigate();
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Check token immediately
    if (!validateToken()) {
      return;
    }

    // Set up periodic checking
    const checkToken = () => {
      const token = localStorage.getItem('token');
      
      if (!token || isTokenExpired(token)) {
        console.log('Token expired, redirecting to login');
        navigate('/login', { 
          replace: true,
          state: { message: 'Your session has expired. Please login again.' }
        });
        return;
      }

      // Check if expiring soon
      if (isTokenExpiringSoon(token)) {
        const timeUntilExpiry = getTimeUntilExpiration(token);
        const minutesLeft = Math.floor(timeUntilExpiry / 60);
        
        if (minutesLeft <= 5) {
          setTimeLeft(minutesLeft);
          setShowExpirationWarning(true);
          
          // Auto-logout when expired
          if (minutesLeft <= 0) {
            navigate('/login', { 
              replace: true,
              state: { message: 'Your session has expired. Please login again.' }
            });
          }
        }
      } else {
        setShowExpirationWarning(false);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkToken, 30000);
    
    // Check when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkToken();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial check
    checkToken();
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  // Handle manual logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  // Handle extend session (if you have refresh token functionality)
  const handleExtendSession = () => {
    // You can implement refresh token logic here
    console.log('Extending session...');
    setShowExpirationWarning(false);
  };

  if (showExpirationWarning && showWarning) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <div className="text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your session will expire in <strong>{timeLeft} minute(s)</strong>.
              Please save your work and login again.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleExtendSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Extend Session
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout Now
              </button>
            </div>
            
            <button
              onClick={() => setShowExpirationWarning(false)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Continue Working
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default TokenValidationWrapper;
