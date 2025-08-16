import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { handleAuthError } from '../utils/authUtils';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCrown, 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaBrain, 
  FaRocket, 
  FaCalendarAlt, 
  FaAward, 
  FaArrowRight,
  FaChartLine,
  FaFire,
  FaBookOpen,
  FaGem,
  FaUserGraduate,
  FaMagic,
  FaUniversity,
  FaSave,
  FaMoneyCheckAlt,
  FaEdit,
  FaCheckCircle,
  FaBuilding,
  FaKey,
  FaPlus
} from 'react-icons/fa';
import { getSubscriptionStatusTextWithTheme } from '../utils/subscriptionUtils';
import ShareComponent from '../components/ShareComponent';
// Level badge icon mapping (same as HomePage)
const levelBadgeIcons = {
  'Zero Level': FaUserGraduate,
  Rookie: FaStar,
  Explorer: FaRocket,
  Thinker: FaBrain,
  Strategist: FaChartLine,
  Achiever: FaAward,
  Mastermind: FaGem,
  Champion: FaTrophy,
  Prodigy: FaMedal,
  'Quiz Wizard': FaMagic,
  Legend: FaCrown,
  Default: FaStar,
};


const levels = [
  { number: 1, name: 'Rookie', quizzes: 2 },
  { number: 2, name: 'Explorer', quizzes: 4 },
  { number: 3, name: 'Thinker', quizzes: 8 },
  { number: 4, name: 'Strategist', quizzes: 16 },
  { number: 5, name: 'Achiever', quizzes: 32 },
  { number: 6, name: 'Mastermind', quizzes: 64 },
  { number: 7, name: 'Champion', quizzes: 128 },
  { number: 8, name: 'Prodigy', quizzes: 256 },
  { number: 9, name: 'Quiz Wizard', quizzes: 512 },
  { number: 10, name: 'Legend', quizzes: 1024 }
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [playedQuizzes, setPlayedQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [bankDetails, setBankDetails] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branchName: ''
  });
  const [bankFormErrors, setBankFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [bankDetailsSaved, setBankDetailsSaved] = useState(false);
  useEffect(() => {
    const fetchProfileAndQuizzes = async () => {
      try {
        const profileRes = await API.getProfile();
        setStudent(profileRes);
        try {
          const historyRes = await API.getQuizHistory();
          setPlayedQuizzes(historyRes.data?.attempts || []);
        } catch (quizErr) {
          setPlayedQuizzes([]); // Still show profile even if quizzes fail
        }
        
        // Check if user is eligible for bank details
        if (isEligibleForBankDetails(profileRes)) {
          try {
            const bankRes = await API.getBankDetails();
            if (bankRes.success && bankRes.bankDetail) {
              setBankDetails(bankRes.bankDetail);
              // Pre-fill form data with existing bank details
              setBankFormData({
                accountHolderName: bankRes.bankDetail.accountHolderName,
                accountNumber: bankRes.bankDetail.accountNumber,
                bankName: bankRes.bankDetail.bankName,
                ifscCode: bankRes.bankDetail.ifscCode,
                branchName: bankRes.bankDetail.branchName
              });
            }
          } catch (bankErr) {
            // It's okay if bank details don't exist yet
            console.log('No bank details found or error fetching them:', bankErr);
          }
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        handleAuthError(err, navigate);
        setError('Failed to load profile');
      }
    };

    fetchProfileAndQuizzes();
  }, [navigate]);
  
  // Check if user is eligible for bank details (level 10 or pro subscription)
  const isEligibleForBankDetails = (user) => {
    if (!user) return false;
    
    const isLevelTen = user.levelInfo?.currentLevel?.number === 10;
    const isProPlan = user.subscriptionStatus === 'pro';
    
    return isLevelTen || isProPlan;
  };
  
  // Handle bank form input changes
  const handleBankFormChange = (e) => {
    const { name, value } = e.target;
    setBankFormData({
      ...bankFormData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (bankFormErrors[name]) {
      setBankFormErrors({
        ...bankFormErrors,
        [name]: ''
      });
    }
  };
  
  // Validate bank form
  const validateBankForm = () => {
    const errors = {};
    
    if (!bankFormData.accountHolderName.trim()) {
      errors.accountHolderName = 'Account holder name is required';
    }
    
    if (!bankFormData.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(bankFormData.accountNumber.trim())) {
      errors.accountNumber = 'Please enter a valid account number (9-18 digits)';
    }
    
    if (!bankFormData.bankName.trim()) {
      errors.bankName = 'Bank name is required';
    }
    
    if (!bankFormData.ifscCode.trim()) {
      errors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankFormData.ifscCode.trim())) {
      errors.ifscCode = 'Please enter a valid IFSC code (e.g., SBIN0123456)';
    }
    
    if (!bankFormData.branchName.trim()) {
      errors.branchName = 'Branch name is required';
    }
    
    setBankFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit bank details
  const handleBankFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBankForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await API.saveBankDetails(bankFormData);
      
      if (response.success) {
        setBankDetails(response.bankDetail);
        setShowBankForm(false);
        setBankDetailsSaved(true);
        
        // Show success message temporarily
        setTimeout(() => {
          setBankDetailsSaved(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
      setBankFormErrors({
        ...bankFormErrors,
        general: error.message || 'Failed to save bank details. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const showResult = (quiz) => {
    navigate("/quiz-result", {state: {quizResult: quiz}})
  }
  // Use new backend level structure
  const userLevel = student?.levelInfo?.currentLevel || { number: 0, name: 'Zero Level' };
  const nextLevel = student?.levelInfo?.nextLevel;
  const quizzesPlayed = student?.levelInfo?.progress?.quizzesPlayed || 0;
  const highScoreQuizzes = student?.levelInfo?.progress?.highScoreQuizzes || 0;
  const quizzesToNextLevel = student?.levelInfo?.progress?.highScoreQuizzesToNextLevel || 0;
  const progressPercentage = student?.levelInfo?.progress?.progressPercentage || 0;
  const highScoreRate = student?.levelInfo?.stats?.highScoreRate || 0;
const message =
  "Refer friends and unlock paid subscriptions automatically on milestones!\n" +
  "10 referrals = ₹99 BASIC plan,\n" +
  "50 = ₹499 PREMIUM plan,\n" +
  "100 = ₹999 PRO plan.\n" +
  "Check out my referral code:\n" +
  `${student?.referralCode}\n` +
  "Join and get free subscription!";

  if (error)
    return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-red-100 dark:from-gray-900 dark:via-slate-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      </div>
    );

  if (!student)
    return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-red-100 dark:from-gray-900 dark:via-slate-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
  );
  
  

  return (
  <>
    <div className="min-h-screen bg-subg-light dark:bg-subg-dark relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-green-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 mt-0 sm:mt-16 relative z-10">
        
        {/* Enhanced Hero Section */}
        <div className="text-center mb-10 sm:mb-16 profile-hero">
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl floating-animation">
              <FaUser className="text-white text-2xl sm:text-4xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-green-400 to-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <FaCrown className="text-white text-xs sm:text-sm" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-gray-600 dark:text-gray-100 mb-4 sm:mb-6">
            {student.name?.split(' ')[0]}'s Profile
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Track your progress, achievements, and level up your quiz journey
          </p>
        </div>

  {/* Enhanced Profile Details Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 sm:p-8 border border-white/30 mb-10 sm:mb-16 hover-lift">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <div className="w-14 sm:w-20 h-14 sm:h-20 bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
              <FaUser className="text-white text-xl sm:text-3xl" />
            </div>
            <div className='text-center sm:text-left'>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                Profile Details
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                Your personal information and account status
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Reward Center Referral Section */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-red-900/50 to-yellow-700/50 rounded-3xl p-6 lg:p-10 shadow-xl border-2 border-purple-300/30 relative overflow-hidden mb-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-white text-sm font-medium mb-1">Referrals Joined</span>
                    <div className="text-xl lg:text-3xl font-bold text-yellow-300 bg-yellow-900/30 px-6 py-2 rounded-lg border-2 border-yellow-400 shadow">{student.referralCount || 0}</div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-semibold">Progress</span>
                    <span className="text-yellow-200 text-xs font-semibold">{student.referralCount || 0}/100</span>
                  </div>
                  <div className="w-full bg-purple-200/30 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-700 h-4 rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${Math.min((student.referralCount || 0),100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white font-semibold">
                    
                    <span className="flex flex-col items-center">
                      <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full font-bold text-center">BASIC - ₹99</span>
                      <span>10 Users</span>
                    </span>
                    <span className="flex flex-col items-center">
                      <span className="bg-blue-400 text-blue-900 px-2 py-1 rounded-full font-bold text-center">PREMIUM - ₹499</span>
                      <span>50 Users</span>
                    </span>
                    <span className="flex flex-col items-center">
                      <span className="bg-pink-400 text-pink-900 px-2 py-1 rounded-full font-bold text-center">PRO - ₹999</span>
                      <span>100 Users</span>
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-center flex-col items-center">
                    <span className="text-white text-sm font-medium mb-1">Invite Friends to Get Bonus</span>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl lg:text-2xl font-bold text-white bg-gray-700/80 px-2 py-2 rounded-lg tracking-widest select-all border-2 border-purple-300 shadow">{student.referralCode}</span>
                      <button
                        className="px-3 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg shadow hover:bg-yellow-500 transition"
                        onClick={() => {navigator.clipboard.writeText(student.referralCode);}}
                        title="Copy Code"
                      >Copy</button>
                    </div>
                    <ShareComponent
                      url={window.location.origin}
                      text={message}
                    />
                </div>
                <div className="mt-4 text-xs text-white/80 text-center">
                  Refer friends and unlock paid subscriptions automatically on milestones!<br/>
                  10 referrals = ₹99 BASIC plan, 50 = ₹499 PREMIUM plan, 100 = ₹999 PRO plan.
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/30 dark:to-red-900/30 rounded-2xl p-3 lg:p-6 border border-yellow-200 dark:border-yellow-700 hover-scale">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FaUser className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Full Name</span>
                    <p className="text-md lg:text-2xl font-bold text-gray-800 dark:text-white">{student.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-3 lg:p-6 border border-green-200 dark:border-green-700 hover-scale">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Email Address</span>
                    <p className=" text-md lg:text-2xl font-bold text-gray-800 dark:text-white">{student.email}</p>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="space-y-6">
               <div className="bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/30 dark:to-yellow-900/30 rounded-2xl p-3 lg:p-6 border border-red-200 dark:border-red-700 hover-scale">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Phone Number</span>
                    <p className="text-md lg:text-2xl font-bold text-gray-800 dark:text-white">{student.phone}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-3 lg:p-6 border border-yellow-200 dark:border-yellow-700 hover-scale">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FaCrown className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Subscription Status</span>
                    {(() => {
                      const statusInfo = getSubscriptionStatusTextWithTheme(student.subscriptionStatus);
                      return (
                        <div className={`text-xl font-bold ${statusInfo.textColor}`}>
                          {statusInfo.text}
                          </div>
                        );
                    })()}
                  </div>
                </div>
              </div>
              
              {student.subscription?.isActive && (
                <>
                  <div className="bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/30 dark:to-red-900/30 rounded-2xl p-3 lg:p-6 border border-yellow-200 dark:border-yellow-700 hover-scale">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FaStar className="text-white text-xl" />
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Current Plan</span>
                        {(() => {
                          const statusInfo = getSubscriptionStatusTextWithTheme(student.subscriptionStatus);
                          return (
                            <>
                              <span className={`text-2xl font-bold ${statusInfo.textColor}`}>
                                {statusInfo.text}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Expires On</span>
                        <p className="text-md sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                          {new Date(student.subscription?.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
             
              
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl p-3 lg:p-6 border border-emerald-200 dark:border-emerald-700 hover-scale">
                <div className="flex items-center space-x-4">
                  <div className="min-h-12 min-w-12 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <FaAward className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Achievement Badges</span>
                    <p className="text-md lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                      {student.badges && student.badges.length > 0
                        ? student.badges.join(', ')
                        : 'No badges yet'}
                    </p>
                  </div>
                </div>
              </div>

        </div>

        {/* Bank Details Card - Only shown for eligible users (level 10 or pro subscription) */}
        {isEligibleForBankDetails(student) && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 mb-16 hover-lift">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-teal-500 via-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
                <FaUniversity className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                  Bank Details
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {bankDetails ? 'Your banking information' : 'Add your bank account information'}
                </p>
              </div>
            </div>

            {/* Success Message */}
            {bankDetailsSaved && (
              <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-4 text-green-700 dark:text-green-300 flex items-center">
                <FaCheckCircle className="mr-2" /> Bank details saved successfully!
              </div>
            )}

            {/* Bank Details Display */}
            {bankDetails && !showBankForm ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-3 lg:p-6 border border-blue-200 dark:border-blue-700 hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Account Holder</span>
                      <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.accountHolderName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-3 lg:p-6 border border-purple-200 dark:border-purple-700 hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FaMoneyCheckAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Account Number</span>
                      <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">
                        {bankDetails.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-3 lg:p-6 border border-green-200 dark:border-green-700 hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <FaUniversity className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Bank Name</span>
                      <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.bankName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-3 lg:p-6 border border-yellow-200 dark:border-yellow-700 hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Branch</span>
                      <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.branchName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl p-3 lg:p-6 border border-red-200 dark:border-red-700 hover-scale lg:col-span-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FaKey className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">IFSC Code</span>
                      <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.ifscCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Bank Details Form */}
            {showBankForm ? (
              <form onSubmit={handleBankFormSubmit} className="space-y-6 mb-8">
                {bankFormErrors.general && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300">
                    {bankFormErrors.general}
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={bankFormData.accountHolderName}
                      onChange={handleBankFormChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        bankFormErrors.accountHolderName 
                          ? 'border-red-500 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter account holder name"
                    />
                    {bankFormErrors.accountHolderName && (
                      <p className="text-red-500 text-sm mt-1">{bankFormErrors.accountHolderName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankFormData.accountNumber}
                      onChange={handleBankFormChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        bankFormErrors.accountNumber 
                          ? 'border-red-500 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter account number"
                    />
                    {bankFormErrors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">{bankFormErrors.accountNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={bankFormData.bankName}
                      onChange={handleBankFormChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        bankFormErrors.bankName 
                          ? 'border-red-500 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter bank name"
                    />
                    {bankFormErrors.bankName && (
                      <p className="text-red-500 text-sm mt-1">{bankFormErrors.bankName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={bankFormData.ifscCode}
                      onChange={handleBankFormChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        bankFormErrors.ifscCode 
                          ? 'border-red-500 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter IFSC code"
                    />
                    {bankFormErrors.ifscCode && (
                      <p className="text-red-500 text-sm mt-1">{bankFormErrors.ifscCode}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 lg:col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      name="branchName"
                      value={bankFormData.branchName}
                      onChange={handleBankFormChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        bankFormErrors.branchName 
                          ? 'border-red-500 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter branch name"
                    />
                    {bankFormErrors.branchName && (
                      <p className="text-red-500 text-sm mt-1">{bankFormErrors.branchName}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowBankForm(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        <span>Save Bank Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setShowBankForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  {bankDetails ? (
                    <>
                      <FaEdit className="text-sm" />
                      <span>Edit Bank Details</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-sm" />
                      <span>Add Bank Details</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Level Progression Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 mb-16 hover-lift">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
              <FaTrophy className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                Level Progression
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your journey from Zero Level to Legend
              </p>
            </div>
          </div>

          {/* Current Level Display */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                {(() => {
                  const BadgeIcon = levelBadgeIcons[userLevel.name] || levelBadgeIcons.Default;
                  return (
                    <BadgeIcon className="text-yellow-500 dark:text-yellow-200 text-xl lg:text-2xl lg:text-5xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                  );
                })()}
              </div>
              <div className="text-left">
                <div className="text-xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                  Level {userLevel.number} - {userLevel.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your Current Level
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* High-Score Quizzes */}
            <div className="text-center p-2 lg:p-8 bg-gradient-to-br from-yellow-50 to-red-100 dark:from-yellow-900/30 dark:to-red-900/30 rounded-3xl border border-yellow-200 dark:border-yellow-700 hover-scale">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaFire className="text-white text-2xl" />
              </div>
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{highScoreQuizzes}</div>
              <div className="bg-gradient-to-r from-red-50 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30 rounded-3xl border border-red-200 dark:border-red-700 hover-scale">
                <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">High-Score Quizzes</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">75% + Score</div>
              </div>
            </div>
            {/* Total Quizzes Played */}
            <div className="text-center p-2 lg:p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl border border-green-200 dark:border-green-700 hover-scale">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{quizzesPlayed}</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Total Quizzes Played</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Attempted</div>
            </div>
            {/* Success Rate */}
            <div className="text-center p-2 lg:p-8 bg-gradient-to-br from-red-50 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30 rounded-3xl border border-red-200 dark:border-red-700 hover-scale">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{highScoreRate}%</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Success Rate</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">High Scores</div>
            </div>
          </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Progress to Next Level</span>
              <span className="text-gray-600 dark:text-gray-400 font-semibold text-lg">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-yellow-500 via-purple-500 to-red-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Enhanced Next Level Info */}
          {nextLevel ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-3xl p-2 lg:p-8 border border-yellow-200 dark:border-yellow-700 hover-scale">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  {(() => {
                    const BadgeIcon = levelBadgeIcons[nextLevel.name] || levelBadgeIcons.Default;
                    return (
                      <BadgeIcon className="text-yellow-500 dark:text-yellow-200 text-3xl lg:text-5xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                    );
                  })()}
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Next Level: {nextLevel.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Level {nextLevel.number}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                Need <span className="font-bold text-green-600 text-lg lg:text-xl">{quizzesToNextLevel}</span> more high-score quizzes (75%+) to unlock Level {nextLevel.number}.
              </p>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Required: {nextLevel.quizzesRequired} total high-score quizzes
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 border border-green-200 dark:border-green-700 hover-scale">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <FaCrown className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Congratulations!</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                    You have reached the highest level! You are a true Quiz Legend! 🏆
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <button
              className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 dark:from-yellow-500 dark:to-red-500 dark:hover:from-yellow-600 dark:hover:to-red-600 text-white dark:text-white px-4 lg:px-8 py-2 lg:py-4 rounded-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40 flex items-center justify-center space-x-3 mx-auto"
              onClick={() => { navigate('/levels'); }}
            >
              <FaArrowRight className="text-sm" />
              <span>View All Levels</span>
            </button>
          </div>
          {/* Enhanced Quiz History Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 mt-2 lg:mt-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
              <FaBrain className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                Quiz History
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-md lg:text-lg">
                Your quiz attempts and achievements
              </p>
            </div>
          </div>
          
          {playedQuizzes?.length === 0 ? (
            <div className="text-center py-4 lg:py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBrain className="text-white text-4xl" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold mb-2">No quizzes played yet.</p>
              <p className="text-gray-500 dark:text-gray-500 text-lg">Start your quiz journey today!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-8">
              {playedQuizzes?.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  onClick={() => showResult(item)}
                  className="group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-3xl p-2 lg:p-8 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 hover:scale-105 hover-lift"
                >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaMedal className="text-white text-2xl" />
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.scorePercentage >= 75
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {item.scorePercentage >= 75 ? '✅ High Score' : '📝 Completed'}
                      </div>
                    </div>
                  
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg lg:text-xl">
                      {item.quizTitle || 'Untitled Quiz'}
                    </h3>
                  
                    <div className="space-y-3 text-base mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Score:</span>
                        <span className="font-bold text-gray-800 dark:text-white text-lg">{item.scorePercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Correct:</span>
                        <span className="font-bold text-gray-800 dark:text-white">{item.score}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="font-bold text-yellow-600 dark:text-yellow-400">{item.categoryName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-bold text-gray-800 dark:text-white">
                          {new Date(item.attemptedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  
                    <div className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 dark:from-yellow-500 dark:to-red-500 dark:hover:from-yellow-600 dark:hover:to-red-600 text-white dark:text-white px-4 lg:px-8 py-2 lg:py-4 rounded-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-yellow-500/25 hover:dark:shadow-yellow-500/40 flex items-center justify-center space-x-3 mx-auto">
                      <span className="text-base">View Result</span>
                      <FaArrowRight className="ml-2 text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        </div>

    </>
  );
}

export default ProfilePage;
