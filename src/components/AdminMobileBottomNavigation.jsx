import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaUsers,
  FaBook,
  FaQuestionCircle
} from 'react-icons/fa';
import { MdDashboard, MdAnalytics } from 'react-icons/md';
import { getCurrentUser } from '../utils/authUtils';
import { isAdmin } from '../utils/adminUtils';

const AdminMobileBottomNavigation = () => {
  const location = useLocation();
  const user = getCurrentUser();

  // Don't show on non-admin pages
  if (!location.pathname.startsWith('/admin') || !user || !isAdmin()) {
    return null;
  }

  const adminNavItems = [
    { 
      path: '/admin/dashboard', 
      icon: MdDashboard, 
      label: 'Dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/admin/analytics/dashboard', 
      icon: MdAnalytics, 
      label: 'Analytics',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      path: '/admin/students', 
      icon: FaUsers, 
      label: 'Students',
      color: 'from-green-500 to-green-600'
    },
    { 
      path: '/admin/categories', 
      icon: FaBook, 
      label: 'Categories',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      path: '/admin/quizzes', 
      icon: FaQuestionCircle, 
      label: 'Quizzes',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Admin Mobile Bottom Navigation */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-20 h-12 transition-all duration-300 transform hover:scale-110 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
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

export default AdminMobileBottomNavigation;
