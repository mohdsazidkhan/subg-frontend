import React, { useEffect, useState, useCallback } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import config from '../../config/appConfig';
import { 
  FaUsers, 
  FaTrophy, 
  FaMedal, 
  FaCrown, 
  FaChartLine, 
  FaStar, 
  FaBullseye, 
  FaCalendarAlt
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import ViewToggle from '../../components/ViewToggle';
import { isMobile } from 'react-device-detect';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
);

// Level names mapping - moved outside component for table views to access
const levelNames = {
  0: 'Starter',
  1: 'Rookie',
  2: 'Explorer',
  3: 'Thinker',
  4: 'Strategist',
  5: 'Achiever',
  6: 'Mastermind',
  7: 'Champion',
  8: 'Prodigy',
  9: 'Wizard',
  10: 'Legend'
};

const MonthlyProgressAnalytics = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [topPerformersViewMode, setTopPerformersViewMode] = useState(isMobile ? 'list' : 'table');
  const [rewardEligibleViewMode, setRewardEligibleViewMode] = useState(isMobile ? 'list' : 'table');

  useEffect(() => {
    fetchMonthlyProgressData();
  }, [selectedMonth]);

  const fetchMonthlyProgressData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/analytics/monthly-progress?month=${selectedMonth}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('Monthly Progress Data:', result.data);
        setData(result.data);
      } else {
        setError(result.message || 'Failed to load monthly progress analytics');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load monthly progress analytics');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  const isDark = document.documentElement.classList.contains('dark');
  const chartTextColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: chartTextColor }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: chartTextColor }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: chartTextColor }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: chartTextColor }
      }
    }
  };





  // Chart data
  const levelDistributionData = {
    labels: data?.levelDistribution?.map(l => levelNames[l._id] || `Level ${l._id}`) || [],
    datasets: [{
      label: 'Users',
      data: data?.levelDistribution?.map(l => l.count) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };

  const accuracyDistributionData = {
    labels: data?.accuracyDistribution?.map(a => a._id) || [],
    datasets: [{
      label: 'Users',
      data: data?.accuracyDistribution?.map(a => a.count) || [],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',   // Red for 0-25%
        'rgba(245, 158, 11, 0.7)',  // Yellow for 25-50%
        'rgba(59, 130, 246, 0.7)',  // Blue for 50-75%
        'rgba(34, 197, 94, 0.7)'    // Green for 75-100%
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 1,
    }]
  };

  const quizAttemptsTrendData = {
    labels: data?.quizAttemptsTrend?.map(t => `Day ${t._id.day}, Hour ${t._id.hour}`) || [],
    datasets: [{
      label: 'Quiz Attempts',
      data: data?.quizAttemptsTrend?.map(t => t.attemptCount) || [],
      borderColor: 'rgba(147, 51, 234, 1)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4
    }]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          {isAdminRoute && <Sidebar />}
          <div className={`flex-1 ${isAdminRoute && isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
            <div className="p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600 dark:text-gray-300">Loading monthly progress analytics...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          {isAdminRoute && <Sidebar />}
          <div className={`flex-1 ${isAdminRoute && isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
            <div className="p-8">
              <div className="text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 text-xl">{error}</p>
                <button
                  onClick={fetchMonthlyProgressData}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {isAdminRoute && <Sidebar />}
        <div className={`flex-1 ${isAdminRoute && isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    📊 Monthly Progress Analytics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track user progress and performance for the current month
                  </p>
                </div>
                
                {/* Month Selector */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Month:
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Current Month Display */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <FaCalendarAlt className="text-3xl" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </h2>
                    <p className="text-blue-100">
                      Monthly Progress Overview
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Total Users',
                  value: data?.overview?.totalUsers || 0,
                  icon: FaUsers,
                  gradient: 'from-blue-500 to-blue-600',
                  color: 'text-blue-600'
                },
                {
                  label: 'Avg High Score Wins',
                  value: Math.round(data?.overview?.avgHighScoreWins || 0),
                  icon: FaTrophy,
                  gradient: 'from-yellow-500 to-orange-600',
                  color: 'text-yellow-600'
                },
                                 {
                   label: 'Avg Accuracy',
                   value: `${Math.round(data?.overview?.avgAccuracy || 0)}%`,
                   icon: FaBullseye,
                   gradient: 'from-green-500 to-emerald-600',
                   color: 'text-green-600'
                 },
                {
                  label: 'Users at Level 10',
                  value: data?.overview?.usersAtLevel10 || 0,
                  icon: FaCrown,
                  gradient: 'from-purple-500 to-pink-600',
                  color: 'text-purple-600'
                }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      {React.cloneElement(stat.icon, { className: 'w-8 h-8 text-white' })}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold mb-2 uppercase tracking-wide text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </p>
                      <p className={`text-3xl font-bold ${stat.color}`}>
                        {stat.value?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avg Current Level</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly progression</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-indigo-600">
                  {Math.round(data?.overview?.avgCurrentLevel || 0)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaMedal className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Quiz Attempts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {data?.overview?.totalQuizAttempts?.toLocaleString() || 0}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <FaStar className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reward Eligible</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level 10 + 75% accuracy</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-yellow-600">
                  {data?.overview?.eligibleForRewards || 0}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Level Distribution</h3>
                {data?.levelDistribution?.length > 0 ? (
                  <Bar data={levelDistributionData} options={chartOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Accuracy Distribution</h3>
                {data?.accuracyDistribution?.length > 0 ? (
                  <Doughnut data={accuracyDistributionData} options={pieOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
                )}
              </div>
            </div>

            {/* Quiz Attempts Trend */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quiz Attempts Trend</h3>
              {data?.quizAttemptsTrend?.length > 0 ? (
                <Line data={quizAttemptsTrendData} options={chartOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performers */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Performers</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Best users this month</p>
                    </div>
                  </div>
                  
                  <ViewToggle
                    currentView={topPerformersViewMode}
                    onViewChange={setTopPerformersViewMode}
                    views={['table', 'list', 'grid']}
                  />
                </div>
                
                {topPerformersViewMode === 'table' && <TopPerformersTableView data={data?.topPerformers || []} />}
                {topPerformersViewMode === 'grid' && <TopPerformersCardView data={data?.topPerformers || []} />}
                {topPerformersViewMode === 'list' && <TopPerformersListView data={data?.topPerformers || []} />}
              </div>

              {/* Reward Eligible Users */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💎</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reward Eligible</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Users eligible for monthly rewards</p>
                    </div>
                  </div>
                  
                  <ViewToggle
                    currentView={rewardEligibleViewMode}
                    onViewChange={setRewardEligibleViewMode}
                    views={['table', 'list', 'grid']}
                  />
                </div>
                
                {rewardEligibleViewMode === 'table' && <RewardEligibleTableView data={data?.rewardEligibleUsers || []} />}
                {rewardEligibleViewMode === 'grid' && <RewardEligibleCardView data={data?.rewardEligibleUsers || []} />}
                {rewardEligibleViewMode === 'list' && <RewardEligibleListView data={data?.rewardEligibleUsers || []} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Views
const TopPerformersTableView = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Rank</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Level</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Wins</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => (
          <tr key={user.name} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="py-3 px-4">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {index + 1}
              </span>
            </td>
            <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
            <td className="py-3 px-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm">
                {levelNames[user.monthly?.currentLevel] || `Level ${user.monthly?.currentLevel}`}
              </span>
            </td>
            <td className="py-3 px-4 text-gray-900 dark:text-white">{user.monthly?.highScoreWins || 0}</td>
            <td className="py-3 px-4 text-gray-900 dark:text-white">{user.monthly?.accuracy || 0}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TopPerformersCardView = ({ data }) => (
  <div className="grid grid-cols-1 gap-4">
    {data.map((user, index) => (
      <div key={user.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              index === 0 ? 'bg-yellow-100 text-yellow-800' :
              index === 1 ? 'bg-gray-100 text-gray-800' :
              index === 2 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {index + 1}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.subscriptionStatus}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Level</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {levelNames[user.monthly?.currentLevel] || `Level ${user.monthly?.currentLevel}`}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Wins</p>
            <p className="font-semibold text-gray-900 dark:text-white">{user.monthly?.highScoreWins || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Accuracy</p>
            <p className="font-semibold text-gray-900 dark:text-white">{user.monthly?.accuracy || 0}%</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const TopPerformersListView = ({ data }) => (
  <div className="space-y-3">
    {data.map((user, index) => (
      <div key={user.name} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
            index === 0 ? 'bg-yellow-100 text-yellow-800' :
            index === 1 ? 'bg-gray-100 text-gray-800' :
            index === 2 ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {index + 1}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {levelNames[user.monthly?.currentLevel] || `Level ${user.monthly?.currentLevel}`}
          </span>
          <span className="text-gray-900 dark:text-white">{user.monthly?.highScoreWins || 0} wins</span>
          <span className="text-gray-900 dark:text-white">{user.monthly?.accuracy || 0}%</span>
        </div>
      </div>
    ))}
  </div>
);

// Reward Eligible Views
const RewardEligibleTableView = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Level</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Wins</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Accuracy</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.name} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
            <td className="py-3 px-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm">
                {levelNames[user.monthly?.currentLevel] || `Level ${user.monthly?.currentLevel}`}
              </span>
            </td>
            <td className="py-3 px-4 text-gray-900 dark:text-white">{user.monthly?.highScoreWins || 0}</td>
            <td className="py-3 px-4 text-gray-900 dark:text-white">{user.monthly?.accuracy || 0}%</td>
            <td className="py-3 px-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                Eligible
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RewardEligibleCardView = ({ data }) => (
  <div className="grid grid-cols-1 gap-4">
    {data.map((user) => (
      <div key={user.name} className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.subscriptionStatus}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Level</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {levelNames[user.monthly?.currentLevel] || `Level ${user.monthly?.currentLevel}`}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Wins</p>
            <p className="font-semibold text-gray-900 dark:text-white">{user.monthly?.highScoreWins || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Accuracy</p>
            <p className="font-semibold text-gray-900 dark:text-white">{user.monthly?.accuracy || 0}%</p>
          </div>
        </div>
        <div className="mt-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
            🎉 Eligible for Monthly Rewards
          </span>
        </div>
      </div>
    ))}
  </div>
);

const RewardEligibleListView = ({ data }) => (
  <div className="space-y-3">
    {data.map((user) => (
      <div key={user.name} className="flex items-center justify-between p-3 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {levelNames[user.monthly?.currentLevel] || `Level ${user.monthly?.currentLevel}`}
          </span>
          <span className="text-gray-900 dark:text-white">{user.monthly?.highScoreWins || 0} wins</span>
          <span className="text-gray-900 dark:text-white">{user.monthly?.accuracy || 0}%</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
            Eligible
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default MonthlyProgressAnalytics;
