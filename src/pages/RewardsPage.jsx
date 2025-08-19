import React from 'react';
import RewardsDashboard from '../components/RewardsDashboard';
import { useRewards } from '../hooks/useRewards';

const RewardsPage = () => {
  const { rewards, loading, error } = useRewards();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Rewards</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🏆 Rewards</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Track your progress and claim your earned rewards
              </p>
            </div>
            {rewards && (
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-300">Total Claimable</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                  ₹{rewards.claimableRewards?.toLocaleString() || '0'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <RewardsDashboard />
    </div>
  );
};

export default RewardsPage;
