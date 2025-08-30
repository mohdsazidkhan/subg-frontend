import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaTrophy,
  FaCrown,
  FaStar,
  FaMedal,
  FaRocket,
  FaChartLine,
  FaAward,
  FaGem,
  FaBook,
  FaFlask,
  FaLaptopCode,
  FaGlobe,
  FaCalculator,
  FaPalette,
  FaLeaf,
  FaUserGraduate,
  FaLayerGroup,
  FaClock,
  FaQuestionCircle,
  FaUserCircle,
  FaLevelUpAlt,
  FaSun,
  FaMoon,
  FaArrowRight,
  FaPlay,
  FaUsers,
  FaGift,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaMagic,
  FaCreditCard,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaBell
} from 'react-icons/fa';
import { BsPersonCircle, BsSearch } from 'react-icons/bs';
import { MdDarkMode, MdDashboard, MdLogout, MdPerson4, MdPersonAdd, MdAdminPanelSettings } from 'react-icons/md';
import { toggleSidebar } from '../store/sidebarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { secureLogout, getCurrentUser } from '../utils/authUtils';
import { isAdmin, hasAdminPrivileges } from '../utils/adminUtils';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return true;
    }
    return false;
  });

  const [notifications, setNotifications] = useState([]);

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
    <header className={`fixed z-[9999] transition-all duration-300 w-full ${
      darkMode 
        ? 'bg-gray-900 border-t border-gray-700 md:border-b md:border-t-0'
        : 'bg-white border-t border-gray-200 md:border-b md:border-t-0'
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
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-red-700 text-red-200 hover:bg-red-600' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <FaBell className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className={`hidden md:block p-2 rounded-lg transition-all duration-300 ${
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
