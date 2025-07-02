import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import config from '../../config/appConfig';
import { FaUsers, FaChartBar, FaMoneyBillWave, FaTrophy, FaClock, FaStar } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardAnalytics = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    setLoading(true);
    fetch(`${config.API_URL}/api/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load dashboard analytics');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('Failed to load dashboard analytics');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-gray-500">No data available</div>
      </div>
    </div>
  );

  // Prepare chart data
  const levelLabels = data.levelDistribution?.map(l => `Level ${l._id}`) || [];
  const levelCounts = data.levelDistribution?.map(l => l.count) || [];
  const subscriptionLabels = data.subscriptionDistribution?.map(s => s._id) || [];
  const subscriptionCounts = data.subscriptionDistribution?.map(s => s.count) || [];

  const levelBarData = {
    labels: levelLabels,
    datasets: [
      {
        label: 'Users',
        data: levelCounts,
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.7)',
        borderColor: darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const subscriptionPieData = {
    labels: subscriptionLabels,
    datasets: [
      {
        label: 'Users',
        data: subscriptionCounts,
        backgroundColor: darkMode ? [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ] : [
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(251, 191, 36, 0.7)'
        ],
        borderColor: darkMode ? 'rgba(17, 24, 39, 1)' : 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: darkMode ? '#ffffff' : '#000000'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#ffffff' : '#000000'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: darkMode ? '#ffffff' : '#000000'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#ffffff' : '#000000',
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-6 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Analytics Dashboard
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive overview of platform performance and user engagement
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  <FaUsers className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.totalUsers?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                  <FaChartBar className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Quizzes</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.totalQuizzes?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-600' : 'bg-yellow-100'}`}>
                  <FaMoneyBillWave className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-yellow-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{data.overview?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                  <FaTrophy className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.activeUsers?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                  <FaClock className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Attempts</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.totalAttempts?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-pink-600' : 'bg-pink-100'}`}>
                  <FaStar className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-pink-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscriptions</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.totalSubscriptions?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Level Distribution
              </h3>
              {levelLabels.length > 0 ? (
                <Bar data={levelBarData} options={chartOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Subscription Distribution
              </h3>
              {subscriptionLabels.length > 0 ? (
                <Pie data={subscriptionPieData} options={pieOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>User</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quiz</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentActivity?.map((a, i) => (
                      <tr key={i} className={`${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {a.student?.name || 'Unknown'}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {a.quiz?.title || 'Unknown Quiz'}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(a.attemptedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="3" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No recent activity
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Users
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Level</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>High Scores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topUsers?.map((u, i) => (
                      <tr key={i} className={`${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {u.name || 'Unknown'}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {u.level?.currentLevel || 0}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {u.level?.highScoreQuizzes || 0}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="3" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DashboardAnalytics; 