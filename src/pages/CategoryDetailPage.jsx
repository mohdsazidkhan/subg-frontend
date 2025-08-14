import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaStar, FaLayerGroup, FaFolder, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import API from '../utils/api';
import QuizStartModal from '../components/QuizStartModal';

const PAGE_SIZE = 9;

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  console.log(quizzes, 'quizzes');
  useEffect(() => {
    fetchCategory();
    fetchSubcategories();
    fetchQuizzes(page);
    // eslint-disable-next-line
  }, [categoryId, page]);

  const fetchCategory = async () => {
    try {
      // Use homeData or fetch from API if needed
      const categories = await API.getCategories();
      const found = categories.find(cat => cat._id === categoryId);
      setCategory(found || null);
    } catch {
      setCategory(null);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setSubcategoriesLoading(true);
      const res = await API.getSubcategories(categoryId);
      setSubcategories(res || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  const fetchQuizzes = async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.request(`/api/student/quizzes/level-based?category=${categoryId}&page=${pageNum}&limit=${PAGE_SIZE}`);
      if (res.success) {
        setQuizzes(res.data);
        setTotalPages(res.pagination.totalPages);
      } else {
        setError('Failed to load quizzes');
      }
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quizId) => {
    const quiz = quizzes.find(q => q._id === quizId);
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleConfirmQuizStart = () => {
    setShowQuizModal(false);
    if (selectedQuiz) {
      navigate(`/attempt-quiz/${selectedQuiz._id}`, { state: { quizData: selectedQuiz, fromPage: "category" } });
    }
  };

  const handleCancelQuizStart = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/subcategory/${subcategoryId}`);
  };

  return (
  <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
      {/* Hero Section with Category Name and Description */}
      {category && (
  <div className="bg-gradient-to-r from-green-800 via-yellow-800 to-red-800 text-white py-12 sm:py-16 px-4 sm:px-6 shadow-2xl">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-sm font-semibold">Explore Quizzes</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-sm font-semibold">Learn & Grow</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 sm:py-10">

        {/* Subcategories Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
              <FaFolder className="text-green-500" />
              Subcategories ({subcategories?.length})
            </h2>
            <button
                onClick={() => navigate("/")}
                className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-2xl hover:from-yellow-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Go Back</span>
              </button>
          </div>

          {subcategoriesLoading ? (
            <div className="flex justify-center items-center h-20 sm:h-32">
              <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-green-600"></div>
            </div>
          ) : subcategories.length === 0 ? (
            <div className="text-center text-gray-500 font-medium py-6 sm:py-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              No subcategories found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {subcategories.map((subcategory) => (
                <div 
                  key={subcategory._id} 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-t-4 border-green-400 hover:border-yellow-500 cursor-pointer group"
                  onClick={() => handleSubcategoryClick(subcategory._id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
                      <FaFolder className="text-white text-xl" />
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {subcategory.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-200">
                    <span>Explore quizzes</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Browse
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quizzes Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
              <FaStar className="text-yellow-500" />
              Quizzes ({quizzes.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32 sm:h-64">
              <div className="animate-spin rounded-full h-8 sm:h-16 w-8 sm:w-16 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold py-6 sm:py-10 text-sm sm:text-base">{error}</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center text-gray-500 font-medium py-6 sm:py-10 bg-white/50 dark:bg-gray-800/50 rounded-2xl text-sm sm:text-base">
              No quizzes found for this category.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-t-4 border-green-400 hover:border-yellow-500 cursor-pointer flex flex-col justify-between">
                    <div>
                      <h2 className="text-md md:text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        {quiz.title} {quiz.isRecommended && <FaStar className="text-yellow-400" />}
                      </h2>
                      {quiz.description && <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{quiz.description}</p>}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1"><FaClock /> {quiz.timeLimit || 30} min</span>
                        <span className="flex items-center gap-1"><FaQuestionCircle /> {quiz.totalMarks || 'Variable'} Qs</span>
                        <span className="flex items-center gap-1"><FaLayerGroup /> Level {quiz.requiredLevel}</span>
                        {quiz.difficulty && <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">{quiz.difficulty}</span>}
                      </div>
                    </div>
                    {quiz.attemptStatus?.hasAttempted ? (
                      <button
                        className="mt-4 w-full bg-gradient-to-r from-gray-500 to-yellow-500 hover:from-yellow-500 hover:to-gray-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md"
                        onClick={() => navigate('/quiz-result', { state: { quizId: quiz._id } })}
                      >
                        View Result
                      </button>
                    ) : (
                      <button
                        className="mt-4 w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-yellow-500 hover:to-green-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md"
                        onClick={() => handleQuizClick(quiz._id)}
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {/* Pagination - Responsive */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-2 sm:mt-4 w-full">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50 text-xs sm:text-base"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-base ${page === idx + 1 ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50 text-xs sm:text-base"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quiz Start Confirmation Modal */}
      <QuizStartModal
        isOpen={showQuizModal}
        onClose={handleCancelQuizStart}
        onConfirm={handleConfirmQuizStart}
        quiz={selectedQuiz}
      />
    </div>
  );
};

export default CategoryDetailPage; 