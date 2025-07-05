import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    categories: 0,
    subcategories: 0,
    quizzes: 0,
    questions: 0,
    students: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.getAdminStats();
        setStats(response);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics');
        // Set default values on error
        setStats({
          categories: 0,
          subcategories: 0,
          quizzes: 0,
          questions: 0,
          students: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      title: 'Categories', 
      count: stats.categories, 
      link: '/admin/categories',
      icon: '📚',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    { 
      title: 'Subcategories', 
      count: stats.subcategories, 
      link: '/admin/subcategories',
      icon: '📂',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20'
    },
    { 
      title: 'Quizzes', 
      count: stats.quizzes, 
      link: '/admin/quizzes',
      icon: '🎯',
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20'
    },
    { 
      title: 'Questions', 
      count: stats.questions, 
      link: '/admin/questions',
      icon: '❓',
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      darkBgColor: 'dark:bg-orange-900/20'
    },
    { 
      title: 'Students', 
      count: stats.students, 
      link: '/admin/students',
      icon: '👥',
      color: 'bg-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-50',
      darkBgColor: 'dark:bg-red-900/20'
    },
  ];

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  if (loading) {
    return (
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div className="text-lg">Loading dashboard statistics...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-6 w-full text-gray-900 dark:text-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your platform statistics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {cards.map((card) => (
            <Link key={card.title} to={card.link} className="group">
              <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg ${card.bgColor} ${card.darkBgColor} border border-gray-200 dark:border-gray-700`}>
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${card.color} opacity-10 -translate-y-10 translate-x-10`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-3xl ${card.textColor} dark:text-white`}>
                      {card.icon}
                    </div>
                    <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {card.count}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total {card.title.toLowerCase()}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            <Link to="/admin/quizzes" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🎯</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Quiz</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add New Quiz Content</p>
              </div>
            </Link>
            
            <Link to="/admin/categories" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">📚</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Category</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add New Category Content</p>
              </div>
            </Link>
            
            <Link to="/admin/subcategories" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">📂</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Subcategoy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add New Subcategoy Content</p>
              </div>
            </Link>
            
            <Link to="/admin/questions" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/30 dark:hover:to-orange-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">❓</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add New Questions to Quiz</p>
              </div>
            </Link>
            
            <Link to="/admin/live-quiz" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🎮</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Live Quiz</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Live Quiz Sessions</p>
              </div>
            </Link>
            
            <Link to="/admin/students" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Students</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Students Content</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
