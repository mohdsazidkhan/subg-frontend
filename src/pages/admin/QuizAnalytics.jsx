// QuizAnalytics.jsx – Part 1
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaQuestionCircle,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaDownload,
  FaTrophy,
  FaClock,
  FaStar,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import config from "../../config/appConfig";
import Sidebar from "../../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function exportCSV(data, filename) {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  for (const row of data) {
    csvRows.push(headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
  }
  const csv = csvRows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const QuizAnalytics = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    period: "month",
    category: "",
    difficulty: "",
  });



  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    fetch(`${config.API_URL}/api/analytics/quizzes?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || "Failed to load quiz analytics");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load quiz analytics");
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExportTop = () => {
    if (!data?.topQuizzes?.length) return;
    const rows = data.topQuizzes.map((q) => ({
      Quiz: q.quizTitle?.[0] || "Unknown",
      Attempts: q.attemptCount || 0,
      "Avg Score": q.avgScore?.toFixed(2) || "0.00",
    }));
    exportCSV(rows, "top_quizzes.csv");
  };

  const handleExportRecent = () => {
    if (!data?.recentQuizzes?.length) return;
    const rows = data.recentQuizzes.map((q) => ({
      Title: q.title || "Unknown",
      Category: q.category?.name || "Unknown",
      Difficulty: q.difficulty || "Unknown",
      Created: new Date(q.createdAt).toLocaleDateString(),
    }));
    exportCSV(rows, "recent_quizzes.csv");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const categoryLabels =
    data.categoryStats?.map((c) => c.categoryName?.[0] || "Unknown") || [];
  const categoryCounts = data.categoryStats?.map((c) => c.quizCount) || [];
  const difficultyLabels = data.difficultyStats?.map((d) => d._id) || [];
  const difficultyCounts = data.difficultyStats?.map((d) => d.count) || [];

  const categoryBarData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Quizzes",
        data: categoryCounts,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const levelLabels = data.levelStats?.map((l) => l._id || "Unknown") || [];
  const levelCounts = data.levelStats?.map((l) => l.count) || [];

  const levelBarData = {
    labels: levelLabels,
    datasets: [
      {
        label: "Quizzes",
        data: levelCounts,
        backgroundColor: "rgba(251, 191, 36, 0.7)",
        borderColor: "rgba(251, 191, 36, 1)",
        borderWidth: 1,
      },
    ],
  };


  const difficultyPieData = {
    labels: difficultyLabels,
    datasets: [
      {
        label: "Quizzes",
        data: difficultyCounts,
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(251, 191, 36, 0.7)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartColor = {
    text: {
      light: '#000000',
      dark: '#ffffff'
    },
    grid: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.1)'
    }
  };

  const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: chartColor.text[mode] },
        grid: { color: chartColor.grid[mode] },
      },
      y: {
        ticks: { color: chartColor.text[mode] },
        grid: { color: chartColor.grid[mode] },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: chartColor.text[mode],
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div
      className={`adminPanel ${
        isOpen ? "showPanel" : "hidePanel"
      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
    >
      {user?.role === "admin" && isAdminRoute && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Insights into performance and trends
            </p>
          </div>
    
        </div>

        {/* Filters */}
        <div className="rounded-xl border p-2 md:p-6 shadow-lg mb-4 md:mb-8 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filters:
              </span>
            </div>
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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
              className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            />
            <input
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              placeholder="Difficulty"
              className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            />
            <div className="ml-auto flex gap-2">
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
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
          {/* Total Quizzes */}
          <div className="rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-600">
                <FaQuestionCircle className="w-6 h-6 text-yellow-600 dark:text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Quizzes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.overview?.totalQuizzes?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Attempts */}
          <div className="rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-600">
                <FaClock className="w-6 h-6 text-green-600 dark:text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Attempts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.overview?.totalAttempts?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-600">
                <FaStar className="w-6 h-6 text-yellow-600 dark:text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.overview?.avgScore?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Category Bar Chart */}
          <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaChartBar className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Category Stats
              </h3>
            </div>
            {categoryLabels.length > 0 ? (
              <Bar data={categoryBarData} options={chartOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No data available
              </div>
            )}
          </div>

          {/* Level Bar Chart */}
        <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaChartBar className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Level Stats
            </h3>
          </div>
          {levelLabels.length > 0 ? (
            <Bar data={levelBarData} options={chartOptions} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No data available
            </div>
          )}
        </div>

          {/* Difficulty Pie Chart */}
          <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaChartPie className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Difficulty Stats
              </h3>
            </div>
            {difficultyLabels.length > 0 ? (
              <Pie data={difficultyPieData} options={pieOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No data available
              </div>
            )}
          </div>


        </div>

        

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Quizzes Table */}
          <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaTrophy className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Quizzes
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-[1000px] md:w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Quiz
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Attempts
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Avg Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topQuizzes?.length > 0 ? (
                    data.topQuizzes.map((q, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {q.quizTitle?.[0] || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {q.attemptCount || 0}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {q.avgScore?.toFixed(2) || "0.00"}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
                        No quizzes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Quizzes Table */}
          <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaClock className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Quizzes
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-[1000px] md:w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Difficulty
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentQuizzes?.length > 0 ? (
                    data.recentQuizzes.map((q, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {q.title || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {q.category?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              q.difficulty === "expert"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : q.difficulty === "advanced"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                : q.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {q.difficulty || "Unknown"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
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
