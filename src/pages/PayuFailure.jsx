import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import MobileAppWrapper from '../components/MobileAppWrapper';
import { FaTimesCircle, FaArrowLeft, FaRefresh } from 'react-icons/fa';

const PayuFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Show failure message
    toast.error('Payment failed. Please try again.');
  }, []);

  const handleTryAgain = () => {
    navigate('/subscription');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <MobileAppWrapper title="Payment Failed">
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="text-4xl text-red-600 dark:text-red-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Payment Failed
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                We're sorry, but your payment could not be processed. This could be due to various reasons such as insufficient funds, network issues, or payment gateway problems.
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  What you can do:
                </h3>
                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Check your bank account or card balance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Ensure your card details are correct</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Try using a different payment method</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Contact your bank if the issue persists</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <FaRefresh className="text-sm" />
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FaArrowLeft className="text-sm" />
                  <span>Go to Home</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> If you were charged but didn't receive your subscription, please contact our support team with your transaction details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileAppWrapper>
  );
};

export default PayuFailure;
