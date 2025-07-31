import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaCrown,
  FaStar,
  FaMedal,
  FaRocket,
  FaBrain,
  FaChartLine,
  FaAward,
  FaGem,
  FaBook,
  FaFlask,
  FaLaptopCode,
  FaGlobe,
  FaCalculator,
  FaPalette,
  FaLeaf,
  FaUserGraduate,
  FaLayerGroup,
  FaClock,
  FaQuestionCircle,
  FaUserCircle,
} from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import API from "../utils/api";
import { hasActiveSubscription } from "../utils/subscriptionUtils";
import QuizStartModal from "../components/QuizStartModal";
// Level badge icon mapping

// Icon mapping for categories
const categoryIcons = {
  Science: FaFlask,
  Technology: FaLaptopCode,
  Geography: FaGlobe,
  Math: FaCalculator,
  Mathematics: FaCalculator,
  IQ: FaBrain,
  Art: FaPalette,
  Nature: FaLeaf,
  Education: FaUserGraduate,
  General: FaBook,
  Default: FaBook,
};

// Level badge icon mapping
const levelBadgeIcons = {
  "Zero Level": FaUserGraduate,
  Rookie: FaStar,
  Explorer: FaRocket,
  Thinker: FaBrain,
  Strategist: FaChartLine,
  Achiever: FaAward,
  Mastermind: FaGem,
  Champion: FaTrophy,
  Prodigy: FaMedal,
  "Quiz Wizard": FaMagic,
  Legend: FaCrown,
  Default: FaStar,
};

// Level play count info for display in All Levels section (with plan/amount/prize)
const levelsInfo = [
  { level: 1, quizzes: 2, plan: "Free", amount: 0, prize: 0 },
  { level: 2, quizzes: 4, plan: "Free", amount: 0, prize: 0 },
  { level: 3, quizzes: 8, plan: "Free", amount: 0, prize: 0 },
  { level: 4, quizzes: 16, plan: "Basic", amount: 99, prize: 0 },
  { level: 5, quizzes: 32, plan: "Basic", amount: 99, prize: 0 },
  { level: 6, quizzes: 64, plan: "Basic", amount: 99, prize: 0 },
  { level: 7, quizzes: 128, plan: "Premium", amount: 499, prize: 0 },
  { level: 8, quizzes: 256, plan: "Premium", amount: 499, prize: 0 },
  { level: 9, quizzes: 512, plan: "Premium", amount: 499, prize: 0 },
  { level: 10, quizzes: 1024, plan: "Pro", amount: 999, prize: 99999 },
];

