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
import { FaQuestionCircle, FaChartBar, FaChartPie, FaFilter, FaDownload, FaTrophy, FaClock, FaStar } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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

const QuizAnalytics = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ period: 'month', category: '', difficulty: '' });
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    fetch(`${config.API_URL}/api/analytics/quizzes?${params}`, {
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
          setError(res.message || 'Failed to load quiz analytics');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('Failed to load quiz analytics');
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExportTop = () => {
    if (!data?.topQuizzes?.length) return;
    const rows = data.topQuizzes.map(q => ({
      Quiz: q.quizTitle?.[0] || 'Unknown',
      Attempts: q.attemptCount || 0,
      'Avg Score': q.avgScore?.toFixed(2) || '0.00'
    }));
    exportCSV(rows, 'top_quizzes.csv');
  };

  const handleExportRecent = () => {
    if (!data?.recentQuizzes?.length) return;
    const rows = data.recentQuizzes.map(q => ({
      Title: q.title || 'Unknown',
      Category: q.category?.name || 'Unknown',
      Difficulty: q.difficulty || 'Unknown',
      Created: new Date(q.createdAt).toLocaleDateString()
    }));
    exportCSV(rows, 'recent_quizzes.csv');
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
  const categoryLabels = data.categoryStats?.map(c => c.categoryName?.[0] || 'Unknown') || [];
  const categoryCounts = data.categoryStats?.map(c => c.quizCount) || [];
  const difficultyLabels = data.difficultyStats?.map(d => d._id) || [];
  const difficultyCounts = data.difficultyStats?.map(d => d.count) || [];

  const categoryBarData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Quizzes',
        data: categoryCounts,
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.7)',
        borderColor: darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const difficultyPieData = {
    labels: difficultyLabels,
    datasets: [
      {
        label: 'Quizzes',
        data: difficultyCounts,
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
              Quiz Analytics
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive insights into quiz performance and engagement
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
                name="category" 
                value={filters.category} 
                onChange={handleFilterChange} 
                placeholder="Category" 
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              />
              <input 
                name="difficulty" 
                value={filters.difficulty} 
                onChange={handleFilterChange} 
                placeholder="Difficulty" 
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              />
              <div className="ml-auto flex gap-2">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" 
                  onClick={handleExportTop}
                >
                  <FaDownload className="w-4 h-4" />
                  Top Quizzes
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" 
                  onClick={handleExportRecent}
                >
                  <FaDownload className="w-4 h-4" />
                  Recent Quizzes
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  <FaQuestionCircle className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
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
                <div className={`p-3 rounded-full ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                  <FaClock className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
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
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-600' : 'bg-yellow-100'}`}>
                  <FaStar className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-yellow-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Score</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.overview?.avgScore?.toFixed(1) || 0}%
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
                  Category Stats
                </h3>
              </div>
              {categoryLabels.length > 0 ? (
                <Bar data={categoryBarData} options={chartOptions} />
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
                  Difficulty Stats
                </h3>
              </div>
              {difficultyLabels.length > 0 ? (
                <Pie data={difficultyPieData} options={pieOptions} />
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
              <div className="flex items-center mb-4">
                <FaTrophy className={`w-5 h-5 mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Top Quizzes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quiz</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attempts</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topQuizzes?.map((q, i) => (
                      <tr key={i} className={`${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {q.quizTitle?.[0] || 'Unknown'}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {q.attemptCount || 0}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {q.avgScore?.toFixed(2) || '0.00'}%
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="3" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No quizzes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <div className="flex items-center mb-4">
                <FaClock className={`w-5 h-5 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Quizzes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Title</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Category</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Difficulty</th>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentQuizzes?.map((q, i) => (
                      <tr key={i} className={`${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b transition-colors`}>
                        <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {q.title || 'Unknown'}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {q.category?.name || 'Unknown'}
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            q.difficulty === 'expert' ? 'bg-red-100 text-red-800' :
                            q.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                            q.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {q.difficulty || 'Unknown'}
                          </span>
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="4" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No quizzes found
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

export default QuizAnalytics;