import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import { FaTrophy, FaMedal, FaCrown, FaCalendarAlt, FaUsers, FaRupeeSign, FaTh, FaList, FaTable, FaSearch } from 'react-icons/fa';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';
import { isMobile } from 'react-device-detect';

const AdminMonthlyWinners = () => {
  const [monthlyWinners, setMonthlyWinners] = useState([]);
  const [monthlyWinnersLoading, setMonthlyWinnersLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'table'); // 'grid', 'list', 'table'
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
  
  // If current month is September (9), default to August (8), otherwise use current month
  const defaultMonth = currentMonth - 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [showAllMonths, setShowAllMonths] = useState(false); // Toggle to show all months or specific month
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchMonthlyWinners = useCallback(async () => {
    try {
      setMonthlyWinnersLoading(true);
      
      let response;
      
      if (showAllMonths) {
        // Show all available months
        response = await API.getRecentMonthlyWinners(12);
      } else {
        // Format month to 2 digits (e.g., 8 -> "08")
        const formattedMonth = selectedMonth.toString().padStart(2, '0');
        const monthYear = `${selectedYear}-${formattedMonth}`;
        
        // Get data for the specific month only
        response = await API.getRecentMonthlyWinners(12, monthYear);
      }
      
      // Set the data
      setMonthlyWinners(response.data || []);
    } catch (error) {
      console.error('Error fetching monthly winners:', error);
      toast.error('Failed to fetch monthly winners');
      setMonthlyWinners([]);
    } finally {
      setMonthlyWinnersLoading(false);
    }
  }, [selectedYear, selectedMonth, showAllMonths]);

  const handleFilter = async () => {
    try {
      setFilterLoading(true);
      await fetchMonthlyWinners();
      if (showAllMonths) {
        toast.success('Showing all available monthly winners');
      } else {
        toast.success(`Filtered winners for ${selectedMonth}/${selectedYear}`);
      }
    } catch (error) {
      console.error('Error filtering monthly winners:', error);
      toast.error('Failed to fetch monthly winners');
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyWinners();
  }, [fetchMonthlyWinners]);

  // Auto-fetch when year, month, or showAllMonths changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMonthlyWinners();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth, showAllMonths]);

  return (
    <AdminMobileAppWrapper title="Monthly Winners">
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        <Sidebar />
        <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-4xl text-yellow-500" />
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Monthly Prize Winners
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Complete history of monthly prize winners
                </p>
              </div>
            </div>

            {/* Year and Month Filters - Moved to Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 dark:bg-gray-800 p-2 lg:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap hidden sm:block">Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  disabled={showAllMonths}
                  className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 sm:flex-none ${
                    showAllMonths 
                      ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap hidden sm:block">Month:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  disabled={showAllMonths}
                  className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 sm:flex-none ${
                    showAllMonths 
                      ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>

              <button
                onClick={handleFilter}
                disabled={filterLoading || showAllMonths}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto justify-center"
              >
                {filterLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaSearch className="text-sm" />
                )}
                <span>{filterLoading ? 'Filtering...' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {monthlyWinnersLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
            </div>
          ) : monthlyWinners.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {showAllMonths ? 'No Monthly Winners Available' : 'No Monthly Winners Found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {showAllMonths 
                  ? 'No monthly winners data is currently available in the system.'
                  : `No winners found for ${selectedMonth}/${selectedYear}. Try changing the year or month filter above.`
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 Tip: {currentMonth === 9 ? 'Currently showing August data by default. ' : ''}Try selecting different months to view available data!
              </p>
            </div>
          ) : (
            <>
              {/* Monthly Winners Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-600">
                  <div className="flex items-center gap-3">
                    <FaTrophy className="text-2xl text-yellow-600" />
                    <div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-400">Total Months</div>
                      <div className="text-xl lg:text-2xl font-bold text-yellow-800 dark:text-yellow-200">{monthlyWinners.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-600">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-2xl text-blue-600" />
                    <div>
                      <div className="text-sm text-blue-700 dark:text-blue-400">Total Winners</div>
                      <div className="text-xl lg:text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {monthlyWinners.reduce((total, month) => total + (month.totalWinners || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-600">
                  <div className="flex items-center gap-3">
                    <FaRupeeSign className="text-2xl text-green-600" />
                    <div>
                      <div className="text-sm text-green-700 dark:text-green-400">Total Distributed</div>
                      <div className="text-md lg:text-xl lg:text-2xl font-bold text-green-800 dark:text-green-200">
                        ₹{monthlyWinners.reduce((total, month) => total + (month.totalPrizePool || 0), 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-600">
                  <div className="flex items-center gap-3">
                    <FaMedal className="text-2xl text-purple-600" />
                    <div>
                      <div className="text-sm text-purple-700 dark:text-purple-400">Avg Winners/Month</div>
                      <div className="text-xl lg:text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {monthlyWinners.length > 0 ? (monthlyWinners.reduce((total, month) => total + (month.totalWinners || 0), 0) / monthlyWinners.length).toFixed(1) : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Toggle Buttons */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <FaTh className="text-lg" />
                      <span>Grid View</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <FaList className="text-lg" />
                      <span>List View</span>
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <FaTable className="text-lg" />
                      <span>Table View</span>
                    </button>
                  </div>
                  
                  {/* Show All Months Toggle */}
                  <button
                    onClick={() => setShowAllMonths(!showAllMonths)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      showAllMonths
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    <FaCalendarAlt className="text-sm" />
                    <span>{showAllMonths ? 'Show Specific Month' : 'Show All Months'}</span>
                  </button>
                </div>
              </div>

              {/* Monthly Winners Grid */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {monthlyWinners.map((monthData, index) => (
                    <div key={monthData._id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-xl" />
                            <h3 className="text-lg font-bold">{monthData.monthYear}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Total Prize</div>
                            <div className="text-lg font-bold">₹{monthData.totalPrizePool?.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-3">
                          {monthData.winners?.map((winner, winnerIndex) => (
                            <div key={winner._id || winnerIndex} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  winner.rank === 1 ? 'bg-yellow-500' : 
                                  winner.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                                }`}>
                                  {winner.rank === 1 ? <FaCrown /> : winner.rank === 2 ? <FaMedal /> : <FaMedal />}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">{winner.userName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{winner.userEmail}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                  ₹{winner.rewardAmount?.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {winner.highScoreWins} wins • {winner.accuracy}% accuracy
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Winners: {monthData.totalWinners}</span>
                            <span>Reset: {new Date(monthData.resetDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Monthly Winners List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {monthlyWinners.map((monthData, index) => (
                    <div key={monthData._id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-xl" />
                            <h3 className="text-xl font-bold">{monthData.monthYear}</h3>
                            <span className="text-sm opacity-90">• {monthData.totalWinners} Winners</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-90">Total Prize Pool</div>
                            <div className="text-lg font-bold">₹{monthData.totalPrizePool?.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 lg:p-6">
                        <div className="space-y-4">
                          {monthData.winners?.map((winner, winnerIndex) => (
                            <div key={winner._id || winnerIndex} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full  flex items-center justify-center text-white font-bold text-lg ${
                                  winner.rank === 1 ? 'bg-yellow-500' : 
                                  winner.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                                }`}>
                                  {winner.rank === 1 ? <FaCrown /> : winner.rank === 2 ? <FaMedal /> : <FaMedal />}
                                </div>
                                <div>
                                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{winner.userName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{winner.userEmail}</div>
                                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {winner.highScoreWins} wins • {winner.accuracy}% accuracy
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                                  ₹{winner.rewardAmount?.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Rank #{winner.rank}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Reset Date: {new Date(monthData.resetDate).toLocaleDateString()}</span>
                            <span>Processed by: {monthData.processedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Monthly Winners Table View */}
              {viewMode === 'table' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <FaTrophy className="text-2xl" />
                      <h3 className="text-xl font-bold">All Winners Table</h3>
                    </div>
                    <p className="text-sm opacity-90 mt-1">Complete list of all monthly winners with detailed information</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Winner
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Performance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Prize
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {monthlyWinners.map((monthData, monthIndex) => 
                          monthData.winners?.map((winner, winnerIndex) => (
                            <tr key={`${monthData._id}-${winner._id || winnerIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                    winner.rank === 1 ? 'bg-yellow-500' : 
                                    winner.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                                  }`}>
                                    {winner.rank === 1 ? <FaCrown /> : winner.rank === 2 ? <FaMedal /> : <FaMedal />}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    #{winner.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {winner.userName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {winner.userEmail}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                  {monthData.monthYear}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(monthData.resetDate).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  <span className="font-medium">{winner.highScoreWins}</span> wins
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">{winner.accuracy}%</span> accuracy
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                  ₹{winner.rewardAmount?.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Prize Amount
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(monthData.resetDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default AdminMonthlyWinners;
