import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { handleAuthError } from '../utils/authUtils';
import { toast } from 'react-toastify';
import { useRewards } from '../hooks/useRewards';
import MonthlyRewardsInfo from '../components/MonthlyRewardsInfo';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCrown, 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaBrain,  
  FaAward, 
  FaArrowRight,
  FaChartLine,
  FaFire,
  FaBookOpen,
  FaUserGraduate,
  FaMagic,
  FaUniversity,
  FaSave,
  FaMoneyCheckAlt,
  FaEdit,
  FaCheckCircle,
  FaBuilding,
  FaKey,
  FaPlus,
  FaRocket,
  FaGem,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPencilAlt,
  FaStickyNote,
  FaSearch,
  FaMoneyBill
} from 'react-icons/fa';
import { getSubscriptionStatusTextWithTheme } from '../utils/subscriptionUtils';
import ShareComponent from '../components/ShareComponent';
import MobileAppWrapper from '../components/MobileAppWrapper';
import PaymentTransactions from '../components/PaymentTransactions';
// Level badge icon mapping
const levelBadgeIcons = {
  'Starter': FaUserGraduate,
  'Rookie': FaStar,
  'Explorer': FaRocket,
  'Thinker': FaBrain,
  'Strategist': FaChartLine,
  'Achiever': FaAward,
  'Mastermind': FaGem,
  'Champion': FaTrophy,
  'Prodigy': FaMedal,
  'Wizard': FaMagic,
  'Legend': FaCrown,
  Default: FaStar,
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [playedQuizzes, setPlayedQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [bankDetails, setBankDetails] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  
  // Get rewards data
  const { rewards: rewardsData, loading: rewardsLoading } = useRewards();
    console.log(rewardsData, 'rewardsData')
  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      x: '',
      youtube: ''
    }
  });
  const [editProfileErrors, setEditProfileErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
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
  const [profileCompletion, setProfileCompletion] = useState(null);
  
  // Separate function to fetch profile completion data
  const fetchProfileCompletion = async () => {
    try {
      const res = await API.getProfile();
      console.log('🔍 Profile Completion API Response:', res);
      
      if (res?.success && res.user?.profileCompletion) {
        console.log('✅ Profile completion data found:', res.user.profileCompletion);
        setProfileCompletion(res.user.profileCompletion);
      } else {
        console.log('❌ Profile completion data not found');
        // Set default data
        setProfileCompletion({
          percentage: 0,
          isComplete: false,
          fields: [
            { name: 'Full Name', completed: false, value: '' },
            { name: 'Email Address', completed: false, value: '' },
            { name: 'Phone Number', completed: false, value: '' },
            { name: 'Social Media Link', completed: false, value: '' }
          ],
          completedFields: 0,
          totalFields: 4
        });
      }
    } catch (err) {
      console.log('❌ Failed to fetch profile completion:', err);
      // Set default data on error
      setProfileCompletion({
        percentage: 0,
        isComplete: false,
        fields: [
          { name: 'Full Name', completed: false, value: '' },
          { name: 'Email Address', completed: false, value: '' },
          { name: 'Phone Number', completed: false, value: '' },
          { name: 'Social Media Link', completed: false, value: '' }
        ],
        completedFields: 0,
        totalFields: 4
      });
    }
  };
  
  const fetchProfileAndQuizzes = async () => {
    try {
      const profileRes = await API.getProfile();
      console.log('🔍 Profile API Response in ProfilePage:', profileRes);
      
      // Set the user data correctly
      if (profileRes?.success && profileRes?.user) {
        setStudent(profileRes.user);
        console.log('✅ User data set:', profileRes.user);
      } else {
        console.log('❌ No user data found in response');
        setStudent({});
      }
      
      // Set profile completion data if available
      if (profileRes?.user?.profileCompletion) {
        console.log('✅ Profile completion data found in ProfilePage:', profileRes.user.profileCompletion);
        setProfileCompletion(profileRes.user.profileCompletion);
      } else {
        console.log('❌ Profile completion data not found in ProfilePage response');
        console.log('Response structure:', {
          success: profileRes?.success,
          hasUser: !!profileRes?.user,
          hasProfileCompletion: !!profileRes?.user?.profileCompletion
        });
        
        // Set default profile completion data
        setProfileCompletion({
          percentage: 0,
          isComplete: false,
          fields: [
            { name: 'Full Name', completed: false, value: '' },
            { name: 'Email Address', completed: false, value: '' },
            { name: 'Phone Number', completed: false, value: '' },
            { name: 'Social Media Link', completed: false, value: '' }
          ],
          completedFields: 0,
          totalFields: 4
        });
      }
      try {
        const historyRes = await API.getQuizHistory();
        setPlayedQuizzes(historyRes.data?.attempts || []);
      } catch (quizErr) {
        setPlayedQuizzes([]); // Still show profile even if quizzes fail
      }
      
      // Check if user is eligible for bank details
      console.log('🔍 Checking bank details eligibility for user:', profileRes?.user);
      if (isEligibleForBankDetails(profileRes)) {
        console.log('✅ User is eligible for bank details, fetching...');
        try {
          const bankRes = await API.getBankDetails();
          console.log('📦 Bank details API response:', bankRes);
          if (bankRes.success && bankRes.bankDetail) {
            console.log('✅ Bank details found:', bankRes.bankDetail);
            setBankDetails(bankRes.bankDetail);
            // Pre-fill form data with existing bank details
            setBankFormData({
              accountHolderName: bankRes.bankDetail.accountHolderName,
              accountNumber: bankRes.bankDetail.accountNumber,
              bankName: bankRes.bankDetail.bankName,
              ifscCode: bankRes.bankDetail.ifscCode,
              branchName: bankRes.bankDetail.branchName
            });
          } else {
            console.log('❌ No bank details in response:', bankRes);
          }
        } catch (bankErr) {
          // Check if it's a 404 error (no bank details yet) vs other errors
          if (bankErr.response && bankErr.response.status === 404) {
            // User doesn't have bank details yet - this is normal
            console.log('ℹ️ No bank details found yet - user can add them');
            setBankDetails(null);
          } else {
            // Actual error occurred
            console.error('❌ Error fetching bank details:', bankErr);
            // Don't show error to user since bank details are optional
          }
        }
      } else {
        console.log('❌ User is not eligible for bank details');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      handleAuthError(err, navigate);
      setError('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfileAndQuizzes();
    fetchProfileCompletion();
  }, [navigate]);
  
  // Check if user is eligible for bank details (level 10 or pro subscription)
  const isEligibleForBankDetails = (user) => {
    if (!user) {
      console.log('❌ No user data for eligibility check');
      return false;
    }
    
    const isLevelTen = user.levelInfo?.currentLevel?.number === 10;
    const isProPlan = user.subscriptionStatus === 'pro';
    
    console.log('🔍 Bank Details Eligibility Check:', {
      userLevel: user.levelInfo?.currentLevel?.number,
      subscriptionStatus: user.subscriptionStatus,
      isLevelTen,
      isProPlan,
      eligible: isLevelTen || isProPlan
    });
    
    // TEMPORARY: Allow all users to see bank details for testing
    // TODO: Remove this and use proper eligibility check
    console.log('🔧 TEMPORARY: Allowing all users to see bank details');
    return true;
    
    // Original eligibility check (commented out for testing)
    // return isLevelTen || isProPlan;
  };

  // Check if user has Free or Basic plan subscription
  const isFreeOrBasicPlanUser = (user) => {
    if (!user) {
      console.log('❌ No user data for Free/Basic plan check');
      return false;
    }
    
    const isFreePlan = user.subscriptionStatus === 'free';
    const isBasicPlan = user.subscriptionStatus === 'basic';
    
    console.log('🔍 Free/Basic Plan Check:', {
      subscriptionStatus: user.subscriptionStatus,
      isFreePlan,
      isBasicPlan,
      shouldShowProfileCompletion: isFreePlan || isBasicPlan
    });
    
    return isFreePlan || isBasicPlan;
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
        // Show success message
        toast.success('Bank details saved successfully!');
      }
    } catch (err) {
      console.error('Error saving bank details:', err);
      toast.error(err.response?.data?.message || 'Failed to save bank details');
    } finally {
      setIsSaving(false);
    }
  };

  // Edit Profile Functions
  const handleEditProfile = () => {
    setEditProfileData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      socialLinks: {
        instagram: student.socialLinks?.instagram || '',
        facebook: student.socialLinks?.facebook || '',
        x: student.socialLinks?.x || '',
        youtube: student.socialLinks?.youtube || ''
      }
    });
    setEditProfileErrors({});
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditProfileData({
      name: '',
      email: '',
      phone: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        x: '',
        youtube: ''
      }
    });
    setEditProfileErrors({});
  };

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    
    // Handle social links separately
    if (name.startsWith('socialLinks.')) {
      const socialPlatform = name.split('.')[1];
      setEditProfileData({
        ...editProfileData,
        socialLinks: {
          ...editProfileData.socialLinks,
          [socialPlatform]: value
        }
      });
    } else {
      setEditProfileData({
        ...editProfileData,
        [name]: value
      });
    }
    
    // Clear error for this field when user types
    if (editProfileErrors[name]) {
      setEditProfileErrors({
        ...editProfileErrors,
        [name]: ''
      });
    }
  };

  const validateEditProfile = () => {
    const errors = {};
    
    if (!editProfileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editProfileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editProfileData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editProfileData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(editProfileData.phone.trim())) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    
    // Validate social media URLs
    const urlRegex = /^https?:\/\/.+/;
    const socialPlatforms = ['instagram', 'facebook', 'x', 'youtube'];
    
    socialPlatforms.forEach(platform => {
      const url = editProfileData.socialLinks[platform];
      if (url && url.trim() && !urlRegex.test(url.trim())) {
        errors[`socialLinks.${platform}`] = `Please enter a valid URL for ${platform}`;
      }
    });
    
    setEditProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateEditProfile()) {
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      const response = await API.updateProfile(editProfileData);
      if(response.success){
        setStudent(response.user);
        setIsEditingProfile(false);
        toast.success('Profile updated successfully!');
        fetchProfileAndQuizzes();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const showResult = (quiz) => {
    navigate("/quiz-result", {state: {quizResult: quiz}})
  }

  // Function to extract username from social media URLs
  const extractUsername = (url, platform) => {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      switch (platform) {
        case 'instagram':
          // Extract username from instagram.com/username or instagram.com/@username
          const instagramMatch = pathname.match(/\/(?:@)?([^\/\?]+)/);
          return instagramMatch ? instagramMatch[1].replace('@', '') : '';
        
        case 'facebook':
          // Extract username from facebook.com/username
          const facebookMatch = pathname.match(/\/([^\/\?]+)/);
          return facebookMatch ? facebookMatch[1] : '';
        
        case 'x':
          // Extract username from x.com/username or twitter.com/username
          const xMatch = pathname.match(/\/([^\/\?]+)/);
          return xMatch ? xMatch[1] : '';
        
        case 'youtube':
          // Extract username from youtube.com/@username or youtube.com/c/username or youtube.com/user/username
          const youtubeMatch = pathname.match(/\/(?:@|c\/|user\/)([^\/\?]+)/);
          return youtubeMatch ? youtubeMatch[1] : '';
        
        default:
          return '';
      }
    } catch (error) {
      console.error('Error extracting username:', error);
      return '';
    }
  };
  // Use new backend level structure
  const userLevel = student?.levelInfo?.currentLevel || { number: 0, name: 'Starter' };
  const nextLevel = student?.levelInfo?.nextLevel;
  const quizzesPlayed = student?.levelInfo?.progress?.quizzesPlayed || 0;
  const highScoreQuizzes = student?.monthlyProgress?.highScoreWins || 0;
  const highScoreRate = student?.monthlyProgress?.accuracy || 0;
const message =
  "Refer with your friends and unlock paid subscriptions automatically on milestones!\n" +
              "2 referrals = ₹9 BASIC plan,\n" +
            "5 referrals = ₹49 PREMIUM plan,\n" +
            "10 referrals = ₹99 PRO plan.\n" +
  "Check out my Referral Code:\n" +
  `${student?.referralCode}\n` +
  "Join and get Paid Subscriptions Free!";

  if (error)
    return (
  <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      </div>
    );

  if (!student)
    return (
  <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
  );
  
  

  return (
  <MobileAppWrapper title="Profile">
    <Helmet>
      <title>My Profile - SUBG QUIZ User Dashboard</title>
      <meta name="description" content="View your SUBG QUIZ profile, track your progress, manage your account settings, and see your quiz achievements and rewards." />
      <meta name="keywords" content="SUBG QUIZ profile, user dashboard, quiz progress, account settings, quiz achievements" />
      <meta property="og:title" content="My Profile - SUBG QUIZ User Dashboard" />
      <meta property="og:description" content="View your SUBG QUIZ profile, track your progress, manage your account settings, and see your quiz achievements and rewards." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="My Profile - SUBG QUIZ User Dashboard" />
      <meta name="twitter:description" content="View your SUBG QUIZ profile, track your progress, manage your account settings, and see your quiz achievements and rewards." />
    </Helmet>
    <div className="container mx-auto min-h-screen bg-gray-100 dark:bg-gray-900">
      <div>
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800">
          {/* Cover Photo Area */}
          <div className="h-20 lg:h-32 bg-gradient-to-r from-red-500 to-yellow-600 relative">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
          </div>
          
          {/* Profile Info */}
          <div className="px-2 lg:px-4 pb-2 lg:pb-4 relative">
            {/* Profile Picture */}
            <div className="flex items-end -mt-16 mb-4">
              <div className="w-20 lg:w-24 h-20 lg:h-24 text-2xl font-bold bg-white dark:bg-gray-800 rounded-full border-2 border-gray-400 dark:border-gray-600 shadow-lg flex items-center justify-center">
              {student?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-4 flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{student?.name || 'User'}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{student?.levelInfo?.currentLevel?.name || 'Level 0'}</strong></p>
              </div>
              <button
                onClick={handleEditProfile}
                className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <div className='flex justify-between items-center gap-2'><span><FaPencilAlt /></span> <span>Edit</span></div>
              </button>
            </div>
          </div>
        </div>

        {/* Facebook-style Profile Details */}
        <div className="bg-white dark:bg-gray-800 mt-2 p-0 lg:p-4">
          {/* Profile Completion Progress Bar - Only show for Free or Basic plan users */}
          {isFreeOrBasicPlanUser(student) && profileCompletion ? (
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-2 lg:p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaUserGraduate className="text-green-600 dark:text-green-400" />
                    Profile Completion
                  </h3>
                  <span className={`text-md lg:text-2xl font-bold ${profileCompletion.percentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {profileCompletion.percentage === 100 ? 'Completed ✅' : `${profileCompletion.percentage}%`}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ease-in-out ${
                      profileCompletion.percentage === 100 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                    }`}
                    style={{width: `${profileCompletion.percentage}%`}}
                  ></div>
                </div>
                
                {/* Status Message */}
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {profileCompletion.percentage === 100 
                    ? '🎉 Congratulations! Your profile is complete and you have received your Basic Subscription reward!'
                    : `Complete ${4 - profileCompletion.completedFields} more field${4 - profileCompletion.completedFields === 1 ? '' : 's'} to get 100% and unlock your Basic Subscription reward!`
                  }
                </div>
                
                {/* Field Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  {profileCompletion.fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{field.name}</span>
                      <span className={field.completed ? 'text-green-500' : 'text-red-500'}>
                        {field.completed ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Reward Info */}
                {profileCompletion.percentage === 100 && (
                  <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <FaCrown className="text-lg" />
                      <span className="font-semibold">You've earned a Basic Subscription (₹9 value) for 30 days!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : isFreeOrBasicPlanUser(student) ? (
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    Loading profile completion data...
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* About Section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
          </div>

          {/* Profile Information - Show either details or edit form */}
          {!isEditingProfile && (
            // Show Profile Details
            <div className="px-4 py-3 space-y-4">
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{student?.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white font-medium">{student?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              {/* Subscription Status */}
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <FaCrown className="text-yellow-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Subscription</p>
                    {(() => {
                      const statusInfo = getSubscriptionStatusTextWithTheme(student.subscriptionStatus);
                      return (
                        <p className={`font-medium ${statusInfo.textColor}`}>
                          {statusInfo.text}
                        </p>
                      );
                    })()}
                    {/* Subscription Expiry Date */}
                    {student?.subscriptionExpiry && student.subscriptionStatus !== 'free' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Expires: {new Date(student.subscriptionExpiry).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <Link 
                  to="/subscription" 
                  className="text-sm px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center space-x-1"
                >
                  <FaRocket className="text-xs" />
                  <span>{student.subscriptionStatus === 'free' ? 'Upgrade' : 'Manage'}</span>
                </Link>
              </div>

              {/* Social Media Links */}
              {(student.socialLinks?.instagram || student.socialLinks?.facebook || student.socialLinks?.x || student.socialLinks?.youtube) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Social Media</h3>
                  <div className="space-y-2">
                    {student.socialLinks?.instagram && (
                      <a
                        href={student.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaInstagram className="text-pink-500 text-lg" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Instagram</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{extractUsername(student.socialLinks.instagram, 'instagram')}</p>
                        </div>
                      </a>
                    )}
                    
                    {student.socialLinks?.facebook && (
                      <a
                        href={student.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaFacebookF className="text-blue-600 text-lg" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Facebook</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{extractUsername(student.socialLinks.facebook, 'facebook')}</p>
                        </div>
                      </a>
                    )}
                    
                    {student.socialLinks?.x && (
                      <a
                        href={student.socialLinks.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaTwitter className="text-black dark:text-white text-lg" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">X (Twitter)</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{extractUsername(student.socialLinks.x, 'x')}</p>
                        </div>
                      </a>
                    )}
                    
                    {student.socialLinks?.youtube && (
                      <a
                        href={student.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaYoutube className="text-red-600 text-lg" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">YouTube</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{extractUsername(student.socialLinks.youtube, 'youtube')}</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Subscription Details */}
        {student.subscription?.isActive && (
                  <>
                    <div className="bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/30 dark:to-red-900/30 rounded-2xl p-3 lg:p-6 border border-yellow-200 dark:border-yellow-700">
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
                                <span className={`text-xl lg:text-2xl font-bold ${statusInfo.textColor}`}>
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

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <div className="bg-white dark:bg-gray-800 mt-2 lg:mt-4">
            <div className="px-4 py-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
                
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editProfileData.name}
                    onChange={handleEditProfileChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                      editProfileErrors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {editProfileErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{editProfileErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editProfileData.email}
                    onChange={handleEditProfileChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                      editProfileErrors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {editProfileErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{editProfileErrors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editProfileData.phone}
                    onChange={handleEditProfileChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                      editProfileErrors.phone 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your phone number (10 digits)"
                  />
                  {editProfileErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{editProfileErrors.phone}</p>
                  )}
                </div>

                {/* Social Media Links Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Social Media Links (Optional)</h4>
                  <div className="space-y-3">
                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span className="flex items-center space-x-2">
                          <FaInstagram className="text-pink-500" />
                          <span>Instagram</span>
                        </span>
                      </label>
                      <input
                        type="url"
                        name="socialLinks.instagram"
                        value={editProfileData.socialLinks.instagram}
                        onChange={handleEditProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                          editProfileErrors['socialLinks.instagram'] 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="https://instagram.com/yourusername"
                      />
                      {editProfileErrors['socialLinks.instagram'] && (
                        <p className="text-red-500 text-xs mt-1">{editProfileErrors['socialLinks.instagram']}</p>
                      )}
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span className="flex items-center space-x-2">
                          <FaFacebookF className="text-blue-600" />
                          <span>Facebook</span>
                        </span>
                      </label>
                      <input
                        type="url"
                        name="socialLinks.facebook"
                        value={editProfileData.socialLinks.facebook}
                        onChange={handleEditProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                          editProfileErrors['socialLinks.facebook'] 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="https://facebook.com/yourusername"
                      />
                      {editProfileErrors['socialLinks.facebook'] && (
                        <p className="text-red-500 text-xs mt-1">{editProfileErrors['socialLinks.facebook']}</p>
                      )}
                    </div>

                    {/* X (Twitter) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span className="flex items-center space-x-2">
                          <FaTwitter className="text-black dark:text-white" />
                          <span>X (Twitter)</span>
                        </span>
                      </label>
                      <input
                        type="url"
                        name="socialLinks.x"
                        value={editProfileData.socialLinks.x}
                        onChange={handleEditProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                          editProfileErrors['socialLinks.x'] 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="https://x.com/yourusername"
                      />
                      {editProfileErrors['socialLinks.x'] && (
                        <p className="text-red-500 text-xs mt-1">{editProfileErrors['socialLinks.x']}</p>
                      )}
                    </div>

                    {/* YouTube */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span className="flex items-center space-x-2">
                          <FaYoutube className="text-red-600" />
                          <span>YouTube</span>
                        </span>
                      </label>
                      <input
                        type="url"
                        name="socialLinks.youtube"
                        value={editProfileData.socialLinks.youtube}
                        onChange={handleEditProfileChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                          editProfileErrors['socialLinks.youtube'] 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="https://youtube.com/@yourusername"
                      />
                      {editProfileErrors['socialLinks.youtube'] && (
                        <p className="text-red-500 text-xs mt-1">{editProfileErrors['socialLinks.youtube']}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isUpdatingProfile}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

            <div className="m-2 lg:m-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl p-3 lg:p-6 border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center space-x-4">
                  <div className="min-h-12 min-w-12 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <FaAward className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Achievement Badges</span>
                    <p className="text-md lg:text-xl xl:text-2xl font-bold text-gray-800 dark:text-white">
                      {student.badges && student.badges.length > 0
                        ? student.badges.join(', ')
                        : 'No badges yet'}
                    </p>
                  </div>
                </div>
              </div>

        </div>

        {/* Facebook-style Stats Section */}
        <div className="bg-white dark:bg-gray-800 pt-2 lg:mt-4">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz Stats</h2>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quizzesPlayed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{highScoreQuizzes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">High Scores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{highScoreRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* PRO Features Quick Actions */}
        {student?.subscriptionStatus === 'pro' && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 m-2 lg:m-4 hover-lift">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
                <FaCrown className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white">
                  PRO Features
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-md lg:text-lg">
                  Create questions and earn money
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {/* Create Question */}
              <div 
                onClick={() => navigate('/pro/questions/new')}
                className="group cursor-pointer bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-4 lg:p-6 border border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <FaStickyNote className="text-white text-lg lg:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">Create Question</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Post new questions</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Create and submit questions to earn ₹10 per approval
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <span>Create Now</span>
                  <FaArrowRight className="ml-2 text-xs" />
                </div>
              </div>

              {/* My Questions */}
              <div 
                onClick={() => navigate('/pro/questions/mine')}
                className="group cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 lg:p-6 border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FaSearch className="text-white text-lg lg:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">My Questions</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">View submissions</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Track your submitted questions and their status
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span>View Questions</span>
                  <FaArrowRight className="ml-2 text-xs" />
                </div>
              </div>

              {/* Wallet */}
              <div 
                onClick={() => navigate('/pro/wallet')}
                className="group cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 lg:p-6 border border-yellow-200 dark:border-yellow-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FaMoneyBill className="text-white text-lg lg:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">My Wallet</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Earnings & withdrawals</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Check your earnings and withdraw funds
                </p>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                  <span>View Wallet</span>
                  <FaArrowRight className="ml-2 text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="m-2 lg:m-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-900 rounded-2xl p-3 lg:p-6 border border-emerald-200 dark:border-emerald-700">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
    {/* Reward Center Referral Section */}
    <div className="lg:col-span-2">
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-900/90 dark:via-purple-900/90 dark:to-indigo-900/90 backdrop-blur-xl rounded-3xl p-2 md:p-4 lg:p-10 shadow-2xl border border-pink-400/40 dark:border-pink-300/30 relative overflow-hidden mb-8 group hover:scale-[1.02] transition-all duration-500">
        
        {/* Animated Background Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-cyan-300/30 to-blue-400/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-green-300/20 to-emerald-400/20 rounded-full blur-2xl animate-float" />
        
        {/* Header Section */}
        <div className="relative z-10 text-center mb-8">
          <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-tr from-yellow-300 via-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float group-hover:scale-110 transition-transform duration-300">
            <span className="text-3xl">🎁</span>
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 dark:text-white mb-3 drop-shadow-lg">
            Referral Rewards Center
          </h3>
          <p className="text-gray-700 dark:text-yellow-200 text-md lg:text-lg font-medium">
            Invite friends and unlock premium subscriptions automatically!
          </p>
        </div>

        {/* Stats and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Stats */}
          <div className="bg-white/50 dark:bg-black/25 backdrop-blur-sm rounded-2xl p-2 md:p-4 lg:p-6 border border-white/25 dark:border-white/15">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-700 dark:text-yellow-300 mb-2 animate-pulse">
                {student.referralCount || 0}
              </div>
              <div className="text-gray-800 dark:text-white font-semibold text-lg mb-4">
                Referrals Joined
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-white text-sm font-medium">Progress to Next Milestone</span>
                  <span className="text-yellow-700 dark:text-yellow-300 text-sm font-bold">
                    {student.referralCount || 0}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-black/40 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${Math.min((student.referralCount || 0), 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Rewards */}
          <div className="bg-white/50 dark:bg-black/25 backdrop-blur-sm rounded-2xl p-2 md:p-4 lg:p-6 border border-white/25 dark:border-white/15">
            <h4 className="text-gray-800 dark:text-white font-bold text-lg mb-4 text-center">Milestone Rewards</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-100 to-green-200 dark:from-emerald-400/25 dark:to-green-500/25 rounded-xl border border-emerald-300/40">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-800 dark:text-white font-medium"> Referrals - BASIC Plan</span>
                </div>
                <span className="text-emerald-800 dark:text-emerald-300 font-bold">₹9</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-400/25 dark:to-indigo-500/25 rounded-xl border border-blue-300/40">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">5</span>
                  </div>
                  <span className="text-gray-800 dark:text-white font-medium"> Referrals - PREMIUM Plan</span>
                </div>
                <span className="text-blue-800 dark:text-blue-300 font-bold">₹49</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-200 dark:from-purple-400/25 dark:to-pink-500/25 rounded-xl border border-purple-300/40">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">10</span>
                  </div>
                  <span className="text-gray-800 dark:text-white font-medium"> Referrals - PRO Plan</span>
                </div>
                <span className="text-purple-800 dark:text-purple-300 font-bold">₹99</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-500/25 dark:via-orange-500/25 dark:to-red-500/25 rounded-2xl p-2 md:p-4 lg:p-6 border border-yellow-300/40 dark:border-yellow-400/30 mb-6">
          <div className="text-center">
            <h4 className="text-gray-800 dark:text-white font-bold text-lg lg:text-xl mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">🔑</span>
              Your Unique Referral Code
            </h4>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 dark:text-gray-900 font-mono font-bold px-6 py-3 rounded-xl tracking-widest border-2 border-yellow-200 dark:border-yellow-300 shadow-lg text-lg lg:text-xl select-all">
                {student.referralCode}
              </div>
              <button
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(student.referralCode);
                }}
                title="Copy Referral Code"
              >
                <span>📋</span>
                Copy Code
              </button>
            </div>
            
            <p className="text-gray-700 dark:text-yellow-200 text-sm">
              💡 Share this code with friends to start earning rewards!
            </p>
          </div>
        </div>

        {/* Share Section */}
        <div className="text-center">
          <h4 className="text-gray-800 dark:text-white font-bold text-lg mb-4">Share Your Referral Code</h4>
          <ShareComponent
            url={window.location.origin}
            text={message}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-800 dark:text-white/90 text-sm leading-relaxed">
            🚀 <strong>Pro Tip:</strong> Share your referral code on social media, WhatsApp groups, and with classmates to reach milestones faster! 
            <br />
            <span className="text-yellow-700 dark:text-yellow-300 font-medium">
              Every referral brings you closer to premium features!
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Bank Details Card - Only shown for eligible users (level 10 or pro subscription) */}
        {console.log('🔍 Bank Details Render Check:', {
          student: !!student,
          isEligible: isEligibleForBankDetails(student),
          bankDetails: bankDetails,
          showBankForm: showBankForm
        })}
        {isEligibleForBankDetails(student) && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 m-2 lg:m-4 hover-lift">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-teal-500 via-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
                <FaUniversity className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white">
                  Bank Details
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {bankDetails ? 'Your banking information' : 'Add your bank account information'}
                </p>
              </div>
            </div>

            {/* Success Message */}
            {bankDetailsSaved && (
              <div className="m-2 lg:m-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-4 text-green-700 dark:text-green-300 flex items-center">
                <FaCheckCircle className="mr-2" /> Bank details saved successfully!
              </div>
            )}

            {/* Bank Details Display */}
            {bankDetails && !showBankForm ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-2 lg:m-4">
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-3 lg:p-6 border border-blue-200 dark:border-blue-700 hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Account Holder</span>
                      <p className="text-lg lg:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.accountHolderName}</p>
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
                      <p className="text-lg lg:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
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
                      <p className="text-lg lg:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.bankName}</p>
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
                      <p className="text-lg lg:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.branchName}</p>
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
                      <p className="text-lg lg:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{bankDetails.ifscCode}</p>
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
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
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
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto"
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
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 m-2 lg:m-4 hover-lift">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
              <FaTrophy className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white">
                Level Progression
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your journey from Starter to Legend
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
                    <BadgeIcon className="text-yellow-500 dark:text-yellow-200 text-xl lg:text-5xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                  );
                })()}
              </div>
              <div className="text-left">
                <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white">
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
              <div className="w-10 lg:w-16 h-10 lg:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaFire className="text-white text-2xl" />
              </div>
              <div className="text-2xl lg:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{highScoreQuizzes}</div>
              <div className="bg-gradient-to-r from-red-50 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30 rounded-3xl border border-red-200 dark:border-red-700 hover-scale">
                <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">High-Score Quizzes</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">75% + Score</div>
              </div>
            </div>
            {/* Total Quizzes Played */}
            <div className="text-center p-2 lg:p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl border border-green-200 dark:border-green-700 hover-scale">
              <div className="w-10 lg:w-16 h-10 lg:h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <div className="text-2xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{quizzesPlayed}</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Total Quizzes Played</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Attempted</div>
            </div>
            {/* Success Rate */}
            <div className="text-center p-2 lg:p-8 bg-gradient-to-br from-red-50 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30 rounded-3xl border border-red-200 dark:border-red-700 hover-scale">
              <div className="w-10 lg:w-16 h-10 lg:h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div className="text-2xl lg:text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{highScoreRate}%</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Success Rate</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">High Scores</div>
            </div>
          </div>
          </div>

          

          {/* Enhanced Progress Bar */}
          <div className="m-2 lg:m-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Progress to Next Level</span>
              <span className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                {nextLevel ? Math.round((highScoreQuizzes / nextLevel.quizzesRequired) * 100) > 100 ? 100 : Math.round((highScoreQuizzes / nextLevel.quizzesRequired) * 100) : 100}%
              </span>
            </div>
            
            {/* Progress Summary Cards */}
            {nextLevel && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {highScoreQuizzes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">High Score Quizzes</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {nextLevel.quizzesRequired}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Required</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">For Next Level</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                  <div className="text-xl lg:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                    {Math.max(0, nextLevel.quizzesRequired - highScoreQuizzes)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Quizzes Left</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">To Complete</div>
                </div>
              </div>
            )}
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-yellow-500 via-purple-500 to-red-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ 
                  width: `${nextLevel ? Math.min((highScoreQuizzes / nextLevel.quizzesRequired) * 100, 100) : 100}%` 
                }}
              ></div>
            </div>
            
            {nextLevel && (
              <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{highScoreQuizzes}</span> / <span className="font-semibold">{nextLevel.quizzesRequired}</span> high-score quizzes completed
                <br />
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {Math.max(0, nextLevel.quizzesRequired - highScoreQuizzes)} more needed for Level {nextLevel.number}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Next Level Info */}
          {nextLevel ? (
            <div className="m-2 lg:m-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-3xl p-2 lg:p-8 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 lg:w-16 h-10 lg:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  {(() => {
                    const BadgeIcon = levelBadgeIcons[nextLevel.name] || levelBadgeIcons.Default;
                    return (
                      <BadgeIcon className="text-yellow-500 dark:text-yellow-200 text-3xl lg:text-5xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                    );
                  })()}
                </div>
                <div>
                  <h3 className="text-xl lg:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Next Level: {nextLevel.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Level {nextLevel.number}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                Need <span className="font-bold text-green-600 text-lg lg:text-xl">{Math.max(0, nextLevel.quizzesRequired - highScoreQuizzes)}</span> more high-score quizzes (75%+) to unlock Level {nextLevel.number}.
              </p>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Progress: <span className="font-semibold text-blue-600">{highScoreQuizzes}</span> / <span className="font-semibold text-blue-600">{nextLevel.quizzesRequired}</span> high-score quizzes completed
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Required: {nextLevel.quizzesRequired} total high-score quizzes (75%+ score)
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 border border-green-200 dark:border-green-700 hover-scale">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <FaCrown className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Congratulations!</h3>
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

          {/* Rewards Section */}
          <div className="m-2 lg:m-4">
            {/* Quiz Progress */}
            {rewardsData?.quizProgress && (
              <div className="mt-4 sm:mt-6">
                <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📊</span>
                  Monthly Quiz Progress
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quiz Progress: {rewardsData.quizProgress?.current || 0} / {rewardsData.quizProgress?.required || process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(rewardsData.quizProgress?.percentage || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                      <div
                        className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${rewardsData.quizProgress?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Complete Level 10 with {process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220} high-score quizzes to unlock monthly rewards
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-600">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {rewardsData.quizProgress?.current || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Completed</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-600">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {rewardsData.quizProgress?.current > rewardsData.quizProgress?.required ? 0 :rewardsData.quizProgress?.required - (rewardsData.quizProgress?.current || 0)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Monthly Top 10 Info */}
            <div className="my-4 sm:my-6">
              <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🏆</span>
                Monthly Top 10 Rewards
              </h4>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Every month, the top 10 users with Level 10 and {process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220} high-score quizzes win prizes from ₹{process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000} total pool!
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    <div className="bg-yellow-100 dark:bg-yellow-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🥇</div>
                      <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">1st</div>
                      <div className="text-sm font-bold text-yellow-700 dark:text-yellow-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.25)}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🥈</div>
                      <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">2nd</div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.20)}</div>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🥉</div>
                      <div className="text-xs font-semibold text-orange-800 dark:text-orange-200">3rd</div>
                      <div className="text-sm font-bold text-orange-700 dark:text-orange-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.15)}</div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">4th</div>
                      <div className="text-sm font-bold text-blue-700 dark:text-blue-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.12)}</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-green-800 dark:text-green-200">5th</div>
                      <div className="text-sm font-bold text-green-700 dark:text-green-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.08)}</div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-purple-800 dark:text-purple-200">6th</div>
                      <div className="text-sm font-bold text-purple-700 dark:text-purple-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.06)}</div>
                    </div>
                    <div className="bg-pink-100 dark:bg-pink-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-pink-800 dark:text-pink-200">7th</div>
                      <div className="text-sm font-bold text-pink-700 dark:text-pink-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.05)}</div>
                    </div>
                    <div className="bg-indigo-100 dark:bg-indigo-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-200">8th</div>
                      <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.04)}</div>
                    </div>
                    <div className="bg-teal-100 dark:bg-teal-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-teal-800 dark:text-teal-200">9th</div>
                      <div className="text-sm font-bold text-teal-700 dark:text-teal-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.035)}</div>
                    </div>
                    <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-2">
                      <div className="text-lg mb-1">🏅</div>
                      <div className="text-xs font-semibold text-red-800 dark:text-red-200">10th</div>
                      <div className="text-sm font-bold text-red-700 dark:text-red-300">₹{Math.round((process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000) * 0.015)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-3xl p-2 md:p-6 border border-purple-200 dark:border-purple-700">
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex flex-col md:flex-row items-center space-x-3 mb-4 md:mb-0 mt-4 md:mt-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Rewards & Achievements</h3>
                    <p className="text-gray-600 dark:text-gray-300">Track your progress and unlock rewards</p>
                  </div>
                </div>
                <Link
                  to="/rewards"
                  className="px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  View Rewards
                </Link>
              </div>
                <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-600 sm:col-span-2 md:col-span-1">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {rewardsLoading ? '...' : `₹${rewardsData?.claimableRewards?.toLocaleString() || '0'}`}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Claimable</div>
                </div>
            </div>
            
            

            {/* Unlocked Rewards Details */}
            {rewardsData?.unlocked && rewardsData.unlocked.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">✅</span>
                  Unlocked Rewards Details
                </h4>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {rewardsData.unlocked.map((reward, index) => (
                    <div key={reward?._id || `unlocked-${reward?.level}-${index}`} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                          Level {reward?.level || 'N/A'}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {reward?.dateUnlocked ? new Date(reward.dateUnlocked).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                        ₹{(reward?.amount || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                        Ready to claim! Click the button below to claim your reward.
                      </p>
                      <button
                        onClick={() => navigate('/rewards')}
                        className="w-full bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        Claim on Rewards Page
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claimed Rewards Details */}
            {rewardsData?.claimed && rewardsData.claimed.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h4 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎉</span>
                  Claimed Rewards Details
                </h4>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {rewardsData.claimed.map((reward, index) => (
                    <div key={reward?._id || `claimed-${reward?.level}-${index}`} className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                          Level {reward?.level || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {reward?.dateClaimed ? new Date(reward.dateClaimed).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                        ₹{(reward?.amount || 0).toLocaleString()}
                      </p>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✓ Claimed
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            

            {/* Requirements Info */}
            <div className="mt-4 sm:mt-6">
              <MonthlyRewardsInfo />
            </div>
          </div>
          {/* Enhanced Quiz History Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 lg:p-8 border border-white/30 m-2 lg:m-4">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 lg:w-20 h-12 lg:h-20 bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg glow-animation">
              <FaBrain className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-8">
              {playedQuizzes?.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  onClick={() => showResult(item)}
                  className="group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-3xl p-2 lg:p-8 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 hover:scale-105 hover-lift"
                >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 lg:w-16 h-10 lg:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
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

        {/* Payment Transactions Section */}
        <div className="m-2 lg:m-4 pb-6">
          <PaymentTransactions />
        </div>
      </div>
    </MobileAppWrapper>
  );
}

export default ProfilePage;
