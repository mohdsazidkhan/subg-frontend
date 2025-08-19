import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const showRewardLockedNotification = (level, amount) => {
  const messages = {
    6: `🎉 Congratulations! You've earned a locked reward for Level 6. Reach Top 3 at Level 10 to claim ₹${amount.toLocaleString()}.`,
    9: `🎉 Congratulations! You've earned a locked reward for Level 9. Reach Top 3 at Level 10 to claim ₹${amount.toLocaleString()}.`,
    10: `🎉 Congratulations! You've earned a locked reward for Level 10. Complete 1024 quizzes to claim ₹${amount.toLocaleString()}.`
  };

  toast.success(messages[level] || 'Reward locked!', {
    duration: 6000,
    position: 'top-center',
    style: {
      background: '#10B981',
      color: '#fff',
      fontSize: '14px',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '400px'
    }
  });
};

export const showRewardUnlockedNotification = (totalAmount) => {
  toast.success(`🎊 All rewards unlocked! You can now claim ₹${totalAmount.toLocaleString()}.`, {
    duration: 8000,
    position: 'top-center',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontSize: '14px',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '400px'
    }
  });
};

export const showQuizProgressNotification = (current, required) => {
  const percentage = Math.round((current / required) * 100);
  
  if (percentage >= 100) {
    toast.success('🎯 Quiz target achieved! All rewards are now unlocked.', {
      duration: 6000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
        padding: '16px',
        borderRadius: '8px',
        maxWidth: '400px'
      }
    });
  } else if (percentage >= 75) {
    toast.info(`📚 Almost there! ${current}/${required} quizzes completed. Keep going!`, {
      duration: 4000,
      position: 'top-center'
    });
  } else if (percentage >= 50) {
    toast.info(`📖 Halfway there! ${current}/${required} quizzes completed.`, {
      duration: 4000,
      position: 'top-center'
    });
  }
};

export const showRewardClaimedNotification = (amount) => {
  toast.success(`💰 Reward claimed! ₹${amount.toLocaleString()} added to your balance.`, {
    duration: 5000,
    position: 'top-center',
    style: {
      background: '#10B981',
      color: '#fff',
      fontSize: '14px',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '400px'
    }
  });
};

const RewardNotification = ({ type, level, amount, current, required }) => {
  useEffect(() => {
    switch (type) {
      case 'locked':
        showRewardLockedNotification(level, amount);
        break;
      case 'unlocked':
        showRewardUnlockedNotification(amount);
        break;
      case 'claimed':
        showRewardClaimedNotification(amount);
        break;
      case 'progress':
        showQuizProgressNotification(current, required);
        break;
      default:
        break;
    }
  }, [type, level, amount, current, required]);

  return null; // This component doesn't render anything
};

export default RewardNotification;
