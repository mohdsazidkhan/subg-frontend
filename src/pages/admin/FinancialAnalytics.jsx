import React, { useEffect, useState } from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
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
import { FaMoneyBillWave, FaChartPie, FaChartLine, FaCreditCard, FaDownload, FaFilter } from 'react-icons/fa';
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

const FinancialAnalytics = () => {
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
    fetch(`${config.API_URL}/api/analytics/financial?${params}`, {
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
          setError(res.message || 'Failed to load financial analytics');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('Failed to load financial analytics');
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    if (!data?.topRevenuePlans?.length) return;
    const rows = data.topRevenuePlans.map(p => ({
      Plan: p._id?.[0] || 'Unknown',
      'Total Revenue': p.totalRevenue || 0,
      Count: p.count || 0,
      'Avg Amount': p.avgAmount?.toFixed(2) || '0.00'
    }));
    exportCSV(rows, 'top_revenue_plans.csv');
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
  const planLabels = data.planDistribution?.map(p => p._id) || [];
  const planCounts = data.planDistribution?.map(p => p.count) || [];
  const revenueTrendLabels = data.revenueTrend?.map(r => `${r._id.year}-${r._id.month}`) || [];
  const revenueTrendData = data.revenueTrend?.map(r => r.revenue) || [];
  const paymentLabels = data.paymentStats?.map(p => p._id) || [];
  const paymentCounts = data.paymentStats?.map(p => p.count) || [];

  const planPieData = {
    labels: planLabels,
    datasets: [
      {
        label: 'Users',
        data: planCounts,
        backgroundColor: darkMode ? [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ] : [
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: darkMode ? 'rgba(17, 24, 39, 1)' : 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  const revenueLineData = {
    labels: revenueTrendLabels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueTrendData,
        borderColor: darkMode ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 1)',
        backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const paymentBarData = {
    labels: paymentLabels,
    datasets: [
      {
        label: 'Count',
        data: paymentCounts,
        backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.7)',
        borderColor: darkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
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
              Financial Analytics
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive financial insights and revenue analysis
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
                <div className={`p-3 rounded-full ${darkMode ? 'bg-green-600' : 'bg-green-100'}`}>
                  <FaMoneyBillWave className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-green-600'}`} />
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
                <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  <FaChartLine className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Period Revenue</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{data.overview?.periodRevenue?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-100'}`}>
                  <FaChartPie className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Plans</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.subscriptionStats?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-600' : 'bg-yellow-100'}`}>
                  <FaCreditCard className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-yellow-600'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Payments</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {data.paymentStats?.reduce((sum, p) => sum + p.count, 0) || 0}
                  </p>
      </div>
        </div>
        </div>
      </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Plan Distribution
              </h3>
          {planLabels.length > 0 ? (
                <Pie data={planPieData} options={pieOptions} />
          ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
          )}
        </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Trend
              </h3>
          {revenueTrendLabels.length > 0 ? (
                <Line data={revenueLineData} options={lineOptions} />
          ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No data available
                </div>
          )}
        </div>
      </div>

          {/* Payment Stats Chart */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg mb-8`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Payment Statistics
            </h3>
        {paymentLabels.length > 0 ? (
              <Bar data={paymentBarData} options={chartOptions} />
        ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No data available
              </div>
        )}
      </div>

          {/* Top Revenue Plans Table */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Revenue Plans
            </h3>
        <div className="overflow-x-auto">
              <table className="min-w-full">
            <thead>
                  <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rank</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Plan</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Revenue</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Count</th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.topRevenuePlans?.map((p, i) => (
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
                        {p._id?.[0] || 'Unknown'}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        ₹{p.totalRevenue?.toLocaleString() || 0}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {p.count || 0}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        ₹{p.avgAmount?.toFixed(2) || '0.00'}
                      </td>
                </tr>
              )) || (
                <tr>
                      <td colSpan="5" className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No revenue plans found
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

export default FinancialAnalytics; 