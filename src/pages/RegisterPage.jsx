import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaTrophy, FaBrain, FaRocket } from 'react-icons/fa';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'text-red-500';
    if (passwordStrength <= 3) return 'text-yellow-500';
  if (passwordStrength <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate phone number (matches backend validation: exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (passwordStrength < 5) {
      toast.error('Password must meet all requirements');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.register({
        name,
        email,
        phone,
        password
      });
      console.log(response, 'registerregister')
      if(response.success){
        toast.success(`${response.message}`);
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err.response?.data?.message) {
        // Backend validation error
        toast.error(err.response.data.message);
      } else if (err.message) {
        // Network or other error
        toast.error(err.message);
      } else {
        // Generic error
        toast.error('Registration failed! Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100 dark:from-gray-900 dark:via-red-900 dark:to-yellow-900 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Quiz Platform Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-transparent mb-4 text-black dark:text-gray-100">
              Join the Quiz Revolution! 🚀
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Challenge your mind, compete with others, and become a quiz legend!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg">
                <FaBrain className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Level-Based Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">Progress through 11 exciting levels from Zero Level to Legend</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <FaTrophy className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Win Badges & Rewards</h3>
                <p className="text-gray-600 dark:text-gray-300">Earn badges and climb the leaderboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Live Competitions</h3>
                <p className="text-gray-600 dark:text-gray-300">Participate in real-time quiz battles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl px-2 py-4 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Start your quiz journey today!
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value?.toLowerCase())}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Phone Number (10 digits)"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  required
                  pattern="[0-9]{10}"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-yellow-200 dark:border-gray-600">
                <p className="font-medium mb-3 text-gray-800 dark:text-white">Password Requirements:</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className={`flex items-center ${password.length >= 8 ? "text-green-600" : "text-gray-500"}`}>
                    <span className="mr-2">{password.length >= 8 ? "✓" : "○"}</span>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center ${/[a-z]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <span className="mr-2">{/[a-z]/.test(password) ? "✓" : "○"}</span>
                    One lowercase letter
                  </div>
                  <div className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <span className="mr-2">{/[A-Z]/.test(password) ? "✓" : "○"}</span>
                    One uppercase letter
                  </div>
                  <div className={`flex items-center ${/[0-9]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <span className="mr-2">{/[0-9]/.test(password) ? "✓" : "○"}</span>
                    One number
                  </div>
                  <div className={`flex items-center ${/[@$!%*?&]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <span className="mr-2">{/[@$!%*?&]/.test(password) ? "✓" : "○"}</span>
                    One special character (@$!%*?&)
                  </div>
                </div>
                {password && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-500">
                    <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                      Strength: {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={passwordStrength < 5 || isLoading}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  passwordStrength < 5 || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span className="text-gray-100 dark:text-gray-200">Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
