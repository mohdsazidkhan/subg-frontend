import React, { createContext, useContext, useState, useCallback } from 'react';

const GlobalErrorContext = createContext();

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider');
  }
  return context;
};

const GlobalErrorProvider = ({ children }) => {
  const [globalError, setGlobalError] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitResetTime, setRateLimitResetTime] = useState(null);

  const showGlobalError = useCallback((error, type = 'general') => {
    if (type === 'rateLimit') {
      setIsRateLimited(true);
      // Set reset time to 5 minutes from now
      const resetTime = new Date(Date.now() + 5 * 60 * 1000);
      setRateLimitResetTime(resetTime);
    }
    setGlobalError({ message: error, type });
  });

  const clearGlobalError = useCallback(() => {
    setGlobalError(null);
    setIsRateLimited(false);
    setRateLimitResetTime(null);
  });

  const checkRateLimitError = useCallback((error) => {
    const isRateLimit = error.includes('Too many requests') || 
                       error.includes('rate limit') || 
                       error.includes('429') ||
                       error.includes('rate limiting') ||
                       error.includes('Too many requests from this IP');
    
    if (isRateLimit) {
      showGlobalError(error, 'rateLimit');
      return true;
    }
    return false;
  });

  const getTimeUntilReset = useCallback(() => {
    if (!rateLimitResetTime) return 0;
    const now = new Date();
    const diff = rateLimitResetTime - now;
    return Math.max(0, Math.ceil(diff / 1000));
  });

  const value = {
    globalError,
    isRateLimited,
    rateLimitResetTime,
    showGlobalError,
    clearGlobalError,
    checkRateLimitError,
    getTimeUntilReset
  };

  return (
    <GlobalErrorContext.Provider value={value}>
      {children}
    </GlobalErrorContext.Provider>
  );
};

export default GlobalErrorProvider;
