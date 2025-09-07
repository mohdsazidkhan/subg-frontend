import React, { useState, useEffect, useCallback } from 'react';
import { FaTable, FaList, FaTh } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGlobalError } from '../contexts/GlobalErrorContext';
import { useTokenValidation } from '../hooks/useTokenValidation';
import API from '../utils/api';

  const TopPerformers = () => {
    const [viewMode, setViewMode] = useState(() => {
      // Set default view based on screen size
      return window.innerWidth < 768 ? "list" : "table";
    });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    
    // Global error context
    const { checkRateLimitError } = useGlobalError();
    
    // Token validation
    const { validateTokenBeforeRequest } = useTokenValidation();

  // Check if user is logged in and get current user info
  const isLoggedIn = !!localStorage.getItem("token");
  const currentUserId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const fetchTopPerformers = useCallback(async (isRefresh = false) => {
    // Validate token before making API call
    if (!validateTokenBeforeRequest()) {
      return;
    }
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Use centralized API service instead of direct fetch
      const result = await API.getPublicTopPerformersMonthly(10, currentUserId);
      
      if (result.success) {
        const month = result?.data?.month;
        const top = Array.isArray(result?.data?.top) ? result.data.top : [];
        // Transform to legacy shape expected by UI
        const transformed = top.map((u) => ({
          userId: u.userId,
          name: u.name,
          position: u.rank,
          isCurrentUser: u.userId === currentUserId,
          profilePicture: u.profilePicture,
          subscriptionName: u.subscriptionName,
          level: {
            currentLevel: u.monthly?.currentLevel || 0,
            levelName: u.monthly?.currentLevel === 10 ? 'Legend' : getLevelName(u.monthly?.currentLevel || 0),
            highScoreQuizzes: u.monthly?.highScoreWins || 0,
            quizzesPlayed: u.monthly?.totalQuizAttempts || 0,
            accuracy: u.monthly?.accuracy || 0,
            averageScore: u.monthly?.accuracy || 0
          }
        }));
        const surroundingUsers = Array.isArray(result?.data?.surroundingUsers) ? result.data.surroundingUsers : [];
        const currentUser = result?.data?.currentUser;
        
        // Transform surrounding users to match expected format
        const transformedSurroundingUsers = surroundingUsers.map((u) => ({
          userId: u.userId,
          name: u.name,
          position: u.position,
          isCurrentUser: u.isCurrentUser,
          subscriptionName: u.subscriptionName,
          level: {
            currentLevel: u.level?.currentLevel || 0,
            levelName: u.level?.levelName || getLevelName(u.level?.currentLevel || 0),
            highScoreQuizzes: u.level?.highScoreQuizzes || 0,
            quizzesPlayed: u.level?.quizzesPlayed || 0,
            accuracy: u.level?.accuracy || 0,
            averageScore: u.level?.averageScore || 0
          }
        }));

        setData({ 
          month, 
          topPerformers: transformed, 
          surroundingUsers: transformedSurroundingUsers, 
          currentUser: currentUser ? {
            userId: currentUser.userId,
            name: currentUser.name,
            position: currentUser.position,
            isCurrentUser: true,
            subscriptionName: currentUser.subscriptionName,
            level: {
              currentLevel: currentUser.level?.currentLevel || 0,
              levelName: currentUser.level?.levelName || getLevelName(currentUser.level?.currentLevel || 0),
              highScoreQuizzes: currentUser.level?.highScoreQuizzes || 0,
              quizzesPlayed: currentUser.level?.quizzesPlayed || 0,
              accuracy: currentUser.level?.accuracy || 0,
              averageScore: currentUser.level?.accuracy || 0
            }
          } : null,
          total: result.data.total || transformed.length 
        });
      } else {
        // Check if it's a rate limit error first
        const errorMessage = result.message || result.error || "Failed to load top performers. Please try again.";
        
        if (checkRateLimitError(errorMessage)) {
          // Rate limit error is handled globally, just set local error
          setError("Rate limit reached. Please wait or login for higher limits.");
        } else {
          // Show other backend errors
          setError(`Backend Error: ${errorMessage}`);
        }
      }
    } catch (err) {
      console.error("API Error:", err);
      
      // Check if it's a rate limit error first
      if (err.message && checkRateLimitError(err.message)) {
        // Rate limit error is handled globally, just set local error
        setError("Rate limit reached. Please wait or login for higher limits.");
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Network Error: Unable to connect to server. Please check if the backend is running.");
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Failed to load top performers. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId, checkRateLimitError, validateTokenBeforeRequest]);

  // Helper function to get level names
  const getLevelName = (level) => {
    const levelNames = {
      0: 'Starter', 1: 'Rookie', 2: 'Explorer', 3: 'Thinker', 4: 'Strategist', 5: 'Achiever',
      6: 'Mastermind', 7: 'Champion', 8: 'Prodigy', 9: 'Wizard', 10: 'Legend'
    };
    return levelNames[level] || 'Unknown';
  };

  useEffect(() => {
    fetchTopPerformers();
    
    // Auto-refresh every 5 minutes to keep data current
    const interval = setInterval(() => {
      fetchTopPerformers();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchTopPerformers, checkRateLimitError]);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && viewMode === "table") {
        setViewMode("list");
      } else if (!isMobile && viewMode === "list") {
        setViewMode("table");
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const getSortedTopPerformers = () => {
    if (!data?.topPerformers) return [];
    const performers = [...data.topPerformers];
    return performers.sort((a, b) => {
      // Use the transformed data structure (level properties contain monthly data)
      const aHighScore = a.level?.highScoreQuizzes || 0;
      const bHighScore = b.level?.highScoreQuizzes || 0;
      const aAccuracy = a.level?.accuracy || 0;
      const bAccuracy = b.level?.accuracy || 0;
      const aTotalQuizzes = a.level?.quizzesPlayed || 0;
      const bTotalQuizzes = b.level?.quizzesPlayed || 0;
      
      // First priority: High Score Wins (descending) - same as Performance Analytics
      if (aHighScore !== bHighScore) {
        return bHighScore - aHighScore;
      }
      
      // Second priority: Accuracy (descending) - same as Performance Analytics
      if (aAccuracy !== bAccuracy) {
        return bAccuracy - aAccuracy;
      }
      
      // Third priority: Total quizzes played (descending) - same as Performance Analytics
      return bTotalQuizzes - aTotalQuizzes;
    });
  };

  const getCurrentMonthDisplay = () => {
    if (data?.month) {
      const [year, month] = data.month.split('-');
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    
    // Fallback to current month if no data available
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Logged-out state UI
  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border p-3 lg:p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">🏆 Top Performers</h3>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">Login to View Your Rank</p>
          <Link
            to="/login"
            className="inline-flex bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-xs sm:text-sm md:text-base"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading {getCurrentMonthDisplay()} leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="text-red-500 dark:text-red-400 text-lg mb-4">
            ⚠️ {error}
          </div>
          <div className="text-sm text-red-600 dark:text-red-300 mb-4">
            This could be due to:
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Backend server not running</li>
              <li>Network connectivity issues</li>
              <li>Rate limiting from backend</li>
              <li>Backend service errors</li>
            </ul>
          </div>
          <button
            onClick={() => fetchTopPerformers(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  const topPerformers = getSortedTopPerformers();
  if (!topPerformers.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          No top performers data available.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-3 lg:p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <div className='mb-4 lg:mb-0 text-center lg:text-left'>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            🏆 Top 10 Performers - {getCurrentMonthDisplay()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Top performers for {getCurrentMonthDisplay()} based on high scores, accuracy & level
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Last updated: {new Date().toLocaleString()} | Data from {getCurrentMonthDisplay()}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
            ✅ Showing real-time {getCurrentMonthDisplay()} data | Auto-refreshes every 5 minutes
          </p>
        </div>
        
        {/* View Toggle Buttons and Refresh */}
        <div className="flex gap-2">
          <button
            onClick={() => fetchTopPerformers(true)}
            disabled={refreshing}
            className={`p-2 rounded-lg transition-all duration-200 ${
              refreshing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white shadow-lg`}
            title={refreshing ? "Refreshing..." : "Refresh Data"}
          >
            {refreshing ? '⏳' : '🔄'}
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "table" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Table View"
          >
            <FaTable />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "list" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="List View"
          >
            <FaList />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "grid" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Grid View"
          >
            <FaTh />
          </button>
        </div>
      </div>

      {/* Current User Position Section */}
      {data?.currentUser && (
        <div className="my-8 p-3 lg:p-6 bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-red-200 dark:border-yellow-600">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🎯 Your Current Position
          </h4>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 lg:p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {data.currentUser.position}
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                    {data.currentUser.name}
                  </h5>
                  <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              data.currentUser.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : data.currentUser.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : data.currentUser.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {data.currentUser.subscriptionName || "FREE"}
                        </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Level {data.currentUser.level.currentLevel} - {data.currentUser.level.levelName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Position #{data.currentUser.position} out of {data.total} students
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.currentUser.level.highScoreQuizzes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">High Scores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data.currentUser.level.quizzesPlayed}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Quizzes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refreshing Indicator */}
      {refreshing && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm">Refreshing {getCurrentMonthDisplay()} data...</span>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto border-2 border-blue-300 dark:border-indigo-500 rounded-2xl p-3 lg:p-6 bg-gradient-to-r from-blue-900/10 to-indigo-900/10">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🎯 Top 10 Performers - Table View
          </h4>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    Rank
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    Student
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    Level
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    Quizzes
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    High Scores
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-purple-800 dark:text-purple-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    Accuracy
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              {topPerformers.map((p, i) => (
                <tr
                  key={i}
                  className={`border-b transition-all duration-200 border-gray-200 hover:shadow-lg group ${
                    p.userId === currentUserId 
                      ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600 shadow-lg" :
                    i === 0 ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10" :
                    i === 1 ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10" :
                    i === 2 ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10" :
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10"
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full  flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        p.userId === currentUserId ? "bg-gradient-to-r from-red-500 to-yellow-500 ring-4 ring-red-300 dark:ring-yellow-400" :
                        i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                        i === 1 ? "bg-gradient-to-r from-gray-400 to-slate-500" :
                        i === 2 ? "bg-gradient-to-r from-orange-400 to-amber-500" :
                        "bg-gradient-to-r from-blue-400 to-indigo-500"
                      }`}>
                        {p.userId === currentUserId ? "👤" : i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </div>
                      {p.userId === currentUserId ? (
                        <div className="text-xs font-medium text-red-800 dark:text-yellow-200">
                          You
                        </div>
                      ) : i < 3 && (
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {i === 0 ? "1st Place" : i === 1 ? "2nd Place" : "3rd Place"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xl text-blue-600 dark:text-blue-400">
                          {p.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-md lg:text-lg">
                          {p.name || "Unknown"}
                        </div>
                        <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              p.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : p.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : p.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {p.subscriptionName || "FREE"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 text-sm">📈</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {p.level?.levelName || "No Level"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Level {p.level?.currentLevel || 0}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-sm">📚</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">
                          {p.level?.quizzesPlayed || 0}
                        </span>
                        {(p.level?.quizzesPlayed || 0) > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                            📚
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-yellow-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-600 dark:text-yellow-400 text-sm">⭐</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">
                          {p.level?.highScoreQuizzes || 0}
                        </span>
                        {(p.level?.highScoreQuizzes || 0) > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                            🏆
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 text-sm">🎯</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${
                          (p.level?.accuracy || 0) >= 80 ? 'text-green-600 dark:text-green-400' :
                          (p.level?.accuracy || 0) >= 70 ? 'text-blue-600 dark:text-blue-400' :
                          (p.level?.accuracy || 0) >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {p.level?.accuracy || 0}%
                        </span>
                        {(p.level?.accuracy || 0) > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                            🎯
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4 border-2 border-blue-300 dark:border-indigo-500 rounded-2xl p-3 lg:p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🎯 Top 10 Performers - List View
          </h4>
          {topPerformers.map((p, i) => (
            <div
              key={i}
              className={`p-2 lg:p-4 rounded-lg border dark:border-gray-600 transition-all duration-200 ${
                p.userId === currentUserId 
                  ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600 shadow-lg" :
                i === 0 
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-600 shadow-lg" 
                  : i === 1 
                  ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-green-900/20 dark:to-green-900/20 border-green-200 dark:border-green-600 shadow-md"
                  : i === 2 
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-600 shadow-md"
                  : "bg-gray-50 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full  flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  p.userId === currentUserId ? "bg-gradient-to-r from-red-500 to-yellow-500 ring-4 ring-red-300 dark:ring-yellow-400" :
                  i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                  i === 1 ? "bg-gradient-to-r from-gray-400 to-slate-500" :
                  i === 2 ? "bg-gradient-to-r from-orange-400 to-amber-500" :
                  "bg-gradient-to-r from-blue-400 to-indigo-500"
                }`}>
                  {p.userId === currentUserId ? "👤" : i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {p.name || "Unknown"}
                    
                    {p.userId === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100">
                        You
                      </span>
                    )}
                  </p>
                  <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              p.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : p.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : p.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {p.subscriptionName || "FREE"}
                        </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {p.level?.levelName || "No Level"}
                  </p>
                  
                </div>
                
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {/* High Score Badge */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-1 lg:p-3 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="text-center">
                    <div className="text-xl lg:text-xl lg:text-xl lg:text-xl lg:text-xl lg:text-2xl font-bold text-green-800 dark:text-green-200">
                      {p.level?.highScoreQuizzes || 0}
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      🏆 High Scores
                    </div>
                  </div>
                </div>
                
                {/* Total Quizzes Badge */}
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-1 lg:p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="text-center">
                    <div className="textxl lg:text-xl lg:text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {p.level?.quizzesPlayed || 0}
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      📚 Total Quizzes
                    </div>
                  </div>
                </div>
                
                {/* Accuracy Badge */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-1 lg:p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="text-center">
                    <div className={`text-xl lg:text-2xl font-bold ${
                      (p.level?.accuracy || 0) >= 80 ? 'text-green-800 dark:text-green-200' :
                      (p.level?.accuracy || 0) >= 70 ? 'text-blue-800 dark:text-blue-200' :
                      (p.level?.accuracy || 0) >= 60 ? 'text-yellow-800 dark:text-yellow-200' :
                      'text-red-800 dark:text-red-200'
                    }`}>
                      {p.level?.accuracy || 0}%
                    </div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      🎯 Accuracy
                    </div>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-1 lg:p-3 rounded-lg border border-purple-200 dark:border-pink-700">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {p.level?.currentLevel || 0}
                    </div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      📈 Level
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className='space-y-4 border-2 border-blue-300 dark:border-indigo-500 rounded-2xl p-3 lg:p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10'>
         <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🎯 Top 10 Performers - Grid View
          </h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
         
          {topPerformers.map((p, i) => (
            <div
              key={i}
              className={`p-2 lg:p-4 rounded-lg border dark:border-gray-600 hover:shadow-lg transition-all duration-200 ${
                p.userId === currentUserId 
                  ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600 shadow-lg" :
                i === 0 
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-600 shadow-lg" 
                  : i === 1 
                  ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-600 shadow-md"
                  : i === 2 
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-600 shadow-md"
                  : "bg-gray-50 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full  flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  p.userId === currentUserId ? "bg-gradient-to-r from-red-500 to-yellow-500 ring-4 ring-red-300 dark:ring-yellow-400" :
                  i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                  i === 1 ? "bg-gradient-to-r from-gray-400 to-slate-500" :
                  i === 2 ? "bg-gradient-to-r from-orange-400 to-amber-500" :
                  "bg-gradient-to-r from-blue-400 to-indigo-500"
                }`}>
                  {p.userId === currentUserId ? "👤" : i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {p.name || "Unknown"}
                    {p.userId === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100">
                        You
                      </span>
                    )}
                  </p>
                  <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              p.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : p.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : p.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {p.subscriptionName || "FREE"}
                        </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {p.level?.levelName || "No Level"}
                  </p>
                </div>
              </div>
              
              {/* High Score Badge */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-lg mb-3 border border-green-200 dark:border-green-700">
                <div className="text-center">
                  <div className="text-xl lg:text-xl lg:text-xl lg:text-xl lg:text-xl lg:text-2xl font-bold text-green-800 dark:text-green-200">
                    {p.level?.highScoreQuizzes || 0}
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    🏆 High Score Quizzes
                  </div>
                </div>
              </div>
              
              {/* Total Quizzes Badge */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-lg mb-3 border border-blue-200 dark:border-blue-700">
                <div className="text-center">
                  <div className="textxl lg:text-xl lg:text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {p.level?.quizzesPlayed || 0}
                  </div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    📚 Total Quizzes
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 rounded-lg mb-3 border border-purple-200 dark:border-pink-700">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {p.level?.currentLevel || 0}
                  </div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    📈 Level
                  </div>
                </div>
              </div>
              
              {/* Accuracy Badge */}
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 p-3 rounded-lg mb-3 border border-orange-200 dark:border-amber-700">
                <div className="text-center">
                  <div className={`text-xl lg:text-2xl font-bold ${
                    (p.level?.accuracy || 0) >= 80 ? 'text-green-800 dark:text-green-200' :
                    (p.level?.accuracy || 0) >= 70 ? 'text-blue-800 dark:text-blue-200' :
                    (p.level?.accuracy || 0) >= 60 ? 'text-yellow-800 dark:text-yellow-200' :
                    'text-red-800 dark:text-red-200'
                  }`}>
                    {p.level?.accuracy || 0}%
                  </div>
                  <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    🎯 Accuracy
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
 

      {/* Surrounding Users Section */}
      {data?.surroundingUsers && data.surroundingUsers.length > 0 && topPerformers.some(p => p.userId === currentUserId) && (
        <div className="mt-8 mb-8">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🔍 Your Competition Zone
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.surroundingUsers.map((user, index) => (
              <div
                key={user.userId}
                className={`p-2 lg:p-4 rounded-lg border transition-all duration-200 ${
                  user.isCurrentUser
                    ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600 shadow-lg"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full  flex items-center justify-center text-white font-bold text-lg ${
                    user.isCurrentUser
                      ? "bg-gradient-to-r from-red-500 to-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}>
                    {user.isCurrentUser ? "👤" : user.position}
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                      {user.isCurrentUser && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100">
                          You
                        </span>
                      )}
                    </h6>
                    <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              user.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : user.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : user.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {user.subscriptionName || "FREE"}
                        </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Level {user.level.currentLevel} - {user.level.levelName}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {user.level.highScoreQuizzes}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">High Scores</div>
                  </div>
                  <div className="text-center bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {user.level.quizzesPlayed}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Quizzes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extended Competition Zone - When current user is not in top 10 */}
      {data?.surroundingUsers && data.surroundingUsers.length > 0 && !topPerformers.some(p => p.userId === currentUserId) && (
        <div className="mt-12 p-3 md:p-6lg:p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-300 dark:border-pink-500 shadow-xl relative">

          <div className="text-center mb-8">
            <h4 className="text-xl lg:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
              🎯 Your Competition Zone
            </h4>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              You're not in the top 10 yet, but here's your current position and nearby competitors to help you climb up!
            </p>
          </div>
          
          {/* Current User Highlight */}
          {data.currentUser && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 rounded-xl border-2 border-red-300 dark:border-yellow-500 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl lg:text-4xl shadow-lg">
                  #{data.currentUser.position}
                </div>
                <div className="text-center md:text-left">
                  <h5 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {data.currentUser.name}
                  </h5>
                  <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              data.currentUser.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : data.currentUser.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : data.currentUser.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {data.currentUser.subscriptionName || "FREE"}
                        </div>
                  <p className="text-xl text-gray-700 dark:text-gray-200 mb-4">
                    Level {data.currentUser.level.currentLevel} - {data.currentUser.level.levelName}
                  </p>
                  <div className="flex gap-6 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                        {data.currentUser.level.highScoreQuizzes}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">High Scores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {data.currentUser.level.quizzesPlayed}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Quizzes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Surrounding Users Grid */}
          <div className="mb-8">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
              🔍 Nearby Competitors
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.surroundingUsers.map((user, index) => (
                <div
                  key={user.userId}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                    user.isCurrentUser
                      ? "bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-900 border-red-400 dark:border-yellow-600 shadow-lg transform scale-105"
                      : "bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      user.isCurrentUser
                        ? "bg-gradient-to-r from-red-500 to-yellow-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}>
                      {user.isCurrentUser ? "👤" : user.position}
                    </div>
                    <div>
                      <h6 className="font-bold text-gray-900 dark:text-white text-lg">
                        {user.name}
                        {user.isCurrentUser && (
                          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100">
                            You
                          </span>
                        )}
                      </h6>
                      <div className={`px-4 w-16 rounded flex items-center justify-center text-white font-medium text-sm shadow ${
                              data.currentUser.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : data.currentUser.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : data.currentUser.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {data.currentUser.subscriptionName || "FREE"}
                        </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Level {user.level.currentLevel} - {user.level.levelName}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                        {user.level.highScoreQuizzes}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">High Scores</div>
                    </div>
                    <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {user.level.quizzesPlayed}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Quizzes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      )}

    </div>
  );
};

export default TopPerformers;
