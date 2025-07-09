import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaTrophy, FaBrain, FaRocket, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔍 Login process started...');
      
      console.log('📞 Making API call to login...');
      const response = await API.login({ identifier, password });
      console.log('📊 Login response:', response);
      
      if(response?.success){
        console.log('✅ Login successful, processing user data...');
        console.log('👤 User role:', response.user.role);
        console.log('👤 User data:', response.user);

        localStorage.setItem('userInfo', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        
        console.log('💾 Data stored in localStorage');
        console.log('🔍 Verifying localStorage...');
        const storedUser = localStorage.getItem('userInfo');
        const storedToken = localStorage.getItem('token');
        console.log('Stored user:', storedUser);
        console.log('Stored token:', storedToken ? 'Present' : 'Missing');
        
        if (response.user.role === 'admin') {
          console.log('🚀 Redirecting to admin dashboard...');
          navigate('/admin/dashboard');
        } else {
          console.log('🚀 Redirecting to student profile...');
          navigate('/');
        }
        toast.success(response.message || "Login Success!")
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Quiz Platform Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-transparent mb-4 text-black dark:text-gray-100">
              Welcome Back! 🎯
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Ready to continue your quiz journey? Sign in and keep learning!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <FaBrain className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Track Your Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">See your level progression and quiz history</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <FaTrophy className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Compete & Win</h3>
                <p className="text-gray-600 dark:text-gray-300">Join competitions and climb the leaderboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Live Battles</h3>
                <p className="text-gray-600 dark:text-gray-300">Participate in real-time quiz competitions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl px-2 py-4 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignInAlt className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to continue your quiz adventure!
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email or Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Email or Phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-600">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Levels</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Quizzes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">24/7</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Available</div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
