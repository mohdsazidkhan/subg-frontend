import { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

export const useRewards = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRewards = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);
      
      const response = await API.getUserRewards();
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      // Validate required fields
      const requiredFields = ['locked', 'unlocked', 'claimed', 'claimableRewards', 'quizProgress'];
      const missingFields = requiredFields.filter(field => !(field in response));
      
      if (missingFields.length > 0) {
        console.warn('Missing fields in rewards response:', missingFields);
      }
      
      setRewards(response);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching rewards:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch rewards';
      setError(errorMessage);
      
      // Auto-retry logic (max 3 attempts)
      if (retryCount < 3 && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchRewards(true);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  }, [retryCount]);

  const claimReward = useCallback(async (rewardId) => {
    if (!rewardId) {
      return { 
        success: false, 
        error: 'Invalid reward ID' 
      };
    }

    try {
      const response = await API.claimReward(rewardId);
      
      // Validate response
      if (!response) {
        throw new Error('No response from server');
      }
      
      // Refresh rewards after successful claim
      await fetchRewards();
      
      return { 
        success: true, 
        data: response 
      };
    } catch (err) {
      console.error('Error claiming reward:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to claim reward' 
      };
    }
  }, [fetchRewards]);

  const checkRewardStatus = useCallback((level) => {
    if (!rewards || !level) return null;
    
    const reward = rewards.locked?.find(r => r.level === level) ||
                  rewards.unlocked?.find(r => r.level === level) ||
                  rewards.claimed?.find(r => r.level === level);
    
    if (!reward) return null;
    
    if (reward.isClaimed) return 'claimed';
    if (reward.isUnlocked) return 'unlocked';
    return 'locked';
  }, [rewards]);

  const getRewardAmount = useCallback((level) => {
    const rewardAmounts = {
      6: 990,      // August 1: Level 6 Top 3
      9: 9980,     // December 1: Level 9 Top 3
      10: 99999    // March 31: Level 10 Top 3 (3:2:1 split)
    };
    return rewardAmounts[level] || 0;
  }, []);

  const getQuizProgress = useCallback(() => {
    if (!rewards) return null;
    return rewards.quizProgress || { current: 0, required: 1024, percentage: 0 };
  }, [rewards]);

  const canUnlockRewards = useCallback(() => {
    if (!rewards) return false;
    return rewards.canUnlock || false;
  }, [rewards]);

  const getTotalRewardsValue = useCallback(() => {
    if (!rewards) return 0;
    
    const lockedValue = (rewards.locked || []).reduce((sum, r) => sum + (r.amount || 0), 0);
    const unlockedValue = (rewards.unlocked || []).reduce((sum, r) => sum + (r.amount || 0), 0);
    const claimedValue = (rewards.claimed || []).reduce((sum, r) => sum + (r.amount || 0), 0);
    
    return lockedValue + unlockedValue + claimedValue;
  }, [rewards]);

  const retryFetch = useCallback(() => {
    setRetryCount(0);
    fetchRewards();
  }, [fetchRewards]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return {
    rewards,
    loading,
    error,
    retryCount,
    fetchRewards,
    claimReward,
    checkRewardStatus,
    getRewardAmount,
    getQuizProgress,
    canUnlockRewards,
    getTotalRewardsValue,
    retryFetch
  };
};
