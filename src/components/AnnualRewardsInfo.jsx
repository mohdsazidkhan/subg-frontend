import React from 'react';

const AnnualRewardsInfo = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 ${className}`}>
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">📋 Annual Rewards System</h4>
        <div className="space-y-2">
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Aug 1:</strong> Level 6 Top 3 (₹990) • <strong>Dec 1:</strong> Level 9 Top 3 (₹9,980) • <strong>Mar 31:</strong> Level 10 Top 3 unlock
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Final Payout:</strong> Rank 1: ₹49,999.50, Rank 2: ₹33,333.00, Rank 3: ₹16,666.50 + All locked rewards
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 ${className}`}>
      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm sm:text-base">📋 Annual Rewards System</h4>
      <div className="space-y-3">
        <div>
          <h5 className="font-medium text-blue-800 dark:text-blue-300 text-xs sm:text-sm mb-1">🎯 Annual Schedule:</h5>
          <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-2">
            <li>• <strong>August 1:</strong> Level 6 Top 3 rewards locked (₹990 each)</li>
            <li>• <strong>December 1:</strong> Level 9 Top 3 rewards locked (₹9,980 each)</li>
            <li>• <strong>March 31:</strong> All rewards unlocked for Level 10 Top 3</li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-blue-800 dark:text-blue-300 text-xs sm:text-sm mb-1">🏆 Level 10 Final Payout:</h5>
          <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-2">
            <li>• <strong>Rank 1:</strong> ₹49,999.50 + All locked rewards</li>
            <li>• <strong>Rank 2:</strong> ₹33,333.00 + All locked rewards</li>
            <li>• <strong>Rank 3:</strong> ₹16,666.50 + All locked rewards</li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-blue-800 dark:text-blue-300 text-xs sm:text-sm mb-1">🔓 Unlock Requirements:</h5>
          <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-2">
            <li>• Must be in Top 3 at Level 10</li>
            <li>• Must complete 1024+ high-score quizzes (75%+)</li>
            <li>• All rewards unlock simultaneously on March 31</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnnualRewardsInfo;






