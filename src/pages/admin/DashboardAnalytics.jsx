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

  const isDark = document.documentElement.classList.contains('dark');

  const chartTextColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const levelLabels = data?.levelDistribution?.map(l => `Level ${l._id}`) || [];
  const levelCounts = data?.levelDistribution?.map(l => l.count) || [];

  const subscriptionLabels = data?.subscriptionDistribution?.map(s => s._id) || [];
  const subscriptionCounts = data?.subscriptionDistribution?.map(s => s.count) || [];

  const levelBarData = {
    labels: levelLabels,
    datasets: [{
      label: 'Users',
      data: levelCounts,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  };

  const subscriptionPieData = {
    labels: subscriptionLabels,
    datasets: [{
      label: 'Users',
      data: subscriptionCounts,
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(251, 191, 36, 0.7)'
      ],
      borderColor: isDark ? 'rgba(17, 24, 39, 1)' : '#fff',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: { color: chartTextColor }
      }
    },
    scales: {
      x: {
        ticks: { color: chartTextColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: chartTextColor },
        grid: { color: gridColor }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartTextColor,
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-red-700">
      <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-center text-gray-500 dark:text-gray-300">
      No data available
    </div>
  );

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive overview of platform performance and user engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {[
            { label: 'Total Users', icon: <FaUsers />, value: data.overview?.totalUsers, color: 'blue' },
            { label: 'Total Quizzes', icon: <FaChartBar />, value: data.overview?.totalQuizzes, color: 'green' },
            { label: 'Total Revenue', icon: <FaMoneyBillWave />, value: `₹${data.overview?.totalRevenue}`, color: 'yellow' },
            { label: 'Active Users', icon: <FaTrophy />, value: data.overview?.activeUsers, color: 'purple' },
            { label: 'Total Attempts', icon: <FaClock />, value: data.overview?.totalAttempts, color: 'indigo' },
            { label: 'Subscriptions', icon: <FaStar />, value: data.overview?.totalSubscriptions, color: 'pink' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className={`p-2 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-600`}>
                  {React.cloneElement(stat.icon, { className: `w-4 h-4 text-${stat.color}-600 dark:text-white` })}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Level Distribution</h3>
            {levelLabels.length > 0 ? (
              <Bar data={levelBarData} options={chartOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Subscription Distribution</h3>
            {subscriptionLabels.length > 0 ? (
              <Pie data={subscriptionPieData} options={pieOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-[1000px] md:w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Quiz</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentActivity?.length > 0 ? (
                    data.recentActivity.map((a, i) => (
                      <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="py-3 px-4">{a.user?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{a.quiz?.title || 'Unknown Quiz'}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{new Date(a.attemptedAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Top Users</h3>
            <div className="overflow-x-auto">
              <table className="w-[1000px] md:w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">High Scores Quizzes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Total Quizzes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topUsers?.length > 0 ? (
                    data.topUsers.map((u, i) => (
                      <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="py-3 px-4">{u.name || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.level?.levelName} - {u.level?.currentLevel || 0}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.level?.highScoreQuizzes || 0}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.level?.quizzesPlayed || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">
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
