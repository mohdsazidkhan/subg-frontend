import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { secureLogout, getCurrentUser } from '../utils/authUtils';

const MobileAppWrapper = ({ children, title, showHeader = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  
  // Don't apply mobile wrapper on admin pages only
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Function to get page name based on current route
  const getPageName = () => {
    if (title) return title;
    
    const path = location.pathname;
    const pageNames = {
      '/': 'SUBG QUIZ',
      '/login': 'Login',
      '/register': 'Register',
      '/forgot-password': 'Forgot Password',
      '/reset-password': 'Reset Password',
      '/home': 'Home',
      '/search': 'Search',
      '/rewards': 'Rewards',
      '/subscription': 'Subscription',
      '/profile': 'Profile',
      '/levels': 'Levels',
      '/level-quizzes': 'Level Quizzes',
      '/category': 'Category',
      '/subcategory': 'Subcategory',
      '/level': 'Level',
      '/attempt-quiz': 'Quiz',
      '/quiz-result': 'Result',
      '/how-it-works': 'How It Works',
      '/about': 'About Us',
      '/terms': 'Terms',
      '/privacy': 'Privacy',
      '/refund': 'Refund',
      '/contact': 'Contact'
    };
    
    // Check for exact matches first
    if (pageNames[path]) {
      return pageNames[path];
    }
    
    // Check for dynamic routes
    if (path.startsWith('/category/')) return 'Category';
    if (path.startsWith('/subcategory/')) return 'Subcategory';
    if (path.startsWith('/level/')) return 'Level';
    if (path.startsWith('/attempt-quiz/')) return 'Quiz';
    
    // Default fallback
    return 'SUBG QUIZ';
  };
  
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-app-container">
      {showHeader && (
        <div className="mobile-app-header md:hidden !bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 !border-b !border-gray-200 dark:!border-gray-700">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <Link 
              to="/home"
              className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="/logo.png" 
                alt="SUBG QUIZ Logo" 
                className="w-12 h-12 object-contain" 
              />
            </Link>
            
            {/* Page name in the center */}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center">
              {getPageName()}
            </h1>
            
            {/* Right side - Theme toggle and Logout button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </button>

              {user ? (
                <button
                  onClick={() => secureLogout(navigate)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105 shadow-md"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-8 h-8"></div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mobile-content">
        {children}
      </div>
    </div>
  );
};

export default MobileAppWrapper;
