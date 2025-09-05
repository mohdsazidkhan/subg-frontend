import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';


const DashboardPage = () => {
  const [stats, setStats] = useState({
    categories: 0,
    subcategories: 0,
    quizzes: 0,
    questions: 0,
    students: 0,
    bankDetails: 0,
    subscriptions: 0,
    activeSubscriptions: 0,
    freeSubscriptions: 0,
    paidSubscriptions: 0,
    paymentOrders: 0,
    completedPaymentOrders: 0,
    totalRevenue: 0
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
          students: 0,
          bankDetails: 0,
          subscriptions: 0,
          activeSubscriptions: 0,
          freeSubscriptions: 0,
          paidSubscriptions: 0,
          paymentOrders: 0,
          completedPaymentOrders: 0,
          totalRevenue: 0
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
  color: 'bg-yellow-500',
  textColor: 'text-yellow-500',
  bgColor: 'bg-yellow-50',
  darkBgColor: 'dark:bg-yellow-900/20'
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
  color: 'bg-red-500',
  textColor: 'text-red-500',
  bgColor: 'bg-red-50',
  darkBgColor: 'dark:bg-red-900/20'
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
    {
      title: 'Bank Details',
      count: stats.bankDetails,
      link: '/admin/bank-details',
      icon: '🏦',
  color: 'bg-yellow-500',
  textColor: 'text-yellow-500',
  bgColor: 'bg-yellow-50',
  darkBgColor: 'dark:bg-yellow-900/20'
    },
    {
      title: 'Payment Orders',
      count: stats.paymentOrders || 0,
      link: '/admin/payment-transactions',
      icon: '💳',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20',
      subtitle: `${stats.completedPaymentOrders || 0} completed`
    },
    {
      title: 'Total Subscriptions',
      count: stats.subscriptions || 0,
      link: '/admin/subscriptions',
      icon: '👑',
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20',
      subtitle: `${stats.activeSubscriptions || 0} active`
    },
    {
      title: 'Total Revenue',
      count: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      link: '/admin/payment-transactions',
      icon: '💰',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      darkBgColor: 'dark:bg-emerald-900/20',
      subtitle: 'From completed payments'
    },
    {
      title: 'Free Subscriptions',
      count: stats.freeSubscriptions || 0,
      link: '/admin/subscriptions',
      icon: '🆓',
      color: 'bg-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      darkBgColor: 'dark:bg-gray-900/20',
      subtitle: 'Free plan users'
    },
    {
      title: 'Paid Subscriptions',
      count: stats.paidSubscriptions || 0,
      link: '/admin/subscriptions',
      icon: '💎',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      darkBgColor: 'dark:bg-indigo-900/20',
      subtitle: 'Basic/Premium/Pro plans'
    }

  ];

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Dashboard">
        <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
          {user?.role === 'admin' && isAdminRoute && <Sidebar />}
          <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <div className="text-lg">Loading dashboard statistics...</div>
              </div>
            </div>
          </div>
        </div>
      </AdminMobileAppWrapper>
    );
  }

  if (error) {
    return (
      <AdminMobileAppWrapper title="Dashboard">
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
      </AdminMobileAppWrapper>
    );
  }

  return (
    <AdminMobileAppWrapper title="Dashboard">
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 hidden md:block">
            Welcome back! Here's an overview of your platform statistics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 lg:gap-6 mb-2 md:mb-4 lg:mb-8">
          {cards.map((card) => (
            <Link key={card.title} to={card.link} className="group">
              <div className={`relative overflow-hidden rounded-xl p-2 md:p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg ${card.bgColor} ${card.darkBgColor} border border-gray-200 dark:border-gray-700`}>
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${card.color} opacity-10 -translate-y-10 translate-x-10`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className={`text-3xl md:text-4xl lg:text-5xl ${card.textColor} dark:text-white`}>
                      {card.icon}
                    </div>
                    <div className={`w-16 lg:w-16 h-8 lg:h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {card.count}
                      </span>
                    </div>
                  </div>
                  
                  {/* Mobile: inline title and subtitle; Desktop: stacked */}
                  <div className="flex md:hidden justify-between items-center gap-1 mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {card.title}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {card.subtitle || 'Total'}
                    </span>
                  </div>
                  <h3 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                    {card.subtitle || 'Total'}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-gray-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-green-200 text-xs mt-1">From all completed payments</p>
              </div>
              <div className="text-4xl text-green-200">💰</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Payment Success Rate</p>
                <p className="text-2xl font-bold">
                  {stats.paymentOrders > 0 ? Math.round((stats.completedPaymentOrders / stats.paymentOrders) * 100) : 0}%
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  {stats.completedPaymentOrders || 0} of {stats.paymentOrders || 0} orders
                </p>
              </div>
              <div className="text-4xl text-blue-200">📊</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats.activeSubscriptions || 0}</p>
                <p className="text-purple-200 text-xs mt-1">
                  {stats.subscriptions > 0 ? Math.round((stats.activeSubscriptions / stats.subscriptions) * 100) : 0}% of total
                </p>
              </div>
              <div className="text-4xl text-purple-200">👑</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Free vs Paid</p>
                <p className="text-2xl font-bold">{stats.freeSubscriptions || 0} / {stats.paidSubscriptions || 0}</p>
                <p className="text-orange-200 text-xs mt-1">
                  Free plan / Paid plans
                </p>
              </div>
              <div className="text-4xl text-orange-200">📊</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            
            
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

            <Link to="/admin/quizzes" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:from-yellow-100 hover:to-yellow-200 dark:hover:from-yellow-800/30 dark:hover:to-yellow-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🎯</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Quiz</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add New Quiz Content</p>
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
            
            <Link to="/admin/students" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Students</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Students Content</p>
              </div>
            </Link>

            <Link to="/admin/contacts" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Contact List</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View Contactst Queries</p>
              </div>
            </Link>

            <Link to="/admin/payment-transactions" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">💳</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Payment Transactions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View All Payment Transactions & Revenue</p>
              </div>
            </Link>

            <Link to="/admin/subscriptions" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">👑</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">User Subscriptions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage All User Subscriptions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default DashboardPage;
