import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import config from '../config/appConfig';
import { 
  // FaCreditCard, 
  FaWallet, 
  FaHistory, 
  FaCheckCircle, 
  FaCrown, 
  FaStar, 
  FaRocket, 
  FaGem, 
  FaTrophy, 
  FaShieldAlt,
  FaInfinity,
  FaHeadset,
  FaChartLine,
  FaAward,
  FaLock,
  FaUnlock,
  FaCalendarAlt,
  // FaClock,
  FaBolt,
  FaUsers,
  FaBookOpen,
  // FaMedal,
  FaFire,
  FaGift,
  FaCheckDouble,
  FaFileAlt,
  FaDownload,
  FaCode,
  FaTags
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MonthlyRewardsInfo from '../components/MonthlyRewardsInfo';

const SubscriptionPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [selectedPlan, setSelectedPlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const navigate = useNavigate();
  console.log(subscription,'subscription');
  useEffect(() => {
    fetchSubscriptionData();
    
    // Check if Razorpay is loaded
    const checkRazorpay = () => {
      if (typeof window.Razorpay !== 'undefined') {
        setRazorpayLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkRazorpay, 100);
      }
    };
    
    checkRazorpay();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        toast.error('Please login to view subscription details');
        return;
      }

      const [subscriptionRes, transactionsRes] = await Promise.all([
        API.getSubscriptionStatus(userInfo._id),
        API.getSubscriptionTransactions(userInfo._id)
      ]);

      setSubscription(subscriptionRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  // const handleSubscribe = async (planName) => {
  //   try {
  //     // Convert plan key to lowercase for backend
  //     const planId = planName.toLowerCase();
      
  //     // Get plan details from config
  //     const plan = config.SUBSCRIPTION_PLANS[planName];
  //     if (!plan) {
  //       toast.error('Invalid plan selected');
  //       return;
  //     }

  //     setSelectedPlan(plan);
      
  //     // Check if user is logged in
  //     const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  //     if (!userInfo) {
  //       toast.error('Please login to subscribe');
  //       return;
  //     }

  //     if (!userInfo._id) {
  //       toast.error('User information is incomplete. Please login again.');
  //       return;
  //     }

  //     console.log('Creating subscription order for:', { 
  //       planId, 
  //       userId: userInfo._id,
  //       userInfo: userInfo 
  //     });
      
  //     const orderRes = await API.createSubscriptionOrder({
  //       planId: planId,
  //       userId: userInfo._id
  //     });

  //     console.log('Order created:', orderRes);

  //     const options = {
  //       key: config.RAZORPAY_KEY_ID,
  //       amount: plan.price * 100,
  //       currency: config.CURRENCY,
  //       name: config.APP_NAME,
  //       description: `${plan.name} - 1 year`,
  //       order_id: orderRes.id,
  //       handler: async (response) => {
  //         try {
  //           console.log('Payment response:', response);
  //           await API.verifySubscription({
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_signature: response.razorpay_signature,
  //             userId: userInfo._id,
  //             planId: planId
  //           });

  //           toast.success('🎉 Subscription activated successfully!');
  //           fetchSubscriptionData();
  //         } catch (error) {
  //           console.error('Payment verification failed:', error);
  //           toast.error('Payment verification failed: ' + (error.message || 'Unknown error'));
  //         }
  //       },
  //       prefill: {
  //         name: userInfo.name || '',
  //         email: userInfo.email || '',
  //         contact: userInfo.phone || ''
  //       },
  //       theme: {
  //         color: '#10B981'
  //       }
  //     };

  //     // Check if Razorpay is loaded
  //     if (typeof window.Razorpay === 'undefined') {
  //       toast.error('Payment gateway is not loaded. Please refresh the page and try again.');
  //       // Try to reload Razorpay script
  //       const script = document.createElement('script');
  //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //       script.onload = () => {
  //         setRazorpayLoaded(true);
  //         toast.success('Payment gateway loaded. Please try again.');
  //       };
  //       document.head.appendChild(script);
  //       return;
  //     }

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (error) {
  //     console.error('Error creating subscription:', error);
      
  //     // Provide more specific error messages
  //     if (error.message.includes('User not found')) {
  //       toast.error('User not found. Please login again.');
  //     } else if (error.message.includes('Invalid plan')) {
  //       toast.error('Invalid subscription plan selected.');
  //     } else if (error.message.includes('Payment gateway not configured')) {
  //       toast.error('Payment system is currently unavailable. Please try again later.');
  //     } else {
  //       toast.error('Failed to create subscription order: ' + (error.message || 'Unknown error'));
  //     }
  //   }
  // };

  const getSubscriptionPlans = () => {
    return Object.entries(config.SUBSCRIPTION_PLANS).map(([key, plan]) => ({
      key,
      ...plan,
      duration: '1 month'
    }));
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return FaStar;
      case 'premium':
        return FaGem;
      case 'pro':
        return FaCrown;
      default:
        return FaRocket;
    }
  };

  const getPlanGradient = (planName) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return 'from-yellow-500 via-yellow-600 to-red-600';
      case 'premium':
        return 'from-red-500 via-red-600 to-pink-600';
      case 'pro':
        return 'from-orange-500 via-red-500 to-pink-600';
      default:
        return 'from-green-500 via-green-600 to-teal-600';
    }
  };

  const getPlanFeatures = (planName) => {
    if (planName === 'Free') {
      return [
        { icon: FaBookOpen, text: 'Unlimited Quiz Access (Levels 0-3)', included: true },
        { icon: FaUsers, text: 'Community Access', included: true },
        { icon: FaChartLine, text: 'Basic Analytics', included: true },
        { icon: FaHeadset, text: 'Email Support', included: true },
        { icon: FaLock, text: 'Live Quizzes', included: false },
        { icon: FaAward, text: 'Exclusive Badges', included: false },
        { icon: FaGift, text: 'Bonus Content', included: false },
        { icon: FaBolt, text: 'Priority Support', included: false },
      ];
    } else if (planName === 'Basic') {
      return [
        { icon: FaBookOpen, text: 'Unlimited Quiz Access (Levels 0-6)', included: true },
        { icon: FaUsers, text: 'Community Access', included: true },
        { icon: FaChartLine, text: 'Detailed Analytics', included: true },
        { icon: FaHeadset, text: 'Email Support', included: true },
        { icon: FaLock, text: 'Live Quizzes', included: false },
        { icon: FaAward, text: 'Exclusive Badges', included: false },
        { icon: FaGift, text: 'Bonus Content', included: false },
        { icon: FaBolt, text: 'Priority Support', included: false },
      ];
    } else if (planName === 'Premium') {
      return [
        { icon: FaBookOpen, text: 'Unlimited Quiz Access (Levels 0-9)', included: true },
        { icon: FaUsers, text: 'Community Access', included: true },
        { icon: FaChartLine, text: 'Advanced Analytics', included: true },
        { icon: FaHeadset, text: 'Priority Support', included: true },
        { icon: FaUnlock, text: 'Live Quizzes', included: true },
        { icon: FaAward, text: 'Exclusive Badges', included: true },
        { icon: FaGift, text: 'Bonus Content', included: true },
        { icon: FaFileAlt, text: 'Advanced Reports', included: true },
      ];
    } else if (planName === 'Pro') {
      return [
        { icon: FaBookOpen, text: 'Unlimited Quiz Access (All Levels 0-10)', included: true },
        { icon: FaUsers, text: 'Community Access', included: true },
        { icon: FaChartLine, text: 'Advanced Analytics', included: true },
        { icon: FaHeadset, text: 'Priority Support', included: true },
        { icon: FaUnlock, text: 'Live Quizzes', included: true },
        { icon: FaAward, text: 'Exclusive Badges', included: true },
        { icon: FaGift, text: 'Bonus Content', included: true },
        { icon: FaFileAlt, text: 'Advanced Reports', included: true },
        { icon: FaDownload, text: 'Data Export', included: true },
        { icon: FaCode, text: 'API Access', included: true },
        { icon: FaTags, text: 'Custom Categories', included: true },
        { icon: FaCheckDouble, text: 'All Premium Features', included: true },
      ];
    }
    return [];
  };

  if (loading || !razorpayLoaded) {
    return (
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-16 bg-gradient-to-r from-yellow-200 to-red-200 dark:from-yellow-800 dark:to-red-800 rounded-2xl w-1/3 mb-12 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-white/50 dark:bg-gray-800/50 rounded-3xl backdrop-blur-sm"></div>
              ))}
            </div>
          </div>
          {!razorpayLoaded && (
            <div className="text-center text-gray-600 dark:text-gray-300">
              <span className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 inline-block mr-2"></span>
              <span>Loading payment gateway...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-subg-light dark:bg-subg-dark relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
  <div className="absolute -top-40 -right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-green-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 mt-0 md:mt-16 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-16 subscription-hero">
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl floating-animation">
              <FaWallet className="text-white text-2xl sm:text-4xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-green-400 to-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <FaCrown className="text-white text-xs sm:text-sm" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-gray-600 dark:text-gray-100 mb-4 sm:mb-6">
            Unlock Your Potential
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect subscription plan and take your quiz experience to the next level
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-2 py-4 md:p-8 border border-white/30 mb-16 hover-lift">
            <div className="flex items-center justify-between mb-8 flex-col md:flex-row">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
                  <FaShieldAlt className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    Current Subscription
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Your active plan details
                  </p>
                </div>
              </div>
              <button
                onClick={() => { navigate('/levels'); }}
                className="mt-4 md:mt-0 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 dark:from-yellow-500 dark:to-red-500 dark:hover:from-yellow-600 dark:hover:to-red-600 text-white dark:text-white px-6 py-3 rounded-2xl transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40"
              >
                <span className="flex items-center space-x-2">
                  <FaTrophy className="text-sm" />
                  <span>View All Levels</span>
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/30 dark:to-red-900/30 rounded-2xl p-3 md:p-6 border border-yellow-200 dark:border-yellow-700 hover-scale">
                <div className="flex items-center space-x-4 mb-0 md:mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FaCrown className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Current Plan</span>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {subscription.planName?.toUpperCase() || 'Free'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-3 md:p-6 border border-green-200 dark:border-green-700 hover-scale">
                <div className="flex items-center space-x-4 mb-0 md:mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Status</span>
                    <p className={`text-2xl font-bold ${
                      subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {subscription.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/30 dark:to-yellow-900/30 rounded-2xl p-3 md:p-6 border border-red-200 dark:border-red-700 hover-scale">
                <div className="flex items-center space-x-4 mb-0 md:mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <FaBookOpen className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Level Access</span>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {subscription.planName?.toLowerCase() === 'basic' && 'Zero to Mastermind'}
                      {subscription.planName?.toLowerCase() === 'premium' && 'Zero to Wizard'}
                      {subscription.planName?.toLowerCase() === 'pro' && 'Zero to Legend'}
                      {(!subscription.planName || subscription.planName === 'free') && 'Zero to Thinker'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {subscription.planName?.toLowerCase() === 'basic' && 'Levels 0-6'}
                      {subscription.planName?.toLowerCase() === 'premium' && 'Levels 0-9'}
                      {subscription.planName?.toLowerCase() === 'pro' && 'Levels 0-10'}
                      {(!subscription.planName || subscription.planName === 'free') && 'Levels 0-3'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-3 md:p-6 border border-orange-200 dark:border-orange-700 hover-scale">
                <div className="flex items-center space-x-4 mb-0 md:mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Expires On</span>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {subscription.expiryDate ? 
                        new Date(subscription.expiryDate).toLocaleDateString() : 
                        'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-16" id="plans-section">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the plan that best fits your learning goals and unlock premium features
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8">
            {getSubscriptionPlans().map((plan, index) => {
              const IconComponent = getPlanIcon(plan.name);
              const gradient = getPlanGradient(plan.name);
              const features = getPlanFeatures(plan.name);
              const isHovered = hoveredPlan === plan.key;
              const isCurrentPlan = subscription && subscription.planName && 
                subscription.planName.toLowerCase() === plan.name.toLowerCase();
              
              return (
                <div 
                  key={plan.key} 
                  className={`subscription-plan group relative backdrop-blur-xl rounded-3xl shadow-2xl p-8 border transition-all duration-500 transform hover:-translate-y-4 hover:shadow-3xl flex flex-col h-full ${
                    isCurrentPlan 
                      ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 border-4 border-green-500 shadow-green-500/20 md:scale-105' 
                      : 'bg-white/90 dark:bg-gray-800/90 border border-white/30'
                  } ${
                    isHovered ? 'scale-105' : 'scale-100'
                  }`}
                  onMouseEnter={() => setHoveredPlan(plan.key)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 -left-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pulse-glow">
                        <FaCheckCircle className="inline mr-1" />
                        CURRENT PLAN
                      </div>
                    </div>
                  )}

                  {/* Plan Badge */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${
                      isCurrentPlan ? 'ring-4 ring-green-500/30' : ''
                    }`}>
                      <IconComponent className="text-white text-lg" />
                    </div>
                  </div>

                  {/* Popular Badge */}
                  {plan.name.toLowerCase() === 'premium' && !isCurrentPlan && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pulse-glow">
                        <FaFire className="inline mr-1" />
                        Popular
                      </div>
                    </div>
                  )}

                  {/* Pro Badge */}
                  {plan.name.toLowerCase() === 'pro' && !isCurrentPlan && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pulse-glow">
                        <FaGem className="inline mr-1" />
                        PREMIUM
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8 pt-4">
                    <h3 className={`text-3xl font-bold mb-4 ${
                      isCurrentPlan 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-800 dark:text-white'
                    }`}>
                      {plan.name.toUpperCase()}
                      {isCurrentPlan && <span className="ml-2 text-2xl">👑</span>}
                    </h3>
                    {/* Level Access Info */}
                    <div className="mb-2">
                      <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                        {plan.name === 'Free' && '0-3 Level Access'}
                        {plan.name === 'Basic' && '0-6 Level Access'}
                        {plan.name === 'Premium' && '0-9 Level Access'}
                        {plan.name === 'Pro' && '0-10 Level Access'}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-6xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-lg">/month</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                      Duration: 1 month
                    </div>
                  </div>

                  {/* Features - This will take up the remaining space */}
                  <div className="space-y-4 mb-8 flex-grow">
                    {features.map((feature, index) => (
                      <div key={index} className={`stagger-item flex items-center space-x-3 transition-all duration-300 ${
                        feature.included ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {feature.included ? (
                            <FaCheckCircle className="text-white text-xs" />
                          ) : (
                            <FaLock className="text-gray-500 text-xs" />
                          )}
                        </div>
                        <span className={`text-gray-700 dark:text-gray-300 ${
                          feature.included ? 'font-medium' : 'line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button - Now at the bottom */}
                  <div className="mt-auto">
                    <button
                      title='Website In Test Mode You Can Play Free Quizzes Only'
                     // onClick={() => handleSubscribe(plan.key)}
                      disabled={isCurrentPlan}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-white dark:text-white transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-3xl ${
                        isCurrentPlan 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-500 dark:hover:to-emerald-500 cursor-not-allowed opacity-75' 
                          : `bg-gradient-to-r ${gradient} hover:shadow-2xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40`
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        {isCurrentPlan ? (
                          <>
                            <FaCheckCircle className="text-sm" />
                            <span>Current Plan</span>
                          </>
                        ) : (
                          <>
                            <FaRocket className="text-sm" />
                            <span>Get Started Now</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
              Why Choose Premium?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300">
              Discover the amazing benefits that await you
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                icon: FaInfinity,
                title: 'Unlimited Access',
                description: 'Access all premium quizzes and features without any restrictions',
                gradient: 'from-yellow-500 to-red-500'
              },
              {
                icon: FaTrophy,
                title: 'Monthly Rewards',
                description: 'Top 3 eligible users at Level 10 each month win ₹9,999',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: FaHeadset,
                title: 'Priority Support',
                description: 'Get faster response times and dedicated customer support',
                gradient: 'from-green-500 to-teal-500'
              },
              {
                icon: FaChartLine,
                title: 'Advanced Analytics',
                description: 'Track your progress with detailed performance insights',
                gradient: 'from-red-500 to-yellow-500'
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="subscription-benefit bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

                  {/* Monthly Rewards Information */}
        <div className="mb-16">
          <MonthlyRewardsInfo />
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 mb-16 hover-lift">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
                <FaHistory className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                  Transaction History
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Your payment and subscription history
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-white text-lg">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-white text-lg">Plan</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-white text-lg">Amount</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800 dark:text-white text-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">
                        {transaction.planName}
                      </td>
                      <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-bold">
                        ₹{transaction.amount}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          transaction.status === 'completed' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-200'
                            : transaction.status === 'pending'
                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900 dark:to-orange-900 dark:text-yellow-200'
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900 dark:to-pink-900 dark:text-red-200'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-yellow-200 via-red-200 to-pink-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-3xl p-6 sm:p-12 text-white shadow-2xl hover-lift">
          <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-xl mb-4 sm:mb-8 text-gray-600 dark:text-white">
            Join thousands of learners who have already upgraded their experience
          </p>
          <button
            onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 dark:from-yellow-500 dark:to-red-500 dark:hover:from-yellow-600 dark:hover:to-red-600 text-white dark:text-white px-6 py-3 rounded-2xl transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40"
          >
            Choose Your Plan Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage; 