import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import config from '../../config/appConfig';
import { FaTrophy, FaChartLine, FaUsers, FaStar, FaDownload, FaFilter } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

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

const PerformanceAnalytics = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ period: 'month' });
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    fetch(`${config.API_URL}/api/analytics/performance?${params}`, {
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
          setError(res.message || 'Failed to load performance analytics');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('Failed to load performance analytics');
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    if (!data?.topPerformers?.length) return;
    const rows = data.topPerformers.map(p => ({
      Name: p.name || 'Unknown',
      Level: p.level?.currentLevel || 0,
      'High Score Quizzes': p.level?.highScoreQuizzes || 0,
      'Avg Score': p.level?.averageScore?.toFixed(2) || '0.00'
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

  // Chart data
  const levelLabels = data.levelPerformance?.map(l => `Level ${l._id}`) || [];
  const levelScores = data.levelPerformance?.map(l => l.avgScore) || [];
  const levelUsers = data.levelPerformance?.map(l => l.userCount) || [];
  const scoreTrendLabels = data.scoreTrend?.map(s => `${s._id.year}-${s._id.month}`) || [];

  const levelScoreBarData = {
    labels: levelLabels,
    datasets: [
      {
        label: 'Average Score',
        data: levelScores,
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.7)',
        borderColor: darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const levelUserBarData = {
    labels: levelLabels,
    datasets: [
      {
        label: 'Users',
        data: levelUsers,
        backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.7)',
        borderColor: darkMode ? 'rgba(139, 92, 246, 1)' : 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const scoreTrendLineData = {
    labels: scoreTrendLabels,
    datasets: [
      {
        label: 'Average Score',
        data: data.scoreTrend?.map(s => s.avgScore) || [],
        borderColor: darkMode ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 1)',
        backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.2)',
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

  const lineOptions = {
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

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-6 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Performance Analytics
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive analysis of user performance and learning progress
            </p>
          </div>

          {/* Filters and Export */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg mb-8`}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <FaFilter className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <select 
                  name="period" 
                  value={filters.period} 
                  onChange={handleFilterChange} 
                  className={`border rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 3 months</option>
                  <option value="year">Last 12 months</option>
                </select>
              </div>
              <button 
                className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-700'}`}
                onClick={handleExport}
              >
                <FaDownload className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  <FaChartLine className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Average Score</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.overallAvgScore?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                  <FaTrophy className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total High Scores</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.totalHighScores?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                  <FaUsers className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
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
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-600' : 'bg-yellow-100'}`}>
                  <FaStar className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-yellow-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Quiz Attempts</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.avgQuizAttempts?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Level Performance
              </h3>
              {levelLabels.length > 0 ? (
                <Bar data={levelScoreBarData} options={chartOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Users per Level
              </h3>
              {levelLabels.length > 0 ? (
                <Bar data={levelUserBarData} options={chartOptions} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Score Trend Chart */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg mb-8`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Score Trend Over Time
            </h3>
            {scoreTrendLabels.length > 0 ? (
              <Line data={scoreTrendLineData} options={lineOptions} />
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
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rank</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Level</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>High Score Quizzes</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPerformers?.map((p, i) => (
                    <tr key={i} className={`${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                      <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          i === 0 ? 'bg-yellow-100 text-yellow-800' :
                          i === 1 ? 'bg-gray-100 text-gray-800' :
                          i === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {p.name || 'Unknown'}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {p.level?.currentLevel || 0}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {p.level?.highScoreQuizzes || 0}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {p.level?.averageScore?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="5" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No performers found
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

export default PerformanceAnalytics;