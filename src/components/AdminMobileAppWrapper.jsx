import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { secureLogout, getCurrentUser } from '../utils/authUtils';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/sidebarSlice';
import ScrollToTopButton from './ScrollToTopButton';

const AdminMobileAppWrapper = ({ children, title, showHeader = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.sidebar);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return true;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const getPageName = () => {
    if (title) return title;
    
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Admin page name mapping
    const pageNames = {
      'admin': 'Admin',
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'users': 'Users',
      'students': 'Students',
      'categories': 'Categories',
      'subcategories': 'Subcategories',
      'quizzes': 'Quizzes',
      'questions': 'Questions',
      'contacts': 'Contacts',
      'bank-details': 'Bank Details',
      'monthly-winners': 'Monthly Winners',
      'financial': 'Financial',
      'performance': 'Performance'
    };
    
    // Get the last meaningful segment
    const lastSegment = pathSegments[pathSegments.length - 1];
    return pageNames[lastSegment] || 'Admin Panel';
  };

  return (
    <div className="admin-mobile-container">
      {showHeader && (
        <div className="admin-mobile-header fixed top-0 left-0 right-0 z-50 md:hidden px-2 !bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 !border-b !border-gray-200 dark:!border-gray-700">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <Link
              to="/admin/dashboard"
              className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src="/logo.png"
                alt="SUBG QUIZ Admin Logo"
                className="w-12 h-12 object-contain"
              />
            </Link>

            {/* Page name in the center */}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center">
              {getPageName()}
            </h1>

            {/* Right side - Dark mode toggle, Logout button, and Sidebar toggle */}
            <div className="flex items-center space-x-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </button>

              {/* Logout button */}
              {user && (
                <button
                  onClick={() => secureLogout(navigate)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105 shadow-md"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              )}

              {/* Sidebar toggle button */}
              <button
                onClick={handleSidebarToggle}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:scale-105 shadow-md"
                title={isOpen ? "Hide Sidebar" : "Show Sidebar"}
              >
                {!isOpen ? <FaBars className="w-4 h-4" /> : <FaTimes className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="admin-mobile-content min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
      
      {/* Scroll to Top Button - Only show on mobile */}
      <ScrollToTopButton />
    </div>
  );
};

export default AdminMobileAppWrapper;
