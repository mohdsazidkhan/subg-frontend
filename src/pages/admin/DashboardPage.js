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
    totalQuizAttempts: 0,
    subscriptions: 0,
    activeSubscriptions: 0,
    freeSubscriptions: 0,
    paidSubscriptions: 0,
    paymentOrders: 0,
    completedPaymentOrders: 0,
    totalRevenue: 0,
    // Article stats
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    featuredArticles: 0,
    pinnedArticles: 0,
    totalArticleViews: 0,
    totalArticleLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [mainStats, articleStats] = await Promise.all([
          API.getAdminStats(),
          API.getArticleStats()
        ]);
        
        setStats({
          ...mainStats,
          ...articleStats.stats,
          // Map backend field names to frontend expected names
          totalArticleViews: articleStats.stats.totalViews || 0,
          totalArticleLikes: articleStats.stats.totalLikes || 0
        });
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
          totalQuizAttempts: 0,
          subscriptions: 0,
          activeSubscriptions: 0,
          freeSubscriptions: 0,
          paidSubscriptions: 0,
          paymentOrders: 0,
          completedPaymentOrders: 0,
          totalRevenue: 0,
          totalArticles: 0,
          publishedArticles: 0,
          draftArticles: 0,
          featuredArticles: 0,
          pinnedArticles: 0,
          totalArticleViews: 0,
          totalArticleLikes: 0
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
  textColor: 'text-yellow-900',
  bgColor: 'bg-yellow-100',
  darkBgColor: 'dark:bg-yellow-900/20',
  gradientFrom: 'from-yellow-200',
  gradientTo: 'to-amber-200',
  darkGradientFrom: 'dark:from-yellow-700',
  darkGradientTo: 'dark:to-amber-800'
    },
    { 
      title: 'Subcategories', 
      count: stats.subcategories, 
      link: '/admin/subcategories',
      icon: '📂',
      color: 'bg-green-500',
      textColor: 'text-green-900',
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-green-900/20',
      gradientFrom: 'from-green-200',
      gradientTo: 'to-emerald-200',
      darkGradientFrom: 'dark:from-green-700',
      darkGradientTo: 'dark:to-emerald-800'
    },
    { 
      title: 'Quizzes', 
      count: stats.quizzes, 
      link: '/admin/quizzes',
      icon: '🎯',
  color: 'bg-red-500',
  textColor: 'text-red-900',
  bgColor: 'bg-red-100',
  darkBgColor: 'dark:bg-red-900/20',
  gradientFrom: 'from-red-200',
  gradientTo: 'to-rose-200',
  darkGradientFrom: 'dark:from-red-700',
  darkGradientTo: 'dark:to-rose-800'
    },
    { 
      title: 'Questions', 
      count: stats.questions, 
      link: '/admin/questions',
      icon: '❓',
      color: 'bg-orange-500',
      textColor: 'text-orange-900',
      bgColor: 'bg-orange-100',
      darkBgColor: 'dark:bg-orange-900/20',
      gradientFrom: 'from-orange-200',
      gradientTo: 'to-amber-200',
      darkGradientFrom: 'dark:from-orange-700',
      darkGradientTo: 'dark:to-amber-800'
    },
    
    { 
      title: 'Students', 
      count: stats.students, 
      link: '/admin/students',
      icon: '👥',
      color: 'bg-red-500',
      textColor: 'text-red-900',
      bgColor: 'bg-red-100',
      darkBgColor: 'dark:bg-red-900/20',
      gradientFrom: 'from-rose-200',
      gradientTo: 'to-pink-200',
      darkGradientFrom: 'dark:from-rose-700',
      darkGradientTo: 'dark:to-pink-800'
    },
    {
      title: 'Bank Details',
      count: stats.bankDetails,
      link: '/admin/bank-details',
      icon: '🏦',
  color: 'bg-yellow-500',
  textColor: 'text-yellow-900',
  bgColor: 'bg-yellow-100',
  darkBgColor: 'dark:bg-yellow-900/20',
  gradientFrom: 'from-yellow-200',
  gradientTo: 'to-amber-200',
  darkGradientFrom: 'dark:from-yellow-600',
  darkGradientTo: 'dark:to-amber-700'
    },
    {
      title: 'Payment Orders',
      count: stats.paymentOrders || 0,
      link: '/admin/payment-transactions',
      icon: '💳',
      color: 'bg-green-500',
      textColor: 'text-green-900',
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-green-900/20',
      gradientFrom: 'from-emerald-200',
      gradientTo: 'to-teal-200',
      darkGradientFrom: 'dark:from-emerald-700',
      darkGradientTo: 'dark:to-teal-800',
      subtitle: `${stats.completedPaymentOrders || 0} completed`
    },
    {
      title: 'Total Subscriptions',
      count: stats.subscriptions || 0,
      link: '/admin/subscriptions',
      icon: '👑',
      color: 'bg-purple-500',
      textColor: 'text-purple-900',
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-purple-900/20',
      gradientFrom: 'from-purple-200',
      gradientTo: 'to-fuchsia-200',
      darkGradientFrom: 'dark:from-purple-700',
      darkGradientTo: 'dark:to-fuchsia-800',
      subtitle: `${stats.activeSubscriptions || 0} active`
    },
    {
      title: 'Total Revenue',
      count: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      link: '/admin/payment-transactions',
      icon: '💰',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-900',
      bgColor: 'bg-emerald-100',
      darkBgColor: 'dark:bg-emerald-900/20',
      gradientFrom: 'from-green-200',
      gradientTo: 'to-emerald-200',
      darkGradientFrom: 'dark:from-green-700',
      darkGradientTo: 'dark:to-emerald-800',
      subtitle: 'From completed payments'
    },
    {
      title: 'Free Subscriptions',
      count: stats.freeSubscriptions || 0,
      link: '/admin/subscriptions',
      icon: '🆓',
      color: 'bg-gray-500',
      textColor: 'text-slate-900',
      bgColor: 'bg-slate-100',
      darkBgColor: 'dark:bg-gray-900/20',
      gradientFrom: 'from-slate-200',
      gradientTo: 'to-gray-200',
      darkGradientFrom: 'dark:from-slate-700',
      darkGradientTo: 'dark:to-gray-800',
      subtitle: 'Free plan users'
    },
    {
      title: 'Paid Subscriptions',
      count: stats.paidSubscriptions || 0,
      link: '/admin/subscriptions',
      icon: '💎',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-900',
      bgColor: 'bg-indigo-100',
      darkBgColor: 'dark:bg-indigo-900/20',
      gradientFrom: 'from-indigo-200',
      gradientTo: 'to-blue-200',
      darkGradientFrom: 'dark:from-indigo-700',
      darkGradientTo: 'dark:to-blue-800',
      subtitle: 'Basic/Premium/Pro plans'
    },
    { 
      title: 'Total Quizzes Attempted', 
      count: stats.totalQuizAttempts, 
      link: '/admin/performance-analytics',
      icon: '📊',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-900',
      bgColor: 'bg-indigo-100',
      darkBgColor: 'dark:bg-indigo-900/20',
      gradientFrom: 'from-cyan-200',
      gradientTo: 'to-sky-200',
      darkGradientFrom: 'dark:from-cyan-700',
      darkGradientTo: 'dark:to-sky-800',
      subtitle: 'All quiz attempts'
    },
    // Article Cards
    {
      title: 'Total Articles',
      count: stats.totalArticles || 0,
      link: '/admin/articles',
      icon: '📝',
      color: 'bg-blue-500',
      textColor: 'text-blue-900',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20',
      gradientFrom: 'from-blue-200',
      gradientTo: 'to-sky-200',
      darkGradientFrom: 'dark:from-blue-700',
      darkGradientTo: 'dark:to-sky-800',
      subtitle: `${stats.publishedArticles || 0} published`
    },
    {
      title: 'Draft Articles',
      count: stats.draftArticles || 0,
      link: '/admin/articles?status=draft',
      icon: '📄',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-900',
      bgColor: 'bg-yellow-100',
      darkBgColor: 'dark:bg-yellow-900/20',
      gradientFrom: 'from-amber-200',
      gradientTo: 'to-orange-200',
      darkGradientFrom: 'dark:from-amber-700',
      darkGradientTo: 'dark:to-orange-800',
      subtitle: 'Unpublished content'
    },
    {
      title: 'Featured Articles',
      count: stats.featuredArticles || 0,
      link: '/admin/articles?featured=true',
      icon: '⭐',
      color: 'bg-purple-500',
      textColor: 'text-purple-900',
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-purple-900/20',
      gradientFrom: 'from-purple-200',
      gradientTo: 'to-pink-200',
      darkGradientFrom: 'dark:from-purple-700',
      darkGradientTo: 'dark:to-pink-800',
      subtitle: 'Highlighted content'
    },
    {
      title: 'Article Views',
      count: stats.totalArticleViews || 0,
      link: '/admin/articles',
      icon: '👁️',
      color: 'bg-green-500',
      textColor: 'text-green-900',
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-green-900/20',
      gradientFrom: 'from-emerald-200',
      gradientTo: 'to-teal-200',
      darkGradientFrom: 'dark:from-emerald-700',
      darkGradientTo: 'dark:to-teal-800',
      subtitle: `${stats.totalArticleLikes || 0} likes`
    },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6 mb-2 md:mb-4 lg:mb-8">
          {cards.map((card) => (
            <Link key={card.title} to={card.link} className="group">
              <div className={`relative overflow-hidden rounded-xl p-2 md:p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${card.gradientFrom || ''} ${card.gradientTo || ''} ${card.darkGradientFrom || ''} ${card.darkGradientTo || ''} ${card.textColor} dark:text-white border border-gray-200 dark:border-white/10`}>
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${card.color} opacity-10 -translate-y-10 translate-x-10`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className={`text-3xl md:text-4xl lg:text-5xl`}>
                      {card.icon}
                    </div>
                    <div className={`w-16 lg:w-16 h-8 lg:h-12 rounded-lg ${card.bgColor} dark:bg-white/20 flex items-center justify-center`}>
                      <span className={`${card.textColor} dark:text-white font-bold text-lg`}>
                        {card.count}
                      </span>
                    </div>
                  </div>
                  
                  {/* Mobile: inline title and subtitle; Desktop: stacked */}
                  <div className="flex md:hidden justify-between items-center gap-1 mb-1">
                    <h3 className={`text-base font-semibold ${card.textColor} dark:text-white`}>
                      {card.title}
                    </h3>
                    <span className={`text-sm ${card.textColor} dark:text-white/90`}>
                      {card.subtitle || 'Total'}
                    </span>
                  </div>
                  <h3 className={`hidden md:block text-lg font-semibold mb-1 ${card.textColor} dark:text-white`}>
                    {card.title}
                  </h3>
                  <p className={`hidden md:block text-sm ${card.textColor} dark:text-white/90`}>
                    {card.subtitle || 'Total'}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className={`w-5 h-5 ${card.textColor} dark:text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-700 dark:to-emerald-800 rounded-xl p-3 lg:p-6 text-green-900 dark:text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 dark:text-green-200 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900 dark:text-white">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-green-600 dark:text-green-300 text-xs mt-1">From all completed payments</p>
              </div>
              <div className="text-4xl text-green-600 dark:text-green-300">💰</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-700 dark:to-indigo-800 rounded-xl p-3 lg:p-6 text-blue-900 dark:text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 dark:text-blue-200 text-sm font-medium">Payment Success Rate</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-white">
                  {stats.paymentOrders > 0 ? Math.round((stats.completedPaymentOrders / stats.paymentOrders) * 100) : 0}%
                </p>
                <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                  {stats.completedPaymentOrders || 0} of {stats.paymentOrders || 0} orders
                </p>
              </div>
              <div className="text-4xl text-blue-600 dark:text-blue-300">📊</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-800 rounded-xl p-3 lg:p-6 text-purple-900 dark:text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 dark:text-purple-200 text-sm font-medium">Active Subscriptions</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-white">{stats.activeSubscriptions || 0}</p>
                <p className="text-purple-600 dark:text-purple-300 text-xs mt-1">
                  {stats.subscriptions > 0 ? Math.round((stats.activeSubscriptions / stats.subscriptions) * 100) : 0}% of total
                </p>
              </div>
              <div className="text-4xl text-purple-600 dark:text-purple-300">👑</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-200 to-red-200 dark:from-orange-700 dark:to-red-800 rounded-xl p-3 lg:p-6 text-orange-900 dark:text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 dark:text-orange-200 text-sm font-medium">Free vs Paid</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-white">{stats.freeSubscriptions || 0} / {stats.paidSubscriptions || 0}</p>
                <p className="text-orange-600 dark:text-orange-300 text-xs mt-1">
                  Free plan / Paid plans
                </p>
              </div>
              <div className="text-4xl text-orange-600 dark:text-orange-300">📊</div>
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

            <Link to="/admin/articles" className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">📝</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Articles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create & Manage Blog Articles</p>
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
