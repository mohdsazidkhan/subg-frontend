import { useState, useEffect } from 'react';
import { FaTimes, FaInfoCircle, FaRocket, FaGift, FaCreditCard } from 'react-icons/fa';

const SystemUpdateModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-4">
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto transition-all duration-300 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 lg:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaRocket className="text-2xl" />
              </div>
              <div>
                 <h2 className="text-xl lg:text-xl lg:text-2xl font-bold">System Update - Payment Live!</h2>
                 <p className="text-blue-100">Payment is live now active with monthly rewards system</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-3 lg:p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 lg:p-4">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🎯 Monthly Rewards System Active
                </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                   Our monthly rewards system is now fully active! Every month, top performers can win prizes by reaching Level 10 with ≥75% accuracy. 
                   Start fresh each month and compete for monthly rewards.
                 </p>
              </div>
            </div>
           </div>


           <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-2 lg:p-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
              <span className="text-xl mr-2">🏆</span>
              New Monthly Rewards System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-3xl mb-2">🥇</div>
                <div className="text-lg font-bold text-yellow-600">1st Place</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">₹4,999</div>
              </div>
              <div className="text-center bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-3xl mb-2">🥈</div>
                <div className="text-lg font-bold text-green-600">2nd Place</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">₹3,333</div>
              </div>
              <div className="text-center bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-3xl mb-2">🥉</div>
                <div className="text-lg font-bold text-orange-600">3rd Place</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">₹1,667</div>
              </div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-3 text-center">
              <strong>Total Prize Pool: ₹9,999</strong> - Top 3 users with Level 10 and ≥75% accuracy win monthly!
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-2 lg:p-4">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
              <FaCreditCard className="text-xl mr-2" />
              Subscription Plans - Now Available!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🆓</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">Free</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Levels 0-3</div>
                <div className="text-lg font-bold text-green-600">₹0/month</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">Basic</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Levels 0-6</div>
                <div className="text-lg font-bold text-blue-600">₹9/month</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">💎</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">Premium</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Levels 0-9</div>
                <div className="text-lg font-bold text-purple-600">₹49/month</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">👑</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">Pro</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">All Levels (0-10)</div>
                <div className="text-lg font-bold text-yellow-600">₹99/month</div>
              </div>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-3 text-center">
              <strong>Secure Payments:</strong> All payments are processed securely through PayU payment gateway with multiple payment options available!
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center">
              <FaGift className="text-xl mr-2" />
              Referral Rewards System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">2 Referrals</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Basic Plan</div>
                <div className="text-lg font-bold text-blue-600">30 Days Free</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">5 Referrals</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Premium Plan</div>
                <div className="text-lg font-bold text-purple-600">30 Days Free</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">👑</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">10 Referrals</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Pro Plan</div>
                <div className="text-lg font-bold text-yellow-600">30 Days Free</div>
              </div>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-3 text-center">
              <strong>Smart Upgrade System:</strong> Referral rewards only upgrade your plan, never downgrade!
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
              <span className="text-xl mr-2">🚀</span>
              Payment Live!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              <strong>Payment System Active:</strong> Payment is now live! You can now purchase subscriptions using secure payment methods.{' '}
              <strong className='ps-2'>Free Levels 0-3</strong> are still available for practice, and the <strong>referral system</strong> continues to work - earn free subscriptions by referring friends!
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              🎉 Welcome to the new era of monthly competitions, rewards, and live payments!
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Got It! Let's Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemUpdateModal;
