import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdDashboard, MdCategory, MdQuiz, MdQuestionAnswer, MdPeople,
  MdAnalytics, MdBarChart, MdTrendingUp, MdLogout, MdAccountBalance
} from 'react-icons/md';
import { isAdmin, hasAdminPrivileges, logAdminAction } from '../utils/adminUtils';
import { secureLogout } from '../utils/authUtils';
import { toggleSidebar } from '../store/sidebarSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin() || !hasAdminPrivileges()) return null;

  const handleNavClick = (page) => {
    dispatch(toggleSidebar())
    logAdminAction('navigate', page, { timestamp: new Date().toISOString() });
  };

  const isActiveRoute = (path) => location.pathname === path;

  const getActiveClass = (path) => {
    return isActiveRoute(path)
      ? "flex items-center space-x-3 p-3 bg-blue-600 text-white transition-colors"
      : "flex items-center space-x-3 p-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-100";
  };

  return (
    <div className={`sidebar bg-white dark:bg-gray-900 dark:text-white text-gray-900 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full shadow-lg`}>
      
      {/* Navigation Links */}
      <nav className="space-y-2">
        <Link to="/admin/dashboard" onClick={() => handleNavClick('dashboard')} className={getActiveClass('/admin/dashboard')}>
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/categories" onClick={() => handleNavClick('categories')} className={getActiveClass('/admin/categories')}>
          <MdCategory className="text-xl" />
          <span>Categories</span>
        </Link>

        <Link to="/admin/subcategories" onClick={() => handleNavClick('subcategories')} className={getActiveClass('/admin/subcategories')}>
          <MdCategory className="text-xl" />
          <span>Sub Categories</span>
        </Link>

        <Link to="/admin/quizzes" onClick={() => handleNavClick('quizzes')} className={getActiveClass('/admin/quizzes')}>
          <MdQuiz className="text-xl" />
          <span>Quizzes</span>
        </Link>

        <Link to="/admin/questions" onClick={() => handleNavClick('questions')} className={getActiveClass('/admin/questions')}>
          <MdQuestionAnswer className="text-xl" />
          <span>Questions</span>
        </Link>

        <Link to="/admin/students" onClick={() => handleNavClick('students')} className={getActiveClass('/admin/students')}>
          <MdPeople className="text-xl" />
          <span>Students</span>
        </Link>

        <Link to="/admin/contacts" onClick={() => handleNavClick('contacts')} className={getActiveClass('/admin/contacts')}>
          <MdPeople className="text-xl" />
          <span>Contacts</span>
        </Link>

        <Link to="/admin/bank-details" onClick={() => handleNavClick('bank-details')} className={getActiveClass('/admin/bank-details')}>
          <MdAccountBalance className="text-xl" />
          <span>Bank Details</span>
        </Link>
      </nav>
      <hr/>
      {/* Analytics Section */}
      <div className="mt-2 pb-4">
        <nav className="space-y-2">
          <Link to="/admin/analytics/dashboard" onClick={() => handleNavClick('analytics-dashboard')} className={getActiveClass('/admin/analytics/dashboard')}>
            <MdBarChart className="text-xl" />
            <span>Dashboard Analytics</span>
          </Link>

          <Link to="/admin/analytics/users" onClick={() => handleNavClick('analytics-users')} className={getActiveClass('/admin/analytics/users')}>
            <MdPeople className="text-xl" />
            <span>User Analytics</span>
          </Link>

          <Link to="/admin/analytics/quizzes" onClick={() => handleNavClick('analytics-quizzes')} className={getActiveClass('/admin/analytics/quizzes')}>
            <MdQuiz className="text-xl" />
            <span>Quiz Analytics</span>
          </Link>

          <Link to="/admin/analytics/financial" onClick={() => handleNavClick('analytics-financial')} className={getActiveClass('/admin/analytics/financial')}>
            <MdTrendingUp className="text-xl" />
            <span>Financial Analytics</span>
          </Link>

          <Link to="/admin/analytics/performance" onClick={() => handleNavClick('analytics-performance')} className={getActiveClass('/admin/analytics/performance')}>
            <MdAnalytics className="text-xl" />
            <span>Performance Analytics</span>
          </Link>
        </nav>
      </div>
      <hr/>
      {/* Logout Button */}
      <div className="mt-2 p-4">
        <button
          onClick={() => secureLogout(navigate)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
        >
          <MdLogout className="text-xl" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
