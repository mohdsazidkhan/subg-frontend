import { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

export const useRewards = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.getUserRewards();
      setRewards(response);
    } catch (err) {
      console.error('Error fetching rewards:', err);
      setError(err.response?.data?.message || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = useCallback(async (rewardId) => {
    try {
      const response = await API.claimReward(rewardId);
      await fetchRewards(); // Refresh rewards after claiming
      return { success: true, data: response };
    } catch (err) {
      console.error('Error claiming reward:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to claim reward' 
      };
    }
  }, [fetchRewards]);

  const checkRewardStatus = useCallback((level) => {
    if (!rewards) return null;
    
    const reward = rewards.locked.find(r => r.level === level) ||
                  rewards.unlocked.find(r => r.level === level) ||
                  rewards.claimed.find(r => r.level === level);
    
    if (!reward) return null;
    
    if (reward.isClaimed) return 'claimed';
    if (reward.isUnlocked) return 'unlocked';
    return 'locked';
  }, [rewards]);

  const getRewardAmount = useCallback((level) => {
    const rewardAmounts = {
      6: 990,
      9: 9980,
      10: 99999
    };
    return rewardAmounts[level] || 0;
  }, []);

  const getQuizProgress = useCallback(() => {
    if (!rewards) return null;
    return rewards.quizProgress;
  }, [rewards]);

  const canUnlockRewards = useCallback(() => {
    if (!rewards) return false;
    return rewards.canUnlock;
  }, [rewards]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return {
    rewards,
    loading,
    error,
    fetchRewards,
    claimReward,
    checkRewardStatus,
    getRewardAmount,
    getQuizProgress,
    canUnlockRewards
  };
};
