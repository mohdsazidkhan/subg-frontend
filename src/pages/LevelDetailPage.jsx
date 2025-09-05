import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCrown, FaStar, FaMedal, FaRocket, FaBrain, FaChartLine, FaArrowLeft, FaClock, FaQuestionCircle, FaLayerGroup, FaUserGraduate, FaAward, FaTrophy, FaGem, FaMagic } from 'react-icons/fa';
import API from '../utils/api';
import QuizStartModal from '../components/QuizStartModal';
import { MdFormatListNumbered } from 'react-icons/md';
import MonthlyRewardsInfo from '../components/MonthlyRewardsInfo';
import MobileAppWrapper from '../components/MobileAppWrapper';

const levels = [
  { level: 0, name: 'Starter', desc: 'Just registered - Start your journey!', quizzes: 0, plan: 'Free', amount: 0, prize: 0, color: 'from-gray-300 to-gray-400', icon: FaUserGraduate },
  { level: 1, name: 'Rookie', desc: 'Begin your quiz journey', quizzes: 2, plan: 'Free', amount: 0, prize: 0, color: 'from-green-300 to-green-400', icon: FaStar },
  { level: 2, name: 'Explorer', desc: 'Discover new challenges', quizzes: 6, plan: 'Free', amount: 0, prize: 0, color: 'from-blue-300 to-blue-400', icon: FaRocket },
  { level: 3, name: 'Thinker', desc: 'Develop critical thinking', quizzes: 12, plan: 'Free', amount: 0, prize: 0, color: 'from-purple-300 to-purple-400', icon: FaBrain },
  { level: 4, name: 'Strategist', desc: 'Master quiz strategies', quizzes: 20, plan: 'Basic', amount: 9, prize: 0, color: 'from-yellow-300 to-yellow-400', icon: FaChartLine },
  { level: 5, name: 'Achiever', desc: 'Reach new heights', quizzes: 30, plan: 'Basic', amount: 9, prize: 0, color: 'from-orange-300 to-orange-400', icon: FaAward },
  { level: 6, name: 'Mastermind', desc: 'Become a quiz expert', quizzes: 42, plan: 'Basic', amount: 9, prize: 0, color: 'from-red-300 to-red-400', icon: FaGem },
  { level: 7, name: 'Champion', desc: 'Compete with the best', quizzes: 56, plan: 'Premium', amount: 49, prize: 0, color: 'from-pink-300 to-pink-400', icon: FaTrophy },
  { level: 8, name: 'Prodigy', desc: 'Show exceptional talent', quizzes: 72, plan: 'Premium', amount: 49, prize: 0, color: 'from-indigo-300 to-indigo-400', icon: FaMedal },
  { level: 9, name: 'Wizard', desc: 'Complex questions across categories', quizzes: 90, plan: 'Premium', amount: 49, prize: 0, color: 'from-red-400 to-red-500', icon: FaMagic },
  { level: 10, name: 'Legend', desc: 'Ultimate quiz mastery', quizzes: 110, plan: 'Pro', amount: 99, prize: 9999, color: 'from-yellow-400 to-red-500', icon: FaCrown }
];

const LevelDetailPage = () => {
  const { levelNumber } = useParams();
  const navigate = useNavigate();
  // const [levelInfo, setLevelInfo] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [userLevel, setUserLevel] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const level = levels.find(lvl => lvl.level === Number(levelNumber));

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.getLevelBasedQuizzes({ level: levelNumber, page, limit: 9 });
      if (res.success) {
        setQuizzes(res.data);
        setHasMore(res.pagination?.hasNextPage || false);
      } else {
        setError('Failed to load quizzes');
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, [levelNumber, page]);

  // const fetchUserLevel = useCallback(async () => {
  //   try {
  //     const res = await API.getProfile();
  //     if (res.success) {
  //       setUserLevel(res.data);
  //     }
  //   } catch (err) {
  //     console.error('Failed to fetch user level:', err);
  //   }
  // }, []);

  useEffect(() => {
    if (level) {
      // setLevelInfo(level);
      fetchQuizzes();
      // fetchUserLevel();
    }
  }, [level, levelNumber, page, fetchQuizzes]);

  const handleQuizClick = (quizId) => {
    const quiz = quizzes.find(q => q._id === quizId);
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleConfirmQuizStart = () => {
    setShowQuizModal(false);
    if (selectedQuiz) {
      navigate(`/attempt-quiz/${selectedQuiz._id}`, { state: { quizData: selectedQuiz, fromPage : "level-detail", levelNumber } });
    }
  };

  const handleCancelQuizStart = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  if (!level) {
    return (
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">Level Not Found</h1>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MobileAppWrapper title="Level">
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex  items-center justify-start mb-4 gap-2 sm:gap-0">
              <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${level.color} mr-0 sm:mr-4`}>
                <level.icon className="text-white text-xl sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">Level {levelNumber} - {level.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{level.desc}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{level.quizzes}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Quizzes</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{level.plan}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Plan</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">₹{level.amount}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Amount</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">₹{level.prize}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Prize</div>
              </div>
              {/* Rewards Terms for Visibility */}
              <MonthlyRewardsInfo compact={true} />
            </div>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-xl lg:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Level {levelNumber} Quizzes</h2>
           <button
              onClick={() => navigate("/home")}
              className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-2xl hover:from-yellow-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-2 sm:mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading quizzes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">No quizzes available for this level yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-2 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{quiz.title}</h3>
                        
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{quiz.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <div className="flex items-center">
                            <FaQuestionCircle className="mr-1" />
                            <span>{quiz.questionCount || 0} Q's</span>
                          </div>
                          <div className="flex items-center">
                            <FaLayerGroup className="mr-1" />
                            <span>{quiz.category?.name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <MdFormatListNumbered className="mr-1" />
                            <span>{quiz.totalMarks || 'N/A'} Marks</span>
                          </div>
                          <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{quiz.timeLimit} Mins.</span>
                        </div>
                        </div>
                      </div>
                      
                      {quiz.attemptStatus?.hasAttempted ? (
                        <button
                          className="w-full bg-gradient-to-r from-gray-500 to-yellow-500 hover:from-yellow-500 hover:to-gray-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md"
                          onClick={() => navigate('/quiz-result', { state: { quizId: quiz._id } })}
                        >
                          View Result
                        </button>
                      ) : (
                        <button
                          className="w-full bg-gradient-to-r from-yellow-500 to-red-600 hover:from-red-600 hover:to-yellow-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md"
                          onClick={() => handleQuizClick(quiz._id)}
                        >
                          Start Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => setPage(p => p + 1)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
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
    </MobileAppWrapper>
  );
};

export default LevelDetailPage; 