const HomePage = () => {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [userLevelData, setUserLevelData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  useEffect(() => {
    fetchHomePageData();
    fetchLevels();
    fetchCategories();
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await API.request("/api/levels/all-with-quiz-count");
      if (res.success) {
        setLevels(res.data);
      } else {
        setLevels([]);
      }
    } catch (err) {
      setLevels([]);
    }
  };

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      const res = await API.getHomePageData();
      if (res.success) {
        setHomeData(res.data);
        setUserLevelData(res.userLevel);
      } else {
        console.log("HomePage Data:", res);
        setError(res.message || "Failed to load home page data");
      }
    } catch (err) {
      console.log("HomePage Data:", err);
      // Try to show a more specific error message if available
      let msg = err?.response?.data?.message || err?.message || err?.toString();
      if (msg && msg !== "[object Object]") {
        setError(msg);
      } else {
        setError("Failed to load home page data");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Use the new public API endpoint for categories
      const res = await API.request("/api/public/categories");
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategories([]);
    }
  };

  const handleQuizAttempt = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleConfirmQuizStart = () => {
    setShowQuizModal(false);
    if (selectedQuiz) {
      navigate(`/attempt-quiz/${selectedQuiz._id}`, {
        state: { quizData: selectedQuiz },
      });
    }
  };

  const handleCancelQuizStart = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getLevelColor = (level) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];
    return colors[(level - 1) % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Loading your quiz dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Only block the whole page for generic errors, not subscription errors or 'Not authorized' (allow public homepage)
  if (
    error &&
    !error.toLowerCase().includes("subscription") &&
    error.toLowerCase() !== "not authorized"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-x-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-purple-300/20 rounded-full blur-3xl z-0 animate-pulse-slow" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-300/10 rounded-full blur-3xl z-0 animate-pulse-slow" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tl from-indigo-300/20 to-blue-200/10 rounded-full blur-3xl z-0 animate-pulse-slow" />
      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 pointer-events-none" />
        <div className="relative container mx-auto px-2 sm:px-4 py-10 sm:py-16 flex flex-col items-center">
          <div className="text-center">
            <h1 className="flex-col md:flex-row justify-center md:justify-items-start flex flex-wrap items-center gap-2 text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:text-white">
                Welcome to
              </span>
              <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                SUBG QUIZ!
              </span>
              <span
                className="inline-block"
                style={{
                  color: "initial",
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                }}
              >
                🎯
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-4 sm:mb-8 max-w-3xl mx-auto animate-fade-in delay-100">
              Explore quizzes by{" "}
              <span className="font-bold text-blue-600 dark:text-blue-300">
                level
              </span>
              ,{" "}
              <span className="font-bold text-purple-600 dark:text-purple-300">
                category
              </span>
              , or{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-300">
                subcategory
              </span>
              . <br className="hidden sm:block" />
              Only{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                new quizzes
              </span>{" "}
              you haven't attempted are shown!
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 drop-shadow-lg animate-fade-in">
              Student Unknown's Battle Ground Quiz!
            </h2>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12 mt-12 z-10">
        <div className="w-16 md:w-28 h-16 md:h-28 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
          <FaTrophy className="text-white text-4xl drop-shadow-lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:text-white mb-2 sm:mb-4 drop-shadow-lg">
          Level Progression System
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200 font-medium">
          Journey from{" "}
          <span className="font-bold text-blue-600 dark:text-blue-300">
            Zero Level
          </span>{" "}
          to{" "}
          <span className="font-bold text-purple-600 dark:text-purple-300">
            Legend
          </span>{" "}
          through{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            11 exciting levels
          </span>
        </p>
      </div>

      {/* All Levels and Categories sections are hidden if subscription is required */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 z-10">
        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scholarship Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-3xl shadow-2xl p-2 md:p-8 border border-yellow-200 dark:border-yellow-700 hover:scale-[1.03] hover:shadow-yellow-200/40 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <FaAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                Scholarship & Prizes
              </h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Only the top 1–3 ranked users in Level 10 (
                <span className="font-bold text-orange-600">Legend</span>) win
                scholarships and prizes!
              </p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    ₹99,999
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Maximum Prize Pool
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  Complete a full year of active participation
                </span>{" "}
                to unlock special rewards and bonus prizes!
              </p>
            </div>
          </div>

          {/* Progression Rules */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl shadow-2xl p-2 md:p-8 border border-blue-200 dark:border-blue-700 hover:scale-[1.03] hover:shadow-blue-200/40 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <FaGem className="text-white text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                Progression Rules
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Only quizzes with{" "}
                  <span className="font-bold text-green-600">
                    75% or higher score
                  </span>{" "}
                  count towards level progression
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Achieve high scores consistently to advance through levels
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Focus on quality over quantity - aim for excellence in every
                  quiz!
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Every year, your progress resets to encourage fresh learning
                  and growth
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Complete a full year of active participation to win exciting
                  prizes!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Level-based Quizzes Section */}
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaStar className="text-blue-500" />
              Your Quizzes
            </h2>
            <Link
              to="/level-quizzes"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
            >
              <FaLayerGroup className="text-lg" />
              View All
            </Link>
          </div>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-12 max-w-4xl">
            Discover quizzes tailored to your current level and challenge
            yourself with new questions
          </p>

          {/* Quiz Section: Show login required if not logged in, else show quizzes or subscription message */}
          {!isLoggedIn ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-0 md:p-8 border border-white/20 flex flex-col items-center justify-center animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-blue-600 text-3xl mb-2">🔒</div>
                <p className="text-blue-600 text-lg font-semibold mb-4">
                  Login to view your quizzes
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          ) : !hasActiveSubscription() ||
            (error && error.toLowerCase().includes("subscription")) ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-0 md:p-8 border border-white/20 flex flex-col items-center justify-center animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-red-600 text-3xl mb-2">⚠️</div>
                <p className="text-red-600 text-lg font-semibold mb-4">
                  {error && error.toLowerCase().includes("subscription")
                    ? error
                    : "Access to quizzes requires an active subscription."}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Subscribe now to unlock all quizzes and levels!
                </p>
                <Link
                  to="/subscription"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-0 border border-white/20 animate-fade-in">
              {homeData?.quizzesByLevel?.length > 0 ? (
                (() => {
                  // Find the user's current level quizzes
                  // Use userLevel.currentLevel (object) for correct quiz filtering, like /level-quizzes
                  const userLevelObj = userLevelData;
                  let currentLevelData = null;
                  if (userLevelObj && userLevelObj.currentLevel) {
                    currentLevelData = homeData.quizzesByLevel.find(
                      (lvl) => lvl.level === userLevelObj.currentLevel
                    );
                  }
                  if (!currentLevelData) {
                    currentLevelData = homeData.quizzesByLevel[0];
                  }
                  if (!currentLevelData) return null;
                  return (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-2 md:p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full ${getLevelColor(
                              currentLevelData.level
                            )} flex items-center justify-center text-white font-bold text-lg`}
                          >
                            {currentLevelData.level}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                              Level {currentLevelData.level} (
                              {currentLevelData.quizCount})
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentLevelData.quizzes.slice(0, 6).map((quiz) => (
                          <div
                            key={quiz._id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                {quiz.title}
                              </h4>
                              {quiz.isRecommended && (
                                <FaStar className="text-yellow-500 text-sm" />
                              )}
                            </div>
                            {quiz.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-2">
                                {quiz.description}
                              </p>
                            )}
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <FaClock className="text-xs" />
                                <span>{quiz.timeLimit || 30} min</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <FaQuestionCircle className="text-xs" />
                                <span>
                                  {quiz.totalMarks || "Variable"} questions
                                </span>
                              </div>
                              {quiz.difficulty && (
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                    quiz.difficulty
                                  )}`}
                                >
                                  {quiz.difficulty}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleQuizAttempt(quiz)}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base"
                            >
                              Start Quiz
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12">
                  <FaQuestionCircle className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    No new quizzes available for your level.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    You've attempted all available quizzes for your current
                    level!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
          <FaLayerGroup className="text-blue-500" /> All Levels
        </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-12 max-w-3xl">
          Browse all available levels and their quizzes
        </p>
        {levels && levels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {levels
              .filter((level) => level.name !== "Zero Level")
              .map((level, i) => {
                const Icon =
                  levelBadgeIcons[level.name] || levelBadgeIcons.Default;
                const levelInfo = levelsInfo.find(
                  (info) => info.level === level.level
                );
                const playCount = levelInfo ? levelInfo.quizzes : 0;
                const cardBg = `bg-gradient-to-t from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/20`;
                return (
                  <div
                    key={level.level}
                    className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-blue-500 group flex flex-col h-full ${cardBg}`}
                  >
                    <div className="flex items-center justify-center mt-6">
                      <div
                        className={`p-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500`}
                      >
                        <Icon className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 text-center">
                          {level.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-2">
                          {level.desc || ""}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center shadow-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {level.quizCount}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Quizzes
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center shadow-lg">
                            <div className="text-lg font-bold text-green-600">
                              {level.plan
                                ? level.plan
                                : levelInfo && levelInfo.plan
                                ? levelInfo.plan
                                : "-"}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Plan
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center shadow-lg">
                            <div className="text-lg font-bold text-purple-600">
                              ₹
                              {level.amount ||
                                (levelInfo && levelInfo.amount) ||
                                0}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Amount
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center shadow-lg">
                            <div className="text-lg font-bold text-yellow-600">
                              ₹
                              {level.prize ||
                                (levelInfo && levelInfo.prize) ||
                                0}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Prize
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-900 dark:text-white text-center mb-2 drop-shadow-sm">
                          Need {playCount} plays to master
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Link
                          to={`/level/${level.level}`}
                          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base"
                        >
                          View Quizzes
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaLayerGroup className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No levels found.
            </p>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
          <FaBook className="text-blue-500" /> Categories
        </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-12 max-w-3xl">
          Explore quizzes by category and find your perfect learning path
        </p>
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {categories.map((category, idx) => {
              const Icon =
                categoryIcons[category.name] || categoryIcons.Default;
              const cardBg = `bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-800/20 dark:to-gray-900/50`;
              return (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className={`group relative ${cardBg} backdrop-blur-sm rounded-2xl shadow-xl border transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-gray-300 dark:border-blue-400 p-6 hover:shadow-purple-200/40`}
                  tabIndex={0}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white dark:text-yellow-200 text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                  </div>
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {category.name}
                    </h3>
                    <div className="mt-4 flex justify-center">
                      <Link
                        to={`/category/${category._id}`}
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base"
                      >
                        View Quizzes
                      </Link>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No categories found.
            </p>
          </div>
        )}
      </div>

      {/* Quiz Start Confirmation Modal */}
      <QuizStartModal
        isOpen={showQuizModal}
        onClose={handleCancelQuizStart}
        onConfirm={handleConfirmQuizStart}
        quiz={selectedQuiz}
      />

      {/* Platform Stats Section */}
      <div className="container mx-auto px-2 sm:px-4 py-8 z-10">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-blue-900/30 rounded-3xl shadow-2xl p-6 md:p-10 border border-blue-200 dark:border-blue-700 flex flex-col items-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:text-white mb-6 flex items-center gap-2 drop-shadow-lg">
            Platform Stats
          </h2>
          <div className="absolute -top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-300/30 to-purple-300/20 rounded-full blur-2xl z-0 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-indigo-300/20 to-blue-200/10 rounded-full blur-2xl z-0 animate-pulse-slow" />
          <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-6 w-full max-w-3xl z-10">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaBook className="text-white text-3xl animate-bounce-slow" />
              </div>
              <div className="text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                10+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Categories
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaLayerGroup className="text-white text-3xl animate-spin-slow" />
              </div>
              <div className="text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                100+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Subcategories
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaStar className="text-white text-3xl animate-pulse-slow" />
              </div>
              <div className="text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                4K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Quizzes
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaQuestionCircle className="text-white text-3xl animate-wiggle" />
              </div>
              <div className="text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                20K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Questions
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-green-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaUserCircle className="text-white text-3xl animate-float" />
              </div>
              <div className="text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                1K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Students
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
