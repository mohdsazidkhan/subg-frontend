import { useState, useEffect, useRef, useCallback } from 'react';

// Global cache to store API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Track ongoing requests to prevent duplicate calls
const ongoingRequests = new Map();

// Custom hook for API caching
export const useApiCache = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const cacheKey = useRef(null);

  const {
    cacheTime = CACHE_DURATION,
    enabled = true,
    refetchOnFocus = false,
    refetchOnMount = true,
    timeout = 10000 // 10 second timeout
  } = options;

  // Generate cache key based on API call and dependencies
  const generateCacheKey = useCallback(() => {
    // Extract API endpoint from the function string for better key consistency
    const apiString = apiCall.toString();
    let endpoint = '';
    
    // Try to extract endpoint from common API patterns
    if (apiString.includes('/api/levels/all-with-quiz-count')) {
      endpoint = 'levels-all-with-quiz-count';
    } else if (apiString.includes('/api/public/categories')) {
      endpoint = 'public-categories';
    } else if (apiString.includes('/api/public/landing-top-performers')) {
      endpoint = 'landing-top-performers';
    } else if (apiString.includes('/api/public/landing-stats')) {
      endpoint = 'landing-stats';
    } else if (apiString.includes('/api/student/home')) {
      endpoint = 'student-home';
    } else if (apiString.includes('/api/student/profile')) {
      endpoint = 'student-profile';
    } else {
      // Fallback to function string hash
      endpoint = apiString.split('(')[0].split(' ').pop() || 'unknown';
    }
    
    const depsString = JSON.stringify(dependencies);
    return `${endpoint}_${depsString}`;
  }, [apiCall, dependencies]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    const key = generateCacheKey();
    cacheKey.current = key;

    // Check cache first
    if (!forceRefresh && apiCache.has(key)) {
      const cachedData = apiCache.get(key);
      const now = Date.now();
      
      if (now - cachedData.timestamp < cacheTime) {
        if (isMountedRef.current) {
          setData(cachedData.data);
          setLoading(false);
          setError(null);
        }
        return;
      } else {
        // Remove expired cache
        apiCache.delete(key);
      }
    }

    // Check if there's already an ongoing request for this key
    if (ongoingRequests.has(key)) {
      // Wait for the ongoing request to complete
      try {
        const result = await ongoingRequests.get(key);
        if (isMountedRef.current) {
          setData(result);
          setLoading(false);
          setError(null);
        }
        return;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err);
          setLoading(false);
        }
        return;
      }
    }

    // Create a new request promise with timeout
    const requestPromise = (async () => {
      try {
        if (isMountedRef.current) {
          setLoading(true);
          setError(null);
        }

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        const result = await Promise.race([apiCall(), timeoutPromise]);
        
        if (isMountedRef.current) {
          setData(result);
          setError(null);
          
          // Cache the result
          apiCache.set(key, {
            data: result,
            timestamp: Date.now()
          });
        }
        
        return result;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err);
          console.error('API Cache Error:', err);
        }
        throw err;
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        // Remove from ongoing requests
        ongoingRequests.delete(key);
      }
    })();

    // Store the promise in ongoing requests
    ongoingRequests.set(key, requestPromise);

    try {
      await requestPromise;
    } catch (err) {
      // Error handling is done in the promise above
    }
  }, [apiCall, cacheTime, enabled, generateCacheKey, timeout]);

  // Initial fetch
  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  // Handle focus events for refetch
  useEffect(() => {
    if (!refetchOnFocus) return;

    const handleFocus = () => {
      fetchData();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData, refetchOnFocus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Clear ongoing request for this component's cache key
      if (cacheKey.current) {
        ongoingRequests.delete(cacheKey.current);
      }
    };
  }, []);

  // Manual refetch function
  const refetch = useCallback((forceRefresh = true) => {
    fetchData(forceRefresh);
  }, [fetchData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    if (cacheKey.current) {
      apiCache.delete(cacheKey.current);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
};

// Utility function to clear all cache
export const clearAllApiCache = () => {
  apiCache.clear();
  ongoingRequests.clear();
};

// Utility function to clear specific cache patterns
export const clearApiCachePattern = (pattern) => {
  for (const [key] of apiCache) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
  for (const [key] of ongoingRequests) {
    if (key.includes(pattern)) {
      ongoingRequests.delete(key);
    }
  }
};

// Utility function to clear all ongoing requests
export const clearAllOngoingRequests = () => {
  ongoingRequests.clear();
};
