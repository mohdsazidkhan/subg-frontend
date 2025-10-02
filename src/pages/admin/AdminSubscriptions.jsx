import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaEyeSlash, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaExclamationTriangle, 
  FaCrown, 
  FaStar, 
  FaGem, 
  FaRocket,
  FaSearch, 
  FaTable,
  FaTh,
  FaList,
  FaUsers,
  FaChartLine,
  FaCalendar,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import API from '../../utils/api';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';

const AdminSubscriptions = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    plan: 'all',
    status: 'all',
    year: new Date().getFullYear(),
    month: '0', // Default to no month filter
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [summary, setSummary] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    freeSubscriptions: 0,
    paidSubscriptions: 0,
    totalRevenue: 0,
    periodRevenue: 0
  });
  const [filterOptions, setFilterOptions] = useState({ 
    plans: ['Free', 'Basic', 'Premium', 'Pro'],
    statuses: ['all', 'active', 'inactive', 'expired', 'cancelled'],
    years: [],
    months: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSubscription, setExpandedSubscription] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    // Set default view based on screen size
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'grid' : 'table';
    }
    return 'table';
  }); // table, grid, list
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.getAdminSubscriptions({
        ...filters,
        sortField,
        sortOrder
      });
      
      if (response.success) {
        setSubscriptions(response.data.subscriptions);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: 0,
          limit: 20,
          hasNext: false,
          hasPrev: false
        });
        setSummary(response.data.summary || {});
      } else {
        setError(response.message || 'Failed to fetch subscriptions');
      }
    } catch (err) {
      setError('Error fetching subscriptions: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, sortField, sortOrder]);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await API.getAdminSubscriptionFilterOptions();
      if (response.success) {
        setFilterOptions(prev => ({
          ...prev,
          years: response.data.years || [],
          months: response.data.months || []
        }));
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Fetch summary data
  const fetchSummary = useCallback(async () => {
    try {
      const response = await API.getAdminSubscriptionSummary({
        year: filters.year,
        month: filters.month
      });
      if (response.success) {
        setSummary(response.data || {});
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, [filters.year, filters.month]);

  useEffect(() => {
    fetchSubscriptions();
    fetchSummary();
  }, [fetchSubscriptions, fetchSummary]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Handle window resize to update view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'table') {
        setViewMode('grid');
      } else if (window.innerWidth >= 768 && viewMode === 'grid') {
        setViewMode('table');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handlePageSizeChange = (newLimit) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1 // Reset to first page when changing page size
    }));
  };

  const toggleSubscriptionDetails = (subscriptionId) => {
    setExpandedSubscription(expandedSubscription === subscriptionId ? null : subscriptionId);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    // Check if dateString exists and is valid
    if (!dateString) {
      return 'N/A';
    }
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
    // Check if dateString exists and is valid
    if (!dateString) {
      return 'N/A';
    }
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day}-${month}-${year} at ${time}`;
  };

  const getPlanIcon = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'basic':
        return <FaStar className="text-yellow-500" />;
      case 'premium':
        return <FaGem className="text-purple-500" />;
      case 'pro':
        return <FaCrown className="text-yellow-600" />;
      default:
        return <FaRocket className="text-blue-500" />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'basic':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'pro':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-green-500" />;
      case 'inactive':
        return <FaTimesCircle className="text-red-500" />;
      case 'expired':
        return <FaClock className="text-orange-500" />;
      case 'cancelled':
        return <FaExclamationTriangle className="text-gray-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['User Name', 'Email', 'Plan', 'Status', 'Start Date', 'Expiry Date', 'Amount', 'Payment Method'];
    csvRows.push(headers.join(','));
    
    subscriptions.forEach(subscription => {
      const row = [
        subscription.user?.name || 'N/A',
        subscription.user?.email || 'N/A',
        subscription.planName || 'N/A',
        subscription.status || 'N/A',
        formatDate(subscription.startDate || subscription.createdAt),
        formatDate(subscription.expiryDate || 'N/A'),
        subscription.amount || 0,
        subscription.paymentMethod || 'N/A'
      ];
      csvRows.push(row.join(','));
    });
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `subscriptions_${filters.year}_${filters.month}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Subscriptions">
        <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
          {user?.role === 'admin' && isAdminRoute && <Sidebar />}
          <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <div className="text-lg">Loading subscriptions...</div>
              </div>
            </div>
          </div>
        </div>
      </AdminMobileAppWrapper>
    );
  }

  return (
    <AdminMobileAppWrapper title="Subscriptions">
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              User Subscriptions ({summary.totalSubscriptions || 0})
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage, view user subscriptions
            </p>
          </div>
          <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search subscriptions..."
                          value={filters.search}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 w-full"
                        />
                      </div>
          {/* View Mode Toggle - Hidden on mobile, shown on desktop */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded ${viewMode === 'table' ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <FaTable />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <FaList />
                  </button>
                </div>

                {/* Page Size Dropdown */}
                <div className="flex items-center space-x-2">
                  <select
                    value={filters.limit}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className="w-full lg:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <FaDownload className="text-sm" />
                  Export CSV
                </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Subscriptions</p>
                  <p className="text-2xl font-bold">{summary.totalSubscriptions || 0}</p>
                </div>
                <FaUsers className="text-3xl text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{summary.activeSubscriptions || 0}</p>
                </div>
                <FaCheckCircle className="text-3xl text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue || 0)}</p>
                </div>
                <FaChartLine className="text-3xl text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">This Period</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.periodRevenue || 0)}</p>
                </div>
                <FaCalendar className="text-3xl text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm font-medium">Free Subscriptions</p>
                  <p className="text-2xl font-bold">{summary.freeSubscriptions || 0}</p>
                </div>
                <div className="text-4xl text-gray-200">🆓</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Paid Subscriptions</p>
                  <p className="text-2xl font-bold">{summary.paidSubscriptions || 0}</p>
                </div>
                <div className="text-4xl text-indigo-200">💎</div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Filter Controls */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
                >
                  <FaFilter className="text-sm" />
                  Filters
                </button>
                
                {showFilters && (
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                      <select
                        value={filters.plan}
                        onChange={(e) => handleFilterChange('plan', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 w-full"
                      >
                        <option value="all">All Plans</option>
                        {filterOptions.plans.map(plan => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                      
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 w-full"
                      >
                        <option value="all">All Status</option>
                        {filterOptions.statuses.slice(1).map(status => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                      
                      <select
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 w-full"
                      >
                        <option value="">All Years</option>
                        {filterOptions.years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      
                      <select
                        value={filters.month}
                        onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 w-full"
                      >
                        <option value={0}>All Months</option>
                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>
                            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subscriptions Display */}
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center">
              <div className="text-red-600 dark:text-red-400 text-lg mb-2">⚠️ Error</div>
              <div className="text-red-700 dark:text-red-300">{error}</div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
              <FaCrown className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Subscriptions Found</h3>
              <p className="text-gray-500 dark:text-gray-500">No subscriptions match your current filters.</p>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === 'table' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            S.No.
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('createdAt')}
                          >
                            <div className="flex items-center gap-2">
                              Created At
                              <SortIcon field="createdAt" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('user.name')}
                          >
                            <div className="flex items-center gap-2">
                              User
                              <SortIcon field="user.name" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('planName')}
                          >
                            <div className="flex items-center gap-2">
                              Plan
                              <SortIcon field="planName" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center gap-2">
                              Status
                              <SortIcon field="status" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('startDate')}
                          >
                            <div className="flex items-center gap-2">
                              Start Date
                              <SortIcon field="startDate" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('expiryDate')}
                          >
                            <div className="flex items-center gap-2">
                              Expiry Date
                              <SortIcon field="expiryDate" />
                            </div>
                          </th>
                          <th 
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => handleSort('amount')}
                          >
                            <div className="flex items-center gap-2">
                              Amount
                              <SortIcon field="amount" />
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {subscriptions.map((subscription, index) => (
                          <tr key={subscription._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                              {((pagination.currentPage - 1) * filters.limit) + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatDateTime(subscription.createdAt || subscription.created_at || subscription.startDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                      {subscription.user?.name?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {subscription.user?.name || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {subscription.user?.email || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getPlanIcon(subscription.planName)}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(subscription.planName)}`}>
                                  {subscription.planName || 'Free'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                {getStatusIcon(subscription.status)}
                                {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1) || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatDate(subscription.startDate || subscription.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {subscription.expiryDate ? formatDate(subscription.expiryDate) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {subscription.amount ? formatCurrency(subscription.amount) : 'Free'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => toggleSubscriptionDetails(subscription._id)}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              >
                                {expandedSubscription === subscription._id ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                  {subscriptions.map((subscription) => (
                    <div key={subscription._id} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getPlanIcon(subscription.planName)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(subscription.planName)}`}>
                            {subscription.planName || 'Free'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1) || 'Unknown'}
                          </span>
                          <button
                            onClick={() => toggleSubscriptionDetails(subscription._id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {expandedSubscription === subscription._id ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                          <p className="font-medium text-gray-900 dark:text-white">{subscription.user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{subscription.user?.email || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {subscription.amount ? formatCurrency(subscription.amount) : 'Free'}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                            <p className="text-sm text-gray-900 dark:text-white">{formatDate(subscription.startDate || subscription.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {subscription.expiryDate ? formatDate(subscription.expiryDate) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div key={subscription._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row item-start lg:items-center justify-between gap-2 lg:gap-4">
                      <div>
                                <p className="font-medium text-gray-900 dark:text-white">{subscription.user?.name || 'N/A'}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{subscription.user?.email || 'N/A'}</p>
                              </div>

                          <div className="flex items-center gap-2">
                            {getPlanIcon(subscription.planName)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(subscription.planName)}`}>
                              {subscription.planName || 'Free'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getStatusIcon(subscription.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                              {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1) || 'Unknown'}
                            </span>
                          </div>
                              <div>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                  {subscription.amount ? formatCurrency(subscription.amount) : 'Free'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {subscription.expiryDate ? formatDate(subscription.expiryDate) : 'No expiry'}
                                </p>
                              </div>
                        <button
                          onClick={() => toggleSubscriptionDetails(subscription._id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                        >
                          {expandedSubscription === subscription._id ? <FaEyeSlash /> : <FaEye />}
                        </button>
                          
                        
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg text-sm ${
                              pagination.currentPage === page
                                ? 'bg-yellow-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default AdminSubscriptions;

