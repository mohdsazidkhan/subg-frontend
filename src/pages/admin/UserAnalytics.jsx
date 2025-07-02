import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
import { FaUsers, FaUserPlus, FaUserCheck, FaFilter, FaDownload, FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

function exportCSV(data, filename) {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
  for (const row of data) {
    csvRows.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  }
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const UserAnalytics = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ period: 'month', level: '', subscription: '' });
  const darkMode = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    fetch(`${config.API_URL}/api/analytics/users?${params}`, {
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
          setError(res.message || 'Failed to load user analytics');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('Failed to load user analytics');
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    if (!data?.topPerformers?.length) return;
    const rows = data.topPerformers.map(u => ({
      Name: u.name || 'Unknown',
      Level: u.level?.currentLevel || 0,
      'High Score Quizzes': u.level?.highScoreQuizzes || 0,
      Subscription: u.subscriptionStatus || 'free'
    }));
    exportCSV(rows, 'top_performers.csv');
  };

  if (loading) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-gray-500">No data available</div>
      </div>
    </div>
  );

  // Chart data
  const levelLabels = data.levelDistribution?.map(l => `Level ${l._id}`) || [];
  const levelCounts = data.levelDistribution?.map(l => l.count) || [];
  const subscriptionLabels = data.subscriptionStats?.map(s => s._id) || [];
  const subscriptionCounts = data.subscriptionStats?.map(s => s.count) || [];
  const userGrowthLabels = data.userGrowth?.map(g => `${g._id.year}-${g._id.month}-${g._id.day}`) || [];
  const userGrowthCounts = data.userGrowth?.map(g => g.count) || [];

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

  const userGrowthLineData = {
    labels: userGrowthLabels,
    datasets: [
      {
        label: 'New Users',
        data: userGrowthCounts,
        borderColor: darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)',
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
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

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
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

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-6 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              User Analytics
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Detailed insights into user behavior, growth, and performance
            </p>
          </div>

          {/* Filters */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg mb-8`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filters:</span>
              </div>
              <select 
                name="period" 
                value={filters.period} 
                onChange={handleFilterChange} 
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">Last 12 months</option>
              </select>
              <input 
                name="level" 
                value={filters.level} 
                onChange={handleFilterChange} 
                placeholder="Level" 
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              />
              <input 
                name="subscription" 
                value={filters.subscription} 
                onChange={handleFilterChange} 
                placeholder="Subscription" 
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              />
              <button 
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" 
                onClick={handleExport}
              >
                <FaDownload className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <FaUserPlus className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>New Users</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.newUsers?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                  <FaUserCheck className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.activeUsers?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <div className="flex items-center mb-4">
                <FaChartBar className={`w-5 h-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Level Distribution
                </h3>
              </div>
              {levelLabels.length > 0 ? (
                <Bar data={levelBarData} options={chartOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <div className="flex items-center mb-4">
                <FaChartPie className={`w-5 h-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Subscription Stats
                </h3>
              </div>
              {subscriptionLabels.length > 0 ? (
                <Pie data={subscriptionPieData} options={pieOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* User Growth Chart */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg mb-8`}>
            <div className="flex items-center mb-4">
              <FaChartLine className={`w-5 h-5 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                User Growth
              </h3>
            </div>
            {userGrowthLabels.length > 0 ? (
              <Line data={userGrowthLineData} options={lineOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>

          {/* Top Performers Table */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Performers
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Level</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>High Score Quizzes</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPerformers?.map((u, i) => (
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
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.subscriptionStatus === 'premium' ? 'bg-purple-100 text-purple-800' :
                          u.subscriptionStatus === 'basic' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {u.subscriptionStatus || 'free'}
                        </span>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="4" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
  );
};

export default UserAnalytics; 