import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import config from "../../config/appConfig";
import {
  FaTrophy,
  FaChartLine,
  FaUsers,
  FaStar,
  FaDownload,
  FaFilter,
  FaTh,
  FaList,
  FaTable,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
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

const PerformanceAnalytics = () => {
  const [viewMode, setViewMode] = useState("table");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ period: "month" });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  console.log(data, "data");
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    fetch(`${config.API_URL}/api/analytics/performance?${params}`, {
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
          setError(res.message || "Failed to load performance analytics");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load performance analytics");
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    if (!data?.topPerformers?.length) return;
    const rows = data.topPerformers.map((p) => ({
      Name: p.name || "Unknown",
      Level: p.level?.currentLevel || 0,
      "High Score Quizzes": p.level?.highScoreQuizzes || 0,
      "Avg Score": p.level?.averageScore?.toFixed(2) || "0.00",
    }));
    exportCSV(rows, "top_performers.csv");
  };

  if (loading)
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
        } p-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );

  if (!data)
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
        } p-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500">No data available</div>
        </div>
      </div>
    );
  const isDark = document.documentElement.classList.contains("dark");

  const chartTextColor = isDark ? "#ffffff" : "#000000";
  // Chart data
  const levelLabels = data.levelPerformance?.map((l) => `Level ${l._id}`) || [];
  const levelScores = data.levelPerformance?.map((l) => l.avgScore) || [];
  const levelUsers = data.levelPerformance?.map((l) => l.userCount) || [];
  const scoreTrendLabels = data.scoreDistribution?.map((s) => `${s._id}`) || [];

  const levelScoreBarData = {
    labels: levelLabels,
    datasets: [
      {
        label: "Average Score",
        data: levelScores,
        backgroundColor: darkMode
          ? "rgba(59, 130, 246, 0.8)"
          : "rgba(59, 130, 246, 0.7)",
        borderColor: darkMode
          ? "rgba(59, 130, 246, 1)"
          : "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const levelUserBarData = {
    labels: levelLabels,
    datasets: [
      {
        label: "Users",
        data: levelUsers,
        backgroundColor: darkMode
          ? "rgba(139, 92, 246, 0.8)"
          : "rgba(139, 92, 246, 0.7)",
        borderColor: darkMode
          ? "rgba(139, 92, 246, 1)"
          : "rgba(139, 92, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const scoreTrendLineData = {
    labels: scoreTrendLabels,
    datasets: [
      {
        label: "User Count",
        data: data.scoreDistribution?.map((s) => s.count) || [],
        borderColor: darkMode ? "rgba(0, 18, 129, 1)" : "rgba(0, 18, 129, 1)",
        backgroundColor: darkMode
          ? "rgba(0, 18, 129, 0.2)"
          : "rgba(0, 18, 129, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Average Score",
        data: data.scoreDistribution?.map((s) => s.avgScore) || [],
        borderColor: darkMode
          ? "rgba(16, 185, 129, 1)"
          : "rgba(16, 185, 129, 1)",
        backgroundColor: darkMode
          ? "rgba(16, 185, 129, 0.2)"
          : "rgba(16, 185, 129, 0.2)",
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
          color: chartTextColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: chartTextColor,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: chartTextColor,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: chartTextColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: chartTextColor,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: chartTextColor,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const sortedCategory = (data) => {
    return data.sort((a, b) => b.attemptCount - a.attemptCount);
  }

  return (
    <div className={`adminPanel ${isOpen ? "showPanel" : "hidePanel"}`}>
      {user?.role === "admin" && isAdminRoute && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive analysis of user performance and learning progress
          </p>
        </div>

        {/* Filters and Export */}
        <div className="border p-6 rounded-xl shadow-lg mb-8 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <FaFilter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <select
                name="period"
                value={filters.period}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">Last 12 months</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-200"
            >
              <FaDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: FaChartLine,
              label: "Overall Average Score",
              value: `${data.overview?.overallAvgScore?.toFixed(2) || "0.00"}`,
              iconBg: "bg-blue-100 dark:bg-blue-600",
              iconColor: "text-blue-600 dark:text-white",
            },
            {
              icon: FaTrophy,
              label: "Total High Scores",
              value: data.overview?.totalHighScores?.toLocaleString() || 0,
              iconBg: "bg-green-100 dark:bg-green-600",
              iconColor: "text-green-600 dark:text-white",
            },
            {
              icon: FaUsers,
              label: "Active Users",
              value: data.overview?.activeUsers?.toLocaleString() || 0,
              iconBg: "bg-purple-100 dark:bg-purple-600",
              iconColor: "text-purple-600 dark:text-white",
            },
            {
              icon: FaStar,
              label: "Avg Quiz Attempts",
              value: data.overview?.avgQuizAttempts?.toFixed(1) || "0.0",
              iconBg: "bg-yellow-100 dark:bg-yellow-600",
              iconColor: "text-yellow-600 dark:text-white",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border p-6 shadow-lg hover:shadow-xl transition-shadow bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${item.iconBg}`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Level Performance */}
          <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
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

          {/* Users per Level */}
          <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
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

        {/* Score Trend */}
        <div className="rounded-xl border p-2 md:p-6 shadow-lg mb-4 md:mb-8 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
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

        {/* Top Performers */}
      <div className="space-y-6">
      {/* Toggle View Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setViewMode("table")}
          className={`p-2 rounded ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          <FaTable />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          <FaList />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
        >
          <FaTh />
        </button>
      </div>

      {/* Top Performers */}
      <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performers
          </h3>
          <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
            <span className="text-blue-800 dark:text-blue-200 font-semibold text-md">
              Total: {data.topPerformers?.length}
            </span>
          </div>
        </div>

        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {[
                    "Rank",
                    "Name",
                    "Level",
                    "Subscription",
                    "Total Quizzes",
                    "Total Questions",
                    "High Score Quizzes",
                    "Avg. Score",
                    "Total Score",
                  ].map((label, i) => (
                    <th key={i} className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topPerformers?.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          i === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : i === 1
                            ? "bg-gray-100 text-gray-800"
                            : i === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{p.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {p.level ? `${p.level.levelName} - ${p.level.currentLevel}` : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 uppercase">
                      {p?.subscriptionStatus || "Free"}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {p.level?.quizzesPlayed || 0}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {p.level?.quizzesPlayed * 5 || 0}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {p.level?.highScoreQuizzes || 0}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {p.level?.averageScore?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {p.level?.totalScore?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-4">
            {data.topPerformers?.map((p, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row justify-between p-4 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 text-sm flex items-center justify-center rounded-full font-semibold ${
                      i === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : i === 1
                        ? "bg-gray-100 text-gray-800"
                        : i === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {p.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {p.level?.levelName || "No Level"}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 md:mt-0">
                  Score: {p.level?.totalScore?.toFixed(2) || "0.00"} | Quizzes:{" "}
                  {p.level?.quizzesPlayed || 0}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.topPerformers?.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span
                    className={`w-8 h-8 text-sm flex items-center justify-center rounded-full font-semibold ${
                      i === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : i === 1
                        ? "bg-gray-100 text-gray-800"
                        : i === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{p.name || "Unknown"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {p.level?.levelName || "No Level"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Quizzes: {p.level?.quizzesPlayed || 0} | High Score: {p.level?.highScoreQuizzes || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Avg Score: {p.level?.averageScore?.toFixed(2) || "0.00"}
                </p>
              </div>
            ))}
          </div>
        )}


      </div>
      </div>
      <div className="rounded-xl border p-6 shadow-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category Performance
        </h3>
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-semibold px-3 py-2 rounded-lg">
            Total: {data?.categoryPerformance?.length}
          </span>
          
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-[1000px] md:w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {["#", "Category", "Attempts", "Avg. Score", "Completion Rate"].map((label, i) => (
                  <th key={i} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedCategory(data?.categoryPerformance)?.map((item, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{item._id[0]}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{item.attemptCount}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{item.avgScore.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{(item.completionRate * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategory(data?.categoryPerformance)?.map((item, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item._id[0]}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Attempts:</span> {item.attemptCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Avg. Score:</span> {item.avgScore.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Completion Rate:</span> {(item.completionRate * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
      </div>
     
    </div>
  );
};

export default PerformanceAnalytics;
