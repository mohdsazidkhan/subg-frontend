import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import ViewToggle from "../../components/ViewToggle";
import SearchFilter from "../../components/SearchFilter";
import {
  FaTrash,
  FaPlus,
  FaClock,
  FaStar,
  FaSpinner,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaList,
  FaTable,
} from "react-icons/fa";
import { formatTimeToIST, formatDateToIST } from "../../utils";
import { isMobile } from "react-device-detect";

const QuizPage = () => {
  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [totalMarks, setTotalMarks] = useState(5);
  const [timeLimit, setTimeLimit] = useState(2);
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [requiredLevel, setRequiredLevel] = useState(1);
  const [recommendedLevel, setRecommendedLevel] = useState(1);
  const [levelRangeMin, setLevelRangeMin] = useState(1);
  const [levelRangeMax, setLevelRangeMax] = useState(10);
  const [tags, setTags] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // List states
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState(isMobile ? "list" : "table");
  const [filters, setFilters] = useState({
    difficulty: "",
    category: "",
    isActive: "",
  });

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchQuizzes = async (page = 1, search = "", filterParams = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: itemsPerPage,
        ...(search && { search }),
        ...filterParams,
      };
      const response = await API.getAdminQuizzes(params);
      setQuizzes(response.quizzes || response);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.getAdminCategories();
      setCategories(response.categories || response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoadingSubcategories(true);
      const response = await API.getAdminSubcategories();
      setSubcategories(response.subcategories || response);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories");
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const fetchSubcategoriesByCategory = async (categoryId) => {
    if (!categoryId) {
      setFilteredSubcategories([]);
      return;
    }

    try {
      setLoadingSubcategories(true);
      const response = await API.getSubcategories(categoryId);
      setFilteredSubcategories(response.subcategories || response || []);
    } catch (error) {
      console.error("Error fetching subcategories by category:", error);
      toast.error("Failed to fetch subcategories for selected category");
      setFilteredSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchQuizzes(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, itemsPerPage, filters]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    setSubcategory(""); // Clear subcategory when category changes
    fetchSubcategoriesByCategory(categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Quiz title is required");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!subcategory) {
      toast.error("Please select a subcategory");
      return;
    }
    if (!totalMarks || totalMarks <= 0) {
      toast.error("Total marks must be greater than 0");
      return;
    }
    if (!timeLimit || timeLimit <= 0) {
      toast.error("Time limit must be greater than 0");
      return;
    }
    if (parseInt(levelRangeMin) > parseInt(levelRangeMax)) {
      toast.error("Minimum level cannot be greater than maximum level");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      category,
      subcategory,
      totalMarks: parseInt(totalMarks),
      timeLimit: parseInt(timeLimit),
      description: description.trim(),
      difficulty,
      requiredLevel: parseInt(requiredLevel),
      recommendedLevel: parseInt(recommendedLevel),
      levelRange: {
        min: parseInt(levelRangeMin),
        max: parseInt(levelRangeMax),
      },
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      isActive: true,
    };

    try {
      await API.createQuiz(payload);
      toast.success("Quiz created successfully!");
      resetForm();
      setShowForm(false);
      fetchQuizzes(currentPage, searchTerm, filters);
    } catch (err) {
      toast.error(err.message || "Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setSubcategory("");
    setTotalMarks("");
    setTimeLimit("");
    setDescription("");
    setDifficulty("beginner");
    setRequiredLevel(1);
    setRecommendedLevel(1);
    setLevelRangeMin(1);
    setLevelRangeMax(10);
    setTags("");
    setFilteredSubcategories([]);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ difficulty: "", category: "", isActive: "" });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await API.deleteQuiz(id);
        toast.success("Quiz deleted successfully!");
        fetchQuizzes(currentPage, searchTerm, filters);
      } catch (error) {
        console.error("Error deleting quiz:", error);
        toast.error("Failed to delete quiz");
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filterOptions = {
    difficulty: {
      label: "Difficulty",
      options: [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
        { value: "expert", label: "Expert" },
      ],
    },
    category: {
      label: "Category",
      options: categories.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
    },
    isActive: {
      label: "Status",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
  };

  // Table View Component
  const TableView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-[1000px] md:w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quiz
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {quizzes.map((quiz) => (
              <tr
                key={quiz._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">
                      {quiz.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {quiz.description?.substring(0, 50)}...
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {quiz.category?.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {quiz.subcategory?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {quiz.questionCount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {quiz.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    Level {quiz.requiredLevel}-{quiz.recommendedLevel}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {quiz.totalMarks} marks
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {quiz.timeLimit} min
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {formatDateToIST(quiz.createdAt)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {formatTimeToIST(quiz.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-6">
      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
                {quiz.title}
              </h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                  quiz.difficulty
                )}`}
              >
                {quiz.difficulty}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3">
              {quiz.description || "No description available"}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3">
              Qustions: <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {quiz.questionCount}
                  </span>
            </p>
            <div className="space-y-2 mb-2">
              <div className="flex items-center font-semibold text-sm text-gray-600 dark:text-gray-300">
                {quiz.category?.name} / {quiz.subcategory?.name}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <FaStar className="w-4 h-4 mr-2" />
                Level {quiz.requiredLevel}-{quiz.recommendedLevel}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <FaClock className="w-4 h-4 mr-2" />
                {quiz.totalMarks} marks • {quiz.timeLimit} min
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateToIST(quiz.createdAt)} at{" "}
                {formatTimeToIST(quiz.createdAt)}
              </div>
              <button
                onClick={() => handleDelete(quiz._id)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between">
              <div className="flex-none md:flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
                    {quiz.title}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {quiz.description || "No description available"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3">
                  Qustions: <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {quiz.questionCount}
                  </span>
                </p>
                <div className="space-y-2 mb-2">
                  <div className="flex items-center font-semibold text-sm text-gray-600 dark:text-gray-300">
                    {quiz.category?.name} / {quiz.subcategory?.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FaStar className="w-4 h-4 mr-2" />
                    Level {quiz.requiredLevel}-{quiz.recommendedLevel}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FaClock className="w-4 h-4 mr-2" />
                    {quiz.totalMarks} marks • {quiz.timeLimit} min
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Created: {formatDateToIST(quiz.createdAt)} at{" "}
                  {formatTimeToIST(quiz.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`adminPanel ${isOpen ? "showPanel" : "hidePanel"}`}>
      {user?.role === "admin" && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Level-Based Quizzes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create, edit, and manage quizzes with level-based progression
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Quiz
            </button>
          </div>

          {/* Search and Filters */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterOptions={filterOptions}
            placeholder="Search quizzes by title, description, or tags..."
          />

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Show:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Quiz
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold border-b pb-2 text-gray-800 dark:text-white">
                      Basic Information
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quiz Title *
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quiz title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quiz description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Example: javascript, react, frontend
                      </p>
                    </div>
                  </div>

                  {/* Category & Timing */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold border-b pb-2 text-gray-800 dark:text-white">
                      Category & Timing
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category *
                      </label>
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subcategory *
                      </label>
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        required
                        disabled={!category || loadingSubcategories}
                      >
                        <option value="">
                          {!category
                            ? "Select Category First"
                            : loadingSubcategories
                            ? "Loading Subcategories..."
                            : "Select Subcategory"}
                        </option>
                        {filteredSubcategories.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      {loadingSubcategories && (
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-1">
                          <FaSpinner className="animate-spin mr-2" />
                          Loading subcategories...
                        </div>
                      )}

                      {category &&
                        !loadingSubcategories &&
                        filteredSubcategories.length === 0 && (
                          <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                            No subcategories found for this category
                          </div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total Marks *
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter total marks"
                        type="number"
                        min="1"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Time Limit (minutes) *
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter time limit"
                        type="number"
                        min="1"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Level Settings */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold border-b pb-2 text-gray-800 dark:text-white">
                      Level Settings
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Difficulty *
                      </label>
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Required Level *
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Required level"
                        type="number"
                        min="1"
                        max="10"
                        value={requiredLevel}
                        onChange={(e) => setRequiredLevel(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recommended Level *
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Recommended level"
                        type="number"
                        min="1"
                        max="10"
                        value={recommendedLevel}
                        onChange={(e) => setRecommendedLevel(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Level Range *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Min Level"
                          type="number"
                          min="1"
                          max="10"
                          value={levelRangeMin}
                          onChange={(e) => setLevelRangeMin(e.target.value)}
                          required
                        />
                        <input
                          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Max Level"
                          type="number"
                          min="1"
                          max="10"
                          value={levelRangeMax}
                          onChange={(e) => setLevelRangeMax(e.target.value)}
                          required
                        />
                      </div>
                      {parseInt(levelRangeMin) > parseInt(levelRangeMax) && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Min level cannot be greater than max level
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-md transition-colors flex items-center ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting && (
                      <FaSpinner className="animate-spin mr-2" />
                    )}
                    {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                📝
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No quizzes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first quiz."}
              </p>
            </div>
          ) : (
            <>
              {viewMode === "table" && <TableView />}
              {viewMode === "card" && <CardView />}
              {viewMode === "list" && <ListView />}
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.total}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
