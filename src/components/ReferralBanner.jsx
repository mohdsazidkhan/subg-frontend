import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ReferralBanner = ({ user }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const referralCode = user?.referralCode;
  const referralCount = user?.referralCount || 0;

  const message = 
    "🎯 Refer with your friends and unlock paid subscriptions automatically on milestones!\n" +
    "2 referrals = ₹9 BASIC plan,\n" +
    "5 referrals = ₹49 PREMIUM plan,\n" +
    "10 referrals = ₹99 PRO plan.\n" +
    `Check out my Referral Code:\n${referralCode}\n` +
    "Join and get Paid Subscriptions Free!";

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied to clipboard!', {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const copyReferralMessage = () => {
    navigator.clipboard.writeText(message);
    toast.success('Referral message copied to clipboard!', {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const shareOnWhatsApp = () => {
    const whatsappMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
  };

  const shareOnTelegram = () => {
    const telegramMessage = encodeURIComponent(message);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${telegramMessage}`, '_blank');
  };

  const getNextMilestone = () => {
    if (referralCount < 2) return { target: 2, reward: '₹9 BASIC plan', color: 'from-green-400 to-blue-500' };
    if (referralCount < 5) return { target: 5, reward: '₹49 PREMIUM plan', color: 'from-blue-400 to-purple-500' };
    if (referralCount < 10) return { target: 10, reward: '₹99 PRO plan', color: 'from-purple-400 to-pink-500' };
    return { target: 10, reward: '₹99 PRO plan', color: 'from-pink-400 to-red-500' };
  };

  const nextMilestone = getNextMilestone();
  const progressPercentage = Math.min((referralCount / nextMilestone.target) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-yellow-200/50 dark:border-yellow-400/30 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Earn Free Subscriptions!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Refer friends and unlock premium features automatically
        </p>
      </div>

      {/* Progress Section */}
      <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-4 mb-6 border border-white/50">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {referralCount}
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-medium">
            Referrals Joined
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              Next: {nextMilestone.reward}
            </span>
            <span className="text-yellow-600 dark:text-yellow-400 text-sm font-bold">
              {referralCount}/{nextMilestone.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${nextMilestone.color} h-3 rounded-full transition-all duration-1000 ease-out shadow-lg`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-500/25 dark:to-orange-500/25 rounded-2xl p-4 mb-6 border border-yellow-200 dark:border-yellow-400/30">
        <div className="text-center">
          <h4 className="text-gray-800 dark:text-white font-bold text-lg mb-3 flex items-center justify-center gap-2">
            <span className="text-xl">🔑</span>
            Your Referral Code
          </h4>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 dark:text-gray-900 font-mono font-bold px-4 py-2 rounded-xl tracking-widest border-2 border-yellow-200 dark:border-yellow-300 shadow-lg text-lg select-all">
              {referralCode}
            </div>
            <button
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              onClick={copyReferralCode}
              title="Copy Referral Code"
            >
              <span>📋</span>
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Milestone Rewards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className={`bg-gradient-to-br ${referralCount >= 2 ? 'from-green-400 to-blue-500' : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'} rounded-xl p-3 text-center border border-white/50`}>
          <div className="text-white font-bold text-sm">2 Referrals</div>
          <div className="text-white text-xs">₹9 BASIC</div>
          {referralCount >= 2 && <div className="text-white text-xs">✅ Earned</div>}
        </div>
        <div className={`bg-gradient-to-br ${referralCount >= 5 ? 'from-blue-400 to-purple-500' : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'} rounded-xl p-3 text-center border border-white/50`}>
          <div className="text-white font-bold text-sm">5 Referrals</div>
          <div className="text-white text-xs">₹49 PREMIUM</div>
          {referralCount >= 5 && <div className="text-white text-xs">✅ Earned</div>}
        </div>
        <div className={`bg-gradient-to-br ${referralCount >= 10 ? 'from-purple-400 to-pink-500' : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'} rounded-xl p-3 text-center border border-white/50`}>
          <div className="text-white font-bold text-sm">10 Referrals</div>
          <div className="text-white text-xs">₹99 PRO</div>
          {referralCount >= 10 && <div className="text-white text-xs">✅ Earned</div>}
        </div>
      </div>

      {/* Share Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <span>📤</span>
          Share Your Code
        </button>

        {showShareOptions && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            <button
              onClick={shareOnWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📱</span>
              WhatsApp
            </button>
            <button
              onClick={shareOnTelegram}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>✈️</span>
              Telegram
            </button>
            <button
              onClick={copyReferralMessage}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📋</span>
              Copy Message
            </button>
            <Link
              to="/profile"
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>👤</span>
              View Profile
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          💡 <strong>Pro Tip:</strong> Share on social media and WhatsApp groups to reach milestones faster!
        </p>
      </div>
    </div>
  );
};

export default ReferralBanner;
