import React, { useEffect, useState, useCallback } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import AdminMobileAppWrapper from "../../components/AdminMobileAppWrapper";
import { getCurrentUser } from "../../utils/authUtils";
// import ResponsiveTable from '../../components/ResponsiveTable';
import Pagination from "../../components/Pagination";
import SearchFilter from "../../components/SearchFilter";
import { useLocation, useNavigate } from "react-router-dom";

const AdminUserQuestions = () => {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryStatus = new URLSearchParams(location.search).get("status");
  const initialStatus = ["pending", "approved", "rejected"].includes(
    queryStatus || ""
  )
    ? queryStatus
    : "";
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState(
    typeof window !== "undefined" && window.innerWidth < 768 ? "list" : "table"
  );

  // always in admin route in this page
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const user = getCurrentUser();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        status,
        page,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      const res = await API.adminGetUserQuestions(params);
      if (res?.success) {
        setItems(res.data || []);
        setTotal(res.pagination?.total || 0);
        setPagination(res.pagination || {});
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [status, page, itemsPerPage, searchTerm]);

  useEffect(() => {
    load();
  }, [load]);

  // Keep URL in sync when status changes via UI
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Update state if status in URL changes externally (e.g., navigation)
  useEffect(() => {
    const urlStatus = new URLSearchParams(location.search).get("status");
    if (
      urlStatus &&
      ["pending", "approved", "rejected"].includes(urlStatus) &&
      urlStatus !== status
    ) {
      setPage(1);
      setStatus(urlStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await API.adminUpdateUserQuestionStatus(id, newStatus);
      toast.success(`Question ${newStatus} successfully!`);
      load();
    } catch (err) {
      toast.error(err?.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "❓";
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    setPage(1);
  };

  // default view now controlled by viewMode state

  const content = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="text-xl lg:text-4xl mr-3">💭</span>
                User Questions Review ({total})
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Review and approve/reject user-submitted questions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <SearchFilter
                onSearch={handleSearch}
                placeholder="Search questions..."
                className="w-full sm:w-60"
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All</option>
                  <option value="pending">⏳ Pending Review</option>
                  <option value="approved">✅ Approved</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Show:
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              🤔
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {status === "pending"
                ? "No pending questions to review."
                : `No ${status} questions found.`}
            </p>
          </div>
        ) : (
          <>
            {/* Table view */}
            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Question
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Stats
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status / Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {items.map((q) => (
                      <tr key={q._id}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 max-w-[380px]">
                          <div className="font-medium mb-2">
                            {q.questionText}
                          </div>

                          {/* Options display */}
                          <div className="flex flex-wrap space-x-2 mb-2">
                            {(q.options || []).map((opt, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center space-x-2 text-xs ${
                                  idx === q.correctOptionIndex
                                    ? "text-green-700 dark:text-green-400 font-medium"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="truncate">{opt}</span>
                                {idx === q.correctOptionIndex && (
                                  <span className="text-green-600 dark:text-green-400">
                                    ✓
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {q.userId?.name || "Unknown"}
                          </div>
                          {(q.userId?.email || q.userId?.phone) && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {q.userId?.email || ""}
                              {q.userId?.email && q.userId?.phone ? " • " : ""}
                              {q.userId?.phone || ""}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="text-blue-600 dark:text-blue-400">
                              👁️ {q.viewsCount || 0}
                            </span>
                            <span className="text-red-600 dark:text-red-400">
                              ❤️ {q.likesCount || 0}
                            </span>
                            <span className="text-purple-600 dark:text-purple-400">
                              💬 {(q.answers || []).length}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div
                            className={`inline-block px-3 py-1 rounded-lg font-medium border ${getStatusColor(
                              q.status
                            )}`}
                          >
                            {getStatusIcon(q.status)} {q.status}
                          </div>
                          {q.status === "pending" && (
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => updateStatus(q._id, "approved")}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(q._id, "rejected")}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* List view */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {items.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                      {q.questionText}
                    </div>

                    {/* Options display */}
                    <div className="flex flex-wrap space-x-2 mb-2">
                      {(q.options || []).map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 text-xs ${
                            idx === q.correctOptionIndex
                              ? "text-green-700 dark:text-green-400 font-medium"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="truncate">{opt}</span>
                          {idx === q.correctOptionIndex && (
                            <span className="text-green-600 dark:text-green-400">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>
                        {q.userId?.name || "Unknown"}
                        {q.userId?.email ? ` • ${q.userId.email}` : ""}
                      </span>
                      <span>
                        Views: {q.viewsCount || 0} • Likes: {q.likesCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(
                          q.status
                        )}`}
                      >
                        {getStatusIcon(q.status)} {q.status}
                      </div>
                      {q.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(q._id, "approved")}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(q._id, "rejected")}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid view */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-3">
                      {q.questionText}
                    </div>

                    {/* Options display */}
                    <div className="flex flex-wrap space-x-2 mb-2">
                      {(q.options || []).map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 text-xs ${
                            idx === q.correctOptionIndex
                              ? "text-green-700 dark:text-green-400 font-medium"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="truncate">{opt}</span>
                          {idx === q.correctOptionIndex && (
                            <span className="text-green-600 dark:text-green-400">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      {q.userId?.name || "Unknown"}
                    </div>
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400">
                        👁️ {q.viewsCount || 0}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        ❤️ {q.likesCount || 0}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400">
                        💬 {(q.answers || []).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(
                          q.status
                        )}`}
                      >
                        {getStatusIcon(q.status)} {q.status}
                      </div>
                      {q.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(q._id, "approved")}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(q._id, "rejected")}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages || totalPages}
                  onPageChange={setPage}
                  totalItems={pagination.total || total}
                  itemsPerPage={pagination.limit || itemsPerPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <AdminMobileAppWrapper title="User Questions">
      <div className={`adminPanel ${isOpen ? "showPanel" : "hidePanel"}`}>
        {user?.role === "admin" && isAdminRoute && <Sidebar />}
        <div className="adminContent w-full text-gray-900 dark:text-white">
          {content}
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default AdminUserQuestions;
