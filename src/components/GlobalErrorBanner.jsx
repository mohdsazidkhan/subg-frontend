import React, { useState, useEffect } from 'react';
import { useGlobalError } from '../contexts/GlobalErrorContext';
import { Link } from 'react-router-dom';

const GlobalErrorBanner = () => {
  const { globalError, isRateLimited, clearGlobalError, getTimeUntilReset } = useGlobalError();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isRateLimited) {
      const timer = setInterval(() => {
        const timeLeft = getTimeUntilReset();
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          clearGlobalError();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRateLimited, getTimeUntilReset, clearGlobalError]);

  if (!globalError) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (globalError.type === 'rateLimit') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  Rate Limit Reached - Too Many Requests
                </h3>
                <p className="text-sm opacity-90">
                  You've exceeded the request limit. Please wait or re login after some time for higher limits.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="bg-white/20 px-3 py-1 rounded-lg text-center min-w-[80px]">
                  <div className="text-xs opacity-75">Reset in</div>
                  <div className="font-mono font-bold text-lg">{formatTime(countdown)}</div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-white text-orange-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔐 Login
                </Link>
                
                <button
                  onClick={clearGlobalError}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ✕ Dismiss
                </button>
              </div>
            </div>
          </div>
          
          {/* Detailed Information */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="font-semibold mb-2">🎯 What Happened?</div>
                <ul className="space-y-1 opacity-90">
                  <li>• Too many requests in short time</li>
                  <li>• Server protection activated</li>
                  <li>• Temporary restriction applied</li>
                </ul>
              </div>
              
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="font-semibold mb-2">💡 What You Can Do:</div>
                <ul className="space-y-1 opacity-90">
                  <li>• <strong>Wait {countdown > 0 ? formatTime(countdown) : '5 minutes'}</strong></li>
                  <li>• <strong>Login</strong> for higher limits</li>
                  <li>• <strong>Refresh</strong> after waiting</li>
                  <li>• <strong>Close & reopen</strong> browser</li>
                </ul>
              </div>
              
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="font-semibold mb-2">🚀 Pro Tips:</div>
                <ul className="space-y-1 opacity-90">
                  <li>• Don't rapidly click buttons</li>
                  <li>• Wait for pages to load fully</li>
                  <li>• Use auto-refresh features</li>
                  <li>• Login for premium access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General error banner
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error Occurred</h3>
              <p className="text-sm opacity-90">{globalError.message}</p>
            </div>
          </div>
          
          <button
            onClick={clearGlobalError}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalErrorBanner;
