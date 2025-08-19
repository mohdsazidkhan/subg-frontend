import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-hot-toast';

const RewardsDashboard = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await API.getUserRewards();
      setRewards(response);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId) => {
    try {
      setClaiming(true);
      const response = await API.claimReward(rewardId);
      toast.success(response.message);
      fetchRewards(); // Refresh rewards
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error(error.response?.data?.message || 'Failed to claim reward');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!rewards) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">Failed to load rewards</p>
      </div>
    );
  }

  const { 
    locked = [], 
    unlocked = [], 
    claimed = [], 
    claimableRewards = 0, 
    quizProgress = { current: 0, required: 1024, percentage: 0 } 
  } = rewards;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🏆 Rewards Dashboard</h2>
        
        {/* Quiz Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quiz Progress: {quizProgress?.current || 0} / {quizProgress?.required || 1024}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(quizProgress?.percentage || 0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${quizProgress?.percentage || 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Complete 1024 high-score quizzes (75%+) to unlock rewards
          </p>
        </div>

        {/* Claimable Rewards */}
        {claimableRewards > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  💰 Claimable Rewards
                </h3>
                <p className="text-green-600 dark:text-green-300 font-bold text-xl">
                  ₹{claimableRewards.toLocaleString()}
                </p>
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        )}

        {/* Locked Rewards */}
        {locked && locked.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🔒 Locked Rewards</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locked && locked.map((reward) => (
                <div key={reward?._id || Math.random()} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Level {reward?.level || 'N/A'}
                    </span>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      {reward?.dateLocked ? new Date(reward.dateLocked).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                    ₹{(reward?.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Complete Level 10 in Top 3 + 1024 high-score quizzes (75%+) to unlock
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Rewards */}
        {unlocked && unlocked.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">✅ Unlocked Rewards</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unlocked && unlocked.map((reward) => (
                <div key={reward?._id || Math.random()} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Level {reward?.level || 'N/A'}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {reward?.dateUnlocked ? new Date(reward.dateUnlocked).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                    ₹{(reward?.amount || 0).toLocaleString()}
                  </p>
                  <button
                    onClick={() => claimReward(reward?._id)}
                    disabled={claiming || !reward?._id}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {claiming ? 'Claiming...' : 'Claim Reward'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Claimed Rewards */}
        {claimed && claimed.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🎉 Claimed Rewards</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {claimed && claimed.map((reward) => (
                <div key={reward?._id || Math.random()} className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Level {reward?.level || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {reward?.dateClaimed ? new Date(reward.dateClaimed).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                    ₹{(reward?.amount || 0).toLocaleString()}
                  </p>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Claimed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Rewards Message */}
        {(!locked || locked.length === 0) && (!unlocked || unlocked.length === 0) && (!claimed || claimed.length === 0) && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              No Rewards Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete levels and reach Top 3 positions to earn rewards!
            </p>
          </div>
        )}

        {/* Requirements Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📋 Rewards & Unlock Terms</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Level 6: Top 1–3 rank prize ₹990 (locked)</li>
            <li>• Level 9: Top 1–3 rank prize ₹9,980 (locked)</li>
            <li>• Level 10: Top 1–3 rank prize ₹99,999 split 3:2:1</li>
            <li>• Unlock requirement: Level 10 Top 3 + 1024 high-score quizzes (75%+)</li>
            <li>• Final payout = 3:2:1 share of ₹99,999 + Level 6 + Level 9 prizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;
