import { useEffect, useState, useCallback } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { Helmet } from "react-helmet";
import API from "../utils/api";
import QuizStartModal from "../components/QuizStartModal";
import MobileAppWrapper from "../components/MobileAppWrapper";
import useDebounce from "../utils/useDebounce";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const limit = 12;
  const debouncedQuery = useDebounce(query, 500); // 500ms delay for search

  const fetchData = useCallback(async (searchQuery = debouncedQuery) => {
    const trimmedQuery = searchQuery?.trim();
    try {
      setLoading(true);
      const res = await API.searchAll({
        query: trimmedQuery,
        page: currentPage,
        limit,
      });
      if (res.success) {
        setQuizzes(res.quizzes);
        setCategories(res.categories);
        setSubcategories(res.subcategories);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, currentPage, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  // Effect for debounced search
  useEffect(() => {
    if (debouncedQuery !== "") {
      fetchData();
    }
  }, [debouncedQuery, currentPage, fetchData]);

  // Effect for initial search from navigation
  useEffect(() => {
    if (location.state?.searchQuery) {
      setQuery(location.state.searchQuery);
    }
  }, [location.state?.searchQuery]);

  const handleQuizAttempt = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleCancelQuizStart = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const handleConfirmQuizStart = () => {
    setShowQuizModal(false);
    if (selectedQuiz) {
      navigate(`/attempt-quiz/${selectedQuiz._id}`, {
        state: { quizData: selectedQuiz, fromPage: "search", searchQuery: query},
      });
    }
  };

  return (
    <MobileAppWrapper title="Search">
      <Helmet>
        <title>Search Quizzes - SUBG QUIZ Find Your Perfect Quiz</title>
        <meta name="description" content="Search and discover quizzes on SUBG QUIZ platform. Find quizzes by category, subcategory, or keywords. Explore thousands of skill-based quiz questions." />
        <meta name="keywords" content="search quizzes, quiz search, SUBG QUIZ search, find quiz, quiz discovery" />
        <meta property="og:title" content="Search Quizzes - SUBG QUIZ Find Your Perfect Quiz" />
        <meta property="og:description" content="Search and discover quizzes on SUBG QUIZ platform. Find quizzes by category, subcategory, or keywords. Explore thousands of skill-based quiz questions." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Search Quizzes - SUBG QUIZ Find Your Perfect Quiz" />
        <meta name="twitter:description" content="Search and discover quizzes on SUBG QUIZ platform. Find quizzes by category, subcategory, or keywords. Explore thousands of skill-based quiz questions." />
      </Helmet>
      <div className="px-8 py-4 container mx-auto"> 
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
        <input
          type="text"
          className="p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded w-full"
          placeholder="Search quizzes, categories, subcategories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-4 py-2 rounded shadow hover:opacity-90"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      ) : (
        <>
          {/* Categories */}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Categories
            </h2>
            {categories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No category found.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={()=>navigate(`/category/${cat?._id}`)}
                    className="border cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {cat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subcategories */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Subcategories
            </h2>
            {subcategories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No subcategory found.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subcategories.map((sub) => (
                  <div
                    key={sub._id}
                    onClick={()=>navigate(`/subcategory/${sub?._id}`)}
                    className="border cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {sub.name}
                    </h3>
                    {sub.description && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {sub.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quizzes */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Quizzes
            </h2>
            {quizzes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No quizzes found.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-3 xxl:grid-cols-4 gap-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Category:{" "}
                      <span className="font-medium">
                        {quiz.category?.name || "N/A"}
                      </span>{" "}
                      | Subcategory:{" "}
                      <span className="font-medium">
                        {quiz.subcategory?.name || "N/A"}
                      </span>
                    </p>
                    <button
                      onClick={() => handleQuizAttempt(quiz)}
                      className="mt-2 w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded border text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded text-sm font-medium border ${
                  currentPage === i + 1
                    ? "bg-yellow-600 text-white border-yellow-600"
                    : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded border text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Quiz Start Confirmation Modal */}
          {showQuizModal &&
            <QuizStartModal
              isOpen={showQuizModal}
              onClose={handleCancelQuizStart}
              onConfirm={handleConfirmQuizStart}
              quiz={selectedQuiz}
            />
          }
        </>
      )}
      </div>
    </MobileAppWrapper>
  );
};

export default SearchPage;
