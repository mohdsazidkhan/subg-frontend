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
      
      // Use profile data as rewards source in monthly system
      const response = await API.getProfile();
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from server');
      }
      console.log(response, 'responseresponse')
      // Shape minimal rewards state for components
      const shaped = {
        claimableRewards: response?.user?.claimableRewards || 0,
        quizProgress: {
          current: response?.user?.monthlyProgress?.highScoreWins || 0,
          required: process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220,
          percentage: Math.min(100, Math.round(((response?.user?.monthlyProgress?.highScoreWins || 0) / (process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220)) * 100))
        },
        canUnlock: Boolean(response?.user?.monthlyProgress?.rewardEligible),
        monthlyRank: response?.user?.monthlyProgress?.rewardRank || 0,
        // legacy arrays removed
        locked: [],
        unlocked: [],
        claimed: []
      };
      setRewards(shaped);
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

  const claimReward = useCallback(async () => {
    return { success: false, error: 'Claim flow disabled; monthly prizes auto-credited to winners.' };
  }, []);

  const checkRewardStatus = useCallback((level) => {
    if (!rewards || !level) return null;
    if (level === 10 && rewards.canUnlock) return 'monthly';
    return null;
  }, [rewards]);

  const getRewardAmount = useCallback((level) => {
    if (level === 10) return process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000;
    return 0;
  }, []);

  const getQuizProgress = useCallback(() => {
    if (!rewards) return null;
    return rewards.quizProgress || { current: 0, required: process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220, percentage: 0 };
  }, [rewards]);

  const canUnlockRewards = useCallback(() => {
    if (!rewards) return false;
    return rewards.canUnlock || false;
  }, [rewards]);

  const getTotalRewardsValue = useCallback(() => {
    if (!rewards) return 0;
    
    return rewards.claimableRewards || 0;
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
