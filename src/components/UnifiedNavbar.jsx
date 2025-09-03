import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSun,
  FaMoon,
  FaCreditCard,
  FaCalendarAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { BsPersonCircle, BsSearch } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';
import { secureLogout, getCurrentUser } from '../utils/authUtils';
import { hasActiveSubscription } from '../utils/subscriptionUtils';
import { isAdmin } from '../utils/adminUtils';


const UnifiedNavbar = ({ isLandingPage = false, scrollToSection }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
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
  const handleLogout = () => secureLogout(navigate);

  // Navbar links for students
  const studentLinks = (
    <>
      <Link
        title="Search"
        to="/search"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <BsSearch className="text-lg text-white" />
      </Link>
      <Link
        title="Rewards"
        to="/rewards"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span className="text-lg text-white">🏆</span>
      </Link>
      <Link
        title={hasActiveSubscription() ? "My Subscription" : "Subscribe Now"}
        to="/subscription"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span className="text-lg text-white">
          {hasActiveSubscription() ? <FaCalendarAlt /> : <FaCreditCard />}
        </span>
      </Link>
      <Link
        title="My Profile"
        to="/profile"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <BsPersonCircle className="text-lg text-white" />
      </Link>
    </>
  );

  // Navbar links for admin
  const adminLinks = (
    <Link
      title="Admin Dashboard"
      to="/admin/dashboard"
      className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
    >
      <MdDashboard className="text-lg text-white" />
    </Link>
  );

  // Auth links for guests
  const guestLinks = (
    <>
      <Link
        to="/login"
        className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
      >
        Get Started
      </Link>
    </>
  );

  // Landing page navigation links
  const landingPageLinks = (
    <nav className="hidden lg:flex items-center space-x-8">
      <button 
        onClick={() => scrollToSection('hero')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Home
      </button>
      <button 
        onClick={() => scrollToSection('levels')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Levels
      </button>
      <button 
        onClick={() => scrollToSection('categories')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Categories
      </button>
      <button 
        onClick={() => scrollToSection('performers')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Top Performers
      </button>
      <button 
        onClick={() => scrollToSection('prizes')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Prizes
      </button>
      <button 
        onClick={() => scrollToSection('subscription')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Plans
      </button>
      <button 
        onClick={() => scrollToSection('referrals')}
        className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        Referrals
      </button>
    </nav>
  );


  return (
    <header className={`hidden md:block fixed z-[9999] transition-all duration-300 w-full ${
      darkMode 
        ? 'bg-gray-900 border-b border-gray-700'
        : 'bg-white border-b border-gray-200'
    } top-0`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to={user ? "/home" : "/"}
              className="w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
              title={user ? "Go to Home" : "Go to Landing Page"}
            >
              <img src="/logo.png" alt="SUBG QUIZ Logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          {/* Navigation - Show different links based on page type */}
          {isLandingPage ? landingPageLinks : null}

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Guest Links - Get Started button for non-logged in users */}
            {!user && (
              <div className="block">
                {guestLinks}
              </div>
            )}

            {/* Admin Links - Only show for admin users */}
            {user && isAdmin() && (
              <div className="flex items-center space-x-2">
                {adminLinks}
              </div>
            )}

            {/* Student Links - Only show for student users */}
            {user && !isAdmin() && (
              <div className="flex items-center space-x-2">
                {studentLinks}
              </div>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
            >
              {darkMode ? <FaSun className="w-5 h-5 text-white" /> : <FaMoon className="w-5 h-5 text-white" />}
            </button>

            {/* Logout Button - Only show for logged-in users */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
                title="Logout"
              >
                <FaSignOutAlt className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedNavbar;
