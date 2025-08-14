import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaStar, FaLayerGroup, FaArrowLeft } from 'react-icons/fa';
import API from '../utils/api';
import QuizStartModal from '../components/QuizStartModal';

const PAGE_SIZE = 9;

const SubcategoryDetailPage = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchSubcategory();
    fetchQuizzes(page);
    // eslint-disable-next-line
  }, [subcategoryId, page]);

  const fetchSubcategory = async () => {
    try {
      // Try to get subcategory from homepage data first
      const homeData = JSON.parse(localStorage.getItem('homeData'));
      if (homeData && homeData.subcategories) {
        const found = homeData.subcategories.find(sub => sub._id === subcategoryId);
        if (found) {
          setSubcategory(found);
          return;
        }
      }
      
      // If not found in homeData, try to fetch from API
      // We need to fetch all subcategories since we don't have the categoryId
      const response = await API.request('/api/student/subcategories');
      if (response && response.length > 0) {
        const found = response.find(sub => sub._id === subcategoryId);
        setSubcategory(found || null);
      } else {
        setSubcategory(null);
      }
    } catch (err) {
      console.error('Error fetching subcategory:', err);
      setSubcategory(null);
    }
  };

  const fetchQuizzes = async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.request(`/api/student/quizzes/level-based?subcategory=${subcategoryId}&page=${pageNum}&limit=${PAGE_SIZE}`);
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
      navigate(`/attempt-quiz/${selectedQuiz._id}`, { state: { quizData: selectedQuiz, fromPage: "subcategory" } });
    }
  };

  const handleCancelQuizStart = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  return (
  <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
      {/* Hero Section with Subcategory Name and Description */}
      {subcategory && (
        <div className="bg-gradient-to-r from-yellow-800 via-red-800 to-green-800 text-white py-12 sm:py-16 px-4 sm:px-6 shadow-2xl">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                {subcategory.name}
              </h1>
              {subcategory.category && (
                <p className="text-lg sm:text-xl text-yellow-100 mb-3 max-w-2xl mx-auto">
                  Category: <span className="font-semibold">{subcategory.category.name}</span>
                </p>
              )}
              {subcategory.description && (
                <p className="text-lg sm:text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
                  {subcategory.description}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-sm font-semibold">Take Quizzes</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-sm font-semibold">Test Knowledge</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-900">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-4"></div>
              <div className="text-xl text-gray-700 dark:text-gray-200">Loading quizzes...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold py-10">{error}</div>
        ) : quizzes.length === 0 ? (
          <div className="text-center text-gray-500 font-medium py-10">No quizzes found for this subcategory.</div>
        ) : (
          <>
          <div className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
              <FaQuestionCircle className="text-green-500" />
              Quizzes ({quizzes?.length})
            </h2>
            <button
                onClick={() => navigate(-1)}
                className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-2xl hover:from-yellow-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Go Back</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-t-4 border-yellow-400 hover:border-red-500 cursor-pointer flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
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
                      className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-red-500 hover:to-yellow-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md"
                      onClick={() => handleQuizClick(quiz._id)}
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50">Prev</button>
              {[...Array(totalPages)].map((_, idx) => (
                <button key={idx} onClick={() => setPage(idx + 1)} className={`px-4 py-2 rounded-lg font-semibold ${page === idx + 1 ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>{idx + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
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

export default SubcategoryDetailPage; 