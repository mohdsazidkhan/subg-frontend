import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { requireSubscription } from '../utils/subscriptionUtils';
import SubscriptionGuard from '../components/SubscriptionGuard';
import MobileAppWrapper from '../components/MobileAppWrapper';
import { 
  FaClock, 
  FaArrowLeft, 
  FaArrowRight, 
  FaBrain, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTrophy, 
  FaStar, 
  FaRocket, 
  FaChartLine,
  FaCrown,
  FaCheck,
  FaTimes,
  FaQuestionCircle,
  FaBookOpen,
  FaGraduationCap,
  FaExpand,
  FaCompress,
  FaExclamationTriangle,
  FaHome
} from 'react-icons/fa';

const LeaderboardTable = ({ leaderboard, currentUser }) => {
  if (!leaderboard || leaderboard?.length === 0) {
    return (
      <div className="text-center py-0 md:py-2 lg:py-4 xl:py-6 mb-4">
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20 rounded-2xl p-2 md:p-8 border border-yellow-200 dark:border-red-700">
          <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Leaderboard Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to complete this quiz and claim the top spot!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <FaTrophy className="text-white text-xl" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Leaderboard</h3>
      </div>
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem]">
            <thead className="bg-gradient-to-r from-yellow-500 to-red-500">
              <tr>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-center">Rank</th>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-left">Student</th>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-center">Score</th>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-center">Attempted At</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard?.map(({ rank, studentName, studentId, score, attemptedAt }, index) => {
                const isCurrentUser = studentId === currentUser?.id;
                const isTopThree = rank <= 3;
                
                return (
                  <tr
                    key={rank}
                    className={`transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      isCurrentUser ? 'bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/30 dark:to-red-900/30 border-l-4 border-yellow-500' : ''
                    }`}
                  >
                    <td className="py-2 md:py-4 px-2 md:px-6 text-center">
                      <div className="flex items-center justify-center">
                        {isTopThree ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            'bg-gradient-to-r from-amber-600 to-yellow-600'
                          }`}>
                            {rank === 1 ? <FaCrown className="text-sm" /> : rank}
                          </div>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-2 md:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {studentName?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">
                            {studentName || 'Anonymous'}
                          </div>
                          {isCurrentUser && (
                            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              You
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-2 md:px-6 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          {score || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-2 md:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      {(() => {
                        try {
                          const date = new Date(attemptedAt);
                          if (isNaN(date.getTime())) {
                            return 'N/A';
                          }
                          return date.toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } catch (error) {
                          return 'N/A';
                        }
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AttemptQuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hasSubscription, setHasSubscription] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  //const [selectedOption, setSelectedOption] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state?.quizData;
  const [loading, setLoading] = useState(true);
  console.log(quizData, 'quizData');
  // Fullscreen functions
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      } else {
        toast.warning('Fullscreen mode is not supported in your browser. You can still take the quiz normally.');
        return;
      }
      setIsFullscreen(true);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      toast.error('Could not enter fullscreen mode. You can still take the quiz normally.');
    }
  };

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, []);

  const handleFullscreenChange = useCallback(() => {
    const isFullscreenNow = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    setIsFullscreen(isFullscreenNow);
    
    // If user exited fullscreen during quiz (not submitted), show confirmation
    // Only show confirmation if not on the last question
    if (!isFullscreenNow && !submitted && quiz && !showExitConfirm && currentQuestionIndex < quiz.questions.length - 1) {
      setShowExitConfirm(true);
    }
  }, [submitted, quiz, showExitConfirm, currentQuestionIndex]);

  const handleExitConfirm = (confirmed) => {
    setShowExitConfirm(false);
    if (confirmed) {
      // User confirmed exit - submit quiz and navigate
      handleSubmit();
    } else {
      // User cancelled - re-enter fullscreen
      enterFullscreen();
    }
  };

  const handleFullscreenButtonClick = () => {
    if (isFullscreen) {
      // If trying to exit fullscreen before last question, show confirmation
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setShowExitConfirm(true);
      } else {
        // On last question, allow exit without confirmation
        exitFullscreen();
      }
    } else {
      // Entering fullscreen - no confirmation needed
      enterFullscreen();
    }
  };

  // Fullscreen event listeners
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Keyboard event listener for F11
    const handleKeyDown = (event) => {
      if (event.key === 'F11' && !submitted && quiz) {
        event.preventDefault();
        if (isFullscreen) {
          // If trying to exit fullscreen before last question, show confirmation
          if (currentQuestionIndex < quiz.questions.length - 1) {
            setShowExitConfirm(true);
          } else {
            // On last question, allow exit without confirmation
            exitFullscreen();
          }
        } else {
          enterFullscreen();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted, quiz, isFullscreen, currentQuestionIndex, handleFullscreenChange, exitFullscreen]);

  // Enter fullscreen when quiz starts
  useEffect(() => {
    if (quiz && !submitted && !loading) {
      // Check if fullscreen is supported
      const isFullscreenSupported = !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled
      );
      
      if (isFullscreenSupported) {
        enterFullscreen();
      } else {
        toast.info('Fullscreen mode is not supported in your browser. You can still take the quiz normally.');
      }
    }
  }, [quiz, submitted, loading]);

  // Browser back button prevention
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!submitted && quiz) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
        return 'Are you sure you want to leave? Your quiz progress will be lost.';
      }
    };

    const handlePopState = (event) => {
      if (!submitted && quiz) {
        event.preventDefault();
        setShowExitConfirm(true);
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Push current state to history
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [submitted, quiz]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsTimerRunning(false);
      // Set submitted to true before exiting fullscreen to prevent exit confirmation
      setSubmitted(true);
      
      // Exit fullscreen when submitting
      if (isFullscreen) {
        await exitFullscreen();
      }
      
      const actualQuizId = quizData?._id || quizId;
      const res = await API.submitQuiz(actualQuizId, answers);
      setResult(res);
      
      if (res.scorePercentage >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      try {
        const leaderboardRes = await API.getQuizLeaderboard(actualQuizId);
        setLeaderboard(leaderboardRes.leaderboard || []);
      } catch (leaderboardError) {
        console.log('Leaderboard not available:', leaderboardError);
        setLeaderboard([]);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(error.response?.data?.message || 'Error submitting quiz');
      // Reset submitted state if there's an error
      setSubmitted(false);
    }
  }, [quizData, quizId, answers, isFullscreen, exitFullscreen]);

  const handleSkipQuestion = useCallback(() => {
    const updated = [...answers];
    updated[currentQuestionIndex] = 'SKIP';
    setAnswers(updated);
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentQuestionIndex, quiz?.questions?.length, answers, handleSubmit]);


  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSkipQuestion();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, handleSkipQuestion]);

  // Start timer when question changes
  useEffect(() => {
    if (quiz && quiz.questions && quiz.questions[currentQuestionIndex]) {
      const question = quiz.questions[currentQuestionIndex];
      const questionTime = question.timeLimit || 30;
      setTimeLeft(questionTime);
      setIsTimerRunning(true);
      //setSelectedOption(null);
    }
  }, [currentQuestionIndex, quiz]);

  // Subscription check
  useEffect(() => {
    if (!requireSubscription(navigate, '/subscription')) {
      setHasSubscription(false);
    } else {
      setHasSubscription(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const actualQuizId = quizData?._id || quizId;
        const quizRes = await API.getQuizById(actualQuizId);
        setQuiz(quizRes);
        setTimeLeft(quizRes.timeLimit || 30);
        
        // Initialize answers array
        setAnswers(new Array(quizRes.questions.length).fill(null));

        // Load quiz-specific leaderboard
        try {
          const leaderboardRes = await API.getQuizLeaderboard(actualQuizId);
          setLeaderboard(leaderboardRes.leaderboard || []);
        } catch (leaderboardError) {
          console.log('Leaderboard not available:', leaderboardError);
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Error loading quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, quizData]);

  const handleSelect = (option) => {
    //setSelectedOption(option);
    const updated = [...answers];
    updated[currentQuestionIndex] = option;
    setAnswers(updated);
  };

  

  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  console.log(location.state?.fromPage, 'location.state?.fromPage');
  const handleBack = () => {
    if(location.state?.fromPage === "category"){
      navigate(`/${location.state?.fromPage}/${quizData?.category?._id}`)
    }else if(location.state?.fromPage === "subcategory"){
      navigate(`/${location.state?.fromPage}/${quizData?.subcategory?._id}`)
    }else if(location.state?.fromPage === "level-quizzes"){
      navigate(`/level-quizzes`)
    }else if(location.state?.fromPage === "level-detail"){
      navigate(`/level/${location.state?.levelNumber}`)
    }else if(location.state?.fromPage === "home"){
      navigate(`/level/${location.state?.levelNumber}`)
    }else if(location.state?.fromPage === "search"){
      navigate(`/search`, {state: {searchQuery: location.state?.searchQuery}})
    }else{
      navigate(`/`)
    }
  }

  // Exit confirmation modal
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 mt-5 md:p-8 max-w-md w-full shadow-2xl border border-red-200 dark:border-red-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-white text-2xl" />
            </div>
            
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Exit Quiz?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to exit fullscreen mode? You're currently on question {currentQuestionIndex + 1} of {quiz.questions.length}. Exiting fullscreen will submit your quiz with current progress.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => handleExitConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-300"
              >
                Continue Quiz
              </button>
              <button
                onClick={() => handleExitConfirm(true)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <SubscriptionGuard 
        message="Premium quizzes require an active subscription to access."
        showUpgradeButton={true}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <MobileAppWrapper title="Quiz">
      <Helmet>
        <title>Attempt Quiz - SUBG QUIZ Challenge Your Knowledge</title>
        <meta name="description" content="Take on SUBG QUIZ challenges and test your knowledge. Answer skill-based questions, compete for high scores, and advance through levels." />
        <meta name="keywords" content="attempt quiz, SUBG QUIZ quiz, quiz challenge, knowledge test, skill-based quiz" />
        <meta property="og:title" content="Attempt Quiz - SUBG QUIZ Challenge Your Knowledge" />
        <meta property="og:description" content="Take on SUBG QUIZ challenges and test your knowledge. Answer skill-based questions, compete for high scores, and advance through levels." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Attempt Quiz - SUBG QUIZ Challenge Your Knowledge" />
        <meta name="twitter:description" content="Take on SUBG QUIZ challenges and test your knowledge. Answer skill-based questions, compete for high scores, and advance through levels." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Fullscreen Warning Banner */}
      {isFullscreen && !submitted && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-2 z-40 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <FaExclamationTriangle className="text-sm" />
            <span className="text-sm font-medium">
              ⚠️ Please stay in fullscreen mode during the quiz. Press F11 or click the button to exit fullscreen.
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto p-2">
        {quiz.questions.length === 0 && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-2 text-red-700 dark:text-red-300 text-center">
            <FaTimesCircle className="text-2xl mx-auto mb-2" />
            No questions available for this quiz.
          </div>
        )}
        
        {/* Quiz Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-2 mb-4">
          <div className="flex items-center justify-between flex-col md:flex-row mb-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white m-1">{quiz?.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <FaGraduationCap className="text-red-500" />
                  <span>{quiz.questions.length} Questions • {quiz.category?.name || 'General Knowledge'}</span>
                </p>
              </div>
            </div>

            {/* Fullscreen indicator */}
            {!submitted && (
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium ${
                  isFullscreen 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 animate-pulse' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isFullscreen ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                  }`}></div>
                  <span>{isFullscreen ? 'Fullscreen Active' : 'Normal Mode'}</span>
                </div>
                
                <button
                  onClick={handleFullscreenButtonClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-800 hover:to-yellow-800 rounded-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                  title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
                >
                  {isFullscreen ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
                  <span className="text-sm font-medium">
                    {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {submitted ? (
          <>
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      ['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
                    }`}></div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Section */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/30 dark:via-blue-900/30 dark:to-purple-900/30 rounded-3xl p-2 md:p-8 border border-green-200 dark:border-green-700 shadow-2xl">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <FaTrophy className="text-white text-4xl" />
                  </div>
                </div>
                
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  🎉 Quiz Completed!
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/60 dark:bg-gray-700/60 rounded-2xl p-2 md:p-6 border border-white/20">
                    <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {result?.score}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-700/60 rounded-2xl p-2 md:p-6 border border-white/20">
                    <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {result?.scorePercentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-700/60 rounded-2xl p-2 md:p-6 border border-white/20">
                    <div className="text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {result?.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                </div>
                
                {result?.isNewBestScore && (
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200 px-6 py-3 rounded-2xl mb-4 flex items-center justify-center space-x-2">
                    <FaCrown className="text-xl" />
                    <span className="font-semibold">🏆 New Best Score!</span>
                  </div>
                )}
                
                {result?.isHighScore && (
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-800 dark:text-green-200 px-6 py-3 rounded-2xl mb-4 flex items-center justify-center space-x-2">
                    <FaStar className="text-xl" />
                    <span className="font-semibold">⭐ High Score Achievement!</span>
                  </div>
                )}
                
                {result?.levelUpdate && result.levelUpdate.levelIncreased && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 px-6 py-3 rounded-2xl mb-4 flex items-center justify-center space-x-2">
                    <FaRocket className="text-xl" />
                    <span className="font-semibold">🚀 Level Up! You are now Level {result.levelUpdate.newLevel}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quiz Review Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-2 md:p-8 border border-white/20 mb-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FaBrain className="text-white text-2xl" />
                </div>
                <h2 className="text-xl md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                  Quiz Review
                </h2>
              </div>
              
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const correctAnswer = question.options[question.correctAnswerIndex];
                  const isCorrect = userAnswer === correctAnswer;
                  const isSkipped = userAnswer === 'SKIP';
                  return (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-2 md:p-6 border border-gray-200 dark:border-gray-600 shadow-lg">
                      <div className="flex items-start space-x-0 md:space-x-4 mb-6">
                        <div className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center text-white text-lg font-bold shadow-lg ${
                          isSkipped ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                          isCorrect ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                        }`}>
                          {isSkipped ? <FaQuestionCircle /> : isCorrect ? <FaCheck /> : <FaTimes />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            {index + 1}: {question.questionText}
                          </h3>
                          
                          <div className="space-y-3 mb-6">
                            {question.options.map((option, optIndex) => {
                              const isUserChoice = option === userAnswer;
                              const isCorrectOption = option === correctAnswer;
                              const optionLetter = String.fromCharCode(65 + optIndex);
                              
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                    isCorrectOption 
                                      ? 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-600 shadow-lg' 
                                      : isUserChoice && !isCorrectOption
                                      ? 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-600 shadow-lg'
                                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-500 hover:border-purple-300 dark:hover:border-purple-500'
                                  }`}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                      isCorrectOption 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                        : isUserChoice && !isCorrectOption
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                    }`}>
                                      {optionLetter}
                                    </div>
                                    <span className={`font-medium text-lg ${
                                      isCorrectOption 
                                        ? 'text-green-800 dark:text-green-200' 
                                        : isUserChoice && !isCorrectOption
                                        ? 'text-red-800 dark:text-red-200'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {option}
                                    </span>
                                    {isCorrectOption && <FaCheckCircle className="text-green-600 text-xl" />}
                                    {isUserChoice && !isCorrectOption && <FaTimesCircle className="text-red-600 text-xl" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Answer Summary */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-600">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Your Answer:</span>
                                <span className={`font-medium ${
                                  isSkipped ? 'text-gray-500' :
                                  isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {isSkipped ? 'Skipped' : userAnswer || 'Not answered'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Correct Answer:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  {correctAnswer}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Status:</span>
                                <span className={`font-medium ${
                                  isSkipped ? 'text-gray-500' :
                                  isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-2 md:space-x-6 mb-4 md:mb-8">
              <button
                onClick={() => navigate("/home", { state: { refreshHomeData: true } })}
                className="px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaHome />
                <span>Home</span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaChartLine />
                <span>Profile</span>
              </button>
              <button
                onClick={() => handleBack()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Back</span>
              </button>
            </div>
            
            <LeaderboardTable leaderboard={leaderboard} currentUser={currentUser} />
          </>
        ) : (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-yellow-600 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {currentQuestionIndex + 1} / {quiz.questions.length}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-600 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Timer and Controls */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <FaQuestionCircle className="text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg ${
                    timeLeft <= 10 ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                    timeLeft <= 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                    'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  }`}>
                    <FaClock className="text-sm" />
                    <span className="font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl py-4 px-2 border border-white/20 shadow-2xl">
              <div className="flex items-start space-x-4 mb-2">
                <div className="hidden md:flex w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-md md:text-xl font-bold text-gray-800 dark:text-white mb-2 leading-relaxed">
                    {currentQuestion.questionText}
                  </h3>
                  
                  <div className="space-y-4">
                    {currentQuestion.options.map((opt, j) => {
                      const optionLetter = String.fromCharCode(65 + j);
                      const isSelected = answers[currentQuestionIndex] === opt;
                      
                      return (
                        <div
                          key={j}
                          onClick={() => handleSelect(opt)}
                          className={`p-2 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-red-400 dark:border-red-500 shadow-lg'
                              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:shadow-lg'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                              isSelected
                                ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                            }`}>
                              {optionLetter}
                            </div>
                            <span className={`text-lg font-medium transition-colors duration-300 ${
                              isSelected
                                ? 'text-red-800 dark:text-purple-200'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {opt}
                            </span>
                            {isSelected && (
                              <div className="ml-auto">
                                <FaCheck className="text-red-500 text-xl" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center gap-2 md:gap-4">
              {/* Previous Button - Commented Out */}
              {/* <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-2 md:px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaArrowLeft />
                <span className="font-medium">Previous</span>
              </button> */}
              
              <div className="flex space-x-2 md:space-x-4">
                {/* Skip Button - Commented Out */}
                {/* <button
                  onClick={handleSkipQuestion}
                  className="px-2 md:px-4 lg:px-6 py-2 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <FaQuestionCircle />
                  <span className="font-medium">Skip</span>
                </button> */}
                
                <button
                  onClick={handleNextQuestion}
                  disabled={!answers[currentQuestionIndex]}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-2xl hover:from-red-800 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="font-medium">
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                  </span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </MobileAppWrapper>
  );
};

export default AttemptQuizPage;
