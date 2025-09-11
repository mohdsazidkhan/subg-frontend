import React from 'react';

const MonthlyRewardsInfo = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 ${className}`}>
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">📋 Monthly Rewards System</h4>
        <div className="space-y-2">
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Monthly:</strong> Top 3 eligible users at (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) win prizes in 3:2:1 ratio from ₹9,999 total pool
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Eligibility:</strong> Must reach Level 10 and Minimum 110 Quizzes with ≥75% Accuracy in {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Reset:</strong> Progress and rewards reset every month on the 1st
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 lg:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">📋 Monthly Rewards System</h3>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🏆 Monthly Prize Pool</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Top 3 eligible users at Level 10 each month win prizes in <strong>3:2:1 ratio</strong> from ₹9,999 total pool
          </p>
        </div>

        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">✅ Eligibility Requirements</h4>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Reach <strong>Level 10</strong> and (Minimum 110 Quizzes with ≥75% Accuracy Monthly)</li>
            <li>• Maintain <strong>≥75% accuracy</strong> (wins ÷ attempts)</li>
            <li>• Rank in <strong>Top 3</strong> on monthly leaderboard</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🔄 Monthly Reset</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            All progress resets on the 1st of every month. Each month is independent - previous achievements don't carry forward.
          </p>
        </div>

        <div className="bg-white dark:bg-blue-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 How to Qualify</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Focus on accuracy over speed. Complete (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) to compete for monthly rewards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRewardsInfo;






