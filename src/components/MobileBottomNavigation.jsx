import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaTrophy,
  FaUser,
  FaCreditCard,
  FaCalendarAlt
} from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';
import { getCurrentUser } from '../utils/authUtils';
import { hasActiveSubscription } from '../utils/subscriptionUtils';
import { isAdmin } from '../utils/adminUtils';

const MobileBottomNavigation = () => {
  const location = useLocation();
  const user = getCurrentUser();

  // Don't show on admin pages only
  const isAdminPage = location.pathname.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }

  const studentNavItems = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/rewards', icon: FaTrophy, label: 'Rewards' },
    { path: '/subscription', icon: hasActiveSubscription() ? FaCalendarAlt : FaCreditCard, label: 'Subscription' },
    { path: '/profile', icon: BsPersonCircle, label: 'Profile' },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { path: '/admin/students', icon: FaUser, label: 'Students' },
    { path: '/admin/categories', icon: FaSearch, label: 'Categories' },
    { path: '/admin/quizzes', icon: FaTrophy, label: 'Quizzes' },
    { path: '/profile', icon: BsPersonCircle, label: 'Profile' },
  ];

  // Landing page navigation items (for non-logged in users)
  const landingNavItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/how-it-works', icon: FaSearch, label: 'How It Works' },
    { path: '/about', icon: FaTrophy, label: 'About' },
    { path: '/contact', icon: FaUser, label: 'Contact' },
    { path: '/login', icon: BsPersonCircle, label: 'Login' },
  ];

  const navItems = user ? (isAdmin() ? adminNavItems : studentNavItems) : landingNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;