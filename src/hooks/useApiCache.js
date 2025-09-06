import { useState, useEffect, useRef, useCallback } from 'react';

// Global cache to store API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
    refetchOnMount = true
  } = options;

  // Generate cache key based on API call and dependencies
  const generateCacheKey = useCallback(() => {
    const apiString = apiCall.toString();
    const depsString = JSON.stringify(dependencies);
    return `${apiString}_${depsString}`;
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

    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const result = await apiCall();
      
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        
        // Cache the result
        apiCache.set(key, {
          data: result,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        console.error('API Cache Error:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall, cacheTime, enabled, generateCacheKey]);

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
};

// Utility function to clear specific cache patterns
export const clearApiCachePattern = (pattern) => {
  for (const [key] of apiCache) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
};
