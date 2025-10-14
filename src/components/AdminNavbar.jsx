import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { toggleSidebar } from '../store/sidebarSlice';
import { useDispatch } from 'react-redux';
import { secureLogout, getCurrentUser } from '../utils/authUtils';
import API from '../lib/api';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const dispatch = useDispatch();
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return true;
    }
    return false;
  });

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const hasFetchedNotifsRef = useRef(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoadingNotifs(true);
        const res = await API.request('/api/admin/notifications/latest?limit=10');
        setNotifications(res?.data || []);
      } catch (e) {
        // ignore
      } finally {
        setLoadingNotifs(false);
      }
    };
    if (hasFetchedNotifsRef.current) return;
    hasFetchedNotifsRef.current = true;
    if (user && user.role === 'admin') fetchLatest();
  }, [user]);

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



  return (
    <header className={`fixed z-[99] transition-all duration-300 w-full hidden md:block ${
      darkMode 
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 md:border-b md:border-t-0'
        : 'bg-gradient-to-r from-white via-gray-50 to-white border-t border-gray-200 md:border-b md:border-t-0'
    } bottom-0 md:bottom-auto md:top-0`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin/dashboard" 
              className="w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
              title="Go to Dashboard"
            >
              <img src="/logo.png" alt="SUBG QUIZ Logo" className="w-full h-full object-contain" />
            </Link>
          </div>



          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={() => setShowDropdown(v => !v)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-red-700 text-red-200 hover:bg-red-600' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <FaBell className="w-5 h-5" />
            </button>
            {showDropdown && (
              <div className={`absolute right-4 top-16 w-80 max-h-[70vh] overflow-auto rounded-lg shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-800'}`}>
                  Notifications
                </div>
                <div className="p-2">
                  {loadingNotifs ? (
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} className={`p-2 rounded mb-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{n.description}</div>
                        <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className={`px-3 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <Link to="/admin/notifications" className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>View all</Link>
                </div>
              </div>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-red-700 text-yellow-400 hover:bg-red-600' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

                         {/* Dashboard Link */}
             <Link
               to="/admin/dashboard"
               className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                 darkMode 
                   ? 'bg-red-700 text-red-200 hover:bg-red-600' 
                   : 'bg-red-100 text-red-600 hover:bg-red-200'
               }`}
               title="Dashboard"
             >
               <MdDashboard className="w-5 h-5" />
             </Link>

                         {/* Logout Button */}
             <button
               onClick={handleLogout}
               className={`p-2 rounded-lg transition-all duration-300 ${
                 darkMode 
                   ? 'bg-red-700 text-red-200 hover:bg-red-600' 
                   : 'bg-red-100 text-red-600 hover:bg-red-200'
               }`}
               title="Logout"
             >
               <FaSignOutAlt className="w-5 h-5" />
             </button>

                           {/* Sidebar Toggle Button */}
              <button
                onClick={() => dispatch(toggleSidebar())}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-red-700 text-red-200 hover:bg-red-600' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                title="Toggle Sidebar"
              >
                <FaBars className="w-5 h-5" />
              </button>

            
          </div>
        </div>
      </div>


    </header>
  );
};

export default AdminNavbar;
