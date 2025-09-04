import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import MobileAppWrapper from '../components/MobileAppWrapper';
import { FaCheckCircle, FaSpinner, FaArrowLeft, FaTimesCircle } from 'react-icons/fa';

const PayuSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);

  // Debug logging
  console.log('PayU Success Page - Component loaded');
  console.log('PayU Success Page - Location:', location);
  console.log('PayU Success Page - Search params:', location.search);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(location.search);
        const paymentData = {
          txnid: urlParams.get('txnid'),
          status: urlParams.get('status'),
          amount: urlParams.get('amount'),
          productinfo: urlParams.get('productinfo'),
          firstname: urlParams.get('firstname'),
          email: urlParams.get('email'),
          phone: urlParams.get('phone'),
          hash: urlParams.get('hash'),
          udf1: urlParams.get('udf1'),
          udf2: urlParams.get('udf2'),
          udf3: urlParams.get('udf3'),
          udf4: urlParams.get('udf4'),
          udf5: urlParams.get('udf5')
        };

        console.log('PayU Success - Payment data:', paymentData);
        console.log('PayU Success - Current URL:', window.location.href);
        console.log('PayU Success - Search params:', location.search);

        if (!paymentData.txnid || !paymentData.status) {
          console.error('Missing required payment data:', { txnid: paymentData.txnid, status: paymentData.status });
          
          // If no payment data, show a message and redirect after a delay
          if (!paymentData.txnid && !paymentData.status) {
            console.log('No payment data found, redirecting to subscription page...');
            setTimeout(() => {
              navigate('/subscription');
            }, 3000);
            setVerificationResult({ 
              success: false, 
              message: 'No payment data found. Redirecting to subscription page...' 
            });
            return;
          }
          
          throw new Error('Invalid payment data received. Missing transaction ID or status.');
        }

        // Test API connectivity first
        console.log('PayU Success - Testing API connectivity...');
        try {
          const testResponse = await fetch(`${API.baseURL}/api/subscription/test-api`);
          const testData = await testResponse.json();
          console.log('PayU Success - API Test Response:', testData);
        } catch (testError) {
          console.error('PayU Success - API Test Failed:', testError);
        }

        // Verify payment with backend
        console.log('PayU Success - Calling API to verify payment...');
        console.log('PayU Success - API Base URL:', API.baseURL);
        
        try {
          const verificationRes = await API.verifyPayuSubscription(paymentData);
          
          console.log('PayU Success - Verification response:', verificationRes);
          setVerificationResult(verificationRes);
          
          if (verificationRes.success) {
            toast.success('🎉 Payment successful! Subscription activated.');
          } else {
            toast.error('Payment verification failed: ' + verificationRes.message);
          }
        } catch (apiError) {
          console.error('PayU Success - API Error:', apiError);
          console.error('PayU Success - API Error Status:', apiError.response?.status);
          console.error('PayU Success - API Error Data:', apiError.response?.data);
          
          // Handle specific error cases
          if (apiError.response?.status === 405) {
            throw new Error('API method not allowed. Please contact support.');
          } else if (apiError.response?.status === 404) {
            throw new Error('API endpoint not found. Please contact support.');
          } else if (apiError.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`API Error: ${apiError.message}`);
          }
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data
        });
        toast.error('Payment verification failed: ' + (error.message || 'Unknown error'));
        setVerificationResult({ success: false, message: error.message });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  const handleGoToSubscription = () => {
    navigate('/subscription');
  };

  const handleGoToLevels = () => {
    navigate('/levels');
  };

  if (verifying) {
    return (
      <MobileAppWrapper title="Payment Verification">
        <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please wait while we verify your payment
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>Search:</strong> {location.search}</p>
              <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'https://subg-backend.onrender.com'}</p>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => navigate('/subscription')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Subscription
              </button>
            </div>
          </div>
        </div>
      </MobileAppWrapper>
    );
  }

  return (
    <MobileAppWrapper title="Payment Success">
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {verificationResult?.success ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Payment Successful!
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Your subscription has been activated successfully. You can now access all premium features.
                </p>

                {verificationResult.subscription && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      Subscription Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Plan:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {verificationResult.subscription.planName?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Status:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {verificationResult.subscription.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Expires:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {verificationResult.subscription.expiryDate ? 
                            new Date(verificationResult.subscription.expiryDate).toLocaleDateString() : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleGoToLevels}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start Learning Now
                  </button>
                  
                  <button
                    onClick={handleGoToSubscription}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300"
                  >
                    View Subscription Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTimesCircle className="text-4xl text-red-600 dark:text-red-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Payment Verification Failed
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  {verificationResult?.message || 'There was an issue verifying your payment. Please contact support if the amount was deducted.'}
                </p>

                <div className="space-y-4">
                  <button
                    onClick={handleGoToSubscription}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Try Again
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileAppWrapper>
  );
};

export default PayuSuccess;
