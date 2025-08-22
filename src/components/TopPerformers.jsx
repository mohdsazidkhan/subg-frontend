import React, { useState, useEffect, useCallback } from 'react';
import { FaTable, FaList, FaTh } from 'react-icons/fa';
import config from '../config/appConfig';

const TopPerformers = () => {
  const [viewMode, setViewMode] = useState("table");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in and get current user info
  const isLoggedIn = !!localStorage.getItem("token");
  const currentUserId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const fetchTopPerformers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/public/top-performers`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load top performers");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load top performers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTopPerformers();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, fetchTopPerformers]);

  const getSortedTopPerformers = () => {
    if (!data?.topPerformers) return [];
    const performers = [...data.topPerformers];
    return performers.sort((a, b) => (b.level?.highScoreQuizzes || 0) - (a.level?.highScoreQuizzes || 0));
  };

  // Don't show anything if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 dark:text-red-400 text-lg">
          {error}
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
    <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            🏆 Top Performers
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Top performing students current academic year {data?.academicYear || '2024-2025'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            📅 Academic Year: 1 April, {data?.academicYear?.split('-')[0] || '2024'} - 31 March, {data?.academicYear?.split('-')[1] || '2025'}
          </p>
        </div>
        
        {/* View Toggle Buttons */}
        <div className="flex gap-2">
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
      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
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
                <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏅</span>
                    Total Score
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
                      ? "bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-800 dark:to-indigo-900 border-blue-400 dark:border-blue-600 shadow-lg" :
                    i === 0 ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10" :
                    i === 1 ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10" :
                    i === 2 ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-orange-900/10" :
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10"
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        p.userId === currentUserId ? "bg-gradient-to-r from-blue-600 to-indigo-700 ring-4 ring-blue-300 dark:ring-blue-500" :
                        i === 0 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                        i === 1 ? "bg-gradient-to-r from-gray-400 to-slate-500" :
                        i === 2 ? "bg-gradient-to-r from-orange-400 to-amber-500" :
                        "bg-gradient-to-r from-blue-400 to-indigo-500"
                      }`}>
                        {p.userId === currentUserId ? "👤" : i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </div>
                      {p.userId === currentUserId ? (
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200">
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
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          {p.name || "Unknown"}
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
                      <span className="font-bold text-gray-900 dark:text-white text-lg">
                        {p.level?.quizzesPlayed || 0}
                      </span>
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
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 text-sm">🏅</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">
                        {p.level?.totalScore?.toFixed(2) || "0.00"}
                      </span>
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
        <div className="space-y-4">
          {topPerformers.map((p, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row justify-between p-4 rounded-lg border dark:border-gray-600 transition-all duration-200 ${
                p.userId === currentUserId 
                  ? "bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-800 dark:to-indigo-900 border-blue-400 dark:border-blue-600 shadow-lg" :
                i === 0 
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-600 shadow-lg" 
                  : i === 1 
                  ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-600 shadow-md"
                  : i === 2 
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-600 shadow-md"
                  : "bg-gray-50 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 text-sm flex items-center justify-center rounded-full font-semibold ${
                    p.userId === currentUserId
                      ? "bg-blue-200 text-blue-900 ring-2 ring-blue-400 dark:bg-blue-700 dark:text-blue-100 dark:ring-blue-500"
                      : i === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : i === 1
                      ? "bg-gray-100 text-gray-800"
                      : i === 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {p.userId === currentUserId ? "👤" : i === 0 ? "👑" : i + 1}
                </span>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {p.name || "Unknown"}
                    {p.userId === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-blue-100">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {p.level?.levelName || "No Level"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-2 md:mt-0">
                {/* High Score Highlight */}
                <div className="bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-800 dark:text-green-200">
                      {p.level?.highScoreQuizzes || 0}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      High Scores
                    </div>
                  </div>
                </div>
                
                {/* Score Details */}
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Total Score:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {p.level?.totalScore?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Quizzes:</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">
                      {p.level?.quizzesPlayed || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.map((p, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border dark:border-gray-600 hover:shadow-lg transition-all duration-200 ${
                p.userId === currentUserId 
                  ? "bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-800 dark:to-indigo-900 border-blue-400 dark:border-blue-600 shadow-lg" :
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
                <span
                  className={`w-8 h-8 text-sm flex items-center justify-center rounded-full font-semibold ${
                    p.userId === currentUserId
                      ? "bg-blue-200 text-blue-900 ring-2 ring-blue-400 dark:bg-blue-700 dark:text-blue-100 dark:ring-blue-500"
                      : i === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : i === 1
                      ? "bg-gray-100 text-gray-800"
                      : i === 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {p.userId === currentUserId ? "👤" : i === 0 ? "👑" : i + 1}
                </span>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {p.name || "Unknown"}
                    {p.userId === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-blue-100">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {p.level?.levelName || "No Level"}
                  </p>
                </div>
              </div>
              
              {/* High Score Badge */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-lg mb-3 border border-green-200 dark:border-green-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {p.level?.highScoreQuizzes || 0}
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    🏆 High Score Quizzes
                  </div>
                </div>
              </div>
              
              {/* Performance Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Quizzes:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {p.level?.quizzesPlayed || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Score:</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {p.level?.totalScore?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
