import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Replace with your API endpoint for forgot password
      const res = await API.forgotPassword({ email });
      if (res.success) {
        setSuccess(true);
        toast.success(res.message || 'Password reset link sent!');
      } else {
        toast.error(res.message || 'Failed to send reset link.');
      }
    } catch (err) {
      toast.error('Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center min-h-screen p-2 md:p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/login" className="text-blue-600 hover:underline flex items-center gap-1">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">Forgot Password</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Enter your email to receive a password reset link.</p>
        {success ? (
          <div className="text-green-600 text-center font-semibold py-6">Check your email for the reset link!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2 font-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
