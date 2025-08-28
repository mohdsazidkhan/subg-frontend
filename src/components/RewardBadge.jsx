import React from 'react';

const RewardBadge = ({ level, status, className = '' }) => {
  const getBadgeConfig = (level, status) => {
    switch (status) {
      case 'locked':
        return {
          text: 'Reward Locked',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: '🔒'
        };
      case 'unlocked':
        return {
          text: 'Reward Unlocked',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: '✅'
        };
      case 'claimed':
        return {
          text: 'Reward Claimed',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: '🎉'
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig(level, status);
  if (!config) return null;

  const getRewardAmount = (level) => {
    switch (level) {
      case 10: return '₹9,999 (Monthly)';
      default: return '';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}>
      <span className="mr-1">{config.icon}</span>
      <span>{config.text}</span>
      <span className="ml-1 text-xs opacity-75">({getRewardAmount(level)})</span>
    </div>
  );
};

export default RewardBadge;
